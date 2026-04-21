import cors from "cors";
import dotenv from "dotenv";
import express, { type NextFunction, type Request, type Response } from "express";
import swaggerUi from "swagger-ui-express";
import { ZodError } from "zod";
import interviewRouter from "./routes/interview";
import { buildOpenApiSpec } from "./swagger";

dotenv.config();

const app = express();
const port = Number(process.env.PORT ?? 8000);

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

const openApiSpec = buildOpenApiSpec();
app.get("/openapi.json", (_req, res) => {
  res.json(openApiSpec);
});
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiSpec));

app.use(interviewRouter);

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (error instanceof ZodError) {
    return res.status(400).json({
      error: "Invalid request payload",
      details: error.issues
    });
  }

  const message = error instanceof Error ? error.message : "Internal server error";
  return res.status(500).json({ error: message });
});

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
