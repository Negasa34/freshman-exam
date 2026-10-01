import { useEffect, useRef, useState } from "react";
import {
  Check,
  CheckCircle2,
  FileImage,
  FileText,
  Hash,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";

const courses = [
  { name: "General Physics", code: "Phys 1011" },
  { name: "Logic and Critical Thinking", code: "LoCT 1011" },
  { name: "Applied Mathematics I", code: "Math 1011" },
  { name: "General Chemistry", code: "Chem 1011" },
  { name: "General Biology", code: "Bio 1011" },
  { name: "Communicative English Skills I", code: "Engl 1011" },
];

const universities = ["Ambo", "AAU", "Jimma", "Hawassa", "ASTU"];
const materialTypes = ["Chapter Summaries", "Worksheets", "Handwritten Notes"];
const maximumFileSize = 20 * 1024 * 1024;

function formatFileSize(size) {
  return size < 1024 * 1024 ? `${Math.max(1, Math.round(size / 1024))} KB` : `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export default function UploadNoteModal({ onClose, onUpload }) {
  const [form, setForm] = useState({
    title: "",
    course: "",
    chapter: "",
    university: "",
    uploader: "",
    type: materialTypes[0],
    pages: "",
    description: "",
    file: null,
  });
  const [tags, setTags] = useState([]);
  const [tagDraft, setTagDraft] = useState("");
  const [filePreviewUrl, setFilePreviewUrl] = useState("");
  const [fileError, setFileError] = useState("");
  const [formError, setFormError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState("idle");
  const [progress, setProgress] = useState(0);
  const [toast, setToast] = useState("");
  const dialogRef = useRef(null);
  const titleRef = useRef(null);
  const fileInputRef = useRef(null);
  const previewUrlRef = useRef("");
  const isSubmittingRef = useRef(false);

  useEffect(() => {
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    titleRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !isSubmittingRef.current) {
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = dialogRef.current?.querySelectorAll(
        'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href]',
      );
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus?.();
    };
  }, [onClose]);

  useEffect(() => () => {
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
  }, []);

  const fieldClass = "mt-1.5 w-full border border-[#dce3dc] bg-[#fbfcf8] px-3 py-2.5 text-sm text-[#243b33] outline-none transition focus:border-[#6d9b85] focus:ring-2 focus:ring-[#3b7a62]/10";
  const isUploading = status === "uploading";
  const selectedCourse = courses.find((course) => course.name === form.course);
  const isImage = form.file?.type.startsWith("image/") || /\.(png|jpe?g)$/i.test(form.file?.name ?? "");

  const update = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
    setFormError("");
  };

  const clearFile = () => {
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    previewUrlRef.current = "";
    setFilePreviewUrl("");
    setForm((current) => ({ ...current, file: null }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const setFile = (file) => {
    if (!file) return;
    const extension = file.name.toLowerCase().split(".").pop();
    const allowedType = ["application/pdf", "image/png", "image/jpeg"].includes(file.type);
    const allowedExtension = ["pdf", "png", "jpg", "jpeg"].includes(extension);

    if (!allowedType && !allowedExtension) {
      clearFile();
      setFileError("Choose a PDF, PNG, or JPG file.");
      return;
    }
    if (file.size > maximumFileSize) {
      clearFile();
      setFileError("Choose a file smaller than 20 MB.");
      return;
    }

    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    const previewUrl = URL.createObjectURL(file);
    previewUrlRef.current = previewUrl;
    setFilePreviewUrl(previewUrl);
    setForm((current) => ({ ...current, file }));
    setFileError("");
    setFormError("");
  };

  const addTag = (value) => {
    const trimmed = value.trim().replace(/^#+/, "");
    if (!trimmed) return;
    const tag = `#${trimmed.replace(/\s+/g, "")}`;
    if (!tags.some((current) => current.toLowerCase() === tag.toLowerCase())) {
      setTags((current) => [...current, tag]);
    }
    setTagDraft("");
  };

  const submit = async (event) => {
    event.preventDefault();
    setFormError("");
    if (!form.file) {
      setFileError("Attach a PDF, PNG, or JPG file before posting.");
      fileInputRef.current?.focus();
      return;
    }

    isSubmittingRef.current = true;
    setStatus("uploading");
    setToast("");
    for (const nextProgress of [18, 42, 68, 87, 100]) {
      await new Promise((resolve) => setTimeout(resolve, 110));
      setProgress(nextProgress);
    }

    const extension = form.file.name.toLowerCase().split(".").pop();
    try {
      onUpload({
        ...form,
        code: selectedCourse?.code ?? "",
        pages: Number(form.pages) || 1,
        tags,
        format: extension === "pdf" ? "PDF" : "Image",
      });
      isSubmittingRef.current = false;
      setStatus("success");
      setToast("Your note was posted to this session's archive.");
    } catch {
      isSubmittingRef.current = false;
      setStatus("error");
      setProgress(0);
      setFormError("The note could not be added. Please try again.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-30 flex items-end justify-center bg-[#14251f]/65 p-0 backdrop-blur-sm sm:items-center sm:p-5"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isUploading) onClose();
      }}
    >
      <section ref={dialogRef} className="max-h-[96svh] w-full max-w-155 overflow-y-auto bg-[#f8f9f4] shadow-[0_24px_90px_rgba(0,0,0,.25)] sm:max-h-[92svh]" role="dialog" aria-modal="true" aria-labelledby="upload-title" aria-describedby="upload-description">
        <header className="flex items-start justify-between border-b border-[#dce3dc] px-5 py-5 sm:px-7">
          <div>
            <p className="font-mono text-[9px] tracking-[.15em] text-[#75847c]">GROW THE ARCHIVE</p>
            <h2 id="upload-title" className="mt-1 font-serif text-[26px] leading-tight text-[#203832]">Share your notes</h2>
            <p id="upload-description" className="mt-1 max-w-lg text-xs leading-relaxed text-[#738078]">Add a course resource for students at your university.</p>
          </div>
          <button className="grid h-9 w-9 shrink-0 place-items-center border border-[#dce3dc] text-[#61736a] transition hover:bg-white disabled:opacity-50" onClick={onClose} type="button" aria-label="Close upload dialog" disabled={isUploading}><X size={17} /></button>
        </header>

        <form className="grid gap-x-4 gap-y-3.5 px-5 py-5 sm:grid-cols-2 sm:px-7 sm:py-6" onSubmit={submit}>
          <label className="text-xs font-semibold text-[#41564b] sm:col-span-2">Note title
            <input ref={titleRef} className={fieldClass} value={form.title} onChange={update("title")} placeholder="Chapter 2 Physics Vector Notes" required maxLength={90} />
          </label>
          <label className="text-xs font-semibold text-[#41564b]">Course
            <select className={fieldClass} value={form.course} onChange={update("course")} required>
              <option value="">Choose a course</option>
              {courses.map((course) => <option key={course.code} value={course.name}>{course.name} · {course.code}</option>)}
            </select>
          </label>
          <label className="text-xs font-semibold text-[#41564b]">Chapter / topic number
            <input className={fieldClass} value={form.chapter} onChange={update("chapter")} placeholder="e.g. Chapter 3 or Vectors" required maxLength={40} />
          </label>
          <label className="text-xs font-semibold text-[#41564b]">University
            <select className={fieldClass} value={form.university} onChange={update("university")} required>
              <option value="">Choose university</option>
              {universities.map((university) => <option key={university}>{university}</option>)}
            </select>
          </label>
          <label className="text-xs font-semibold text-[#41564b]">Contributor display name
            <input className={fieldClass} value={form.uploader} onChange={update("uploader")} placeholder="Name shown on the archive" required maxLength={48} />
          </label>
          <label className="text-xs font-semibold text-[#41564b]">Material type
            <select className={fieldClass} value={form.type} onChange={update("type")}>
              {materialTypes.map((type) => <option key={type}>{type}</option>)}
            </select>
          </label>
          <label className="text-xs font-semibold text-[#41564b]">Page count <span className="font-normal text-[#829087]">(optional)</span>
            <input className={fieldClass} type="number" min="1" max="500" value={form.pages} onChange={update("pages")} placeholder="e.g. 8" />
          </label>

          <div className="sm:col-span-2">
            <p className="text-xs font-semibold text-[#41564b]">Attach your notes</p>
            <input ref={fileInputRef} className="sr-only" type="file" accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg" onChange={(event) => setFile(event.target.files?.[0])} aria-label="Choose a PDF, PNG, or JPG file" />
            <button
              className={`mt-1.5 flex min-h-28 w-full flex-col items-center justify-center gap-2 border border-dashed px-4 py-4 text-center transition ${isDragging ? "border-[#347363] bg-[#edf4ed]" : "border-[#b9c9bd] bg-white hover:border-[#7fa999]"}`}
              type="button"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(event) => { event.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(event) => { event.preventDefault(); setIsDragging(false); setFile(event.dataTransfer.files?.[0]); }}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  fileInputRef.current?.click();
                }
              }}
              aria-label="Choose a note file or drop it here"
              aria-describedby={fileError ? "file-error" : "file-hint"}
            >
              {form.file ? (
                <span className="flex w-full items-center gap-3 text-left">
                  {isImage ? <img className="h-16 w-16 shrink-0 object-cover" src={filePreviewUrl} alt="Selected note preview" /> : <span className="grid h-12 w-12 shrink-0 place-items-center bg-[#edf3eb] text-[#347363]"><FileText size={21} /></span>}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-xs font-semibold text-[#354d41]">{form.file.name}</span>
                    <span className="mt-1 block text-[10px] text-[#7a8980]">{isImage ? "Image preview ready" : "PDF preview ready"} · {formatFileSize(form.file.size)}</span>
                    <span className="mt-1.5 block text-[10px] font-semibold text-[#347363]">Choose a different file</span>
                  </span>
                  <span className="grid h-8 w-8 shrink-0 place-items-center text-[#839187]" aria-hidden="true"><FileImage size={16} /></span>
                </span>
              ) : (
                <>
                  <span className="grid h-9 w-9 place-items-center bg-[#edf4ed] text-[#3b7966]"><Upload size={17} /></span>
                  <span className="text-xs font-semibold text-[#415b4e]">Drop a file here or browse</span>
                  <span id="file-hint" className="text-[10px] text-[#849087]">PDF, PNG, JPG · Up to 20 MB</span>
                </>
              )}
            </button>
            {form.file && !isImage && filePreviewUrl && <iframe className="mt-2 h-40 w-full border border-[#dce3dc] bg-white" src={filePreviewUrl} title={`PDF preview: ${form.file.name}`} />}
            {form.file && <button className="mt-1.5 inline-flex items-center gap-1 text-[10px] text-[#9f5847] hover:underline" type="button" onClick={clearFile}><Trash2 size={12} />Remove file</button>}
            {fileError && <p id="file-error" className="mt-1 text-[10px] text-[#a74e3b]" role="alert">{fileError}</p>}
          </div>

          <label className="text-xs font-semibold text-[#41564b] sm:col-span-2">Description <span className="font-normal text-[#829087]">(optional)</span>
            <textarea className={`${fieldClass} min-h-20 resize-y`} value={form.description} onChange={update("description")} placeholder="A short summary of the concepts or topics covered..." maxLength={280} />
          </label>
          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-[#41564b]" htmlFor="note-tags">Tags <span className="font-normal text-[#829087]">(optional)</span></label>
            <div className="mt-1.5 flex min-h-11 flex-wrap items-center gap-1.5 border border-[#dce3dc] bg-[#fbfcf8] px-2.5 py-2 focus-within:border-[#6d9b85]">
              {tags.map((tag) => <span key={tag} className="inline-flex items-center gap-1 bg-[#edf4ed] px-2 py-1 font-mono text-[10px] text-[#306957]">{tag}<button className="grid h-4 w-4 place-items-center" type="button" aria-label={`Remove ${tag}`} onClick={() => setTags((current) => current.filter((item) => item !== tag))}><X size={11} /></button></span>)}
              <span className="inline-flex min-w-35 flex-1 items-center gap-1 text-[#8a9790]"><Hash size={13} /><input id="note-tags" className="min-w-0 flex-1 border-0 bg-transparent text-xs text-[#283a34] outline-none placeholder:text-[#a0aaa2] focus:ring-0" value={tagDraft} onChange={(event) => setTagDraft(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === ",") { event.preventDefault(); addTag(tagDraft); } }} placeholder="Add a tag, press Enter" /></span>
              <button className="grid h-7 w-7 shrink-0 place-items-center text-[#61776a] hover:bg-[#edf4ed]" type="button" aria-label="Add tag" onClick={() => addTag(tagDraft)}><Plus size={15} /></button>
            </div>
            <p className="mt-1 text-[10px] text-[#849087]">Examples: #MidtermPrep, #Chapter3</p>
          </div>

          {formError && <p className="text-[11px] text-[#a74e3b] sm:col-span-2" role="alert">{formError}</p>}

          {isUploading && <div className="sm:col-span-2" aria-live="polite">
            <div className="mb-1.5 flex justify-between text-[10px] text-[#6d7d73]"><span>Preparing your note in this browser...</span><span>{progress}%</span></div>
            <div className="h-1.5 overflow-hidden bg-[#e4e9e1]" role="progressbar" aria-label="Upload progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}><div className="h-full bg-[#347363] transition-[width] duration-200" style={{ width: `${progress}%` }} /></div>
          </div>}

          <p className="text-[10px] leading-relaxed text-[#7b8981] sm:col-span-2">This demo keeps the note in this browser session; it is not sent to a server.</p>
          <div className="flex justify-end gap-2 border-t border-[#e1e6df] pt-4 sm:col-span-2">
            {status === "success" ? (
              <button className="inline-flex min-h-10 items-center gap-2 bg-[#225d4f] px-4 py-2.5 text-xs font-semibold text-[#f6f5e9] hover:bg-[#194e43]" type="button" onClick={onClose}><Check size={14} />Done</button>
            ) : (
              <>
                <button className="px-4 py-2.5 text-xs font-semibold text-[#60736a] transition hover:bg-[#edf1e9] disabled:opacity-50" type="button" onClick={onClose} disabled={isUploading}>Cancel</button>
                <button className="inline-flex min-h-10 items-center gap-2 bg-[#225d4f] px-4 py-2.5 text-xs font-semibold text-[#f6f5e9] transition hover:bg-[#194e43] disabled:cursor-wait disabled:opacity-70" type="submit" disabled={isUploading}>
                  {isUploading ? <><span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />Posting...</> : <><Upload size={14} />Post note</>}
                </button>
              </>
            )}
          </div>
        </form>
        {toast && <div className="fixed right-4 top-4 z-50 flex items-center gap-2 border border-[#bdd3c0] bg-[#f5fbf3] px-4 py-3 text-xs text-[#32684f] shadow-lg" role="status"><CheckCircle2 size={17} />{toast}</div>}
      </section>
    </div>
  );
}