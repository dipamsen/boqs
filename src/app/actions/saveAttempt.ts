"use server";

import { prisma } from "@/lib/prisma";
import { Attempt } from "@/utils/attempts";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { InputJsonValue } from "@prisma/client/runtime/library";

export default async function saveAttempt(attemptId: string, attempt: Attempt) {
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;

  if (!userEmail) {
    throw new Error("User not authenticated");
  }

  const attemptDB = await prisma.attempt.findUnique({
    where: {
      id: attemptId,
    },
    include: {
      user: true,
    },
  });

  if (!attemptDB) {
    throw new Error("Attempt not found");
  }

  if (attemptDB.user.email !== userEmail) {
    throw new Error("You are not authorized to save this attempt");
  }

  return await prisma.attempt.update({
    where: { id: attemptId },
    data: {
      quizId: attempt.quizId,
      userId: attempt.userId,
      answers: attempt as unknown as InputJsonValue,
    },
  });
}
