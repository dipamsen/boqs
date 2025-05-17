import { authOptions } from "@/utils/authOptions";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import CreateQuizModal from "./CreateQuizModal";
import QuizCard from "./QuizCard";
import { Attempt } from "@/utils/attempts";

type Props = {
  params: Promise<{ collectionId: string }>;
};

export default async function QuizzesPage({ params }: Props) {
  const session = await getServerSession(authOptions);
  const { collectionId } = await params;

  if (!session?.user?.email) {
    return <p>You must be logged in to view this page.</p>;
  }

  const user = (await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  }))!;

  const collection = await prisma.collection.findUnique({
    where: {
      id: collectionId,
      OR: [
        {
          ownerId: user.id,
        },
        {
          users: {
            some: {
              id: user.id,
            },
          },
        },
      ],
    },
    include: {
      quizzes: true,
      owner: true,
    },
  });

  const attempts = await prisma.attempt.findMany({
    where: {
      quiz: {
        collectionId: collectionId,
      },
      userId: user.id,
    },
  });

  if (!collection) return notFound();

  const isOwner = collection.ownerId === user.id;

  return (
    <div>
      <h1 className="text-xl font-semibold uppercase">{collection.name}</h1>
      <p className="text-gray-400">{collection.description}</p>
      <p className="text-gray-400 mb-2">{collection.owner.name}</p>

      <h1 className="text-3xl font-bold mb-4">Quizzes</h1>

      <div className="grid grid-cols-1 gap-4">
        {collection.quizzes.map((quiz) => (
          <QuizCard
            quiz={quiz}
            user={user}
            collectionId={collectionId}
            key={quiz.id}
            attempts={attempts
              .filter((attempt) => attempt.quizId === quiz.id)
              .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
              .map((attempt) => ({
                id: attempt.id,
                ...(attempt.answers as unknown as Attempt),
              }))}
          />
        ))}
        {isOwner && <CreateQuizModal collectionId={collection.id} />}
      </div>
    </div>
  );
}
