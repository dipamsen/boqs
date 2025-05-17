"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { Attempt } from "@/utils/attempts";
import type { InputJsonValue } from "@prisma/client/runtime/library.js";

export default async function finishAttempt(
  attemptId: string,
  attempt: Attempt
) {
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
      user: {
        select: {
          email: true,
        },
      },
    },
  });

  if (!attemptDB) {
    throw new Error("Attempt not found");
  }

  if (attemptDB.user.email !== userEmail) {
    throw new Error("You are not authorized to finish this attempt");
  }

  attempt.inProgress = false;

  return await prisma.attempt.update({
    where: { id: attemptId },
    data: {
      inProgress: false,
      answers: attempt as unknown as InputJsonValue,
    },
  });
}
