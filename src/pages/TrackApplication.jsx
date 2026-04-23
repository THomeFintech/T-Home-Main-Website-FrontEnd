import { useState, useEffect, useRef } from "react";

// ── CONFIG ────────────────────────────────────────────────────────────────────
const BASE_URL = import.meta.env.VITE_API_URL;

// ── API HOOKS ─────────────────────────────────────────────────────────────────


function useApplicationData(applicationId) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (!applicationId) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(`${BASE_URL}/applications/${applicationId}/full`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => {
        if (cancelled) return;
        setData(json);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [applicationId]);

  return { data, loading, error, refetch: () => setData(null) };
}

// ── PROGRESS STEP MAPPING ─────────────────────────────────────────────────────
const STEPS = ["Submitted", "Under Review", "Approved", "Disbursed"];

function stepIndex(steps = []) {
  const active = [...steps].reverse().find(
    (s) => s.status === "done" || s.status === "active"
  );
  if (!active) return 0;
  const idx = STEPS.indexOf(active.step);
  return idx >= 0 ? idx : 0;
}

function mapStepStatus(backendStatus) {
  if (backendStatus === "done")   return "completed";
  if (backendStatus === "active") return "in-progress";
  return "pending";
}

// ── SUB-COMPONENTS ────────────────────────────────────────────────────────────

function ProgressBar({ step }) {
  return (
    <div className="relative flex items-center justify-between mt-2">
      <div className="absolute top-4 left-0 right-0 h-0.5 bg-slate-600" />
      <div
        className="absolute top-4 left-0 h-0.5 bg-blue-500 transition-all duration-700"
        style={{ width: `${(step / (STEPS.length - 1)) * 100}%` }}
      />
      {STEPS.map((s, i) => (
        <div key={s} className="relative flex flex-col items-center z-10">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
              i < step
                ? "bg-blue-600 border-blue-600"
                : i === step
                ? "bg-slate-800 border-blue-400 ring-4 ring-blue-500/20"
                : "bg-slate-700 border-slate-600"
            }`}
          >
            {i < step ? (
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : i === step ? (
              <div className="w-3 h-3 rounded-full bg-blue-400 animate-pulse" />
            ) : (
              <div className="w-2.5 h-2.5 rounded-full bg-slate-500" />
            )}
          </div>
          <span className={`mt-2 text-xs font-medium whitespace-nowrap ${i <= step ? "text-blue-300" : "text-slate-500"}`}>
            {s}
          </span>
        </div>
      ))}
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    Verified: { bg: "bg-emerald-500/20", text: "text-emerald-400", border: "border-emerald-500/40" },
    Pending:  { bg: "bg-amber-500/20",   text: "text-amber-400",   border: "border-amber-500/40"  },
    Uploaded: { bg: "bg-blue-500/20",    text: "text-blue-400",    border: "border-blue-500/40"   },
    Rejected: { bg: "bg-red-500/20",     text: "text-red-400",     border: "border-red-500/40"    },
  };
  const s = map[status] ?? map.Pending;
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${s.bg} ${s.text} ${s.border}`}>
      {status}
    </span>
  );
}

function DocIcon({ type }) {
  const cls = "w-4 h-4 text-slate-400";
  if (type === "id" || /kyc/i.test(type))
    return (
      <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <rect x="3" y="5" width="18" height="14" rx="2" strokeWidth={1.5} />
        <path strokeWidth={1.5} d="M7 10h4M7 14h6" />
      </svg>
    );
  if (type === "income" || /income/i.test(type))
    return (
      <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeWidth={1.5} strokeLinecap="round" d="M9 7h6M9 11h6M9 15h4M5 3h14a1 1 0 011 1v16a1 1 0 01-1 1H5a1 1 0 01-1-1V4a1 1 0 011-1z" />
      </svg>
    );
  return (
    <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeWidth={1.5} strokeLinecap="round" d="M3 9l9-7 9 7v11a1 1 0 01-1 1H4a1 1 0 01-1-1z" />
      <path strokeWidth={1.5} d="M9 22V12h6v10" />
    </svg>
  );
}

function Skeleton({ className }) {
  return <div className={`animate-pulse rounded bg-slate-700/60 ${className}`} />;
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button onClick={copy} className="p-1 rounded hover:bg-slate-700 transition-colors">
      {copied ? (
        <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <rect x="9" y="9" width="13" height="13" rx="2" />
          <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
        </svg>
      )}
    </button>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function formatCurrency(amount) {
  if (!amount) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR", maximumFractionDigits: 0,
  }).format(amount);
}

// ── UPLOAD MODAL ──────────────────────────────────────────────────────────────

function UploadModal({ doc, applicationId, onClose, onUploaded }) {
  const inputRef  = useRef(null);
  const [dragOver, setDragOver]   = useState(false);
  const [file, setFile]           = useState(null);
  const [uploading, setUploading] = useState(false);
  const [done, setDone]           = useState(false);
  const [error, setError]         = useState("");

  const ALLOWED = ["application/pdf", "image/jpeg", "image/png", "image/jpg"];
  const MAX_MB  = 10;

  function validate(f) {
    if (!ALLOWED.includes(f.type)) { setError("Only PDF, JPG, or PNG files are allowed."); return false; }
    if (f.size > MAX_MB * 1024 * 1024) { setError(`File must be under ${MAX_MB}MB.`); return false; }
    setError("");
    return true;
  }

  function handleFile(f) { if (validate(f)) setFile(f); }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }

  async function handleSubmit() {
    if (!file) return;
    setUploading(true);
    setError("");

    try {
      const form = new FormData();
      form.append("file", file);
      form.append("application_id", applicationId);
      form.append("document_name", doc.name);

      const res = await fetch(`${BASE_URL}/applications/${applicationId}/documents/upload`, {
        method: "POST",
        body: form,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail ?? `Upload failed (${res.status})`);
      }

      setDone(true);
      setTimeout(() => { onUploaded(doc.name); onClose(); }, 1200);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  function formatSize(bytes) {
    return bytes < 1024 * 1024
      ? `${(bytes / 1024).toFixed(1)} KB`
      : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between p-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center">
              <DocIcon type={doc.name} />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{doc.name}</p>
              <p className="text-xs text-slate-400">{doc.status}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-700 transition-colors text-slate-400 hover:text-white">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-5 space-y-4">
          {done ? (
            <div className="flex flex-col items-center py-6 gap-3">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                <svg className="w-7 h-7 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-white font-semibold">Upload Successful!</p>
              <p className="text-xs text-slate-400 text-center">Your document has been submitted and is pending verification.</p>
            </div>
          ) : (
            <>
              <div
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className={`cursor-pointer border-2 border-dashed rounded-xl p-6 flex flex-col items-center gap-3 transition-all
                  ${dragOver ? "border-blue-400 bg-blue-500/10" : file ? "border-emerald-500/50 bg-emerald-500/5" : "border-slate-600 hover:border-slate-500 hover:bg-slate-800/50"}`}
              >
                <input ref={inputRef} type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => { if (e.target.files[0]) handleFile(e.target.files[0]); }} />
                {file ? (
                  <>
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-white truncate max-w-xs">{file.name}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{formatSize(file.size)}</p>
                    </div>
                    <p className="text-xs text-slate-500">Click to change file</p>
                  </>
                ) : (
                  <>
                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
                      <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-white">Drop your file here</p>
                      <p className="text-xs text-slate-400 mt-0.5">or click to browse</p>
                    </div>
                    <p className="text-xs text-slate-500">PDF, JPG, PNG — max {MAX_MB}MB</p>
                  </>
                )}
              </div>

              {error && (
                <div className="flex items-center gap-2 text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </div>
              )}

              <div className="flex gap-3 pt-1">
                <button onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl border border-slate-600 text-slate-300 text-sm font-semibold hover:bg-slate-700 transition-colors">
                  Cancel
                </button>
                <button onClick={handleSubmit} disabled={!file || uploading}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors
                    ${file && !uploading ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-slate-700 text-slate-500 cursor-not-allowed"}`}>
                  {uploading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Uploading...
                    </>
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

// ── DOCUMENT STATUS ───────────────────────────────────────────────────────────

function DocumentStatus({ documents, loading, applicationId, onDocumentUploaded }) {
  const [localDocs, setLocalDocs]     = useState(documents ?? []);
  const [uploadTarget, setUploadTarget] = useState(null);

  useEffect(() => {
    if (documents) setLocalDocs(documents);
  }, [documents]);

  function handleUploaded(docName) {
    setLocalDocs((prev) =>
      prev.map((d) => d.name === docName ? { ...d, status: "Uploaded" } : d)
    );
    onDocumentUploaded?.();
  }

  const pendingDocs = localDocs.filter(
    (d) => d.status === "Pending" || d.status === "Uploaded"
  );

  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="text-base font-semibold text-white mb-4">Document Status</h3>

      {loading || !localDocs.length ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex gap-3">
                <Skeleton className="w-8 h-8 rounded-lg flex-shrink-0" />
                <div className="space-y-1.5">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-2.5 w-16" />
                </div>
              </div>
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="space-y-3 mb-4">
            {localDocs.map((doc, i) => (
              <div key={i} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center flex-shrink-0">
                    <DocIcon type={doc.name} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">{doc.name}</p>
                    <p className="text-xs text-slate-500">{doc.status}</p>
                  </div>
                </div>
                <StatusBadge status={doc.status} />
              </div>
            ))}
          </div>

          {pendingDocs.length > 0 ? (
            <button
              onClick={() => setUploadTarget(pendingDocs[0])}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-blue-500/40 text-blue-400 text-xs font-semibold hover:bg-blue-500/10 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Upload Missing Documents
            </button>
          ) : (
            <div className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              All Documents Submitted
            </div>
          )}
        </>
      )}

      {uploadTarget && (
        <UploadModal
          doc={uploadTarget}
          applicationId={applicationId}
          onClose={() => setUploadTarget(null)}
          onUploaded={handleUploaded}
        />
      )}
    </div>
  );
}

// ── ERROR BANNER ──────────────────────────────────────────────────────────────

function ErrorBanner({ message, onRetry }) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm mb-6">
      <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span className="flex-1">{message}</span>
      {onRetry && (
        <button onClick={onRetry} className="text-xs font-semibold underline underline-offset-2 hover:text-red-300">
          Retry
        </button>
      )}
    </div>
  );
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────
export default function TrackApplication({ applicationId: propId }) {
  // ✅ fallback to localStorage if no prop passed
  const applicationId = propId || Number(localStorage.getItem("application_id"));
  const { data, loading, error } = useApplicationData(applicationId);

  const details   = data?.details   ?? null;
  const status    = data?.status    ?? null;
  const progress  = data?.progress  ?? [];
  const documents = data?.documents ?? [];
  const updates   = data?.updates   ?? [];
  const advisor   = data?.advisor   ?? null;

  const progressStep = stepIndex(progress);

  const isSmooth = status?.status
    ? !["Rejected", "Approved", "Disbursed"].includes(status.status)
    : false;

  return (
    <div
      className="min-h-screen text-slate-100 font-sans"
      style={{
        background:
          "radial-gradient(1200px 680px at 20% -10%, rgba(90,140,255,0.18), transparent 62%), radial-gradient(980px 580px at 100% 0%, rgba(36,107,198,0.14), transparent 60%), linear-gradient(180deg, #071327 0%, #08162b 100%)",
      }}
    >
      <style>{`
        .glass-card {
          background: linear-gradient(145deg, rgba(16,30,54,0.82) 0%, rgba(10,20,40,0.78) 100%);
          backdrop-filter: blur(24px) saturate(160%);
          -webkit-backdrop-filter: blur(24px) saturate(160%);
          border: 1px solid rgba(80,130,220,0.18);
          box-shadow: 0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(120,170,255,0.12), inset 1px 0 0 rgba(120,170,255,0.06);
        }
        .glass-card-blue {
          background: linear-gradient(145deg, rgba(30,58,110,0.55) 0%, rgba(15,35,75,0.50) 100%);
          backdrop-filter: blur(24px) saturate(160%);
          -webkit-backdrop-filter: blur(24px) saturate(160%);
          border: 1px solid rgba(99,160,255,0.30);
          box-shadow: 0 8px 32px rgba(30,80,200,0.15), inset 0 1px 0 rgba(150,200,255,0.15);
        }
        .glass-row {
          background: linear-gradient(145deg, rgba(20,35,65,0.60) 0%, rgba(14,24,48,0.55) 100%);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(80,130,220,0.14);
        }
        .glass-id-bar {
          background: linear-gradient(145deg, rgba(16,30,54,0.82) 0%, rgba(10,20,40,0.78) 100%);
          backdrop-filter: blur(20px) saturate(150%);
          -webkit-backdrop-filter: blur(20px) saturate(150%);
          border: 1px solid rgba(80,130,220,0.18);
          box-shadow: 0 4px 16px rgba(0,0,0,0.35), inset 0 1px 0 rgba(120,170,255,0.10);
        }
      `}</style>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Track Your Application</h1>
            <p className="text-sm text-slate-400 mt-1">Stay updated on your loan progress in real-time</p>
          </div>
          <div className="glass-id-bar flex items-center gap-2 rounded-lg px-4 py-2">
            <span className="text-xs text-slate-400 font-medium">Application ID</span>
            {loading ? (
              <Skeleton className="h-4 w-24" />
            ) : (
              <>
                <span className="text-sm font-bold text-blue-400">#{details?.loan_id ?? applicationId}</span>
                <CopyButton text={String(details?.loan_id ?? applicationId)} />
              </>
            )}
          </div>
        </div>

        {/* Error state */}
        {error && (
          <ErrorBanner
            message={`Failed to load application data: ${error}`}
            onRetry={() => window.location.reload()}
          />
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* ── LEFT COLUMN ── */}
          <div className="xl:col-span-2 flex flex-col gap-6">

            {/* Status + Progress Bar */}
            <div className="glass-card rounded-2xl p-6">
              {loading ? (
                <div className="space-y-4">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-10 w-full mt-4" />
                </div>
              ) : (
                <>
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">
                    <div>
                      <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mb-1">Current Status</p>
                      <div className="flex items-center gap-3">
                        <h2 className="text-xl font-bold text-white">{status?.status ?? "Under Review"}</h2>
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                          Active
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mb-1">Estimated Completion</p>
                      <p className="text-lg font-bold text-white">{status?.estimated_completion ?? "—"}</p>
                    </div>
                  </div>
                  <ProgressBar step={progressStep} />
                </>
              )}
            </div>

            {/* Detailed Progress */}
            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-base font-semibold text-white mb-5">Detailed Progress</h3>
              {loading ? (
                <div className="space-y-5">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex gap-4">
                      <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-3 w-2/3" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="relative">
                  <div className="absolute left-4 top-4 bottom-4 w-px bg-slate-700" />
                  <div className="space-y-6">
                    {progress.map((step, i) => {
                      const uiStatus = mapStepStatus(step.status);
                      return (
                        <div key={i} className="flex gap-4 relative">
                          <div
                            className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center border-2 z-10 ${
                              uiStatus === "completed" ? "bg-blue-600 border-blue-600"
                              : uiStatus === "in-progress" ? "bg-slate-800 border-blue-400"
                              : "bg-slate-800 border-slate-600"
                            }`}
                          >
                            {uiStatus === "completed" ? (
                              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            ) : uiStatus === "in-progress" ? (
                              <div className="w-3 h-3 rounded-full bg-blue-400 animate-pulse" />
                            ) : (
                              <div className="w-2.5 h-2.5 rounded-full bg-slate-500" />
                            )}
                          </div>
                          <div className="flex-1 pb-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span
                                className={`font-semibold text-sm ${
                                  uiStatus === "completed" ? "text-white"
                                  : uiStatus === "in-progress" ? "text-blue-300"
                                  : "text-slate-400"
                                }`}
                              >
                                {step.step}
                              </span>
                              {uiStatus === "in-progress" && (
                                <span className="text-xs font-medium text-amber-400 bg-amber-400/10 border border-amber-400/30 px-2 py-0.5 rounded-full">
                                  In Progress
                                </span>
                              )}
                              {step.time && (
                                <span className="text-xs text-slate-500 ml-auto">{formatDate(step.time)}</span>
                              )}
                            </div>
                            <p className={`text-xs mt-1 leading-relaxed ${uiStatus === "pending" ? "text-slate-600" : "text-slate-400"}`}>
                              {step.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Recent Updates */}
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-semibold text-white">Recent Updates</h3>
                <button className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors">View All</button>
              </div>
              {loading ? (
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="flex gap-3">
                      <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-3 w-3/4" />
                        <Skeleton className="h-3 w-1/3" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : updates.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-4">No updates yet.</p>
              ) : (
                <div className="space-y-4">
                  {updates.map((u, i) => (
                    <div key={i} className="glass-row flex items-start gap-3 p-3 rounded-xl">
                      <div className="w-8 h-8 rounded-full bg-blue-500/15 border border-blue-500/30 flex-shrink-0 flex items-center justify-center">
                        <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                      </div>
                      <div>
                        {/* FIX 1: was <div> inside what React resolved as a <p> — changed to <p> */}
                        <p className="text-sm text-slate-200 font-medium leading-snug">
                          {u.message}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">{formatDate(u.time)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="flex flex-col gap-6">

            {/* Smooth Progress Banner */}
            {!loading && isSmooth && (
              <div className="glass-card-blue rounded-2xl p-4 flex gap-3">
                <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full bg-blue-500/20">
                  <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-blue-300">Progressing Smoothly</p>
                  <p className="text-xs text-slate-400 mt-0.5">Your application is on track. No action needed from your side right now.</p>
                </div>
              </div>
            )}

            {/* Application Details */}
            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-base font-semibold text-white mb-4">Application Details</h3>
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex justify-between">
                      <Skeleton className="h-3 w-1/3" />
                      <Skeleton className="h-3 w-1/3" />
                    </div>
                  ))}
                </div>
              ) : (
                <dl className="space-y-3">
                  {[
                    ["Loan Type",       details?.loan_type],
                    ["Loan Amount",     formatCurrency(details?.loan_amount)],
                    ["Applicant Name",  details?.applicant_name],
                    ["Submission Date", formatDate(details?.submission_date)],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between items-center py-1.5 border-b border-slate-700/50 last:border-0">
                      <dt className="text-xs text-slate-400">{label}</dt>
                      <dd className="text-xs font-semibold text-white text-right">{value ?? "—"}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>

            {/* Document Status */}
            <DocumentStatus
              documents={documents}
              loading={loading}
              applicationId={applicationId}
            />

            {/* Advisor / Need Help */}
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                  {loading ? "?" : (advisor?.name?.charAt(0) ?? "?")}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Need help?</p>
                  {/* FIX 2: was <p> wrapping a <Skeleton> (which renders a <div>) — changed to <span> */}
                  <span className="text-xs text-slate-400">
                    {loading ? (
                      <Skeleton className="h-3 w-28 inline-block" />
                    ) : advisor?.name && advisor.name !== "Not Assigned" ? (
                      `Talk to your advisor, ${advisor.name}`
                    ) : (
                      "Contact support"
                    )}
                  </span>
                  {!loading && advisor?.role && (
                    <p className="text-xs text-blue-400 mt-0.5">{advisor.role}</p>
                  )}
                </div>
              </div>
              <div className="flex gap-3">
                <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-600 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Chat Now
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Call Support
                </button>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
