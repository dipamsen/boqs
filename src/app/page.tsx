import Dashboard from "@/components/Dashboard";
import SessionGate from "@/components/SessionGate";

export default function Home() {
  return (
    <SessionGate
      loggedIn={<Dashboard />}
      notLoggedIn={
        <div className="pt-20 text-center">
          <h1 className="text-3xl font-semibold">Welcome to boqs</h1>
          <p className="text-gray-400 mt-2">
            Your question bank and quiz platform.
          </p>
        </div>
      }
    />
  );
}
