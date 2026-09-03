/**
 * Canonical list of valid SPA routes. Used by Vercel middleware for 404 handling.
 * Keep in sync with routes defined in src/App.jsx.
 */
export const VALID_ROUTES = new Set([
  "/",
  "/dashboard",
  "/applications",
  "/documents",
  "/profile",
  "/support",
  "/balance-transfer",
  "/balance-transfer/details",
  "/balance-transfer/offers",
  "/balance-transfer/review",
  "/balance-transfer/analysis",
  "/balance-transfer/comparison",
  "/balance-transfer/detailed-table",
  "/balance-transfer/amortization",
  "/balance-transfer/ready",
  "/balance-transfer/application-portal",
  "/balance-transfer/application-portal/income-documents",
  "/balance-transfer/application-portal/existing-loan-documents",
  "/balance-transfer/application-portal/co-applicant-details",
  "/balance-transfer/application-portal/review-submit",
  "/balance-transfer/application-portal/submitted",
  "/services",
  "/tools",
  "/about",
  "/contact",
  "/proceed",
  "/career",
  "/collaborate",
  "/privacy-policy",
  "/terms-and-conditions",
  "/apply",
  "/register",
  "/home-loans",
  "/emi-calculator",
  "/contact-form",
  "/loan-form",
  "/coming-soon",
  "/itr-filing",
  "/pan-aadhaar-linking",
  "/gst-registration",
  "/food-license",
  "/udyam-msme-registration",
  "/company-registration",
  "/personal-loans",
  "/loan-against-property",
  "/mortgage-loan",
  "/balance-transfer-contact",
  "/get-started",
  "/login",
]);

const DYNAMIC_ROUTE_PATTERNS = [
  /^\/applications\/\d+$/,
];

export function isValidRoute(pathname) {
  const normalized = pathname.replace(/\/+$/, "") || "/";
  if (VALID_ROUTES.has(normalized)) return true;
  return DYNAMIC_ROUTE_PATTERNS.some((pattern) => pattern.test(normalized));
}
