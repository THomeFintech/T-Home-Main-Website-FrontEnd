import Register from "./pages/Register";
import { BrowserRouter, Routes, Route, Outlet, useParams } from "react-router-dom";

// Layouts
import DashboardLayout from "./layout/DashboardLayout";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ChatbotWidget from "./components/ChatbotWidget";

// Pages
import Home from "./pages/Home";
import Services from "./pages/Services";
import Tools from "./pages/Tools";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Career from "./pages/Career";
import Collaborate from "./pages/Collaborate";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import EmployeeForm from "./pages/employeeform";
import GetStarted from "./pages/GetStarted";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import TrackApplication from "./pages/TrackApplication";
import DocumentsPage from "./pages/DocumentsPage";
import ProfilePage from "./pages/Profilepage";
import Support from "./pages/Support";
import Proceed from "./components/Proceed";
import { GoogleOAuthProvider } from '@react-oauth/google';


// Service Pages
import HomeLoan from "./pages/HomeLoan";
import PersonalLoan from "./pages/PersonalLoan";
import LoanAgainstProperty from "./pages/LoanAgainstProperty";
import MortgageLoan from "./pages/MortgageLoan";
import BalanceTransfer from "./pages/BalanceTransfer";
import BalanceTransferDetails from "./pages/BalanceTransferDetails";
import BalanceTransferOffers from "./pages/BalanceTransferOffers";
import BalanceTransferReview from "./pages/BalanceTransferReview";
import BalanceTransferAnalysis from "./pages/BalanceTransferAnalysis";
import BalanceTransferComparison from "./pages/BalanceTransferComparison";
import BalanceTransferDetailedTable from "./pages/BalanceTransferDetailedTable";
import BalanceTransferAmortization from "./pages/BalanceTransferAmortization";
import BalanceTransferReady from "./pages/BalanceTransferReady";
import BalanceTransferApplicationPortal from "./pages/BalanceTransferApplicationPortal";
import BalanceTransferIncomeDocuments from "./pages/BalanceTransferIncomeDocuments";
import BalanceTransferExistingLoanDocuments from "./pages/BalanceTransferExistingLoanDocuments";
import BalanceTransferCoApplicantDetails from "./pages/BalanceTransferCoApplicantDetails";
import BalanceTransferReviewSubmit from "./pages/BalanceTransferReviewSubmit";
import BalanceTransferSubmitted from "./pages/BalanceTransferSubmitted";
import Emi from "./pages/Emi";
import ContactForm from "./components/ContactForm";
import ComingSoon from "./pages/ComingSoon";

import ITRFiling from "./pages/ITRFiling";
import CompanyRegistration from "./pages/CompanyRegistration";
import GstRegistration from "./pages/GstRegistration";
import UdyamMsmeRegistration from "./pages/UdyamMsmeRegistration";
import FoodLicense from "./pages/FoodLicense";
import PanAadhaarLinking from "./pages/PanAadhaarLinking";

/* =========================
   LAYOUT
========================= */
function Layout() {
  return (
    <div className="min-h-screen bg-[#0b1a33] text-white flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <ChatbotWidget />
    </div>
  );
}

/* =========================
   TRACK APPLICATION WRAPPER
========================= */
function TrackApplicationWithParam() {
  const { applicationId } = useParams();
  return <TrackApplication applicationId={Number(applicationId)} />;
}

/* =========================
   ROUTER
========================= */
function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <Routes>

          {/* AUTH ROUTES */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* DASHBOARD ROUTES */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/applications" element={<TrackApplication />} />
            <Route path="/applications/:applicationId" element={<TrackApplicationWithParam />} />
            <Route path="/documents" element={<DocumentsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/support" element={<Support />} />
          </Route>

          {/* MAIN LAYOUT ROUTES */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="services" element={<Services />} />
            <Route path="tools" element={<Tools />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="proceed" element={<Proceed />} />
            <Route path="career" element={<Career />} />
            <Route path="collaborate" element={<Collaborate />} />
            <Route path="privacy-policy" element={<PrivacyPolicy />} />
            <Route path="terms-and-conditions" element={<TermsAndConditions />} />
            <Route path="get-started" element={<GetStarted />} />
            <Route path="apply" element={<EmployeeForm />} />

            {/* SERVICE ROUTES */}
            <Route path="home-loans" element={<HomeLoan />} />
            <Route path="emi-calculator" element={<Emi />} />
            <Route path="contact-form" element={<ContactForm />} />
            <Route path="coming-soon" element={<ComingSoon />} />
            <Route path="personal-loans" element={<PersonalLoan />} />
            <Route path="loan-against-property" element={<LoanAgainstProperty />} />
            <Route path="mortgage-loan" element={<MortgageLoan />} />
            <Route path="balance-transfer" element={<BalanceTransfer />} />
            <Route path="balance-transfer/details" element={<BalanceTransferDetails />} />
            <Route path="balance-transfer/offers" element={<BalanceTransferOffers />} />
            <Route path="balance-transfer/review" element={<BalanceTransferReview />} />
            <Route path="balance-transfer/analysis" element={<BalanceTransferAnalysis />} />
            <Route path="balance-transfer/comparison" element={<BalanceTransferComparison />} />
            <Route path="balance-transfer/detailed-table" element={<BalanceTransferDetailedTable />} />
            <Route path="balance-transfer/amortization" element={<BalanceTransferAmortization />} />
            <Route path="balance-transfer/ready" element={<BalanceTransferReady />} />
            <Route path="balance-transfer/application-portal" element={<BalanceTransferApplicationPortal />} />
            <Route path="balance-transfer/application-portal/income-documents" element={<BalanceTransferIncomeDocuments />} />
            <Route path="balance-transfer/application-portal/existing-loan-documents" element={<BalanceTransferExistingLoanDocuments />} />
            <Route path="balance-transfer/application-portal/co-applicant-details" element={<BalanceTransferCoApplicantDetails />} />
            <Route path="balance-transfer/application-portal/review-submit" element={<BalanceTransferReviewSubmit />} />
            <Route path="balance-transfer/application-portal/submitted" element={<BalanceTransferSubmitted />} />

            <Route path="itr-filing" element={<ITRFiling />} />
            <Route path="company-registration" element={<CompanyRegistration />} />
            <Route path="gst-registration" element={<GstRegistration />} />
            <Route path="udyam-msme-registration" element={<UdyamMsmeRegistration />} />
            <Route path="food-license" element={<FoodLicense />} />
            <Route path="pan-aadhaar-linking" element={<PanAadhaarLinking />} />

            {/* 404 */}
            <Route
              path="*"
              element={
                <h1 className="p-10 text-center text-2xl">
                  404 - Page Not Found
                </h1>
              }
            />
          </Route>

        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
