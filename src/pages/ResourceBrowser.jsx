
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  BookText,
  ClipboardList,
  FileText,
  GraduationCap,
  LoaderCircle,
  LockKeyhole,
  ExternalLink,
  Download,
} from "lucide-react";

import UniversityGrid from "../components/UniversityGrid.jsx";
import { apiRequest } from "../api.js";

const categories = [
  { id: "modules", label: "Modules", icon: BookOpen },
  { id: "notes", label: "Notes", icon: BookText },
  { id: "mid", label: "MID Exams", icon: ClipboardList },
  { id: "final", label: "FINAL Exams", icon: GraduationCap },
];

function getFileUrl(fileUrl) {
  if (!fileUrl) return null;

  if (
    fileUrl.startsWith("http://") ||
    fileUrl.startsWith("https://")
  ) {
    return fileUrl;
  }

  return `http://localhost:5000${
    fileUrl.startsWith("/") ? "" : "/"
  }${fileUrl}`;
}

function ResourceBrowser({ onLogout }) {
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [activeCategory, setActiveCategory] = useState("modules");

  const [courses, setCourses] = useState([]);
  const [resources, setResources] = useState([]);

  const [loadingCourses, setLoadingCourses] = useState(false);
  const [loadingResources, setLoadingResources] = useState(false);

  const [downloadingId, setDownloadingId] = useState(null);
  const [error, setError] = useState("");

  // Load courses for the selected university.
  useEffect(() => {
    if (!selectedUniversity) {
      setCourses([]);
      return;
    }

    let cancelled = false;

    async function loadCourses() {
      try {
        setLoadingCourses(true);
        setError("");

        const data = await apiRequest(
          `/courses?universityId=${encodeURIComponent(
            selectedUniversity.id
          )}`
        );

        if (!cancelled) {
          setCourses(data.courses || []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Unable to load courses.");
        }
      } finally {
        if (!cancelled) {
          setLoadingCourses(false);
        }
      }
    }

    loadCourses();

    return () => {
      cancelled = true;
    };
  }, [selectedUniversity]);

  // Load resources for the selected course and category.
  useEffect(() => {
    if (!selectedCourse) {
      setResources([]);
      return;
    }

    let cancelled = false;

    async function loadResources() {
      try {
        setLoadingResources(true);
        setError("");
        setResources([]);

        let endpoint = "";

        if (activeCategory === "modules") {
          endpoint = `/modules/course/${selectedCourse.id}`;
        } else if (activeCategory === "notes") {
          endpoint = `/notes/course/${selectedCourse.id}`;
        } else {
          endpoint = `/exams/course/${selectedCourse.id}`;
        }

        const data = await apiRequest(endpoint);

        if (cancelled) return;

        if (activeCategory === "modules") {
          setResources(data.modules || []);
        } else if (activeCategory === "notes") {
          setResources(data.notes || []);
        } else {
          const exams = data.exams || [];
          const requiredType =
            activeCategory === "mid" ? "MID" : "FINAL";

          setResources(
            exams.filter((exam) => exam.type === requiredType)
          );
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Unable to load resources.");
        }
      } finally {
        if (!cancelled) {
          setLoadingResources(false);
        }
      }
    }

    loadResources();

    return () => {
      cancelled = true;
    };
  }, [selectedCourse, activeCategory]);

  // Download a PDF as a file.
  async function downloadResource(fileUrl, title, resourceId) {
    try {
      setError("");
      setDownloadingId(resourceId);

      const response = await fetch(fileUrl);

      if (!response.ok) {
        throw new Error("The PDF could not be downloaded.");
      }

      const blob = await response.blob();
      const objectUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = `${title.replace(
        /[<>:"/\\|?*\x00-\x1F]/g,
        "_"
      )}.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.setTimeout(() => {
        window.URL.revokeObjectURL(objectUrl);
      }, 1000);
    } catch (err) {
      setError(
        err.message ||
          "Download failed. Please check your connection and try again."
      );
    } finally {
      setDownloadingId(null);
    }
  }

  function goBackToCourses() {
    setSelectedCourse(null);
    setResources([]);
    setError("");
  }

  function goBackToUniversities() {
    setSelectedUniversity(null);
    setSelectedCourse(null);
    setCourses([]);
    setResources([]);
    setError("");
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Freshman Exam
            </h1>

            <p className="mt-1 text-sm text-slate-600">
              University resources in one place
            </p>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Log out
          </button>
        </header>

        {!selectedUniversity ? (
          <UniversityGrid
            onSelectUniversity={setSelectedUniversity}
          />
        ) : !selectedCourse ? (
          <section>
            <button
              type="button"
              onClick={goBackToUniversities}
              className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-emerald-700 hover:underline"
            >
              <ArrowLeft size={17} />
              Back to universities
            </button>

            <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="text-2xl font-bold text-slate-900">
                {selectedUniversity.name}
              </h2>

              <p className="mt-2 text-slate-600">
                Select a course to explore its learning resources.
              </p>
            </div>

            {loadingCourses && (
              <p className="flex items-center justify-center gap-2 py-8 text-slate-600">
                <LoaderCircle
                  size={20}
                  className="animate-spin"
                />
                Loading courses...
              </p>
            )}

            {!loadingCourses &&
              !error &&
              courses.length === 0 && (
                <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
                  <BookOpen
                    size={36}
                    className="mx-auto text-slate-400"
                  />

                  <h3 className="mt-4 font-semibold text-slate-900">
                    No courses available yet
                  </h3>

                  <p className="mt-2 text-sm text-slate-600">
                    Courses for this university have not been added
                    or linked yet.
                  </p>
                </div>
              )}

            {!loadingCourses && courses.length > 0 && (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {courses.map((course) => (
                  <button
                    key={course.id}
                    type="button"
                    onClick={() => {
                      setSelectedCourse(course);
                      setActiveCategory("modules");
                      setError("");
                    }}
                    className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md"
                  >
                    <BookOpen
                      size={24}
                      className="text-emerald-700"
                    />

                    <h3 className="mt-3 font-semibold text-slate-900">
                      {course.name}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Course code: {course.code}
                    </p>

                    {course.description && (
                      <p className="mt-3 text-sm text-slate-600">
                        {course.description}
                      </p>
                    )}

                    <p className="mt-4 text-sm font-semibold text-emerald-700">
                      Explore resources →
                    </p>
                  </button>
                ))}
              </div>
            )}
          </section>
        ) : (
          <section>
            <button
              type="button"
              onClick={goBackToCourses}
              className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-emerald-700 hover:underline"
            >
              <ArrowLeft size={17} />
              Back to courses
            </button>

            <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6">
              <p className="text-sm text-emerald-700">
                {selectedUniversity.name}
              </p>

              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                {selectedCourse.name}
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Course code: {selectedCourse.code}
              </p>
            </div>

            <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
              {categories.map((category) => {
                const Icon = category.icon;
                const active =
                  activeCategory === category.id;

                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => {
                      setActiveCategory(category.id);
                      setError("");
                    }}
                    className={`flex items-center justify-center gap-2 rounded-xl border p-4 text-sm font-semibold transition ${
                      active
                        ? "border-emerald-700 bg-emerald-700 text-white"
                        : "border-slate-200 bg-white text-slate-700 hover:border-emerald-300"
                    }`}
                  >
                    <Icon size={18} />
                    {category.label}
                  </button>
                );
              })}
            </div>

            {activeCategory === "final" && (
              <div className="mb-5 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                <LockKeyhole
                  size={20}
                  className="mt-0.5 shrink-0"
                />

                <p>
                  FINAL exams are premium resources. You may open
                  available PDFs, but downloading FINAL exams is
                  not available through this interface.
                </p>
              </div>
            )}

            {error && (
              <div className="mb-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            {loadingResources && (
              <p className="flex items-center justify-center gap-2 py-10 text-slate-600">
                <LoaderCircle
                  size={20}
                  className="animate-spin"
                />
                Loading resources...
              </p>
            )}

            {!loadingResources &&
              !error &&
              resources.length === 0 && (
                <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
                  <FileText
                    size={36}
                    className="mx-auto text-slate-400"
                  />

                  <h3 className="mt-4 font-semibold text-slate-900">
                    No resources available
                  </h3>

                  <p className="mt-2 text-sm text-slate-600">
                    No resources have been added to this category
                    for this course yet.
                  </p>
                </div>
              )}

            {!loadingResources &&
              !error &&
              resources.length > 0 && (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {resources.map((resource) => {
                    const title =
                      resource.title || "Untitled resource";

                    const fileUrl = getFileUrl(resource.fileUrl);
                    const isFinal = resource.type === "FINAL";

                    return (
                      <article
                        key={resource.id}
                        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <FileText
                            size={24}
                            className="shrink-0 text-emerald-700"
                          />

                          {isFinal && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-800">
                              <LockKeyhole size={12} />
                              Premium
                            </span>
                          )}
                        </div>

                        <h3 className="mt-3 font-semibold text-slate-900">
                          {title}
                        </h3>

                        {resource.year && (
                          <p className="mt-1 text-sm text-slate-500">
                            Year: {resource.year}
                          </p>
                        )}

                        {resource.type && (
                          <p className="mt-1 text-sm text-slate-500">
                            Type: {resource.type}
                          </p>
                        )}

                        {resource.content && (
                          <p className="mt-3 whitespace-pre-wrap text-sm text-slate-600">
                            {resource.content}
                          </p>
                        )}

                        {fileUrl ? (
                          <div className="mt-4 flex flex-wrap gap-3">
                            <a
                              href={fileUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
                            >
                              Open PDF
                              <ExternalLink size={16} />
                            </a>

                            {!isFinal && (
                              <button
                                type="button"
                                disabled={
                                  downloadingId === resource.id
                                }
                                onClick={() =>
                                  downloadResource(
                                    fileUrl,
                                    title,
                                    resource.id
                                  )
                                }
                                className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                {downloadingId === resource.id ? (
                                  <>
                                    <LoaderCircle
                                      size={16}
                                      className="animate-spin"
                                    />
                                    Downloading...
                                  </>
                                ) : (
                                  <>
                                    <Download size={16} />
                                    Download PDF
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        ) : (
                          <p className="mt-4 text-sm text-slate-500">
                            PDF link is not available for this
                            resource yet.
                          </p>
                        )}
                      </article>
                    );
                  })}
                </div>
              )}
          </section>
        )}
      </div>
    </main>
  );
}

export default ResourceBrowser;
