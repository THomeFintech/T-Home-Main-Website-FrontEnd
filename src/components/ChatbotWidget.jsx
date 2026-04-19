import React, { useState, useRef, useEffect } from "react";

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [activeService, setActiveService] = useState(null);
  const [loadingSteps, setLoadingSteps] = useState(false);
  const widgetRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  async function fetchServiceSteps(title) {
    setLoadingSteps(true);
    await new Promise(res => setTimeout(res, 400));
    const backendSteps = {
      'Apply for Home Loan': [
        { text: 'Go to Home Loan page', link: '/home-loans' },
        { text: 'Fill out the application form', link: '/home-loans' },
        { text: 'Upload required documents', link: '/home-loans' },
        { text: 'Review and submit your application', link: '/home-loans' },
        { text: 'Track your application status', link: '/dashboard' }
      ],
      'ITR Tax Filing': [
        { text: 'Go to ITR Tax Filing page', link: '/itr-filing' },
        { text: 'Select your ITR type', link: '/itr-filing' },
        { text: 'Upload documents', link: '/itr-filing' },
        { text: 'Review summary', link: '/itr-filing' },
        { text: 'Submit for processing', link: '/itr-filing' }
      ],
      'GST Services': [
        { text: 'Go to GST Services page', link: '/gst-registration' },
        { text: 'Choose registration or filing', link: '/gst-registration' },
        { text: 'Fill in business details', link: '/gst-registration' },
        { text: 'Upload compliance documents', link: '/gst-registration' },
        { text: 'Submit and track status', link: '/gst-registration' }
      ],
      'Contact T–Home': [
        { text: 'Go to Contact page', link: '/contact' },
        { text: 'Choose contact method', link: '/contact' },
        { text: 'Fill out the form or call/email', link: '/contact' },
        { text: 'Submit your query', link: '/contact' }
      ],
      'Company Registration': [
        { text: 'Go to Company Registration page', link: '/company-registration' },
        { text: 'Select registration type', link: '/company-registration' },
        { text: 'Fill in company details', link: '/company-registration' },
        { text: 'Upload required documents', link: '/company-registration' },
        { text: 'Submit for approval', link: '/company-registration' }
      ],
      'Personal Loans': [
        { text: 'Go to Personal Loans page', link: '/personal-loans' },
        { text: 'Check eligibility', link: '/personal-loans' },
        { text: 'Fill out the application', link: '/personal-loans' },
        { text: 'Upload documents', link: '/personal-loans' },
        { text: 'Submit and track status', link: '/personal-loans' }
      ]
    };
    setActiveService({ title, steps: backendSteps[title] });
    setLoadingSteps(false);
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (widgetRef.current && !widgetRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleShowSteps = (title) => {
    fetchServiceSteps(title);
  };

  const handleSend = async (msg) => {
    if (!msg.trim()) return;

    setMessages((prev) => [...prev, { type: "user", text: msg }]);

    try {
      const res = await fetch("http://127.0.0.1:8000/chatbot/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: msg })
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          text: data.reply,
          related: data.related_questions
        }
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { type: "bot", text: "Server error", related: [] }
      ]);
    }
  };

  return (
    <>
      {/* Floating Chatbot Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setOpen(true)}
          className="w-16 h-16 md:w-20 md:h-20 rounded-full shadow-xl flex items-center justify-center bg-white border border-blue-200 hover:scale-105 transition"
        >
          <img
            src="/home/bot (1).png"
            alt="Chatbot"
            className="w-12 h-12 object-contain"
          />
        </button>
      </div>

      {/* Chatbot Window */}
      {open && (
        <div className="fixed inset-0 z-50 flex justify-end items-end sm:bottom-8 sm:right-8 sm:w-auto sm:h-auto">
          <div
            ref={widgetRef}
            className="w-full h-full sm:w-[410px] sm:max-w-[98vw] sm:h-[600px] bg-[#f7f9fb] rounded-none sm:rounded-3xl shadow-2xl border border-blue-100 flex flex-col overflow-hidden animate-fadeIn relative"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 sm:px-6 sm:py-4 bg-[#1d3557] text-white border-b border-blue-200">
              <img src="/home/logo.png" alt="T-Home" className="w-12 h-12 rounded-full border-2 border-white" />
              <div>
                <div className="font-semibold text-lg leading-tight">T-Home Assistant</div>
                <div className="text-xs flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-green-400 rounded-full"></span>
                  Online
                </div>
              </div>
              <button
                className="ml-auto text-white/70 hover:text-white text-2xl font-bold"
                onClick={() => setOpen(false)}
                aria-label="Close chatbot"
              >
                ×
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 px-3 py-4 sm:px-6 sm:py-6 overflow-y-auto bg-[#f7f9fb] flex flex-col items-center w-full">
              <div className="w-full max-w-[380px] flex flex-col gap-5 mb-6">

                {/* Greeting — only when no messages */}
                {!activeService && messages.length === 0 && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#e9eef6] flex items-center justify-center mt-1">
                      <img src="/home/bot (1).png" alt="Bot" className="w-7 h-7" />
                    </div>
                    <div className="bg-white px-5 py-3 rounded-2xl shadow text-gray-800 text-base max-w-[320px]">
                      Hi 👋 I'm your T-Home assistant.<br />How can I help you today?
                    </div>
                  </div>
                )}

                {/* Chat Messages */}
                {messages.length > 0 && (
                  messages.map((msg, i) => (
                    <div key={i} className="flex flex-col gap-2">

                      {/* USER */}
                      {msg.type === "user" && (
                        <div className="text-right text-blue-600 font-medium px-1">
                          {msg.text}
                        </div>
                      )}

                      {/* BOT */}
                      {msg.type === "bot" && (
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#e9eef6] flex items-center justify-center mt-1 shrink-0">
                            <img src="/home/bot (1).png" className="w-7 h-7" />
                          </div>

                          <div className="flex-1">
                            <div className="bg-white px-5 py-3 rounded-2xl shadow text-gray-800">
                              {msg.text}
                            </div>

                            {/* ✅ UPDATED: Related questions — clearly visible */}
                            {msg.related && msg.related.length > 0 && (
                              <div className="flex flex-col gap-2 mt-3">
                                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide px-1">
                                  Related Questions
                                </p>
                                {msg.related.map((q, idx) => (
                                  <button
                                    key={idx}
                                    onClick={() => {
                                      setMessages((prev) => [
                                        ...prev,
                                        { type: "user", text: q.question },
                                        { type: "bot", text: q.answer, related: [] }
                                      ]);
                                    }}
                                    className="flex items-center gap-2 bg-white border border-blue-300 text-blue-700 font-medium px-4 py-2 rounded-xl text-sm hover:bg-blue-50 hover:border-blue-500 hover:shadow transition text-left w-full"
                                  >
                                    <span className="text-blue-400 text-base shrink-0">💬</span>
                                    {q.question}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                    </div>
                  ))
                )}

                {/* Active Service Steps */}
                {activeService && (
                  <div className="flex flex-col items-center w-full">
                    <div className="font-bold text-2xl text-[#22336b] mb-1 text-center">{activeService.title}</div>
                    <div className="text-base text-gray-500 mb-3 text-center font-normal">{activeService.steps.length} Steps to complete:</div>
                    {loadingSteps ? (
                      <div className="text-gray-400 text-center py-6">Loading steps...</div>
                    ) : (
                      <ol className="space-y-1 w-full">
                        {activeService.steps.map((step, idx) => (
                          <li key={idx} className="flex items-center gap-2 justify-start">
                            <span className="text-blue-700 font-bold text-xl min-w-[26px] text-right">{idx + 1}</span>
                            <button
                              className="text-blue-700 underline hover:text-blue-900 text-lg font-semibold text-left px-0"
                              style={{ minWidth: 0, lineHeight: '1.2' }}
                              onClick={() => window.location.href = step.link}
                            >
                              {step.text}
                            </button>
                            {idx < activeService.steps.length - 1 && (
                              <span className="mx-1 text-xl text-gray-400">→</span>
                            )}
                          </li>
                        ))}
                      </ol>
                    )}
                  </div>
                )}
              </div>

              {/* Quick Action Buttons */}
              <div className="flex gap-2 mb-6 justify-center">
                <button
                  className="flex items-center gap-2 px-4 py-1.5 rounded-full border-2 border-yellow-400 bg-yellow-50 text-yellow-800 font-semibold text-[14px] shadow-sm hover:bg-yellow-100 transition min-w-0"
                  onClick={() => window.location.href = '/tools'}
                >
                  <span className="text-lg">🏦</span>
                  Financial Tools
                </button>
                <button
                  className="flex items-center gap-2 px-4 py-1.5 rounded-full border-2 border-gray-300 bg-white text-gray-800 font-semibold text-[14px] shadow-sm hover:bg-gray-100 transition min-w-0"
                  onClick={() => window.location.href = '/services'}
                >
                  <span className="text-lg">🧾</span>
                  All Services
                </button>
                <button
                  className="flex items-center gap-2 px-4 py-1.5 rounded-full border-2 border-pink-300 bg-pink-50 text-pink-700 font-semibold text-[14px] shadow-sm hover:bg-pink-100 transition min-w-0"
                  onClick={() => window.location.href = '/contact'}
                >
                  <span className="text-lg">📞</span>
                  Contact Us
                </button>
              </div>

              {/* Service Cards — only when no messages and no active service */}
              {!activeService && messages.length === 0 && (
                <div className="grid grid-cols-2 gap-4 w-full max-w-[380px]">
                  {[
                    { icon: '🏠', title: 'Apply for Home Loan', desc: 'Learn the process, rates & requirements' },
                    { icon: '🧾', title: 'ITR Tax Filing', desc: 'Documents needed & how to file' },
                    { icon: '📊', title: 'GST Services', desc: 'Registration, filing & compliance' },
                    { icon: '📞', title: 'Contact T–Home', desc: 'Phone, address & email details' },
                    { icon: '🏢', title: 'Company Registration', desc: 'UDYAM, MSME & business setup' },
                    { icon: '💳', title: 'Personal Loans', desc: 'Eligibility, rates & quick process' },
                  ].map(card => (
                    <button
                      key={card.title}
                      className="rounded-xl bg-white border border-gray-200 p-4 flex flex-col shadow-sm hover:shadow-lg transition group text-left"
                      onClick={() => handleShowSteps(card.title)}
                    >
                      <span className="text-2xl mb-2">{card.icon}</span>
                      <div className="font-semibold text-gray-800 group-hover:text-blue-700">{card.title}</div>
                      <div className="text-xs text-gray-500">{card.desc}</div>
                    </button>
                  ))}
                </div>
              )}

              {/* Back Button */}
              {activeService && (
                <div className="flex justify-center mt-6">
                  <button
                    className="px-4 py-2 rounded-full border border-blue-300 bg-white text-blue-700 font-semibold hover:bg-blue-50 shadow"
                    onClick={() => setActiveService(null)}
                  >
                    ← Back to Services
                  </button>
                </div>
              )}
            </div>

            {/* Input Footer */}
            <div className="px-3 py-3 sm:px-6 sm:py-4 bg-white border-t border-blue-100 flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSend(input);
                    setInput("");
                  }
                }}
                placeholder="Type your message..."
                className="flex-1 rounded-full border border-gray-200 px-4 py-2 text-gray-700 bg-[#f7f9fb] focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
              <button
                onClick={() => {
                  handleSend(input);
                  setInput("");
                }}
                className="ml-3 w-10 h-10 rounded-full bg-teal-200 flex items-center justify-center hover:bg-teal-300 transition"
              >
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                  <path d="M3 12l18-7-7 18-2.5-7.5L3 12z" fill="#2dd4bf"/>
                </svg>
              </button>
            </div>

            {/* Footer */}
            <div className="text-center text-xs text-gray-400 py-2 bg-white border-t border-blue-100">
              {open && (
                <button
                  className="fixed top-3 right-3 z-50 sm:hidden bg-white/80 rounded-full p-2 shadow border border-gray-200 text-2xl font-bold text-gray-700"
                  onClick={() => setOpen(false)}
                  aria-label="Close chatbot"
                >
                  ×
                </button>
              )}
              Powered By: T-Home · H.No: 2-88/4, Hyderabad – 500055 · +91 7032183836 ·{" "}
              <a href="mailto:info@thome.com" className="underline text-blue-500">
                [email protected]
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}