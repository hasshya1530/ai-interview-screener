import { useEffect, useState, useRef } from "react";
import { getReport, sendAnswer } from "../services/api";
import MayaPanel from "./MayaPanel";
import Controls from "./Controls";
import QuestionCard from "./QuestionCard";
import { Alert } from "./ui/alert";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

export default function Interview({ mode, role, finish }) {
  const [question, setQuestion] = useState("");
  const [state, setState] = useState("idle");
  const [history, setHistory] = useState([]);
  const [scores, setScores] = useState([]);
  const [transcript, setTranscript] = useState("");
  const [time, setTime] = useState(60);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState(null);

  const recognitionRef = useRef(null);

  const speak = (text, cb) => {
    if (!window.speechSynthesis) {
      cb?.();
      return;
    }
    const speech = new SpeechSynthesisUtterance(text);
    speech.rate = 0.95;
    speech.onend = () => cb?.();
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(speech);
  };

  useEffect(() => {
    fetchNext("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchNext = async (ans) => {
    setState("processing");
    setError("");

    try {
      const res = await sendAnswer({
        answer: ans,
        role,
        mode,
        history,
        scores,
      });

      const updatedHistory = res.data.history ?? [];
      const updatedScores = res.data.scores ?? [];
      const nextQ = res.data.next_question ?? "";

      setHistory(updatedHistory);
      setScores(updatedScores);
      setQuestion(nextQ);
      setFeedback(mode === "practice" ? res.data.feedback : null);

      if (updatedHistory.length >= 5) {
        const reportRes = await getReport({
          role,
          mode,
          history: updatedHistory,
          scores: updatedScores,
        });
        finish({
          mode,
          role,
          history: updatedHistory,
          scores: updatedScores,
          report: reportRes.data,
        });
        return;
      }

      setTime(60);
      if (ans) {
        setTranscript("");
      }
      speak(nextQ, () => setState("idle"));
    } catch (err) {
      const message =
        err?.response?.data?.error ||
        "Something went wrong while contacting the backend. Please retry.";
      setError(message);
      setState("idle");
    }
  };

  useEffect(() => {
    if (state === "recording" && time > 0) {
      const timerId = setTimeout(() => setTime((current) => current - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [time, state]);

  useEffect(() => {
    if (state === "recording" && time === 0) {
      stopRecording();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time]);

  const startRecording = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("Speech recognition is not supported in this browser. Type your answer.");
      return;
    }

    setError("");
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";

    recognition.start();
    recognitionRef.current = recognition;
    setState("recording");

    recognition.onresult = (event) => {
      setTranscript(event.results[0][0].transcript);
    };

    recognition.onerror = () => {
      setError("Unable to capture voice input. You can type your answer instead.");
      setState("idle");
    };

    recognition.onend = () => setState("idle");
  };

  const stopRecording = () => {
    recognitionRef.current?.stop();
  };

  const submitAnswer = () => {
    const answer = transcript.trim();
    if (!answer) {
      setError("Please record or type an answer before submitting.");
      return;
    }

    fetchNext(answer);
  };

  const questionCount = history.length;

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-4 py-6 md:flex-row md:px-8">
      <MayaPanel state={state} mode={mode} />

      <section className="flex-1 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-slate-100">Interview in Progress</h2>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{questionCount}/5 Questions</Badge>
            {state === "recording" && <Badge>{time}s left</Badge>}
          </div>
        </div>

        <QuestionCard question={question} />

        {mode === "practice" && feedback && (
          <div className="mt-4 rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-3 text-sm text-indigo-100">
            <p className="font-medium">Last Answer Feedback</p>
            <p>Clarity: {feedback.clarity}</p>
            <p>Confidence: {feedback.confidence}</p>
            <p>Communication: {feedback.communication}</p>
          </div>
        )}

        <div className="mt-4">
          <label className="mb-2 block text-sm font-medium text-slate-200" htmlFor="answer">
            Your Answer
          </label>
          <Textarea
            id="answer"
            value={transcript}
            onChange={(event) => setTranscript(event.target.value)}
            placeholder="Speak or type your answer here..."
            disabled={state === "processing"}
            className="min-h-28"
          />
        </div>

        {error && (
          <Alert className="mt-4 border-red-500/40 bg-red-500/10 text-red-100">{error}</Alert>
        )}

        <Controls
          state={state}
          startRecording={startRecording}
          stopRecording={stopRecording}
          submitAnswer={submitAnswer}
        />

        {error && (
          <div className="mt-3 flex justify-end">
            <Button
              variant="outline"
              onClick={() => {
                if (!question) {
                  fetchNext("");
                  return;
                }
                if (transcript.trim()) {
                  fetchNext(transcript.trim());
                  return;
                }
                setError("Add an answer to retry submission.");
              }}
              disabled={state === "processing"}
            >
              Retry
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}