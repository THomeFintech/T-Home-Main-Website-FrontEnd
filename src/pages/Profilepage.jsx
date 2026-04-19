import { useState, useRef, useEffect } from "react";


// ── Glass constants ───────────────────────────────────────────────────────────
const G = {
  card: {
    background: "linear-gradient(145deg, rgba(16,30,54,0.82) 0%, rgba(10,20,40,0.78) 100%)",
    backdropFilter: "blur(24px) saturate(160%)",
    WebkitBackdropFilter: "blur(24px) saturate(160%)",
    border: "1px solid rgba(80,130,220,0.18)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(120,170,255,0.12)",
  },
  input: {
    background: "linear-gradient(145deg, rgba(10,18,40,0.80) 0%, rgba(8,14,32,0.75) 100%)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    border: "1px solid rgba(80,130,220,0.20)",
    boxShadow: "inset 0 2px 4px rgba(0,0,0,0.3)",
  },
};

// ── Toggle ────────────────────────────────────────────────────────────────────
function Toggle({ checked, onChange }) {
  return (
    <button
      role="switch" aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="relative flex-shrink-0 w-11 h-6 rounded-full transition-all duration-300 focus:outline-none"
      style={{
        background: checked ? "linear-gradient(90deg,#3b82f6,#6366f1)" : "rgba(30,50,90,0.60)",
        border: checked ? "1px solid rgba(99,160,255,0.4)" : "1px solid rgba(80,130,220,0.20)",
        boxShadow: checked ? "0 0 12px rgba(99,130,255,0.35)" : "none",
      }}
    >
      <span
        className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300"
        style={{ transform: checked ? "translateX(20px)" : "translateX(0)" }}
      />
    </button>
  );
}

// ── Glass Input ───────────────────────────────────────────────────────────────
function GlassInput({ label, value, onChange, type = "text", icon, readOnly, placeholder, rightEl }) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      {label && <label className="block text-xs text-slate-400 mb-1.5 font-medium">{label}</label>}
      <div
        className="flex items-center gap-2 rounded-xl px-3.5 py-2.5 transition-all"
        style={{
          ...G.input,
          border: focused ? "1px solid rgba(99,160,255,0.50)" : G.input.border,
          boxShadow: focused ? "inset 0 2px 4px rgba(0,0,0,0.3), 0 0 0 3px rgba(59,130,246,0.12)" : G.input.boxShadow,
          opacity: readOnly ? 0.72 : 1,
        }}
      >
        {icon && <span className="text-slate-400 flex-shrink-0">{icon}</span>}
        <input
          type={type} value={value} readOnly={readOnly} placeholder={placeholder}
          onChange={e => onChange?.(e.target.value)}
          onFocus={() => !readOnly && setFocused(true)}
          onBlur={() => setFocused(false)}
          className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 outline-none min-w-0"
          style={{ cursor: readOnly ? "default" : "text" }}
        />
        {rightEl}
      </div>
    </div>
  );
}

// ── Card ──────────────────────────────────────────────────────────────────────
function Card({ children, className = "" }) {
  return <div className={`rounded-2xl p-6 ${className}`} style={G.card}>{children}</div>;
}

// ── Icons ─────────────────────────────────────────────────────────────────────
function Icon({ type, className = "w-4 h-4" }) {
  const p = { fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round", className };
  switch (type) {
    case "camera":   return <svg {...p}><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>;
    case "download": return <svg {...p}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>;
    case "check":    return <svg {...p} strokeWidth={2.5}><path d="M5 13l4 4L19 7"/></svg>;
    case "shield":   return <svg {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
    case "calendar": return <svg {...p}><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>;
    case "id":       return <svg {...p}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 10h4M7 14h6"/></svg>;
    case "mail":     return <svg {...p}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
    case "phone":    return <svg {...p}><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>;
    case "key":      return <svg {...p}><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>;
    case "monitor":  return <svg {...p}><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>;
    case "bell":     return <svg {...p}><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/></svg>;
    case "sms":      return <svg {...p}><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>;
    case "tag":      return <svg {...p}><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><circle cx="7" cy="7" r="1.5" fill="currentColor" stroke="none"/></svg>;
    case "edit":     return <svg {...p}><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
    case "eye":      return <svg {...p}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
    case "eye-off":  return <svg {...p}><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22"/></svg>;
    case "close":    return <svg {...p} strokeWidth={2}><path d="M18 6L6 18M6 6l12 12"/></svg>;
    case "chevron-left":  return <svg {...p}><polyline points="15 18 9 12 15 6"/></svg>;
    case "chevron-right": return <svg {...p}><polyline points="9 18 15 12 9 6"/></svg>;
    default:         return null;
  }
}

// ── Modal ─────────────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl" style={{
        background: "linear-gradient(145deg, rgba(10,18,35,0.96) 0%, rgba(6,14,28,0.98) 100%)",
        backdropFilter: "blur(32px)", WebkitBackdropFilter: "blur(32px)",
        border: "1px solid rgba(80,130,220,0.22)",
        boxShadow: "0 24px 64px rgba(0,0,0,0.7), inset 0 1px 0 rgba(120,170,255,0.10)",
      }}>
        <div className="flex items-center justify-between p-5" style={{ borderBottom: "1px solid rgba(80,130,220,0.15)" }}>
          <h3 className="text-base font-semibold text-white">{title}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
            <Icon type="close" className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

// ── Verified check dot ────────────────────────────────────────────────────────
function VerifiedDot() {
  return (
    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
      style={{ background: "rgba(16,185,129,0.2)", border: "1px solid rgba(16,185,129,0.35)" }}>
      <Icon type="check" className="w-3 h-3 text-emerald-400" />
    </div>
  );
}

// ── DOB Picker ────────────────────────────────────────────────────────────────
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function parseDOB(str) {
  if (!str) return null;
  const iso = str.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (iso) return new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]));
  const human = str.match(/^(\d{1,2})\s+(\w+)\s+(\d{4})$/);
  if (human) {
    const mIdx = MONTHS.findIndex(m => m.toLowerCase().startsWith(human[2].toLowerCase()));
    if (mIdx !== -1) return new Date(Number(human[3]), mIdx, Number(human[1]));
  }
  return null;
}

function formatDOB(date) {
  if (!date) return "";
  return `${date.getDate()} ${MONTHS[date.getMonth()].slice(0,3)} ${date.getFullYear()}`;
}

function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function DOBPicker({ value, onChange }) {
  const parsed = parseDOB(value);
  const today = new Date();

  const [calOpen, setCalOpen] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  const [manualVal, setManualVal] = useState(value);
  const [focused, setFocused] = useState(false);
  const [calPos, setCalPos] = useState({ top: 0, left: 0 });

  const initYear = parsed ? parsed.getFullYear() : today.getFullYear() - 20;
  const initMonth = parsed ? parsed.getMonth() : 0;
  const [viewYear, setViewYear] = useState(initYear);
  const [viewMonth, setViewMonth] = useState(initMonth);
  const [selDate, setSelDate] = useState(parsed);

  const wrapRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    if (!calOpen) return;
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setCalOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [calOpen]);

  // Recompute position on scroll/resize so calendar follows input
  useEffect(() => {
    if (!calOpen) return;
    const update = () => {
      if (!wrapRef.current) return;
      const r = wrapRef.current.getBoundingClientRect();
      setCalPos({ top: r.bottom + 8, left: r.left });
    };
    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [calOpen]);

  function openCal() {
    const p = parseDOB(value);
    if (p) { setViewYear(p.getFullYear()); setViewMonth(p.getMonth()); setSelDate(p); }
    // Compute position immediately
    if (wrapRef.current) {
      const r = wrapRef.current.getBoundingClientRect();
      setCalPos({ top: r.bottom + 8, left: r.left });
    }
    setCalOpen(true);
    setManualMode(false);
  }

  function pickDay(d) {
    const date = new Date(viewYear, viewMonth, d);
    setSelDate(date);
    const fmt = formatDOB(date);
    onChange(fmt);
    setManualVal(fmt);
    setCalOpen(false);
  }

  function handleManualChange(v) { setManualVal(v); onChange(v); }

  function handleManualBlur() {
    setFocused(false);
    const p = parseDOB(manualVal);
    if (p) { onChange(formatDOB(p)); setManualVal(formatDOB(p)); }
  }

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  }

  const firstDow = new Date(viewYear, viewMonth, 1).getDay();
  const totalDays = daysInMonth(viewYear, viewMonth);
  const cells = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= totalDays; d++) cells.push(d);

  const isSelected = (d) => selDate &&
    selDate.getDate() === d &&
    selDate.getMonth() === viewMonth &&
    selDate.getFullYear() === viewYear;

  const isFuture = (d) => new Date(viewYear, viewMonth, d) > today;

  const years = [];
  for (let y = today.getFullYear(); y >= 1924; y--) years.push(y);

  return (
    <div className="relative" ref={wrapRef}>
      <label className="block text-xs text-slate-400 mb-1.5 font-medium">Date of Birth</label>

      {/* Input row */}
      <div
        className="flex items-center gap-2 rounded-xl px-3.5 py-2.5 transition-all"
        style={{
          ...G.input,
          border: focused || calOpen ? "1px solid rgba(99,160,255,0.50)" : G.input.border,
          boxShadow: focused || calOpen
            ? "inset 0 2px 4px rgba(0,0,0,0.3), 0 0 0 3px rgba(59,130,246,0.12)"
            : G.input.boxShadow,
        }}
      >
        <button
          type="button"
          onClick={() => { calOpen ? setCalOpen(false) : openCal(); }}
          className="flex-shrink-0 transition-colors"
          style={{ color: calOpen ? "#60a5fa" : "rgba(148,163,184,1)" }}
          title="Open calendar"
        >
          <Icon type="calendar" className="w-4 h-4" />
        </button>

        <input
          type="text"
          value={manualMode ? manualVal : value}
          placeholder="e.g. 1 Jan 2004"
          onChange={e => { setManualMode(true); handleManualChange(e.target.value); }}
          onFocus={() => { setFocused(true); setManualMode(true); setManualVal(value); }}
          onBlur={handleManualBlur}
          className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 outline-none min-w-0"
        />

        {value && (
          <button
            type="button"
            onClick={() => { onChange(""); setManualVal(""); setSelDate(null); setManualMode(false); }}
            className="flex-shrink-0 text-slate-500 hover:text-slate-300 transition-colors"
          >
            <Icon type="close" className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* ── Calendar — fixed position so it escapes all parent overflow clipping ── */}
      {calOpen && (
        <div
          style={{
            position: "fixed",
            zIndex: 9999,
            top: calPos.top,
            left: calPos.left,
            width: 300,
            background: "linear-gradient(145deg, rgba(10,18,38,0.98) 0%, rgba(6,12,28,0.99) 100%)",
            border: "1px solid rgba(80,130,220,0.28)",
            boxShadow: "0 16px 48px rgba(0,0,0,0.65), inset 0 1px 0 rgba(120,170,255,0.08)",
            borderRadius: 16,
          }}
        >
          {/* Month / Year nav */}
          <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid rgba(80,130,220,0.14)" }}>
            <button onClick={prevMonth} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
              <Icon type="chevron-left" className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2">
              <select
                value={viewMonth}
                onChange={e => setViewMonth(Number(e.target.value))}
                className="text-sm font-semibold text-white outline-none cursor-pointer"
                style={{ background: "rgba(20,35,65,0.95)", borderRadius: 6, border: "1px solid rgba(80,130,220,0.22)", padding: "2px 6px" }}
              >
                {MONTHS.map((m, i) => <option key={m} value={i} style={{ background: "#0d1b38" }}>{m}</option>)}
              </select>
              <select
                value={viewYear}
                onChange={e => setViewYear(Number(e.target.value))}
                className="text-sm font-semibold text-white outline-none cursor-pointer"
                style={{ background: "rgba(20,35,65,0.95)", borderRadius: 6, border: "1px solid rgba(80,130,220,0.22)", padding: "2px 6px" }}
              >
                {years.map(y => <option key={y} value={y} style={{ background: "#0d1b38" }}>{y}</option>)}
              </select>
            </div>
            <button onClick={nextMonth} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
              <Icon type="chevron-right" className="w-4 h-4" />
            </button>
          </div>

          {/* Day-of-week headers */}
          <div className="grid grid-cols-7 px-3 pt-2">
            {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d => (
              <div key={d} className="text-center text-[11px] font-semibold text-slate-500 py-1">{d}</div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 gap-y-0.5 px-3 pb-3">
            {cells.map((d, i) => {
              if (!d) return <div key={`e-${i}`} />;
              const sel = isSelected(d);
              const future = isFuture(d);
              return (
                <button
                  key={d}
                  type="button"
                  disabled={future}
                  onClick={() => pickDay(d)}
                  className="w-8 h-8 mx-auto flex items-center justify-center rounded-full text-xs font-medium transition-all"
                  style={{
                    background: sel ? "linear-gradient(135deg,#3b82f6,#6366f1)" : "transparent",
                    color: sel ? "#fff" : future ? "rgba(100,120,160,0.45)" : "rgba(203,213,225,1)",
                    cursor: future ? "not-allowed" : "pointer",
                    boxShadow: sel ? "0 0 10px rgba(99,130,255,0.35)" : "none",
                  }}
                  onMouseEnter={e => { if (!sel && !future) e.currentTarget.style.background = "rgba(59,130,246,0.15)"; }}
                  onMouseLeave={e => { if (!sel) e.currentTarget.style.background = "transparent"; }}
                >
                  {d}
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="px-3 pb-3 flex justify-between items-center" style={{ borderTop: "1px solid rgba(80,130,220,0.12)", paddingTop: 10 }}>
            <span className="text-[11px] text-slate-500">Type manually or pick a date</span>
            <button
              type="button"
              onClick={() => { setViewMonth(today.getMonth()); setViewYear(today.getFullYear()); }}
              className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 transition-colors"
            >
              Today's month
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const fileInputRef = useRef(null);
  const [avatar, setAvatar] = useState(null);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

 const [form, setForm] = useState({
  firstName: user?.name?.split(" ")[0] || "",
  lastName: user?.name?.split(" ")[1] || "",
  dob: "",
  pan: "",
  address: "",
});
  const [saved, setSaved] = useState(false);

 const [contact, setContact] = useState({
  email: user?.email || "",
  phone: ""
});
useEffect(() => {
  const token = localStorage.getItem("token");

  if (!token) return;

  fetch("http://127.0.0.1:8000/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(data => {
      setForm({
  firstName: data.name?.split(" ")[0] || "",
  lastName: data.name?.split(" ")[1] || "",
  dob: data.dob || "",
  pan: data.pan || "",
  address: data.address || ""
});

setContact({
  email: data.email,
  phone: data.phone || ""
});
    })
    .catch(err => console.log(err));
}, []);
  const [editContact, setEditContact]   = useState(false);
  const [contactDraft, setContactDraft] = useState({ ...contact });
  const [contactSaved, setContactSaved] = useState(false);

  const [prefs, setPrefs] = useState({ emailNotifs: true, smsAlerts: true, marketingEmails: false });
  const [twoFA, setTwoFA] = useState(true);

  const [showPwModal, setShowPwModal] = useState(false);
  const [pw, setPw]         = useState({ current: "", newPw: "", confirm: "" });
  const [showPw, setShowPw] = useState({ current: false, newPw: false, confirm: false });
  const [pwSaved, setPwSaved] = useState(false);

  const [showDevices, setShowDevices] = useState(false);
  const DEVICES = [
    { name: "Chrome on Windows", location: "Hyderabad, IN", time: "Active now",  current: true  },
    { name: "Safari on iPhone",  location: "Hyderabad, IN", time: "2 hours ago", current: false },
    { name: "Firefox on Mac",    location: "Bengaluru, IN", time: "3 days ago",  current: false },
  ];

  function set(field) { return v => setForm(f => ({ ...f, [field]: v })); }

  async function handleSave() {
  try {
    const res = await fetch("http://127.0.0.1:8000/auth/update-profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({
        first_name: form.firstName,
        last_name: form.lastName,
        dob: form.dob,
        pan: form.pan,
        address: form.address
      })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.detail || "Update failed");
      return;
    }

    // ✅ Update localStorage
    localStorage.setItem("user", JSON.stringify({
  name: form.firstName + " " + form.lastName,
  email: contact.email
}));

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);

  } catch (err) {
    console.error(err);
    alert("Server error");
  }
}

  function handlePhotoChange(e) {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setAvatar(ev.target.result);
    reader.readAsDataURL(file);
  }

  function handleDownload() {
    const blob = new Blob([JSON.stringify({ ...form, ...contact }, null, 2)], { type: "application/json" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a"); a.href = url; a.download = "profile-data.json"; a.click();
    URL.revokeObjectURL(url);
  }
async function handleContactSave() {
  try {
    const res = await fetch("http://127.0.0.1:8000/auth/update-contact", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({
        email: contactDraft.email,
        phone: contactDraft.phone
      })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.detail || "Update failed");
      return;
    }

    setContact({ ...contactDraft });
    setEditContact(false);

    // ✅ update localStorage
    localStorage.setItem("user", JSON.stringify({
  name: form.firstName + " " + form.lastName,
  email: contactDraft.email
}));

    setContactSaved(true);
    setTimeout(() => setContactSaved(false), 2000);

  } catch (err) {
    console.error(err);
    alert("Server error");
  }
}

  async function handlePwSave() {
  if (!pw.current || !pw.newPw || pw.newPw !== pw.confirm) {
    alert("Passwords do not match");
    return;
  }

  try {
    const res = await fetch("http://127.0.0.1:8000/auth/change-password", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({
        old_password: pw.current,
        new_password: pw.newPw
      })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.detail || "Password change failed");
      return;
    }

    setPwSaved(true);

    setTimeout(() => {
      setPwSaved(false);
      setShowPwModal(false);
      setPw({ current: "", newPw: "", confirm: "" });
    }, 1500);

  } catch (err) {
    console.error(err);
    alert("Server error");
  }
}

  const pwValid = pw.current && pw.newPw && pw.newPw === pw.confirm;

  return (
    <div
      className="min-h-screen text-slate-100 font-sans py-10 px-4 sm:px-6 lg:px-8"
      style={{ background: "radial-gradient(1200px 680px at 20% -10%, rgba(90,140,255,0.18), transparent 62%), radial-gradient(980px 580px at 100% 0%, rgba(36,107,198,0.14), transparent 60%), linear-gradient(180deg, #071327 0%, #08162b 100%)" }}
    >

      <div className="max-w-6xl mx-auto mb-8">
        <h1 className="text-2xl font-bold text-white tracking-tight">Profile Settings</h1>
        <p className="text-sm text-slate-400 mt-1">Manage your personal information and preferences</p>
      </div>

      <div className="max-w-6xl mx-auto space-y-6">

        {/* ── Banner ─────────────────────────────────────────── */}
        <Card>
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="relative flex-shrink-0 self-start cursor-pointer group" onClick={() => fileInputRef.current?.click()} title="Change photo">
              <div className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center text-2xl font-bold text-white"
                style={{ background: avatar ? "transparent" : "linear-gradient(135deg,#3b82f6,#6366f1)", border: "3px solid rgba(99,160,255,0.35)", boxShadow: "0 0 20px rgba(99,130,255,0.30)" }}>
                {avatar ? <img src={avatar} alt="avatar" className="w-full h-full object-cover" /> : <>{form.firstName.charAt(0)}{form.lastName.charAt(0)}</>}
              </div>
              <div className="absolute inset-0 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: "rgba(0,0,0,0.50)" }}>
                <Icon type="camera" className="w-5 h-5 text-white" />
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-white">{form.firstName} {form.lastName}</h2>
              <p className="text-sm text-slate-400 mt-0.5">{contact.email}</p>
              <span className="inline-flex items-center gap-1 mt-2 text-[11px] font-bold px-2.5 py-1 rounded-full text-emerald-300"
                style={{ background: "rgba(16,185,129,0.18)", border: "1px solid rgba(16,185,129,0.35)" }}>
                <Icon type="check" className="w-3 h-3" /> KYC Verified
              </span>
            </div>

            <div className="flex gap-3 flex-shrink-0">
              <button onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white transition-all"
                style={{ background: "rgba(20,35,70,0.65)", border: "1px solid rgba(80,130,220,0.25)" }}>
                <Icon type="camera" className="w-3.5 h-3.5" /> Change Photo
              </button>
              <button onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white transition-all"
                style={{ background: "rgba(20,35,70,0.65)", border: "1px solid rgba(80,130,220,0.25)" }}>
                <Icon type="download" className="w-3.5 h-3.5" /> Download Data
              </button>
            </div>
          </div>
        </Card>

        {/* ── Middle Row ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* Personal Information */}
          <div className="xl:col-span-2">
            <Card>
              <h3 className="text-base font-semibold text-white mb-5">Personal Information</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <GlassInput label="First Name" value={form.firstName} onChange={set("firstName")} />
                  <GlassInput label="Last Name"  value={form.lastName}  onChange={set("lastName")} />
                </div>

                {/* DOB + PAN row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <DOBPicker value={form.dob} onChange={set("dob")} />
                  <GlassInput label="PAN Number" value={form.pan} onChange={set("pan")} icon={<Icon type="id" className="w-4 h-4" />} />
                </div>

                <GlassInput label="Residential Address" value={form.address} onChange={set("address")} />
                <div className="pt-1">
                  <button onClick={handleSave}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
                    style={{ background: saved ? "linear-gradient(90deg,#10b981,#059669)" : "linear-gradient(90deg,#3b82f6,#6366f1)", boxShadow: "0 4px 16px rgba(59,130,246,0.25)" }}>
                    {saved ? <><Icon type="check" className="w-4 h-4" /> Saved!</> : "Save Changes"}
                  </button>
                </div>
              </div>
            </Card>
          </div>

          {/* Contact Details */}
          <div>
            <Card className="h-full">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-semibold text-white">Contact Details</h3>
                {!editContact && (
                  <button onClick={() => { setContactDraft({ ...contact }); setEditContact(true); }}
                    className="flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors px-2.5 py-1.5 rounded-lg"
                    style={{ background: "rgba(59,130,246,0.10)", border: "1px solid rgba(80,130,220,0.20)" }}>
                    <Icon type="edit" className="w-3.5 h-3.5" /> Edit
                  </button>
                )}
              </div>

              {editContact ? (
                <div className="space-y-4">
                  <GlassInput label="Email Address" value={contactDraft.email} type="email"
                    icon={<Icon type="mail" className="w-4 h-4" />}
                    onChange={v => setContactDraft(d => ({ ...d, email: v }))} />
                  <GlassInput label="Phone Number" value={contactDraft.phone}
                    icon={<Icon type="phone" className="w-4 h-4" />}
                    onChange={v => setContactDraft(d => ({ ...d, phone: v }))} />
                  <div className="flex gap-2 pt-1">
                    <button onClick={handleContactSave}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold text-white"
                      style={{ background: "linear-gradient(90deg,#3b82f6,#6366f1)", boxShadow: "0 4px 12px rgba(59,130,246,0.25)" }}>
                      {contactSaved ? <><Icon type="check" className="w-4 h-4" />Saved!</> : "Save"}
                    </button>
                    <button onClick={() => setEditContact(false)}
                      className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-white transition-colors"
                      style={{ background: "rgba(20,35,70,0.5)", border: "1px solid rgba(80,130,220,0.20)" }}>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5 font-medium">Email Address</label>
                    <div className="flex items-center gap-2 rounded-xl px-3.5 py-2.5" style={G.input}>
                      <Icon type="mail" className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      <span className="flex-1 text-sm text-white truncate">{contact.email}</span>
                      <VerifiedDot />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5 font-medium">Phone Number</label>
                    <div className="flex items-center gap-2 rounded-xl px-3.5 py-2.5" style={G.input}>
                      <Icon type="phone" className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      <span className="flex-1 text-sm text-white">{contact.phone}</span>
                      <VerifiedDot />
                    </div>
                  </div>
                  <button onClick={() => { setContactDraft({ ...contact }); setEditContact(true); }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:text-white transition-all mt-2"
                    style={{ background: "rgba(20,35,70,0.60)", border: "1px solid rgba(80,130,220,0.25)" }}>
                    Update Contact Info
                  </button>
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* ── Bottom Row ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* Security */}
          <div className="xl:col-span-2">
            <Card>
              <h3 className="text-base font-semibold text-white mb-5">Security & Authentication</h3>
              {[
                {
                  icon: "key", iconBg: "rgba(59,130,246,0.12)", iconBorder: "rgba(80,130,220,0.20)", iconColor: "text-blue-400",
                  label: "Password", sub: "Last updated 3 months ago",
                  right: <button onClick={() => setShowPwModal(true)}
                    className="text-xs font-semibold text-blue-400 hover:text-blue-300 px-3 py-1.5 rounded-lg transition-colors"
                    style={{ background: "rgba(59,130,246,0.10)", border: "1px solid rgba(80,130,220,0.20)" }}>
                    Update Password
                  </button>
                },
                {
                  icon: "shield", iconBg: "rgba(99,102,241,0.12)", iconBorder: "rgba(99,102,241,0.25)", iconColor: "text-indigo-400",
                  label: "2FA", sub: "Enabled for login verification",
                  right: <Toggle checked={twoFA} onChange={setTwoFA} />
                },
                {
                  icon: "monitor", iconBg: "rgba(16,185,129,0.10)", iconBorder: "rgba(16,185,129,0.22)", iconColor: "text-emerald-400",
                  label: "Login History", sub: "Review devices and active sessions",
                  right: <button onClick={() => setShowDevices(true)}
                    className="text-xs font-semibold text-blue-400 hover:text-blue-300 px-3 py-1.5 rounded-lg transition-colors"
                    style={{ background: "rgba(59,130,246,0.10)", border: "1px solid rgba(80,130,220,0.20)" }}>
                    View Devices
                  </button>
                },
              ].map((row, i, arr) => (
                <div key={row.label} className="flex items-center justify-between px-4 py-4"
                  style={i < arr.length - 1 ? { borderBottom: "1px solid rgba(80,130,220,0.12)" } : {}}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: row.iconBg, border: `1px solid ${row.iconBorder}` }}>
                      <Icon type={row.icon} className={`w-4 h-4 ${row.iconColor}`} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{row.label}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{row.sub}</p>
                    </div>
                  </div>
                  {row.right}
                </div>
              ))}
            </Card>
          </div>

          {/* Preferences */}
          <div>
            <Card className="h-full">
              <h3 className="text-base font-semibold text-white mb-5">Preferences</h3>
              {[
                { key: "emailNotifs",     icon: "bell", color: "text-blue-400",   bg: "rgba(59,130,246,0.12)", border: "rgba(80,130,220,0.20)", label: "Email Notifications", sub: "Updates about your account activity" },
                { key: "smsAlerts",       icon: "sms",  color: "text-indigo-400", bg: "rgba(99,102,241,0.12)", border: "rgba(99,102,241,0.25)", label: "SMS Alerts",          sub: "Receive important alerts by text"   },
                { key: "marketingEmails", icon: "tag",  color: "text-amber-400",  bg: "rgba(245,158,11,0.10)", border: "rgba(245,158,11,0.22)", label: "Marketing Emails",    sub: "Product updates, offers and campaigns" },
              ].map((item, i, arr) => (
                <div key={item.key} className="flex items-center justify-between py-3.5"
                  style={i < arr.length - 1 ? { borderBottom: "1px solid rgba(80,130,220,0.12)" } : {}}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: item.bg, border: `1px solid ${item.border}` }}>
                      <Icon type={item.icon} className={`w-4 h-4 ${item.color}`} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{item.label}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{item.sub}</p>
                    </div>
                  </div>
                  <Toggle checked={prefs[item.key]} onChange={v => setPrefs(p => ({ ...p, [item.key]: v }))} />
                </div>
              ))}
            </Card>
          </div>
        </div>
      </div>

      {/* ── Update Password Modal ── */}
      {showPwModal && (
        <Modal title="Update Password" onClose={() => { setShowPwModal(false); setPw({ current: "", newPw: "", confirm: "" }); setPwSaved(false); }}>
          <div className="space-y-4">
            {[
              { field: "current", label: "Current Password" },
              { field: "newPw",   label: "New Password"     },
              { field: "confirm", label: "Confirm New Password" },
            ].map(({ field, label }) => (
              <div key={field}>
                <label className="block text-xs text-slate-400 mb-1.5 font-medium">{label}</label>
                <div className="flex items-center gap-2 rounded-xl px-3.5 py-2.5" style={G.input}>
                  <Icon type="key" className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <input
                    type={showPw[field] ? "text" : "password"}
                    value={pw[field]}
                    onChange={e => setPw(p => ({ ...p, [field]: e.target.value }))}
                    placeholder="••••••••"
                    className="flex-1 bg-transparent text-sm text-white placeholder-slate-600 outline-none"
                  />
                  <button onClick={() => setShowPw(s => ({ ...s, [field]: !s[field] }))} className="text-slate-500 hover:text-slate-300 transition-colors">
                    <Icon type={showPw[field] ? "eye-off" : "eye"} className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {pw.newPw && pw.confirm && pw.newPw !== pw.confirm && (
              <p className="text-xs text-red-400 px-1">Passwords do not match.</p>
            )}

            <button onClick={handlePwSave} disabled={!pwValid}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-all mt-2"
              style={{
                background: pwSaved ? "linear-gradient(90deg,#10b981,#059669)" : pwValid ? "linear-gradient(90deg,#3b82f6,#6366f1)" : "rgba(30,50,90,0.4)",
                cursor: pwValid ? "pointer" : "not-allowed",
                boxShadow: pwValid ? "0 4px 14px rgba(59,130,246,0.25)" : "none",
              }}>
              {pwSaved ? <><Icon type="check" className="w-4 h-4" /> Password Updated!</> : "Update Password"}
            </button>
          </div>
        </Modal>
      )}

      {/* ── View Devices Modal ── */}
      {showDevices && (
        <Modal title="Active Devices & Sessions" onClose={() => setShowDevices(false)}>
          <div className="space-y-3">
            {DEVICES.map((d, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl"
                style={{ background: "rgba(20,35,65,0.55)", border: "1px solid rgba(80,130,220,0.14)" }}>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(59,130,246,0.12)", border: "1px solid rgba(80,130,220,0.20)" }}>
                  <Icon type="monitor" className="w-4 h-4 text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{d.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{d.location} · {d.time}</p>
                </div>
                {d.current
                  ? <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-emerald-300 flex-shrink-0"
                      style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.30)" }}>Current</span>
                  : <button className="text-[10px] font-bold px-2 py-0.5 rounded-full text-red-400 flex-shrink-0 hover:bg-red-500/10 transition-colors"
                      style={{ border: "1px solid rgba(239,68,68,0.25)" }}>Revoke</button>
                }
              </div>
            ))}
            <p className="text-xs text-slate-500 text-center pt-1">Revoking a session will sign out that device.</p>
          </div>
        </Modal>
      )}
    </div>
  );
}
