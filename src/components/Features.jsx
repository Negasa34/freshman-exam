import { BadgeCheck, FileText, Layers3, Users } from "lucide-react";

const features = [
  {
    title: "Digitized PDF & Quiz Format",
    description:
      "Convert scanned papers into clean, readable digital formats with searchable PDFs and compact quiz layouts.",
    icon: FileText,
  },
  {
    title: "Categorized by Semester",
    description:
      "Filter easily by Midterm, Final, year, and course stream to find the exact paper you need.",
    icon: Layers3,
  },
  {
    title: "Collaborative Community",
    description:
      "Students contribute papers, verify answer keys, and build a trusted archive for every freshman intake.",
    icon: Users,
  },
];

export default function Features() {
  return (
    <section className="bg-slate-50 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
            Platform benefits
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            A smarter way to prepare for freshman exams
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {features.map(({ title, description, icon: Icon }) => (
            <div
              key={title}
              className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60 transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
              <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-slate-700">
                <BadgeCheck className="h-4 w-4 text-emerald-600" />
                Reliable and student-supported
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
