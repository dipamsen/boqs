"use client";

import { useSession } from "next-auth/react";

export default function HomeContent() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="pt-40 text-center">Loading...</div>;
  }

  return (
    <div className="pt-40 text-center">
      {session ? (
        <>
          <h1 className="text-3xl font-semibold">
            Welcome back, {session.user?.name || "User"}!
          </h1>
          <p className="text-gray-400 mt-2">
            Go ahead and explore your bank or quizzes.
          </p>
        </>
      ) : (
        <>
          <h1 className="text-3xl font-semibold">Welcome to boqs</h1>
          <p className="text-gray-400 mt-2">
            Your question bank and quiz platform.
          </p>
        </>
      )}
    </div>
  );
}
