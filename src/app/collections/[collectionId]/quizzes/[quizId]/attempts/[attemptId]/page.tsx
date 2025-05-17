import { getServerSession } from "next-auth";
import QuizPlayer from "./QuizPlayer";
import { authOptions } from "@/utils/authOptions";
import { prisma } from "@/lib/prisma";
import { getQuizQuestions } from "@/app/actions/createAttempt";
import { Question } from "@/utils/questions";
import { Attempt } from "@/utils/attempts";

type Params = {
  collectionId: string;
  quizId: string;
  attemptId: string;
};

export default async function AttemptPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { collectionId, quizId, attemptId } = await params;

  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return <p>You must be logged in to view this page.</p>;
  }

  const collection = await prisma.collection.findUnique({
    where: {
      id: collectionId,
      users: {
        some: {
          email: session.user.email,
        },
      },
    },
  });

  if (!collection) {
    return <p>You are not authorized to view this page.</p>;
  }

  const quiz = await prisma.quiz.findUnique({
    where: {
      id: quizId,
      collectionId: collectionId,
    },
  });

  if (!quiz) {
    return <p>Quiz not found</p>;
  }

  const questions = await getQuizQuestions(quizId);

  const attempt = await prisma.attempt.findUnique({
    where: {
      id: attemptId,
    },
    include: {
      quiz: true,
      user: true,
    },
  });

  if (!attempt) {
    return <p>Attempt not found</p>;
  }

  if (attempt.quizId !== quizId) {
    return <p>You are not authorized to view this attempt</p>;
  }

  if (attempt.user.email !== session.user.email) {
    return <p>You are not authorized to view this attempt</p>;
  }

  return (
    <QuizPlayer
      questions={quiz.questionIds
        .map((x) => questions.find((q) => q.id === x))
        .filter((q) => q !== undefined)
        .map((q) => ({ ...(q.meta as unknown as Question), id: q.id }))}
      initialAttempt={attempt.answers as unknown as Attempt}
      attemptId={attemptId}
      quiz={quiz}
      collectionId={collectionId}
    />
  );
}
