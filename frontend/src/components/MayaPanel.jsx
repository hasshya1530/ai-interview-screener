import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";

export default function MayaPanel({ state, mode }) {
  const getStatus = () => {
    if (state === "recording") return "Listening...";
    if (state === "processing") return "Thinking...";
    return "Ready";
  };

  return (
    <Card className="w-full border-slate-800 bg-slate-900/70 md:w-80">
      <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
        <img
          src="/avatar.png"
          alt="Maya interviewer avatar"
          className="h-24 w-24 rounded-full border border-slate-700 object-cover"
          onError={(event) => {
            event.currentTarget.src =
              "https://api.dicebear.com/9.x/bottts/svg?seed=MayaInterviewer";
          }}
        />
        <h2 className="text-xl font-semibold text-slate-100">Maya</h2>
        <p className="text-sm text-slate-400">AI Interviewer</p>

        <Badge variant="secondary">
          {mode === "practice" ? "Practice Mode" : "Real Interview"}
        </Badge>

        <p className="text-sm text-indigo-200">{getStatus()}</p>
      </CardContent>
    </Card>
  );
}