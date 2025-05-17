import Link from "next/link";
import LoginButton from "./LoginButton";

export default function NavBar() {
  return (
    <nav className="w-full z-50">
      <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-3xl font-bold" style={{ fontFamily: "Comfortaa" }}>
          <Link href="/">boqs</Link>
        </div>
        <LoginButton />
      </div>
    </nav>
  );
}
