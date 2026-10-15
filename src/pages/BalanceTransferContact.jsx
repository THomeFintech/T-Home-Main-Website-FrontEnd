import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ContactForm from "../components/ContactForm";
import DigiLockerVerificationStep from "../components/DigiLockerVerificationStep";
import { calculateAgeFromDob } from "../utils/dobUtils";
import { BT_API_BASE } from "../config";

export default function BalanceTransferContact() {
  const navigate = useNavigate();
  const location = useLocation();

  const [step, setStep] = useState(1); // 1 = DigiLocker Gate, 2 = Contact Form
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [contactData, setContactData] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("contact_data") || "{}");
    } catch {
      return {};
    }
  });

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Check login and DigiLocker status on mount
  useEffect(() => {
    const token =
      sessionStorage.getItem("access_token") ||
      localStorage.getItem("access_token");

    if (!token) {
      try {
        localStorage.setItem(
          "digilocker_return_url",
          "/balance-transfer-contact"
        );
        localStorage.setItem("digilocker_selected_service", "Balance Transfer");
      } catch {}
      navigate("/login");
      return;
    }

    const checkDigiLocker = async () => {
      try {
        const res = await fetch(`${API_BASE}/digilocker/status`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          if (data?.connected && data?.verified_identity) {
            const verified = data.verified_identity;
            try {
              localStorage.setItem(
                "digilocker_verified_identity",
                JSON.stringify(verified)
              );
              if (verified.dob) {
                const age = calculateAgeFromDob(verified.dob);
                if (age) {
                  localStorage.setItem("digilocker_age", String(age));
                }
              }
            } catch {}

            setContactData((prev) => {
              const updated = {
                ...prev,
                name: verified.name || prev.name || "",
                phone: verified.phone || prev.phone || "",
                email: verified.email || prev.email || "",
                pan: verified.pan || prev.pan || "",
                aadhaar: verified.aadhaar || prev.aadhaar || "",
                dob: verified.dob || prev.dob || "",
                gender: verified.gender || prev.gender || "",
                address: verified.address || prev.address || "",
                service: "Balance Transfer",
              };
              try {
                localStorage.setItem("contact_data", JSON.stringify(updated));
              } catch {}
              return updated;
            });
            // If already connected or returning from OAuth with success, load the form immediately
            setStep(2);
          } else {
            setStep(1);
          }
        } else {
          setStep(1);
        }
      } catch (err) {
        console.error("BalanceTransfer DigiLocker check error:", err);
        setStep(1);
      } finally {
        setCheckingAuth(false);
      }
    };

    checkDigiLocker();
  }, [API_BASE, navigate]);

  const handleVerified = useCallback(
    (verifiedIdentity) => {
      const calculatedAge = calculateAgeFromDob(verifiedIdentity?.dob);
      if (calculatedAge) {
        try {
          localStorage.setItem("digilocker_age", String(calculatedAge));
        } catch {}
      }
      if (verifiedIdentity) {
        try {
          localStorage.setItem(
            "digilocker_verified_identity",
            JSON.stringify(verifiedIdentity)
          );
        } catch {}
      }

      setContactData((prev) => {
        const updated = {
          ...prev,
          name: verifiedIdentity?.name || prev.name || "",
          phone: verifiedIdentity?.phone || prev.phone || "",
          email: verifiedIdentity?.email || prev.email || "",
          pan: verifiedIdentity?.pan || prev.pan || "",
          aadhaar: verifiedIdentity?.aadhaar || prev.aadhaar || "",
          dob: verifiedIdentity?.dob || prev.dob || "",
          gender: verifiedIdentity?.gender || prev.gender || "",
          address: verifiedIdentity?.address || prev.address || "",
          service: "Balance Transfer",
        };
        try {
          localStorage.setItem("contact_data", JSON.stringify(updated));
        } catch {}
        return updated;
      });

      // Automatically advance to the form
      setStep(2);
    },
    []
  );

  const handleNext = async (service) => {
    const stored = JSON.parse(localStorage.getItem("contact_data") || "{}");

    const payload = {
      full_name: stored.name,
      country_code: "+91",
      phone: stored.phone,
      email: stored.email,
      service: service || "Balance Transfer",
      accepted_terms: true,
    };

    try {
      const res = await fetch(`${BT_API_BASE}/contact-form/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        console.error("Validation errors:", error);
        throw new Error("Failed to submit");
      }

      const data = await res.json();

      if (data.loan_reference) {
        localStorage.setItem("bt_loan_reference", data.loan_reference);
      }

      navigate("/balance-transfer/details", {
        state: { service: service || "Balance Transfer" },
      });
    } catch (err) {
      console.error("BT contact error:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#071327] text-white">
        <div className="flex flex-col items-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-blue-400" />
          <p className="mt-3 text-sm text-white/60">
            Checking verification status...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen text-slate-100 font-sans"
      style={{
        background:
          "radial-gradient(1200px 680px at 20% -10%, rgba(90,140,255,0.18), transparent 62%), radial-gradient(980px 580px at 100% 0%, rgba(36,107,198,0.14), transparent 60%), linear-gradient(180deg, #071327 0%, #08162b 100%)",
      }}
    >
      {step === 1 ? (
        <div className="pt-24 pb-12">
          <DigiLockerVerificationStep
            serviceName="Balance Transfer"
            onVerified={handleVerified}
            onBack={() => navigate("/balance-transfer")}
          />
        </div>
      ) : (
        <ContactForm
          title="Balance Transfer"
          submitText="Continue ->"
          defaultService="Balance Transfer"
          contactData={contactData}
          setContactData={setContactData}
          onNext={handleNext}
        />
      )}
    </div>
  );
}
