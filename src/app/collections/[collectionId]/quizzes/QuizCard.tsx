"use client";

import Card from "@/components/Card";
import PrimaryButton from "@/components/PrimaryButton";
import PrimaryLink from "@/components/PrimaryLink";
import { Quiz, User } from "@prisma/client";
import createAttempt from "@/app/actions/createAttempt";
import { useRouter } from "next/navigation";
import { AttemptWithId } from "@/utils/attempts";

export default function QuizCard({
  quiz,
  user,
  collectionId,
  attempts,
}: {
  quiz: Quiz;
  user: User;
  collectionId: string;
  attempts: AttemptWithId[];
}) {
  const router = useRouter();

  const createAttemptAndNavigate = async () => {
    const cnf = confirm("Are you sure you want to start this quiz?");
    if (!cnf) return;
    try {
      const attempt = await createAttempt(quiz.id, user.id);
      if (attempt) {
        router.push(
          `/collections/${collectionId}/quizzes/${quiz.id}/attempts/${attempt.id}`
        );
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("An unknown error occurred.");
      }
    }
  };

  const status =
    attempts.length === 0
      ? "not-attempted"
      : attempts.find((a) => a.inProgress)
      ? "in-progress"
      : "completed";

  return (
    <Card>
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">{quiz.name}</h2>
          <p className="text-gray-400">{quiz.description}</p>
        </div>

        {quiz.createdById === user.id && (
          <PrimaryLink
            to={`/collections/${collectionId}/quizzes/${quiz.id}/edit`}
          >
            Edit Quiz
          </PrimaryLink>
        )}
        {quiz.createdById !== user.id &&
          (status === "not-attempted" ? (
            <PrimaryButton onClick={createAttemptAndNavigate} className="mt-2">
              Start Quiz
            </PrimaryButton>
          ) : status === "in-progress" ? (
            <PrimaryLink
              to={`/collections/${collectionId}/quizzes/${quiz.id}/attempts/${
                attempts.find((a) => a.inProgress)?.id
              }`}
            >
              Resume Quiz
            </PrimaryLink>
          ) : (
            <div className="flex flex-row gap-2">
              <PrimaryLink
                to={`/collections/${collectionId}/quizzes/${quiz.id}/attempts/${attempts[0].id}`}
                className=" bg-gray-700 hover:bg-gray-800"
              >
                View Results
              </PrimaryLink>
              <PrimaryButton onClick={createAttemptAndNavigate}>
                Start New Attempt
              </PrimaryButton>
            </div>
          ))}
      </div>
    </Card>
  );
}
