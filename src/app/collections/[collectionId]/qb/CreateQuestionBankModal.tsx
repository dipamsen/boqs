"use client";

import { createQuestionBank } from "@/app/actions/createQuestionBank";
import { ActionCard } from "@/components/Card";
import Modal from "@/components/Modal";
import PrimaryButton from "@/components/PrimaryButton";
import { FormEvent, useState } from "react";

export default function CreateQuestionBankModal({
  collectionId,
}: {
  collectionId: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    try {
      setLoading(true);
      await createQuestionBank(formData, collectionId);
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
      <ActionCard onClick={() => setIsOpen(true)}>
        <h2 className="text-xl font-semibold">Create Question Bank</h2>
        <p className="text-sm text-gray-400">Create a new question bank.</p>
      </ActionCard>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Create Question Bank"
      >
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <label htmlFor="name" className="text-sm font-semibold">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="border border-gray-300 rounded-lg p-2"
            placeholder="Enter question bank name"
          />
          <label htmlFor="description" className="text-sm font-semibold">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            className="border border-gray-300 rounded-lg p-2"
            placeholder="Enter question bank description"
          ></textarea>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <PrimaryButton type="submit" disabled={loading}>
            Create
          </PrimaryButton>
        </form>
      </Modal>
    </>
  );
}
