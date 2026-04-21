import { useState } from "react";
import { ROLES } from "../constants/roles";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

export default function Landing({ start }) {
  const [mode, setMode] = useState("");
  const [role, setRole] = useState("");

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center justify-center gap-8 px-4 py-10">
      <div className="space-y-3 text-center">
        <Badge variant="secondary">Maya AI Assistant</Badge>
        <h1 className="text-4xl font-bold tracking-tight text-slate-100 md:text-5xl">
          AI Interview Screener
        </h1>
        <p className="mx-auto max-w-2xl text-slate-300">
          Practice smarter or simulate a real interview and get evaluated like a real
          candidate.
        </p>
      </div>

      <div className="grid w-full gap-4 md:grid-cols-2">
        <Card
          className={`cursor-pointer border transition ${
            mode === "practice"
              ? "border-indigo-400 bg-indigo-500/10"
              : "border-slate-800 bg-slate-900/60 hover:border-slate-700"
          }`}
          onClick={() => setMode("practice")}
        >
          <CardContent className="space-y-2 p-5">
            <h3 className="text-lg font-semibold text-slate-100">Practice Mode</h3>
            <p className="text-sm text-slate-300">
              Get per-answer feedback to improve clarity, confidence, and communication.
            </p>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer border transition ${
            mode === "real"
              ? "border-indigo-400 bg-indigo-500/10"
              : "border-slate-800 bg-slate-900/60 hover:border-slate-700"
          }`}
          onClick={() => setMode("real")}
        >
          <CardContent className="space-y-2 p-5">
            <h3 className="text-lg font-semibold text-slate-100">Real Interview</h3>
            <p className="text-sm text-slate-300">
              No per-answer hints. Complete five questions and get your final evaluation.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="w-full max-w-xl space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
        <label className="block text-sm font-medium text-slate-200" htmlFor="role">
          Select Role
        </label>
        <select
          id="role"
          value={role}
          onChange={(event) => setRole(event.target.value)}
          className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none ring-indigo-500 focus:ring-2"
        >
          <option value="">Choose a role</option>
          {ROLES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <Button
          disabled={!mode || !role}
          onClick={() => start(mode, role)}
          className="w-full"
        >
          Start Interview
        </Button>
      </div>
    </div>
  );
}