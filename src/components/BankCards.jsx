import React, { useEffect, useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";

export default function BankCards({
  banks = [],
  onSelectBank,
  selectedBank,
  isLoading = false,
}) {
  const [localSelectedBank, setLocalSelectedBank] = useState(null);

  const defaultBanks = [
    {
      id: 1,
      name: "Union Bank of India",
      logo: "/home/union bank logo.png",
      interestRate: "7.15%",
      monthlyEmi: "₹35,294.77",
      interest_rate: 7.15,
      monthly_emi: 35294.77,
    },
    {
      id: 2,
      name: "Bank of India",
      logo: "/home/sbi logo.png",
      interestRate: "7.50%",
      monthlyEmi: "₹36,251.69",
      interest_rate: 7.5,
      monthly_emi: 36251.69,
    },
    {
      id: 3,
      name: "State Bank of India",
      logo: "/home/union bank logo.png",
      interestRate: "7.35%",
      monthlyEmi: "₹35,840.08",
      interest_rate: 7.35,
      monthly_emi: 35840.08,
    },
  ];

  const normalizedBanks = useMemo(() => {
    const source = banks && banks.length > 0 ? banks : defaultBanks;

    return source.map((bank, index) => {
      const bankName = bank.name || bank.bank_name || "Bank";

      const parsedInterestRate =
        bank.interest_rate !== undefined && bank.interest_rate !== null
          ? Number(bank.interest_rate)
          : parseFloat(String(bank.interestRate || "0").replace("%", ""));

      const parsedMonthlyEmi =
        bank.monthly_emi !== undefined && bank.monthly_emi !== null
          ? Number(bank.monthly_emi)
          : bank.emi !== undefined && bank.emi !== null
          ? Number(bank.emi)
          : parseFloat(String(bank.monthlyEmi || "0").replace(/[₹,]/g, ""));

      return {
        id: bank.id || index + 1,
        name: bankName,
        bank_name: bank.bank_name || bankName,
        logo: bank.logo || bank.bank_logo || "",
        interestRate:
          bank.interestRate ||
          (bank.interest_rate !== undefined && bank.interest_rate !== null
            ? `${bank.interest_rate}%`
            : "—"),
        monthlyEmi:
          bank.monthlyEmi ||
          ((bank.monthly_emi !== undefined && bank.monthly_emi !== null) ||
          (bank.emi !== undefined && bank.emi !== null)
            ? `₹${Number(bank.monthly_emi ?? bank.emi).toLocaleString("en-IN")}`
            : "—"),
        interest_rate: Number.isNaN(parsedInterestRate) ? 0 : parsedInterestRate,
        monthly_emi: Number.isNaN(parsedMonthlyEmi) ? 0 : parsedMonthlyEmi,
        original: bank,
      };
    });
  }, [banks]);

  useEffect(() => {
    if (selectedBank) {
      setLocalSelectedBank(selectedBank);
    }
  }, [selectedBank]);

  const activeBank = localSelectedBank || selectedBank || null;

  const handleCardClick = (bank) => {
    if (isLoading) return;
    setLocalSelectedBank(bank);
  };

  const handleConfirmSelection = async () => {
    if (!activeBank) {
      alert("Please select a bank first");
      return;
    }

    const payload = {
      ...activeBank.original,
      id: activeBank.id,
      name: activeBank.name,
      bank_name: activeBank.bank_name || activeBank.name,
      logo: activeBank.logo,
      interestRate: activeBank.interestRate,
      monthlyEmi: activeBank.monthlyEmi,
      interest_rate: Number(activeBank.interest_rate || 0),
      monthly_emi: Number(activeBank.monthly_emi || 0),
    };

    console.log("Selected Bank Payload:", payload);

    if (onSelectBank) {
      await onSelectBank(payload);
    }
  };

  return (
    <section className="w-full py-16">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="mb-10 text-center text-3xl font-semibold text-white md:text-4xl">
          Recommended Banking Partners
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {normalizedBanks.map((bank) => {
            const isSelected = activeBank?.id === bank.id;

            return (
              <button
                key={bank.id}
                type="button"
                onClick={() => handleCardClick(bank)}
                disabled={isLoading}
                className={`w-full rounded-[28px] border p-7 text-left shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl transition duration-300 ${
                  isSelected
                    ? "border-[#4ea1ff] bg-[linear-gradient(135deg,rgba(45,63,120,0.95),rgba(26,33,62,0.92),rgba(12,16,28,0.95))] ring-2 ring-[#4ea1ff]/30"
                    : "border-white/20 bg-[linear-gradient(135deg,rgba(52,64,110,0.82),rgba(26,33,62,0.9),rgba(17,24,39,0.9))] hover:border-white/30 hover:-translate-y-1"
                } ${isLoading ? "cursor-not-allowed opacity-70" : ""}`}
              >
                <div className="mb-5 flex h-16 items-center justify-center">
                  {bank.logo ? (
                    <img
                      src={bank.logo}
                      alt={bank.name}
                      className="max-h-14 w-auto object-contain"
                    />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-xl font-bold text-white">
                      {bank.name?.slice(0, 2)?.toUpperCase()}
                    </div>
                  )}
                </div>

                <h3 className="mb-6 text-center text-2xl font-semibold text-white">
                  {bank.name}
                </h3>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-white/65">Interest Rate</span>
                    <span className="font-medium text-[#4ea1ff]">
                      {bank.interestRate}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-white/65">Monthly EMI</span>
                    <span className="font-semibold text-white">
                      {bank.monthlyEmi}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={handleConfirmSelection}
            disabled={!activeBank || isLoading}
            className="inline-flex min-w-[260px] items-center justify-center gap-3 rounded-2xl bg-[#2563ff] px-8 py-4 text-xl font-semibold text-white transition hover:bg-[#1f57e5] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading
              ? "Selecting..."
              : activeBank
              ? `Select ${activeBank.name}`
              : "Select a Bank"}
            <ArrowRight />
          </button>
        </div>
      </div>
    </section>
  );
}