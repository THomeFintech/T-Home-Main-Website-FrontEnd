import { useState, useRef, useEffect, useCallback } from "react";

// ── API base ─────────────────────────────────────────────────────────────────
const API = import.meta.env.VITE_API_URL;

// ── Glass style constants (matches TrackApplication) ─────────────────────────
const GLASS = {
  card: {
    background: "linear-gradient(145deg, rgba(16,30,54,0.82) 0%, rgba(10,20,40,0.78) 100%)",
    backdropFilter: "blur(24px) saturate(160%)",
    WebkitBackdropFilter: "blur(24px) saturate(160%)",
    border: "1px solid rgba(80,130,220,0.18)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(120,170,255,0.12), inset 1px 0 0 rgba(120,170,255,0.06)",
  },
  modal: {
    background: "linear-gradient(145deg, rgba(10,18,35,0.94) 0%, rgba(6,14,28,0.96) 100%)",
    backdropFilter: "blur(32px) saturate(180%)",
    WebkitBackdropFilter: "blur(32px) saturate(180%)",
    border: "1px solid rgba(80,130,220,0.20)",
    boxShadow: "0 24px 64px rgba(0,0,0,0.7), inset 0 1px 0 rgba(120,170,255,0.12)",
  },
  row: {
    background: "linear-gradient(145deg, rgba(20,35,65,0.60) 0%, rgba(14,24,48,0.55) 100%)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    border: "1px solid rgba(80,130,220,0.14)",
  },
  rowRed: {
    background: "linear-gradient(145deg, rgba(80,20,20,0.55) 0%, rgba(50,10,10,0.50) 100%)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    border: "1px solid rgba(239,68,68,0.32)",
    boxShadow: "0 4px 16px rgba(239,68,68,0.08)",
  },
};

const TABS = ["All Documents", "Action Required", "Pending Review", "Verified"];

const GUIDELINES = [
  "Ensure all four corners of the document are visible.",
  "Text must be clear and readable, avoiding blurry images.",
  "If password protected, please remove the password before uploading.",
  "File size should not exceed 10 MB per document.",
];

// ── Category → icon type ──────────────────────────────────────────────────────
function iconForCategory(category) {
  if (!category) return "doc";
  const c = category.toLowerCase();
  if (c.includes("identity") || c.includes("kyc")) return "id";
  if (c.includes("income") || c.includes("salary")) return "chart";
  if (c.includes("bank"))  return "chart";
  if (c.includes("property")) return "doc";
  return "doc";
}

// ── Status → internal key ────────────────────────────────────────────────────
function normaliseStatus(raw) {
  if (!raw) return "pending-review";
  const s = raw.toLowerCase().replace(/\s+/g, "-");
  if (s === "verified")        return "verified";
  if (s === "action-required") return "action-required";
  if (s === "uploaded")        return "pending-review"; 
  return "pending-review";
}

// ── Format bytes ──────────────────────────────────────────────────────────────
function fmtSize(bytes) {
  if (!bytes) return "—";
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ── Format date ───────────────────────────────────────────────────────────────
function fmtDate(iso) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

// ─────────────────────────────────────────────────────────────────────────────
// Icons
// ─────────────────────────────────────────────────────────────────────────────
function Icon({ type, className = "w-4 h-4" }) {
  const p = { fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 1.8, className };
  switch (type) {
    case "id":           return <svg {...p}><rect x="3" y="5" width="18" height="14" rx="2" strokeWidth={1.5}/><path strokeWidth={1.5} d="M7 10h4M7 14h6"/></svg>;
    case "doc":          return <svg {...p}><path strokeLinecap="round" d="M9 7h6M9 11h6M9 15h4M5 3h14a1 1 0 011 1v16a1 1 0 01-1 1H5a1 1 0 01-1-1V4a1 1 0 011-1z"/></svg>;
    case "chart":        return <svg {...p}><path strokeLinecap="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>;
    case "alert":        return <svg {...p}><path strokeLinecap="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>;
    case "upload":       return <svg {...p}><path strokeLinecap="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>;
    case "check":        return <svg {...p}><path strokeLinecap="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/></svg>;
    case "dots":         return <svg {...p}><circle cx="12" cy="5" r="1" fill="currentColor"/><circle cx="12" cy="12" r="1" fill="currentColor"/><circle cx="12" cy="19" r="1" fill="currentColor"/></svg>;
    case "close":        return <svg {...p}><path strokeLinecap="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>;
    case "shield":       return <svg {...p}><path strokeLinecap="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>;
    case "clock":        return <svg {...p}><circle cx="12" cy="12" r="10"/><path strokeLinecap="round" d="M12 6v6l4 2"/></svg>;
    case "info":         return <svg {...p}><path strokeLinecap="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>;
    case "cloud-upload": return <svg {...p} strokeWidth={1.5}><path strokeLinecap="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg>;
    case "refresh":      return <svg {...p}><path strokeLinecap="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>;
    case "download":     return <svg {...p}><path strokeLinecap="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>;
    default:             return <svg {...p}><rect x="3" y="5" width="18" height="14" rx="2"/></svg>;
  }
}

function Skeleton({ className }) {
  return <div className={`animate-pulse rounded bg-white/5 ${className}`} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// Status Badge
// ─────────────────────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    "verified":        { cls: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40", icon: "check",  label: "Verified"        },
    "pending-review":  { cls: "bg-amber-500/20  text-amber-400  border-amber-500/40",     icon: "clock",  label: "Pending Review"  },
    "action-required": { cls: "bg-red-500/20    text-red-400    border-red-500/40",       icon: "alert",  label: "Action Required" },
    "uploaded":        { cls: "bg-blue-500/20   text-blue-400   border-blue-500/40",      icon: "check",  label: "Uploaded"        },
  };
  const s = map[status] ?? map["pending-review"];
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${s.cls}`}>
      <Icon type={s.icon} className="w-3 h-3" />
      {s.label}
    </span>
  );
}

function DocIconBox({ type, status }) {
  const colorMap = {
    "verified":        "bg-emerald-500/15 text-emerald-400",
    "pending-review":  "bg-amber-500/15   text-amber-400",
    "action-required": "bg-red-500/15     text-red-400",
    "uploaded":        "bg-blue-500/15    text-blue-400",
  };
  return (
    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${colorMap[status] ?? "bg-slate-700 text-slate-400"}`}>
      <Icon type={type} className="w-4 h-4" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Upload Modal
// ─────────────────────────────────────────────────────────────────────────────
function UploadModal({ doc, applicationId, onClose, onUploaded }) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver]   = useState(false);
  const [file,     setFile]       = useState(null);
  const [uploading, setUploading] = useState(false);
  const [done,     setDone]       = useState(false);
  const [error,    setError]      = useState("");

  const ALLOWED  = ["application/pdf", "image/jpeg", "image/png", "image/jpg", "image/svg+xml"];
  const MAX_MB   = 10;

  function validate(f) {
    if (!ALLOWED.includes(f.type)) { setError("Only SVG, PNG, JPG or PDF files are allowed."); return false; }
    if (f.size > MAX_MB * 1024 * 1024) { setError(`File must be under ${MAX_MB} MB.`); return false; }
    setError(""); return true;
  }
  function handleFile(f) { if (validate(f)) setFile(f); }
  function handleDrop(e) { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }

  async function handleSubmit() {
    if (!file || !applicationId) return;
    setUploading(true);
    setError("");

    try {
      const fd = new FormData();
      fd.append("file",          file);
      fd.append("document_name", doc.document_name);
      fd.append("category",      doc.category);
      // Pass document_id to replace existing doc, or omit to create new
      if (doc.id) fd.append("document_id", doc.id);

      const res = await fetch(`${API}/documents/${applicationId}/upload`, {
        method: "POST",
        body:   fd,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.detail ?? `Upload failed (${res.status})`);
      }

      const uploaded = await res.json();
      setDone(true);
      setTimeout(() => { onUploaded(uploaded); onClose(); }, 1400);
    } catch (err) {
      setError(err.message ?? "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl" style={GLASS.modal}>
        {/* Header */}
        <div className="flex items-center justify-between p-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="flex items-center gap-3">
            <DocIconBox type={iconForCategory(doc.category)} status="action-required" />
            <div>
              <p className="text-sm font-semibold text-white">{doc.document_name}</p>
              <p className="text-xs text-slate-400">{doc.category}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-slate-400 hover:text-white">
            <Icon type="close" className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {done ? (
            <div className="flex flex-col items-center py-8 gap-3">
              <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)" }}>
                <Icon type="check" className="w-8 h-8 text-emerald-400" />
              </div>
              <p className="text-white font-semibold text-lg">Upload Successful!</p>
              <p className="text-xs text-slate-400 text-center">Your document has been submitted and is pending verification by our team.</p>
            </div>
          ) : (
            <>
              <div
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className="cursor-pointer rounded-xl p-8 flex flex-col items-center gap-3 transition-all"
                style={dragOver
                  ? { background: "rgba(59,130,246,0.12)", border: "2px dashed rgba(59,130,246,0.6)" }
                  : file
                  ? { background: "rgba(16,185,129,0.06)", border: "2px dashed rgba(16,185,129,0.4)" }
                  : { background: "rgba(255,255,255,0.03)", border: "2px dashed rgba(255,255,255,0.12)" }
                }
              >
                <input ref={inputRef} type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png,.svg"
                  onChange={(e) => { if (e.target.files[0]) handleFile(e.target.files[0]); }} />

                {file ? (
                  <>
                    <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "rgba(16,185,129,0.15)" }}>
                      <Icon type="check" className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-white truncate max-w-xs">{file.name}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{fmtSize(file.size)}</p>
                    </div>
                    <p className="text-xs text-slate-500">Click to change file</p>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.2)" }}>
                      <Icon type="cloud-upload" className="w-6 h-6 text-blue-400" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-white">Click to upload or drag &amp; drop</p>
                      <p className="text-xs text-slate-400 mt-1">SVG, PNG, JPG or PDF (max. {MAX_MB} MB)</p>
                    </div>
                  </>
                )}
              </div>

              {error && (
                <div className="flex items-center gap-2 text-xs text-red-400 rounded-lg px-3 py-2"
                  style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)" }}>
                  <Icon type="alert" className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <div className="flex gap-3 pt-1">
                <button onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl text-slate-300 text-sm font-semibold hover:bg-white/5 transition-colors"
                  style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!file || uploading}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors
                    ${file && !uploading ? "bg-blue-600 hover:bg-blue-700 text-white" : "text-slate-500 cursor-not-allowed"}`}
                  style={!file || uploading ? { background: "rgba(255,255,255,0.05)" } : {}}
                >
                  {uploading ? (
                    <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>Uploading…</>
                  ) : "Upload Document"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Quick Upload Modal  (no pre-selected doc — user types document name)
// ─────────────────────────────────────────────────────────────────────────────
function QuickUploadModal({ applicationId, onClose, onUploaded }) {
  const inputRef = useRef(null);
  const [file,      setFile]      = useState(null);
  const [docName,   setDocName]   = useState("");
  const [dragOver,  setDragOver]  = useState(false);
  const [uploading, setUploading] = useState(false);
  const [done,      setDone]      = useState(false);
  const [error,     setError]     = useState("");

  const ALLOWED = ["application/pdf", "image/jpeg", "image/png", "image/jpg", "image/svg+xml"];
  const MAX_MB  = 10;

  function validate(f) {
    if (!ALLOWED.includes(f.type)) { setError("Only SVG, PNG, JPG or PDF."); return false; }
    if (f.size > MAX_MB * 1024 * 1024) { setError(`Max ${MAX_MB} MB.`); return false; }
    setError(""); return true;
  }
  function handleFile(f) { if (validate(f)) setFile(f); }
  function handleDrop(e) { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }

  async function handleSubmit() {
    if (!file || !docName.trim() || !applicationId) return;
    setUploading(true); setError("");
    try {
      const fd = new FormData();
      fd.append("file",          file);
      fd.append("document_name", docName.trim());
      const res = await fetch(`${API}/documents/${applicationId}/upload`, { method: "POST", body: fd });
      if (!res.ok) { const b = await res.json().catch(() => ({})); throw new Error(b.detail ?? "Upload failed"); }
      const uploaded = await res.json();
      setDone(true);
      setTimeout(() => { onUploaded(uploaded); onClose(); }, 1400);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  const canSubmit = file && docName.trim() && !uploading;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl" style={GLASS.modal}>
        <div className="flex items-center justify-between p-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <p className="text-sm font-semibold text-white">Quick Upload</p>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
            <Icon type="close" className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          {done ? (
            <div className="flex flex-col items-center py-8 gap-3">
              <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)" }}>
                <Icon type="check" className="w-8 h-8 text-emerald-400" />
              </div>
              <p className="text-white font-semibold">Upload Successful!</p>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5 font-medium">Document Name *</label>
                <input
                  type="text" value={docName} onChange={e => setDocName(e.target.value)}
                  placeholder="e.g. Salary Slip – October 2024"
                  className="w-full rounded-xl px-3 py-2.5 text-sm text-white bg-white/5 border border-white/10 focus:outline-none focus:border-blue-500/50 placeholder-slate-600 transition-colors"
                />
              </div>

              <div
                onClick={() => inputRef.current?.click()}
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className="cursor-pointer rounded-xl p-6 flex flex-col items-center gap-3 transition-all"
                style={dragOver
                  ? { background: "rgba(59,130,246,0.12)", border: "2px dashed rgba(59,130,246,0.6)" }
                  : file
                  ? { background: "rgba(16,185,129,0.06)", border: "2px dashed rgba(16,185,129,0.4)" }
                  : { background: "rgba(255,255,255,0.03)", border: "2px dashed rgba(255,255,255,0.12)" }
                }
              >
                <input ref={inputRef} type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png,.svg"
                  onChange={e => { if (e.target.files[0]) handleFile(e.target.files[0]); }} />
                {file
                  ? <><Icon type="check" className="w-6 h-6 text-emerald-400" />
                      <p className="text-sm text-white font-medium truncate max-w-xs">{file.name}</p>
                      <p className="text-xs text-slate-400">{fmtSize(file.size)} · click to change</p></>
                  : <><Icon type="cloud-upload" className="w-8 h-8 text-blue-400" />
                      <p className="text-sm text-white font-semibold">Click or drag &amp; drop</p>
                      <p className="text-xs text-slate-400">SVG, PNG, JPG or PDF (max. 10 MB)</p></>
                }
              </div>

              {error && (
                <div className="flex items-center gap-2 text-xs text-red-400 rounded-lg px-3 py-2"
                  style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)" }}>
                  <Icon type="alert" className="w-4 h-4 flex-shrink-0" />{error}
                </div>
              )}

              <div className="flex gap-3">
                <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-slate-300 text-sm font-semibold hover:bg-white/5 transition-colors"
                  style={{ border: "1px solid rgba(255,255,255,0.1)" }}>Cancel</button>
                <button onClick={handleSubmit} disabled={!canSubmit}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors
                    ${canSubmit ? "bg-blue-600 hover:bg-blue-700 text-white" : "text-slate-500 cursor-not-allowed"}`}
                  style={!canSubmit ? { background: "rgba(255,255,255,0.05)" } : {}}>
                  {uploading
                    ? <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>Uploading…</>
                    : "Upload"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Doc Row
// ─────────────────────────────────────────────────────────────────────────────
function DocRow({ doc, applicationId, onUploadClick, onRefresh }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const status = normaliseStatus(doc.status);
  const isActionRequired = status === "action-required";

  async function handleDownload() {
    setMenuOpen(false);
    if (!doc.id || !applicationId) return;
    try {
      const res = await fetch(`${API}/documents/${applicationId}/${doc.id}/download`);
      if (!res.ok) throw new Error("Download failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = doc.filename ?? doc.document_name;
      a.click(); URL.revokeObjectURL(url);
    } catch {
      /* swallow — could show toast */
    }
  }

  return (
    <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all group relative"
      style={isActionRequired ? GLASS.rowRed : GLASS.row}>
      <DocIconBox type={iconForCategory(doc.category)} status={status} />

      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold truncate ${isActionRequired ? "text-red-300" : "text-white"}`}>
          {doc.document_name}
        </p>
        {doc.uploaded_at
          ? <p className="text-xs text-slate-500 mt-0.5">
              Uploaded {fmtDate(doc.uploaded_at)}
              {doc.file_size ? ` · ${fmtSize(doc.file_size)}` : ""}
            </p>
          : <p className="text-xs text-red-400/80 mt-0.5">Action Required: Document is missing</p>
        }
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        {isActionRequired ? (
          <button onClick={() => onUploadClick(doc)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors">
            <Icon type="upload" className="w-3.5 h-3.5" />Upload
          </button>
        ) : (
          <StatusBadge status={status} />
        )}

        <div className="relative">
          <button onClick={() => setMenuOpen(v => !v)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-colors">
            <Icon type="dots" className="w-4 h-4" />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-8 z-20 w-40 rounded-xl overflow-hidden text-xs" style={GLASS.modal}>
                <button className="w-full text-left px-3 py-2.5 text-slate-300 hover:bg-white/5 transition-colors flex items-center gap-2"
                  onClick={handleDownload}>
                  <Icon type="download" className="w-3.5 h-3.5" />Download
                </button>
                <button className="w-full text-left px-3 py-2.5 text-slate-300 hover:bg-white/5 transition-colors flex items-center gap-2"
                  onClick={() => { setMenuOpen(false); onUploadClick(doc); }}>
                  <Icon type="upload" className="w-3.5 h-3.5" />Replace
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Skeleton loaders
// ─────────────────────────────────────────────────────────────────────────────
function DocListSkeleton() {
  return (
    <div className="space-y-5 p-4">
      {[1, 2].map(g => (
        <div key={g}>
          <Skeleton className="h-3 w-24 mb-3" />
          <div className="space-y-2">
            {[1, 2, 3].map(r => (
              <div key={r} className="flex items-center gap-3 px-4 py-3.5 rounded-xl" style={GLASS.row}>
                <Skeleton className="w-9 h-9 rounded-xl flex-shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3.5 w-3/4" />
                  <Skeleton className="h-2.5 w-1/2" />
                </div>
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function SidebarSkeleton() {
  return (
    <div className="space-y-3 p-5">
      <Skeleton className="h-4 w-32 mb-2" />
      <Skeleton className="h-2 w-full" />
      <Skeleton className="h-2 w-3/4" />
      <Skeleton className="h-16 w-full rounded-xl mt-3" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────────────────────
export default function DocumentsPage() {
  // ── applicationId from localStorage (set by TrackApplication after /submit) ─
  const applicationId = localStorage.getItem("application_id")
    ? Number(localStorage.getItem("application_id"))
    : null;

  // ── State ─────────────────────────────────────────────────────────────────
  const [groups,       setGroups]       = useState([]);   // [{ category, documents[] }]
  const [verStatus,    setVerStatus]    = useState(null); // verification-status response
  const [loading,      setLoading]      = useState(true);
  const [verLoading,   setVerLoading]   = useState(true);
  const [fetchError,   setFetchError]   = useState(null);

  const [activeTab,    setActiveTab]    = useState("All Documents");
  const [uploadTarget, setUploadTarget] = useState(null);  // doc object for UploadModal
  const [showQuick,    setShowQuick]    = useState(false);

  // ── Fetch document list ───────────────────────────────────────────────────
  const fetchDocs = useCallback(async () => {
    if (!applicationId) { setLoading(false); return; }
    setLoading(true); setFetchError(null);
    try {
      const res = await fetch(`${API}/documents/${applicationId}`);
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const data = await res.json();
      setGroups(data.groups ?? []);
    } catch (err) {
      setFetchError(err.message);
    } finally {
      setLoading(false);
    }
  }, [applicationId]);

  // ── Fetch verification status ─────────────────────────────────────────────
  const fetchVerStatus = useCallback(async () => {
    if (!applicationId) { setVerLoading(false); return; }
    setVerLoading(true);
    try {
      const res = await fetch(`${API}/documents/${applicationId}/verification-status`);
      if (!res.ok) throw new Error();
      setVerStatus(await res.json());
    } catch {
      /* non-critical — sidebar will degrade gracefully */
    } finally {
      setVerLoading(false);
    }
  }, [applicationId]);

  useEffect(() => { fetchDocs(); fetchVerStatus(); }, [fetchDocs, fetchVerStatus]);

  // ── After a successful upload: refresh both feeds ────────────────────────
  function handleUploaded() {
    fetchDocs();
    fetchVerStatus();
  }

  // ── Flatten all docs across groups for tab filtering ────────────────────
  const allDocs = groups.flatMap(g => g.documents);
  const actionRequiredCount = allDocs.filter(d => normaliseStatus(d.status) === "action-required").length;

  // ── Tab filtering (applied at group level) ───────────────────────────────
  function filterStatus(status) {
    if (activeTab === "All Documents")   return true;
    if (activeTab === "Action Required") return normaliseStatus(status) === "action-required";
    if (activeTab === "Pending Review")  return normaliseStatus(status) === "pending-review";
    if (activeTab === "Verified")        return normaliseStatus(status) === "verified";
    return true;
  }

  const visibleGroups = groups
    .map(g => ({ ...g, documents: g.documents.filter(d => filterStatus(d.status)) }))
    .filter(g => g.documents.length > 0);

  // ── Verification sidebar values (with graceful fallbacks) ────────────────
  const progress    = verStatus?.overall_progress ?? 0;
  const nextSteps   = verStatus?.next_steps ?? [];
  const hasActions  = (verStatus?.action_required_count ?? actionRequiredCount) > 0;

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen text-slate-100 font-sans"
      style={{
        background:
          "radial-gradient(1200px 680px at 20% -10%, rgba(90,140,255,0.18), transparent 62%)," +
          "radial-gradient(980px 580px at 100% 0%, rgba(36,107,198,0.14), transparent 60%)," +
          "linear-gradient(180deg, #071327 0%, #08162b 100%)",
      }}
    >
      <style>{`
        .tab-active   { background: rgba(30,60,120,0.55); border-color: rgba(99,160,255,0.40); color: #93c5fd; }
        .tab-inactive { background: rgba(16,30,54,0.50); border-color: rgba(80,130,220,0.15); color: #64748b; }
        .tab-inactive:hover { background: rgba(20,40,75,0.60); color: #94a3b8; }
        .progress-bar-fill { background: linear-gradient(90deg,#3b82f6,#6366f1); border-radius:999px; transition: width 0.7s cubic-bezier(.4,0,.2,1); }
      `}</style>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* ── Page Header ────────────────────────────────────────────────── */}
        <div className="flex items-start justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Your Documents</h1>
            <p className="text-sm text-slate-400 mt-1">Securely upload and manage your financial documents</p>
          </div>
          <button
            onClick={() => { fetchDocs(); fetchVerStatus(); }}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-400 hover:text-slate-200 text-xs font-medium transition-colors hover:bg-white/5"
            style={{ border: "1px solid rgba(80,130,220,0.18)" }}
          >
            <Icon type="refresh" className="w-3.5 h-3.5" />Refresh
          </button>
        </div>

        {/* ── No applicationId warning ────────────────────────────────── */}
        {!applicationId && (
          <div className="rounded-xl px-5 py-4 mb-6 flex items-center gap-3"
            style={{ background: "rgba(251,191,36,0.07)", border: "1px solid rgba(251,191,36,0.25)" }}>
            <Icon type="alert" className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <p className="text-sm text-amber-300">
              No active application found. Submit a loan application first to manage documents.
            </p>
          </div>
        )}

        {/* ── Fetch error ─────────────────────────────────────────────── */}
        {fetchError && (
          <div className="rounded-xl px-5 py-4 mb-6 flex items-center gap-3"
            style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.25)" }}>
            <Icon type="alert" className="w-4 h-4 text-red-400 flex-shrink-0" />
            <p className="text-sm text-red-300">{fetchError}</p>
            <button onClick={fetchDocs} className="ml-auto text-xs text-red-400 hover:text-red-300 underline">Retry</button>
          </div>
        )}

        {/* ── Main Grid ───────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* ── LEFT: Document List ──────────────────────────────────── */}
          <div className="xl:col-span-2">
            <div className="rounded-2xl overflow-hidden" style={GLASS.card}>

              {/* Tabs */}
              <div className="flex gap-2 p-4 flex-wrap" style={{ borderBottom: "1px solid rgba(80,130,220,0.15)" }}>
                {TABS.map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all
                      ${activeTab === tab ? "tab-active" : "tab-inactive"}`}>
                    {tab}
                    {tab === "Action Required" && actionRequiredCount > 0 && (
                      <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                        {actionRequiredCount}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Content */}
              {loading ? (
                <DocListSkeleton />
              ) : visibleGroups.length === 0 ? (
                <div className="flex flex-col items-center py-16 gap-3 text-slate-500">
                  <Icon type="doc" className="w-10 h-10 opacity-30" />
                  <p className="text-sm">No documents in this category</p>
                </div>
              ) : (
                <div className="p-4 space-y-5">
                  {visibleGroups.map(({ category, documents }) => (
                    <div key={category}>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">
                        {category}
                      </p>
                      <div className="space-y-2">
                        {documents.map(doc => (
                          <DocRow
                            key={doc.id}
                            doc={doc}
                            applicationId={applicationId}
                            onUploadClick={setUploadTarget}
                            onRefresh={() => { fetchDocs(); fetchVerStatus(); }}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── RIGHT: Sidebar ───────────────────────────────────────── */}
          <div className="flex flex-col gap-5">

            {/* Quick Upload */}
            <div className="rounded-2xl p-5" style={GLASS.card}>
              <h3 className="text-sm font-semibold text-white mb-4">Quick Upload</h3>
              <label
                onClick={e => { e.preventDefault(); setShowQuick(true); }}
                className="flex flex-col items-center gap-3 rounded-xl py-8 cursor-pointer transition-all"
                style={{ background: "rgba(16,30,54,0.50)", border: "2px dashed rgba(80,130,220,0.25)" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(99,160,255,0.55)"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(80,130,220,0.25)"}
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.25)" }}>
                  <Icon type="cloud-upload" className="w-6 h-6 text-blue-400" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-white">Click to upload or drag &amp; drop</p>
                  <p className="text-xs text-slate-400 mt-1">SVG, PNG, JPG or PDF (max. 10 MB)</p>
                </div>
              </label>
            </div>

            {/* Verification Status */}
            <div className="rounded-2xl p-5" style={GLASS.card}>
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.25)" }}>
                  <Icon type="shield" className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Verification Status</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Overall document verification progress.</p>
                </div>
              </div>

              {verLoading ? (
                <SidebarSkeleton />
              ) : (
                <>
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs text-slate-400 font-medium">Progress</span>
                      <span className="text-xs font-bold text-blue-400">{progress}%</span>
                    </div>
                    <div className="h-1.5 rounded-full w-full" style={{ background: "rgba(80,130,220,0.15)" }}>
                      <div className="h-1.5 progress-bar-fill" style={{ width: `${progress}%` }} />
                    </div>
                  </div>

                  {/* Counts row */}
                  {verStatus && (
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {[
                        { label: "Verified",  value: verStatus.verified_count,        color: "text-emerald-400" },
                        { label: "Pending",   value: verStatus.pending_count,          color: "text-amber-400"  },
                        { label: "Required",  value: verStatus.action_required_count,  color: "text-red-400"    },
                      ].map(({ label, value, color }) => (
                        <div key={label} className="rounded-xl p-2.5 text-center"
                          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                          <p className={`text-lg font-bold ${color}`}>{value}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">{label}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Next steps */}
                  {nextSteps.length > 0 && (
                    <div className="rounded-xl p-3"
                      style={hasActions
                        ? { background: "rgba(239,68,68,0.06)",   border: "1px solid rgba(239,68,68,0.2)"   }
                        : { background: "rgba(16,185,129,0.06)",  border: "1px solid rgba(16,185,129,0.2)"  }
                      }>
                      <div className="flex items-center gap-2 mb-1.5">
                        <Icon type={hasActions ? "clock" : "check"} className={`w-3.5 h-3.5 ${hasActions ? "text-slate-400" : "text-emerald-400"}`} />
                        <p className="text-xs font-semibold text-slate-300">Next Steps</p>
                      </div>
                      <ul className="space-y-1">
                        {nextSteps.map((step, i) => (
                          <li key={i} className="text-xs text-slate-400 leading-relaxed">{step}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Upload Guidelines */}
            <div className="rounded-2xl p-5" style={GLASS.card}>
              <div className="flex items-center gap-2 mb-4">
                <Icon type="info" className="w-4 h-4 text-slate-400" />
                <h3 className="text-sm font-semibold text-white">Upload Guidelines</h3>
              </div>
              <ul className="space-y-2.5">
                {GUIDELINES.map((g, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.3)" }}>
                      <Icon type="check" className="w-2.5 h-2.5 text-blue-400" />
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{g}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* ── Upload Modal (targeted doc) ──────────────────────────────────── */}
      {uploadTarget && (
        <UploadModal
          doc={uploadTarget}
          applicationId={applicationId}
          onClose={() => setUploadTarget(null)}
          onUploaded={() => { setUploadTarget(null); handleUploaded(); }}
        />
      )}

      {/* ── Quick Upload Modal ───────────────────────────────────────────── */}
      {showQuick && (
        <QuickUploadModal
          applicationId={applicationId}
          onClose={() => setShowQuick(false)}
          onUploaded={() => { setShowQuick(false); handleUploaded(); }}
        />
      )}
    </div>
  );
}
