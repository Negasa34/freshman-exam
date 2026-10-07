import { useState } from "react";
import AuthPage from "./pages/AuthPage.jsx";
import ExamsList from "./pages/ExamsList.jsx";
import NotesArchive from "./pages/NotesArchive.jsx";
import UnityAIAssistant from "./components/ai/UnityAIAssistant.jsx";
import DepartmentGuide from "./pages/DepartmentGuide.jsx";
import Footer from "./components/common/Footer.jsx";

export default function App() {
  const [activePage, setActivePage] = useState("auth");

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
    </>
  );
}
