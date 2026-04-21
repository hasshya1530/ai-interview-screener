import { useState } from "react";
import Landing from "./components/Landing";
import Interview from "./components/Interview";
import Report from "./components/Report";

export default function App() {
  const [screen, setScreen] = useState("landing");
  const [mode, setMode] = useState("");
  const [role, setRole] = useState("");
  const [reportData, setReportData] = useState(null);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      {screen === "landing" && (
        <Landing
          start={(m, r) => {
            setMode(m);
            setRole(r);
            setReportData(null);
            setScreen("interview");
          }}
        />
      )}

      {screen === "interview" && (
        <Interview
          mode={mode}
          role={role}
          finish={(data) => {
            setReportData(data);
            setScreen("report");
          }}
        />
      )}

      {screen === "report" && (
        <Report
          reportData={reportData}
          restart={() => {
            setMode("");
            setRole("");
            setReportData(null);
            setScreen("landing");
          }}
        />
      )}
    </main>
  );
}