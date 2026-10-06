import { ArrowUpRight } from "lucide-react";

const courses = [
  { title: "Communicative English", tag: "ENG-101", color: "bg-emerald-100 text-emerald-700" },
  { title: "Critical Thinking / Logic", tag: "PHI-101", color: "bg-amber-100 text-amber-700" },
  { title: "Applied Math", tag: "MATH-101", color: "bg-sky-100 text-sky-700" },
  { title: "General Physics", tag: "PHY-101", color: "bg-violet-100 text-violet-700" },
  { title: "Social Anthropology", tag: "ANTH-101", color: "bg-rose-100 text-rose-700" },
  { title: "General Psychology", tag: "PSY-101", color: "bg-cyan-100 text-cyan-700" },
  { title: "General Chemistry", tag: "CHEM-101", color: "bg-pink-100 text-pink-700" },
];

export default function CourseCategories({ filteredCourses }) {
  const visibleCourses = filteredCourses.length > 0 ? filteredCourses : courses;

  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
              Course archive
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Popular freshman courses
            </h2>
          </div>

          <button
            type="button"
            className="hidden items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 sm:inline-flex hover:border-slate-400"
          >
            View all courses
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visibleCourses.map((course) => (
            <article
              key={course.title}
              className="rounded-[1.5rem] border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg"
            >
              <div className="flex items-start justify-between gap-3">
                <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] ${course.color}`}>
                  {course.tag}
                </span>
                <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-600">
                  18 papers
                </span>
              </div>

              <h3 className="mt-5 text-xl font-semibold text-slate-900">{course.title}</h3>

              <div className="mt-5 flex items-center justify-between text-sm text-slate-600">
                <span>Midterm • Final</span>
                <ArrowUpRight className="h-4 w-4 text-slate-400" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
