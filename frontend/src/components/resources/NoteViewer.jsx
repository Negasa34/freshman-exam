import { useEffect, useRef, useState } from "react";
import {
  ArrowDownToLine,
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Check,
  FileImage,
  FileText,
  Maximize,
  MessageCircle,
  Minimize,
  Send,
  ThumbsUp,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

function readStoredBoolean(key) {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(key) === "true";
  } catch {
    return false;
  }
}

function readStoredComments(key) {
  if (typeof window === "undefined") return [];
  try {
    const comments = JSON.parse(window.localStorage.getItem(key) ?? "[]");
    return Array.isArray(comments)
      ? comments.filter((comment) => comment
        && typeof comment.id === "string"
        && typeof comment.author === "string"
        && typeof comment.body === "string"
        && Number.isInteger(comment.page))
      : [];
  } catch {
    return [];
  }
}

function escapePdfText(value) {
  return String(value).replace(/[\\()]/g, "\\$&").replace(/[^\x20-\x7E]/g, "?");
}

function createSamplePdf(note, page) {
  const lines = [
    "FRESHMAN EXAMS ET | STUDY NOTES",
    `${note.university} University | ${note.course} (${note.code})`,
    note.title,
    `Page ${page} of ${note.pages}`,
    "",
    note.chapter ?? note.type,
    note.description,
    ...(note.tags ?? []),
    `Shared by ${note.uploader}`,
    "Sample archive preview. Original file not attached.",
  ];
  const commands = lines
    .map((line, index) => `1 0 0 1 54 ${750 - index * 28} Tm (${escapePdfText(line)}) Tj`)
    .join("\n");
  const stream = `BT\n/F1 11 Tf\n${commands}\nET`;
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

function saveDownload(note, page) {
  const isAttachedFile = Boolean(note.file && note.previewUrl);
  const blob = isAttachedFile ? null : createSamplePdf(note, page);
  const url = isAttachedFile ? note.previewUrl : URL.createObjectURL(blob);
  const extension = isAttachedFile
    ? (note.fileName?.split(".").pop() || (note.format === "PDF" ? "pdf" : "jpg"))
    : "pdf";
  const link = document.createElement("a");
  link.href = url;
  link.download = `${note.title.replace(/[^a-z0-9]+/gi, "-").replace(/(^-|-$)/g, "")}-page-${page}.${extension}`;
  document.body.append(link);
  link.click();
  link.remove();
  if (!isAttachedFile) window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function NoteViewer({ note, onClose }) {
  const totalPages = Math.max(1, Number(note.pages) || 1);
  const likeKey = `freshman-note-like:${note.id}`;
  const bookmarkKey = `freshman-note-bookmark:${note.id}`;
  const commentsKey = `freshman-note-comments:${note.id}`;
  const initialLiked = readStoredBoolean(likeKey);
  const [page, setPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [liked, setLiked] = useState(initialLiked);
  const [usefulCount, setUsefulCount] = useState((note.usefulCount ?? Math.max(3, Math.round((note.downloads ?? 20) * 0.15))) + Number(initialLiked));
  const [bookmarked, setBookmarked] = useState(() => readStoredBoolean(bookmarkKey));
  const [comments, setComments] = useState(() => readStoredComments(commentsKey));
  const [commentText, setCommentText] = useState("");
  const [commentPage, setCommentPage] = useState("all");
  const [fullscreen, setFullscreen] = useState(false);
  const [commentError, setCommentError] = useState("");
  const readerRef = useRef(null);
  const dialogRef = useRef(null);
  const commentRef = useRef(null);

  useEffect(() => {
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key === "Tab") {
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
      }
    };

    const handleFullscreenChange = () => setFullscreen(document.fullscreenElement === readerRef.current);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus?.();
    };
  }, [onClose]);

  const toggleLike = () => {
    const nextLiked = !liked;
    setLiked(nextLiked);
    setUsefulCount((count) => count + (nextLiked ? 1 : -1));
    try {
      window.localStorage.setItem(likeKey, String(nextLiked));
    } catch {
      // Keep the reaction active for this session if storage is unavailable.
    }
  };

  const toggleBookmark = () => {
    const nextBookmarked = !bookmarked;
    setBookmarked(nextBookmarked);
    try {
      window.localStorage.setItem(bookmarkKey, String(nextBookmarked));
    } catch {
      // Keep the bookmark active for this session if storage is unavailable.
    }
  };

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await readerRef.current?.requestFullscreen?.();
    } catch {
      setFullscreen(false);
    }
  };

  const postComment = (event) => {
    event.preventDefault();
    const body = commentText.trim();
    if (!body) {
      setCommentError("Write a question or comment first.");
      commentRef.current?.focus();
      return;
    }
    const nextComments = [...comments, {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      author: "You",
      body,
      page,
      createdAt: new Date().toISOString(),
    }];
    setComments(nextComments);
    setCommentText("");
    setCommentError("");
    setCommentPage(String(page));
    try {
      window.localStorage.setItem(commentsKey, JSON.stringify(nextComments));
    } catch {
      // Keep comments available for this session if storage is unavailable.
    }
  };

  const visibleComments = comments.filter((comment) => commentPage === "all" || comment.page === Number(commentPage));
  const isImage = note.format === "Image";
  const documentUrl = note.previewUrl && !isImage
    ? `${note.previewUrl}#page=${page}&zoom=${zoom}`
    : note.previewUrl;

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-[#14251f]/80 p-0 backdrop-blur-sm sm:p-3" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <section ref={readerRef} className="flex min-h-0 flex-1 flex-col bg-[#e9ece7] shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="note-reader-title" tabIndex={-1}>
        <header className="flex min-h-16 items-center gap-2 border-b border-[#dce2da] bg-[#fbfcf8] px-3 sm:gap-3 sm:px-5">
          <button className="grid h-9 w-9 shrink-0 place-items-center border border-[#dce4dc] text-[#536a5f] transition hover:bg-[#edf4ed]" type="button" onClick={onClose} aria-label="Close note reader" title="Close reader"><ArrowLeft size={18} /></button>
          <div className="grid h-9 w-9 shrink-0 place-items-center bg-[#edf3eb] text-[#347363]">{isImage ? <FileImage size={17} /> : <FileText size={17} />}</div>
          <div className="min-w-0 flex-1">
            <h2 id="note-reader-title" className="truncate text-xs font-semibold text-[#263d34] sm:text-sm">{note.title}</h2>
            <p className="mt-1 truncate font-mono text-[8px] text-[#7b8981] sm:text-[9px]">{note.code} · {note.university} · {note.course}</p>
          </div>
          <div className="hidden items-center gap-1 sm:flex">
            <button className={`inline-flex min-h-9 items-center gap-1.5 border px-2.5 text-[10px] font-semibold transition ${liked ? "border-[#9fc4a8] bg-[#edf6ec] text-[#28634d]" : "border-[#dce4dc] text-[#536a5f] hover:bg-[#edf4ed]"}`} type="button" onClick={toggleLike} aria-pressed={liked} title="Mark this note useful"><ThumbsUp size={14} />Useful <span>{usefulCount}</span></button>
            <button className={`inline-flex min-h-9 items-center gap-1.5 border px-2.5 text-[10px] font-semibold transition ${bookmarked ? "border-[#d6c193] bg-[#f7f1e2] text-[#806a3f]" : "border-[#dce4dc] text-[#536a5f] hover:bg-[#edf4ed]"}`} type="button" onClick={toggleBookmark} aria-pressed={bookmarked} title={bookmarked ? "Remove from My Notes" : "Save to My Notes"}><Bookmark size={14} fill={bookmarked ? "currentColor" : "none"} />{bookmarked ? "Saved" : "Save to My Notes"}</button>
            <button className="inline-flex min-h-9 items-center gap-1.5 border border-[#dce4dc] px-2.5 text-[10px] font-semibold text-[#536a5f] transition hover:bg-[#edf4ed]" type="button" onClick={() => saveDownload(note, page)} title={isImage && note.file ? "Download original image" : "Download PDF"}><ArrowDownToLine size={14} />{isImage && note.file ? "Download image" : "Download PDF"}</button>
          </div>
          <button className="grid h-9 w-9 shrink-0 place-items-center border border-transparent text-[#536a5f] hover:border-[#dce4dc] hover:bg-[#edf4ed]" type="button" onClick={onClose} aria-label="Close note reader" title="Close reader"><X size={18} /></button>
        </header>

        <div className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden lg:grid-cols-[minmax(0,1fr)_350px]">
          <div className="flex min-h-0 flex-col">
            <div className="flex min-h-12 flex-wrap items-center justify-between gap-2 border-b border-[#d9dfd8] bg-[#f6f7f2] px-3 py-1.5 sm:px-5">
              <div className="flex items-center gap-1.5">
                <button className="grid h-8 w-8 place-items-center border border-[#dce4dc] text-[#536a5f] hover:bg-white disabled:cursor-not-allowed disabled:opacity-40" type="button" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page <= 1} aria-label="Previous page" title="Previous page"><ArrowLeft size={15} /></button>
                <span className="min-w-20.5 text-center font-mono text-[9px] text-[#52685e]" aria-live="polite">Page {page} of {totalPages}</span>
                <button className="grid h-8 w-8 place-items-center border border-[#dce4dc] text-[#536a5f] hover:bg-white disabled:cursor-not-allowed disabled:opacity-40" type="button" onClick={() => setPage((current) => Math.min(totalPages, current + 1))} disabled={page >= totalPages} aria-label="Next page" title="Next page"><ArrowRight size={15} /></button>
              </div>
              <div className="flex items-center gap-1.5">
                <button className="grid h-8 w-8 place-items-center border border-[#dce4dc] text-[#536a5f] hover:bg-white disabled:opacity-40" type="button" onClick={() => setZoom((current) => Math.max(50, current - 10))} disabled={zoom <= 50} aria-label="Zoom out" title="Zoom out"><ZoomOut size={15} /></button>
                <span className="min-w-10 text-center font-mono text-[9px] text-[#52685e]" aria-live="polite">{zoom}%</span>
                <button className="grid h-8 w-8 place-items-center border border-[#dce4dc] text-[#536a5f] hover:bg-white disabled:opacity-40" type="button" onClick={() => setZoom((current) => Math.min(180, current + 10))} disabled={zoom >= 180} aria-label="Zoom in" title="Zoom in"><ZoomIn size={15} /></button>
                <span className="mx-1 hidden h-5 w-px bg-[#dce2da] sm:block" />
                <button className="grid h-8 w-8 place-items-center border border-[#dce4dc] text-[#536a5f] hover:bg-white" type="button" onClick={toggleFullscreen} aria-label={fullscreen ? "Exit fullscreen" : "Enter fullscreen"} title={fullscreen ? "Exit fullscreen" : "Fullscreen"}>{fullscreen ? <Minimize size={15} /> : <Maximize size={15} />}</button>
              </div>
            </div>

            <main className="flex min-h-0 flex-1 justify-center overflow-auto bg-[#e9ece7] p-4 sm:p-7" aria-label="Note document">
              {note.previewUrl && isImage ? (
                <div className="flex h-fit min-h-full w-full items-start justify-center overflow-auto">
                  <img className="h-auto max-h-none max-w-none bg-white shadow-[0_3px_20px_rgba(33,45,37,.15)] transition-transform" src={note.previewUrl} alt={`${note.title}, page ${page}`} style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center", width: `${Math.min(100, 70 * zoom / 100)}%` }} />
                </div>
              ) : note.previewUrl ? (
                <iframe className="h-full min-h-[55vh] w-full max-w-5xl bg-white shadow-[0_3px_20px_rgba(33,45,37,.15)]" src={documentUrl} title={`PDF document: ${note.title}`} />
              ) : (
                <article className="relative h-fit min-h-170 w-full max-w-153 origin-top bg-white px-8 py-9 text-[#293a32] shadow-[0_3px_20px_rgba(33,45,37,.15)] transition-transform sm:px-14 sm:py-12" style={{ transform: `scale(${zoom / 100})` }}>
                  <p className="text-center font-mono text-[9px] font-medium tracking-[.14em] text-[#395f50]">FRESHMAN EXAMS ET · STUDY NOTES</p>
                  <div className="my-3 h-0.5 bg-[#2d6554]" />
                  <p className="text-center font-mono text-[8px] tracking-widest text-[#78867e]">{note.university} UNIVERSITY · {note.type.toUpperCase()}</p>
                  <h3 className="mt-7 text-center font-serif text-[24px] leading-tight text-[#233a31]">{note.title}</h3>
                  <p className="mt-2 text-center text-xs text-[#758178]">{note.course} · {note.code}</p>
                  <div className="my-6 flex justify-between border-y border-[#d8ded8] py-3 font-mono text-[8px] text-[#596960]"><span>{note.pages} pages</span><span>{note.format}</span><span>Page {page}</span></div>
                  <p className="text-sm leading-7 text-[#47564d]">{note.description}</p>
                  {note.chapter && <p className="mt-5 text-sm font-semibold text-[#365e4d]">{note.chapter}</p>}
                  {note.tags?.length > 0 && <p className="mt-3 font-mono text-[9px] text-[#668477]">{note.tags.join("  ")}</p>}
                  <div className="mt-7 space-y-5" aria-hidden="true">{[1, 2, 3, 4].map((line) => <div key={line} className="space-y-2.5"><div className="h-2 w-4/5 bg-[#eef0eb]" /><div className="h-2 w-full bg-[#eef0eb]" /><div className="h-2 w-3/5 bg-[#eef0eb]" /></div>)}</div>
                  <p className="absolute bottom-6 left-8 right-8 border-t border-[#dce1db] pt-2 text-right font-mono text-[8px] text-[#859188] sm:left-14 sm:right-14">Shared by {note.uploader} · Sample preview</p>
                </article>
              )}
            </main>

            <div className="flex min-h-10 items-center justify-between gap-2 bg-[#f8faf6] px-3 font-mono text-[8px] text-[#738078] sm:px-5">
              <span className="inline-flex items-center gap-1.5 text-[#4f7d68]"><Check size={13} />Student-shared material</span>
              <div className="flex items-center gap-2 sm:hidden">
                <button className="inline-flex items-center gap-1 px-1.5 py-1 text-[9px] text-[#536a5f]" type="button" onClick={toggleLike} aria-pressed={liked}><ThumbsUp size={13} />Useful {usefulCount}</button>
                <button className="grid h-7 w-7 place-items-center text-[#536a5f]" type="button" onClick={toggleBookmark} aria-pressed={bookmarked} aria-label={bookmarked ? "Remove from My Notes" : "Save to My Notes"}><Bookmark size={14} fill={bookmarked ? "currentColor" : "none"} /></button>
                <button className="grid h-7 w-7 place-items-center text-[#536a5f]" type="button" onClick={() => saveDownload(note, page)} aria-label={isImage && note.file ? "Download image" : "Download PDF"}><ArrowDownToLine size={14} /></button>
              </div>
              <span>{note.format} · Page {page} of {totalPages}</span>
            </div>
          </div>

          <aside className="flex max-h-[43svh] min-h-57.5 flex-col border-t border-[#d5ddd5] bg-[#f8f9f4] lg:max-h-none lg:border-l lg:border-t-0">
            <header className="flex items-center justify-between border-b border-[#dfe5dc] px-4 py-3.5 sm:px-5">
              <div>
                <h3 className="inline-flex items-center gap-2 text-xs font-semibold text-[#2f493d]"><MessageCircle size={15} />Discussion</h3>
                <p className="mt-1 text-[9px] text-[#839087]">Questions and study tips from students</p>
              </div>
              <label className="sr-only" htmlFor="comment-page-filter">Filter discussion by page</label>
              <select id="comment-page-filter" className="max-w-28 border border-[#dce3dc] bg-white px-2 py-1.5 text-[9px] text-[#52685e] outline-none focus:border-[#6d9b85]" value={commentPage} onChange={(event) => setCommentPage(event.target.value)}>
                <option value="all">All pages</option>
                {Array.from({ length: totalPages }, (_, index) => <option key={index + 1} value={index + 1}>Page {index + 1}</option>)}
              </select>
            </header>

            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-3.5 sm:px-5" aria-live="polite">
              {visibleComments.length ? visibleComments.map((comment) => (
                <article key={comment.id} className="border-b border-[#e6eae3] pb-3 last:border-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-2 text-[10px] font-semibold text-[#425a4d]"><span className="grid h-6 w-6 place-items-center bg-[#e7eee5] font-serif text-[10px] text-[#3b6c59]">{comment.author.charAt(0).toUpperCase()}</span>{comment.author}</span>
                    <button className="shrink-0 font-mono text-[8px] text-[#39715d] underline decoration-[#a9c3b0] underline-offset-2 hover:text-[#234b3e]" type="button" onClick={() => { setPage(comment.page); setCommentPage(String(comment.page)); }}>Page {comment.page}</button>
                  </div>
                  <p className="ml-8 mt-1.5 whitespace-pre-wrap wrap-break-word text-[11px] leading-relaxed text-[#596960]">{comment.body}</p>
                </article>
              )) : (
                <div className="flex h-full min-h-25 flex-col items-center justify-center px-3 text-center">
                  <span className="grid h-9 w-9 place-items-center bg-[#edf3eb] text-[#668477]"><MessageCircle size={17} /></span>
                  <p className="mt-2 text-[11px] font-semibold text-[#496052]">Start the discussion</p>
                  <p className="mt-1 max-w-52 text-[9px] leading-relaxed text-[#87938b]">Ask a question about page {page}, or share a helpful explanation.</p>
                </div>
              )}
            </div>

            <form className="border-t border-[#dfe5dc] bg-white p-3.5 sm:p-4" onSubmit={postComment}>
              <div className="mb-2 flex items-center justify-between gap-2">
                <label className="text-[10px] font-semibold text-[#4b6154]" htmlFor="note-comment">Add a comment</label>
                <span className="font-mono text-[8px] text-[#839087]">on page {page}</span>
              </div>
              <textarea ref={commentRef} id="note-comment" className="min-h-16 w-full resize-y border border-[#dce3dc] bg-[#fbfcf8] px-2.5 py-2 text-[11px] leading-relaxed text-[#344b3f] outline-none placeholder:text-[#9ba59b] focus:border-[#6d9b85] focus:ring-2 focus:ring-[#3b7a62]/10" value={commentText} onChange={(event) => { setCommentText(event.target.value); setCommentError(""); }} placeholder="Ask a question or share a study tip..." maxLength={500} />
              {commentError && <p className="mt-1 text-[9px] text-[#a74e3b]" role="alert">{commentError}</p>}
              <button className="mt-2 inline-flex min-h-8 w-full items-center justify-center gap-2 bg-[#225d4f] px-3 py-2 text-[10px] font-semibold text-[#f6f5e9] transition hover:bg-[#194e43] disabled:cursor-not-allowed disabled:opacity-50" type="submit" disabled={!commentText.trim()}><Send size={13} />Post comment</button>
              <p className="mt-2 text-[8px] leading-relaxed text-[#929c93]">Keep feedback kind and focused on the material.</p>
            </form>
          </aside>
        </div>
      </section>
    </div>
  );
}