"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";

export async function createCollection(formData: FormData) {
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;

  if (!userEmail) {
    throw new Error("User not authenticated");
  }

  const name = formData.get("name")?.toString() || "";
  const description = formData.get("description")?.toString() || "";
  const visibility = formData.get("visibility")?.toString() || "private";
  const shared = visibility === "public";

  if (!name) {
    throw new Error("Name is required");
  }

  const collection = await prisma.collection.create({
    data: {
      name,
      description,
      shared,
      owner: { connect: { email: userEmail } },
    },
  });

  return collection;
}
