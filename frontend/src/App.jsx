import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import AuthPage from "./pages/AuthPage.jsx";
import ExamsList from "./pages/ExamsList.jsx";
import NotesArchive from "./pages/NotesArchive.jsx";
import UnityAIAssistant from "./components/ai/UnityAIAssistant.jsx";
import DepartmentGuide from "./pages/DepartmentGuide.jsx";
import Footer from "./components/common/Footer.jsx";

export default function App() {
  const [activePage, setActivePage] = useState("auth");
  const [isDark, setIsDark] = useState(
    () => window.localStorage.getItem("freshman-exams-theme") === "dark",
  );

  useEffect(() => {
    const theme = isDark ? "dark" : "light";
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("freshman-exams-theme", theme);
  }, [isDark]);

  const page = activePage === "departments"
    ? <DepartmentGuide onBrowseExams={() => setActivePage("exams")} onBrowseNotes={() => setActivePage("notes")} onBackToAuth={() => setActivePage("auth")} />
    : activePage === "notes"
      ? <NotesArchive onBrowseExams={() => setActivePage("exams")} onBrowseDepartments={() => setActivePage("departments")} onBackToAuth={() => setActivePage("auth")} />
      : activePage === "exams"
        ? <ExamsList onBackToAuth={() => setActivePage("auth")} onBrowseNotes={() => setActivePage("notes")} onBrowseDepartments={() => setActivePage("departments")} />
        : <AuthPage onBrowseArchive={() => setActivePage("exams")} />;

  return (
    <>
      {page}
      <Footer onNavigate={setActivePage} />
      <UnityAIAssistant />
      <button
        className="theme-toggle"
        type="button"
        onClick={() => setIsDark((current) => !current)}
        aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
        aria-pressed={isDark}
        title={`Switch to ${isDark ? "light" : "dark"} mode`}
      >
        {isDark ? <Sun aria-hidden="true" size={17} /> : <Moon aria-hidden="true" size={17} />}
      </button>
    </>
  );
}
