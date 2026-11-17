/* =====================================================================
   CIBIL-BASED ELIGIBILITY SCORING (shared by ConfidenceGauge and
   DecisionPanel). Returns { percent, reasons[] } or null when no CIBIL
   data is available.
   ===================================================================== */

const toNum = (v) => {
  if (v === null || v === undefined || v === "") return null;
  if (typeof v === "number") return Number.isFinite(v) ? v : null;
  const n = Number(String(v).replace(/[₹,\s]/g, ""));
  return Number.isFinite(n) ? n : null;
};

const parseDate = (v) => {
  if (!v) return null;
  const t = String(v).trim();
  let m = t.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (m) return new Date(+m[1], +m[2] - 1, +m[3]);
  m = t.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})/);
  if (m) return new Date(+m[3], +m[2] - 1, +m[1]);
  m = t.match(/^(\d{4})-(\d{1,2})$/);
  if (m) return new Date(+m[1], +m[2] - 1, 1);
  return null;
};

// "000" -> 0, "030" -> 30, "SUB" -> 90, "XXX"/"" -> null (not reported)
const statusToDpd = (status) => {
  if (status === null || status === undefined) return null;
  const t = String(status).trim().toUpperCase();
  if (!t || t === "XXX" || t === "-") return null;
  if (/^\d+$/.test(t)) return Number(t);
  if (t === "STD") return 0;
  if (t === "SMA") return 30;
  if (t === "SUB") return 90;
  if (t === "DBT") return 120;
  if (t === "LSS") return 180;
  return null;
};

const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

// Standard EMI formula. 11% p.a. is an assumed rate for the new loan.
const ASSUMED_RATE = 11;
const calcEmi = (principal, years, annualRate = ASSUMED_RATE) => {
  const n = Math.round((years || 0) * 12);
  if (!principal || n <= 0) return 0;
  const r = annualRate / 12 / 100;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
};

function readStoredReport() {
  try {
    return JSON.parse(localStorage.getItem("dashboard_cibil_report") || "null");
  } catch {
    return null;
  }
}

export function computeCibilEligibility(result, reportProp) {
  const report = reportProp || readStoredReport();
  const snapshot = result?.form_snapshot || {};

  const score =
    toNum(report?.score?.cibilScore) ??
    toNum(snapshot.cibil_score) ??
    toNum(localStorage.getItem("dashboard_cibil_score"));

  // 300 is the form's default when no report was fetched: treat as missing
  if (!score || score < 300 || (!report && score === 300)) return null;

  const reasons = [];
  let caps = 100;

  /* ---- 1. CIBIL score (50) ---- */
  let scorePts;
  if (score >= 800) scorePts = 50;
  else if (score >= 750) scorePts = 40 + ((score - 750) / 50) * 10;
  else if (score >= 650) scorePts = 22 + ((score - 650) / 100) * 18;
  else if (score >= 550) scorePts = 10 + ((score - 550) / 100) * 12;
  else scorePts = ((score - 300) / 250) * 10;

  if (score >= 750) reasons.push(`Strong CIBIL score (${score})`);
  else if (score >= 650) reasons.push(`Average CIBIL score (${score})`);
  else reasons.push(`Low CIBIL score (${score})`);

  if (score < 550) caps = Math.min(caps, 30);
  else if (score < 650) caps = Math.min(caps, 59);

  const accounts = Array.isArray(report?.accounts)
    ? report.accounts
    : Array.isArray(report?.["CONSUMER ACCOUNT DETAILS"])
      ? report["CONSUMER ACCOUNT DETAILS"]
      : [];

  /* ---- 2. Payment history, last 24 months (20) ---- */
  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - 24);

  let counted = 0;
  let late = 0;
  let severe = false;

  accounts.forEach((acc) => {
    const payments = acc?.paymentHistory?.monthlyPayments;
    if (!Array.isArray(payments)) return;

    payments.forEach((p) => {
      const d = parseDate(p?.date);
      if (d && d < cutoff) return;
      const dpd = statusToDpd(p?.status);
      if (dpd === null) return;
      counted += 1;
      if (dpd > 0) late += 1;
      if (dpd >= 90) severe = true;
    });
  });

  let payPts;
  if (counted === 0) {
    payPts = 12; // no history: neutral
  } else {
    payPts = 20 * (1 - late / counted);
    if (late === 0) reasons.push("No late payments in the last 24 months");
    else reasons.push(`${late} late payment(s) in the last 24 months`);
  }

  if (severe) {
    payPts = Math.min(payPts, 4);
    caps = Math.min(caps, 30);
    reasons.push("Severe delinquency (90+ days) found");
  }

  /* ---- 3. Overdue amount (10) ---- */
  const overdueTotal = accounts.reduce(
    (sum, a) => sum + (toNum(a?.amountPastDue) ?? 0),
    0,
  );
  const overduePts = overdueTotal > 0 ? 0 : 10;
  if (overdueTotal > 0) {
    reasons.push(
      `Overdue amount of ₹${Math.round(overdueTotal).toLocaleString("en-IN")}`,
    );
  }

  // Settled / written-off accounts
  const badAccount = accounts.some(
    (a) =>
      (toNum(a?.writtenOffAmount) ?? 0) > 0 ||
      (toNum(a?.settlementAmount) ?? 0) > 0,
  );
  if (badAccount) {
    caps = Math.min(caps, 30);
    reasons.push("Settled or written-off account found");
  }

  /* ---- 4. Enquiries in the last 6 months (5) ---- */
  let enquiryPts = 3; // unknown: neutral
  if (Array.isArray(report?.inquiries)) {
    const since = new Date();
    since.setMonth(since.getMonth() - 6);

    const recent = report.inquiries.filter((q) => {
      const d = parseDate(q?.inquiryDate);
      return d && d >= since;
    }).length;

    enquiryPts = recent <= 2 ? 5 : recent <= 4 ? 3 : 0;
    if (recent > 4)
      reasons.push(`${recent} credit enquiries in the last 6 months`);
  }

  /* ---- 5. Repayment burden: (existing EMI + new EMI) / income (15) ---- */
  const income = toNum(snapshot.net_monthly_income);

  const reportEmi = accounts
    .filter((a) => {
      const closed =
        /closed|inactive/i.test(String(a?.accountStatus || "")) ||
        Boolean(a?.dateClosed);
      return !closed;
    })
    .reduce((sum, a) => sum + (toNum(a?.emiAmount) ?? 0), 0);

  const formEmi = Array.isArray(snapshot.existing_loans)
    ? snapshot.existing_loans.reduce(
        (sum, l) => sum + (toNum(l?.monthly_emi) ?? 0),
        0,
      )
    : 0;

  const existingEmi = Math.max(reportEmi, formEmi);
  const newEmi = calcEmi(toNum(snapshot.loan_amount), toNum(snapshot.tenure));

  let foirPts = 8; // income unknown: neutral
  if (income && income > 0) {
    const foir = (existingEmi + newEmi) / income;
    if (foir <= 0.3) foirPts = 15;
    else if (foir <= 0.4) foirPts = 11;
    else if (foir <= 0.5) foirPts = 6;
    else foirPts = 0;

    reasons.push(`Total EMIs would be ${Math.round(foir * 100)}% of income`);
  }

  const total = scorePts + payPts + overduePts + enquiryPts + foirPts;
  const percent = Math.round(clamp(Math.min(total, caps), 0, 100));

  return { percent, reasons: reasons.slice(0, 4) };
}
