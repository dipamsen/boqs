"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { Question, validate } from "@/utils/questions";
import { Prisma } from "@prisma/client";
import type { JsonObject } from "@prisma/client/runtime/library.mjs";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

export async function editQuestion(
  question: Question,
  qImage: File | null,
  sImage: File | null,
  qId: string
) {
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;

  if (!userEmail) {
    throw new Error("User not authenticated");
  }

  const validated = validate(question, qImage, sImage);

  const dbQuestion = {
    type: validated.type,
    text: validated.text,
    meta: validated as unknown as JsonObject,
    answer: validated.answer.toString(),
    chapter: validated.chapter,
    subject: validated.subject,
    grade: validated.grade,
    marks: validated.marks,
  } satisfies Omit<
    | (Prisma.Without<
        Prisma.QuestionCreateInput,
        Prisma.QuestionUncheckedCreateInput
      > &
        Prisma.QuestionUncheckedCreateInput)
    | (Prisma.Without<
        Prisma.QuestionUncheckedCreateInput,
        Prisma.QuestionCreateInput
      > &
        Prisma.QuestionCreateInput),
    "bank"
  >;

  const user = await prisma.user.findUnique({
    where: {
      email: userEmail,
    },
  });

  const questionExisting = await prisma.question.findUnique({
    where: {
      id: qId,
    },
    include: {
      bank: {
        include: {
          collection: {
            select: {
              ownerId: true,
            },
          },
        },
      },
    },
  });

  if (questionExisting?.bank.collection.ownerId !== user?.id) {
    throw new Error(
      "You are not authorized to edit a question in this question bank"
    );
  }

  const questionData = await prisma.question.update({
    where: {
      id: qId,
    },
    data: {
      ...dbQuestion,
    },
  });

  // upload images
  if (!qImage && !sImage) {
    return questionData;
  }

  let qImageName: string | null = null;
  let sImageName: string | null = null;
  const buffersToUpload: { name: string; buffer: Buffer; type: string }[] = [];
  if (qImage) {
    const arrayBuffer = await qImage.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    qImageName = `questions/${qId}/question-${Date.now()}-${qImage.name}`;
    buffersToUpload.push({
      name: qImageName,
      buffer,
      type: qImage.type,
    });
  }
  if (sImage) {
    const arrayBuffer = await sImage.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    sImageName = `questions/${qId}/solution-${Date.now()}-${sImage.name}`;
    buffersToUpload.push({
      name: sImageName,
      buffer,
      type: sImage.type,
    });
  }
  if (buffersToUpload.length > 0) {
    for (const { name, buffer, type } of buffersToUpload) {
      const { error } = await supabase.storage
        .from("content")
        .upload(name, buffer, {
          contentType: type,
        });
      if (error) {
        throw new Error(error.message);
      }
    }
  }

  if (qImageName) {
    const {
      data: { publicUrl: qImageUrl },
    } = supabase.storage.from("content").getPublicUrl(qImageName);
    validated.image = qImageUrl;
  }
  if (sImageName) {
    const {
      data: { publicUrl: sImageUrl },
    } = supabase.storage.from("content").getPublicUrl(sImageName);
    validated.solutionImage = sImageUrl;
  }

  const q = await prisma.question.update({
    where: {
      id: qId,
    },
    data: {
      image: validated.image,
      meta: validated as unknown as JsonObject,
    },
  });

  return q;
}
