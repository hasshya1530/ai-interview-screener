import { z } from "zod";

export const scoreSchema = z.object({
  clarity: z.number(),
  confidence: z.number(),
  communication: z.number()
}).passthrough();

export const interviewRequestSchema = z.object({
  answer: z.string().optional().default(""),
  role: z.string().min(1),
  mode: z.string().min(1),
  history: z.array(z.string()).optional().default([]),
  scores: z.array(scoreSchema).optional().default([])
});

export type InterviewRequestInput = z.infer<typeof interviewRequestSchema>;
