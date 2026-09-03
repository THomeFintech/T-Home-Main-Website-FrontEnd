const financialServiceSchema = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    name: "T-Home Fintech",
    image: "https://thomefintech.com/home/logo.png",
    url: "https://thomefintech.com",
    logo: "https://thomefintech.com/home/logo.png",
    telephone: "+91 70321 83836",
    email: "info@thome.co.in",
    description:
      "T-Home Fintech provides Home Loans, Personal Loans, Mortgage Loans, Loan Against Property, Balance Transfer services, MSME Registration, GST Registration, Food License, ITR Filing, and other financial and business registration solutions across India.",
    areaServed: {
      "@type": "Country",
      name: "India",
    },
    serviceType: [
      "Home Loan",
      "Personal Loan",
      "Mortgage Loan",
      "Loan Against Property",
      "Balance Transfer",
      "Business Registration",
      "GST Registration",
      "Food License",
      "ITR Filing",
      "MSME Registration",
    ],
  };
  export default financialServiceSchema;