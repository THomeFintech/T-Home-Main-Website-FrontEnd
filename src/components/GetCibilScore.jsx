import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FileText } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const API_BASE = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

const validatePAN = (pan) => {
  const normalizedPAN = pan.trim().toUpperCase();
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

  if (!normalizedPAN) {
    return "PAN is required.";
  }

  if (!panRegex.test(normalizedPAN)) {
    return "Invalid PAN format. Enter a PAN like ABCDE1234F.";
  }

  return "";
};

/* =====================================================================
   TRANSUNION CIBIL REPORT – PRESENTATION COMPONENTS
   ---------------------------------------------------------------------
   Colours below were sampled directly from the TransUnion CIBIL PDF:
     blue (labels)            #00a1de
     teal (enquiry/glossary)  #008c95
     heading / dark text      #1f2937   (account bar: #111827)
     values                   #000000
     box border               #9ca3af
     divider lines            #d1d5db
     striped row background   #f7f8fa   (enquiry rows: #f3f3f3)
     header underline         #ffc20e
     active ribbon            #00a651   inactive ribbon: #6b7280
     gauge track              #e5e7eb
   ===================================================================== */

const RPT_FONT = '"Times New Roman", Times, "Liberation Serif", serif';

/* ---------------------------------------------------------------------
   SCOPED REPORT STYLES
   The app's global CSS was overriding the report fonts (sans-serif) and
   the size of <p>/<h*> tags. These rules (with !important) force the exact
   TransUnion look: Times New Roman, bold, for everything inside .tu-report.
   Add the class "tu-regular" to anything that must be normal weight.
   --------------------------------------------------------------------- */
const REPORT_CSS = `
.tu-report,
.tu-report * {
  font-family: "Times New Roman", Times, "Liberation Serif", serif !important;
  font-weight: 700 !important;
  font-style: normal !important;
  letter-spacing: 0 !important;
}
.tu-report .tu-regular,
.tu-report .tu-regular * {
  font-weight: 400 !important;
}
`;

// TransUnion prints ₹0 for settlement / written-off amounts when none exist.
const STATUS_AMOUNT_FALLBACK = "₹0";

/* Code -> text tables (keys are numbers without leading zeros). */
const OWNERSHIP_MAP = {
  1: "INDIVIDUAL",
  2: "AUTHORISED USER",
  3: "GUARANTOR",
  4: "JOINT",
};

const PAYMENT_FREQUENCY_MAP = {
  1: "WEEKLY",
  2: "FORTNIGHTLY",
  3: "MONTHLY",
  4: "QUARTERLY",
};

const PHONE_TYPE_MAP = {
  0: "Not Classified",
  1: "Mobile Phone",
  2: "Home Phone",
  3: "Office Phone",
};

const ADDRESS_CATEGORY_MAP = {
  1: "Permanent Address",
  2: "Residence Address",
  3: "Office Address",
  4: "Not Categorized",
};

const RESIDENCE_CODE_MAP = {
  1: "Owned",
  2: "Rented",
};

const OCCUPATION_MAP = {
  1: "Salaried",
  2: "Self Employed Professionals",
  3: "Self Employed",
  4: "Others",
};

const ENQUIRY_PURPOSE_MAP = {
  0: "OTHERS",
  1: "AUTO LOAN",
  2: "HOUSING LOAN",
  3: "PROPERTY LOAN",
  4: "LOAN AGAINST SHARES/SECURITIES",
  5: "PERSONAL LOAN",
  6: "CONSUMER LOAN",
  7: "GOLD LOAN",
  8: "EDUCATIONAL LOAN",
  9: "LOAN TO PROFESSIONAL",
  10: "CREDIT CARD",
  11: "LEASING",
  12: "OVERDRAFT",
  13: "TWO-WHEELER LOAN",
  14: "NON-FUNDED CREDIT FACILITY",
  15: "LOAN AGAINST BANK DEPOSITS",
  16: "FLEET CARD",
  17: "COMMERCIAL VEHICLE LOAN",
  18: "TELCO - WIRELESS",
  19: "TELCO - BROADBAND",
  20: "TELCO - LANDLINE",
  24: "BUSINESS LOAN - GENERAL",
  31: "SECURED CREDIT CARD",
  32: "USED CAR LOAN",
  33: "CONSTRUCTION EQUIPMENT LOAN",
  34: "TRACTOR LOAN",
  35: "CORPORATE CREDIT CARD",
  36: "KISAN CREDIT CARD",
  37: "LOAN ON CREDIT CARD",
  39: "MUDRA LOANS",
};

// Some bureau fields arrive as objects ({ value: ".." } etc.) which used to
// print as [OBJECT OBJECT]. This always returns a plain value.
const unwrap = (value) => {
  if (value === null || value === undefined) return value;

  if (Array.isArray(value)) return value.length ? unwrap(value[0]) : null;

  if (typeof value === "object") {
    for (const key of ["value", "Value", "_", "$", "#text", "text", "Text"]) {
      if (key in value) return unwrap(value[key]);
    }

    const first = Object.values(value).find(
      (item) => item !== null && item !== undefined && typeof item !== "object",
    );

    return first === undefined ? null : first;
  }

  return value;
};

// "03" -> map[3]; unknown codes / plain text are returned unchanged.
const mapCode = (value, map) => {
  const raw = unwrap(value);

  if (raw === null || raw === undefined || raw === "") return null;

  const text = String(raw).trim();
  const key = /^\d+$/.test(text) ? String(Number(text)) : text;

  return map[key] ?? text;
};

// 2026-07-28T11:16:51.359+05:30 -> 28/07/2026 (11:16:51)  (TransUnion style)
const formatReportDateTime = (value) => {
  const raw = unwrap(value);

  if (raw === null || raw === undefined || raw === "") return null;

  const text = String(raw).trim();

  const match = text.match(
    /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2}))?/,
  );

  if (match) {
    return `${match[3]}/${match[2]}/${match[1]} (${match[4]}:${match[5]}:${match[6] || "00"})`;
  }

  return formatDMY(text);
};

// Keeps real scoring factors only: removes "explain:" / "factor:" prefixes,
// "No Valid Factors", "We're sorry..." filler and long advisory paragraphs.
const cleanFactors = (factors) => {
  const list = Array.isArray(factors) ? factors : [];
  const seen = new Set();
  const result = [];

  for (const entry of list) {
    const picked =
      entry !== null && typeof entry === "object" && !Array.isArray(entry)
        ? (entry.factor ??
          entry.Factor ??
          entry.title ??
          entry.name ??
          entry.description ??
          entry.Description)
        : entry;

    const raw = unwrap(picked);

    if (raw === null || raw === undefined) continue;

    const text = String(raw)
      .replace(/^\s*(explain|factor)\s*:\s*/i, "")
      .trim();

    if (!text || text.length > 120) continue;
    if (/^no valid factors?/i.test(text) || /^we.?re sorry/i.test(text)) {
      continue;
    }
    if (seen.has(text.toLowerCase())) continue;

    seen.add(text.toLowerCase());
    result.push(text);
  }

  return result;
};

const TU_CIBIL_LOGO =
  "data:image/png;base64,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";

const DEFAULT_DISCLAIMER =
  "All information contained in this credit report has been collated by TransUnion CIBIL Limited (TU CIBIL) based on information provided/ submitted by its various members (“Members”), as part of periodic data submission and Members are required to ensure accuracy, completeness and veracity of the information submitted. The credit report is generated using the proprietary search and match logic of TU CIBIL. TU CIBIL uses its best efforts to ensure accuracy, completeness and veracity of the information contained in the Report, and shall only be liable and / or responsible if any discrepancies are directly attributable to TU CIBIL. The use of this report is governed by the terms and conditions of the Operating Rules for TU CIBIL and its Members.";

const DEFAULT_GLOSSARY = [
  ["Report name", "-", ["Consumer CIR"]],
  ["Consumer Details", "e", ["Enriched through Enquiry"]],
  [
    "Identification(s)",
    "ID Types",
    [
      "Income Tax ID Number (PAN)",
      "Passport Number",
      "Voter ID",
      "Driver's License Number",
      "Ration Card Number",
      "Universal ID Number (UID)",
    ],
  ],
  [
    "Telephone(s) :",
    "Telephone Types",
    [
      "Latest 4 Telephone details reported.",
      "Mobile phone",
      "Home Phone",
      "Office phone",
      "Not Classified",
    ],
  ],
  ["Email Contact(s) :", "-", ["Latest 4 emails reported."]],
  [
    "Employment Information(s) :",
    "Occupation Codes",
    [
      "Latest Employment detail reported.",
      "Salaried",
      "Self Employed Professionals",
      "Self Employed",
      "Others",
    ],
  ],
  [
    "Address(es) :",
    "Address Category",
    [
      "Latest 4 address reported.",
      "Permanent Address",
      "Residence Address",
      "Office Address",
      "Not categorized",
    ],
  ],
  [
    "Consumer Account Details:",
    "Account Information",
    [
      "Active: Account not closed",
      "Inactive: Closed account",
      "Date Opened: Date of first disbursement",
      "Date Closed: Date of account closure",
      "Date reported & Certified: Most recent date reported by reporting member",
      "Last Payment Date: Most recent date a payment was made on the account.",
    ],
  ],
  [
    "Consumer Account Details:",
    "Day Past Due/Asset Classification",
    [
      "Start date: Beginning of the payment history",
      "End Date: End of the payment history",
      "000: Payment is made on the due date",
      "001-900: Payment is missed by number of days from the due date",
      "STD: Payments being made within 90 days",
      "SMA: Special account created for reporting Standard Accounts moving toward Sub-Standard",
      "SUB: Payments being made after 90 days",
      "DBT : The account has remained Sub-Standard for 12 months",
      "LSS : The account where loss has been identified and remains uncollectable",
      "XXX : Data not reported by Institution",
    ],
  ],
  [
    "Consumer Account Details:",
    "Information under dispute",
    [
      "Consumer has raised grievance request regarding issue in correctness of the data reported by Financial Institution",
    ],
  ],
  ["Enquiry Details :", "Not Disclosed", ["Enquiry made with other Members"]],
];

const MONTHS = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

const rptText = (value, fallback = "N/A") => {
  const plain = unwrap(value);

  return plain === null || plain === undefined || plain === ""
    ? fallback
    : String(plain);
};

const frCols = (...widths) =>
  widths.map((width) => `minmax(0,${width}fr)`).join(" ");

/* ---------------------------------------------------------------------
   VALUE HELPERS
   The backend (cibilService.extractCibilReport) returns a flat report:
   { score, creditSummary, accounts[], inquiries[] }
   These helpers convert those raw values into the formats used in the
   TransUnion PDF (₹ 10,17,528 / DD/MM/YYYY / year-month payment grid).
   --------------------------------------------------------------------- */

const isBlank = (value) =>
  value === null || value === undefined || value === "";

const pad2 = (n) => String(n).padStart(2, "0");

const toNumber = (value) => {
  if (isBlank(value)) return null;
  if (typeof value === "number") return Number.isFinite(value) ? value : null;

  const cleaned = String(value).replace(/[₹,\s]/g, "");

  if (!/^-?\d+(\.\d+)?$/.test(cleaned)) return null;

  return Number(cleaned);
};

// ₹ 10,17,528 (spaced) or ₹0 (compact). Non-numeric text is returned as is.
const inr = (rawValue, spaced = true) => {
  const value = unwrap(rawValue);

  if (isBlank(value)) return null;

  const number = toNumber(value);

  if (number === null) return String(value);

  return `₹${spaced ? " " : ""}${number.toLocaleString("en-IN")}`;
};

const upper = (rawValue) => {
  const value = unwrap(rawValue);

  return isBlank(value) ? null : String(value).toUpperCase();
};

const makeDate = (year, month, day) => {
  const date = new Date(year, month - 1, day);

  return date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
    ? date
    : null;
};

const parseReportDate = (value) => {
  if (isBlank(value)) return null;

  const text = String(value).trim();

  let match = text.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (match) {
    return makeDate(Number(match[1]), Number(match[2]), Number(match[3]));
  }

  match = text.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})/);
  if (match) {
    return makeDate(Number(match[3]), Number(match[2]), Number(match[1]));
  }

  match = text.match(/^(\d{4})-(\d{1,2})$/);
  if (match) return makeDate(Number(match[1]), Number(match[2]), 1);

  match = text.match(/^(\d{1,2})[/-](\d{4})$/);
  if (match) return makeDate(Number(match[2]), Number(match[1]), 1);

  return null;
};

const formatDate = (date) =>
  date
    ? `${pad2(date.getDate())}/${pad2(date.getMonth() + 1)}/${date.getFullYear()}`
    : null;

// Full dates become DD/MM/YYYY like the PDF; anything else is shown as received.
const formatDMY = (rawValue) => {
  const value = unwrap(rawValue);

  if (isBlank(value)) return null;

  const text = String(value).trim();

  const isFullDate =
    /^\d{4}-\d{1,2}-\d{1,2}/.test(text) ||
    /^\d{1,2}[/-]\d{1,2}[/-]\d{4}/.test(text);

  if (isFullDate) {
    const date = parseReportDate(text);
    if (date) return formatDate(date);
  }

  return text;
};

// "000" -> "0", "030" -> "30", "std" -> "STD", "" -> "-"
const normalizePayStatus = (status) => {
  if (isBlank(status)) return "-";

  const text = String(status).trim();

  return /^\d+$/.test(text) ? String(Number(text)) : text.toUpperCase();
};

// [{ date, status }] -> { 2026: { JAN: "0", FEB: "0" }, 2025: { ... } }
const buildYearMap = (payments) => {
  if (!Array.isArray(payments) || payments.length === 0) return null;

  const years = {};

  for (const payment of payments) {
    const date = parseReportDate(payment?.date);

    if (!date) return null;

    const year = date.getFullYear();

    years[year] = years[year] || {};
    years[year][MONTHS[date.getMonth()]] = normalizePayStatus(payment?.status);
  }

  return years;
};

function RptH1({ children, className = "" }) {
  return (
    <div
      data-pdf-keep
      role="heading"
      aria-level={2}
      className={`text-[17px] font-bold uppercase leading-tight text-[#1f2937] ${className}`}
    >
      {children}
    </div>
  );
}

function RptH2({ children, className = "" }) {
  return (
    <div
      data-pdf-keep
      role="heading"
      aria-level={3}
      className={`text-[13px] font-bold uppercase leading-tight text-[#1f2937] ${className}`}
    >
      {children}
    </div>
  );
}

function RptH3({ children, className = "" }) {
  return (
    <div
      data-pdf-keep
      role="heading"
      aria-level={4}
      className={`text-[10.5px] font-bold uppercase leading-tight text-[#1f2937] ${className}`}
    >
      {children}
    </div>
  );
}

function RptBox({ children, className = "" }) {
  return (
    <div
      className={`overflow-hidden rounded-[3px] border border-[#9ca3af] bg-white ${className}`}
    >
      {children}
    </div>
  );
}

function RptField({ label, value, labelClass = "w-[128px]" }) {
  return (
    <div className="flex items-start py-[3px] text-[10px] leading-[1.3]">
      <span className={`shrink-0 text-[#00a1de] ${labelClass}`}>{label}</span>
      <span className="mr-[10px] shrink-0 text-black">:</span>
      <span className="min-w-0 break-words text-black">{value}</span>
    </div>
  );
}

function RptTable({
  headers,
  template,
  rows,
  minWidth = 640,
  stripe = "odd",
  stripeClass = "bg-[#f7f8fa]",
  headClass = "text-[#00a1de]",
  headBorderClass = "",
  rowPad = "py-[8px]",
  align = "items-center",
  textClass = "text-[9.5px]",
}) {
  return (
    <div
      style={{
        width: "100%",
        minWidth: 0,
      }}
    >
      <div
        className={`grid gap-x-3 px-[12px] py-[8px] leading-[1.25] ${textClass} ${headClass} ${headBorderClass}`}
        style={{ gridTemplateColumns: template }}
      >
        {headers.map((header, index) => (
          <div key={index} className="break-words">
            {header}
          </div>
        ))}
      </div>

      {rows.map((row, rowIndex) => {
        const shaded =
          stripe === "odd" ? rowIndex % 2 === 0 : rowIndex % 2 === 1;

        return (
          <div
            key={rowIndex}
            className={`grid gap-x-3 px-[12px] leading-[1.25] text-black ${rowPad} ${align} ${textClass} ${
              shaded ? stripeClass : "bg-white"
            }`}
            style={{ gridTemplateColumns: template }}
          >
            {row.map((cell, cellIndex) => (
              <div key={cellIndex} className="min-w-0 break-words">
                {cell}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

function ScoreGauge({ score }) {
  const value = Number(score);
  const valid = Number.isFinite(value);
  const fraction = valid ? Math.min(1, Math.max(0, (value - 300) / 600)) : 0;

  const cx = 75;
  const cy = 76;
  const r = 58;
  const strokeWidth = 17;

  const pointAt = (f, radius = r) => {
    const angle = Math.PI * (1 - f);
    return [cx + radius * Math.cos(angle), cy - radius * Math.sin(angle)];
  };

  const [startX, startY] = pointAt(0);
  const [endX, endY] = pointAt(1);
  const [scoreX, scoreY] = pointAt(fraction);
  const [markerX, markerY] = pointAt(fraction, r - strokeWidth / 2 - 10);
  const markerRotation = 180 * fraction - 90;

  return (
    <svg
      viewBox="0 0 150 100"
      className="h-auto w-[170px]"
      role="img"
      aria-label={`CIBIL score ${score}`}
    >
      <path
        d={`M ${startX} ${startY} A ${r} ${r} 0 0 1 ${endX} ${endY}`}
        fill="none"
        stroke="#e5e7eb"
        strokeWidth={strokeWidth}
      />

      {valid && fraction > 0 && (
        <path
          d={`M ${startX} ${startY} A ${r} ${r} 0 0 1 ${scoreX} ${scoreY}`}
          fill="none"
          stroke="#00a1de"
          strokeWidth={strokeWidth}
        />
      )}

      {valid && (
        <polygon
          points="-6,-5 6,-5 0,6"
          fill="#000"
          transform={`translate(${markerX} ${markerY}) rotate(${markerRotation})`}
        />
      )}

      <text
        x={cx}
        y={cy - 16}
        textAnchor="middle"
        fontSize="36"
        fontWeight="700"
        fill="#000"
        fontFamily={RPT_FONT}
      >
        {score}
      </text>

      <text
        x={startX}
        y={cy + 18}
        textAnchor="middle"
        fontSize="11"
        fontWeight="700"
        fill="#9ca3af"
        fontFamily={RPT_FONT}
      >
        300
      </text>

      <text
        x={endX}
        y={cy + 18}
        textAnchor="middle"
        fontSize="11"
        fontWeight="700"
        fill="#9ca3af"
        fontFamily={RPT_FONT}
      >
        900
      </text>
    </svg>
  );
}

function StatusRibbon({ inactive }) {
  return (
    <svg
      className="pointer-events-none absolute right-0 top-0"
      width="46"
      height="46"
      viewBox="0 0 46 46"
      aria-hidden="true"
    >
      <polygon
        points="0,0 46,0 46,46"
        fill={inactive ? "#6b7280" : "#00a651"}
      />

      {inactive ? (
        <path
          d="M30 6 L41 17 M41 6 L30 17"
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
      ) : (
        <path
          d="M27 13 L32 18 L42 7"
          stroke="#fff"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      )}
    </svg>
  );
}

function AccountCard({ account, index }) {
  const rawStatus = String(
    account?.["ACCOUNT INFORMATION"]?.["ACTIVE/INACTIVE"] ||
      account?.accountStatus ||
      "",
  ).toUpperCase();

  const dateOpened =
    formatDMY(
      account?.["ACCOUNT INFORMATION"]?.["DATE OPENED"] || account?.dateOpened,
    ) || "";

  const dateClosed =
    formatDMY(
      account?.["ACCOUNT INFORMATION"]?.["DATE CLOSED"] || account?.dateClosed,
    ) || "";

  const dateReported =
    formatDMY(
      account?.["ACCOUNT INFORMATION"]?.["DATE REPORTED & CERTIFIED"] ||
        account?.dateReported,
    ) || "";

  // Backend sends "Open" / "Closed"; the PDF shows ACTIVE / INACTIVE.
  let statusText = "";

  if (/INACTIVE|CLOSED/.test(rawStatus)) statusText = "INACTIVE";
  else if (dateClosed) statusText = "INACTIVE";
  else statusText = "ACTIVE";

  const isInactive = statusText === "INACTIVE";

  const accountRows = [
    [
      "TYPE",
      upper(
        account?.ACCOUNT?.TYPE ||
          account?.["ACCOUNT"]?.TYPE ||
          account?.accountType,
      ),
    ],
    [
      "MEMBER NAME",
      upper(account?.ACCOUNT?.["MEMBER NAME"] || account?.creditorName),
    ],
    [
      "ACCOUNT NUMBER",
      account?.ACCOUNT?.["ACCOUNT NUMBER"] || account?.accountNumber,
    ],
    [
      "OWNERSHIP",
      upper(
        mapCode(
          account?.ACCOUNT?.OWNERSHIP ||
            account?.ownership ||
            account?.accountDesignator,
          OWNERSHIP_MAP,
        ),
      ),
    ],
  ];

  const amountsLeft = [
    [
      "SANCTIONED AMOUNT",
      inr(
        account?.AMOUNTS?.["SANCTIONED AMOUNT"] ??
          account?.sanctionedAmount ??
          account?.highBalance,
      ),
    ],
    [
      "CURRENT BALANCE",
      inr(account?.AMOUNTS?.["CURRENT BALANCE"] ?? account?.currentBalance),
    ],
  ];

  const amountsRight = [
    [
      "PAYMENT FREQUENCY",
      upper(
        mapCode(
          account?.AMOUNTS?.["PAYMENT FREQUENCY"] ?? account?.paymentFrequency,
          PAYMENT_FREQUENCY_MAP,
        ),
      ),
    ],
    [
      "REPAYMENT TENURE",
      account?.AMOUNTS?.["REPAYMENT TENURE"] ?? account?.loanTermMonths,
    ],
    ["EMI", inr(account?.AMOUNTS?.EMI ?? account?.emiAmount)],
  ];

  // The backend has no "suit filed / wilful default" field, so this only
  // shows a value when the report supplies one.
  const suitFiled = account?.STATUS?.["SUIT FILED / WILFUL DEFAULT"];

  const statusRows = [
    [
      "SETTLEMENT AMOUNT",
      inr(
        account?.STATUS?.["SETTLEMENT AMOUNT"] ?? account?.settlementAmount,
        false,
      ),
    ],
    [
      "WRITTEN OFF TOTAL AMOUNT",
      inr(
        account?.STATUS?.["WRITTEN OFF TOTAL AMOUNT"] ??
          account?.writtenOffAmount,
        false,
      ),
    ],
    [
      "WRITTEN OFF PRINCIPAL",
      inr(
        account?.STATUS?.["WRITTEN OFF PRINCIPAL"] ??
          account?.writtenOffPrincipal,
        false,
      ),
    ],
  ];

  const dpd = account?.["DAYS PAST DUE/ASSET CLASSIFICATION"];

  // Payment history: PDF-style YEAR map, or build it from the backend's
  // paymentHistory.monthlyPayments [{ date, status }] list.
  const legacyYears = account?.["PAYMENT HISTORY"]?.YEAR;
  const yearData =
    legacyYears || buildYearMap(account?.paymentHistory?.monthlyPayments);

  const flatPayments =
    !yearData && Array.isArray(account?.paymentHistory?.monthlyPayments)
      ? account.paymentHistory.monthlyPayments
      : [];

  const yearRows = yearData
    ? Object.entries(yearData).sort(([a], [b]) => Number(b) - Number(a))
    : [];

  const Sep = () => <span className="text-[#dbdee3]">|</span>;

  return (
    <div className="mb-4">
      <RptH3 className="mb-3">{index + 1}. ACCOUNT</RptH3>

      <div className="relative overflow-hidden rounded-[3px] border border-[#9ca3af] bg-white text-[9.5px] leading-[1.25] text-black">
        {/* ACCOUNT INFORMATION BAR */}
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-[14px] text-[9px]">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="mr-1 text-[#111827]">ACCOUNT INFORMATION</span>

            <span>
              <span className="text-[#00a1de]">DATE OPENED :</span> {dateOpened}
            </span>

            <Sep />

            <span>
              <span className="text-[#00a1de]">DATE CLOSED :</span> {dateClosed}
            </span>

            <Sep />

            <span>
              <span className="text-[#00a1de]">
                DATE REPORTED &amp; CERTIFIED :
              </span>{" "}
              {dateReported}
            </span>
          </div>

          <span className="mr-[34px] text-[#111827]">{statusText}</span>
        </div>

        {statusText && <StatusRibbon inactive={isInactive} />}

        {/* ACCOUNT */}
        <div className="border-t border-[#d1d5db] px-3 py-2">
          <div data-pdf-keep className="mb-3 text-[#00a1de]">
            ACCOUNT
          </div>

          <div className="space-y-[10px]">
            {accountRows.map(([label, value]) => (
              <div
                key={label}
                className="grid grid-cols-[42%_1fr] sm:grid-cols-[34%_1fr]"
              >
                <span className="text-[#00a1de]">{label}</span>
                <span className="break-words">: {rptText(value, "-")}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AMOUNTS */}
        <div className="border-t border-[#d1d5db] px-3 py-2">
          <div data-pdf-keep className="mb-3 text-[#00a1de]">
            AMOUNTS
          </div>

          <div className="grid grid-cols-1 gap-y-3 sm:grid-cols-2 sm:gap-x-4">
            <div className="space-y-3">
              {amountsLeft.map(([label, value]) => (
                <div
                  key={label}
                  className="grid grid-cols-[82px_1fr] items-start"
                >
                  <span className="text-[#00a1de]">{label}</span>
                  <span className="break-words">: {rptText(value, "-")}</span>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              {amountsRight.map(([label, value]) => (
                <div
                  key={label}
                  className="grid grid-cols-[82px_1fr] items-start"
                >
                  <span className="text-[#00a1de]">{label}</span>
                  <span className="break-words">: {rptText(value, "-")}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* STATUS */}
        <div className="border-t border-[#d1d5db] px-3 py-2">
          <div data-pdf-keep className="mb-3 text-[#00a1de]">
            STATUS
          </div>

          <div className="space-y-[9px]">
            <div>
              <span className="text-[#00a1de]">
                SUIT FILED / WILFUL DEFAULT :
              </span>{" "}
              {rptText(suitFiled, "-")}
            </div>

            {statusRows.map(([label, value]) => (
              <div
                key={label}
                className="grid grid-cols-[60%_1fr] sm:grid-cols-[50%_1fr]"
              >
                <span className="text-[#00a1de]">{label}</span>
                <span className="break-words">
                  : {rptText(value, STATUS_AMOUNT_FALLBACK)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* DAYS PAST DUE / ASSET CLASSIFICATION */}
        <div className="flex flex-col gap-2 border-t border-[#d1d5db] px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-[#111827]">
            DAYS PAST DUE/ASSET CLASSIFICATION
          </span>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>
              <span className="text-[#00a1de]">START DATE :</span>{" "}
              {rptText(
                formatDMY(
                  dpd?.["START DATE"] || account?.paymentHistory?.startDate,
                ),
              )}
            </span>

            <Sep />

            <span>
              <span className="text-[#00a1de]">END DATE :</span>{" "}
              {rptText(
                formatDMY(
                  dpd?.["END DATE"] || account?.paymentHistory?.endDate,
                ),
              )}
            </span>

            <Sep />

            <span>
              <span className="text-[#00a1de]">LAST PAYMENT :</span>{" "}
              {rptText(
                formatDMY(dpd?.["LAST PAYMENT"] || account?.lastPaymentDate),
              )}
            </span>
          </div>
        </div>

        {/* PAYMENT HISTORY */}
        {yearData ? (
          <div className="overflow-hidden">
            <div className="w-full">
              <div
                className="grid px-3 py-2 text-[#00a1de]"
                style={{
                  gridTemplateColumns:
                    "minmax(40px,0.9fr) repeat(12,minmax(0,1fr))",
                }}
              >
                <div>YEAR</div>

                {MONTHS.map((month) => (
                  <div key={month} className="text-center">
                    {month}
                  </div>
                ))}
              </div>

              {yearRows.map(([year, months], rowIndex) => (
                <div
                  key={year}
                  className={`grid items-center px-3 py-[7px] ${
                    rowIndex % 2 === 0 ? "bg-[#f7f8fa]" : "bg-white"
                  }`}
                  style={{
                    gridTemplateColumns:
                      "minmax(40px,0.9fr) repeat(12,minmax(0,1fr))",
                  }}
                >
                  <div className="text-[#00a1de]">{year}</div>

                  {MONTHS.map((month) => (
                    <div key={month} className="text-center">
                      {months?.[month] ?? "-"}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ) : flatPayments.length > 0 ? (
          <div className="overflow-hidden border-t border-[#d1d5db]">
            <RptTable
              headers={["PAYMENT DATE", "PAYMENT STATUS"]}
              template={frCols(1, 1)}
              minWidth={320}
              rows={flatPayments.map((payment) => [
                rptText(formatDMY(payment?.date), "-"),
                rptText(payment?.status, "-"),
              ])}
            />
          </div>
        ) : (
          <div className="border-t border-[#d1d5db] px-3 py-2">
            Payment history not available.
          </div>
        )}
      </div>
    </div>
  );
}

function CibilReportModal({
  report,
  fallbackScore,
  consumer,
  onClose,
  onDownload,
}) {
  const cir = report?.["CONSUMER CIR"];
  const details = report?.["CONSUMER DETAILS"];
  const info = details?.["CONSUMER INFORMATION"];
  const legacyAccountSummary = report?.["CONSUMER ACCOUNT SUMMARY"];
  const legacyEnquirySummary = report?.["ENQUIRY SUMMARY"];

  const flatAccounts = Array.isArray(report?.accounts) ? report.accounts : [];
  const accounts =
    report?.["CONSUMER ACCOUNT DETAILS"] || report?.accounts || [];
  const inquiries = report?.inquiries || [];

  const score = report?.score?.cibilScore ?? fallbackScore ?? "N/A";
  const factors = cleanFactors(report?.score?.factors);

  /* ---------------------------------------------------------------
     CONSUMER DETAILS
     Prefer API-returned fields only. Never use extra/manual form values
     to fill identification, phone, email, address, or demographic fields.
  ---------------------------------------------------------------- */
  const consumerName =
    info?.["CONSUMER NAME"] || report?.consumerDetails?.name || null;

  const consumerDob =
    formatDMY(info?.["D.O.B"] || report?.consumerDetails?.dob) || null;

  const consumerPan = info?.PAN || report?.consumerDetails?.pan || null;

  const consumerPhone = info?.["TELEPHONE NO."] || null;
  const consumerGender = info?.GENDER || null;

  const keepFilled = ([, value]) => !isBlank(value);

  const firstReportedAddress =
    details?.["CONSUMER'S REPORTED ADDRESS(ES)"]?.[0]?.ADDRESS ||
    details?.["CONSUMER'S REPORTED ADDRESS(ES)"]?.[0]?.address ||
    null;

  const leftFields = [
    ["CONSUMER NAME", rptText(consumerName, "-")],
    ["DOB", rptText(consumerDob, "-")],
    ["TELEPHONE NO.", rptText(consumerPhone, "-")],
    [
      "EMAIL ID",
      rptText(info?.["EMAIL ID"] || report?.consumerDetails?.email, "N/A"),
    ],
    ["GENDER", rptText(consumerGender, "-")],
    ["ADDRESS", info?.ADDRESS || firstReportedAddress || "-"],
  ];

  const rightFields = [
    ["PAN", rptText(consumerPan, "-")],
    ["DRIVING LICENCE NO", rptText(info?.["DRIVING LICENCE NO"], "-")],
    ["VOTER ID", rptText(info?.["VOTER ID"], "-")],
    ["PASSPORT NO.", rptText(info?.["PASSPORT NO."], "-")],
    ["AADHAAR NUMBER (UID)", rptText(info?.["AADHAAR NUMBER (UID)"], "-")],
  ];

  /* ---------------------------------------------------------------
     HEADER / CIR
  ---------------------------------------------------------------- */
  const reportDateTime = formatReportDateTime(
    cir?.["REPORT DATE & TIME"] ?? report?.reportDateTime,
  );
  const controlNumber = cir?.["CONTROL NUMBER"];
  const memberId = cir?.["MEMBER ID"];
  const referenceKey =
    cir?.["REFERENCE KEY"] || cir?.["REFERENCE NUMBER/REFERENCE KEY"];

  // TransUnion always prints the CIR box (MEMBER ID shows N/A when missing).
  const showCir = true;

  /* ---------------------------------------------------------------
     CONSUMER ACCOUNT SUMMARY (derived from the accounts list)
  ---------------------------------------------------------------- */
  const derivedSummary = (() => {
    if (legacyAccountSummary || flatAccounts.length === 0) return null;

    const sumOf = (key) => {
      const numbers = flatAccounts
        .map((account) => toNumber(account?.[key]))
        .filter((number) => number !== null);

      return numbers.length
        ? numbers.reduce((total, number) => total + number, 0)
        : null;
    };

    const openedDates = flatAccounts
      .map((account) => parseReportDate(account?.dateOpened))
      .filter(Boolean)
      .sort((a, b) => a - b);

    const balances = flatAccounts.map((account) =>
      toNumber(account?.currentBalance),
    );

    return {
      total: flatAccounts.length,
      zeroBalance: balances.some((balance) => balance === 0)
        ? balances.filter((balance) => balance === 0).length
        : null,
      overdue: flatAccounts.filter(
        (account) => (toNumber(account?.amountPastDue) ?? 0) > 0,
      ).length,
      highAmount: inr(sumOf("highBalance")),
      currentBalance: inr(sumOf("currentBalance")),
      overdueAmount: inr(sumOf("amountPastDue")),
      recent: formatDate(openedDates[openedDates.length - 1]),
      oldest: formatDate(openedDates[0]),
    };
  })();

  const showAccountSummary = !!legacyAccountSummary || !!derivedSummary;

  const summaryValues = {
    total:
      report?.creditSummary?.totalAccounts ??
      legacyAccountSummary?.ACCOUNTS?.Total ??
      derivedSummary?.total ??
      "N/A",
    zeroBalance:
      legacyAccountSummary?.ACCOUNTS?.["Zero balance"] ??
      derivedSummary?.zeroBalance ??
      "N/A",
    overdue:
      legacyAccountSummary?.ACCOUNTS?.Overdue ??
      derivedSummary?.overdue ??
      "N/A",
    highAmount:
      legacyAccountSummary?.BALANCES?.["High Cr/Sanc. Amt"] ??
      derivedSummary?.highAmount ??
      "N/A",
    currentBalance:
      legacyAccountSummary?.BALANCES?.Current ??
      derivedSummary?.currentBalance ??
      "N/A",
    overdueAmount:
      legacyAccountSummary?.BALANCES?.Overdue ??
      derivedSummary?.overdueAmount ??
      "N/A",
    recent:
      legacyAccountSummary?.["ACCOUNT OPENED DATE"]?.Recent ??
      derivedSummary?.recent ??
      "N/A",
    oldest:
      legacyAccountSummary?.["ACCOUNT OPENED DATE"]?.Oldest ??
      derivedSummary?.oldest ??
      "N/A",
  };

  /* ---------------------------------------------------------------
     ENQUIRY SUMMARY (derived from the enquiries list)
  ---------------------------------------------------------------- */
  const derivedEnquiry = (() => {
    if (legacyEnquirySummary || !Array.isArray(report?.inquiries)) return null;

    const now = new Date();

    const dates = report.inquiries.map((inquiry) =>
      parseReportDate(inquiry?.inquiryDate),
    );

    const allParsed = dates.every(Boolean);

    const withinMonths = (months) => {
      if (!allParsed) return "N/A";

      const limit = new Date(
        now.getFullYear(),
        now.getMonth() - months,
        now.getDate(),
      );

      return dates.filter((date) => date >= limit).length;
    };

    return {
      total: report.inquiries.length,
      mostRecent:
        allParsed && dates.length > 0
          ? formatDate(
              new Date(Math.max(...dates.map((date) => date.getTime()))),
            )
          : "N/A",
      past6: withinMonths(6),
      past12: withinMonths(12),
      past24: withinMonths(24),
    };
  })();

  const showEnquirySummary = !!legacyEnquirySummary || !!derivedEnquiry;

  const enquiryColumns = [
    [
      "TOTAL ENQUIRIES",
      legacyEnquirySummary?.["TOTAL ENQUIRIES"] ??
        derivedEnquiry?.total ??
        report?.inquiries?.length ??
        "N/A",
    ],
    [
      "MOST RECENT",
      legacyEnquirySummary?.["MOST RECENT"] ??
        derivedEnquiry?.mostRecent ??
        "N/A",
    ],
    ...(legacyEnquirySummary && "PAST 30 DAYS" in legacyEnquirySummary
      ? [["PAST 30 DAYS", legacyEnquirySummary["PAST 30 DAYS"] ?? "N/A"]]
      : []),
    [
      "PAST 6 MONTHS",
      legacyEnquirySummary?.["PAST 6 MONTHS"] ?? derivedEnquiry?.past6 ?? "N/A",
    ],
    [
      "PAST 12 MONTHS",
      legacyEnquirySummary?.["PAST 12 MONTHS"] ??
        derivedEnquiry?.past12 ??
        "N/A",
    ],
    [
      "PAST 24 MONTHS",
      legacyEnquirySummary?.["PAST 24 MONTHS"] ??
        derivedEnquiry?.past24 ??
        "N/A",
    ],
  ];

  /* ---------------------------------------------------------------
     CONSUMER DETAILS TABLES
  ---------------------------------------------------------------- */
  const legacyIds = details?.["IDENTIFICATION(S)"];
  const identificationFromReport =
    Array.isArray(legacyIds) && legacyIds.length > 0;

  const identificationRows = identificationFromReport
    ? legacyIds.map((item) => [
        rptText(item?.["ID TYPE"] || item?.["IDENTIFICATION TYPE"]),
        rptText(item?.["ID NUMBER"] || item?.["IDENTIFICATION NUMBER"]),
        rptText(formatDMY(item?.["ISSUE DATE"]), "-"),
        rptText(formatDMY(item?.["EXPIRATION DATE"]), "-"),
      ])
    : [];

  const legacyPhones = details?.["TELEPHONE(S)"];
  const telephoneFromReport =
    Array.isArray(legacyPhones) && legacyPhones.length > 0;

  const telephoneRows = telephoneFromReport
    ? legacyPhones.map((item) => [
        rptText(
          mapCode(item?.["TELEPHONE TYPE"] || item?.TYPE, PHONE_TYPE_MAP),
        ),
        rptText(item?.["TELEPHONE NUMBER"] || item?.NUMBER),
        rptText(item?.EXTENSION, "-"),
      ])
    : [];

  const emails =
    Array.isArray(details?.["EMAIL CONTACT(S)"]) &&
    details["EMAIL CONTACT(S)"].length > 0
      ? details["EMAIL CONTACT(S)"]
      : report?.consumerDetails?.email
        ? [{ "EMAIL ID": report?.consumerDetails?.email }]
        : [];

  const manualAddressRows = [];

  const reportedAddressRows = (
    Array.isArray(details?.["CONSUMER'S REPORTED ADDRESS(ES)"])
      ? details["CONSUMER'S REPORTED ADDRESS(ES)"]
      : []
  ).map((address) => [
    rptText(address?.ADDRESS || address?.address),
    rptText(
      mapCode(
        address?.CATEGORY || address?.["ADDRESS TYPE"] || address?.category,
        ADDRESS_CATEGORY_MAP,
      ),
    ),
    rptText(
      mapCode(
        address?.["RESIDENCE CODE"] || address?.residenceCode,
        RESIDENCE_CODE_MAP,
      ),
    ),
    rptText(formatDMY(address?.["DATE REPORTED"] || address?.dateReported)),
  ]);

  const addressRows =
    reportedAddressRows.length > 0 ? reportedAddressRows : manualAddressRows;

  const employmentRows = (
    Array.isArray(details?.["EMPLOYMENT INFORMATION"])
      ? details["EMPLOYMENT INFORMATION"]
      : []
  ).map((employment) => [
    <div key="type">
      {rptText(employment?.["ACCOUNT TYPE"])}
      <div className="mt-[3px] text-[9px]">
        {rptText(formatDMY(employment?.["DATE REPORTED"]))}
      </div>
    </div>,
    rptText(
      mapCode(
        employment?.["OCCUPATION TYPE"] || employment?.OCCUPATION,
        OCCUPATION_MAP,
      ),
    ),
    rptText(employment?.INCOME),
    rptText(employment?.["NET/GROSS INCOME INDICATOR"]),
    rptText(employment?.["MONTHLY/ANNUAL INCOME INDICATOR"]),
  ]);

  const enquiryRows = inquiries.map((inquiry) => [
    rptText(inquiry?.["MEMBER NAME"] || inquiry?.subscriberName),
    rptText(formatDMY(inquiry?.["ENQUIRY DATE"] || inquiry?.inquiryDate)),
    rptText(
      upper(
        mapCode(
          inquiry?.["ENQUIRY PURPOSE"] || inquiry?.inquiryType,
          ENQUIRY_PURPOSE_MAP,
        ),
      ),
    ),
    rptText(inr(inquiry?.["ENQUIRY AMOUNT"] || inquiry?.amount)),
  ]);

  const consumerInfoItems = [
    ["CONSUMER NAME :", consumerName],
    ["D.O.B :", consumerDob],
    ["GENDER :", consumerGender],
  ].filter(keepFilled);

  const showConsumerDetails =
    consumerInfoItems.length > 0 ||
    identificationRows.length > 0 ||
    telephoneRows.length > 0 ||
    emails.length > 0 ||
    addressRows.length > 0 ||
    employmentRows.length > 0;

  const glossaryEntries = Object.entries(report?.GLOSSARY || {});

  const glossaryRows =
    glossaryEntries.length > 0
      ? glossaryEntries.map(([section, value]) => [
          section,
          value?.["KEY TERM / CODE"] || value?.key || "-",
          value?.DESCRIPTION || value?.description || String(value || "-"),
        ])
      : DEFAULT_GLOSSARY;

  return (
    <div className="fixed inset-0 z-[10000] overflow-y-auto bg-[#e5e5e5] p-0">
      <div
        data-cibil-report-content
        className="mx-auto min-h-screen w-full max-w-[1122px] bg-white text-[10px] font-normal text-black shadow-none"
        style={{ fontFamily: RPT_FONT }}
      >
        <style>{REPORT_CSS}</style>

        <div
          data-cibil-report-padding
          className="tu-report px-4 pb-6 pt-6 sm:px-[64px] sm:pt-[36px]"
        >
          {/* =====================================================
              DOCUMENT HEADER
          ====================================================== */}
          <div className="flex items-end gap-6">
            <div className="min-h-[30px] min-w-0 flex-1 border-b-[4px] border-[#ffc20e] pb-[10px]">
              <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-[10px]">
                {!isBlank(reportDateTime) && (
                  <span>
                    <span className="text-[#00a1de]">
                      REPORT DATE &amp; TIME :
                    </span>{" "}
                    {String(reportDateTime)}
                  </span>
                )}

                {!isBlank(reportDateTime) && !isBlank(controlNumber) && (
                  <span className="hidden h-[18px] w-px bg-[#6b7280] sm:block" />
                )}

                {!isBlank(controlNumber) && (
                  <span>
                    <span className="text-[#00a1de]">CONTROL NUMBER :</span>{" "}
                    {String(controlNumber)}
                  </span>
                )}
              </div>
            </div>

            <img
              src={TU_CIBIL_LOGO}
              alt="TransUnion CIBIL"
              className="mb-[2px] h-auto w-[130px] shrink-0 sm:w-[190px]"
            />
          </div>

          {/* =====================================================
              CONSUMER CIR
          ====================================================== */}
          {showCir && (
            <section className="mt-[22px]">
              <RptH1 className="mb-4">CONSUMER CIR</RptH1>

              <RptBox>
                <div className="grid grid-cols-1 gap-y-1 px-[18px] py-[14px] text-[11px] sm:grid-cols-[58%_1fr]">
                  <RptField
                    label="MEMBER ID"
                    value={rptText(memberId)}
                    labelClass="w-[92px]"
                  />

                  <RptField
                    label="REFERENCE KEY"
                    value={rptText(referenceKey)}
                    labelClass="w-[112px]"
                  />
                </div>
              </RptBox>
            </section>
          )}

          {/* =====================================================
              CONSUMER INFORMATION
          ====================================================== */}
          {(leftFields.length > 0 || rightFields.length > 0) && (
            <section className="mt-[22px]">
              <RptH2 className="mb-3">CONSUMER INFORMATION</RptH2>

              <RptBox>
                <div className="grid grid-cols-1 gap-x-8 px-[18px] pb-[26px] pt-[16px] sm:grid-cols-2">
                  <div>
                    {leftFields.map(([label, value]) => (
                      <RptField
                        key={label}
                        label={label}
                        value={String(value)}
                      />
                    ))}
                  </div>

                  <div>
                    {rightFields.map(([label, value]) => (
                      <RptField
                        key={label}
                        label={label}
                        value={String(value)}
                      />
                    ))}
                  </div>
                </div>
              </RptBox>
            </section>
          )}

          {/* =====================================================
              CIBIL TRANSUNION SCORE(S)
          ====================================================== */}
          <section className="mt-[22px]">
            <RptH2 className="mb-3">CIBIL TRANSUNION SCORE(S)</RptH2>

            <RptBox>
              <div
                className={`grid grid-cols-1 items-center gap-6 px-5 py-6 ${
                  factors.length > 0 ? "sm:grid-cols-3" : "sm:grid-cols-2"
                }`}
              >
                <div>
                  <div className="text-[18px] leading-tight text-[#1f2937]">
                    CREDITVISION<sup className="text-[9px]">®</sup>
                  </div>

                  <div className="mt-2 text-[16px] leading-tight text-[#1f2937]">
                    Score
                  </div>

                  <div className="mt-3 text-[9.5px] leading-[1.5] text-[#00a1de]">
                    RANGES FROM:
                  </div>

                  <div className="text-[9.5px] leading-[1.5] text-[#00a1de]">
                    300 (high risk) to 900 (low risk)
                  </div>
                </div>

                <div className="mx-auto">
                  <ScoreGauge score={score} />
                </div>

                {factors.length > 0 && (
                  <div className="sm:pl-6">
                    <div className="mb-2 text-[10.5px] text-[#00a1de]">
                      SCORING FACTORS
                    </div>

                    <div className="space-y-[3px] text-[9.5px] leading-[1.4] text-[#1f2937]">
                      {factors.map((factor, index) => (
                        <div key={index}>
                          {index + 1}. {factor}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </RptBox>
          </section>

          {/* =====================================================
              CONSUMER ACCOUNT SUMMARY
          ====================================================== */}
          {showAccountSummary && (
            <section className="mt-[22px]">
              <RptH2 className="mb-3">CONSUMER ACCOUNT SUMMARY</RptH2>

              <RptBox>
                <div className="grid grid-cols-1 divide-x divide-[#d1d5db] text-[10.5px] sm:grid-cols-3">
                  {/* ACCOUNTS */}
                  <div className="px-5 py-4">
                    <div className="mb-3 text-[11px] text-[#1f2937]">
                      ACCOUNTS
                    </div>

                    <div className="space-y-[10px]">
                      <div className="grid grid-cols-[1fr_46px_44px]">
                        <span>Total</span>
                        <span>:</span>
                        <span>{summaryValues.total}</span>
                      </div>

                      <div className="grid grid-cols-[1fr_46px_44px]">
                        <span>Zero balance</span>
                        <span>:</span>
                        <span>{summaryValues.zeroBalance}</span>
                      </div>

                      <div className="grid grid-cols-[1fr_46px_44px]">
                        <span>Overdue</span>
                        <span>:</span>
                        <span>{summaryValues.overdue}</span>
                      </div>
                    </div>
                  </div>

                  {/* BALANCES */}
                  <div className="px-5 py-4">
                    <div className="mb-3 text-[11px] text-[#1f2937]">
                      BALANCES
                    </div>

                    <div className="space-y-[10px]">
                      <div className="grid grid-cols-[1fr_14px_auto]">
                        <span>High Cr/Sanc. Amt</span>
                        <span>:</span>
                        <span>{summaryValues.highAmount}</span>
                      </div>

                      <div className="grid grid-cols-[1fr_14px_auto]">
                        <span>Current</span>
                        <span>:</span>
                        <span>{summaryValues.currentBalance}</span>
                      </div>

                      <div className="grid grid-cols-[1fr_14px_auto]">
                        <span>Overdue</span>
                        <span>:</span>
                        <span>{summaryValues.overdueAmount}</span>
                      </div>
                    </div>
                  </div>

                  {/* ACCOUNT OPENED DATE */}
                  <div className="px-5 py-4">
                    <div className="mb-3 text-[11px] text-[#1f2937]">
                      ACCOUNT OPENED DATE
                    </div>

                    <div className="space-y-[10px]">
                      <div className="grid grid-cols-[1fr_14px_auto]">
                        <span>Recent</span>
                        <span>:</span>
                        <span>{summaryValues.recent}</span>
                      </div>

                      <div className="grid grid-cols-[1fr_14px_auto]">
                        <span>Oldest</span>
                        <span>:</span>
                        <span>{summaryValues.oldest}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </RptBox>
            </section>
          )}

          {/* =====================================================
              ENQUIRY SUMMARY
          ====================================================== */}
          {showEnquirySummary && (
            <section className="mt-[22px]">
              <RptH2 className="mb-3">ENQUIRY SUMMARY</RptH2>

              <RptBox>
                <RptTable
                  headers={enquiryColumns.map(([label]) => label)}
                  template={`repeat(${enquiryColumns.length},minmax(0,1fr))`}
                  rows={[enquiryColumns.map(([, value]) => value)]}
                  stripe="none"
                  headBorderClass="border-b border-[#d1d5db]"
                />
              </RptBox>
            </section>
          )}

          {/* =====================================================
              CONSUMER DETAILS
          ====================================================== */}
          {showConsumerDetails && (
            <section className="mt-[22px]">
              <RptH1 className="mb-5">CONSUMER DETAILS</RptH1>

              {/* CONSUMER INFORMATION */}
              <RptH3 className="mb-3">CONSUMER INFORMATION</RptH3>

              <RptBox className="mb-6">
                <div className="flex w-full flex-wrap items-center justify-between gap-x-6 gap-y-2 px-[18px] py-[16px] text-[10.5px]">
                  {consumerInfoItems.map(([label, value]) => (
                    <span key={label}>
                      <span className="text-[#00a1de]">{label}</span>{" "}
                      {String(value)}
                    </span>
                  ))}

                  <span>
                    <span className="text-[#00a1de]">
                      CREDITVISION<sup className="text-[7px]">®</sup> SCORE :
                    </span>{" "}
                    {rptText(score)}
                  </span>
                </div>
              </RptBox>

              {/* IDENTIFICATION(S) */}
              {identificationRows.length > 0 && (
                <>
                  <RptH3 className="mb-3">IDENTIFICATION(S)</RptH3>

                  <RptBox>
                    <RptTable
                      headers={[
                        "IDENTIFICATION TYPE",
                        "IDENTIFICATION NUMBER",
                        "ISSUE DATE",
                        "EXPIRATION DATE",
                      ]}
                      template={frCols(1, 1, 1, 1)}
                      rows={identificationRows}
                    />
                  </RptBox>

                  {identificationFromReport ? (
                    <div className="mb-6 mt-2 px-1 text-[9px] text-[#9ca3af]">
                      (e) - IDENTIFICATION REPORTED FROM ENQUIRY
                    </div>
                  ) : (
                    <div className="mb-6" />
                  )}
                </>
              )}

              {/* TELEPHONE(S) */}
              {telephoneRows.length > 0 && (
                <>
                  <RptH3 className="mb-3">TELEPHONE(S)</RptH3>

                  <RptBox>
                    <RptTable
                      headers={[
                        "TYPE",
                        "TELEPHONE NUMBER",
                        "TELEPHONE EXTENSION",
                      ]}
                      template={frCols(1, 1, 1)}
                      rows={telephoneRows}
                    />
                  </RptBox>

                  {telephoneFromReport ? (
                    <div className="mb-6 mt-2 px-1 text-[9px] text-[#9ca3af]">
                      (e) - TELEPHONE REPORTED FROM ENQUIRY
                    </div>
                  ) : (
                    <div className="mb-6" />
                  )}
                </>
              )}

              {/* EMAIL CONTACT(S) */}
              {emails.length > 0 && (
                <>
                  <RptH3 className="mb-3">EMAIL CONTACT(S)</RptH3>

                  <RptBox className="mb-6">
                    <div className="min-h-[26px] px-[14px] py-[6px] text-[10.5px]">
                      {emails.map((email, index) => (
                        <div key={index} className="py-[3px]">
                          {email?.["EMAIL ID"] ||
                            email?.EMAIL ||
                            email?.email ||
                            "N/A"}
                        </div>
                      ))}
                    </div>
                  </RptBox>
                </>
              )}

              {/* ADDRESS */}
              {addressRows.length > 0 && (
                <>
                  <RptH3 className="mb-3">
                    CONSUMER&apos;S REPORTED ADDRESS(ES)
                  </RptH3>

                  <RptBox>
                    <RptTable
                      headers={[
                        "ADDRESS",
                        "CATEGORY",
                        "RESIDENCE CODE",
                        "DATE REPORTED",
                      ]}
                      template={frCols(3.2, 1.3, 1, 1)}
                      minWidth={0}
                      stripe="even"
                      rowPad="py-[17px]"
                      rows={addressRows}
                    />
                  </RptBox>

                  <div className="mb-6 mt-2 px-1 text-[9px] text-[#9ca3af]">
                    (e) - ADDRESSES REPORTED FROM ENQUIRY
                  </div>
                </>
              )}

              {/* EMPLOYMENT */}
              {employmentRows.length > 0 && (
                <>
                  <RptH3 className="mb-3">EMPLOYMENT INFORMATION</RptH3>

                  <RptBox>
                    <RptTable
                      headers={[
                        <div key="type">
                          ACCOUNT TYPE
                          <div className="mt-[2px] text-[9px] font-normal text-[#6b7280]">
                            (Date Reported)
                          </div>
                        </div>,
                        "OCCUPATION TYPE",
                        "INCOME",
                        "NET/GROSS INCOME INDICATOR",
                        "MONTHLY/ANNUAL INCOME INDICATOR",
                      ]}
                      template={frCols(1.05, 1.25, 1, 1.2, 1.15)}
                      minWidth={0}
                      rowPad="py-[16px]"
                      rows={employmentRows}
                    />
                  </RptBox>
                </>
              )}
            </section>
          )}

          {/* =====================================================
              CONSUMER ACCOUNT DETAILS
          ====================================================== */}
          <section className="mt-[22px]">
            <RptH1 className="mb-5">CONSUMER ACCOUNT DETAILS</RptH1>

            {accounts.length === 0 ? (
              <RptBox>
                <div className="px-4 py-3 text-[10.5px]">
                  No loan or credit account information available
                </div>
              </RptBox>
            ) : (
              accounts.map((account, index) => (
                <AccountCard key={index} account={account} index={index} />
              ))
            )}
          </section>

          {/* =====================================================
              CONSUMER ENQUIRY DETAILS
          ====================================================== */}
          {enquiryRows.length > 0 && (
            <section className="mt-[22px]">
              <RptH1 className="mb-5">CONSUMER ENQUIRY DETAILS</RptH1>

              <RptH2 className="mb-3">ENQUIRIES</RptH2>

              <RptBox>
                <RptTable
                  headers={[
                    "MEMBER NAME",
                    "ENQUIRY DATE",
                    "ENQUIRY PURPOSE",
                    "ENQUIRY AMOUNT",
                  ]}
                  template={frCols(1, 1, 1, 1)}
                  headClass="text-[#008c95]"
                  stripeClass="bg-[#f3f3f3]"
                  rowPad="py-[15px]"
                  rows={enquiryRows}
                />
              </RptBox>
            </section>
          )}

          {/* =====================================================
              GLOSSARY
          ====================================================== */}
          <section className="mt-[24px]">
            <RptH1 className="mb-4">GLOSSARY</RptH1>

            <RptBox>
              <div className="w-full">
                <div className="border-b border-[#9ca3af] px-4 py-[14px] text-[13px] text-[#1f2937]">
                  CIR DATA GLOSSARY
                </div>

                <RptTable
                  headers={["REPORT SECTION", "KEY TERM / CODE", "DESCRIPTION"]}
                  template={frCols(1, 1.2, 1.8)}
                  minWidth={0}
                  stripe="even"
                  align="items-start"
                  rowPad="py-[16px]"
                  headClass="text-[#008c95]"
                  headBorderClass="border-b border-[#9ca3af]"
                  rows={glossaryRows.map(([section, key, description]) => [
                    section,
                    key,
                    Array.isArray(description) ? (
                      <div className="space-y-[5px] leading-[17px]">
                        {description.map((line, index) => (
                          <div key={index}>{line}</div>
                        ))}
                      </div>
                    ) : (
                      description
                    ),
                  ])}
                />
              </div>
            </RptBox>
          </section>

          {/* =====================================================
              END OF REPORT
          ====================================================== */}
          <div className="my-9 flex items-center gap-4">
            <div className="h-[3px] flex-1 bg-[#dcdee2]" />

            <span className="text-center text-[10.5px] text-[#008c95]">
              {consumerName
                ? `END OF REPORT ON ${String(consumerName).toUpperCase()}`
                : "END OF REPORT"}
            </span>

            <div className="h-[3px] flex-1 bg-[#dcdee2]" />
          </div>

          {/* =====================================================
              DISCLAIMER
          ====================================================== */}
          <section>
            <RptBox>
              <div className="px-4 py-4">
                <div className="mb-3 text-[10.5px] text-[#008c95]">
                  DISCLAIMER
                </div>

                <div className="tu-regular text-[8.5px] leading-[1.8] text-[#111827]">
                  {report?.DISCLAIMER || DEFAULT_DISCLAIMER}
                </div>
              </div>
            </RptBox>

            <div className="tu-regular mt-6 text-[8.5px] text-[#6b7280]">
              © 2023 TransUnion CIBIL Limited. (Formerly: Credit Information
              Bureau (India) Limited). All rights reserved.
            </div>

            <div className="tu-regular mt-2 text-[8.5px] text-black">
              TransUnion CIBIL CIN : U72300MH2000PLC128359
            </div>
          </section>
        </div>

        {/* ================================
            ACTION BUTTONS
        ================================= */}
        <div
          data-cibil-report-actions
          className="sticky bottom-0 flex flex-col gap-3 border-t border-[#d5d9dd] bg-white p-4 sm:flex-row sm:justify-end"
          style={{
            fontFamily:
              "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-lg border border-[#b8bec5] bg-white px-5 py-2.5 text-sm font-semibold text-[#333] hover:bg-[#f5f6f7] sm:w-auto"
          >
            Close Report
          </button>

          <button
            type="button"
            onClick={onDownload}
            className="w-full rounded-lg bg-[#00a1de] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0090c8] sm:w-auto"
          >
            Download CIBIL Report
          </button>
        </div>
      </div>
    </div>
  );
}

/* =====================================================================
   GET CIBIL SCORE – PAGE / COMPONENT
   ---------------------------------------------------------------------
   Same "Get Your CIBIL Score" form, same API call, same report modal and
   same PDF download as LoanForm.jsx.

   Optional props (all safe to omit):
     loanData     – used only as fallback score for the report
     setLoanData  – if passed, the fetched score is written to
                    loanData.cibilScore exactly like LoanForm does
   ===================================================================== */

export default function GetCibilScore({ loanData, setLoanData, onBack }) {
  const formData = loanData || {};
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    // Inline usage from BalanceTransferDetails: restore the same form
    // without navigating away or losing its component state.
    if (typeof onBack === "function") {
      onBack();
      return;
    }

    // Standalone route usage: return to the exact page that opened CIBIL.
    // This supports Loan Application Form, Tools, Balance Transfer, and
    // any other page that passes its pathname in navigation state.
    const returnTo = location.state?.from;

    if (returnTo) {
      // Return to the preserved Tools sub-view (Loan Application Form),
      // not the default Tools landing/cards screen.
      navigate(returnTo, { replace: true });
      return;
    }

    // If CIBIL was opened without navigation state, use browser history.
    navigate(-1);
  };

  const [showCibilForm, setShowCibilForm] = useState(true);
  const [cibilLoading, setCibilLoading] = useState(false);
  const [cibilError, setCibilError] = useState("");
  const [panError, setPanError] = useState("");
  const [panTouched, setPanTouched] = useState(false);

  const [cibilReport, setCibilReport] = useState(null);
  const [showCibilReport, setShowCibilReport] = useState(false);

  const [cibilScore, setCibilScore] = useState(() => {
    const saved = localStorage.getItem("dashboard_cibil_score");
    return saved ? Number(saved) : null;
  });

  const [cibilForm, setCibilForm] = useState({
    firstName: "",
    lastName: "",
    pan: "",
    phone: "",
    gender: "",
    dob: "",
  });

  const handleCibilChange = (e) => {
    const { name } = e.target;
    let { value } = e.target;

    if (name === "pan") {
      value = value
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "")
        .slice(0, 10);

      setPanTouched(true);
      setPanError(validatePAN(value));
    }

    setCibilForm((prev) => ({ ...prev, [name]: value }));
    setCibilError("");
  };

  const handleCibilSubmit = async (e) => {
    e.preventDefault();

    // Only the six required IDSPay inputs are collected and submitted.
    // All other report fields are populated from the bureau API response.
    const firstName = cibilForm.firstName.trim();
    const lastName = cibilForm.lastName.trim();
    const pan = cibilForm.pan.trim().toUpperCase();
    const phone = cibilForm.phone.trim().replace(/\s+/g, "");
    const dob = cibilForm.dob;
    const panValidationError = validatePAN(pan);

    if (panValidationError) {
      setPanError(panValidationError);
      return;
    }

    setPanError("");
    if (
      !firstName ||
      !lastName ||
      !pan ||
      !phone ||
      !cibilForm.gender ||
      !dob
    ) {
      setCibilError(
        "Please complete First Name, Last Name, PAN, Phone Number, Gender and Date of Birth.",
      );
      return;
    }
    setPanError("");

    const token =
      localStorage.getItem("access_token") ||
      localStorage.getItem("token") ||
      sessionStorage.getItem("access_token") ||
      sessionStorage.getItem("token");

    console.log("CIBIL auth token found:", !!token);

    if (!token) {
      setCibilError("Login session not found. Please login again.");
      return;
    }

    setCibilLoading(true);
    setCibilError("");

    try {
      const response = await fetch(`${API_BASE}/cibil/test-fetch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName,
          lastName,
          pan,
          phone,
          gender: cibilForm.gender,
          dob,
        }),
      });

      const data = await response.json();

      console.log("CIBIL Response:", data);

      if (!response.ok) {
        throw new Error(data?.message || "Unable to fetch CIBIL score.");
      }

      if (
        data.status !== "success" ||
        data.score === null ||
        data.score === undefined ||
        !Number.isFinite(Number(data.score))
      ) {
        throw new Error(data?.message || "CIBIL score could not be retrieved.");
      }

      const score = Number(data.score);

      const report = data.cibilReport?.report || data.cibilReport || null;

      setCibilReport(report);
      setCibilScore(score);

      // Convert bureau tradelines into the fields used by the loan prediction
      // API. Only open/active accounts are counted; closed accounts are ignored.
      const getAccountValue = (account, ...keys) => {
        for (const key of keys) {
          const value = account?.[key];
          if (value !== null && value !== undefined && value !== "")
            return value;
        }
        return "";
      };

      const hasReportAccounts =
        Array.isArray(report?.accounts) ||
        Array.isArray(data.cibilReport?.accounts);
      const reportAccounts = Array.isArray(report?.accounts)
        ? report.accounts
        : Array.isArray(data.cibilReport?.accounts)
          ? data.cibilReport.accounts
          : [];

      const activeAccounts = reportAccounts.filter((account) => {
        const status = String(
          getAccountValue(
            account,
            "accountStatus",
            "ACTIVE/INACTIVE",
            "status",
          ) ||
            account?.["ACCOUNT INFORMATION"]?.["ACTIVE/INACTIVE"] ||
            "",
        )
          .trim()
          .toUpperCase();
        const closedDate =
          getAccountValue(account, "dateClosed", "DATE CLOSED") ||
          account?.["ACCOUNT INFORMATION"]?.["DATE CLOSED"];

        if (/CLOSED|INACTIVE|^C$/.test(status)) return false;
        if (/OPEN|ACTIVE|^O$/.test(status)) return true;
        return !closedDate;
      });

      const bureauActiveLoanDetails = activeAccounts.map((account) => {
        const emi =
          getAccountValue(account, "emiAmount", "EMI") ||
          account?.AMOUNTS?.EMI ||
          "0";
        const outstandingAmount =
          getAccountValue(account, "currentBalance", "CURRENT BALANCE") ||
          account?.AMOUNTS?.["CURRENT BALANCE"] ||
          "0";
        const remainingTenureYears = getAccountValue(
          account,
          "remainingTenureYears",
          "tenureLeft",
        );
        const remainingTenureMonths = getAccountValue(
          account,
          "remainingTenureMonths",
          "remainingTenure",
        );

        return {
          emi: Number(emi) || 0,
          outstandingAmount: Number(outstandingAmount) || 0,
          // Do not mistake the original loan term for the remaining term.
          // Populate tenure only when the bureau explicitly supplies it.
          tenureLeft: Number(remainingTenureYears)
            ? Number(remainingTenureYears)
            : Number(remainingTenureMonths)
              ? Number((Number(remainingTenureMonths) / 12).toFixed(2))
              : 0,
        };
      });

      const updateLoanData = (previous = {}) => ({
        ...previous,
        cibilScore: score,
        ...(hasReportAccounts
          ? {
              activeLoans: activeAccounts.length,
              activeLoanDetails: bureauActiveLoanDetails,
            }
          : {}),
      });

      // Update React state when this component is rendered with the parent
      // setter, and also persist it because the CIBIL page may be a separate route.
      if (typeof setLoanData === "function") {
        setLoanData((prev) => updateLoanData(prev));
      }
      try {
        const savedLoanData = JSON.parse(
          localStorage.getItem("loanData") || "{}",
        );
        localStorage.setItem(
          "loanData",
          JSON.stringify(updateLoanData(savedLoanData)),
        );
      } catch (storageError) {
        console.warn(
          "Unable to save CIBIL loan details locally:",
          storageError,
        );
      }

      // Save application ID if returned by backend
      if (data.application_id) {
        localStorage.setItem("application_id", String(data.application_id));
      }

      // Persist the latest CIBIL result so Dashboard can use it
      localStorage.setItem("dashboard_cibil_score", String(score));
      localStorage.setItem("dashboard_cibil_label", String(data.label || ""));

      if (report) {
        localStorage.setItem("dashboard_cibil_report", JSON.stringify(report));
      }

      // Notify dashboard / other components immediately
      window.dispatchEvent(
        new CustomEvent("cibilScoreUpdated", {
          detail: {
            score,
            application_id: data.application_id || null,
            label: data.label || null,
            eligible: data.eligible ?? null,
            cibilReport: report,
          },
        }),
      );

      // Close CIBIL details popup
      setShowCibilForm(false);

      // Open complete CIBIL report
      if (report) {
        setShowCibilReport(true);
      }
    } catch (error) {
      console.error("CIBIL fetch error:", error);

      setCibilError(error.message || "Unable to fetch CIBIL score.");
    } finally {
      setCibilLoading(false);
    }
  };

  const handleDownloadCibilReport = async () => {
    if (!cibilReport) return;

    const reportElement = document.querySelector("[data-cibil-report-content]");

    if (!reportElement) return;

    try {
      /* -------------------------------------------------------------
         PDF SETTINGS
         captureWidth  : smaller = bigger letters in the PDF (A3 width).
                         820 matches the TransUnion text proportions.
         captureScale  : sharpness only.
         capturePaddingX : left/right page margin inside the PDF (px).
      -------------------------------------------------------------- */
      const captureWidth = 820;
      // Sharpness: 3 = ~210 dpi on A3 (crisp text). It is lowered
      // automatically for very long reports so the browser canvas limit
      // is never exceeded.
      const estimatedHeight =
        reportElement.scrollHeight *
        (Math.max(reportElement.offsetWidth, 1) / captureWidth);
      const MAX_CANVAS_AREA = 64000000;
      const MAX_CANVAS_SIDE = 30000;
      const captureScale = Math.max(
        1.5,
        Math.min(
          3,
          Math.sqrt(MAX_CANVAS_AREA / (captureWidth * estimatedHeight * 1.1)),
          MAX_CANVAS_SIDE / (estimatedHeight * 1.1),
        ),
      );
      const capturePaddingX = 40;

      // Every text line / image / gauge on the page. A page is never cut
      // through one of these, so nothing is split in half - but pages are
      // cut as late as possible, so there are no big empty gaps.
      let blockers = [];

      const canvas = await html2canvas(reportElement, {
        scale: captureScale,
        useCORS: true,
        allowTaint: false,
        backgroundColor: "#ffffff",
        logging: false,
        width: captureWidth,
        windowWidth: captureWidth,
        scrollX: 0,
        scrollY: 0,

        onclone: (clonedDocument) => {
          const clonedReport = clonedDocument.querySelector(
            "[data-cibil-report-content]",
          );

          if (!clonedReport) return;

          clonedReport.style.width = `${captureWidth}px`;
          clonedReport.style.maxWidth = `${captureWidth}px`;
          clonedReport.style.minWidth = "0";
          clonedReport.style.margin = "0 auto";
          clonedReport.style.background = "#ffffff";
          clonedReport.style.overflow = "visible";

          clonedReport.querySelectorAll("*").forEach((element) => {
            element.style.maxWidth = "none";
          });

          // Smaller side margins so more room is left for content
          const clonedPadding = clonedReport.querySelector(
            "[data-cibil-report-padding]",
          );

          if (clonedPadding) {
            clonedPadding.style.paddingLeft = `${capturePaddingX}px`;
            clonedPadding.style.paddingRight = `${capturePaddingX}px`;
          }

          const actionButtons = clonedReport.querySelector(
            "[data-cibil-report-actions]",
          );

          if (actionButtons) {
            actionButtons.style.display = "none";
          }

          const reportRect = clonedReport.getBoundingClientRect();

          const toBlocker = (rect, extraBottom = 0) => ({
            top: (rect.top - reportRect.top) * captureScale,
            bottom: (rect.bottom - reportRect.top + extraBottom) * captureScale,
          });

          const collected = [];

          // 1) every rendered line of text
          const walker = clonedDocument.createTreeWalker(clonedReport, 4);
          let textNode = walker.nextNode();

          while (textNode) {
            const parent = textNode.parentElement;

            if (
              textNode.nodeValue &&
              textNode.nodeValue.trim() &&
              parent &&
              !parent.closest("[data-cibil-report-actions]") &&
              parent.tagName !== "STYLE"
            ) {
              const range = clonedDocument.createRange();
              range.selectNodeContents(textNode);

              Array.from(range.getClientRects()).forEach((rect) => {
                if (rect.height > 0) collected.push(toBlocker(rect));
              });
            }

            textNode = walker.nextNode();
          }

          // 2) images / SVGs (logo, gauge, ribbons)
          clonedReport.querySelectorAll("svg, img").forEach((element) => {
            if (element.closest("[data-cibil-report-actions]")) return;

            const rect = element.getBoundingClientRect();

            if (rect.height > 0) collected.push(toBlocker(rect));
          });

          // 3) headings stay together with the content that follows them
          clonedReport
            .querySelectorAll("[data-pdf-keep]")
            .forEach((element) => {
              const rect = element.getBoundingClientRect();

              if (rect.height > 0) collected.push(toBlocker(rect, 70));
            });

          blockers = collected
            .filter(
              (item) =>
                Number.isFinite(item.top) &&
                Number.isFinite(item.bottom) &&
                item.bottom > item.top,
            )
            .sort((a, b) => a.top - b.top);
        },
      });

      // Finds the latest empty horizontal line (between two text lines) that
      // is at or above `target`, so each page is filled almost completely.
      const findSafeCut = (start, target) => {
        const minCut = start + (target - start) * 0.5;
        let y = target;
        let settled = false;

        for (let guard = 0; guard < 5000; guard++) {
          const hit = blockers.find((item) => item.top < y && item.bottom > y);

          if (!hit) {
            settled = true;
            break;
          }

          y = hit.top;

          if (y < minCut) return target;
        }

        if (!settled) return target;

        // put the cut in the middle of the empty gap
        let above = start;
        let below = Infinity;

        for (const item of blockers) {
          if (item.bottom <= y && item.bottom > above) above = item.bottom;
          if (item.top >= y && item.top < below) below = item.top;
        }

        if (Number.isFinite(below)) {
          y = Math.max((above + below) / 2, minCut);
        }

        return Math.floor(y);
      };

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a3",
        compress: true,
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();

      const pageCanvasHeight = Math.floor(canvas.width * (420 / 297));

      let sourceY = 0;
      let pageIndex = 0;

      while (sourceY < canvas.height) {
        const targetY = Math.min(sourceY + pageCanvasHeight, canvas.height);

        let pageEnd = targetY;

        if (targetY < canvas.height) {
          pageEnd = findSafeCut(sourceY, targetY);
        }

        if (pageEnd <= sourceY + 20) {
          pageEnd = targetY;
        }

        const currentHeight = Math.max(
          1,
          Math.min(Math.round(pageEnd - sourceY), canvas.height - sourceY),
        );

        const pageCanvas = document.createElement("canvas");

        pageCanvas.width = canvas.width;
        pageCanvas.height = Math.ceil(currentHeight);

        const pageContext = pageCanvas.getContext("2d");

        if (!pageContext) {
          throw new Error("Unable to create PDF canvas.");
        }

        pageContext.fillStyle = "#ffffff";

        pageContext.fillRect(0, 0, pageCanvas.width, pageCanvas.height);

        pageContext.drawImage(
          canvas,
          0,
          sourceY,
          canvas.width,
          currentHeight,
          0,
          0,
          canvas.width,
          currentHeight,
        );

        if (pageIndex > 0) {
          pdf.addPage();
        }

        const imageData = pageCanvas.toDataURL("image/png");

        const pagePdfHeight = (currentHeight / canvas.width) * pdfWidth;

        pdf.addImage(
          imageData,
          "PNG",
          0,
          0,
          pdfWidth,
          pagePdfHeight,
          undefined,
          "FAST",
        );

        sourceY += currentHeight;
        pageIndex++;
      }

      pdf.save("CIBIL-Credit-Report.pdf");
    } catch (error) {
      console.error("CIBIL report download error:", error);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-white/15 bg-[rgba(255,255,255,0.08)] px-3 sm:px-4 py-2.5 sm:py-3 text-[12px] sm:text-[16px] text-white outline-none transition placeholder:text-white/50 focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/30 [&>option]:text-slate-900";

  const labelClass =
    "mb-2 block text-sm sm:text-[16px] font-medium text-white/90";

  return (
    <div className="w-full pt-28 sm:pt-28 lg:pt-32">
      {/* Direct CIBIL form */}
      <div className="w-full">
        <div className="w-full rounded-2xl border border-white/20 bg-[#111827] p-5 sm:p-7 shadow-2xl">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-xl sm:text-2xl font-semibold text-white">
                Get Your CIBIL Score
              </h3>

              <p className="mt-1 text-sm text-white/60">
                Enter your details to retrieve your CIBIL score.
              </p>
            </div>
          </div>

          <form onSubmit={handleCibilSubmit} className="space-y-4">
            {/* Essential IDSPay consumer fields only */}
            <div>
              <label className={labelClass}>First Name</label>
              <input
                type="text"
                name="firstName"
                value={cibilForm.firstName}
                onChange={handleCibilChange}
                placeholder="Enter first name as per Aadhaar"
                required
                autoComplete="given-name"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Last Name</label>
              <input
                type="text"
                name="lastName"
                value={cibilForm.lastName}
                onChange={handleCibilChange}
                placeholder="Enter last name as per Aadhaar"
                required
                autoComplete="family-name"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>PAN</label>
              <input
                type="text"
                name="pan"
                value={cibilForm.pan}
                onChange={handleCibilChange}
                placeholder="ABCDE1234F"
                required
                maxLength={10}
                autoCapitalize="characters"
                autoComplete="off"
                spellCheck={false}
                aria-invalid={Boolean(panError)}
                aria-describedby="cibil-pan-help cibil-pan-error"
                className={`${inputClass} uppercase ${
                  !panTouched
                    ? ""
                    : validatePAN(cibilForm.pan)
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : "border-green-500 focus:border-green-500 focus:ring-green-500"
                }`}
              />
              <p id="cibil-pan-help" className="mt-1 text-xs text-slate-500">
                Format: 5 letters, 4 digits, and 1 letter (example: ABCDE1234F).
              </p>
              {panTouched && panError && (
                <p
                  id="cibil-pan-error"
                  role="alert"
                  className="mt-1 text-xs text-red-400"
                >
                  {panError}
                </p>
              )}
            </div>

            <div>
              <label className={labelClass}>Mobile Number</label>
              <input
                type="tel"
                name="phone"
                value={cibilForm.phone}
                onChange={handleCibilChange}
                placeholder="Enter 10-digit mobile number"
                required
                maxLength={10}
                inputMode="numeric"
                autoComplete="tel-national"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Gender</label>
              <select
                name="gender"
                value={cibilForm.gender}
                onChange={handleCibilChange}
                required
                className={`${inputClass} appearance-none`}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={cibilForm.dob}
                onChange={handleCibilChange}
                required
                autoComplete="bday"
                className={inputClass}
              />
            </div>

            {/* Error */}
            {cibilError && (
              <div className="rounded-lg border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-300">
                {cibilError}
              </div>
            )}

            {/* Back + Get CIBIL Score: equal-width side-by-side buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleBack}
                className="w-full rounded-xl border border-white/20 bg-[#111827] px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                ← Back
              </button>

              <button
                type="submit"
                disabled={cibilLoading}
                className="w-full rounded-xl bg-[#2563ff] px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-[#1f57e5] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {cibilLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Fetching...
                  </span>
                ) : (
                  "Get CIBIL Score"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ================================
          FULL CIBIL REPORT (same as LoanForm)
      ================================= */}
      {showCibilReport && cibilReport && (
        <CibilReportModal
          report={cibilReport}
          fallbackScore={formData.cibilScore ?? cibilScore}
          consumer={cibilForm}
          onClose={() => setShowCibilReport(false)}
          onDownload={handleDownloadCibilReport}
        />
      )}
    </div>
  );
}
