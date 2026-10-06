const express = require("express");
const { GoogleGenAI } = require("@google/genai");

const router = express.Router();

const SYSTEM_INSTRUCTION =
  "You are Unity AI, an expert academic tutor for Ethiopian University Freshman students across Ambo, Addis Ababa (AAU), Jimma, Hawassa, and ASTU Universities. You specialize in all Freshman Common Courses (Natural & Social Science, Semesters 1 & 2) including Applied Math, Physics, Chemistry, Logic, Communicative English, Psychology, Geography, History, Emerging Tech, and Inclusiveness. Respond accurately and concisely in the requested language (Afaan Oromoo, English, or Amharic).";

const QUIZ_SYSTEM_INSTRUCTION =
  'You are Unity AI, an expert academic tutor for Ethiopian University Freshman students. Convert the supplied exam paper or notes into a quiz. Return ONLY valid JSON, with no markdown code fences and no explanatory prose outside the JSON. The JSON must have this exact top-level shape: {"quiz":[{"id":1,"question":"Question text","options":[{"id":"A","text":"Option A"},{"id":"B","text":"Option B"},{"id":"C","text":"Option C"},{"id":"D","text":"Option D"}],"correctAnswer":"A","explanation":"Step-by-step academic explanation"}]}. Every question must have exactly four options with ids A, B, C, and D, one correctAnswer matching one option id, and an accurate step-by-step explanation. Use sequential integer ids beginning at 1. Do not invent facts not supported by the source.';

const LANGUAGE_NAMES = {
  om: "Afaan Oromoo",
  en: "English",
  am: "Amharic"
};

function getConfiguredModel() {
  return process.env.GEMINI_MODEL?.trim() || "gemini-3.8-flash";
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

function isValidQuizResponse(value, expectedQuestionCount) {
  if (
    !value ||
    typeof value !== "object" ||
    !Array.isArray(value.quiz) ||
    value.quiz.length !== expectedQuestionCount
  ) {
    return false;
  }

  return value.quiz.every(
    (question, index) =>
      question &&
      question.id === index + 1 &&
      typeof question.question === "string" &&
      question.question.trim() &&
      Array.isArray(question.options) &&
      question.options.length === 4 &&
      question.options.every(
        (option, optionIndex) =>
          option &&
          option.id === ["A", "B", "C", "D"][optionIndex] &&
          typeof option.text === "string" &&
          option.text.trim()
      ) &&
      ["A", "B", "C", "D"].includes(question.correctAnswer) &&
      typeof question.explanation === "string" &&
      question.explanation.trim()
  );
}

router.post("/chat", async (req, res) => {
  const { message, university, course, language = "en" } = req.body || {};

  if (typeof message !== "string" || !message.trim()) {
    return res.status(400).json({
      success: false,
      error: "A non-empty message is required."
    });
  }

  if (!Object.hasOwn(LANGUAGE_NAMES, language)) {
    return res.status(400).json({
      success: false,
      error: "Language must be one of: om, en, am."
    });
  }

  const apiKey = process.env.GEMINI_API_KEY?.trim();

  if (!apiKey) {
    return res.status(503).json({
      success: false,
      message: "Gemini API Key is missing in .env configuration."
    });
  }

  const context = [
    typeof university === "string" && university.trim()
      ? `University: ${university.trim()}`
      : "",
    typeof course === "string" && course.trim()
      ? `Course: ${course.trim()}`
      : ""
  ]
    .filter(Boolean)
    .join("\n");

  const prompt = [
    `Respond in ${LANGUAGE_NAMES[language]}.`,
    context,
    message.trim()
  ]
    .filter(Boolean)
    .join("\n\n");

  try {
    const ai = new GoogleGenAI({ apiKey });
    const result = await ai.models.generateContent({
      model: getConfiguredModel(),
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION
      }
    });
    const reply = result.text?.trim();

    if (!reply) {
      return res.status(502).json({
        success: false,
        error: "Unity AI returned an empty response."
      });
    }

    return res.json({ success: true, reply });
  } catch (error) {
    if (isCredentialError(error)) {
      return res.status(503).json({
        success: false,
        message: "Gemini API Key is missing in .env configuration."
      });
    }

    const providerStatus = error.status || error.statusCode;
    const status =
      providerStatus === 429
        ? 429
        : providerStatus === 400
          ? 400
          : 500;
    const message =
      status === 429
        ? "Gemini quota or rate limit exceeded. Please try again later."
        : status === 400
          ? "Gemini rejected the chat request."
          : "Unity AI could not generate a response. Please try again.";

    console.error("Unity AI request failed:", error.message);
    return res.status(status).json({ success: false, message });
  }
});

router.post("/generate-mock-quiz", async (req, res) => {
  const { rawExamText, numberOfQuestions = 10 } = req.body || {};

  if (typeof rawExamText !== "string" || !rawExamText.trim()) {
    return res.status(400).json({
      error: "A non-empty rawExamText string is required."
    });
  }

  if (
    !Number.isInteger(numberOfQuestions) ||
    numberOfQuestions < 1 ||
    numberOfQuestions > 50
  ) {
    return res.status(400).json({
      error: "numberOfQuestions must be an integer between 1 and 50."
    });
  }

  const apiKey = process.env.GEMINI_API_KEY?.trim();

  if (!apiKey) {
    return res.status(503).json({
      success: false,
      message: "Gemini API Key is missing in .env configuration."
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const result = await ai.models.generateContent({
      model: getConfiguredModel(),
      contents: `Create exactly ${numberOfQuestions} multiple-choice questions from this source material:\n\n${rawExamText.trim()}`,
      config: {
        systemInstruction: QUIZ_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json"
      }
    });
    const generatedText = result.text?.trim();

    if (!generatedText) {
      return res.status(500).json({
        error: "Gemini returned an empty quiz response."
      });
    }

    let quizResponse;

    try {
      quizResponse = JSON.parse(generatedText);
    } catch {
      return res.status(500).json({
        error: "Gemini returned invalid JSON for the quiz."
      });
    }

    if (!isValidQuizResponse(quizResponse, numberOfQuestions)) {
      return res.status(500).json({
        error: "Gemini returned a quiz that does not match the required format."
      });
    }

    return res.json(quizResponse);
  } catch (error) {
    if (isCredentialError(error)) {
      return res.status(503).json({
        success: false,
        message: "Gemini API Key is missing in .env configuration."
      });
    }

    const providerStatus = error.status || error.statusCode;
    const status =
      providerStatus === 429
        ? 429
        : providerStatus === 400
          ? 400
          : 500;
    const message =
      status === 429
        ? "Gemini quota or rate limit exceeded. Please try again later."
        : status === 400
          ? "Gemini rejected the quiz generation request."
          : "Unity AI could not generate a quiz. Please try again.";

    console.error("Unity AI quiz generation failed:", error.message);
    return res.status(status).json({ error: message });
  }
});

router.get("/health", async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  if (!apiKey) {
    return res.status(503).json({
      success: false,
      message: "Gemini API Key is missing in .env configuration."
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    await ai.models.get({ model: getConfiguredModel() });

    return res.json({
      status: "ok",
      apiKeyConfigured: true,
      model: getConfiguredModel()
    });
  } catch (error) {
    if (isCredentialError(error)) {
      return res.status(503).json({
        success: false,
        message: "Gemini API Key is missing in .env configuration."
      });
    }

    const status = error.status === 429 || error.statusCode === 429 ? 429 : 500;
    console.error("Unity AI health check failed:", error.message);
    return res.status(status).json({
      success: false,
      message: "Unity AI health check could not reach Gemini."
    });
  }
});

module.exports = router;
