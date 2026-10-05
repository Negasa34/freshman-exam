import { Globe, Mail, MapPin, Send } from "lucide-react";

const quickLinks = ["Home", "Universities", "Courses", "Upload Paper", "About Us"];

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-slate-200">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.2fr_0.8fr_0.8fr_1fr] lg:px-8">
        <div>
          <div className="text-lg font-bold tracking-tight text-white">Freshman Exams ET</div>
          <p className="mt-4 max-w-sm text-sm leading-7 text-slate-400">
            A student-first archive for digitized freshman exam papers across Ethiopia’s leading universities.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <a href="#" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 text-slate-300 transition hover:border-slate-500 hover:text-white">
              <Globe className="h-4 w-4" />
            </a>
            <a href="#" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 text-slate-300 transition hover:border-slate-500 hover:text-white">
              <Send className="h-4 w-4" />
            </a>
            <a href="#" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 text-slate-300 transition hover:border-slate-500 hover:text-white">
              <Mail className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-300">Quick links</p>
          <ul className="mt-4 space-y-3 text-sm text-slate-400">
            {quickLinks.map((link) => (
              <li key={link}>
                <a href="#" className="transition hover:text-white">
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-300">Support</p>
          <ul className="mt-4 space-y-3 text-sm text-slate-400">
            <li>Feedback</li>
            <li>Upload policy</li>
            <li>Community guidelines</li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-300">Contact</p>
          <div className="mt-4 space-y-3 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-emerald-400" />
              hello@freshmanexams.et
            </div>
            <div className="flex items-center gap-2">
              <Send className="h-4 w-4 text-emerald-400" />
              @FreshmanExamsET
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-emerald-400" />
              Addis Ababa, Ethiopia
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-sm text-slate-400 sm:flex-row sm:px-6 lg:px-8">
          <p>© 2026 Freshman Exams ET. Built for Ethiopian students.</p>
          <p>Developed by the Student Archive Team</p>
        </div>
      </div>
    </footer>
  );
}
