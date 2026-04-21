import { callGroq, extractJson } from "./groqClient";
import type { Score } from "../types/interview";

export async function evaluate(answer: string, _mode: string): Promise<Score | null> {
  if (!answer || answer.trim() === "") {
    return null;
  }

  const prompt = `
Evaluate this answer:

"${answer}"

Return JSON:
{
  "clarity": number,
  "confidence": number,
  "communication": number
}
`;

  try {
    const response = await callGroq(prompt);
    const parsed = extractJson(response);
    if (parsed) {
      const clarity = Number(parsed.clarity);
      const confidence = Number(parsed.confidence);
      const communication = Number(parsed.communication);
      if (
        Number.isFinite(clarity) &&
        Number.isFinite(confidence) &&
        Number.isFinite(communication)
      ) {
        return { clarity, confidence, communication };
      }
    }
  } catch {
    // Keep behavior parity with Python fallback.
  }

  return { clarity: 5, confidence: 5, communication: 5 };
}
