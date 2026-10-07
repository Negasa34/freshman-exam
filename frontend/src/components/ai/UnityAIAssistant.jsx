import { useEffect, useRef, useState } from "react";
import {
  Bot,
  Check,
  ChevronDown,
  Clipboard,
  LoaderCircle,
  Plus,
  Send,
  Sparkles,
  X,
} from "lucide-react";

const CHAT_ENDPOINT = "/api/unity-ai/chat";
const DEFAULT_MODEL = "gemini-2.5-flash";

const suggestions = [
  {
    label: "AAU",
    detail: "Freshman exam preparation",
    university: "Addis Ababa University (AAU)",
    course: "",
    message: "Help me prepare for my upcoming freshman exams at AAU.",
  },
  {
    label: "ASTU",
    detail: "Courses and exam review",
    university: "Adama Science and Technology University (ASTU)",
    course: "",
    message: "Help me review freshman courses and exams at ASTU.",
  },
  {
    label: "JU",
    detail: "Study plan and past papers",
    university: "Jimma University (JU)",
    course: "",
    message: "Help me make a study plan for freshman exams at Jimma University.",
  },
  {
    label: "Physics & Math",
    detail: "Work through a course topic",
    university: "",
    course: "Physics and Applied Mathematics",
    message: "Help me revise freshman Physics vectors and Applied Mathematics integration.",
  },
];

const languages = [
  { code: "en", label: "English" },
  { code: "om", label: "Afaan Oromoo" },
  { code: "am", label: "አማርኛ" },
];

const welcomeMessage = {
  id: "unity-welcome",
  role: "assistant",
  content:
    "Selam! I’m Unity AI, your freshman study partner. Ask a question or choose a university or course to get started.",
};

function createMessage(role, content) {
  return { id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2)}`, role, content };
}

export default function UnityAIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([welcomeMessage]);
  const [inputValue, setInputValue] = useState("");
  const [language, setLanguage] = useState("en");
  const [model, setModel] = useState(DEFAULT_MODEL);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const textareaRef = useRef(null);
  const messagesEndRef = useRef(null);
  const requestControllerRef = useRef(null);
  const copyTimeoutRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [isOpen, isLoading, messages]);

  useEffect(
    () => () => {
      requestControllerRef.current?.abort();
      window.clearTimeout(copyTimeoutRef.current);
    },
    [],
  );

  const resetConversation = () => {
    requestControllerRef.current?.abort();
    requestControllerRef.current = null;
    setMessages([{ ...welcomeMessage, id: `unity-welcome-${Date.now()}` }]);
    setInputValue("");
    setIsLoading(false);
    setStatusMessage("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const sendMessage = async (rawText = inputValue, suggestion) => {
    const message = rawText.trim();
    if (!message || isLoading) return;

    const controller = new AbortController();
    requestControllerRef.current = controller;
    let timedOut = false;
    const timeoutId = window.setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, 30000);

    setMessages((current) => [...current, createMessage("user", message)]);
    setInputValue("");
    setStatusMessage("");
    setIsLoading(true);
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    try {
      const response = await fetch(CHAT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          language,
          university: suggestion?.university,
          course: suggestion?.course,
        }),
        signal: controller.signal,
      });

      let data;
      try {
        data = await response.json();
      } catch {
        throw new Error("The AI service returned an invalid response.");
      }

      if (!response.ok || !data?.success || typeof data.reply !== "string") {
        throw new Error(
          data?.error ||
            data?.message ||
            "Unity AI could not complete your request. Please try again.",
        );
      }

      if (typeof data.model === "string" && data.model.trim()) {
        setModel(data.model.trim());
      }
      setMessages((current) => [...current, createMessage("assistant", data.reply)]);
    } catch (error) {
      if (error.name === "AbortError" && !timedOut) return;
      const messageText =
        error.name === "AbortError"
          ? "The request took too long. Please try again."
          : error.message || "Could not reach Unity AI. Please try again.";
      setMessages((current) => [...current, createMessage("error", messageText)]);
    } finally {
      window.clearTimeout(timeoutId);
      if (requestControllerRef.current === controller) {
        requestControllerRef.current = null;
        setIsLoading(false);
      }
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    void sendMessage();
  };

  const handleTextareaKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      void sendMessage();
    }
  };

  const copyReply = async (message) => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopiedMessage(message.id);
      window.clearTimeout(copyTimeoutRef.current);
      copyTimeoutRef.current = window.setTimeout(() => setCopiedMessage(""), 1800);
    } catch {
      setStatusMessage("Could not copy the reply. Check your browser clipboard permissions.");
    }
  };

  const closeAssistant = () => {
    requestControllerRef.current?.abort();
    requestControllerRef.current = null;
    setIsLoading(false);
    setIsOpen(false);
  };

  return (
    <>
      {isOpen ? (
        <section
          className="fixed inset-0 z-[100] flex h-screen flex-col overflow-hidden bg-[#080d16] font-sans text-slate-100"
          aria-label="Unity AI exam preparation chat"
        >
          <header className="z-10 flex shrink-0 items-center gap-2 border-b border-white/[0.08] bg-[#0b111d]/95 px-3 py-3 backdrop-blur-xl sm:gap-3 sm:px-7">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-cyan-300/15 bg-cyan-300/10 text-cyan-200 sm:h-10 sm:w-10">
              <Sparkles aria-hidden="true" size={19} />
            </span>
            <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-2 gap-y-0.5">
              <h1 className="truncate text-sm font-semibold tracking-wide text-white sm:text-base">
                Unity AI
              </h1>
              <span className="rounded-full border border-cyan-300/15 bg-cyan-300/[0.07] px-2 py-0.5 font-mono text-[9px] text-cyan-200 sm:text-[10px]">
                {model}
              </span>
            </div>
            <label className="relative flex h-8 items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] pl-2 pr-2 text-xs text-slate-300 focus-within:border-cyan-300/40 sm:h-9 sm:pl-2.5">
              <span className="sr-only">Response language</span>
              <select
                className="max-w-[5.5rem] appearance-none bg-transparent pr-4 text-xs text-slate-200 outline-none sm:max-w-28 [&>option]:bg-slate-900"
                value={language}
                onChange={(event) => setLanguage(event.target.value)}
                aria-label="Response language"
              >
                {languages.map((option) => (
                  <option key={option.code} value={option.code}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                aria-hidden="true"
                className="pointer-events-none absolute right-2 text-slate-500"
                size={13}
              />
            </label>
            <button
              className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-slate-400 transition hover:bg-white/[0.07] hover:text-white focus-visible:outline-2 focus-visible:outline-cyan-300 sm:h-9 sm:w-9"
              type="button"
              onClick={resetConversation}
              aria-label="Start a new conversation"
              title="New conversation"
            >
              <Plus aria-hidden="true" size={18} />
            </button>
            <button
              className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-slate-400 transition hover:bg-white/[0.07] hover:text-white focus-visible:outline-2 focus-visible:outline-cyan-300 sm:h-9 sm:w-9"
              type="button"
              onClick={closeAssistant}
              aria-label="Close Unity AI"
              title="Close"
            >
              <X aria-hidden="true" size={18} />
            </button>
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
            <div className="mx-auto flex min-h-full w-full max-w-4xl flex-col px-4 py-6 sm:px-7 sm:py-9">
              {messages.map((message) => {
                const isUser = message.role === "user";
                const isError = message.role === "error";
                return (
                  <article
                    key={message.id}
                    className={`mb-5 flex items-start gap-3 ${
                      isUser ? "justify-end" : "justify-start"
                    }`}
                  >
                    {!isUser && (
                      <span
                        className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-xl ${
                          isError
                            ? "bg-rose-400/10 text-rose-300"
                            : "bg-cyan-300/10 text-cyan-200"
                        }`}
                      >
                        <Bot aria-hidden="true" size={16} />
                      </span>
                    )}
                    <div
                      className={`group max-w-[88%] sm:max-w-[78%] ${
                        isUser
                          ? "rounded-2xl rounded-tr-md bg-blue-600 px-4 py-3 text-white shadow-lg shadow-blue-950/20"
                          : isError
                            ? "rounded-2xl border border-rose-400/20 bg-rose-400/[0.06] px-4 py-3 text-rose-100"
                            : "rounded-2xl rounded-tl-md border border-cyan-200/[0.08] bg-[#111c2a] px-4 py-3 text-slate-200"
                      }`}
                    >
                      {!isUser && (
                        <div className="mb-1.5 flex items-center justify-between gap-4">
                          <p
                            className={`text-[10px] font-semibold uppercase tracking-[0.12em] ${
                              isError ? "text-rose-300" : "text-cyan-200"
                            }`}
                          >
                            {isError ? "Could not respond" : "Unity AI"}
                          </p>
                          {!isError && (
                            <button
                              className="inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-[10px] text-slate-500 opacity-100 transition hover:bg-white/[0.06] hover:text-cyan-200 focus-visible:outline-2 focus-visible:outline-cyan-300 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
                              type="button"
                              onClick={() => void copyReply(message)}
                              aria-label={
                                copiedMessage === message.id
                                  ? "Reply copied"
                                  : "Copy AI reply"
                              }
                            >
                              {copiedMessage === message.id ? (
                                <Check aria-hidden="true" size={12} />
                              ) : (
                                <Clipboard aria-hidden="true" size={12} />
                              )}
                              {copiedMessage === message.id ? "Copied!" : "Copy"}
                            </button>
                          )}
                        </div>
                      )}
                      <p className="whitespace-pre-wrap break-words text-sm leading-7">
                        {message.content}
                      </p>
                    </div>
                  </article>
                );
              })}

              {messages.length === 1 && (
                <div className="mt-2 grid grid-cols-2 gap-2.5 sm:gap-3">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion.label}
                      className="min-h-20 rounded-xl border border-white/[0.09] bg-white/[0.025] p-3 text-left transition duration-200 hover:border-cyan-300/30 hover:bg-cyan-300/[0.05] focus-visible:outline-2 focus-visible:outline-cyan-300 disabled:cursor-not-allowed disabled:opacity-50 sm:min-h-22 sm:p-4"
                      type="button"
                      onClick={() =>
                        void sendMessage(suggestion.message, suggestion)
                      }
                      disabled={isLoading}
                    >
                      <span className="block text-xs font-semibold text-slate-100 sm:text-sm">
                        {suggestion.label}
                      </span>
                      <span className="mt-1 block text-[10px] leading-4 text-slate-500 sm:text-xs">
                        {suggestion.detail}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {isLoading && (
                <div
                  className="mb-4 flex items-center gap-3 text-sm text-cyan-100"
                  role="status"
                  aria-live="polite"
                >
                  <span className="grid h-8 w-8 place-items-center rounded-xl bg-cyan-300/10 text-cyan-200">
                    <LoaderCircle aria-hidden="true" className="animate-spin" size={16} />
                  </span>
                  Unity AI is thinking
                  <span className="flex gap-1" aria-hidden="true">
                    {[0, 1, 2].map((dot) => (
                      <span
                        key={dot}
                        className="h-1 w-1 animate-pulse rounded-full bg-cyan-300"
                        style={{ animationDelay: `${dot * 160}ms` }}
                      />
                    ))}
                  </span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <footer className="shrink-0 border-t border-white/[0.08] bg-[#0b111d]/95 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 backdrop-blur-xl sm:px-7">
            <div className="mx-auto max-w-4xl">
              {statusMessage && (
                <p className="mb-2 text-xs text-amber-300" role="status">
                  {statusMessage}
                </p>
              )}
              <form
                className="flex items-end gap-2 rounded-2xl border border-white/[0.12] bg-[#111a27] p-2 transition focus-within:border-cyan-300/35 focus-within:ring-2 focus-within:ring-cyan-300/[0.07]"
                onSubmit={handleSubmit}
              >
                <textarea
                  ref={textareaRef}
                  className="max-h-40 min-h-11 min-w-0 flex-1 resize-none bg-transparent px-2 py-2.5 text-sm leading-5 text-slate-100 outline-none transition-[height] duration-150 ease-out placeholder:text-slate-500"
                  value={inputValue}
                  onChange={(event) => {
                    setInputValue(event.target.value);
                    event.target.style.height = "auto";
                    event.target.style.height = `${Math.min(
                      event.target.scrollHeight,
                      160,
                    )}px`;
                  }}
                  onKeyDown={handleTextareaKeyDown}
                  placeholder="Ask about a course, concept, or exam…"
                  aria-label="Your message"
                  rows={1}
                  disabled={isLoading}
                />
                <button
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-cyan-300 text-slate-950 transition hover:bg-cyan-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-500"
                  type="submit"
                  aria-label="Send message"
                  disabled={isLoading || !inputValue.trim()}
                >
                  {isLoading ? (
                    <LoaderCircle
                      aria-hidden="true"
                      className="animate-spin"
                      size={17}
                    />
                  ) : (
                    <Send aria-hidden="true" size={17} />
                  )}
                </button>
              </form>
              <p className="mt-2 text-center text-[10px] text-slate-600">
                Enter to send · Shift + Enter for a new line
              </p>
            </div>
          </footer>
        </section>
      ) : (
        <div className="unity-ai-widget fixed bottom-5 right-5 z-70 font-sans">
          <span className="mb-2 block rounded-full border border-slate-600/70 bg-slate-900/90 px-3 py-1.5 text-[10px] font-semibold text-slate-100 shadow-lg shadow-indigo-950/30 backdrop-blur-xl">
            Unity AI · Exam study partner
          </span>
          <button
            className="ml-auto grid h-14 w-14 place-items-center rounded-full border border-white/25 bg-linear-to-br from-cyan-500 to-blue-600 text-white shadow-xl shadow-blue-950/40 transition duration-300 hover:scale-105 hover:shadow-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300"
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label="Open Unity AI assistant"
          >
            <Sparkles aria-hidden="true" size={22} />
          </button>
        </div>
      )}
    </>
  );
}
