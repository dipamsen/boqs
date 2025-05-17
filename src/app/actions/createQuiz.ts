"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { prisma } from "@/lib/prisma";

export default async function createQuiz({
  collectionId,
  name,
  description,
}: {
  collectionId: string;
  name: string;
  description: string;
}) {
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;

  if (!userEmail) {
    throw new Error("User not authenticated");
  }

  if (!name) {
    throw new Error("Name is required");
  }

  const collection = await prisma.collection.findUnique({
    where: {
      id: collectionId,
    },
  });

  if (!collection) {
    throw new Error("Collection not found");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: userEmail,
    },
  });

  if (collection.ownerId !== user?.id) {
    throw new Error(
      "You are not authorized to create a quiz in this collection"
    );
  }

  const quiz = await prisma.quiz.create({
    data: {
      name,
      description,
      collection: {
        connect: { id: collectionId },
      },
      createdBy: {
        connect: { id: user.id },
      },
    },
  });

  return quiz;
}
