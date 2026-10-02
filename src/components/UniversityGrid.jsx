const universities = [
  {
    name: "Ambo University",
    papers: "Mid + Final",
    accent: "from-emerald-500 to-teal-600",
  },
  {
    name: "Addis Ababa University",
    papers: "Mid + Final",
    accent: "from-sky-500 to-cyan-600",
  },
  {
    name: "Jimma University",
    papers: "Mid + Final",
    accent: "from-amber-500 to-orange-500",
  },
  {
    name: "Hawassa University",
    papers: "Mid + Final",
    accent: "from-violet-500 to-purple-600",
  },
  {
    name: "Adama Science and Technology University",
    papers: "Mid + Final",
    accent: "from-rose-500 to-pink-600",
  },
];

export default function UniversityGrid() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
            Universities
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Freshman exam coverage across Ethiopia
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          {universities.map((university) => (
            <article
              key={university.name}
              className="group rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl"
            >
              <div
                className={`mb-5 h-24 rounded-2xl bg-gradient-to-br ${university.accent} p-4 text-white shadow-inner`}
              >
                <div className="flex h-full items-end justify-between">
                  <span className="text-xs uppercase tracking-[0.2em] text-white/80">Archive</span>
                  <span className="rounded-full bg-white/15 px-2 py-1 text-[10px] font-medium">
                    {university.papers}
                  </span>
                </div>
              </div>

              <h3 className="text-base font-semibold text-slate-900">{university.name}</h3>
              <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
                <span>{university.papers}</span>
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-700 transition group-hover:border-emerald-200 group-hover:text-emerald-700">
                  →
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
