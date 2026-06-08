import axisLogo from "../assets/Axis_Bank_logo.png";
import bankOfIndiaLogo from "../assets/Bank of India.png";
import centralBankLogo from "../assets/Central Bank of India.png";
import canaraLogo from "../assets/Canara Bank logo.png";
import federalLogo from "../assets/Federal_Bank_Logo.png";
import hdfcLogo from "../assets/HDFC bank logo.png";
import iciciLogo from "../assets/icici bank logo.png";
import idfcLogo from "../assets/IDFC frist bank logo.png"; // keep typo same
import indianBankLogo from "../assets/Indian Bank logo.png";
import indusindLogo from "../assets/IndusInd Bank logo.png";
import karurVysyaLogo from "../assets/karur vysya bank-logo.png";
import kotakLogo from "../assets/Kotak Mahindra Bank.png";
import pnbLogo from "../assets/Punjab National Bank logo.png";
import sbiLogo from "../assets/State Bank of India logo.png";
import unionLogo from "../assets/Union Bank of India logo.png";
import bobLogo from "../assets/Bank of Baroda.png";
import bandhanLogo from "../assets/bandhan-bank-logo.png";
import cityUnionLogo from "../assets/City Union Bank-logo.jpg";

export const bankLogos = {
  "Axis Bank": axisLogo,
  "Bank of India": bankOfIndiaLogo,
  "Central Bank of India": centralBankLogo,
  "Canara Bank": canaraLogo,
  "Federal Bank": federalLogo,
  "HDFC Bank": hdfcLogo,
  "ICICI Bank": iciciLogo,
  "IDFC FIRST Bank": idfcLogo,
  "Indian Bank": indianBankLogo,
  "IndusInd Bank": indusindLogo,
  "Karur Vysya Bank": karurVysyaLogo,
  "Kotak Mahindra Bank": kotakLogo,
  "Punjab National Bank": pnbLogo,
  "State Bank of India": sbiLogo,
  "Union Bank of India": unionLogo,
  "Bank of Baroda": bobLogo,
  "Bandhan Bank": bandhanLogo,
  "City Union Bank": cityUnionLogo,
};

export const getBankLogo = (bankName) => {
  if (!bankName) return null;

  return (
    bankLogos[bankName] ||
    bankLogos[bankName.trim()] ||
    bankLogos[bankName.toUpperCase()] ||
    bankLogos[bankName.toLowerCase()] ||
    null
  );
};