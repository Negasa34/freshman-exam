import { useMemo, useState } from "react";
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import UniversityGrid from "./components/UniversityGrid.jsx";
import Features from "./components/Features.jsx";
import CourseCategories from "./components/CourseCategories.jsx";
import Footer from "./components/Footer.jsx";

const courseCatalog = [
  { title: "Communicative English", tag: "ENG-101" },
  { title: "Critical Thinking / Logic", tag: "PHI-101" },
  { title: "Applied Math", tag: "MATH-101" },
  { title: "General Physics", tag: "PHY-101" },
  { title: "Social Anthropology", tag: "ANTH-101" },
  { title: "General Psychology", tag: "PSY-101" },
  { title: "General Chemistry", tag: "CHEM-101" },
];

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCourses = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return courseCatalog;

    return courseCatalog.filter(
      (course) =>
        course.title.toLowerCase().includes(query) ||
        course.tag.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Navbar />
      <Hero searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <UniversityGrid />
      <Features />
      <CourseCategories filteredCourses={filteredCourses} />
      <Footer />
    </div>
  );
}
