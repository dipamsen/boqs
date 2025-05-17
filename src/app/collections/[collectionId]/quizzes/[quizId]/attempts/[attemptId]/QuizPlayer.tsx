"use client";

import PrimaryButton from "@/components/PrimaryButton";
import { QuestionWithId } from "@/utils/questions";
import { Attempt } from "@/utils/attempts";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import saveAttempt from "@/app/actions/saveAttempt";
import { Quiz } from "@prisma/client";
import finishAttempt from "@/app/actions/finishAttempt";
import Image from "next/image";
import Modal from "@/components/Modal";

export default function QuizPlayer({
  quiz,
  questions,
  collectionId,
  initialAttempt,
  attemptId,
}: {
  quiz: Quiz;
  questions: QuestionWithId[];
  collectionId: string;
  initialAttempt: Attempt;
  attemptId: string;
}) {
  const router = useRouter();

  const [attempt, setAttempt] = useState<Attempt>(initialAttempt);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const [answering, setAnswering] = useState<number | null>(null);
  const [showFinishModal, setShowFinishModal] = useState(false);

  const quizCompleted = !attempt.inProgress;

  const handleOptionSelect = (questionId: string) => {
    setAttempt((prevAttempt) => {
      const questionIndex = questions.findIndex(
        (question) => question.id === questionId
      );
      const question = questions[questionIndex];

      if (question.type === "MCQ") {
        const updatedAnswers = [...prevAttempt.answers];
        updatedAnswers[questionIndex] = {
          ...updatedAnswers[questionIndex],
          questionType: question.type,
          input: answering,
          submitted: true,
        };
        return {
          ...prevAttempt,
          answers: updatedAnswers,
        };
      } else if (question.type === "Numerical") {
        const updatedAnswers = [...prevAttempt.answers];
        updatedAnswers[questionIndex] = {
          ...updatedAnswers[questionIndex],
          questionType: question.type,
          input: answering,
          submitted: true,
        };
        return {
          ...prevAttempt,
          answers: updatedAnswers,
        };
      } else if (question.type === "Subjective") {
        const updatedAnswers = [...prevAttempt.answers];
        updatedAnswers[questionIndex] = {
          ...updatedAnswers[questionIndex],
          questionType: question.type,
          submitted: true,
        };
        return {
          ...prevAttempt,
          answers: updatedAnswers,
        };
      }
      throw new Error("Invalid question type");
    });
  };

  const handleFinishAttempt = async () => {
    setShowFinishModal(true);
    await finishAttempt(attemptId, attempt);
  };

  const question = questions[selectedQuestionIndex];
  // debounce save attempt when attempt changes
  useEffect(() => {
    const save = async () => {
      await saveAttempt(attemptId, attempt);
    };
    const timeoutId = setTimeout(() => {
      save();
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [attempt, attemptId]);

  const correctCount = attempt.answers.filter(
    (answer, i) =>
      answer.submitted &&
      (answer.questionType === "Subjective" ||
        answer.input === questions[i].answer)
  ).length;
  const incorrectCount = attempt.answers.filter(
    (answer, i) =>
      answer.submitted &&
      answer.questionType !== "Subjective" &&
      answer.input !== questions[i].answer
  ).length;
  const unattemptedCount = attempt.answers.filter(
    (answer) => !answer.submitted
  ).length;

  return (
    <div className="flex min-h-[80vh] bg-gray-900 rounded-lg shadow-lg">
      <div className="flex flex-col flex-1 border-r border-gray-700">
        <div className="flex border-b border-gray-700 p-4 justify-between items-center">
          <h1 className="text-xl font-bold flex-1">{quiz.name}</h1>
          {/* <p className="text-gray-400">Time left: 00:30:00</p> */}
        </div>
        <div className="p-4 flex items-center justify-center flex-1 overflow-auto border-b border-gray-700">
          {question.text && <h2 className="text-xl flex-1">{question.text}</h2>}
          {question.image && (
            <Image
              width={600}
              height={400}
              src={question.image}
              alt="Question"
              className="mt-2"
            />
          )}
        </div>
        <div className="flex-1 p-4 overflow-auto">
          <AnswerInputInterface
            question={question}
            answer={answering}
            setAnswer={(answer) => {
              setAnswering(answer);
            }}
            attempt={attempt.answers[selectedQuestionIndex]}
            correctAnswer={question.answer}
            disabled={quizCompleted}
          />

          {/* Answer/Solution */}
          {attempt.answers[selectedQuestionIndex].submitted && (
            <div className="mt-4">
              <h3 className="text-lg font-bold">Answer:</h3>
              <p className="">
                {question.type === "MCQ"
                  ? question.options
                    ? question.options[question.answer as number]
                    : `(${String.fromCharCode(65 + question.answer)})`
                  : question.answer}
              </p>
              <p>{question.type !== "Subjective" && question.solution}</p>
              {question.solutionImage && (
                <Image
                  width={600}
                  height={400}
                  src={question.solutionImage}
                  alt="Solution"
                  className="mt-2"
                />
              )}
            </div>
          )}
        </div>

        <div className="flex justify-between border-t border-gray-700 p-4 mt-4">
          {attempt.answers[selectedQuestionIndex].submitted ? (
            <PrimaryButton
              // className="bg-gray-600 hover:bg-gray-700"
              onClick={() => {
                setSelectedQuestionIndex((prevIndex) => {
                  const nextIndex = prevIndex + 1;
                  if (nextIndex < questions.length) {
                    return nextIndex;
                  } else {
                    return prevIndex; // Stay on the last question
                  }
                });
                setAnswering(null);
              }}
              disabled={selectedQuestionIndex === questions.length - 1}
            >
              Next
            </PrimaryButton>
          ) : (
            <PrimaryButton
              // className="bg-gray-600 hover:bg-gray-700"
              onClick={() => {
                handleOptionSelect(question.id);
                setAnswering(null);
              }}
              disabled={answering === null || quizCompleted}
            >
              {question.type === "Subjective" ? "View Answer" : "Submit"}
            </PrimaryButton>
          )}
          {!quizCompleted && (
            <PrimaryButton
              className="bg-red-600 hover:bg-red-700"
              onClick={() => handleFinishAttempt()}
            >
              Finish
            </PrimaryButton>
          )}
        </div>
      </div>

      <div className="w-48 border-l border-gray-700">
        <div className="mb-4 p-4 border-b border-gray-700">
          <div className="flex justify-between mb-2">
            <span>Correct</span>
            <span className="text-green-500">{correctCount}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Incorrect</span>
            <span className="text-red-500">{incorrectCount}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Unattempted</span>
            <span className="text-grey-500">{unattemptedCount}</span>
          </div>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-4 gap-2 text-center px-4">
          {questions.map((_, i) => (
            <button
              key={i}
              className={[
                "border border-gray-600 px-2 py-1  transition rounded cursor-pointer",
                attempt.answers[i].submitted
                  ? attempt.answers[i].questionType === "Subjective"
                    ? "bg-green-600 hover:bg-green-700"
                    : attempt.answers[i].input === questions[i].answer
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-500 hover:bg-red-600"
                  : "hover:bg-gray-700",
              ].join(" ")}
              onClick={() => setSelectedQuestionIndex(i)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      <Modal
        isOpen={showFinishModal}
        onClose={() => {}}
        title="Attempt Summary"
      >
        <div className="p-4">
          <div className="mb-4">
            <p className="text-lg font-semibold">
              Correct Answers: {correctCount}
            </p>
            <p className="text-lg font-semibold">
              Incorrect Answers: {incorrectCount}
            </p>
            <p className="text-lg font-semibold">
              Unattempted Questions: {unattemptedCount}
            </p>
          </div>
          <div className="flex justify-end">
            <PrimaryButton
              onClick={() => {
                setShowFinishModal(false);
                router.push(`/collections/${collectionId}/quizzes/`);
              }}
            >
              Go to Quizzes
            </PrimaryButton>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function AnswerInputInterface({
  question,
  answer,
  setAnswer,
  attempt,
  correctAnswer,
  disabled,
}: {
  question: QuestionWithId;
  answer: number | null;
  setAnswer: (answer: number) => void;
  attempt: Attempt["answers"][number];
  correctAnswer: number | string | null;
  disabled: boolean;
}) {
  return question.type === "MCQ" && attempt.questionType === "MCQ" ? (
    question.options ? (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {question.options.map((option, i) => (
          <button
            key={i}
            className={[
              "border border-gray-700 p-2 rounded-lg  transition text-left",
              disabled
                ? "cursor-not-allowed"
                : !attempt.submitted &&
                  (answer === i
                    ? "bg-gray-700 cursor-pointer"
                    : "hover:bg-gray-800 cursor-pointer"),
              attempt.submitted
                ? correctAnswer === i
                  ? "bg-green-600"
                  : attempt.input === i
                  ? "bg-red-500"
                  : ""
                : "",
            ].join(" ")}
            disabled={attempt.submitted || disabled}
            onClick={() => setAnswer(i)}
          >
            {option}
          </button>
        ))}
      </div>
    ) : (
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: question.numOptions }, (_, i) => (
          <button
            key={i}
            className={[
              "border border-gray-700 p-2 rounded-lg  transition text-left",
              !attempt.submitted &&
                (answer === i
                  ? "bg-gray-700 cursor-pointer"
                  : "hover:bg-gray-800 cursor-pointer"),
              attempt.submitted
                ? correctAnswer === i
                  ? "bg-green-600"
                  : attempt.input === i
                  ? "bg-red-500"
                  : ""
                : "",
            ].join(" ")}
            disabled={attempt.submitted || disabled}
            onClick={() => setAnswer(i)}
          >
            ({String.fromCharCode(65 + i)})
          </button>
        ))}
      </div>
    )
  ) : question.type === "Numerical" ? (
    <div className="flex items-center border border-gray-700 p-2 rounded-lg">
      <input
        type="number"
        className={[
          "border border-gray-700 p-2 rounded-lg w-full",
          attempt.submitted && answer !== correctAnswer
            ? "bg-red-500"
            : attempt.submitted && answer === correctAnswer
            ? "bg-green-600"
            : "",
        ].join(" ")}
        disabled={attempt.submitted || disabled}
        value={answer !== null ? answer : ""}
        placeholder="Enter your answer"
        onChange={(e) => setAnswer(Number(e.target.value))}
      />
    </div>
  ) : null;
}
