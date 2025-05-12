import NavBar from "@/components/NavBar";
import HomeContent from "./Content";

export default function Home() {
  return (
    <main className="relative min-h-screen" style={{ fontFamily: "Work Sans" }}>
      <NavBar />
      <HomeContent />
    </main>
  );
}
