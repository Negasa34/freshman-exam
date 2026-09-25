import { useMemo, useState } from 'react'
import {
  BookOpen,
  Bookmark,
  Building2,
  ChevronDown,
  Download,
  Eye,
  FileText,
  GraduationCap,
  Landmark,
  MoonStar,
  Search,
  SunMedium,
  UploadCloud,
  UserCircle2,
  X,
} from 'lucide-react'

const universityMeta = [
  {
    id: 'all',
    name: 'All Universities',
    short: 'All',
    accent: 'from-indigo-600 to-blue-500',
    description: 'Across all campuses',
  },
  {
    id: 'ambo',
    name: 'Ambo University',
    short: 'AMU',
    accent: 'from-sky-600 to-cyan-500',
    description: 'Engineering & Natural Science',
  },
  {
    id: 'aau',
    name: 'Addis Ababa University',
    short: 'AAU',
    accent: 'from-indigo-600 to-violet-500',
    description: 'Medical, CS & Social Sciences',
  },
  {
    id: 'astu',
    name: 'Adama Science & Technology',
    short: 'ASTU',
    accent: 'from-emerald-600 to-green-500',
    description: 'Applied science & engineering',
  },
  {
    id: 'jimma',
    name: 'Jimma University',
    short: 'JU',
    accent: 'from-orange-500 to-amber-500',
    description: 'Health & technology',
  },
  {
    id: 'hawassa',
    name: 'Hawassa University',
    short: 'HU',
    accent: 'from-teal-600 to-emerald-500',
    description: 'Agriculture & business',
  },
]

const mockExams = [
  {
    id: 1,
    title: 'Data Structures & Algorithms',
    university: 'Ambo University',
    universityId: 'ambo',
    department: 'Computer Science',
    type: 'Final',
    year: '2024',
    semester: 'Semester II',
    fileSize: '2.4 MB',
    uploader: 'Abel T.',
    verified: true,
    courseCode: 'CS-204',
    fileType: 'PDF',
    pages: 8,
    description: 'Final exam covering stacks, queues, trees, and graph traversal.',
  },
  {
    id: 2,
    title: 'Database Management Systems',
    university: 'Addis Ababa University',
    universityId: 'aau',
    department: 'Software Engineering',
    type: 'Midterm',
    year: '2023',
    semester: 'Semester I',
    fileSize: '1.8 MB',
    uploader: 'Selam A.',
    verified: true,
    courseCode: 'SE-310',
    fileType: 'PDF',
    pages: 6,
    description: 'SQL queries, normalization, and transaction processing.',
  },
  {
    id: 3,
    title: 'Medical Physiology',
    university: 'Addis Ababa University',
    universityId: 'aau',
    department: 'Medicine',
    type: 'Exit Exam',
    year: '2025',
    semester: 'Semester II',
    fileSize: '3.1 MB',
    uploader: 'Netsanet K.',
    verified: true,
    courseCode: 'MED-412',
    fileType: 'PDF',
    pages: 11,
    description: 'System physiology and clinical correlations from recent past papers.',
  },
  {
    id: 4,
    title: 'Structural Analysis II',
    university: 'ASTU',
    universityId: 'astu',
    department: 'Civil Engineering',
    type: 'Final',
    year: '2022',
    semester: 'Semester I',
    fileSize: '2.9 MB',
    uploader: 'Samuel B.',
    verified: true,
    courseCode: 'CE-322',
    fileType: 'PDF',
    pages: 10,
    description: 'Moment distribution, deflection analysis and frame behavior.',
  },
  {
    id: 5,
    title: 'Operating Systems',
    university: 'Jimma University',
    universityId: 'jimma',
    department: 'Computer Science',
    type: 'Final',
    year: '2024',
    semester: 'Semester II',
    fileSize: '2.2 MB',
    uploader: 'Dawit M.',
    verified: true,
    courseCode: 'CS-301',
    fileType: 'PDF',
    pages: 9,
    description: 'Process scheduling, memory management, and synchronization.',
  },
  {
    id: 6,
    title: 'Business Law',
    university: 'Hawassa University',
    universityId: 'hawassa',
    department: 'Business Administration',
    type: 'Midterm',
    year: '2021',
    semester: 'Semester I',
    fileSize: '1.4 MB',
    uploader: 'Tigist H.',
    verified: false,
    courseCode: 'BUS-215',
    fileType: 'PDF',
    pages: 5,
    description: 'Commercial law and contract basics with case scenarios.',
  },
  {
    id: 7,
    title: 'Digital Logic Design',
    university: 'Ambo University',
    universityId: 'ambo',
    department: 'Computer Science',
    type: 'Final',
    year: '2025',
    semester: 'Semester I',
    fileSize: '2.7 MB',
    uploader: 'Eden Y.',
    verified: true,
    courseCode: 'CS-102',
    fileType: 'PDF',
    pages: 12,
    description: 'Boolean algebra, combinational logic, and sequential systems.',
  },
]

const departments = [
  'All Departments',
  'Computer Science',
  'Software Engineering',
  'Medicine',
  'Civil Engineering',
  'Business Administration',
]

const examTypes = ['All', 'Midterm', 'Final', 'Exit Exam']

function App() {
  const [darkMode, setDarkMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUniversity, setSelectedUniversity] = useState('all')
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments')
  const [selectedExamType, setSelectedExamType] = useState('All')
  const [previewExam, setPreviewExam] = useState(null)
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [uploadForm, setUploadForm] = useState({
    university: 'Ambo University',
    department: 'Computer Science',
    title: '',
    type: 'Final',
    year: '2025',
    fileName: 'No file selected',
  })

  const suggestions = useMemo(() => {
    const values = [...new Set(mockExams.map((item) => item.title))]
    return values.filter((item) => item.toLowerCase().includes(searchQuery.toLowerCase()))
  }, [searchQuery])

  const filteredExams = useMemo(() => {
    return mockExams.filter((exam) => {
      const matchesUniversity =
        selectedUniversity === 'all' || exam.universityId === selectedUniversity
      const matchesDepartment =
        selectedDepartment === 'All Departments' || exam.department === selectedDepartment
      const matchesType = selectedExamType === 'All' || exam.type === selectedExamType
      const matchesSearch =
        !searchQuery ||
        exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exam.courseCode.toLowerCase().includes(searchQuery.toLowerCase())

      return matchesUniversity && matchesDepartment && matchesType && matchesSearch
    })
  }, [selectedUniversity, selectedDepartment, selectedExamType, searchQuery])

  const handleUploadSubmit = (e) => {
    e.preventDefault()
    setUploadModalOpen(false)
    setUploadForm({
      university: 'Ambo University',
      department: 'Computer Science',
      title: '',
      type: 'Final',
      year: '2025',
      fileName: 'No file selected',
    })
  }

  const activeUniversityName =
    universityMeta.find((u) => u.id === selectedUniversity)?.name || 'All Universities'

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-slate-100 text-slate-800 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Navbar
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            suggestions={suggestions}
            selectedUniversity={selectedUniversity}
            setSelectedUniversity={setSelectedUniversity}
            setUploadModalOpen={setUploadModalOpen}
            activeUniversityName={activeUniversityName}
            filteredCount={filteredExams.length}
          />

          <main className="space-y-8 pt-6">
            <UniversitySelector
              universities={universityMeta}
              selectedUniversity={selectedUniversity}
              setSelectedUniversity={setSelectedUniversity}
            />

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-indigo-500">
                    Exam bank
                  </p>
                  <h2 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                    Explore past papers
                  </h2>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <FilterSelect
                    label="Department"
                    value={selectedDepartment}
                    onChange={setSelectedDepartment}
                    options={departments}
                  />
                  <FilterSelect
                    label="Exam Type"
                    value={selectedExamType}
                    onChange={setSelectedExamType}
                    options={examTypes}
                  />
                </div>
              </div>
            </div>

            <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredExams.length > 0 ? (
                filteredExams.map((exam) => (
                  <ExamCard
                    key={exam.id}
                    exam={exam}
                    onPreview={() => setPreviewExam(exam)}
                    onDownload={() => alert(`Downloading: ${exam.title}`)}
                  />
                ))
              ) : (
                <div className="col-span-full rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
                  <BookOpen className="mx-auto h-10 w-10 text-slate-400" />
                  <h3 className="mt-4 text-lg font-semibold text-slate-700 dark:text-slate-200">
                    No papers match your filters
                  </h3>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    Try adjusting the university, department, or exam type.
                  </p>
                </div>
              )}
            </section>
          </main>
        </div>
      </div>

      {previewExam && <PreviewModal exam={previewExam} onClose={() => setPreviewExam(null)} />}

      {uploadModalOpen && (
        <UploadModal
          form={uploadForm}
          setForm={setUploadForm}
          onClose={() => setUploadModalOpen(false)}
          onSubmit={handleUploadSubmit}
        />
      )}
    </div>
  )
}

function Navbar({
  darkMode,
  setDarkMode,
  searchQuery,
  setSearchQuery,
  suggestions,
  selectedUniversity,
  setSelectedUniversity,
  setUploadModalOpen,
  activeUniversityName,
  filteredCount,
}) {
  return (
    <header className="rounded-3xl border border-slate-200 bg-white/90 p-4 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/90">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-500 shadow-lg shadow-indigo-500/30">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              UniExams Ethio
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Past papers • Batches • Resources
            </p>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-3 xl:mx-8 xl:max-w-3xl">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              type="text"
              placeholder="Search course name or code..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            />
            {searchQuery && suggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-[calc(100%+0.6rem)] z-20 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-800">
                {suggestions.slice(0, 4).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setSearchQuery(item)}
                    className="block w-full px-4 py-3 text-left text-sm text-slate-600 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700"
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-[150px] flex-1">
              <select
                value={selectedUniversity}
                onChange={(e) => setSelectedUniversity(e.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 pr-9 text-sm text-slate-700 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                {universityMeta.map((uni) => (
                  <option key={uni.id} value={uni.id}>
                    {uni.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>

            <button
              type="button"
              onClick={() => setUploadModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-500"
            >
              <UploadCloud className="h-4 w-4" />
              Upload Paper
            </button>

            <button
              type="button"
              onClick={() => setDarkMode((prev) => !prev)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 transition hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              aria-label="Toggle theme"
            >
              {darkMode ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
            </button>

            <div className="hidden items-center gap-2 sm:flex">
              <button
                type="button"
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                Login
              </button>
              <button
                type="button"
                className="rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400"
              >
                Register
              </button>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-200">
                <UserCircle2 className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <Landmark className="h-3.5 w-3.5" />
        <span>{activeUniversityName}</span>
        <span className="rounded-full bg-slate-100 px-2 py-1 dark:bg-slate-800">
          {filteredCount} results
        </span>
      </div>
    </header>
  )
}

function UniversitySelector({ universities, selectedUniversity, setSelectedUniversity }) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      {universities.map((uni) => {
        const isSelected = selectedUniversity === uni.id
        return (
          <button
            key={uni.id}
            type="button"
            onClick={() => setSelectedUniversity(uni.id)}
            className={`group relative overflow-hidden rounded-3xl border p-4 text-left shadow-sm transition ${
              isSelected
                ? 'border-indigo-500 bg-white ring-2 ring-indigo-200 dark:border-indigo-500 dark:bg-slate-900 dark:ring-indigo-900/50'
                : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900'
            }`}
          >
            <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${uni.accent}`} />
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className={`mb-4 inline-flex rounded-xl bg-gradient-to-r ${uni.accent} px-2.5 py-1.5 text-xs font-semibold text-white`}>
                  {uni.short}
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{uni.name}</h3>
              </div>
              <Building2 className="h-5 w-5 text-slate-400" />
            </div>
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">{uni.description}</p>
            <div className="mt-5 flex items-center justify-between text-sm">
              <span className="font-medium text-slate-700 dark:text-slate-200">
                {Math.floor(Math.random() * 120) + 60} papers
              </span>
              <span className="text-indigo-500">Explore →</span>
            </div>
          </button>
        )
      })}
    </section>
  )
}

function FilterSelect({ label, value, onChange, options }) {
  return (
    <div className="relative min-w-[170px]">
      <label className="mb-1 block text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 pr-9 text-sm text-slate-700 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      </div>
    </div>
  )
}

function ExamCard({ exam, onPreview, onDownload }) {
  return (
    <article className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-indigo-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-200">
              {exam.university}
            </span>
            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200">
              {exam.department}
            </span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">{exam.title}</h3>
        </div>
        <button
          type="button"
          aria-label="Bookmark"
          className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:border-slate-300 hover:text-indigo-600 dark:border-slate-700 dark:text-slate-300"
        >
          <Bookmark className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 space-y-3">
        <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
          <span className="inline-flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            {exam.courseCode}
          </span>
          <span>{exam.type}</span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <InfoPill icon={<CalendarIcon />} label={exam.year} />
          <InfoPill icon={<FilterChipIcon />} label={exam.semester} />
        </div>

        <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2 text-sm dark:bg-slate-800">
          <span className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <FileText className="h-4 w-4 text-indigo-500" />
            {exam.fileType}
          </span>
          <span className="text-slate-500 dark:text-slate-400">{exam.fileSize}</span>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-200">
            {exam.uploader
              .split(' ')
              .map((part) => part[0])
              .slice(0, 2)
              .join('')}
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{exam.uploader}</p>
            <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
              {exam.verified ? 'Verified' : 'Unverified'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onPreview}
            className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <Eye className="h-3.5 w-3.5" />
            Preview
          </button>
          <button
            type="button"
            onClick={onDownload}
            className="inline-flex items-center gap-1 rounded-xl bg-emerald-500 px-3 py-2 text-xs font-semibold text-white shadow-md shadow-emerald-500/20 transition hover:bg-emerald-400"
          >
            <Download className="h-3.5 w-3.5" />
            Download
          </button>
        </div>
      </div>
    </article>
  )
}

function InfoPill({ icon, label }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
      <span className="text-indigo-500">{icon}</span>
      <span>{label}</span>
    </div>
  )
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5">
      <path
        d="M7 3v2M17 3v2M4 9h16M5 5h14a1 1 0 0 1 1 1v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function FilterChipIcon() {
  return <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5"><path d="M4 6h16M7 12h10M10 18h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
}

function PreviewModal({ exam, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
      <div className="w-full max-w-4xl overflow-hidden rounded-[28px] border border-slate-800 bg-slate-900 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-400">
              PDF Preview
            </p>
            <h3 className="mt-1 text-xl font-bold text-white">{exam.title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-slate-200 transition hover:bg-slate-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid gap-6 p-5 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl border border-slate-700 bg-slate-800 p-4">
            <div className="mb-4 flex items-center justify-between">
              <span className="rounded-full bg-indigo-500/20 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-indigo-200">
                {exam.fileType}
              </span>
              <span className="text-sm text-slate-300">Page 1 of {exam.pages}</span>
            </div>

            <div className="rounded-2xl bg-white p-4 text-slate-700 shadow-inner">
              <div className="mb-5 text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-500">
                  {exam.university}
                </p>
                <h4 className="mt-3 text-2xl font-bold">{exam.title}</h4>
                <p className="mt-2 text-sm text-slate-500">
                  {exam.department} • {exam.courseCode} • {exam.semester}
                </p>
              </div>

              <div className="space-y-3">
                {[1, 2, 3, 4].map((line) => (
                  <div
                    key={line}
                    className="h-3 rounded-full bg-slate-200"
                    style={{ width: `${75 - line * 8}%` }}
                  />
                ))}
                <div className="mt-6 h-28 rounded-xl bg-slate-100 p-3">
                  <div className="h-full rounded-lg border border-dashed border-slate-300 bg-white p-3">
                    <div className="mb-2 h-3 w-16 rounded-full bg-slate-200" />
                    <div className="space-y-2">
                      <div className="h-2.5 w-full rounded-full bg-slate-100" />
                      <div className="h-2.5 w-5/6 rounded-full bg-slate-100" />
                      <div className="h-2.5 w-4/6 rounded-full bg-slate-100" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-700 bg-slate-800 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Paper details</p>
              <div className="mt-4 space-y-3 text-sm text-slate-300">
                <div className="flex justify-between">
                  <span>University</span>
                  <span className="font-medium text-white">{exam.university}</span>
                </div>
                <div className="flex justify-between">
                  <span>Department</span>
                  <span className="font-medium text-white">{exam.department}</span>
                </div>
                <div className="flex justify-between">
                  <span>Exam Type</span>
                  <span className="font-medium text-white">{exam.type}</span>
                </div>
                <div className="flex justify-between">
                  <span>Year</span>
                  <span className="font-medium text-white">{exam.year}</span>
                </div>
                <div className="flex justify-between">
                  <span>File size</span>
                  <span className="font-medium text-white">{exam.fileSize}</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-800 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Notes</p>
              <p className="mt-3 text-sm leading-6 text-slate-300">{exam.description}</p>
            </div>

            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400"
            >
              <Download className="h-4 w-4" />
              Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function UploadModal({ form, setForm, onClose, onSubmit }) {
  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setForm((prev) => ({ ...prev, fileName: file.name }))
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
      <div className="w-full max-w-2xl rounded-[28px] border border-slate-800 bg-slate-900 p-5 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-indigo-400">
              Share a paper
            </p>
            <h3 className="mt-1 text-2xl font-bold text-white">Upload exam file</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-slate-200 transition hover:bg-slate-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="mt-6 space-y-5">
          <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-800 p-6 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-indigo-500/15 text-indigo-300">
              <UploadCloud className="h-7 w-7" />
            </div>
            <p className="mt-4 text-base font-medium text-white">Drag and drop your PDF file here</p>
            <p className="mt-1 text-sm text-slate-400">or browse from your device</p>

            <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500">
              Choose file
              <input type="file" accept="application/pdf" className="hidden" onChange={handleFileChange} />
            </label>

            <p className="mt-3 text-xs text-slate-400">{form.fileName}</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="University">
              <select
                value={form.university}
                onChange={(e) => setForm({ ...form, university: e.target.value })}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white outline-none focus:border-indigo-500"
              >
                <option>Ambo University</option>
                <option>Addis Ababa University</option>
                <option>Adama Science & Technology</option>
                <option>Jimma University</option>
                <option>Hawassa University</option>
              </select>
            </Field>

            <Field label="Department">
              <select
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white outline-none focus:border-indigo-500"
              >
                <option>Computer Science</option>
                <option>Software Engineering</option>
                <option>Medicine</option>
                <option>Civil Engineering</option>
                <option>Business Administration</option>
              </select>
            </Field>

            <Field label="Course Title" className="md:col-span-2">
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Data Structures and Algorithms"
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none focus:border-indigo-500"
              />
            </Field>

            <Field label="Exam Type">
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white outline-none focus:border-indigo-500"
              >
                <option>Midterm</option>
                <option>Final</option>
                <option>Exit Exam</option>
              </select>
            </Field>

            <Field label="Academic Year">
              <select
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white outline-none focus:border-indigo-500"
              >
                <option>2021</option>
                <option>2022</option>
                <option>2023</option>
                <option>2024</option>
                <option>2025</option>
              </select>
            </Field>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400"
            >
              Submit Paper
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Field({ label, children, className = '' }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-sm font-medium text-slate-300">{label}</span>
      {children}
    </label>
  )
}

export default App
