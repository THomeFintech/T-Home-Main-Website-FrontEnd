import axisLogo from "../assets/Axis_Bank_logo.png";
import bankOfIndiaLogo from "../assets/Bank of India.png";
import centralBankLogo from "../assets/Central Bank of India.png";
import canaraLogo from "../assets/Canara Bank logo.png";
import federalLogo from "../assets/Federal_Bank_Logo.png";
import hdfcLogo from "../assets/HDFC bank logo.png";
import iciciLogo from "../assets/icici bank logo.png";
import idfcLogo from "../assets/IDFC frist bank logo.png";
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

import punjabSindLogo from "../assets/Punjab & Sind Bank logo.png";
import southIndianLogo from "../assets/South Indian Bank logo.png";
import ucoBankLogo from "../assets/UCO Bank logo.png";
import yesBankLogo from "../assets/Yes Bank logo.png";
import telanganaGrameenaLogo from "../assets/Telanagana gremeena bank logo.jpg";

// 14 missing bank / housing finance logos
import bankOfMaharashtraLogo from "../assets/bank-logos/Bank of Maharashtra.png";
import indianOverseasLogo from "../assets/bank-logos/Indian Overseas Bank.png";
import jkBankLogo from "../assets/bank-logos/J&K Bank.png";
import karnatakaBankLogo from "../assets/bank-logos/Karnataka Bank.png";
import nainitalBankLogo from "../assets/bank-logos/Nainital Bank.png";
import rblBankLogo from "../assets/bank-logos/RBL Bank.png";
import orangeCityLogo from "../assets/bank-logos/Orange City Housing Finance Limited.png";
import rohaLogo from "../assets/bank-logos/Roha Housing Finance Private Limited.png";
import centBankHomeFinanceLogo from "../assets/bank-logos/Cent Bank Home Finance Limited.png";
import supremeHousingFinanceLogo from "../assets/bank-logos/Supreme Housing Finance Limited.png";
import swagatHousingFinanceLogo from "../assets/bank-logos/Swagat Housing Finance Company Limited.png";
import masHousingFinanceLogo from "../assets/bank-logos/MAS Rural Housing & Mortgage Finance Limited.png";
import ummeedHousingFinanceLogo from "../assets/bank-logos/Ummeed Housing Finance Private Limited.png";
import tygerHomeFinanceLogo from "../assets/bank-logos/Tyger Home Finance Private Limited.png";

export const bankLogos = {
  "Axis Bank": axisLogo,
  "Bandhan Bank": bandhanLogo,
  "City Union Bank": cityUnionLogo,
  "Federal Bank": federalLogo,
  "HDFC Bank": hdfcLogo,
  "ICICI Bank": iciciLogo,
  "IndusInd Bank": indusindLogo,
  "IDFC FIRST Bank": idfcLogo,
  "Karur Vysya Bank": karurVysyaLogo,
  "Kotak Mahindra Bank": kotakLogo,
  "Telangana Grameena Bank": telanganaGrameenaLogo,

  "Bank of Baroda": bobLogo,
  "Bank of Maharashtra": bankOfMaharashtraLogo,
  "Bank of India": bankOfIndiaLogo,
  "Canara Bank": canaraLogo,
  "Central Bank of India": centralBankLogo,
  "Indian Bank": indianBankLogo,
  "Punjab National Bank": pnbLogo,
  "State Bank of India": sbiLogo,
  "Indian Overseas Bank": indianOverseasLogo,
  "Punjab & Sind Bank": punjabSindLogo,
  "UCO Bank": ucoBankLogo,
  "Union Bank of India": unionLogo,

  "J&K Bank": jkBankLogo,
  "Karnataka Bank": karnatakaBankLogo,
  "Nainital Bank": nainitalBankLogo,
  "RBL Bank": rblBankLogo,
  "South Indian Bank": southIndianLogo,
  "YES BANK": yesBankLogo,

  "Orange City Housing Finance Limited": orangeCityLogo,
  "Roha Housing Finance Private Limited": rohaLogo,
  "Cent Bank Home Finance Limited": centBankHomeFinanceLogo,
  "Supreme Housing Finance Limited": supremeHousingFinanceLogo,
  "Swagat Housing Finance Company Limited": swagatHousingFinanceLogo,
  "MAS Rural Housing & Mortgage Finance Limited": masHousingFinanceLogo,
  "Ummeed Housing Finance Private Limited": ummeedHousingFinanceLogo,
  "Tyger Home Finance Private Limited": tygerHomeFinanceLogo,
};

export const getBankLogo = (bankName) => {
  if (!bankName) return null;

  const normalizedName = bankName.trim().toLowerCase();

  const matchedBank = Object.keys(bankLogos).find(
    (name) => name.toLowerCase() === normalizedName
  );

  return matchedBank ? bankLogos[matchedBank] : null;
};