import { Alert } from "./ui/alert";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export default function Report({ reportData, restart }) {
  const report = reportData?.report;
  const metrics = report?.metrics;
  const decision = report?.decision;
  const reportError = report?.error;

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col justify-center gap-6 px-4 py-10">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-100">Final Report</h1>
        <p className="mt-2 text-slate-300">
          Review your evaluation results from the interview session.
        </p>
      </div>

      {reportError && (
        <Alert className="border-amber-400/50 bg-amber-500/10 text-amber-100">
          {reportError}
        </Alert>
      )}

      {metrics && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-slate-300">Clarity</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold text-slate-100">
              {metrics.clarity}/10
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-slate-300">Confidence</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold text-slate-100">
              {metrics.confidence}/10
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-slate-300">Communication</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold text-slate-100">
              {metrics.communication}/10
            </CardContent>
          </Card>
        </div>
      )}

      {decision && (
        <div className="flex justify-center">
          <Badge className="px-4 py-1 text-sm">{decision}</Badge>
        </div>
      )}

      {!metrics && !reportError && (
        <Alert className="border-slate-600 bg-slate-800/70 text-slate-100">
          No report data available for this session.
        </Alert>
      )}

      <div className="flex justify-center">
        <Button onClick={restart}>Start New Interview</Button>
      </div>
    </div>
  );
}