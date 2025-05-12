import type { Metadata } from "next";
import { Work_Sans, Comfortaa } from "next/font/google";
import "./globals.css";
import SessionWrapper from "@/components/SessionWrapper";

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
});

const comfortaa = Comfortaa({
  variable: "--font-comfortaa",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "boqs | Quizzes for everyone",
  description: "boqs is a platform for quizzes",
  icons: "boqs.png",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${workSans.variable} ${comfortaa.variable} antialiased`}
      >
        <SessionWrapper>{children}</SessionWrapper>
      </body>
    </html>
  );
}
