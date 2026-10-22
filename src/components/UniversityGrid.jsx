
import { useEffect, useState } from "react";
import { ArrowRight, GraduationCap } from "lucide-react";
import { apiRequest } from "../api.js";

const accents = [
  "from-emerald-500 to-teal-600",
  "from-sky-500 to-cyan-600",
  "from-amber-500 to-orange-500",
  "from-violet-500 to-purple-600",
  "from-rose-500 to-pink-600",
];

export default function UniversityGrid({ onSelectUniversity }) {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadUniversities() {
      try {
        setLoading(true);
        setError("");

        const data = await apiRequest("/universities");

        if (!cancelled) {
          setUniversities(data.universities || []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Unable to load universities.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadUniversities();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
            University archive
          </p>

          <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
            Choose your university
          </h2>

          <p className="mt-3 text-slate-600">
            Find courses, modules, notes, and exam papers.
          </p>
        </div>

        {loading && (
          <p className="text-center text-slate-600">
            Loading universities...
          </p>
        )}

        {error && (
          <p className="rounded-xl bg-red-50 p-4 text-center text-red-700">
            {error}
          </p>
        )}

        {!loading && !error && universities.length === 0 && (
          <p className="rounded-xl border border-slate-200 p-6 text-center text-slate-600">
            No universities have been added yet. Please check again later.
          </p>
        )}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {universities.map((university, index) => (
            <button
              key={university.id}
              type="button"
              onClick={() => onSelectUniversity?.(university)}
              className="group rounded-3xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg"
            >
              <div
                className={`mb-5 flex h-24 items-end justify-between rounded-2xl bg-gradient-to-br ${
                  accents[index % accents.length]
                } p-4 text-white`}
              >
                <GraduationCap size={28} />

                <span className="rounded-full bg-white/15 px-2 py-1 text-xs">
                  {university.code}
                </span>
              </div>

              <h3 className="font-semibold text-slate-900">
                {university.name}
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                {university._count?.departments ?? 0} departments
              </p>

              <div className="mt-4 flex items-center justify-between text-sm font-medium text-emerald-700">
                <span>Explore</span>
                <ArrowRight
                  size={17}
                  className="transition group-hover:translate-x-1"
                />
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
