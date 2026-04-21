import { callGroq, extractJson } from "./groqClient";

export async function getQuestion(role: string, history: string[]): Promise<string> {
  const prompt = `
You are an AI interviewer.

Generate ONE unique interview question for ${role}.

Rules:
- Do NOT repeat previous questions
- Keep it short
- Max total questions = 5

Previous questions:
${JSON.stringify(history)}

Return JSON:
{ "question": "..." }
`;

  try {
    const response = await callGroq(prompt);
    const parsed = extractJson(response);
    if (parsed && typeof parsed.question === "string" && parsed.question.trim().length > 0) {
      return parsed.question;
    }
  } catch {
    // Keep behavior parity with Python fallback.
  }

  return `Question ${history.length + 1}: Explain a concept in ${role}.`;
}
