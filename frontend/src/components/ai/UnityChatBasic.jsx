import { useEffect, useRef, useState } from "react";

const ASK_ENDPOINT = "/api/ai/ask";
const UNITY_OBJECT = "AgentObject";
const UNITY_METHOD = "ReceiveResponse";
const REQUEST_TIMEOUT_MS = 30000;

/**
 * Forward a Gemini reply into the Unity WebGL runtime.
 * The GameObject "AgentObject" must expose ReceiveResponse(string).
 */
export function sendReplyToUnityAgent(reply) {
  const unityInstance = window.unityInstance;

  if (typeof unityInstance?.SendMessage !== "function") {
    console.warn("Unity WebGL instance is not ready; skipping SendMessage.");
    return false;
  }

  unityInstance.SendMessage(UNITY_OBJECT, UNITY_METHOD, reply);
  return true;
}

export default function UnityChat() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("");
  const listRef = useRef(null);

  useEffect(() => {
    listRef.current?.lastElementChild?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const sendPrompt = async (event) => {
    event.preventDefault();

    const text = prompt.trim();
    if (!text || isLoading) {
      return;
    }

    setPrompt("");
    setStatus("");
    setIsLoading(true);
    setMessages((current) => [
      ...current,
      { id: `user-${Date.now()}`, role: "user", content: text },
    ]);

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(ASK_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: text }),
        signal: controller.signal,
      });

      const data = await response.json();
      if (!response.ok || !data?.success || typeof data.reply !== "string") {
        throw new Error(data?.error || "The AI service could not complete your request.");
      }

      const deliveredToUnity = sendReplyToUnityAgent(data.reply);
      setStatus(
        deliveredToUnity
          ? `Agent action: ${data.action || "talk"}`
          : "Reply ready. Unity WebGL is not connected."
      );

      setMessages((current) => [
        ...current,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: data.reply,
          action: data.action,
        },
      ]);
    } catch (error) {
      const message =
        error.name === "AbortError"
          ? "The request timed out. Please try again."
          : error.message || "Could not reach the freshman-exam AI service.";

      setMessages((current) => [
        ...current,
        { id: `error-${Date.now()}`, role: "assistant", content: message },
      ]);
    } finally {
      window.clearTimeout(timeoutId);
      setIsLoading(false);
    }
  };

  return (
    <section className="flex h-[32rem] w-full max-w-md flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
      <header className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-white">
        <h2 className="text-sm font-semibold">Freshman Exam Assistant</h2>
        <p className="text-[11px] text-indigo-100">Gemini + Unity WebGL agent</p>
      </header>

      <div ref={listRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-slate-50 px-3 py-3">
        {messages.length === 0 && (
          <p className="rounded-2xl bg-white p-3 text-xs text-slate-500 shadow-sm">
            Ask a freshman exam question. The reply is shown here and sent to Unity
            via <code>AgentObject.ReceiveResponse</code>.
          </p>
        )}

        {messages.map((message) => (
          <article
            key={message.id}
            className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${
              message.role === "user"
                ? "ml-auto bg-indigo-600 text-white"
                : "bg-white text-slate-700 shadow-sm"
            }`}
          >
            {message.content}
          </article>
        ))}

        {isLoading && (
          <p className="text-xs font-medium text-indigo-500" role="status">
            Thinking…
          </p>
        )}
      </div>

      <form className="border-t border-slate-200 bg-white p-3" onSubmit={sendPrompt}>
        {status && <p className="mb-2 text-[11px] text-slate-500">{status}</p>}
        <div className="flex gap-2">
          <input
            className="min-h-10 flex-1 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-indigo-400"
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder="Ask about physics, math, chemistry…"
            disabled={isLoading}
            aria-label="Exam question"
          />
          <button
            className="rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white disabled:bg-slate-300"
            type="submit"
            disabled={isLoading || !prompt.trim()}
          >
            Send
          </button>
        </div>
      </form>
    </section>
  );
}
