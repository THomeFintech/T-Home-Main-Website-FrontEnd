import React from "react";
import { useNavigate } from "react-router-dom";
import ContactForm from "../components/ContactForm";

export default function BalanceTransfer() {
  const navigate = useNavigate();

  return (
    <ContactForm
      title="Balance Transfer"
      submitText="Continue ->"
      onNext={() => navigate("/balance-transfer/details")}
    />
  );
}
