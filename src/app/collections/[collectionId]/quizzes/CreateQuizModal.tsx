"use client";

import createQuiz from "@/app/actions/createQuiz";
import { ActionCard } from "@/components/Card";
import Modal from "@/components/Modal";
import PrimaryButton from "@/components/PrimaryButton";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateQuizModal({
  collectionId,
}: {
  collectionId: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;

    if (!name || !description) {
      setError("Name and description are required.");
      return;
    }
    if (loading) return;

    try {
      setLoading(true);
      setError(null);
      await createQuiz({ collectionId, name, description });
      router.refresh();
      setIsOpen(false);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
    setLoading(false);
  };

  return (
    <>
      <ActionCard onClick={() => setIsOpen(true)}>
        <h2 className="text-xl font-semibold">Create Quiz</h2>
        <p className="text-gray-400">Create a new quiz for this collection.</p>
      </ActionCard>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Create Quiz"
      >
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Quiz Name"
            className="p-2 rounded-md bg-gray-700 text-white"
            required
          />
          <textarea
            name="description"
            placeholder="Quiz Description"
            className="p-2 rounded-md bg-gray-700 text-white"
            required
          ></textarea>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <PrimaryButton type="submit">Create Quiz</PrimaryButton>
        </form>
      </Modal>
    </>
  );
}
