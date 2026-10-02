import assert from "node:assert/strict";
import { createServer } from "node:http";
import test from "node:test";
import { createApiApp } from "./api.js";

async function withServer(app, run) {
  const server = createServer(app);
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  try {
    await run(`http://127.0.0.1:${address.port}`);
  } finally {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  }
}

function createClientFactory({ response = { text: "A vector has magnitude and direction." }, error } = {}) {
  const calls = [];
  const clients = [];
  const createGeminiClient = (options) => {
    const client = {
      models: {
        generateContent: async (request) => {
          calls.push(request);
          if (error) throw error;
          return response;
        },
      },
    };
    clients.push({ options, client });
    return client;
  };
  return { calls, clients, createGeminiClient };
}

async function postChat(origin, body) {
  return fetch(`${origin}/api/unity-ai/chat`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

test("Gemini receives tutor instructions, context, language, and default model", async () => {
  const gemini = createClientFactory();
  const app = createApiApp({
    environment: { GEMINI_API_KEY: "test-gemini-key" },
    createGeminiClient: gemini.createGeminiClient,
  });

  await withServer(app, async (origin) => {
    const response = await postChat(origin, {
      message: "Explain Newton's second law",
      university: "Ambo University",
      course: "Physics",
      language: "om",
    });

    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), {
      success: true,
      reply: "A vector has magnitude and direction.",
    });
    assert.deepEqual(gemini.clients[0].options, {
      apiKey: "test-gemini-key",
      httpOptions: { timeout: 30_000 },
    });
    assert.equal(gemini.calls[0].model, "gemini-2.5-flash");
    assert.equal(gemini.calls[0].config.temperature, 0.3);
    assert.match(gemini.calls[0].config.systemInstruction, /Ambo University/);
    assert.match(gemini.calls[0].config.systemInstruction, /Psychology, Geography, History, Emerging Technologies, and Inclusiveness/);
    assert.match(gemini.calls[0].config.systemInstruction, /Semesters 1 and 2/);
    assert.match(gemini.calls[0].config.systemInstruction, /Never invent campus facilities/);
    assert.match(gemini.calls[0].contents, /University context: Ambo University/);
    assert.match(gemini.calls[0].contents, /Course context: Physics/);
    assert.match(gemini.calls[0].contents, /Response language: om/);
    assert.equal(response.headers.get("cache-control"), "no-store");
    assert.equal(response.headers.get("x-powered-by"), null);
  });
});

test("configured model and language pass through to Gemini", async () => {
  const gemini = createClientFactory({ response: { text: "ምሳሌ መልስ።" } });
  const app = createApiApp({
    environment: { GEMINI_API_KEY: "test-key", GEMINI_MODEL: "gemini-test-model" },
    createGeminiClient: gemini.createGeminiClient,
  });

  await withServer(app, async (origin) => {
    const response = await postChat(origin, { message: "Explain gravity", language: "am" });
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { success: true, reply: "ምሳሌ መልስ።" });
    assert.equal(gemini.calls[0].model, "gemini-test-model");
    assert.match(gemini.calls[0].contents, /Response language: am/);
  });
});

test("missing or placeholder Gemini API keys return a clear 503 without creating a client", async () => {
  for (const environment of [{}, { GEMINI_API_KEY: "" }, { GEMINI_API_KEY: "your_gemini_api_key_here" }]) {
    let clientCreated = false;
    const app = createApiApp({
      environment,
      createGeminiClient: () => {
        clientCreated = true;
        throw new Error("Client must not be created.");
      },
    });

    await withServer(app, async (origin) => {
      const response = await postChat(origin, { message: "Explain vectors" });
      assert.equal(response.status, 503);
      assert.match((await response.json()).error, /valid GEMINI_API_KEY in the root \.env/);
      assert.equal(clientCreated, false);
    });
  }
});

test("invalid Gemini API keys are reported as configuration errors", async () => {
  for (const error of [
    Object.assign(new Error("API key not valid. Please pass a valid API key."), { status: 400 }),
    Object.assign(new Error("Forbidden"), { status: 403 }),
  ]) {
    const gemini = createClientFactory({ error });
    const app = createApiApp({
      environment: { GEMINI_API_KEY: "invalid-test-key" },
      createGeminiClient: gemini.createGeminiClient,
    });

    await withServer(app, async (origin) => {
      const response = await postChat(origin, { message: "Explain vectors" });
      assert.equal(response.status, 503);
      assert.match((await response.json()).error, /GEMINI_API_KEY is invalid/);
    });
  }
});

test("Gemini configuration is read from process.env for each request", async () => {
  const previousApiKey = process.env.GEMINI_API_KEY;
  const previousModel = process.env.GEMINI_MODEL;
  const previousOpenAiKey = process.env.OPENAI_API_KEY;
  const gemini = createClientFactory({ response: { text: "Ready." } });
  const app = createApiApp({ createGeminiClient: gemini.createGeminiClient });

  try {
    delete process.env.GEMINI_API_KEY;
    delete process.env.OPENAI_API_KEY;
    process.env.GEMINI_MODEL = "late-configured-model";
    await withServer(app, async (origin) => {
      const unconfiguredResponse = await postChat(origin, { message: "Hello" });
      assert.equal(unconfiguredResponse.status, 503);

      process.env.GEMINI_API_KEY = "configured-after-app-start";
      const configuredResponse = await postChat(origin, { message: "Hello" });
      assert.equal(configuredResponse.status, 200);
      assert.deepEqual(await configuredResponse.json(), { success: true, reply: "Ready." });
      assert.equal(gemini.clients[0].options.apiKey, "configured-after-app-start");
      assert.equal(gemini.calls[0].model, "late-configured-model");
    });
  } finally {
    if (previousApiKey === undefined) delete process.env.GEMINI_API_KEY;
    else process.env.GEMINI_API_KEY = previousApiKey;
    if (previousModel === undefined) delete process.env.GEMINI_MODEL;
    else process.env.GEMINI_MODEL = previousModel;
    if (previousOpenAiKey === undefined) delete process.env.OPENAI_API_KEY;
    else process.env.OPENAI_API_KEY = previousOpenAiKey;
  }
});

test("chat endpoint rejects invalid, oversized, and unsupported requests", async () => {
  const app = createApiApp({ environment: {} });
  await withServer(app, async (origin) => {
    const invalidLanguage = await postChat(origin, { message: "Hello", language: "fr" });
    assert.equal(invalidLanguage.status, 400);
    assert.match((await invalidLanguage.json()).error, /language must be/);

    const invalidJson = await fetch(`${origin}/api/unity-ai/chat`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "{",
    });
    assert.equal(invalidJson.status, 400);

    const oversized = await postChat(origin, { message: "a".repeat(17_000) });
    assert.equal(oversized.status, 413);

    const wrongMethod = await fetch(`${origin}/api/unity-ai/chat`);
    assert.equal(wrongMethod.status, 405);
    assert.equal(wrongMethod.headers.get("allow"), "POST");

    const notFound = await fetch(`${origin}/api/not-found`);
    assert.equal(notFound.status, 404);
  });
});

test("empty Gemini responses fail explicitly", async () => {
  const gemini = createClientFactory({ response: { text: "  " } });
  const app = createApiApp({
    environment: { GEMINI_API_KEY: "test-key" },
    createGeminiClient: gemini.createGeminiClient,
  });

  await withServer(app, async (origin) => {
    const response = await postChat(origin, { message: "Explain vectors" });
    assert.equal(response.status, 502);
    assert.match((await response.json()).error, /Gemini returned an empty response/);
  });
});
