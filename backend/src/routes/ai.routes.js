const express = require("express");
const { GoogleGenAI } = require("@google/genai");

const router = express.Router();

/** Freshman-exam tutor persona applied to every Gemini request. */
const SYSTEM_INSTRUCTION =
  "You are an intelligent assistant for freshman university students preparing for exams. Provide concise, clear, and accurate answers.";

const DEFAULT_MODEL = "gemini-3.8-flash";
const DEFAULT_ACTION = "talk";

function getGeminiModel() {
  return process.env.GEMINI_MODEL?.trim() || DEFAULT_MODEL;
}

function isCredentialError(error) {
  const status = error.status || error.statusCode;
  const details = `${error.code || ""} ${error.message || ""}`;

  return (
    status === 401 ||
    status === 403 ||
    /API_KEY_INVALID|(?:invalid|not valid).*api.?key|api.?key.*(?:invalid|not valid)/i.test(
      details
    )
  );
}

/**
 * Infer a lightweight Unity animation cue from the model reply.
 * The WebGL agent can map these strings to Animator states.
 */
function inferAgentAction(reply) {
  const text = reply.toLowerCase();

  if (/\b(sorry|cannot|can't|unable|error)\b/.test(text)) {
    return "idle";
  }

  if (/\b(great|well done|correct|nice work|excellent)\b/.test(text)) {
    return "celebrate";
  }

  return DEFAULT_ACTION;
}

/**
 * POST /ask
 * Body: { prompt: string }
 * Success: { success: true, reply: string, action: string }
 */
router.post("/ask", async (req, res) => {
  const { prompt } = req.body || {};

  if (typeof prompt !== "string" || !prompt.trim()) {
    return res.status(400).json({
      success: false,
      error: "A non-empty prompt is required.",
    });
  }

  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    return res.status(503).json({
      success: false,
      error: "The AI service is not configured.",
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const result = await ai.models.generateContent({
      model: getGeminiModel(),
      contents: prompt.trim(),
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });

    const reply = result.text?.trim();
    if (!reply) {
      return res.status(502).json({
        success: false,
        error: "The AI service returned an empty response.",
      });
    }

    return res.json({
      success: true,
      reply,
      action: inferAgentAction(reply),
    });
  } catch (error) {
    const providerStatus = error.status || error.statusCode;
    const credentialsInvalid = isCredentialError(error);
    const status =
      providerStatus === 429 ? 429 : credentialsInvalid ? 503 : 502;

    console.error("AI request failed:", error.message);

    return res.status(status).json({
      success: false,
      error:
        status === 429
          ? "The AI service is busy. Please try again later."
          : status === 503
            ? "The AI service credentials are invalid."
            : "The AI service could not complete your request.",
    });
  }
});

module.exports = router;
