import { Router } from "express";
import { interviewRequestSchema } from "../schemas/interview";
import { evaluate } from "../services/evaluator";
import { getQuestion } from "../services/questionGenerator";

const router = Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     Score:
 *       type: object
 *       additionalProperties: true
 *       required: [clarity, confidence, communication]
 *       properties:
 *         clarity: { type: number }
 *         confidence: { type: number }
 *         communication: { type: number }
 *     InterviewRequest:
 *       type: object
 *       required: [role, mode]
 *       properties:
 *         answer:
 *           type: string
 *           default: ""
 *         role:
 *           type: string
 *         mode:
 *           type: string
 *         history:
 *           type: array
 *           items: { type: string }
 *           default: []
 *         scores:
 *           type: array
 *           items: { $ref: "#/components/schemas/Score" }
 *           default: []
 *     InterviewResponse:
 *       type: object
 *       required: [next_question, history, scores, feedback]
 *       properties:
 *         next_question: { type: string }
 *         history:
 *           type: array
 *           items: { type: string }
 *         scores:
 *           type: array
 *           items: { $ref: "#/components/schemas/Score" }
 *         feedback:
 *           oneOf:
 *             - { $ref: "#/components/schemas/Score" }
 *             - { type: "null" }
 *     FinalReportResponse:
 *       type: object
 *       properties:
 *         error: { type: string }
 *         metrics:
 *           type: object
 *           required: [clarity, confidence, communication]
 *           properties:
 *             clarity: { type: number }
 *             confidence: { type: number }
 *             communication: { type: number }
 *         decision:
 *           type: string
 *           enum: [Shortlisted, Needs Improvement]
 */

/**
 * @openapi
 * /interview:
 *   post:
 *     summary: Evaluate latest answer and generate next question
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/InterviewRequest"
 *     responses:
 *       "200":
 *         description: Next question, updated history, scores, and optional feedback
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/InterviewResponse"
 *       "400":
 *         description: Invalid request payload
 *       "500":
 *         description: Internal server error
 */
router.post("/interview", async (req, res, next) => {
  try {
    const parsed = interviewRequestSchema.parse(req.body);
    const scores = [...parsed.scores];

    let feedback = null;
    if (parsed.answer) {
      feedback = await evaluate(parsed.answer, parsed.mode);
      if (feedback) {
        scores.push(feedback);
      }
    }

    const nextQuestion = await getQuestion(parsed.role, parsed.history);
    const history = [...parsed.history, nextQuestion];

    return res.json({
      next_question: nextQuestion,
      history,
      scores,
      feedback
    });
  } catch (error) {
    return next(error);
  }
});

/**
 * @openapi
 * /final-report:
 *   post:
 *     summary: Compute final averaged metrics and decision
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/InterviewRequest"
 *     responses:
 *       "200":
 *         description: Final report (or error when no scores)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/FinalReportResponse"
 *       "400":
 *         description: Invalid request payload
 *       "500":
 *         description: Internal server error
 */
router.post("/final-report", (req, res, next) => {
  try {
    const parsed = interviewRequestSchema.parse(req.body);
    const { scores } = parsed;

    if (!scores.length) {
      return res.json({ error: "No valid answers" });
    }

    const average = (key: "clarity" | "confidence" | "communication"): number => {
      const value = scores.reduce((sum, score) => sum + Number(score[key]), 0) / scores.length;
      return Math.round(value * 10) / 10;
    };

    const clarity = average("clarity");
    const confidence = average("confidence");
    const communication = average("communication");
    const decision = clarity >= 6 ? "Shortlisted" : "Needs Improvement";

    return res.json({
      metrics: {
        clarity,
        confidence,
        communication
      },
      decision
    });
  } catch (error) {
    return next(error);
  }
});

export default router;
