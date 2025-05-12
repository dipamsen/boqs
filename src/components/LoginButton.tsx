"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";

export default function LoginButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="flex items-center space-x-2">
        <Image
          src={session.user?.image || ""}
          alt="User Avatar"
          className="rounded-full mr-2"
          width={32}
          height={32}
        />
        <span className="text-sm font-medium mr-4">{session.user?.name}</span>

        <a
          href="/api/auth/signout"
          className="text-sm font-medium hover:text-gray-300 transition-colors"
        >
          Logout
        </a>
      </div>
    );
  }
  return (
    <a
      href="/api/auth/signin"
      className="text-sm font-medium hover:text-gray-300 transition-colors"
    >
      Login
    </a>
  );
}
