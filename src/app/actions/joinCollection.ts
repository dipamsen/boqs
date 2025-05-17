"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";

export async function joinCollection(formData: FormData) {
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;

  if (!userEmail) {
    throw new Error("User not authenticated");
  }

  const id = formData.get("id")?.toString() || "";

  if (!id) {
    throw new Error("Collection ID is required");
  }

  const collection = await prisma.collection.update({
    where: { id },
    data: {
      users: {
        connect: {
          email: userEmail,
        },
      },
    },
  });

  return collection;
}
