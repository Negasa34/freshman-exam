import {
  BriefcaseBusiness,
  CirclePlay,
  CodeXml,
  Send,
  Sparkles,
} from "lucide-react";

const quickLinks = [
  { label: "Home", page: "auth", href: "#home" },
  { label: "Past Exams", page: "exams", href: "#past-exams" },
  { label: "Course Materials", page: "notes", href: "#course-materials" },
  { label: "Unity AI Assistant", href: "#unity-ai-widget" },
  { label: "Contact", href: "#contact" },
];

const universities = [
  { name: "Addis Ababa University (AAU)", href: "https://www.aau.edu.et/" },
  { name: "Adama Science & Technology (ASTU)", href: "https://www.astu.edu.et/" },
  { name: "Jimma University (JU)", href: "https://ju.edu.et/" },
  { name: "Ambo University", href: "https://ambou.edu.et/" },
];

const socialLinks = [
  { label: "Telegram", href: "https://t.me/", Icon: Send },
  { label: "YouTube", href: "https://www.youtube.com/", Icon: CirclePlay },
  { label: "GitHub", href: "https://github.com/", Icon: CodeXml },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/",
    Icon: BriefcaseBusiness,
  },
];

const linkClass =
  "text-sm text-slate-400 transition-colors duration-200 hover:text-cyan-400 focus-visible:text-cyan-300 focus-visible:outline-none";

export default function Footer({ onNavigate }) {
  return (
    <footer
      id="contact"
      className="border-t border-slate-800/90 bg-slate-950 text-slate-200"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-5 py-12 sm:px-6 md:grid-cols-2 md:gap-x-8 lg:grid-cols-4 lg:px-8 lg:py-14">
        <section aria-labelledby="footer-brand">
          <a href="#home" className="inline-flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300 shadow-lg shadow-cyan-950/30">
              <Sparkles aria-hidden="true" size={19} />
            </span>
            <span>
              <span
                id="footer-brand"
                className="block text-lg font-bold tracking-tight text-white"
              >
                Exam Portal
              </span>
              <span className="text-xs font-medium tracking-wide text-cyan-300">
                Unity AI
              </span>
            </span>
          </a>
          <p className="mt-4 max-w-sm text-sm leading-6 text-slate-400">
            Providing accessible freshman exam resources, course outlines, and
            AI study assistance for Ethiopian university students.
          </p>
        </section>

        <nav aria-labelledby="footer-quick-links">
          <h2
            id="footer-quick-links"
            className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-200"
          >
            Quick links
          </h2>
          <ul className="mt-4 space-y-3">
            {quickLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className={linkClass}
                  onClick={
                    link.page && onNavigate
                      ? (event) => {
                          event.preventDefault();
                          onNavigate(link.page);
                        }
                      : undefined
                  }
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-labelledby="footer-resources">
          <h2
            id="footer-resources"
            className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-200"
          >
            Educational resources
          </h2>
          <ul className="mt-4 space-y-3">
            {universities.map((university) => (
              <li key={university.name}>
                <a
                  href={university.href}
                  className={linkClass}
                  target="_blank"
                  rel="noreferrer"
                >
                  {university.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <section aria-labelledby="footer-altech">
          <h2
            id="footer-altech"
            className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-200"
          >
            Connect &amp; tech education
          </h2>
          <p className="mt-4 text-sm font-semibold text-white">AL+TECH LEARN</p>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Technology education, programming tutorials, and practical study
            tips for curious learners.
          </p>
          <p className="mt-3 text-xs text-slate-500">
            Follow AL+TECH LEARN on Telegram and YouTube.
          </p>
          <div className="mt-5 flex flex-wrap gap-2.5">
            {socialLinks.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                title={label}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 bg-slate-900 text-slate-400 transition duration-200 hover:border-cyan-400/50 hover:bg-slate-800 hover:text-cyan-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
              >
                <Icon aria-hidden="true" size={17} />
              </a>
            ))}
          </div>
        </section>
      </div>

      <div className="border-t border-slate-800/80">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-5 text-center sm:px-6 md:flex-row md:items-center md:justify-between md:text-left lg:px-8">
          <p className="text-xs leading-5 text-slate-500 sm:text-sm">
            © 2026 All University Exam Portal. Built with ❤️ for students.
          </p>
          <nav
            aria-label="Legal"
            className="flex items-center justify-center gap-5"
          >
            <a href="/privacy-policy" className={linkClass}>
              Privacy Policy
            </a>
            <a href="/terms-of-service" className={linkClass}>
              Terms of Service
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
