import { useEffect, useRef, useState } from "react";
import {
  Bot,
  Check,
  CheckCircle2,
  ChevronDown,
  Clipboard,
  HelpCircle,
  Maximize2,
  MessageSquare,
  Mic,
  Minimize2,
  Paperclip,
  Send,
  Sparkles,
  Sun,
  Moon,
  Trash2,
  RotateCcw,
  XCircle,
  X,
} from "lucide-react";

const chatPrompts = [
  "What is the freshman grading scale at AAU & ASTU?",
  "Summarize Jimma Univ General Chemistry exam pattern",
  "Explain Chapter 1 Physics Vectors",
  "Summarize Applied Math Integration",
];

const quizPrompts = [
  "Convert Ambo Physics Midterm to Mock Quiz",
  "Give me 5 practice MCQs on Logic & Critical Thinking",
  "Summarize Jimma Univ General Chemistry exam pattern",
  "Paste an exam question to build a practice quiz",
];

const welcomeMessage = {
  id: "unity-welcome",
  role: "assistant",
  content: "Selam! I’m Unity AI, your freshman study partner. Ask me about Physics, Logic, Mathematics, Chemistry, or how to prepare for exams.",
};

const universityDirectory = [
  { name: "Ambo University", aliases: ["ambo"] },
  { name: "Addis Ababa University (AAU)", aliases: ["aau", "addis ababa"] },
  { name: "Jimma University", aliases: ["jimma"] },
  { name: "Hawassa University", aliases: ["hawassa"] },
  { name: "Adama Science and Technology University (ASTU)", aliases: ["astu", "adama science", "adama university"] },
];

const quizQuestionBanks = {
  physics: [
    { question: "A vector has components 3 units east and 4 units north. What is its magnitude?", options: ["3 units", "4 units", "5 units", "7 units"], answer: 2, explanation: "Use the Pythagorean theorem: |A| = sqrt(3^2 + 4^2) = sqrt(25) = 5 units." },
    { question: "A 10 N vector makes a 60° angle with the positive x-axis. What is its x-component?", options: ["5 N", "5 sqrt(3) N", "10 N", "8.66 N north"], answer: 0, explanation: "The x-component is Ax = A cos(theta) = 10 cos(60°) = 5 N." },
    { question: "Which quantity is a vector?", options: ["Mass", "Time", "Speed", "Displacement"], answer: 3, explanation: "Displacement has both magnitude and direction. Mass, time, and speed are scalars." },
    { question: "Two equal 8 N forces act in opposite directions along the same line. What is the resultant?", options: ["0 N", "8 N", "16 N", "64 N"], answer: 0, explanation: "Opposite vectors subtract. Their equal magnitudes cancel, so the resultant is zero." },
    { question: "A 2 kg object accelerates at 3 m/s^2. What net force acts on it?", options: ["1.5 N", "5 N", "6 N", "9 N"], answer: 2, explanation: "Newton's second law gives F = ma = 2 kg × 3 m/s^2 = 6 N." },
  ],
  math: [
    { question: "What is the indefinite integral of 2x?", options: ["2 + C", "x^2 + C", "2x^2 + C", "x + C"], answer: 1, explanation: "The power rule gives ∫2x dx = 2(x^2/2) + C = x^2 + C." },
    { question: "Evaluate ∫ cos(x) dx.", options: ["-sin(x) + C", "cos(x) + C", "sin(x) + C", "tan(x) + C"], answer: 2, explanation: "Since the derivative of sin(x) is cos(x), its antiderivative is sin(x) + C." },
    { question: "Using substitution u = x^2, what is du?", options: ["x dx", "2x dx", "x^2 dx", "2 dx"], answer: 1, explanation: "Differentiate u = x^2: du/dx = 2x, so du = 2x dx." },
    { question: "What is ∫ from 0 to 2 of x dx?", options: ["1", "2", "4", "8"], answer: 1, explanation: "An antiderivative is x^2/2. Evaluate: (2^2/2) - (0^2/2) = 2." },
    { question: "Which identity is integration by parts?", options: ["∫u dv = uv - ∫v du", "∫u dv = u + v", "∫f(g(x)) dx = f(x)g(x)", "∫1/x dx = x^2/2"], answer: 0, explanation: "Integration by parts follows from the product rule: ∫u dv = uv - ∫v du." },
  ],
  chemistry: [
    { question: "How many moles are in 18 g of water (H2O, molar mass 18 g/mol)?", options: ["0.5 mol", "1 mol", "18 mol", "324 mol"], answer: 1, explanation: "Moles = mass / molar mass = 18 g / 18 g mol^-1 = 1 mol." },
    { question: "What is the coefficient of O2 when this equation is balanced: H2 + O2 → H2O?", options: ["1", "2", "3", "4"], answer: 0, explanation: "The balanced equation is 2H2 + O2 → 2H2O, so the O2 coefficient is 1." },
    { question: "Which subatomic particle has a negative charge?", options: ["Proton", "Neutron", "Electron", "Nucleus"], answer: 2, explanation: "Electrons carry a negative charge; protons are positive and neutrons are neutral." },
    { question: "A solution with pH 3 is best described as:", options: ["Acidic", "Neutral", "Basic", "A pure element"], answer: 0, explanation: "At ordinary introductory chemistry conditions, pH below 7 is acidic." },
    { question: "What is the empirical formula of a compound with molecular formula C2H4?", options: ["C2H4", "CH2", "CH4", "C2H2"], answer: 1, explanation: "Divide each subscript by the greatest common divisor, 2, to get CH2." },
  ],
  logic: [
    { question: "In an argument, what is a premise?", options: ["A reason offered to support a conclusion", "The topic title", "A question with no answer", "The conclusion repeated"], answer: 0, explanation: "Premises are statements presented as reasons or evidence for accepting a conclusion." },
    { question: "Which best describes a valid deductive argument?", options: ["Its premises are popular", "If its premises are true, its conclusion must be true", "Its conclusion is always true", "It uses statistics"], answer: 1, explanation: "Validity is about structure: true premises cannot lead to a false conclusion in a valid argument." },
    { question: "All freshmen take course X. Hana is a freshman. What follows deductively?", options: ["Hana teaches course X", "Hana takes course X", "Course X is optional", "No conclusion follows"], answer: 1, explanation: "Applying the general rule to Hana, who is a freshman, gives the conclusion that Hana takes course X." },
    { question: "Rejecting a claim only by insulting the person who made it is:", options: ["A valid syllogism", "Ad hominem", "A sound premise", "A causal argument"], answer: 1, explanation: "An ad hominem attacks the person instead of addressing the reasons supporting the claim." },
    { question: "An argument is sound when it is:", options: ["Valid and has true premises", "Persuasive and short", "Inductive and popular", "Valid even if a premise is false"], answer: 0, explanation: "Soundness requires both deductive validity and true premises." },
  ],
};

function getQuizSubject(prompt) {
  const query = prompt.toLowerCase();
  if (/logic|critical thinking|argument|fallac/.test(query)) return "logic";
  if (/chem|stoichi|mole|periodic/.test(query)) return "chemistry";
  if (/math|integr|calculus|limit|derivative/.test(query)) return "math";
  return "physics";
}

function parsePastedQuestions(prompt) {
  const questions = [];
  const answerLetters = ["A", "B", "C", "D"];
  let current = null;

  const saveCurrent = () => {
    if (!current || current.options.length !== 4 || current.answer === undefined) return;
    const correctLetter = answerLetters[current.answer];
    questions.push({
      question: current.question,
      options: current.options,
      answer: current.answer,
      explanation: current.explanation.trim() || `The supplied answer key marks ${correctLetter} as correct. Re-read the question conditions, match them to option ${correctLetter}, and verify that the other choices conflict with at least one condition.`,
    });
  };

  for (const rawLine of prompt.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) continue;
    const questionMatch = line.match(/^(?:question\s*)?(\d+)[.)]\s*(.+)$/i);
    if (questionMatch) {
      saveCurrent();
      current = { question: questionMatch[2], options: [], answer: undefined, explanation: "" };
      continue;
    }
    if (!current) continue;

    const optionMatch = line.match(/^([A-D])[).:-]\s*(.+)$/i);
    if (optionMatch) {
      current.options.push(optionMatch[2]);
      continue;
    }

    const answerMatch = line.match(/^(?:correct\s+)?(?:answer|ans|key)\s*[:=-]?\s*([A-D])\b/i);
    if (answerMatch) {
      current.answer = answerLetters.indexOf(answerMatch[1].toUpperCase());
      continue;
    }

    const explanationMatch = line.match(/^(?:explanation|solution)\s*[:=-]?\s*(.*)$/i);
    if (explanationMatch) {
      current.explanation = explanationMatch[1];
      continue;
    }
    if (current.explanation) current.explanation += ` ${line}`;
  }
  saveCurrent();
  return questions.slice(0, 10);
}

function createMockQuiz(prompt) {
  const subject = getQuizSubject(prompt);
  const titles = {
    physics: "Physics: Vectors & Mechanics",
    math: "Applied Mathematics: Integration",
    chemistry: "General Chemistry: Core Concepts",
    logic: "Logic & Critical Thinking",
  };
  const parsedQuestions = parsePastedQuestions(prompt);
  if (parsedQuestions.length) {
    const mentionedUniversity = universityDirectory.find((university) => university.aliases.some((alias) => prompt.toLowerCase().includes(alias)));
    return {
      title: "Quiz from pasted exam questions",
      course: titles[subject],
      university: mentionedUniversity?.name ?? "Exam paper practice",
      source: prompt,
      questions: parsedQuestions,
    };
  }

  const mentionedUniversity = universityDirectory.find((university) => university.aliases.some((alias) => prompt.toLowerCase().includes(alias)));
  return {
    title: titles[subject],
    course: titles[subject],
    university: mentionedUniversity?.name ?? "Freshman practice",
    source: prompt,
    questions: quizQuestionBanks[subject],
  };
}

function QuizCard({ quiz, isDark }) {
  const [answers, setAnswers] = useState({});
  const [expanded, setExpanded] = useState({});
  const answeredCount = Object.keys(answers).length;
  const score = quiz.questions.reduce((total, question, index) => total + Number(answers[index] === question.answer), 0);
  const tone = isDark ? "border-slate-700/80 bg-slate-900/80 text-slate-200" : "border-indigo-100 bg-white/90 text-slate-700";

  const chooseAnswer = (questionIndex, optionIndex) => {
    setAnswers((current) => current[questionIndex] === undefined
      ? { ...current, [questionIndex]: optionIndex }
      : current);
  };

  return (
    <div className="space-y-3">
      <div className={`rounded-xl border p-3 ${tone}`}>
        <div className="flex items-start justify-between gap-3">
          <div><p className="mb-1 inline-flex items-center gap-1 text-[9px] font-semibold uppercase tracking-[.12em] text-indigo-400"><HelpCircle size={11} />Mock practice quiz</p><h3 className="text-sm font-semibold">{quiz.title}</h3></div>
          <span className={`shrink-0 rounded-full bg-indigo-500/10 px-2 py-1 text-[9px] font-semibold ${isDark ? "text-indigo-300" : "text-indigo-600"}`}>Score {score}/{quiz.questions.length} · {answeredCount} answered</span>
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <span className="rounded-full border border-indigo-400/20 bg-indigo-500/10 px-2 py-1 text-[8px] font-medium text-indigo-300">{quiz.university ?? "Freshman practice"}</span>
          <span className="rounded-full border border-slate-500/20 bg-slate-500/10 px-2 py-1 text-[8px] font-medium text-slate-400">{quiz.course ?? quiz.title}</span>
        </div>
        <p className={`mt-2 text-[9px] leading-relaxed ${isDark ? "text-slate-400" : "text-slate-500"}`}>Local practice template matched to your prompt. Verify facts against your course material.</p>
      </div>
      {quiz.questions.map((question, questionIndex) => {
        const chosen = answers[questionIndex];
        const hasAnswered = chosen !== undefined;
        return (
          <section className={`rounded-xl border p-3 ${tone}`} key={`${quiz.title}-${questionIndex}`}>
            <p className="text-[10px] font-semibold leading-relaxed"><span className="mr-1.5 text-indigo-500">{questionIndex + 1}.</span>{question.question}</p>
            <div className="mt-2 space-y-1.5">
              {question.options.map((option, optionIndex) => {
                const isCorrect = optionIndex === question.answer;
                const isChosen = chosen === optionIndex;
                const choiceTone = !hasAnswered
                  ? isDark ? "border-slate-700 hover:border-indigo-400 hover:bg-slate-800" : "border-slate-200 hover:border-indigo-300 hover:bg-indigo-50"
                  : isCorrect ? "border-emerald-500 bg-emerald-950/60 text-emerald-200"
                    : isChosen ? "border-rose-500 bg-rose-950/60 text-rose-200"
                      : isDark ? "border-slate-800 text-slate-500" : "border-slate-100 text-slate-400";
                return (
                  <button className={`flex w-full items-start gap-2 rounded-lg border px-2 py-1.5 text-left text-[9px] leading-relaxed transition ${choiceTone}`} key={option} type="button" onClick={() => chooseAnswer(questionIndex, optionIndex)} disabled={hasAnswered} aria-pressed={isChosen}>
                    <span className={`grid h-4 w-4 shrink-0 place-items-center rounded-full border text-[8px] font-semibold ${hasAnswered && isCorrect ? "border-emerald-500 bg-emerald-500 text-white" : hasAnswered && isChosen ? "border-rose-500 bg-rose-500 text-white" : "border-current/30"}`}>
                      {hasAnswered && isCorrect ? <CheckCircle2 size={11} /> : hasAnswered && isChosen ? <XCircle size={11} /> : String.fromCharCode(65 + optionIndex)}
                    </span>{option}
                  </button>
                );
              })}
            </div>
            {hasAnswered && <p className={`mt-2 text-[9px] font-semibold ${chosen === question.answer ? isDark ? "text-emerald-300" : "text-emerald-700" : isDark ? "text-rose-300" : "text-rose-700"}`} role="status">{chosen === question.answer ? "Correct. Nice work!" : "Not quite. The correct answer is highlighted."}</p>}
            <button className="mt-2 inline-flex items-center gap-1 text-[9px] font-semibold text-indigo-400 hover:text-indigo-300" type="button" onClick={() => setExpanded((current) => ({ ...current, [questionIndex]: !current[questionIndex] }))} aria-expanded={Boolean(expanded[questionIndex])}>{expanded[questionIndex] ? "Hide explanation" : "Show explanation"}<ChevronDown className={`transition-transform duration-300 ${expanded[questionIndex] ? "rotate-180" : ""}`} size={12} /></button>
            <div className={`grid transition-all duration-300 ${expanded[questionIndex] ? "mt-2 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`} aria-hidden={!expanded[questionIndex]}>
              <div className="overflow-hidden"><p className={`rounded-lg border border-indigo-400/15 bg-indigo-500/6 px-2.5 py-2 text-[9px] leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}>{question.explanation}</p></div>
            </div>
          </section>
        );
      })}
      {answeredCount === quiz.questions.length && <div className={`flex items-center justify-between rounded-xl bg-indigo-500/10 px-3 py-2 text-[10px] font-semibold ${isDark ? "text-indigo-300" : "text-indigo-600"}`}><span>Quiz complete · {score} of {quiz.questions.length} correct</span><button className="inline-flex items-center gap-1" type="button" onClick={() => { setAnswers({}); setExpanded({}); }}><RotateCcw size={12} />Try again</button></div>}
    </div>
  );
}

function renderTextBlock(text, key) {
  const lines = text.split("\n");
  return (
    <div className="space-y-1.5" key={key}>
      {lines.map((line, index) => {
        if (!line.trim()) return <div className="h-1" key={`${key}-${index}`} />;
        if (/^[-*]\s/.test(line)) {
          return <p className="flex gap-2 pl-1 leading-relaxed" key={`${key}-${index}`}><span className="mt-[.65em] h-1 w-1 shrink-0 rounded-full bg-indigo-400" />{line.replace(/^[-*]\s/, "")}</p>;
        }
        if (/^\d+\.\s/.test(line)) {
          return <p className="pl-1 leading-relaxed" key={`${key}-${index}`}><span className="mr-1.5 font-semibold text-indigo-500">{line.match(/^\d+/)?.[0]}.</span>{line.replace(/^\d+\.\s/, "")}</p>;
        }
        return <p className="leading-relaxed" key={`${key}-${index}`}>{line}</p>;
      })}
    </div>
  );
}

function CodeBlock({ language, code, isDark }) {
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className={`my-2 overflow-hidden rounded-xl border ${isDark ? "border-slate-700 bg-slate-950" : "border-slate-200 bg-slate-950"}`}>
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-2 text-[10px] text-slate-400">
        <span>{language || "text"}</span>
        <button className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-slate-300 transition hover:bg-white/10 hover:text-white" type="button" onClick={copyCode} aria-label="Copy code snippet">{copied ? <Check size={12} /> : <Clipboard size={12} />}{copied ? "Copied" : "Copy"}</button>
      </div>
      <pre className="overflow-x-auto px-3 py-3 text-[11px] leading-relaxed text-indigo-100"><code>{code}</code></pre>
    </div>
  );
}

function MessageBody({ message, isDark }) {
  const parts = message.content.split(/(```[\s\S]*?```)/g).filter(Boolean);
  return (
    <div className="space-y-2 text-[11px] sm:text-xs">
      {parts.map((part, index) => {
        if (part.startsWith("```")) {
          const match = part.match(/^```([\w-]*)\n?([\s\S]*?)```$/);
          return <CodeBlock key={`${message.id}-code-${index}`} language={match?.[1]} code={(match?.[2] ?? part).trim()} isDark={isDark} />;
        }
        return renderTextBlock(part, `${message.id}-text-${index}`);
      })}
    </div>
  );
}

export default function UnityAIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [activeMode, setActiveMode] = useState("chat");
  const [language, setLanguage] = useState("en");
  const [messages, setMessages] = useState([welcomeMessage]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [pendingRequest, setPendingRequest] = useState(null);
  const [attachment, setAttachment] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    return undefined;
  }, [isOpen, isTyping, messages]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        setIsExpanded(false);
        setIsOpen(false);
      }
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [isOpen]);

  useEffect(() => {
    if (!isTyping || !pendingRequest) return undefined;
    if (pendingRequest.mode === "quiz") {
      const timer = window.setTimeout(() => {
        setMessages((current) => [...current, {
          id: `unity-${Date.now()}`,
          role: "assistant",
          content: "I built a five-question practice set from the topic keywords in your prompt. This local demo uses practice templates; it does not OCR attachments or verify an official exam paper.",
          quiz: createMockQuiz(pendingRequest.prompt),
        }]);
        setIsTyping(false);
        setPendingRequest(null);
      }, 850);
      return () => window.clearTimeout(timer);
    }

    const controller = new AbortController();
    let isActive = true;
    const requestReply = async () => {
      try {
        const response = await fetch("/api/unity-ai/chat", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            message: pendingRequest.prompt,
            language: pendingRequest.language,
          }),
          signal: controller.signal,
        });

        let data;
        try {
          data = await response.json();
        } catch {
          throw new Error("Unity AI returned an invalid response.");
        }
        if (!response.ok) {
          throw new Error(typeof data?.error === "string" ? data.error : "Unity AI could not answer. Please try again.");
        }
        if (data?.success !== true || typeof data.reply !== "string" || !data.reply.trim()) {
          throw new Error("Unity AI returned an empty response.");
        }
        if (isActive) {
          setMessages((current) => [...current, {
            id: `unity-${Date.now()}`,
            role: "assistant",
            content: data.reply,
          }]);
        }
      } catch (error) {
        if (!isActive || error.name === "AbortError") return;
        setMessages((current) => [...current, {
          id: `unity-error-${Date.now()}`,
          role: "assistant",
          content: `I couldn't get a response: ${error.message}`,
        }]);
      } finally {
        if (isActive) {
          setIsTyping(false);
          setPendingRequest(null);
        }
      }
    };

    requestReply();
    return () => {
      isActive = false;
      controller.abort();
    };
  }, [isTyping, pendingRequest]);

  const resetTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  };

  const sendMessage = (rawText = inputValue) => {
    const text = rawText.trim();
    if ((!text && !attachment) || isTyping) return;
    const prompt = text || `Help me understand the attached study material: ${attachment.name}`;
    const messageContent = attachment ? `${text || "Please review this study material."}\n\nAttached: ${attachment.name}` : text;
    setMessages((current) => [...current, {
      id: `user-${Date.now()}`,
      role: "user",
      content: messageContent,
    }]);
    setInputValue("");
    setAttachment(null);
    setStatusMessage("");
    setIsTyping(true);
    setPendingRequest({ mode: activeMode, prompt, language });
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    sendMessage();
  };

  const handleTextareaKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([{ ...welcomeMessage, id: `unity-welcome-${Date.now()}` }]);
    setInputValue("");
    setAttachment(null);
    setIsTyping(false);
    setPendingRequest(null);
    setStatusMessage("Chat cleared.");
  };

  const selectAttachment = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setAttachment(file);
    setStatusMessage(`${file.name} is attached as a local preview. It is not uploaded to an AI service.`);
  };

  const toggleVoice = () => {
    setIsListening((current) => !current);
    setStatusMessage(isListening ? "Voice input demo stopped." : "Voice input is a UI demo; microphone transcription is not connected.");
  };

  const panelClass = isDark
    ? "border-slate-700/80 bg-slate-900/90 text-slate-100 shadow-black/50"
    : "border-white/70 bg-white/95 text-slate-800 shadow-slate-900/20";
  const messageCardClass = isDark
    ? "border-slate-700 bg-slate-900 text-slate-200"
    : "border-slate-100 bg-white text-slate-700";
  const secondaryTextClass = isDark ? "text-slate-400" : "text-slate-500";
  const fieldClass = isDark
    ? "text-slate-100 placeholder:text-slate-500"
    : "text-slate-800 placeholder:text-slate-400";

  return (
    <div id="unity-ai" className="unity-ai-widget fixed bottom-5 right-5 z-70 font-sans" aria-live="off">
      {isOpen && (
        <section className={`flex flex-col overflow-hidden border shadow-2xl backdrop-blur-xl transition-all duration-300 ${isExpanded ? "fixed inset-4 z-50 h-auto w-auto max-h-none rounded-3xl md:inset-8" : "mb-3 h-145 max-h-[85vh] w-[92vw] rounded-3xl sm:w-105"} ${panelClass}`} aria-label="Unity AI Assistant chat">
          <header className="relative shrink-0 border-b border-white/10 bg-linear-to-r from-blue-600 to-indigo-600 text-white">
            <div className="flex items-center gap-2.5 px-3.5 py-3 sm:gap-3 sm:px-4">
              <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/25 bg-white/15 shadow-inner shadow-white/10"><Bot size={21} /><Sparkles className="absolute -right-1 -top-1 text-indigo-100" size={12} /></span>
              <div className="min-w-0 flex-1">
                <h2 className="truncate text-sm font-semibold">Unity AI Assistant</h2>
                <p className="mt-0.5 inline-flex items-center gap-1.5 text-[10px] text-indigo-50"><span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-70" /><span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-300" /></span>Online · Freshman study tutor</p>
              </div>
              <button className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-white/85 transition hover:bg-white/15 hover:text-white" type="button" onClick={() => setIsExpanded((current) => !current)} aria-label={isExpanded ? "Minimize chat" : "Maximize chat"} title={isExpanded ? "Minimize" : "Maximize"}>{isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}</button>
              <button className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-white/85 transition hover:bg-white/15 hover:text-white" type="button" onClick={clearChat} aria-label="Clear chat" title="Clear chat"><Trash2 size={16} /></button>
              <button className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-white/85 transition hover:bg-white/15 hover:text-white" type="button" onClick={() => { setIsExpanded(false); setIsOpen(false); }} aria-label="Close chat" title="Close chat"><X size={16} /></button>
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto px-3.5 pb-2.5 sm:px-4" aria-label="Supported universities">
              {["Ambo", "AAU", "Jimma", "Hawassa", "ASTU"].map((university) => <span className="shrink-0 rounded-full border border-white/20 bg-white/10 px-2 py-0.5 text-[8px] font-medium text-indigo-50" key={university}>{university}</span>)}
            </div>
          </header>

          <div className={`grid shrink-0 grid-cols-2 gap-1 border-b px-3 py-2 ${isDark ? "border-slate-800 bg-slate-900/70" : "border-slate-100 bg-white/80"}`} role="tablist" aria-label="Unity AI modes">
            <button className={`inline-flex min-h-8 items-center justify-center gap-1.5 rounded-lg px-2 text-[10px] font-semibold transition ${activeMode === "chat" ? "bg-indigo-600 text-white shadow-sm" : isDark ? "text-slate-400 hover:bg-slate-800" : "text-slate-500 hover:bg-slate-100"}`} type="button" role="tab" aria-selected={activeMode === "chat"} aria-controls="unity-chat-history" onClick={() => setActiveMode("chat")}><MessageSquare size={13} />General AI Chat</button>
            <button className={`inline-flex min-h-8 items-center justify-center gap-1.5 rounded-lg px-2 text-[10px] font-semibold transition ${activeMode === "quiz" ? "bg-indigo-600 text-white shadow-sm" : isDark ? "text-slate-400 hover:bg-slate-800" : "text-slate-500 hover:bg-slate-100"}`} type="button" role="tab" aria-selected={activeMode === "quiz"} aria-controls="unity-chat-history" onClick={() => setActiveMode("quiz")}><HelpCircle size={13} />Mock Practice Quiz</button>
          </div>

          <div className={`shrink-0 border-b px-3 py-2.5 ${isDark ? "border-slate-800 bg-slate-900/70" : "border-slate-100 bg-slate-50/80"}`}>
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className={`flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[.12em] ${secondaryTextClass}`}><Sparkles size={11} className="text-indigo-500" />{activeMode === "quiz" ? "Build a practice set" : "Suggested questions"}</p>
              {activeMode === "chat" && (
                <label className="flex items-center gap-1.5 text-[9px] text-slate-400">
                  Language
                  <select
                    className={`rounded-md border px-1.5 py-1 text-[9px] outline-none focus:border-indigo-500 ${isDark ? "border-slate-700 bg-slate-950 text-slate-200" : "border-slate-200 bg-white text-slate-700"}`}
                    value={language}
                    onChange={(event) => setLanguage(event.target.value)}
                  >
                    <option value="en">English</option>
                    <option value="om">Afaan Oromoo</option>
                    <option value="am">አማርኛ</option>
                  </select>
                </label>
              )}
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {(activeMode === "quiz" ? quizPrompts : chatPrompts).map((prompt) => (
                <button key={prompt} className={`min-h-9 rounded-lg border px-2 py-1.5 text-left text-[9px] leading-snug transition ${isDark ? "border-slate-700 bg-slate-800 text-slate-300 hover:border-indigo-500/60 hover:bg-slate-700" : "border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"}`} type="button" onClick={() => sendMessage(prompt)} disabled={isTyping}>{prompt}</button>
              ))}
            </div>
          </div>

          <div id="unity-chat-history" className={`min-h-0 flex-1 space-y-3 overflow-y-auto px-3 py-3 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-900/50 ${isDark ? "bg-slate-950/50" : "bg-slate-50/60"}`} aria-label="Chat messages" aria-live="polite" aria-relevant="additions text">
            {messages.map((message) => (
              <article key={message.id} className={`flex items-end gap-2 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                {message.role === "assistant" && <span className="mb-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-linear-to-br from-indigo-500 to-purple-600 text-white"><Sparkles size={14} /></span>}
                <div className={`${message.quiz ? "w-full max-w-full" : "max-w-[85%]"} rounded-2xl px-3 py-2.5 ${message.role === "user" ? "rounded-br-md bg-linear-to-br from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-900/10" : `rounded-bl-md border shadow-sm ${messageCardClass}`}`}>
                  {message.role === "assistant" && <p className="mb-1.5 text-[9px] font-semibold text-indigo-500">Unity AI</p>}
                  {message.quiz ? <>
                    <MessageBody message={message} isDark={isDark} />
                    <QuizCard quiz={message.quiz} isDark={isDark} />
                  </> : <MessageBody message={message} isDark={isDark} />}
                </div>
              </article>
            ))}
            {isTyping && <div className="flex items-end gap-2" role="status" aria-label="Unity AI is typing">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-linear-to-br from-indigo-500 to-purple-600 text-white"><Sparkles size={14} /></span>
              <div className={`flex items-center gap-1.5 rounded-2xl rounded-bl-md border px-3 py-3 ${messageCardClass}`}>
                {[0, 1, 2].map((dot) => <span key={dot} className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-500" style={{ animationDelay: `${dot * 120}ms` }} />)}
                <span className="sr-only">Unity AI is thinking</span>
              </div>
            </div>}
            <div ref={messagesEndRef} />
          </div>

          <div className={`shrink-0 border-t px-3 pt-2 ${isDark ? "border-slate-800 bg-slate-900" : "border-slate-200 bg-white"}`}>
            <div className="flex items-center justify-between gap-2 pb-1.5">
              <button className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[9px] transition ${isListening ? "bg-rose-100 text-rose-700" : `${secondaryTextClass} hover:bg-slate-100 hover:text-indigo-600`}`} type="button" onClick={toggleVoice} aria-pressed={isListening} title="Toggle voice input demo"><Mic size={13} />{isListening ? "Listening demo" : "Voice"}</button>
              <button className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[9px] transition ${isDark ? "text-slate-400 hover:bg-slate-800" : "text-slate-500 hover:bg-slate-100"}`} type="button" onClick={() => setIsDark((current) => !current)} aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"} title={isDark ? "Light appearance" : "Dark appearance"}>{isDark ? <Sun size={13} /> : <Moon size={13} />}{isDark ? "Light" : "Dark"}</button>
            </div>
            {attachment && <div className={`mb-2 flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[10px] ${isDark ? "bg-slate-800 text-slate-300" : "bg-indigo-50 text-indigo-700"}`}><Paperclip size={12} /><span className="min-w-0 flex-1 truncate">{attachment.name} · local preview</span><button className="grid h-5 w-5 place-items-center" type="button" onClick={() => setAttachment(null)} aria-label="Remove attachment"><X size={12} /></button></div>}
            {statusMessage && <p className={`mb-1.5 text-[9px] leading-relaxed ${secondaryTextClass}`} role="status">{statusMessage}</p>}
            <form className={`flex items-end gap-1.5 rounded-xl border p-1.5 transition focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-500/10 ${isDark ? "border-slate-700 bg-slate-950" : "border-slate-200 bg-slate-50"}`} onSubmit={handleSubmit}>
              <input ref={fileInputRef} className="sr-only" type="file" accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg" onChange={selectAttachment} aria-label="Attach a study paper preview" />
              <button className={`mb-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg transition ${isDark ? "text-slate-400 hover:bg-slate-800 hover:text-indigo-300" : "text-slate-500 hover:bg-indigo-50 hover:text-indigo-600"}`} type="button" onClick={() => fileInputRef.current?.click()} aria-label="Attach a paper preview" title="Attach a paper preview"><Paperclip size={16} /></button>
              <textarea ref={textareaRef} className={`max-h-30 min-h-8 flex-1 resize-none border-0 bg-transparent px-1 py-1.5 text-[11px] leading-relaxed outline-none focus:ring-0 sm:text-xs ${fieldClass}`} value={inputValue} onChange={(event) => { setInputValue(event.target.value); resetTextareaHeight(); }} onKeyDown={handleTextareaKeyDown} placeholder={activeMode === "quiz" ? "Paste an exam question or topic..." : "Ask Unity AI anything..."} rows={1} aria-label={activeMode === "quiz" ? "Paste an exam question or topic" : "Message Unity AI"} />
              <button className={`mb-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg transition ${inputValue.trim() || attachment ? "bg-linear-to-br from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-500/20 hover:from-blue-500 hover:to-indigo-500" : isDark ? "bg-slate-800 text-slate-500" : "bg-slate-200 text-slate-400"}`} type="submit" disabled={(!inputValue.trim() && !attachment) || isTyping} aria-label="Send message" title="Send message"><Send size={15} /></button>
            </form>
            <p className={`py-2 text-center text-[8px] ${secondaryTextClass}`}>Unity AI can make mistakes. Check important details with your course materials.</p>
          </div>
        </section>
      )}

      {!isOpen && <>
        <div className="mb-2 flex justify-end pr-1">
          <span className="rounded-full border border-slate-600/70 bg-slate-900/90 px-3 py-1.5 text-[10px] font-semibold text-slate-100 shadow-lg shadow-indigo-950/30 backdrop-blur-xl">Unity AI - Ask Anything</span>
        </div>
        <button className="group relative ml-auto grid h-16 w-16 place-items-center rounded-full border border-white/25 bg-linear-to-br from-blue-600 to-indigo-600 text-white shadow-xl shadow-indigo-950/35 transition duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-indigo-950/45 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-400" type="button" onClick={() => { setIsExpanded(false); setIsOpen(true); }} aria-expanded={isOpen} aria-label="Open Unity AI assistant" title="Unity AI - Ask Anything">
          <span className="relative grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-white/10"><Bot className="transition-transform duration-300 group-hover:scale-110" size={24} /><Sparkles className="absolute -right-1 -top-1 animate-pulse text-indigo-100" size={14} /><span className="absolute -bottom-0.5 -right-1 h-3 w-3 rounded-full border-2 border-indigo-700 bg-emerald-300"><span className="absolute inset-0 animate-ping rounded-full bg-emerald-300" /></span></span>
        </button>
      </>}
    </div>
  );
}