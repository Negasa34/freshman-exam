import { useState } from "react";
import {
  BriefcaseBusiness,
  BookOpen,
  CirclePlay,
  CodeXml,
  ExternalLink,
  GraduationCap,
  Heart,
  Send,
  Sparkles,
} from "lucide-react";

const quickLinks = [
  { label: "Exams Archive", description: "Midterm & final papers", onSelect: "onBrowseExams" },
  { label: "Lecture Notes", description: "Chapter summaries", onSelect: "onBrowseNotes" },
  { label: "Unity AI Assistant", description: "Mock quizzes & study chat", href: "#unity-ai" },
  { label: "Department Explorer", description: "Explore fields of study", onSelect: "onBrowseDepartments" },
];

const universities = [
  "Ambo University",
  "Addis Ababa University (AAU)",
  "Jimma University",
  "Hawassa University",
  "Adama Science & Tech University (ASTU)",
];

const socialLinks = [
  { label: "Telegram", href: "https://telegram.org", icon: Send },
  { label: "YouTube", href: "https://youtube.com", icon: CirclePlay },
  { label: "GitHub", href: "https://github.com", icon: CodeXml },
  { label: "LinkedIn", href: "https://linkedin.com", icon: BriefcaseBusiness },
];

export default function Footer({
  onBackToHome,
  onBrowseExams,
  onBrowseNotes,
  onBrowseDepartments,
}) {
  const [subscriptionMessage, setSubscriptionMessage] = useState("");
  const navigationActions = { onBrowseExams, onBrowseNotes, onBrowseDepartments };

  const handleSubscribe = (event) => {
    event.preventDefault();
    setSubscriptionMessage("Email updates are coming soon. Thanks for your interest!");
  };

  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-200">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-x-10 gap-y-12 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <section aria-labelledby="footer-brand">
          <button
            className="group inline-flex items-center gap-3 text-left"
            type="button"
            onClick={onBackToHome}
            aria-label="Freshman Exams ET home"
          >
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-linear-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-indigo-950/40 transition group-hover:scale-105">
              <GraduationCap className="h-6 w-6" aria-hidden="true" />
            </span>
            <span id="footer-brand" className="bg-linear-to-r from-blue-400 to-indigo-300 bg-clip-text text-lg font-bold tracking-tight text-transparent">
              Freshman Exams ET
            </span>
          </button>
          <p className="mt-5 max-w-sm text-sm leading-6 text-slate-400">
            Empower Ethiopian Freshman University students across Ambo, AAU, Jimma,
            Hawassa, and ASTU with digitized exams, study notes, and AI assistance.
          </p>
          <div className="mt-6 flex items-center gap-2.5">
            {socialLinks.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="grid h-10 w-10 place-items-center rounded-xl border border-slate-800 bg-slate-900/60 text-slate-400 transition duration-200 hover:-translate-y-0.5 hover:border-indigo-500/50 hover:bg-indigo-500/10 hover:text-indigo-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
              </a>
            ))}
          </div>
        </section>

        <nav aria-labelledby="footer-navigation">
          <h2 id="footer-navigation" className="text-sm font-semibold tracking-wide text-white">
            Explore the platform
          </h2>
          <ul className="mt-5 space-y-4">
            {quickLinks.map(({ label, description, onSelect, href }) => {
              const action = onSelect ? navigationActions[onSelect] : undefined;
              const className = "group flex items-start gap-3 text-left";
              const content = (
                <>
                  <span className="mt-0.5 text-slate-500 transition group-hover:text-indigo-300">
                    {label === "Unity AI Assistant" ? (
                      <Sparkles className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <BookOpen className="h-4 w-4" aria-hidden="true" />
                    )}
                  </span>
                  <span>
                    <span className="block text-sm font-medium text-slate-300 transition group-hover:text-white">
                      {label}
                    </span>
                    <span className="mt-0.5 block text-xs text-slate-500">{description}</span>
                  </span>
                </>
              );

              return (
                <li key={label}>
                  {action ? (
                    <button className={className} type="button" onClick={action}>
                      {content}
                    </button>
                  ) : (
                    <a className={className} href={href}>
                      {content}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <section aria-labelledby="footer-universities">
          <h2 id="footer-universities" className="text-sm font-semibold tracking-wide text-white">
            Supported universities
          </h2>
          <ul className="mt-5 space-y-3.5">
            {universities.map((university) => (
              <li key={university} className="flex items-center gap-2.5 text-sm text-slate-400">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.55)]" aria-hidden="true" />
                {university}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="footer-community">
          <h2 id="footer-community" className="text-sm font-semibold tracking-wide text-white">
            Learn together
          </h2>
          <p className="mt-4 text-sm leading-6 text-slate-400">
            Help fellow students prepare by sharing your notes and exam materials.
          </p>
          <button
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-950/30 transition hover:from-blue-500 hover:to-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
            type="button"
            onClick={onBrowseNotes}
          >
            <Send className="h-4 w-4" aria-hidden="true" />
            Contribute Material
            <ExternalLink className="ml-auto h-3.5 w-3.5 opacity-75" aria-hidden="true" />
          </button>

          <div className="mt-7 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-inner shadow-white/[0.02]">
            <h3 className="text-sm font-semibold text-white">Exam updates, in your inbox</h3>
            <p className="mt-1.5 text-xs leading-5 text-slate-400">
              Get a note when new study material is added.
            </p>
            <form className="mt-4 flex gap-2" onSubmit={handleSubscribe}>
              <label className="sr-only" htmlFor="footer-email">Email address</label>
              <input
                id="footer-email"
                type="email"
                name="email"
                required
                placeholder="you@example.com"
                className="min-w-0 flex-1 rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2.5 text-xs text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
              <button
                className="shrink-0 rounded-lg bg-slate-100 px-3 py-2.5 text-xs font-semibold text-slate-900 transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
                type="submit"
              >
                Subscribe
              </button>
            </form>
            {subscriptionMessage && (
              <p className="mt-3 text-xs text-indigo-300" role="status">
                {subscriptionMessage}
              </p>
            )}
          </div>
        </section>
      </div>

      <div className="border-t border-slate-800/80">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-5 text-center sm:px-6 md:flex-row md:text-left lg:px-8">
          <p className="text-xs text-slate-500">
            © 2026 Freshman Academic Platform. All rights reserved.
          </p>
          <p className="inline-flex items-center gap-1.5 text-xs text-slate-400">
            <Heart className="h-3.5 w-3.5 fill-rose-400 text-rose-400" aria-hidden="true" />
            Built for Ethiopian Freshmen
          </p>
          <nav aria-label="Legal" className="flex items-center gap-5 text-xs text-slate-500">
            <a className="transition hover:text-slate-200" href="#privacy-policy">Privacy Policy</a>
            <a className="transition hover:text-slate-200" href="#terms-of-service">Terms of Service</a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
