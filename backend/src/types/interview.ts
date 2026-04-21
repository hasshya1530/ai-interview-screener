export type Score = {
  clarity: number;
  confidence: number;
  communication: number;
  [key: string]: number;
};

export type InterviewRequest = {
  answer?: string;
  role: string;
  mode: string;
  history?: string[];
  scores?: Score[];
};
