import React from "react";
import { useNavigate } from "react-router-dom";
import ContactForm from "../components/ContactForm";

export default function BalanceTransfer() {
  const navigate = useNavigate();

  return (
    <ContactForm
      title="Balance Transfer"
      submitText="Continue ->"
      onNext={(formData) =>
  navigate("/balance-transfer/details", {
    state: {
      service: formData?.service || "",
    },
  })
}
    />
  );
}