import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export default function QuestionCard({ question }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base text-slate-100">Current Question</CardTitle>
      </CardHeader>
      <CardContent className="text-slate-200">
        {question || "Preparing your first interview question..."}
      </CardContent>
    </Card>
  );
}