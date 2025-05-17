"use server";

import { Question } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { Attempt } from "@/utils/attempts";

export default async function createAttempt(quizId: string, userId: string) {
  const questions = await getQuizQuestions(quizId);
  return await prisma.attempt.create({
    data: {
      quizId,
      userId,
      answers: {
        quizId,
        userId,
        inProgress: true,
        answers: questions.map((question) => {
          if (question.type === "MCQ") {
            return {
              questionType: question.type,
              input: null,
              submitted: false,
              timeTaken: null,
            };
          } else if (question.type === "Numerical") {
            return {
              questionType: question.type,
              input: null,
              submitted: false,
              timeTaken: null,
            };
          } else if (question.type === "Subjective") {
            return {
              questionType: question.type,
              submitted: false,
              timeTaken: null,
            };
          }
          throw new Error("Invalid question type");
        }),
      } satisfies Attempt,
    },
  });
}

export async function getQuizQuestions(quizId: string) {
  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
  });

  if (!quiz) {
    throw new Error("Quiz not found");
  }

  const questions = await prisma.question.findMany({
    where: { id: { in: quiz.questionIds } },
  });
  return quiz.questionIds
    .map((id) => questions.find((q) => q.id === id))
    .filter(Boolean) as Question[];
}
