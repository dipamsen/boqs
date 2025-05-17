import { authOptions } from "@/utils/authOptions";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";

export default async function QuizEdit({
  params,
}: {
  params: Promise<{ collectionId: string; quizId: string }>;
}) {
  const { collectionId, quizId } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return <p>You must be logged in to view this page.</p>;
  }

  const collection = await prisma.collection.findUnique({
    where: {
      id: collectionId,
      OR: [
        {
          owner: {
            email: session.user.email,
          },
        },
        {
          users: {
            some: {
              email: session.user.email,
            },
          },
        },
      ],
    },
    include: {
      owner: {
        select: {
          name: true,
        },
      },
    },
  });

  const quiz = await prisma.quiz.findUnique({
    where: {
      id: quizId,
      collectionId: collectionId,
      createdBy: {
        email: session.user.email,
      },
    },
    include: {
      createdBy: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!collection || !quiz) return notFound();
  const questions = await prisma.question.findMany({
    where: {
      id: {
        in: quiz.questionIds,
      },
    },
  });

  return (
    <div>
      <h1 className="text-xl font-semibold uppercase">{collection.name}</h1>
      <p className="text-gray-400">{collection.description}</p>
      <p className="text-gray-400 mb-2">{collection.owner.name}</p>

      <h1 className="text-3xl font-bold mb-4">Edit Quiz</h1>

      <h1 className="text-xl font-semibold uppercase">{quiz.name}</h1>
      <p className="text-gray-400">{quiz.description}</p>
      <p className="text-gray-400 mb-2">{quiz.createdBy.name}</p>

      {questions.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {questions.map((question) => (
            <div key={question.id} className="p-4 border rounded-md">
              <h2 className="text-xl font-semibold">{question.text}</h2>
              <p className="text-gray-400">{question.answer}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No questions available for this quiz.</p>
      )}
    </div>
  );
}
