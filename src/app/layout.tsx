import type { Metadata } from "next";
import { Work_Sans, Comfortaa } from "next/font/google";
import "./globals.css";
import SessionWrapper from "@/components/SessionWrapper";
import NavBar from "@/components/NavBar";

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
  icons: "qlogo.png",
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
        <SessionWrapper>
          <main
            className="relative min-h-screen"
            style={{ fontFamily: "Work Sans" }}
          >
            <NavBar />
            <div className="pt-4 max-w-5xl mx-auto px-4">{children}</div>
          </main>
        </SessionWrapper>
      </body>
    </html>
  );
}
