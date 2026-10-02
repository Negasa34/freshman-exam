import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownToLine,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  FileText,
  GraduationCap,
  Search,
  SlidersHorizontal,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { mockExams } from "../data/mockExams.js";
import "./ExamsList.css";

const universities = ["All Universities", "Ambo", "Addis Ababa", "Jimma", "Hawassa", "Adama (ASTU)"];
const examTypes = ["All Types", "Midterm", "Final"];
const academicYears = ["All Years", "2014 E.C.", "2015 E.C.", "2016 E.C.", "2017 E.C."];

function escapePdfText(value) {
  return value.replace(/[\\()]/g, "\\$&").replace(/[^\x20-\x7E]/g, "?");
}

function createExamPdf(exam) {
  const lines = [
    "FRESHMAN EXAMS ET",
    `${exam.university} University | ${exam.year}`,
    `${exam.course} (${exam.code})`,
    `${exam.type} Examination - ${exam.semester}`,
    "",
    "Instructions: Answer all questions. Show your work where applicable.",
    "",
    ...exam.questionsPreview.flatMap((question, index) => [
      `${index + 1}. ${question}`,
      "",
    ]),
    "This is a sample preview from the Freshman Exams ET archive.",
  ];
  const textCommands = lines
    .map((line, index) => `1 0 0 1 54 ${750 - index * 24} Tm (${escapePdfText(line)}) Tj`)
    .join("\n");
  const stream = `BT\n/F1 11 Tf\n${textCommands}\nET`;
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
  ];
  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  return new Blob([pdf], { type: "application/pdf" });
}

function DownloadButton({ exam, compact = false }) {
  const downloadExam = () => {
    const url = URL.createObjectURL(createExamPdf(exam));
    const link = document.createElement("a");
    link.href = url;
    link.download = `${exam.code.replaceAll(" ", "-")}-${exam.year.replaceAll(" ", "")}-${exam.type.toLowerCase()}.pdf`;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <button className={compact ? "preview-download" : "exam-download"} onClick={downloadExam} type="button">
      <ArrowDownToLine aria-hidden="true" size={16} />
      {!compact && <span>Download</span>}
      {compact && <span className="sr-only">Download exam PDF</span>}
    </button>
  );
}

function ExamPreview({ exam, onClose }) {
  const [zoom, setZoom] = useState(100);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="preview-backdrop" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <section className="preview-modal" role="dialog" aria-modal="true" aria-labelledby="preview-title">
        <header className="preview-toolbar">
          <button className="preview-back" onClick={onClose} type="button" aria-label="Close preview">
            <ArrowLeft aria-hidden="true" size={19} />
          </button>
          <div className="preview-file-icon"><FileText aria-hidden="true" size={18} /></div>
          <div className="preview-heading">
            <h2 id="preview-title">{exam.course}</h2>
            <p>{exam.code} <span>·</span> {exam.university} <span>·</span> {exam.year}</p>
          </div>
          <div className="preview-controls" aria-label="Preview controls">
            <button type="button" aria-label="Zoom out" onClick={() => setZoom((value) => Math.max(70, value - 10))}>
              <ZoomOut aria-hidden="true" size={17} />
            </button>
            <span className="zoom-level">{zoom}%</span>
            <button type="button" aria-label="Zoom in" onClick={() => setZoom((value) => Math.min(130, value + 10))}>
              <ZoomIn aria-hidden="true" size={17} />
            </button>
          </div>
          <DownloadButton compact exam={exam} />
          <button className="preview-close" onClick={onClose} type="button" aria-label="Close preview">
            <X aria-hidden="true" size={19} />
          </button>
        </header>
        <div className="preview-canvas">
          <article className="paper-sheet" style={{ transform: `scale(${zoom / 100})` }}>
            <div className="paper-university">{exam.university.toUpperCase()} UNIVERSITY</div>
            <div className="paper-rule" />
            <div className="paper-kicker">FRESHMAN PROGRAM · {exam.semester.toUpperCase()}</div>
            <h3>{exam.course}</h3>
            <p className="paper-subtitle">{exam.code} <span>·</span> {exam.type} Examination <span>·</span> {exam.year}</p>
            <div className="paper-meta"><span>Time allowed: 2 hours</span><span>Total questions: {exam.questions}</span></div>
            <div className="paper-instructions"><strong>Instructions</strong><p>Answer all questions. Write your name and ID number clearly. Show your work where applicable.</p></div>
            <ol className="paper-questions">
              {exam.questionsPreview.map((question) => <li key={question}>{question}<div className="answer-lines" /></li>)}
            </ol>
            <div className="paper-footer"><span>{exam.code}</span><span>Page 1 of {exam.pages}</span></div>
          </article>
        </div>
        <footer className="preview-status"><span><CheckCircle2 aria-hidden="true" size={14} /> Secure preview</span><span>Page 1 of {exam.pages}</span></footer>
      </section>
    </div>
  );
}

function ExamCard({ exam, onPreview }) {
  const universityClass = exam.university.toLowerCase().replace(/[^a-z]+/g, "-").replace(/(^-|-$)/g, "");

  return (
    <article className="exam-card">
      <div className="exam-card-topline">
        <span className={`university-badge badge-${universityClass}`}><GraduationCap aria-hidden="true" size={13} />{exam.university}</span>
        <span className={`type-badge type-${exam.type.toLowerCase()}`}>{exam.type}</span>
      </div>
      <div className="exam-card-main">
        <h3>{exam.course}</h3>
        <p className="course-code">{exam.code} <span>·</span> Freshman course</p>
      </div>
      <div className="exam-metadata">
        <div><span>Academic year</span><strong>{exam.year}</strong></div>
        <div><span>Questions</span><strong>{exam.questions}</strong></div>
        <div><span>Pages</span><strong>{exam.pages}</strong></div>
      </div>
      <div className="verification"><span className="verified-icon"><Check aria-hidden="true" size={11} /></span>Verified Answer Key</div>
      <div className="exam-card-actions">
        <button className="preview-button" onClick={() => onPreview(exam)} type="button"><BookOpen aria-hidden="true" size={15} />Preview PDF</button>
        <DownloadButton exam={exam} />
      </div>
    </article>
  );
}

export default function ExamsList({ onBackToAuth, onBrowseNotes, onBrowseDepartments }) {
  const [search, setSearch] = useState("");
  const [university, setUniversity] = useState(universities[0]);
  const [type, setType] = useState(examTypes[0]);
  const [year, setYear] = useState(academicYears[0]);
  const [activeExam, setActiveExam] = useState(null);

  const filteredExams = useMemo(() => {
    const query = search.trim().toLowerCase();
    return mockExams.filter((exam) => {
      const matchesSearch = !query || `${exam.course} ${exam.code}`.toLowerCase().includes(query);
      return matchesSearch
        && (university === universities[0] || exam.university === university)
        && (type === examTypes[0] || exam.type === type)
        && (year === academicYears[0] || exam.year === year);
    });
  }, [search, university, type, year]);

  const clearFilters = () => {
    setSearch("");
    setUniversity(universities[0]);
    setType(examTypes[0]);
    setYear(academicYears[0]);
  };

  return (
    <div className="exam-archive">
      <div className="archive-ribbon"><span className="ribbon-pulse" />A growing archive, built for Ethiopian freshmen<span className="ribbon-divider">/</span>2014–2017 E.C.</div>
      <header className="archive-header">
        <a className="archive-brand" href="#top" aria-label="Freshman Exams ET home">
          <span className="brand-symbol"><GraduationCap aria-hidden="true" size={21} /></span>
          <span>freshman<span className="brand-accent">.</span><small>EXAMS ET</small></span>
        </a>
        <nav className="archive-nav" aria-label="Main navigation">
          <a href="#archive-heading" className="nav-current">Exam archive</a>
          <a href="#universities">Universities</a>
          <a href="#about-archive">About</a>
        </nav>
        <div className="archive-account-actions">
          {onBrowseNotes && <button className="contribute-link notes-link" onClick={onBrowseNotes} type="button">Study notes <ArrowRight aria-hidden="true" size={15} /></button>}
          {onBrowseDepartments && <button className="contribute-link departments-link" onClick={onBrowseDepartments} type="button" aria-label="Departments"><GraduationCap aria-hidden="true" size={15} /><span>Departments</span></button>}
          <a className="contribute-link" href="mailto:archive@freshmanexams.et?subject=Contribute%20an%20exam">Contribute a paper <ArrowRight aria-hidden="true" size={15} /></a>
          {onBackToAuth && <button className="contribute-link auth-return-link" onClick={onBackToAuth} type="button">Student sign in <ArrowRight aria-hidden="true" size={15} /></button>}
        </div>
      </header>

      <main id="top">
        <section className="archive-intro" aria-labelledby="archive-heading">
          <div className="intro-copy">
            <p className="section-eyebrow"><span />THE STUDY ARCHIVE <span className="eyebrow-year">· 2014—2017 E.C.</span></p>
            <h1 id="archive-heading">Past papers.<br /><em>Clearer paths.</em></h1>
            <p className="intro-description">Find freshman exam papers from universities across Ethiopia. Search a course, choose a year, and get to work.</p>
          </div>
          <div className="intro-note" id="about-archive">
            <span className="note-index">01 / ARCHIVE NOTE</span>
            <p>Collected from students, organized by course, and checked by our academic community.</p>
            <span className="note-mark"><CheckCircle2 aria-hidden="true" size={15} /> STUDENT-SHARED · VERIFIED</span>
          </div>
        </section>

        <section className="archive-content" aria-label="Search exam archive">
          <div className="archive-summary" id="universities">
            <div><span className="summary-number">05</span><span>universities</span></div>
            <span className="summary-rule" />
            <div><span className="summary-number">04</span><span>academic years</span></div>
            <span className="summary-rule" />
            <div><span className="summary-number">01</span><span>freshman archive</span></div>
          </div>
          <div className="search-panel">
            <div className="search-field-wrap">
              <Search aria-hidden="true" size={19} />
              <label className="sr-only" htmlFor="exam-search">Search courses or course code</label>
              <input id="exam-search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search courses or course code..." type="search" />
              {search && <button className="clear-search" onClick={() => setSearch("")} type="button" aria-label="Clear search"><X aria-hidden="true" size={15} /></button>}
            </div>
            <div className="filter-divider" />
            <div className="filter-control"><SlidersHorizontal aria-hidden="true" size={15} /><label className="sr-only" htmlFor="university-filter">University</label><select id="university-filter" value={university} onChange={(event) => setUniversity(event.target.value)}>{universities.map((option) => <option key={option}>{option}</option>)}</select><ChevronDown className="select-chevron" aria-hidden="true" size={14} /></div>
            <div className="filter-control"><label className="sr-only" htmlFor="type-filter">Exam type</label><select id="type-filter" value={type} onChange={(event) => setType(event.target.value)}>{examTypes.map((option) => <option key={option}>{option}</option>)}</select><ChevronDown className="select-chevron" aria-hidden="true" size={14} /></div>
            <div className="filter-control"><label className="sr-only" htmlFor="year-filter">Academic year</label><select id="year-filter" value={year} onChange={(event) => setYear(event.target.value)}>{academicYears.map((option) => <option key={option}>{option}</option>)}</select><ChevronDown className="select-chevron" aria-hidden="true" size={14} /></div>
          </div>

          <div className="results-heading">
            <div><p className="results-kicker">BROWSE THE COLLECTION</p><h2>Exam papers <span>({filteredExams.length})</span></h2></div>
            {(search || university !== universities[0] || type !== examTypes[0] || year !== academicYears[0]) && <button className="reset-filters" onClick={clearFilters} type="button">Clear filters <X aria-hidden="true" size={14} /></button>}
            <p className="results-sort">Showing <strong>{filteredExams.length}</strong> of {mockExams.length} papers</p>
          </div>

          {filteredExams.length > 0 ? <div className="exam-grid">{filteredExams.map((exam) => <ExamCard key={exam.id} exam={exam} onPreview={setActiveExam} />)}</div> : (
            <div className="empty-results"><span className="empty-icon"><Search aria-hidden="true" size={22} /></span><h3>No papers found</h3><p>Try another course name or broaden your filters.</p><button onClick={clearFilters} type="button">Clear all filters</button></div>
          )}
          <footer className="archive-footer"><span>FRESHMAN EXAMS ET <span className="footer-dot">·</span> A STUDENT-SHARED ARCHIVE</span><span>ADDIS ABABA <span className="footer-dot">·</span> ETHIOPIA <span className="footer-flag">✳</span></span></footer>
        </section>
      </main>
      {activeExam && <ExamPreview exam={activeExam} onClose={() => setActiveExam(null)} />}
    </div>
  );
}