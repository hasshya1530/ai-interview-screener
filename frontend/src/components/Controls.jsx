import { Mic, Square, Send } from "lucide-react";
import { Button } from "./ui/button";

export default function Controls({
  state,
  startRecording,
  stopRecording,
  submitAnswer,
}) {
  const busy = state === "processing";

  return (
    <div className="mt-4 flex flex-wrap gap-3">
      {state !== "recording" ? (
        <Button onClick={startRecording} disabled={busy}>
          <Mic className="mr-2 h-4 w-4" />
          Start Recording
        </Button>
      ) : (
        <Button variant="destructive" onClick={stopRecording}>
          <Square className="mr-2 h-4 w-4" />
          Stop Recording
        </Button>
      )}

      <Button onClick={submitAnswer} disabled={busy}>
        <Send className="mr-2 h-4 w-4" />
        {busy ? "Submitting..." : "Submit Answer"}
      </Button>
    </div>
  );
}