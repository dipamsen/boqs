"use client";

import { FormEvent, useState } from "react";
import Modal from "./Modal";
import { createCollection } from "@/app/actions/createCollection";
import { useRouter } from "next/navigation";
import PrimaryButton from "./PrimaryButton";
import { joinCollection } from "@/app/actions/joinCollection";

export default function NoCollections() {
  const router = useRouter();
  const [isOpenCreate, setIsOpenCreate] = useState(false);
  const [isOpenJoin, setIsOpenJoin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmitCreate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    try {
      setLoading(true);
      await createCollection(formData);
      setIsOpenCreate(false);
      setLoading(false);
      router.refresh();
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

  const handleSubmitJoin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    try {
      setLoading(true);
      await joinCollection(formData);
      setIsOpenJoin(false);
      setLoading(false);
      router.refresh();
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
    <div className="pt-20 text-center">
      <h1 className="text-3xl font-semibold">No Collections Found</h1>
      <p className="text-gray-400 mt-2">
        You don&apos;t have any collections. Create one or join an existing one
        to get started!
      </p>
      <div className="flex gap-4 flex-col md:flex-row justify-center mt-4">
        <button
          className="w-full bg-gray-900 border-dashed border-gray-400 border-3 text-white p-4 rounded-lg flex items-center justify-center hover:bg-gray-800 transition duration-200 cursor-pointer"
          onClick={() => setIsOpenCreate(true)}
        >
          <p className="text-gray-400">+ Create Collection</p>
        </button>
        <button
          className="w-full bg-gray-900 border-dashed border-gray-400 border-3 text-white p-4 rounded-lg flex items-center justify-center hover:bg-gray-800 transition duration-200 cursor-pointer"
          onClick={() => setIsOpenJoin(true)}
        >
          <p className="text-gray-400">+ Add Collection</p>
        </button>
      </div>
      <Modal
        isOpen={isOpenCreate}
        onClose={() => {
          setIsOpenCreate(false);
        }}
        title="Create Collection"
      >
        <form
          onSubmit={handleSubmitCreate}
          className="flex flex-col gap-4 mt-4"
        >
          <label className="flex flex-col gap-1">
            <span className="text-gray-200">Collection Name</span>
            <input
              type="text"
              name="name"
              className="bg-gray-800 text-white p-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter collection name"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-gray-200">Description</span>
            <textarea
              name="description"
              className="bg-gray-800 text-white p-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter description"
            ></textarea>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-gray-200">Visibility</span>
            <select
              className="bg-gray-800 text-white p-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              name="visibility"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </label>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <PrimaryButton type="submit" disabled={loading}>
            Create Collection
          </PrimaryButton>
        </form>
      </Modal>
      <Modal
        isOpen={isOpenJoin}
        onClose={() => {
          setIsOpenJoin(false);
        }}
        title="Add Collection"
      >
        <form className="flex flex-col gap-4 mt-4" onSubmit={handleSubmitJoin}>
          <label className="flex flex-col gap-1">
            <span className="text-gray-200">Collection ID</span>
            <input
              name="id"
              type="text"
              className="bg-gray-800 text-white p-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter collection ID"
            />
          </label>
          <PrimaryButton type="submit" disabled={loading}>
            Add Collection
          </PrimaryButton>
        </form>
      </Modal>
    </div>
  );
}
