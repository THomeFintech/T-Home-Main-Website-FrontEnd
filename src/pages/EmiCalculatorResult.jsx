import React from "react";

export default function EmiCalculatorResult({ amount, rate, years, onBack }) {
  // Dummy values for UI only
  const monthlyEmi = 2015.65;
  const totalInterest = 23099;
  const totalAmount = 123099;
  const principalPercent = 81.2;
  const interestPercent = 18.8;
  const paymentBreakdown = {
    labels: ["Principal", "Interest"],
    datasets: [
      {
        data: [principalPercent, interestPercent],
        backgroundColor: ["#1f6bff", "#f7c948"],
        borderWidth: 0,
      },
    ],
  };
  return (
    <section className="min-h-screen bg-gradient-to-b from-[#0b1a33] to-[#101c3a] flex flex-col items-center pt-24 pb-10 px-4 font-['Outfit',sans-serif]">
      <h1 className="text-center text-[32px] sm:text-[40px] font-semibold text-white mb-2">EMI Calculator</h1>
      <p className="text-center text-white/70 mb-8">Plan your financial future with precision.</p>
      <div className="w-full max-w-[1240px] grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Loan Details Card (left) */}
        <div className="rounded-[18px] border border-white/15 bg-[rgba(255,255,255,0.08)] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.32)] backdrop-blur-xl flex flex-col">
          <h2 className="text-[20px] font-semibold text-white mb-2">Loan Details</h2>
          <p className="text-[13px] text-white/60 mb-4">Adjust the sliders to calculate your EMI</p>
          {/* ...sliders and inputs, same as initial page... */}
          <button onClick={onBack} className="w-full mt-4 rounded-[8px] bg-[#1f6bff] py-2 text-[15px] font-medium text-white hover:bg-[#1c5ee0]">Back</button>
          <button className="w-full mt-3 rounded-[8px] border border-white/20 bg-transparent py-2 text-[15px] font-medium text-white flex items-center justify-center gap-2">
            <span className="material-icons">play_arrow</span> Apply for Loan
          </button>
        </div>
        {/* Results (center and right) */}
        <div className="md:col-span-2 flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div className="rounded-[12px] bg-[rgba(255,255,255,0.10)] p-4 text-center">
              <div className="text-[13px] text-white/70 mb-1">Monthly EMI</div>
              <div className="text-[24px] font-bold text-white">₹2,015.65</div>
              <div className="text-[11px] text-white/40 mt-1">BEST RATE AVAILABLE</div>
            </div>
            <div className="rounded-[12px] bg-[rgba(255,255,255,0.10)] p-4 text-center">
              <div className="text-[13px] text-white/70 mb-1">Total Interest</div>
              <div className="text-[24px] font-bold text-white">₹23,099.00</div>
              <div className="text-[11px] text-white/40 mt-1">OVER FULL LOAN DURATION</div>
            </div>
            <div className="rounded-[12px] bg-[rgba(255,255,255,0.10)] p-4 text-center">
              <div className="text-[13px] text-white/70 mb-1">Total Amount</div>
              <div className="text-[24px] font-bold text-white">₹123,099.00</div>
              <div className="text-[11px] text-white/40 mt-1">PRINCIPAL + INTEREST</div>
            </div>
          </div>
          {/* Payment Breakdown and Chart */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-[12px] bg-[rgba(255,255,255,0.10)] p-4 flex flex-col items-center">
              <div className="text-[13px] text-white/70 mb-2">Payment Breakdown</div>
              {/* Pie chart placeholder */}
              <div className="w-[120px] h-[120px] mx-auto mb-2">
                {/* Pie chart would go here */}
                <div className="w-full h-full rounded-full bg-gradient-to-br from-[#1f6bff] to-[#f7c948] flex items-center justify-center text-white text-[22px] font-bold">81.2%</div>
              </div>
              <div className="flex justify-center gap-4 mt-2">
                <span className="text-[#1f6bff] font-semibold">Principal</span>
                <span className="text-[#f7c948] font-semibold">Interest</span>
              </div>
            </div>
            <div className="rounded-[12px] bg-[rgba(255,255,255,0.10)] p-4">
              <div className="text-[13px] text-white/70 mb-2">Loan Balance Over Time</div>
              {/* Bar chart placeholder */}
              <div className="w-full h-[120px] bg-gradient-to-r from-[#1f6bff]/30 to-[#f7c948]/30 rounded-[8px] flex items-center justify-center text-white/40 text-[18px]">[Chart]</div>
            </div>
          </div>
          {/* Amortization Schedule Table */}
          <div className="rounded-[12px] bg-[rgba(255,255,255,0.10)] p-4 mt-4 overflow-x-auto">
            <div className="text-[13px] text-white/70 mb-2">Amortization Schedule</div>
            <table className="w-full text-[13px] text-white/90">
              <thead>
                <tr className="border-b border-white/15">
                  <th className="py-1">Month</th>
                  <th>Principal</th>
                  <th>Interest</th>
                  <th>Balance</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Month 1</td>
                  <td>₹1,513.27</td>
                  <td>₹502.38</td>
                  <td>₹98,486.66</td>
                </tr>
                <tr>
                  <td>Month 2</td>
                  <td>₹1,524.37</td>
                  <td>₹491.28</td>
                  <td>₹96,962.29</td>
                </tr>
                <tr>
                  <td>Month 3</td>
                  <td>₹1,535.52</td>
                  <td>₹480.13</td>
                  <td>₹95,426.77</td>
                </tr>
                <tr>
                  <td>Month 4</td>
                  <td>₹1,546.72</td>
                  <td>₹468.93</td>
                  <td>₹93,880.05</td>
                </tr>
                <tr>
                  <td>Month 5</td>
                  <td>₹1,557.97</td>
                  <td>₹457.68</td>
                  <td>₹92,322.08</td>
                </tr>
                <tr>
                  <td>Month 6</td>
                  <td>₹1,569.27</td>
                  <td>₹446.38</td>
                  <td>₹90,752.81</td>
                </tr>
              </tbody>
            </table>
            <div className="text-right mt-2 text-[12px] text-[#1f6bff] cursor-pointer">View all Months</div>
          </div>
        </div>
      </div>
    </section>
  );
}
