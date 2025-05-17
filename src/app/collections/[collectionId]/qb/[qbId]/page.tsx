import { authOptions } from "@/utils/authOptions";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import AddQuestionModal from "./AddQuestionModal";
import ListQuestions from "./ListQuestions";

type Props = {
  params: Promise<{ collectionId: string; qbId: string }>;
};

export default async function QuestionBank({ params }: Props) {
  const session = await getServerSession(authOptions);

  const { collectionId, qbId } = await params;

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

  const qb = await prisma.questionBank.findUnique({
    where: {
      id: qbId,
      collectionId: collectionId,
    },
    include: {
      questions: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!collection || !qb) return notFound();

  const user = (await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  }))!;

  const isOwnerOfCollection = collection.ownerId === user.id;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Question Bank</h1>

      <h1 className="text-xl font-semibold uppercase">{qb.name}</h1>
      <p className="text-gray-400">{qb.description}</p>
      <p className="text-gray-400 mb-2">{collection.name}</p>

      {isOwnerOfCollection && (
        <div className="flex justify-end mb-4 ">
          <AddQuestionModal
            qbId={qb.id}
            defaultVals={
              qb.questions.length > 0
                ? {
                    chapter: qb.questions[0].chapter,
                    subject: qb.questions[0].subject,
                    grade: qb.questions[0].grade,
                    marks: qb.questions[0].marks,
                  }
                : {
                    chapter: "",
                    subject: "",
                    grade: "",
                    marks: 1,
                  }
            }
          />
        </div>
      )}

      {qb.questions.length > 0 ? (
        <ListQuestions qb={qb} />
      ) : (
        <div className="flex my-4">
          <p className="text-gray-400">No questions found</p>
        </div>
      )}
    </div>
  );
}
