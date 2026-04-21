import axios from "axios";

const API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.1-8b-instant";

type GroqMessage = {
  role: "user" | "system" | "assistant";
  content: string;
};

export async function callGroq(prompt: string): Promise<string> {
  const apiKey = process.env.GROK_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GROK_API_KEY");
  }

  const response = await axios.post(
    API_URL,
    {
      model: MODEL,
      messages: [{ role: "user", content: prompt } satisfies GroqMessage],
      temperature: 0.7
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      timeout: 15000
    }
  );

  const content = response.data?.choices?.[0]?.message?.content;
  if (typeof content !== "string") {
    throw new Error("Unexpected Groq response format");
  }
  return content;
}

export function extractJson(text: string): Record<string, unknown> | null {
  try {
    const cleaned = text.replace(/```json|```/g, "").trim();
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (!match) {
      return null;
    }
    const parsed = JSON.parse(match[0]);
    if (parsed && typeof parsed === "object") {
      return parsed as Record<string, unknown>;
    }
    return null;
  } catch {
    return null;
  }
}
