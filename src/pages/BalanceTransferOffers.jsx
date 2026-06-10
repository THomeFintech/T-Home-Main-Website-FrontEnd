import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  ShieldCheck,
  Plus,
  Pencil,
  Trash2,
  IndianRupee,
  CalendarDays,
  Percent,
  FileText,
  Scale,
  Sparkles,
} from "lucide-react";
import { BT_API_BASE } from "../config";
import { getBankLogo } from "../utils/Banklogos";

const initialOffer = {
  bankName: "",
  rate: "",
  amount: "",
  tenure: "",
  fee: "",
};

const bankOptions = [
  "Bank of India",
  "Federal Bank",
  "Union Bank of India",
  "Indian Bank",
  "Canara Bank",
  "City Union Bank",
  "HDFC Bank",
  "Telangana Grameena Bank",
  "State Bank of India",
  "Central Bank of India",
  "Karur Vysya Bank",
  "Bank of Baroda",
  "ICICI Bank",
  "IndusInd Bank",
  "IDFC FIRST Bank",
  "Axis Bank",
  "Bandhan Bank",
  "Kotak Mahindra Bank",
  "Punjab National Bank",
];

function formatCurrency(value) {
  return Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  });
}

function formatTenure(value) {
  const months = Number(value || 0);
  return months ? `${months} Months` : "0 Months";
}

function normalizeOfferCard(item, index) {
  return {
    id: `${item.bank_name}-${index}`,
    bank: item.bank_name,
    tag: item.offer_source === "AI SUGGESTED" ? "Our Suggestion" : "",
    amount: formatCurrency(item.loan_amount_offered),
    tenure: formatTenure(item.tenure_months),
    rate: `${item.interest_rate}% p.a.`,
    customerAmount: formatCurrency(
      Number(item.loan_amount_offered || 0) - Number(item.processing_fee || 0)
    ),
    fee: formatCurrency(item.processing_fee),
    raw: item,
    logo: getBankLogo(item.bank_name),
  };
}

export default function BalanceTransferOffers() {
  const navigate = useNavigate();

  const [offer, setOffer] = useState(initialOffer);
  const [manualOffers, setManualOffers] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showAiRecommended, setShowAiRecommended] = useState(false);
  const [loading, setLoading] = useState(false);
  const [compareLoading, setCompareLoading] = useState(false);
  const [error, setError] = useState("");
  const [editIndex, setEditIndex] = useState(null);

  const normalOffers = useMemo(
    () => manualOffers.map((item, index) => normalizeOfferCard(item, index)),
    [manualOffers]
  );

  const aiSuggestedOffers = useMemo(() => {
  const stored = JSON.parse(
    localStorage.getItem("btOfferEvaluation") || "[]"
  );
  const currentBank = localStorage.getItem("currentBankName");

console.log("Current Bank:", currentBank);
  console.log("AI STORED DATA:", stored);

  return stored
  .filter((item) => {
    const source = item.offer_source?.toUpperCase();
    const decision = item.decision?.toUpperCase();
    const currentBank =
      localStorage.getItem("currentBankName");

    return (
      item.bank_name !== currentBank &&
      (
        source?.includes("AI") ||
        decision === "BENEFICIAL"
      )
    );
  })
    .sort((a, b) => Number(b.savings || 0) - Number(a.savings || 0))
    .slice(0, 3)
    .map((item, index) => normalizeOfferCard(item, index));
}, [showAiRecommended, compareLoading]);

  const inputClass =
    "h-[42px] w-full rounded-[8px] border border-white/15 bg-[rgba(255,255,255,0.07)] px-3 text-[13px] text-white placeholder:text-white/45 outline-none transition focus:border-[#5b93ff]";

  const resetOfferForm = () => {
    setOffer(initialOffer);
    setEditIndex(null);
  };

 const handleChange = (e) => {
  const { name, value } = e.target;

  if (value !== "" && Number(value) < 0) {
    return;
  }

  setOffer((prev) => ({
    ...prev,
    [name]: value,
  }));
};
  const handleAddOffer = () => {
    setError("");
    if (
  Number(offer.rate) < 0 ||
  Number(offer.amount) < 0 ||
  Number(offer.tenure) <= 0 ||
  Number(offer.fee) < 0
) {
  setError("Please enter valid positive values.");
  return;
}

    if (!offer.bankName || !offer.rate || !offer.amount || !offer.tenure || !offer.fee) {
      setError("Please fill all offer fields before adding.");
      return;
    }

    const mappedOffer = {
      bank_name: offer.bankName,
      loan_amount_offered: Number(offer.amount),
      tenure_months: Number(offer.tenure),
      interest_rate: Number(offer.rate),
      processing_fee: Number(offer.fee),
      offer_source: "USER PROVIDED",
      decision: "PENDING",
    };

    if (editIndex !== null) {
      const updated = [...manualOffers];
      updated[editIndex] = mappedOffer;
      setManualOffers(updated);
    } else {
      setManualOffers((prev) => [...prev, mappedOffer]);
    }

    resetOfferForm();
  };

  const handleEditOffer = (index) => {
    const selected = manualOffers[index];

    setOffer({
      bankName: selected.bank_name || "",
      rate: String(selected.interest_rate || ""),
      amount: String(selected.loan_amount_offered || ""),
      tenure: String(selected.tenure_months || ""),
      fee: String(selected.processing_fee || ""),
    });

    setEditIndex(index);
    setShowSuggestions(true);
    setShowAiRecommended(false);
  };

  const handleDeleteOffer = (index) => {
    setManualOffers((prev) => prev.filter((_, i) => i !== index));

    if (editIndex === index) {
      resetOfferForm();
    }
  };

  const handleSuggestBanks = async () => {
    try {
      setLoading(true);
      setError("");

      const loanReference = localStorage.getItem("btLoanReference");

      if (!loanReference) {
        setError("Loan reference not found. Please go back and submit loan details.");
        return;
      }

      const payload = {
        number_of_offers: 0,
        offers: [],
      };

      const response = await fetch(
  `${BT_API_BASE}/loan/${loanReference}/offers`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  }
);

if (!response.ok) {
  const error = await response.json();
  console.log("Offers API Error:", error);
  throw new Error("Failed to get AI suggestions");
}

const result = await response.json();

      localStorage.setItem("btOfferEvaluation", JSON.stringify(result));

      setShowSuggestions(true);
      setShowAiRecommended(true);
    } catch (err) {
      setError(err?.response?.data?.detail || "Failed to get AI suggestions.");
    } finally {
      setLoading(false);
    }
  };

  const handleCompare = async () => {
    try {
      setCompareLoading(true);
      setError("");

      const loanReference = localStorage.getItem("btLoanReference");

      if (!loanReference) {
        setError("Loan reference not found. Please go back and submit loan details.");
        return;
      }

      let payload;

      if (manualOffers.length === 0) {
        payload = {
          number_of_offers: 0,
          offers: [],
        };
      } else {
        payload = {
          number_of_offers: manualOffers.length,
          offers: manualOffers.map((item) => ({
            bank_name: item.bank_name,
            loan_amount_offered: Number(item.loan_amount_offered),
            tenure_months: Number(item.tenure_months),
            interest_rate: Number(item.interest_rate),
            processing_fee: Number(item.processing_fee),
          })),
        };
      }

     const response = await fetch(
  `${BT_API_BASE}/loan/${loanReference}/offers`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  }
);

if (!response.ok) {
  const error = await response.json();
  console.log("Compare API Error:", error);
  throw new Error("Failed to compare offers");
}

const result = await response.json();
console.log("Offers API Response:", result);

      localStorage.setItem("btOfferEvaluation", JSON.stringify(result));
      const bestOffer = result
  .filter((item) => {
    const source = item.offer_source?.toUpperCase();
    const decision = item.decision?.toUpperCase();

    return (
      item.bank_name !== localStorage.getItem("currentBankName") &&
      (
        source?.includes("AI") ||
        decision === "BENEFICIAL"
      )
    );
  })
  .sort((a, b) => Number(b.savings || 0) - Number(a.savings || 0))[0];

if (bestOffer) {
  localStorage.setItem(
    "btBestOffer",
    JSON.stringify(bestOffer)
  );
}

      navigate("/balance-transfer/review");
    } catch (err) {
      setError(err?.response?.data?.detail || "Failed to compare balance transfer.");
    } finally {
      setCompareLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden px-4 pb-12 pt-28 sm:px-6 md:pt-32 lg:px-8 lg:pt-36">
      <div className="pointer-events-none absolute inset-0 bg-[#030a1a]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(44,78,173,0.36),transparent_58%)]" />

      <div className="relative z-10 mx-auto max-w-[1300px] rounded-[16px] border border-white/15 bg-[linear-gradient(90deg,rgba(255,255,255,0.11)_0%,rgba(255,255,255,0.06)_100%)] p-4 shadow-[0_20px_70px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-8">
        <div className="mx-auto max-w-[1160px]">
          <div className="text-center">
            <h1 className="text-[36px] font-semibold leading-tight text-white sm:text-[58px]">
              Add Bank <span className="text-[#2572ff]">Offers to</span> Compare
            </h1>

            <p className="mt-2 text-[12px] text-white/70 sm:text-[13px]">
              Add one or more bank offers to see which balance transfer saves you the most.
            </p>
          </div>

          <div className="mt-8 rounded-[12px] border border-white/15 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-4 shadow-[0_16px_40px_rgba(0,0,0,0.28)] sm:p-6">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-[30px] font-semibold text-white">
                  Add Bank Offer
                </h2>

                <p className="mt-1 max-w-[720px] text-[12px] text-white/60">
                  Enter one or more bank offers to compare balance transfer savings with your current loan.
                </p>
              </div>

              <div className="inline-flex h-[30px] items-center gap-1.5 self-start rounded-full border border-[#5a8fe4]/50 bg-[#1f4ea8]/20 px-3 text-[10px] font-medium text-[#93bfff]">
                <ShieldCheck size={12} />
                SECURE COMPARISON FLOW
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <div>
                <label className="mb-1.5 block text-[12px] font-medium text-white/90">
                  Bank Name *
                </label>

                <div className="relative">
                  <Building2
                    size={14}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/45"
                  />

                  <select
                    name="bankName"
                    value={offer.bankName}
                    onChange={handleChange}
                    className={`${inputClass} pl-9`}
                  >
                    <option value="">Select bank name</option>

                    {bankOptions.map((bank) => (
                      <option key={bank} value={bank} className="text-black">
                        {bank}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <Input
                label="Interest Rate (%)"
                name="rate"
                value={offer.rate}
                onChange={handleChange}
                placeholder="Enter rate"
                inputClass={inputClass}
              />

              <Input
                label="Loan Amount Offered"
                name="amount"
                value={offer.amount}
                onChange={handleChange}
                placeholder="Enter amount"
                inputClass={inputClass}
              />

              <Input
                label="Tenure (Months) *"
                name="tenure"
                value={offer.tenure}
                onChange={handleChange}
                placeholder="Enter tenure"
                inputClass={inputClass}
              />
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto] md:items-end">
              <Input
                label="Processing Fee *"
                name="fee"
                value={offer.fee}
                onChange={handleChange}
                placeholder="Enter processing fee"
                inputClass={inputClass}
              />

              <button
                type="button"
                onClick={handleAddOffer}
                className="inline-flex h-[42px] items-center justify-center gap-1.5 rounded-[9px] bg-[#1f6bff] px-5 text-[13px] font-medium text-white transition hover:bg-[#1c5ee0]"
              >
                <Plus size={14} />
                {editIndex !== null ? "Update Offer" : "Add Offer"}
              </button>
            </div>
          </div>

          {error ? (
            <p className="mt-4 text-center text-sm text-red-400">{error}</p>
          ) : null}

          {!showSuggestions ? (
            <div className="mt-6 rounded-[12px] border border-white/15 bg-[linear-gradient(90deg,rgba(255,255,255,0.09)_0%,rgba(255,255,255,0.04)_100%)] px-4 py-6 text-center">
              <p className="text-[16px] text-white">
                If you don&apos;t have offers you can use AI Suggestions
              </p>

              <div className="mt-4 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => navigate("/balance-transfer/details")}
                  className="rounded-[8px] border border-white/25 bg-white/10 px-4 py-2 text-[12px] font-medium text-white transition hover:bg-white/15"
                >
                  ← Back
                </button>

                <button
                  type="button"
                  onClick={handleSuggestBanks}
                  disabled={loading}
                  className="rounded-[8px] bg-[#1f6bff] px-4 py-2 text-[12px] font-medium text-white transition hover:bg-[#1c5ee0] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Loading..." : "Suggest Banks"}
                </button>
              </div>
            </div>
          ) : null}

          {showSuggestions ? (
            <>
              {normalOffers.length > 0 ? (
                <>
                  <h2 className="mt-10 text-center text-[42px] font-semibold text-white">
                    Added Bank Offers
                  </h2>

                  <div className="mt-7 grid grid-cols-1 gap-5 lg:grid-cols-3">
                    {normalOffers.map((item, index) => (
                      <OfferCard
                        key={`normal-${item.bank}-${index}`}
                        item={item}
                        isAi={false}
                        index={index}
                        onEdit={() => handleEditOffer(index)}
                        onDelete={() => handleDeleteOffer(index)}
                      />
                    ))}
                  </div>
                </>
              ) : null}

              {!showAiRecommended ? (
                <div className="mt-6 flex items-center justify-center">
                  <button
                    type="button"
                    onClick={handleSuggestBanks}
                    disabled={loading}
                    className="rounded-[9px] bg-[#1f6bff] px-5 py-2.5 text-[13px] font-medium text-white transition hover:bg-[#1c5ee0] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? "Loading..." : "AI Suggest Offer"}
                  </button>
                </div>
              ) : null}

              {showAiRecommended && aiSuggestedOffers.length > 0 ? (
                <>
                  <h2 className="mt-10 text-center text-[42px] font-semibold text-white">
                    AI Suggested Beneficial Bank Offers
                  </h2>

                  <div className="mt-7 grid grid-cols-1 gap-5 lg:grid-cols-3">
                    {aiSuggestedOffers.map((item, index) => (
                      <OfferCard
                        key={`ai-${item.bank}-${index}`}
                        item={item}
                        isAi={true}
                        index={index}
                      />
                    ))}
                  </div>
                </>
              ) : null}

              <div className="mt-7 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowSuggestions(false);
                    setShowAiRecommended(false);
                  }}
                  className="rounded-[9px] border border-white/25 bg-white px-5 py-2.5 text-[14px] font-medium text-[#0f172a] transition hover:bg-slate-100"
                >
                  ← Back
                </button>

                <button
                  type="button"
                  onClick={handleCompare}
                  disabled={compareLoading}
                  className="inline-flex items-center gap-2 rounded-[9px] bg-[#1f6bff] px-6 py-2.5 text-[14px] font-medium text-white transition hover:bg-[#1c5ee0] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Scale size={14} />
                  {compareLoading ? "Comparing..." : "Compare Balance Transfer"}
                </button>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function Input({ label, name, value, onChange, placeholder, inputClass }) {
  return (
    <div>
      <label className="mb-1.5 block text-[12px] font-medium text-white/90">
        {label}
      </label>

      <input
        type="number"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={inputClass}
      />
    </div>
  );
}

function OfferCard({ item, isAi, index, onEdit, onDelete }) {
  const isBest = isAi && index === 0;

  return (
    <article
      className={`relative overflow-hidden rounded-[18px] border p-4 text-white backdrop-blur-xl transition duration-300 hover:-translate-y-1 ${
        isBest ? "border-[#2f78ff]" : "border-white/15"
      } bg-white/5 shadow-[0_18px_50px_rgba(0,0,0,0.35)]`}
    >
      {isBest ? (
        <div className="absolute right-3 top-3 z-10 rounded-full border border-[#2f78ff] bg-white/10 px-3 py-1 text-[10px] font-semibold text-[#9fc5ff]">
          BEST OFFER
        </div>
      ) : null}

      <div className="relative z-10">
        <div className="mb-3 flex items-start justify-between border-b border-white/15 pb-3">
          <div className="flex items-center gap-3">
            {item.logo ? (
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white p-1.5">
                <img
                  src={item.logo}
                  alt={item.bank}
                  className="h-full w-full object-contain"
                />
              </div>
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10">
                <Building2 size={18} className="text-[#7fb3ff]" />
              </div>
            )}

            <div>
              <h3 className="text-[14px] font-semibold text-white">
                {item.bank}
              </h3>

              {isAi ? (
                <span className="mt-1 inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/10 px-2 py-1 text-[10px] font-medium text-white/75">
                  <Sparkles size={11} />
                  {item.tag}
                </span>
              ) : (
                <span className="mt-1 inline-flex rounded-full border border-white/15 bg-white/10 px-2 py-1 text-[10px] text-white/70">
                  User Added
                </span>
              )}
            </div>
          </div>

          {!isAi ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onEdit}
                className="rounded-full border border-white/15 bg-white/10 p-1.5 text-white/70 transition hover:bg-white/20 hover:text-white"
              >
                <Pencil size={12} />
              </button>

              <button
                type="button"
                onClick={onDelete}
                className="rounded-full border border-white/15 bg-white/10 p-1.5 text-white/70 transition hover:bg-red-500/20 hover:text-red-300"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ) : null}
        </div>

        <div className="grid grid-cols-2 gap-3 text-[11px]">
          <InfoBox
            label="Loan Amount"
            value={`₹ ${item.amount}`}
            icon={<IndianRupee size={14} />}
            highlight
          />

          <InfoBox
            label="Tenure"
            value={item.tenure}
            icon={<CalendarDays size={14} />}
          />
        </div>

        <div className="mt-3 rounded-[12px] border border-white/10 bg-white/10 p-3">
          <p className="text-[11px] text-white/60">Interest Rate</p>

          <p className="mt-1 flex items-center gap-2 text-[28px] font-bold leading-none text-white">
            <Percent size={16} className="text-[#7fb3ff]" />
            {item.rate}
          </p>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3 text-[11px]">
          <InfoBox
            label="Amount to Customer"
            value={`₹ ${item.customerAmount}`}
            icon={<FileText size={13} />}
          />

          <InfoBox
            label="Processing Fees"
            value={`₹ ${item.fee}`}
            icon={<FileText size={13} />}
          />
        </div>
      </div>
    </article>
  );
}

function InfoBox({ label, value, icon, highlight }) {
  return (
    <div className="rounded-[12px] border border-white/10 bg-white/10 p-3">
      <p className="flex items-center gap-1 text-[11px] text-white/60">
        {icon}
        {label}
      </p>

      <p
        className={`mt-1 text-[15px] font-semibold ${
          highlight ? "text-emerald-300" : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
