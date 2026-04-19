import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

// ── FAQ Item ──
function FAQItem({ question }) {
  const [open, setOpen] = useState(false);
  const answers = {
    "How do I track my home loan application status?": "You can track your application status in real-time from the Applications section in your dashboard. Each stage — Submitted, Verified, Under Review, Approved, and Disbursed — is clearly shown.",
    "Can I prepay my personal loan without penalty?": "Yes, you can prepay your personal loan after 6 months of the first EMI with no foreclosure charges. Partial prepayment is also allowed at any time.",
    "What documents are required for address proof?": "Accepted address proof documents include Aadhaar Card, Passport, Voter ID, Driving License, or a recent utility bill (not older than 3 months).",
    "How is my CIBIL score calculated?": "Your CIBIL score (300–900) is calculated based on payment history (35%), credit utilization (30%), length of credit history (15%), credit mix (10%), and new credit inquiries (10%).",
  };
  return (
    <div className="rounded-xl overflow-hidden border border-white/20 bg-white/[0.05] backdrop-blur-xl">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-sm text-white/80 hover:text-white hover:bg-white/[0.08] transition text-left"
      >
        <span>{question}</span>
        <svg
          width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          className={`flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        >
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm text-white/55 border-t border-white/20 pt-3 bg-white/[0.03]">
          {answers[question] || "Please contact our support team for more information."}
        </div>
      )}
    </div>
  );
}
export default function Support() {
  const navigate = useNavigate();
  // For chatbot open
  const openChatbot = () => {
    // Try to find the chatbot widget and click its open button if available
    const chatbotBtn = document.querySelector('[data-chatbot-open]');
    if (chatbotBtn) {
      chatbotBtn.click();
    } else {
      // Fallback: scroll to bottom where chatbot is usually docked
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
  };
  const faqs = [
    "How do I track my home loan application status?",
    "Can I prepay my personal loan without penalty?",
    "What documents are required for address proof?",
    "How is my CIBIL score calculated?",
  ];

  const tickets = [
    { id: "#TKT-8924", title: "Address change request",        sub: "Closed on 12 Oct, 2023",  status: "Resolved",    statusColor: "bg-green-500/15 text-green-400 border-green-400/20"  },
    { id: "#TKT-9102", title: "Interest rate discrepancy",     sub: "Updated 2 hours ago",      status: "In Progress", statusColor: "bg-orange-500/15 text-orange-400 border-orange-400/20" },
    { id: "#TKT-9255", title: "Missing document upload issue", sub: "Awaiting your reply",      status: "Pending User", statusColor: "bg-white/10 text-white/40 border-white/10"            },
  ];

  return (
    <main className="flex-1 overflow-y-auto p-8 text-slate-100">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Help & Support</h1>
        <p className="text-white/40 text-sm mt-1">We're here to help you with your financial journey</p>
      </div>

      {/* Search Bar */}
      <div className="rounded-2xl border border-white/20 bg-white/[0.07] backdrop-blur-2xl shadow-[0_12px_32px_rgba(5,16,38,0.45),inset_0_1px_0_rgba(255,255,255,0.14)] p-6 mb-6 text-center">
        <p className="text-base font-medium text-white mb-4">How can we help you today?</p>
        <div className="relative max-w-lg mx-auto mb-4">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder="Search for articles, guides, or FAQs..."
            className="w-full bg-white/[0.08] border border-white/20 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-white/35 focus:outline-none focus:border-[#9cc9ff]/60 backdrop-blur-xl transition"
          />
        </div>
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {["Loan Eligibility", "EMI Calculator", "Update KYC", "Tax Certificate"].map(tag => (
            <button key={tag} className="rounded-full border border-white/20 bg-white/[0.08] backdrop-blur-xl px-4 py-1.5 text-xs text-white/70 hover:text-white hover:bg-white/[0.14] transition">
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Support Channels */}
      <div className="flex flex-col sm:grid sm:grid-cols-3 gap-4 mb-6">
        {/* Chatbot */}
        <div className="rounded-2xl border border-white/20 bg-white/[0.07] backdrop-blur-2xl shadow-[0_12px_32px_rgba(5,16,38,0.45),inset_0_1px_0_rgba(255,255,255,0.14)] p-5 flex flex-col items-center text-center gap-3 mb-4 sm:mb-0">
          <div className="w-12 h-12 rounded-xl bg-white/[0.08] border border-white/20 flex items-center justify-center backdrop-blur-xl">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/50">
              <rect x="3" y="3" width="18" height="14" rx="2"/>
              <path d="M8 21l4-4 4 4"/>
              <circle cx="9" cy="10" r="1" fill="currentColor"/>
              <circle cx="15" cy="10" r="1" fill="currentColor"/>
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-white">24/7 Chatbot</p>
            <p className="text-xs text-white/35 mt-0.5">Get instant answers to general queries</p>
          </div>
          <button
            className="mt-auto w-full flex items-center justify-center gap-1.5 rounded-lg border border-white/20 bg-[#4f72e0] py-2 text-xs text-white hover:bg-[#3451a1] transition backdrop-blur-xl font-medium"
            onClick={openChatbot}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            Start Conversation
          </button>
        </div>

        {/* Advisor */}
        <div className="rounded-2xl border border-[#9cc9ff]/45 bg-gradient-to-b from-[#7da8ff]/[0.14] to-white/[0.08] backdrop-blur-2xl shadow-[0_14px_30px_rgba(17,56,130,0.35),inset_0_1px_0_rgba(235,244,255,0.2)] p-5 flex flex-col items-center text-center gap-3 relative overflow-hidden mb-4 sm:mb-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#9ec6ff]/20 to-transparent pointer-events-none" />
          <img src="https://i.pravatar.cc/48?img=5" alt="Bhanu Sri" className="w-12 h-12 rounded-full border-2 border-[#b7d6ff]/70" />
          <div>
            <p className="text-sm font-medium text-white">Bhanu Sri</p>
            <p className="text-xs text-white/35 mt-0.5">Your Dedicated Wealth Advisor</p>
          </div>
          <div className="mt-auto flex gap-2 w-full">
            <button
              className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-[#9cc9ff]/45 bg-gradient-to-r from-[#5e86f3]/85 to-[#7fa7ff]/80 py-2 text-xs text-white hover:brightness-110 transition shadow-[0_8px_20px_rgba(33,84,180,0.3)] font-medium"
              onClick={() => navigate('/contact')}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              Chat
            </button>
            <button
              className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-[#9cc9ff]/45 bg-white/[0.14] py-2 text-xs text-[#d4e7ff] hover:bg-white/[0.2] transition font-medium"
              onClick={() => navigate('/contact')}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.6 1.2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.78a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16.92z"/></svg>
              Call
            </button>
          </div>
        </div>

        {/* Email */}
        <div className="rounded-2xl border border-white/20 bg-white/[0.07] backdrop-blur-2xl shadow-[0_12px_32px_rgba(5,16,38,0.45),inset_0_1px_0_rgba(255,255,255,0.14)] p-5 flex flex-col items-center text-center gap-3 mb-4 sm:mb-0">
          <div className="w-12 h-12 rounded-xl bg-white/[0.08] border border-white/20 flex items-center justify-center backdrop-blur-xl">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/50">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-white">Email Support</p>
            <p className="text-xs text-white/35 mt-0.5">Drop us an email. We reply within 2 hours.</p>
          </div>
          <a
            href="mailto:support@thome.com"
            className="mt-auto w-full flex items-center justify-center gap-1.5 rounded-lg border border-white/20 bg-[#4f72e0] py-2 text-xs text-white hover:bg-[#3451a1] transition backdrop-blur-xl font-medium"
            style={{ textDecoration: 'none' }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            Send an Email
          </a>
        </div>
      </div>

      {/* FAQ + Tickets */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">

        {/* FAQ */}
        <div className="rounded-2xl border border-white/20 bg-white/[0.07] backdrop-blur-2xl shadow-[0_12px_32px_rgba(5,16,38,0.45),inset_0_1px_0_rgba(255,255,255,0.14)] p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-medium text-white">Frequently Asked Questions</h2>
            <button className="text-xs text-[#b5d4ff] hover:underline">View All</button>
          </div>
          <div className="flex flex-col gap-2">
            {faqs.map((faq, i) => <FAQItem key={i} question={faq} />)}
          </div>
        </div>

        {/* Recent Tickets */}
        <div className="rounded-2xl border border-white/20 bg-white/[0.07] backdrop-blur-2xl shadow-[0_12px_32px_rgba(5,16,38,0.45),inset_0_1px_0_rgba(255,255,255,0.14)] p-6">
          <h2 className="font-medium text-white mb-4">Recent Tickets</h2>
          <div className="flex flex-col gap-4">
            {tickets.map(ticket => (
              <div key={ticket.id} className="border-b border-white/20 pb-4 last:border-0 last:pb-0">
                <div className="flex items-start justify-between mb-1">
                  <span className="text-xs font-mono text-white/40">{ticket.id}</span>
                  <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-medium ${ticket.statusColor}`}>
                    {ticket.status}
                  </span>
                </div>
                <p className="text-sm text-white/80 mb-0.5">{ticket.title}</p>
                <p className="text-xs text-white/30">{ticket.sub}</p>
              </div>
            ))}
          </div>
          <button className="mt-4 w-full rounded-xl border border-white/20 bg-white/[0.08] py-2.5 text-xs text-white/75 hover:bg-white/[0.14] hover:text-white transition backdrop-blur-xl">
            View Ticket History
          </button>
        </div>

      </div>
    </main>
  );
}
