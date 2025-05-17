"use client";

import { useSession } from "next-auth/react";

export default function SessionGate({
  notLoggedIn,
  loggedIn,
}: {
  notLoggedIn: React.ReactNode;
  loggedIn: React.ReactNode;
}) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="pt-40 text-center">Loading...</div>;
  }

  if (session) {
    return loggedIn;
  } else {
    return notLoggedIn;
  }
}
