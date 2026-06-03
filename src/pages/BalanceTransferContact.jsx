import React from "react";
import { useNavigate } from "react-router-dom";
import ContactForm from "../components/ContactForm";
import { BT_API_BASE } from "../config";

export default function BalanceTransfer() {
  const navigate = useNavigate();

  const handleNext = async (formData) => {
     console.log("Form Data:", formData);
    try {
      const res = await fetch(`${BT_API_BASE}/contact-form/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
        full_name: formData.name,
        country_code: "+91",
        phone: formData.phone,
        email: formData.email,
        service: formData.service || "Balance Transfer",
        accepted_terms: true
      }),
      });

      if (!res.ok) {
  const error = await res.json();
  console.log("Backend Error:", error);
  throw new Error("Failed to submit");
}

      const data = await res.json();

      if (data.loan_reference) {
        localStorage.setItem("bt_loan_reference", data.loan_reference);
      }

      navigate("/balance-transfer/details", {
        state: { service: formData.service || "Balance Transfer" },
      });

    } catch (err) {
      console.error("BT contact error:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <ContactForm
      title="Balance Transfer"
      submitText="Continue ->"
      onNext={handleNext}
    />
  );
}
