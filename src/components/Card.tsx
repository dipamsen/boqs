"use client";

import Link from "next/link";

export default function Card({
  children,
  ...props
}: { children: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props} className="bg-zinc-900 p-4 rounded-xl shadow">
      {children}
    </div>
  );
}

export function ActionCard({
  children,
  ...props
}: {
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={[
        "bg-zinc-900 p-4 rounded-xl text-left shadow transition duration-200",
        props.className,
        props.disabled
          ? "opacity-50 cursor-not-allowed"
          : "cursor-pointer hover:bg-zinc-800",
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
      type="button"
    >
      {children}
    </button>
  );
}

export function LinkCard({
  children,
  ...props
}: {
  children: React.ReactNode;
} & React.ComponentProps<typeof Link>) {
  return (
    <Link
      className={[
        "bg-zinc-900 p-4 rounded-xl text-left shadow transition duration-200 cursor-pointer hover:bg-zinc-800",
        props.className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </Link>
  );
}
