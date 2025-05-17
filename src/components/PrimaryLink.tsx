"use client";

import Link from "next/link";
import { ComponentProps } from "react";

export default function PrimaryLink({
  children,
  to,
  ...props
}: {
  children: React.ReactNode;
  to: string;
} & Omit<ComponentProps<typeof Link>, "href">) {
  return (
    <Link
      {...props}
      href={to}
      className={[
        "bg-blue-500 text-white py-2 px-4 rounded-lg  transition duration-200 inline-block",
        props.className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </Link>
  );
}
