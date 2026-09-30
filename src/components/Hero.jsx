import { ArrowRight, Search, Sparkles } from "lucide-react";

const sampleCourses = [
  "General Physics",
  "Mathematics",
  "Logic",
  "Communicative English",
  "General Chemistry",
  "General Psychology",
  "Social Anthropology",
];

export default function Hero({ searchQuery, setSearchQuery }) {
  const filteredCourses = sampleCourses.filter((course) =>
    course.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="relative overflow-hidden px-4 pb-20 pt-10 sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.08),transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.09),transparent_32%)]" />

      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700">
            <Sparkles className="h-3.5 w-3.5" />
            Freshman exam support for Ethiopian universities
          </div>

          <h1 className="max-w-2xl text-4xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Ethiopian University <span className="text-emerald-700">Freshman Exam Archive</span>
          </h1>

          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
            Access digitized Mid &amp; Final exam papers, answer keys, and model questions from
            Ambo, AAU, Jimma, Hawassa, and Adama Universities.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-200 transition hover:bg-slate-800"
            >
              Explore Exams Now
              <ArrowRight className="h-4 w-4" />
            </button>

            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500 shadow-sm">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              2,400+ papers indexed
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-3 shadow-lg shadow-slate-200/60">
            <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <Search className="h-5 w-5 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search courses or papers..."
                className="w-full border-0 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
              />
            </label>

            <div className="mt-3 flex flex-wrap gap-2">
              {filteredCourses.length > 0 ? (
                filteredCourses.slice(0, 4).map((course) => (
                  <button
                    key={course}
                    type="button"
                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-emerald-300 hover:text-emerald-700"
                  >
                    {course}
                  </button>
                ))
              ) : (
                <span className="text-sm text-slate-500">No matches found</span>
              )}
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -left-8 top-12 h-28 w-28 rounded-full bg-amber-200/80 blur-3xl" />
          <div className="absolute -right-8 bottom-10 h-28 w-28 rounded-full bg-emerald-200/80 blur-3xl" />

          <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_30px_80px_rgba(15,23,42,0.12)]">
            <div className="rounded-[1.5rem] bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 p-5 text-white">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-slate-300">
                <span>Popular paper</span>
                <span>Midterm</span>
              </div>

              <div className="mt-6">
                <p className="text-2xl font-bold">General Physics I</p>
                <p className="mt-2 text-sm text-slate-300">Jimma University • 2024</p>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-3 text-left">
                <div className="rounded-xl bg-white/10 p-3">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-slate-300">Course</p>
                  <p className="mt-2 text-sm font-semibold">PHY-101</p>
                </div>
                <div className="rounded-xl bg-white/10 p-3">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-slate-300">Format</p>
                  <p className="mt-2 text-sm font-semibold">PDF</p>
                </div>
                <div className="rounded-xl bg-white/10 p-3">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-slate-300">Answers</p>
                  <p className="mt-2 text-sm font-semibold">Included</p>
                </div>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Students online</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">24.8k</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Verified files</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">1,436</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
