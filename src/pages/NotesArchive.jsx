import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpenText,
  Check,
  FileImage,
  FileText,
  GraduationCap,
  Layers3,
  Plus,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";
import NoteViewer from "../components/NoteViewer.jsx";
import UploadNoteModal from "../components/UploadNoteModal.jsx";

const universities = ["All", "Ambo", "AAU", "Jimma", "Hawassa", "ASTU"];
const materialTypes = ["All Notes", "Chapter Summaries", "Worksheets", "Handwritten Notes"];

const starterNotes = [
  {
    id: "phys-vectors-aau",
    title: "Chapter 2: Vectors & Equilibrium",
    course: "General Physics",
    code: "Phys 1011",
    uploader: "Mekdes Tadesse",
    badge: "Peer reviewed",
    university: "AAU",
    pages: 8,
    format: "PDF",
    downloads: 284,
    type: "Chapter Summaries",
    description: "Vector notation, components, unit vectors, and equilibrium examples with worked solutions.",
  },
  {
    id: "math-summary-ambo",
    title: "Chapter 1: Functions & Graphs",
    course: "Applied Mathematics I",
    code: "Math 1011",
    uploader: "Samuel Bekele",
    badge: "Student upload",
    university: "Ambo",
    pages: 5,
    format: "PDF",
    downloads: 176,
    type: "Chapter Summaries",
    description: "A concise review of function notation, domain and range, transformations, and graph sketching.",
  },
  {
    id: "chem-worksheet-jimma",
    title: "Stoichiometry Practice Set",
    course: "General Chemistry",
    code: "Chem 1011",
    uploader: "Liya Gemechu",
    badge: "Peer reviewed",
    university: "Jimma",
    pages: 4,
    format: "PDF",
    downloads: 139,
    type: "Worksheets",
    description: "Practice problems covering mole conversions, limiting reagents, and percentage yield.",
  },
  {
    id: "bio-notes-hawassa",
    title: "Cell Structure: Lecture Notes",
    course: "General Biology",
    code: "Bio 1011",
    uploader: "Hana Worku",
    badge: "Student upload",
    university: "Hawassa",
    pages: 12,
    format: "Image",
    downloads: 98,
    type: "Handwritten Notes",
    description: "Scanned notebook pages on cell organelles, membrane transport, and microscopy.",
  },
  {
    id: "logic-summary-astu",
    title: "Arguments & Fallacies: Quick Review",
    course: "Logic and Critical Thinking",
    code: "LoCT 1011",
    uploader: "Nahom Alemu",
    badge: "Peer reviewed",
    university: "ASTU",
    pages: 6,
    format: "PDF",
    downloads: 221,
    type: "Chapter Summaries",
    description: "Definitions, argument maps, and common informal fallacies with short examples.",
  },
  {
    id: "english-worksheet-aau",
    title: "Paragraph Writing: Practice Sheet",
    course: "Communicative English Skills I",
    code: "Engl 1011",
    uploader: "Rahel Assefa",
    badge: "Student upload",
    university: "AAU",
    pages: 3,
    format: "PDF",
    downloads: 74,
    type: "Worksheets",
    description: "A guided worksheet for topic sentences, supporting details, transitions, and revision.",
  },
  {
    id: "math-handwritten-jimma",
    title: "Limits & Continuity, Class Notes",
    course: "Applied Mathematics I",
    code: "Math 1011",
    uploader: "Abel Girma",
    badge: "Student upload",
    university: "Jimma",
    pages: 9,
    format: "Image",
    downloads: 112,
    type: "Handwritten Notes",
    description: "Handwritten examples for limit laws, one-sided limits, and continuity tests.",
  },
  {
    id: "physics-worksheet-ambo",
    title: "Motion in One Dimension: Problems",
    course: "General Physics",
    code: "Phys 1011",
    uploader: "Eden Kebede",
    badge: "Peer reviewed",
    university: "Ambo",
    pages: 5,
    format: "PDF",
    downloads: 153,
    type: "Worksheets",
    description: "Short-answer and calculation practice on displacement, velocity, and acceleration.",
  },
  {
    id: "chem-handwritten-hawassa",
    title: "Periodic Trends, Lecture Notes",
    course: "General Chemistry",
    code: "Chem 1011",
    uploader: "Dawit Fikru",
    badge: "Student upload",
    university: "Hawassa",
    pages: 7,
    format: "Image",
    downloads: 63,
    type: "Handwritten Notes",
    description: "Classroom notes on atomic radius, ionization energy, and electronegativity patterns.",
  },
];

const universityClasses = {
  Ambo: "bg-[#edf4e9] text-[#346a57]",
  AAU: "bg-[#edf1f6] text-[#4d637a]",
  Jimma: "bg-[#f7f0e6] text-[#946642]",
  Hawassa: "bg-[#f8efea] text-[#9b5e4d]",
  ASTU: "bg-[#f0f0f7] text-[#5e6485]",
};

function NoteCard({ note, onPreview }) {
  const universityStyle = universityClasses[note.university] ?? "bg-[#edf4ed] text-[#316255]";

  return (
    <article className="group flex min-h-65 flex-col border border-[#dfe4dc] bg-[#fbfcf8] p-4 transition duration-200 hover:-translate-y-0.5 hover:border-[#c2d3c7] hover:shadow-[0_9px_22px_rgba(31,51,41,.07)] sm:p-4.5">
      <div className="flex items-center justify-between gap-2">
        <span className={`inline-flex min-w-0 items-center gap-1.5 px-2 py-1 text-[10px] font-semibold ${universityStyle}`}><GraduationCap size={13} />{note.university}</span>
        <span className={`inline-flex shrink-0 items-center gap-1.5 border px-2 py-1 font-mono text-[9px] ${note.format === "PDF" ? "border-[#e2ddd1] bg-[#f8f5ed] text-[#856b42]" : "border-[#dce1e9] bg-[#f1f3f8] text-[#66728a]"}`}>
          {note.format === "PDF" ? <FileText size={12} /> : <FileImage size={12} />}{note.format}
        </span>
      </div>
      <p className="mt-4 font-mono text-[9px] uppercase tracking-[.11em] text-[#829087]">{note.type}</p>
      <h3 className="mt-1.5 text-[16px] font-semibold leading-snug text-[#213a33]">{note.title}</h3>
      <p className="mt-1.5 text-xs text-[#74837a]">{note.course} <span className="px-1 text-[#c17b5e]">·</span><span className="font-mono text-[10px]">{note.code}</span></p>
      <div className="mt-4 flex items-center gap-2 border-t border-[#e8ebe5] pt-3">
        <span className="grid h-7 w-7 shrink-0 place-items-center bg-[#e7eee5] font-serif text-xs text-[#3b6c59]">{note.uploader.trim().charAt(0).toUpperCase()}</span>
        <span className="min-w-0 flex-1 truncate text-[10px] font-medium text-[#4c6055]">{note.uploader}</span>
        <span className="inline-flex shrink-0 items-center gap-1 text-[9px] text-[#6e8374]"><Check size={11} />{note.badge}</span>
      </div>
      <div className="mt-3 flex items-center justify-between text-[10px] text-[#7a8980]">
        <span className="inline-flex items-center gap-1.5"><Layers3 size={13} />{note.pages} pages</span>
        <span className="inline-flex items-center gap-1.5"><ArrowRight className="rotate-45" size={12} />{note.downloads.toLocaleString()} downloads</span>
      </div>
      <button className="mt-auto inline-flex min-h-9 items-center justify-center gap-2 border border-[#c8d8cd] bg-[#f5f8f2] pt-2 text-[10px] font-semibold text-[#245f52] transition hover:border-[#7fa999] hover:bg-[#eaf3eb]" type="button" onClick={() => onPreview(note)}><BookOpenText size={14} />Read / Preview</button>
    </article>
  );
}

export default function NotesArchive({ onBrowseExams, onBrowseDepartments, onBackToAuth }) {
  const [search, setSearch] = useState("");
  const [university, setUniversity] = useState("All");
  const [activeType, setActiveType] = useState(materialTypes[0]);
  const [notes, setNotes] = useState(starterNotes);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [activeNote, setActiveNote] = useState(null);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const previewUrl = activeNote?.previewUrl;
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [activeNote]);

  const openPreview = (note) => {
    setActiveNote({
      ...note,
      previewUrl: note.file ? URL.createObjectURL(note.file) : "",
    });
  };

  const filteredNotes = useMemo(() => {
    const query = search.trim().toLowerCase();
    return notes.filter((note) => {
      const text = `${note.title} ${note.course} ${note.code} ${note.uploader} ${note.university}`.toLowerCase();
      return (!query || text.includes(query))
        && (university === "All" || note.university === university)
        && (activeType === "All Notes" || note.type === activeType);
    });
  }, [activeType, notes, search, university]);

  const addNote = (form) => {
    const isPdf = form.format === "PDF";
    const nextNote = {
      id: `local-${Date.now()}`,
      title: form.title.trim(),
      course: form.course.trim(),
      code: form.code,
      uploader: form.uploader.trim(),
      badge: "New upload",
      university: form.university,
      pages: Number(form.pages),
      format: isPdf ? "PDF" : "Image",
      fileName: form.file.name,
      downloads: 0,
      type: form.type,
      chapter: form.chapter,
      tags: form.tags,
      description: [form.chapter, form.description, form.tags.join(" ")].filter(Boolean).join(" · ") || `A newly shared ${form.type.toLowerCase()} for ${form.course.trim()}.`,
      file: form.file,
    };
    setNotes((current) => [nextNote, ...current]);
    setSearch("");
    setUniversity("All");
    setActiveType("All Notes");
    setNotice("Your note was added to this session's archive.");
  };

  return (
    <div className="min-h-screen bg-[#f2f4ee] font-sans text-[#172a28]">
      <div className="flex min-h-8.5 items-center justify-center gap-2 px-3 py-1.5 text-center font-mono text-[8px] tracking-wide text-[#e7eee7] sm:gap-2.5 sm:text-[10px]" style={{ backgroundColor: "#1a302d" }}>
        <span className="h-1.5 w-1.5 rounded-full bg-[#e1ad62] shadow-[0_0_0_3px_rgba(225,173,98,.17)]" />A growing archive, built for Ethiopian freshmen<span className="text-[#78918a]">/</span>2014–2017 E.C.
      </div>
      <header className="flex min-h-17 items-center justify-between gap-3 border-b border-[#dfe4dd] bg-[#fbfcf8] px-4 sm:px-7 lg:px-[max(6.5vw,calc((100vw-1320px)/2))]">
        <button className="flex shrink-0 items-center gap-2.5 text-left text-[#172a28]" type="button" onClick={onBackToAuth} aria-label="Freshman Exams ET home">
          <span className="grid h-9 w-9 place-items-center bg-[#1d4841] text-[#f0f0dc]"><GraduationCap size={20} /></span>
          <span className="text-[16px] font-bold leading-tight sm:text-lg">freshman<span className="text-[#c86c50]">.</span><small className="block font-mono text-[8px] font-normal tracking-[.2em] text-[#7a8880]">EXAMS ET</small></span>
        </button>
        <nav className="hidden items-center gap-7 md:flex" aria-label="Archive navigation">
          <button className="text-xs text-[#67756e] transition hover:text-[#172a28]" type="button" onClick={onBrowseExams}>Exam archive</button>
          <span className="relative grid h-17 place-items-center text-xs font-semibold text-[#172a28] after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-[#187566]">Study notes</span>
          <button className="text-xs text-[#67756e] transition hover:text-[#172a28]" type="button" onClick={onBrowseDepartments}>Departments</button>
          <a className="text-xs text-[#67756e] transition hover:text-[#172a28]" href="#about-notes">About</a>
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          <button className="hidden items-center gap-1.5 border border-[#bacbc2] px-3 py-2 text-[10px] font-semibold text-[#24584d] transition hover:bg-[#edf4ee] sm:inline-flex" type="button" onClick={onBrowseExams}><ArrowLeft size={13} />Exams</button>
          <button className="inline-flex min-h-9 items-center gap-1 border border-[#bacbc2] px-2.5 py-2 text-[9px] font-semibold text-[#24584d] transition hover:bg-[#edf4ee] sm:hidden" type="button" onClick={onBrowseDepartments} aria-label="Browse departments">Fields</button>
          <button className="inline-flex items-center gap-1.5 bg-[#225d4f] px-3 py-2.5 text-[10px] font-semibold text-[#f6f5e9] transition hover:bg-[#194e43] sm:px-3.5" type="button" onClick={() => setIsUploadOpen(true)}><Plus size={15} />Share notes</button>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden bg-[#1c3935] px-5 py-10 text-[#f1f0e2] sm:px-9 sm:py-12 lg:px-[max(9.3vw,calc((100vw-1240px)/2))]">
          <div className="pointer-events-none absolute -right-28 -top-48 h-110 w-110 rounded-full border border-white/9 shadow-[0_0_0_45px_rgba(207,222,195,.025),0_0_0_90px_rgba(207,222,195,.018)] sm:right-[12%]" />
          <div className="relative mx-auto flex max-w-310 flex-col justify-between gap-8 md:flex-row md:items-end">
            <div className="max-w-162.5">
              <p className="mb-3 flex items-center gap-2 font-mono text-[8px] tracking-[.14em] text-[#c6d6c6] sm:text-[9px]"><span className="h-px w-5 bg-[#d29167]" />THE STUDY NOTES ARCHIVE <span className="text-[#9eafa3]">· ETHIOPIA</span></p>
              <h1 className="font-serif text-[42px] font-medium leading-[1.04] text-[#f4f1e6] sm:text-[54px]">Notes that make<br /><em className="text-[#d7a879]">concepts click.</em></h1>
              <p className="mt-4 max-w-130 text-[11px] leading-7 text-[#c0cec3] sm:text-xs">Find student-shared summaries, worksheets, and lecture notes for your freshman courses.</p>
            </div>
            <div id="about-notes" className="grid max-w-95 grid-cols-3 gap-5 border-l border-white/25 pl-4 md:mb-1 md:min-w-83.75">
              <div><span className="block font-serif text-[22px] text-[#f4f1e6]">05</span><span className="font-mono text-[7px] tracking-[.08em] text-[#afc2b2]">UNIVERSITIES</span></div>
              <div><span className="block font-serif text-[22px] text-[#f4f1e6]">03</span><span className="font-mono text-[7px] tracking-[.08em] text-[#afc2b2]">MATERIAL TYPES</span></div>
              <div><span className="block font-serif text-[22px] text-[#f4f1e6]">{notes.length.toString().padStart(2, "0")}</span><span className="font-mono text-[7px] tracking-[.08em] text-[#afc2b2]">SHARED NOTES</span></div>
            </div>
          </div>
        </section>

        <section className="mx-auto w-[calc(100%-32px)] max-w-280 pb-8 sm:w-[calc(100%-48px)]" aria-label="Search and browse notes">
          <div className="mt-5 flex flex-col border border-[#dce1d9] bg-[#fbfcf8] shadow-[0_4px_13px_rgba(31,51,41,.03)] md:min-h-15 md:flex-row md:items-center">
            <label className="flex min-h-12.5 flex-1 items-center gap-2.5 px-3.5 text-[#6e827a] sm:px-4">
              <Search size={18} />
              <span className="sr-only">Search note topics</span>
              <input className="w-full min-w-0 border-0 bg-transparent text-xs text-[#283a34] outline-none placeholder:text-[#8a9790] focus:ring-0" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search notes, courses, or course code..." type="search" />
              {search && <button className="grid h-7 w-7 shrink-0 place-items-center text-[#71817a] hover:text-[#245f52]" type="button" onClick={() => setSearch("")} aria-label="Clear search"><X size={15} /></button>}
            </label>
            <div className="flex min-h-11.75 items-center gap-2 border-t border-[#e3e8e0] px-3 md:min-h-15 md:border-l md:border-t-0 md:px-4">
              <GraduationCap className="shrink-0 text-[#71817a]" size={15} />
              <label className="sr-only" htmlFor="notes-university">Filter by university</label>
              <select id="notes-university" className="w-full min-w-0 border-0 bg-transparent py-2 pr-5 text-[11px] text-[#364840] outline-none focus:ring-0 sm:w-36.25" value={university} onChange={(event) => setUniversity(event.target.value)}>
                {universities.map((option) => <option key={option} value={option}>{option === "All" ? "All universities" : option}</option>)}
              </select>
            </div>
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-1 font-mono text-[8px] tracking-[.13em] text-[#75847c]">BROWSE THE COLLECTION</p>
              <h2 className="font-serif text-[25px] font-medium leading-tight text-[#203832]">Notes & materials <span className="font-sans text-sm text-[#87938b]">({filteredNotes.length})</span></h2>
            </div>
            <p className="text-[10px] text-[#7a8980]">Showing <strong className="font-semibold text-[#3b6255]">{filteredNotes.length}</strong> of {notes.length} materials</p>
          </div>

          <div className="mt-4 flex gap-1 overflow-x-auto border-b border-[#dce3dc]" role="tablist" aria-label="Material type">
            {materialTypes.map((type) => (
              <button key={type} id={`material-${type.replaceAll(" ", "-").toLowerCase()}`} className={`relative min-h-10 shrink-0 px-3 text-[10px] transition sm:px-4 ${activeType === type ? "font-semibold text-[#234b3e] after:absolute after:inset-x-3 after:-bottom-px after:h-0.5 after:bg-[#307364] sm:after:inset-x-4" : "text-[#89948b] hover:text-[#365c4d]"}`} type="button" role="tab" aria-selected={activeType === type} aria-controls="notes-results" onClick={() => setActiveType(type)}>{type}</button>
            ))}
          </div>

          {notice && <div className="mt-4 flex items-center justify-between gap-3 border-l-2 border-[#6d9577] bg-[#eef4eb] px-3 py-2.5 text-[11px] text-[#526d5b]" role="status"><span className="inline-flex items-center gap-2"><ShieldCheck size={15} />{notice}</span><button className="p-1" type="button" onClick={() => setNotice("")} aria-label="Dismiss message"><X size={14} /></button></div>}

          <div id="notes-results" className="mt-4" role="tabpanel" aria-labelledby={`material-${activeType.replaceAll(" ", "-").toLowerCase()}`}>
            {filteredNotes.length ? (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {filteredNotes.map((note) => <NoteCard key={note.id} note={note} onPreview={openPreview} />)}
              </div>
            ) : (
              <div className="flex min-h-61.25 flex-col items-center justify-center border border-dashed border-[#cbd7cc] bg-[#fbfcf8]/70 px-5 text-center">
                <span className="grid h-11 w-11 place-items-center bg-[#e8f0e8] text-[#668477]"><Search size={21} /></span>
                <h3 className="mt-3 font-serif text-xl text-[#28453b]">No notes found</h3>
                <p className="mt-1 text-[11px] text-[#75847c]">Try a different search or select another university or material type.</p>
                <button className="mt-4 border border-[#bed0c3] px-3 py-2 text-[10px] font-semibold text-[#306957] hover:bg-[#edf4ed]" type="button" onClick={() => { setSearch(""); setUniversity("All"); setActiveType("All Notes"); }}>Clear filters</button>
              </div>
            )}
          </div>

          <footer className="mt-8 flex justify-between gap-3 border-t border-[#dbe2da] py-4 font-mono text-[7px] tracking-widest text-[#7e8980]">
            <span>FRESHMAN EXAMS ET <span className="px-1 text-[#c4785c]">·</span> A STUDENT-SHARED ARCHIVE</span>
            <span>ADDIS ABABA <span className="px-1 text-[#c4785c]">·</span> ETHIOPIA</span>
          </footer>
        </section>
      </main>

      {isUploadOpen && <UploadNoteModal onClose={() => setIsUploadOpen(false)} onUpload={addNote} />}
      {activeNote && <NoteViewer note={activeNote} onClose={() => setActiveNote(null)} />}
    </div>
  );
}