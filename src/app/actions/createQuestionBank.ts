"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";

export async function createQuestionBank(
  formData: FormData,
  collectionId: string
) {
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;

  if (!userEmail) {
    throw new Error("User not authenticated");
  }

  const name = formData.get("name")?.toString() || "";
  const description = formData.get("description")?.toString() || "";

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
      "You are not authorized to create a question bank in this collection"
    );
  }

  const questionBank = await prisma.questionBank.create({
    data: {
      name,
      description,
      collection: {
        connect: { id: collectionId },
      },
    },
  });

  return questionBank;
}
