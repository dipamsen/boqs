"use client";

import Modal from "@/components/Modal";
import PrimaryButton from "@/components/PrimaryButton";
import { Question as DBQuestion, QuestionBank } from "@prisma/client";
import { useEffect, useState } from "react";
import {
  MCQQuestion,
  NumericalQuestion,
  Question,
  SubjectiveQuestion,
} from "@/utils/questions";
import Image from "next/image";
import { editQuestion } from "@/app/actions/editQuestion";
import { useRouter } from "next/navigation";

export default function ListQuestions({
  qb,
}: {
  qb: QuestionBank & {
    questions: DBQuestion[];
  };
}) {
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [qid, setQid] = useState<string | null>(null);
  const [qImage, setQImage] = useState<File | null>(null);
  const [sImage, setSImage] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingQuestion || !qid) return;
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      await editQuestion(editingQuestion, qImage, sImage, qid);
      router.refresh();
      setSuccess("Question updated successfully!");
      setQImage(null);
      setSImage(null);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <table className="w-full table-fixed border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-700">
            <th className="border w-[60%] border-gray-300 px-2 py-1">
              Question
            </th>
            <th className="border w-[30%] border-gray-300 px-2 py-1">
              Chapter
            </th>
            <th className="border w-[10%] border-gray-300 px-2 py-1">Type</th>
            <th className="border w-[10%] border-gray-300 px-2 py-1">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {qb.questions.map((question) => (
            <tr key={question.id}>
              <td className="border border-gray-300 px-2 py-1 truncate">
                {question.text}
              </td>
              <td className="border border-gray-300 px-2 py-1 truncate">
                {question.chapter}
              </td>
              <td className="border border-gray-300 px-2 py-1 truncate">
                {question.type}
              </td>
              <td className="border border-gray-300 px-2 py-1">
                <PrimaryButton
                  compact
                  onClick={() => {
                    setEditingQuestion(question.meta as unknown as Question);
                    setQid(question.id);
                  }}
                >
                  Edit
                </PrimaryButton>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal
        isOpen={!!editingQuestion}
        onClose={() => {
          setEditingQuestion(null);
          setQid(null);
          setError(null);
          setSuccess(null);
          setQImage(null);
          setSImage(null);
        }}
        title="Edit Question"
        size="max-w-xl"
      >
        {editingQuestion && (
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
              value={editingQuestion.type}
              disabled
              // onChange={(e) => {
              //   setEditingQuestion((prev) => ({
              //     ...prev!,
              //     type: e.target.value as "MCQ" | "Numerical" | "Subjective",
              //   }));
              // }}
              required
            >
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
                  value={editingQuestion.chapter}
                  onChange={(e) =>
                    setEditingQuestion((prev) => ({
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
                  value={editingQuestion.subject}
                  onChange={(e) =>
                    setEditingQuestion((prev) => ({
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
                  value={editingQuestion.grade}
                  onChange={(e) =>
                    setEditingQuestion((prev) => ({
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
                  value={editingQuestion.marks}
                  onChange={(e) =>
                    setEditingQuestion((prev) => ({
                      ...prev!,
                      marks: parseInt(e.target.value),
                    }))
                  }
                />
              </div>
            </div>
            {editingQuestion.type === "MCQ" ? (
              <EditMCQForm
                question={editingQuestion}
                setQuestion={setEditingQuestion}
                qImage={qImage}
                setQImage={setQImage}
                sImage={sImage}
                setSImage={setSImage}
              />
            ) : editingQuestion.type === "Numerical" ? (
              <EditNumericalForm
                question={editingQuestion}
                setQuestion={setEditingQuestion}
                qImage={qImage}
                setQImage={setQImage}
                sImage={sImage}
                setSImage={setSImage}
              />
            ) : editingQuestion.type === "Subjective" ? (
              <EditSubjectiveForm
                question={editingQuestion}
                setQuestion={setEditingQuestion}
                qImage={qImage}
                setQImage={setQImage}
                sImage={sImage}
                setSImage={setSImage}
              />
            ) : null}
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-500 text-sm">{success}</p>}
            <PrimaryButton type="submit" disabled={loading}>
              Save
            </PrimaryButton>
          </form>
        )}
      </Modal>
    </div>
  );
}

function EditMCQForm({
  question,
  setQuestion,
  qImage,
  setQImage,
  sImage,
  setSImage,
}: {
  question: MCQQuestion;
  setQuestion: React.Dispatch<React.SetStateAction<Question | null>>;
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
      setQuestion((prev) => {
        if (!prev || prev.type !== "MCQ" || prev.image === null) return prev;
        return { ...prev, image: null };
      });
      setQImageUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setQImageUrl(question.image ? question.image : null);
    }
  }, [qImage, question.image, setQuestion]);

  useEffect(() => {
    if (sImage) {
      const url = URL.createObjectURL(sImage);
      setSImageUrl(url);

      setQuestion((prev) => {
        if (!prev || prev.type !== "MCQ" || prev.solutionImage === null)
          return prev;
        return { ...prev, solutionImage: null };
      });
      return () => URL.revokeObjectURL(url);
    } else {
      setSImageUrl(question.solutionImage ? question.solutionImage : null);
    }
  }, [sImage, question.solutionImage, setQuestion]);

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
            onClick={() => {
              setQuestion((prev) => {
                if (!prev || prev.type !== "MCQ") return prev;
                return { ...prev!, image: null };
              });
              setQImage(null);
            }}
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
            onClick={() => {
              setQuestion((prev) => {
                if (!prev || prev.type !== "MCQ") return prev;
                return { ...prev!, solutionImage: null };
              });
              setSImage(null);
            }}
            className="text-red-500 hover:text-red-700"
          >
            X
          </button>
        </div>
      )}
    </>
  );
}

function EditNumericalForm({
  question,
  setQuestion,
  qImage,
  setQImage,
  sImage,
  setSImage,
}: {
  question: NumericalQuestion;
  setQuestion: React.Dispatch<React.SetStateAction<Question | null>>;
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
      setQuestion((prev) => {
        if (!prev || prev.type !== "Numerical" || prev.image === null)
          return prev;
        return { ...prev, image: null };
      });
      setQImageUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setQImageUrl(question.image ? question.image : null);
    }
  }, [qImage, question.image, setQuestion]);

  useEffect(() => {
    if (sImage) {
      const url = URL.createObjectURL(sImage);
      setSImageUrl(url);

      setQuestion((prev) => {
        if (!prev || prev.type !== "Numerical" || prev.solutionImage === null)
          return prev;
        return { ...prev, solutionImage: null };
      });
      return () => URL.revokeObjectURL(url);
    } else {
      setSImageUrl(question.solutionImage ? question.solutionImage : null);
    }
  }, [sImage, question.solutionImage, setQuestion]);

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
            onClick={() => {
              setQuestion((prev) => {
                if (!prev || prev.type !== "Numerical") return prev;
                return { ...prev!, image: null };
              });
              setQImage(null);
            }}
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
            onClick={() => {
              setQuestion((prev) => {
                if (!prev || prev.type !== "Numerical") return prev;
                return { ...prev!, solutionImage: null };
              });
              setSImage(null);
            }}
            className="text-red-500 hover:text-red-700"
          >
            X
          </button>
        </div>
      )}
    </>
  );
}

function EditSubjectiveForm({
  question,
  setQuestion,
  qImage,
  setQImage,
  sImage,
  setSImage,
}: {
  question: SubjectiveQuestion;
  setQuestion: React.Dispatch<React.SetStateAction<Question | null>>;
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
      setQuestion((prev) => {
        if (!prev || prev.type !== "Subjective" || prev.image === null)
          return prev;
        return { ...prev, image: null };
      });
      setQImageUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setQImageUrl(question.image ? question.image : null);
    }
  }, [qImage, question.image, setQuestion]);

  useEffect(() => {
    if (sImage) {
      const url = URL.createObjectURL(sImage);
      setSImageUrl(url);

      setQuestion((prev) => {
        if (!prev || prev.type !== "Subjective" || prev.solutionImage === null)
          return prev;
        return { ...prev, solutionImage: null };
      });
      return () => URL.revokeObjectURL(url);
    } else {
      setSImageUrl(question.solutionImage ? question.solutionImage : null);
    }
  }, [sImage, question.solutionImage, setQuestion]);

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
            onClick={() => {
              setQuestion((prev) => {
                if (!prev || prev.type !== "Subjective") return prev;
                return { ...prev!, image: null };
              });
              setQImage(null);
            }}
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
            onClick={() => {
              setQuestion((prev) => {
                if (!prev || prev.type !== "Subjective") return prev;
                return { ...prev!, solutionImage: null };
              });
              setSImage(null);
            }}
            className="text-red-500 hover:text-red-700"
          >
            X
          </button>
        </div>
      )}
    </>
  );
}
