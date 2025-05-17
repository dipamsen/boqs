"use client";
import { createQuestion } from "@/app/actions/createQuestion";
import Modal from "@/components/Modal";
import PrimaryButton from "@/components/PrimaryButton";
import { useEffect, useState } from "react";
import type {
  MCQQuestion,
  NumericalQuestion,
  Question,
  SubjectiveQuestion,
} from "@/utils/questions";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function AddQuestionModal({
  qbId,
  defaultVals,
}: {
  qbId: string;
  defaultVals: {
    chapter: string;
    subject: string;
    grade: string;
    marks: number;
  };
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [type, setType] = useState<Question["type"] | null>(null);
  const [question, setQuestion] = useState<Question>();
  const [qImage, setQImage] = useState<File | null>(null);
  const [sImage, setSImage] = useState<File | null>(null);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!question) return;
    try {
      setError(null);
      setLoading(true);
      await createQuestion(question, qImage, sImage, qbId);
      router.refresh();
      setQuestion(undefined);
      setType(null);
      setQImage(null);
      setSImage(null);
      setIsOpen(false);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (error instanceof Error) {
        setError(error.message);
      } else if (typeof error === "string") {
        setError(error);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  return (
    <>
      <PrimaryButton onClick={() => setIsOpen(true)} disabled={loading}>
        Add Question
      </PrimaryButton>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
        title="Add Question"
        size="max-w-xl"
      >
        <form
          className="flex flex-col gap-2 max-h-[70vh] overflow-y-auto pr-2"
          onSubmit={handleSubmit}
        >
          <label htmlFor="type" className="text-sm font-semibold">
            Type
          </label>
          <select
            id="type"
            name="type"
            className="border border-gray-300 rounded-lg p-2"
            value={type ?? ""}
            onChange={(e) => {
              setType(e.target.value as Question["type"]);
              if (e.target.value === "MCQ") {
                setQuestion({
                  type: "MCQ",
                  text: "",
                  numOptions: 4,
                  options: ["", "", "", ""],
                  answer: 0,
                  chapter: defaultVals.chapter,
                  subject: defaultVals.subject,
                  grade: defaultVals.grade,
                  marks: defaultVals.marks,
                  image: null,
                  solution: null,
                  solutionImage: null,
                } satisfies MCQQuestion);
              } else if (e.target.value === "Numerical") {
                setQuestion({
                  type: "Numerical",
                  text: "",
                  answer: 0,
                  chapter: defaultVals.chapter,
                  subject: defaultVals.subject,
                  grade: defaultVals.grade,
                  marks: defaultVals.marks,
                  image: null,
                  solution: null,
                  solutionImage: null,
                } satisfies NumericalQuestion);
              } else if (e.target.value === "Subjective") {
                setQuestion({
                  type: "Subjective",
                  text: "",
                  answer: "",
                  chapter: defaultVals.chapter,
                  subject: defaultVals.subject,
                  grade: defaultVals.grade,
                  marks: defaultVals.marks,
                  image: null,
                  solutionImage: null,
                } satisfies SubjectiveQuestion);
              } else {
                setQuestion(undefined);
              }
            }}
            required
          >
            <option className="text-gray-700 bg-white" value="">
              Select question type
            </option>
            <option className="text-gray-700 bg-white" value="MCQ">
              MCQ
            </option>
            <option className="text-gray-700 bg-white" value="Numerical">
              Numerical
            </option>
            <option className="text-gray-700 bg-white" value="Subjective">
              Subjective
            </option>
          </select>
          {question && (
            <>
              <div className="flex gap-2 items-center flex-col md:flex-row w-full">
                <div className="flex-1">
                  <label htmlFor="chapter" className="text-sm font-semibold">
                    Chapter
                  </label>
                  <input
                    type="text"
                    id="chapter"
                    name="chapter"
                    className="border border-gray-300 rounded-lg p-2 w-full"
                    placeholder="Enter chapter name"
                    value={question.chapter ?? ""}
                    onChange={(e) =>
                      setQuestion((prev) => ({
                        ...prev!,
                        chapter: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="subject" className="text-sm font-semibold">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    className="border border-gray-300 rounded-lg p-2 w-full"
                    placeholder="Enter subject name"
                    value={question.subject ?? ""}
                    onChange={(e) =>
                      setQuestion((prev) => ({
                        ...prev!,
                        subject: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="flex gap-2 items-center flex-col md:flex-row">
                <div className="flex-1">
                  <label htmlFor="grade" className="text-sm font-semibold">
                    Grade
                  </label>
                  <input
                    type="text"
                    id="grade"
                    name="grade"
                    className="border border-gray-300 rounded-lg p-2 w-full"
                    placeholder="Enter grade name"
                    value={question.grade ?? ""}
                    onChange={(e) =>
                      setQuestion((prev) => ({
                        ...prev!,
                        grade: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="marks" className="text-sm font-semibold">
                    Marks
                  </label>
                  <input
                    type="number"
                    id="marks"
                    name="marks"
                    className="border border-gray-300 rounded-lg p-2 w-full"
                    placeholder="Enter marks"
                    value={question.marks ?? ""}
                    onChange={(e) =>
                      setQuestion((prev) => ({
                        ...prev!,
                        marks: parseInt(e.target.value),
                      }))
                    }
                  />
                </div>
              </div>
            </>
          )}
          {question &&
            (question.type === "MCQ" ? (
              <AddMCQForm
                question={question}
                setQuestion={setQuestion}
                qImage={qImage}
                setQImage={setQImage}
                sImage={sImage}
                setSImage={setSImage}
              />
            ) : question.type === "Numerical" ? (
              <AddNumericalForm
                question={question}
                setQuestion={setQuestion}
                qImage={qImage}
                setQImage={setQImage}
                sImage={sImage}
                setSImage={setSImage}
              />
            ) : question.type === "Subjective" ? (
              <AddSubjectiveForm
                question={question}
                setQuestion={setQuestion}
                qImage={qImage}
                setQImage={setQImage}
                sImage={sImage}
                setSImage={setSImage}
              />
            ) : null)}
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <PrimaryButton type="submit" disabled={loading}>
            Create
          </PrimaryButton>
        </form>
      </Modal>
    </>
  );
}

function AddMCQForm({
  question,
  setQuestion,
  qImage,
  setQImage,
  sImage,
  setSImage,
}: {
  question: MCQQuestion;
  setQuestion: React.Dispatch<React.SetStateAction<Question | undefined>>;
  qImage: File | null;
  setQImage: React.Dispatch<React.SetStateAction<File | null>>;
  sImage: File | null;
  setSImage: React.Dispatch<React.SetStateAction<File | null>>;
}) {
  const [qImageUrl, setQImageUrl] = useState<string | null>(null);
  const [sImageUrl, setSImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (qImage) {
      const url = URL.createObjectURL(qImage);
      setQImageUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setQImageUrl(null);
    }
  }, [qImage]);

  useEffect(() => {
    if (sImage) {
      const url = URL.createObjectURL(sImage);
      setSImageUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setSImageUrl(null);
    }
  }, [sImage]);

  return (
    <>
      <label htmlFor="text" className="text-sm font-semibold">
        Question
      </label>
      <textarea
        id="text"
        name="text"
        className="border border-gray-300 rounded-lg p-2 flex-none"
        placeholder="Enter question text"
        value={question.text}
        onChange={(e) =>
          setQuestion((prev) => ({
            ...prev!,
            text: e.target.value,
          }))
        }
        onPaste={(e) => {
          const items = e.clipboardData?.items;
          if (items) {
            for (let i = 0; i < items.length; i++) {
              const item = items[i];
              if (item.type.includes("image")) {
                e.preventDefault();
                const file = item.getAsFile();
                if (file) {
                  setQImage(file);
                }
              }
            }
          }
        }}
      />
      {qImageUrl && (
        <div className="flex gap-2 items-center">
          <Image
            src={qImageUrl}
            alt="Question"
            className="object-contain rounded-lg shadow"
            width={300}
            height={128}
          />
          <button
            type="button"
            onClick={() => setQImage(null)}
            className="text-red-500 hover:text-red-700"
          >
            X
          </button>
        </div>
      )}
      {new Array(question.numOptions ?? 4).fill(0).map((_, index) => (
        <div key={index} className="flex gap-2 items-center">
          <label htmlFor={`option-${index}`} className="text-sm font-semibold">
            Option {index + 1}
          </label>
          <input
            type="text"
            id={`option-${index}`}
            name={`option-${index}`}
            className="border border-gray-300 rounded-lg p-2 flex-1"
            placeholder={`Enter option ${index + 1}`}
            value={question.options?.[index] ?? ""}
            onChange={(e) =>
              setQuestion((prev) => {
                if (!prev || prev.type !== "MCQ") return prev;
                const options = [...(prev?.options ?? [])];
                options[index] = e.target.value;
                return { ...prev!, options };
              })
            }
          />
          <input
            type="radio"
            name={`isanswer-${index}`}
            className="border border-gray-300 rounded-lg p-2"
            checked={question.answer === index}
            onChange={() =>
              setQuestion((prev) => {
                if (!prev || prev.type !== "MCQ") return prev;
                return { ...prev!, answer: index };
              })
            }
          />
        </div>
      ))}
      <label htmlFor="solution" className="text-sm font-semibold">
        Solution
      </label>
      <textarea
        id="solution"
        name="solution"
        className="border border-gray-300 rounded-lg p-2 flex-none"
        placeholder="Enter solution"
        value={question.solution ?? ""}
        onChange={(e) =>
          setQuestion((prev) => ({
            ...prev!,
            solution: e.target.value,
          }))
        }
        onPaste={(e) => {
          const items = e.clipboardData?.items;
          if (items) {
            for (let i = 0; i < items.length; i++) {
              const item = items[i];
              if (item.type.includes("image")) {
                e.preventDefault();
                const file = item.getAsFile();
                if (file) {
                  setSImage(file);
                }
              }
            }
          }
        }}
      />
      {sImageUrl && (
        <div className="flex gap-2 items-center">
          <Image
            src={sImageUrl}
            alt="Solution"
            className="object-contain rounded-lg"
            width={300}
            height={128}
          />
          <button
            type="button"
            onClick={() => setSImage(null)}
            className="text-red-500 hover:text-red-700"
          >
            X
          </button>
        </div>
      )}
    </>
  );
}

function AddNumericalForm({
  question,
  setQuestion,
  qImage,
  setQImage,
  sImage,
  setSImage,
}: {
  question: NumericalQuestion;
  setQuestion: React.Dispatch<React.SetStateAction<Question | undefined>>;
  qImage: File | null;
  setQImage: React.Dispatch<React.SetStateAction<File | null>>;
  sImage: File | null;
  setSImage: React.Dispatch<React.SetStateAction<File | null>>;
}) {
  const [qImageUrl, setQImageUrl] = useState<string | null>(null);
  const [sImageUrl, setSImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (qImage) {
      const url = URL.createObjectURL(qImage);
      setQImageUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setQImageUrl(null);
    }
  }, [qImage]);

  useEffect(() => {
    if (sImage) {
      const url = URL.createObjectURL(sImage);
      setSImageUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setSImageUrl(null);
    }
  }, [sImage]);

  return (
    <>
      <label htmlFor="text" className="text-sm font-semibold">
        Question
      </label>
      <textarea
        id="text"
        name="text"
        className="border border-gray-300 rounded-lg p-2 flex-none"
        placeholder="Enter question text"
        value={question.text}
        onChange={(e) =>
          setQuestion((prev) => ({
            ...prev!,
            text: e.target.value,
          }))
        }
        onPaste={(e) => {
          const items = e.clipboardData?.items;
          if (items) {
            for (let i = 0; i < items.length; i++) {
              const item = items[i];
              if (item.type.includes("image")) {
                e.preventDefault();
                const file = item.getAsFile();
                if (file) {
                  setQImage(file);
                }
              }
            }
          }
        }}
      />
      {qImageUrl && (
        <div className="flex gap-2 items-center">
          <Image
            src={qImageUrl}
            alt="Question"
            className="object-contain rounded-lg shadow"
            width={300}
            height={128}
          />
          <button
            type="button"
            onClick={() => setQImage(null)}
            className="text-red-500 hover:text-red-700"
          >
            X
          </button>
        </div>
      )}
      <label htmlFor="answer" className="text-sm font-semibold">
        Answer
      </label>
      <input
        type="number"
        id="answer"
        name="answer"
        className="border border-gray-300 rounded-lg p-2"
        placeholder="Enter answer"
        value={question.answer ?? ""}
        onChange={(e) =>
          setQuestion((prev) => {
            if (!prev || prev.type !== "Numerical") return prev;
            return {
              ...prev!,
              answer: parseFloat(e.target.value),
            };
          })
        }
      />
      <label htmlFor="solution" className="text-sm font-semibold">
        Solution
      </label>
      <textarea
        id="solution"
        name="solution"
        className="border border-gray-300 rounded-lg p-2 flex-none"
        placeholder="Enter solution"
        value={question.solution ?? ""}
        onChange={(e) =>
          setQuestion((prev) => ({
            ...prev!,
            solution: e.target.value,
          }))
        }
        onPaste={(e) => {
          const items = e.clipboardData?.items;
          if (items) {
            for (let i = 0; i < items.length; i++) {
              const item = items[i];
              if (item.type.includes("image")) {
                e.preventDefault();
                const file = item.getAsFile();
                if (file) {
                  setSImage(file);
                }
              }
            }
          }
        }}
      />
      {sImageUrl && (
        <div className="flex gap-2 items-center">
          <Image
            src={sImageUrl}
            alt="Solution"
            className="object-contain rounded-lg"
            width={300}
            height={128}
          />
          <button
            type="button"
            onClick={() => setSImage(null)}
            className="text-red-500 hover:text-red-700"
          >
            X
          </button>
        </div>
      )}
    </>
  );
}

function AddSubjectiveForm({
  question,
  setQuestion,
  qImage,
  setQImage,
  sImage,
  setSImage,
}: {
  question: SubjectiveQuestion;
  setQuestion: React.Dispatch<React.SetStateAction<Question | undefined>>;
  qImage: File | null;
  setQImage: React.Dispatch<React.SetStateAction<File | null>>;
  sImage: File | null;
  setSImage: React.Dispatch<React.SetStateAction<File | null>>;
}) {
  const [qImageUrl, setQImageUrl] = useState<string | null>(null);
  const [sImageUrl, setSImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (qImage) {
      const url = URL.createObjectURL(qImage);
      setQImageUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setQImageUrl(null);
    }
  }, [qImage]);

  useEffect(() => {
    if (sImage) {
      const url = URL.createObjectURL(sImage);
      setSImageUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setSImageUrl(null);
    }
  }, [sImage]);

  return (
    <>
      <label htmlFor="text" className="text-sm font-semibold">
        Question
      </label>
      <textarea
        id="text"
        name="text"
        className="border border-gray-300 rounded-lg p-2 flex-none"
        placeholder="Enter question text"
        value={question.text}
        onChange={(e) =>
          setQuestion((prev) => ({
            ...prev!,
            text: e.target.value,
          }))
        }
        onPaste={(e) => {
          const items = e.clipboardData?.items;
          if (items) {
            for (let i = 0; i < items.length; i++) {
              const item = items[i];
              if (item.type.includes("image")) {
                e.preventDefault();
                const file = item.getAsFile();
                if (file) {
                  setQImage(file);
                }
              }
            }
          }
        }}
      />
      {qImageUrl && (
        <div className="flex gap-2 items-center">
          <Image
            src={qImageUrl}
            alt="Question"
            className="object-contain rounded-lg shadow"
            width={300}
            height={128}
          />
          <button
            type="button"
            onClick={() => setQImage(null)}
            className="text-red-500 hover:text-red-700"
          >
            X
          </button>
        </div>
      )}
      <label htmlFor="answer" className="text-sm font-semibold">
        Answer
      </label>
      <textarea
        id="answer"
        name="answer"
        className="border border-gray-300 rounded-lg p-2 flex-none"
        placeholder="Enter answer"
        value={question.answer}
        onChange={(e) =>
          setQuestion((prev) => {
            if (!prev || prev.type !== "Subjective") return prev;
            return {
              ...prev!,
              answer: e.target.value,
            };
          })
        }
        onPaste={(e) => {
          const items = e.clipboardData?.items;
          if (items) {
            for (let i = 0; i < items.length; i++) {
              const item = items[i];
              if (item.type.includes("image")) {
                e.preventDefault();
                const file = item.getAsFile();
                if (file) {
                  setSImage(file);
                }
              }
            }
          }
        }}
      />
      {sImageUrl && (
        <div className="flex gap-2 items-center">
          <Image
            src={sImageUrl}
            alt="Solution"
            className="object-contain rounded-lg"
            width={300}
            height={128}
          />
          <button
            type="button"
            onClick={() => setSImage(null)}
            className="text-red-500 hover:text-red-700"
          >
            X
          </button>
        </div>
      )}
    </>
  );
}
