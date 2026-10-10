import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  FileCheck,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  Lock,
  ExternalLink,
  UserCheck,
  Building,
  Calendar,
  CreditCard,
  Car,
  FileText,
} from "lucide-react";
import { calculateAgeFromDob, formatDobDisplay } from "../utils/dobUtils";

export default function DigiLockerVerificationStep({
  onVerified,
  onBack,
  serviceName = "Loan Application",
}) {
  const location = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [statusData, setStatusData] = useState(null);
  const [error, setError] = useState("");
  const [bannerMessage, setBannerMessage] = useState(null);

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const fetchStatus = useCallback(async () => {
    const token =
      sessionStorage.getItem("access_token") ||
      localStorage.getItem("access_token");

    if (!token) {
      setError("Please log in to your T-HOME account to proceed.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${API_BASE}/digilocker/status`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        if (res.status === 401) {
          setError("Your session has expired. Please log in again.");
          sessionStorage.removeItem("access_token");
          return;
        }
        throw new Error(`Failed to check verification status (${res.status})`);
      }

      const data = await res.json();
      setStatusData(data);
    } catch (err) {
      console.error("DigiLocker status check error:", err);
      setError(
        err.message || "Failed to retrieve DigiLocker connection status.",
      );
    } finally {
      setLoading(false);
    }
  }, [API_BASE]);

  // Check URL query parameters upon returning from DigiLocker
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const dlParam = params.get("digilocker");
    const msgParam = params.get("message");
    const importedCount = params.get("imported");
    const isReturningSuccess = dlParam === "success";

    if (dlParam === "success") {
      setBannerMessage({
        type: "success",
        text: `DigiLocker successfully linked! ${
          importedCount && Number(importedCount) > 0
            ? `${importedCount} official documents imported.`
            : "Official identity details verified."
        } Loading your ${serviceName}...`,
      });
      // Clean up URL parameters cleanly without page refresh
      params.delete("digilocker");
      params.delete("imported");
      const newSearch = params.toString() ? `?${params.toString()}` : "";
      window.history.replaceState(
        {},
        "",
        `${window.location.pathname}${newSearch}`,
      );
    } else if (dlParam === "error") {
      setBannerMessage({
        type: "error",
        text:
          msgParam ||
          "DigiLocker authentication was cancelled or could not be completed. Please retry.",
      });
      params.delete("digilocker");
      params.delete("message");
      const newSearch = params.toString() ? `?${params.toString()}` : "";
      window.history.replaceState(
        {},
        "",
        `${window.location.pathname}${newSearch}`,
      );
    }

    const checkAndAutoProceed = async () => {
      const token =
        sessionStorage.getItem("access_token") ||
        localStorage.getItem("access_token");

      if (!token) {
        setError("Please log in to your T-HOME account to proceed.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const res = await fetch(`${API_BASE}/digilocker/status`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          if (res.status === 401) {
            setError("Your session has expired. Please log in again.");
            sessionStorage.removeItem("access_token");
            return;
          }
          throw new Error(`Failed to check verification status (${res.status})`);
        }

        const data = await res.json();
        setStatusData(data);

        if (data.connected && data.verified_identity) {
          try {
            localStorage.setItem(
              "digilocker_verified_identity",
              JSON.stringify(data.verified_identity)
            );
            if (data.verified_identity.dob) {
              const age = calculateAgeFromDob(data.verified_identity.dob);
              if (age) {
                localStorage.setItem("digilocker_age", String(age));
              }
            }
          } catch {}

          // If returning from successful OAuth or autoProceed is enabled:
          if (isReturningSuccess && onVerified) {
            setTimeout(() => {
              onVerified(data.verified_identity, data);
            }, 600);
          }
        }
      } catch (err) {
        console.error("DigiLocker status check error:", err);
        setError(
          err.message || "Failed to retrieve DigiLocker connection status.",
        );
      } finally {
        setLoading(false);
      }
    };

    checkAndAutoProceed();
  }, [location.search, API_BASE, onVerified, serviceName]);

  const handleConnect = async () => {
    const token =
      sessionStorage.getItem("access_token") ||
      localStorage.getItem("access_token");

    if (!token) {
      // Store current target before sending to login
      try {
        const currentPath = `${window.location.pathname}${window.location.search}`;
        localStorage.setItem("digilocker_return_url", currentPath);
        localStorage.setItem("digilocker_selected_service", serviceName);
      } catch {}
      navigate("/login");
      return;
    }

    try {
      setConnecting(true);
      setError("");

      const currentPath = `${window.location.pathname}${window.location.search}`;
      try {
        localStorage.setItem("digilocker_return_url", currentPath);
        localStorage.setItem("digilocker_selected_service", serviceName);
      } catch {}

      const params = new URLSearchParams({
        returnUrl: currentPath,
        service: serviceName,
        flow: "service-application",
      });

      const res = await fetch(`${API_BASE}/digilocker/authorize?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.authorization_url) {
        throw new Error(
          data.message ||
            "Unable to generate DigiLocker authorization URL. Please retry.",
        );
      }

      // Redirect user to official government portal
      window.location.assign(data.authorization_url);
    } catch (err) {
      console.error("DigiLocker connect error:", err);
      setError(err.message || "Failed to initiate DigiLocker connection.");
      setConnecting(false);
    }
  };

  const handleProceed = () => {
    if (onVerified && statusData?.verified_identity) {
      onVerified(statusData.verified_identity, statusData);
    }
  };

  const isConnected = statusData?.connected === true;
  const isExpired = statusData?.status === "expired";
  const identity = statusData?.verified_identity || {};

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Top Banner Alert if returning from OAuth */}
      {bannerMessage && (
        <div
          className={`mb-6 flex items-start gap-3 rounded-2xl border p-4 text-sm backdrop-blur-xl ${
            bannerMessage.type === "success"
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
              : "border-red-500/30 bg-red-500/10 text-red-300"
          }`}
        >
          {bannerMessage.type === "success" ? (
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
          ) : (
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
          )}
          <div className="flex-1">
            <p className="font-medium">{bannerMessage.text}</p>
          </div>
        </div>
      )}

      {/* Main Glassmorphism Card */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-6 shadow-2xl backdrop-blur-2xl sm:p-10">
        {/* Glow ambient background effect */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-emerald-500/15 blur-3xl" />

        {/* Header */}
        <div className="relative z-10 flex flex-col items-start justify-between gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-400/30 bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-400">
                <Building className="h-3.5 w-3.5" />
                Govt-Approved KYC Gate
              </span>
              <span className="text-xs text-white/50">•</span>
              <span className="text-xs text-white/70">{serviceName}</span>
            </div>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Mandatory DigiLocker Verification
            </h2>
            <p className="mt-1 text-sm text-slate-300">
              Verify your official identity via DigiLocker to complete regulatory
              underwriting with zero physical paperwork.
            </p>
          </div>

          {/* Status Badge */}
          <div className="shrink-0">
            {loading ? (
              <span className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-slate-400">
                <RefreshCw className="h-3.5 w-3.5 animate-spin text-sky-400" />
                Checking status...
              </span>
            ) : isConnected ? (
              <span className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/15 px-4 py-2 text-xs font-semibold text-emerald-300 shadow-sm shadow-emerald-500/20">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Connected & Verified
              </span>
            ) : isExpired ? (
              <span className="inline-flex items-center gap-2 rounded-xl border border-amber-500/40 bg-amber-500/15 px-4 py-2 text-xs font-semibold text-amber-300">
                <AlertTriangle className="h-4 w-4 text-amber-400" />
                Reconnection Required
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-slate-400">
                <Lock className="h-3.5 w-3.5 text-slate-400" />
                Not Connected
              </span>
            )}
          </div>
        </div>

        {/* Body Section */}
        <div className="relative z-10 mt-6 space-y-6">
          {loading ? (
            /* Loading State */
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-sky-400 border-t-transparent" />
              <p className="mt-4 text-sm font-medium text-slate-300">
                Verifying your official identity credentials...
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Querying secure DigiLocker gateway
              </p>
            </div>
          ) : isConnected ? (
            /* =========================================================================
               STATE A: CONNECTED & VERIFIED (Review Screen for 1st or Subsequent Loans)
               ========================================================================= */
            <div className="space-y-6">
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 backdrop-blur-xl">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-white">
                      Verified Identity Dossier Confirmed
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-slate-300 sm:text-sm">
                      Your government-verified identity and records have been
                      validated. These details will be automatically bound to
                      your <strong>{serviceName}</strong>. You do not need to
                      manually upload separate Aadhaar or PAN files.
                    </p>
                    {statusData.last_connected_at && (
                      <p className="mt-2 text-[11px] text-emerald-400/80">
                        Synchronized with MeriPehchaan on{" "}
                        {new Date(
                          statusData.last_connected_at,
                        ).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Verified Identity Details Grid */}
              <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-3">
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                    <UserCheck className="h-3.5 w-3.5 text-sky-400" />
                    Full Legal Name
                  </div>
                  <p className="mt-1 text-base font-bold text-white">
                    {identity.name || "Verified Applicant"}
                  </p>
                  <span className="text-[11px] text-emerald-400">
                    ✓ Verified as per Aadhaar/PAN
                  </span>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                    <CreditCard className="h-3.5 w-3.5 text-sky-400" />
                    PAN Number
                  </div>
                  <p className="mt-1 font-mono text-base font-bold tracking-wider text-white">
                    {identity.pan || "Linked via DigiLocker"}
                  </p>
                  <span className="text-[11px] text-emerald-400">
                    ✓ Verified via Income Tax Dept
                  </span>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                    <Calendar className="h-3.5 w-3.5 text-sky-400" />
                    Date of Birth
                  </div>
                  <p className="mt-1 text-base font-bold text-white">
                    {identity.dob
                      ? `${formatDobDisplay(identity.dob)}${
                          calculateAgeFromDob(identity.dob)
                            ? ` (Age: ${calculateAgeFromDob(identity.dob)})`
                            : ""
                        }`
                      : "Verified on Record"}
                  </p>
                  <span className="text-[11px] text-slate-400">
                    {identity.gender
                      ? `Gender: ${identity.gender}`
                      : "Official UIDAI/Govt Record"}
                  </span>
                </div>

                {identity.driving_licence && (
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                      <Car className="h-3.5 w-3.5 text-sky-400" />
                      Driving Licence
                    </div>
                    <p className="mt-1 font-mono text-base font-bold text-white">
                      {identity.driving_licence}
                    </p>
                    <span className="text-[11px] text-emerald-400">
                      ✓ Verified via MoRTH
                    </span>
                  </div>
                )}

                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                    <FileCheck className="h-3.5 w-3.5 text-sky-400" />
                    Verified Documents
                  </div>
                  <p className="mt-1 text-base font-bold text-white">
                    {statusData.documents_count || 1} Document(s)
                  </p>
                  <span className="text-[11px] text-emerald-400">
                    ✓ Ready for Underwriting
                  </span>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                    <ShieldCheck className="h-3.5 w-3.5 text-sky-400" />
                    Security & Compliance
                  </div>
                  <p className="mt-1 text-base font-bold text-white">
                    100% Encrypted
                  </p>
                  <span className="text-[11px] text-slate-400">
                    Tokenized & Access-Restricted
                  </span>
                </div>
              </div>

              {/* Documents List Preview if available */}
              {statusData.documents?.length > 0 && (
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                  <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    <FileText className="h-3.5 w-3.5 text-sky-400" />
                    Official Government Documents Synchronized
                  </h4>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {statusData.documents.map((doc) => (
                      <span
                        key={doc.id}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-sky-500/20 bg-sky-500/10 px-3 py-1.5 text-xs text-sky-300"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                        {doc.name || "Government Document"}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA Action Row */}
              <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>DigiLocker verification active & ready</span>
                </div>

                <div className="flex w-full items-center gap-3 sm:w-auto">
                  {onBack && (
                    <button
                      type="button"
                      onClick={onBack}
                      className="rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/5"
                    >
                      Back
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleProceed}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-sky-500/25 transition hover:brightness-110 sm:flex-initial"
                  >
                    Continue to {serviceName || "Application"}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* =========================================================================
               STATE B: NOT CONNECTED / RECONNECTION REQUIRED (First Loan or Expired)
               ========================================================================= */
            <div className="space-y-6">
              {isExpired && (
                <div className="flex items-start gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-200 sm:text-sm">
                  <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
                  <div>
                    <p className="font-semibold text-amber-300">
                      Previous Authorization Expired
                    </p>
                    <p className="mt-0.5 text-amber-200/80">
                      Your prior DigiLocker session has expired or requires
                      fresh consent for this loan application. Please reconnect
                      below to continue.
                    </p>
                  </div>
                </div>
              )}

              {/* Value Propositions / Why Required */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4 sm:p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20 text-sky-400">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <h4 className="mt-3 text-sm font-bold text-white">
                    RBI & Regulatory Compliance
                  </h4>
                  <p className="mt-1 text-xs leading-relaxed text-slate-400">
                    Verified digital KYC via government repositories is
                    mandated by banking partners to prevent fraud.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4 sm:p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                    <FileCheck className="h-5 w-5" />
                  </div>
                  <h4 className="mt-3 text-sm font-bold text-white">
                    Zero Paperwork
                  </h4>
                  <p className="mt-1 text-xs leading-relaxed text-slate-400">
                    Official PAN, Aadhaar, and driving licences are fetched
                    directly without tedious manual scanning.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4 sm:p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <h4 className="mt-3 text-sm font-bold text-white">
                    3x Faster Loan Approval
                  </h4>
                  <p className="mt-1 text-xs leading-relaxed text-slate-400">
                    Pre-verified identity allows immediate loan sanctioning
                    without prolonged physical verification delays.
                  </p>
                </div>
              </div>

              {/* Clear Explanation of Information Retrieved */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Information Retrieved & Verified:
                </h4>
                <ul className="mt-3 grid gap-2 text-xs text-slate-300 sm:grid-cols-2">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                    Legal Name & Date of Birth
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                    Permanent Account Number (PAN) Record
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                    Aadhaar verification details
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                    Driving Licence & official certificates (if available)
                  </li>
                </ul>
              </div>

              {error && (
                <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-red-400" />
                  <span>{error}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Lock className="h-3.5 w-3.5 text-emerald-400" />
                  <span>256-bit SSL encrypted & secure</span>
                </div>

                <div className="flex w-full items-center gap-3 sm:w-auto">
                  {onBack && (
                    <button
                      type="button"
                      onClick={onBack}
                      className="rounded-xl border border-white/10 px-5 py-3.5 text-sm font-semibold text-slate-300 transition hover:bg-white/5"
                    >
                      Back
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleConnect}
                    disabled={connecting}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-sky-500/25 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-initial"
                  >
                    {connecting ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Connecting to DigiLocker...
                      </>
                    ) : (
                      <>
                        <Building className="h-4 w-4" />
                        Connect DigiLocker
                        <ExternalLink className="h-3.5 w-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
