"use client";

export default function PrimaryButton({
  children,
  compact = false,
  ...props
}: {
  children: React.ReactNode;
  compact?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={[
        "bg-blue-500 text-white  rounded-lg  transition duration-200",
        props.className,
        props.disabled
          ? "opacity-50 cursor-not-allowed"
          : "cursor-pointer hover:bg-blue-600",
        compact ? "px-2 py-1 text-sm" : "px-4 py-2 text-base",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </button>
  );
}
