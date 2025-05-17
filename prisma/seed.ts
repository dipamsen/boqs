import { prisma } from "../src/lib/prisma";

async function main() {
  // Create a new user
  const user = await prisma.user.create({
    data: {
      meta: {
        name: "John Doe",
      },
      email: "hello@example.com",
    },
  });
  console.log("Created user:", user);

  // Create a new collection for the user
  const collection = await prisma.collection.create({
    data: {
      name: "My First Collection",
      ownerId: user.id,
    },
  });
  console.log("Created collection:", collection);

  // Create a new question bank
  const questionBank = await prisma.questionBank.create({
    data: {
      name: "My First Question Bank",
      collectionId: collection.id,
    },
  });
  console.log("Created question bank:", questionBank);

  // Create a new question
  const question = await prisma.question.create({
    data: {
      text: "What is the degree of a constant polynomial?",
      answer: "A",
      type: "MCQ",
      meta: {
        options: [
          { text: "0", isCorrect: true },
          { text: "1" },
          { text: "2" },
          { text: "3" },
        ],
      },
      chapter: "Polynomials",
      grade: "9",
      subject: "Math",
      marks: 1,
      bankId: questionBank.id,
    },
  });
  console.log("Created question:", question);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
