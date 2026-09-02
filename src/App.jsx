import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  useParams,
  useLocation,
} from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";

const DashboardLayout = lazy(() => import("./layout/DashboardLayout"));
const Navbar = lazy(() => import("./components/Navbar"));
const Footer = lazy(() => import("./components/Footer"));
const Notifications = lazy(() => import("./pages/Notifications"));

const Register = lazy(() => import("./pages/Register"));

const BalanceTransfer = lazy(() => import("./pages/BalanceTransfer"));
const BalanceTransferDetails = lazy(
  () => import("./pages/BalanceTransferDetails"),
);
const BalanceTransferOffers = lazy(
  () => import("./pages/BalanceTransferOffers"),
);
const BalanceTransferReview = lazy(
  () => import("./pages/BalanceTransferReview"),
);
const BalanceTransferAnalysis = lazy(
  () => import("./pages/BalanceTransferAnalysis"),
);
const BalanceTransferComparison = lazy(
  () => import("./pages/BalanceTransferComparison"),
);
const BalanceTransferDetailedTable = lazy(
  () => import("./pages/BalanceTransferDetailedTable"),
);
const BalanceTransferAmortization = lazy(
  () => import("./pages/BalanceTransferAmortization"),
);
const BalanceTransferReady = lazy(() => import("./pages/BalanceTransferReady"));
const BalanceTransferApplicationPortal = lazy(
  () => import("./pages/BalanceTransferApplicationPortal"),
);
const BalanceTransferIncomeDocuments = lazy(
  () => import("./pages/BalanceTransferIncomeDocuments"),
);
const BalanceTransferExistingLoanDocuments = lazy(
  () => import("./pages/BalanceTransferExistingLoanDocuments"),
);
const BalanceTransferCoApplicantDetails = lazy(
  () => import("./pages/BalanceTransferCoApplicantDetails"),
);
const BalanceTransferReviewSubmit = lazy(
  () => import("./pages/BalanceTransferReviewSubmit"),
);
const BalanceTransferSubmitted = lazy(
  () => import("./pages/BalanceTransferSubmitted"),
);

const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const VerifyResetOtp = lazy(() => import("./pages/VerifyResetOtp"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));

// =========================
// Main Pages
// =========================

const Home = lazy(() => import("./pages/Home"));
const Services = lazy(() => import("./pages/Services"));
const Tools = lazy(() => import("./pages/Tools"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Career = lazy(() => import("./pages/Career"));
const Collaborate = lazy(() => import("./pages/Collaborate"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsAndConditions = lazy(() => import("./pages/TermsAndConditions"));
const EmployeeForm = lazy(() => import("./pages/employeeform"));
const GetStarted = lazy(() => import("./pages/GetStarted"));
const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const TrackApplication = lazy(() => import("./pages/TrackApplication"));
const DocumentsPage = lazy(() => import("./pages/DocumentsPage"));
const Profilepage = lazy(() => import("./pages/Profilepage"));
const Support = lazy(() => import("./pages/Support"));


// =========================
// Service Pages
// =========================

const HomeLoan = lazy(() => import("./pages/HomeLoan"));
const PersonalLoan = lazy(() => import("./pages/PersonalLoan"));
const LoanAgainstProperty = lazy(() => import("./pages/LoanAgainstProperty"));
const MortgageLoan = lazy(() => import("./pages/MortgageLoan"));

const BalanceTransferContact = lazy(
  () => import("./pages/BalanceTransferContact"),
);

const Emi = lazy(() => import("./pages/Emi"));
const ComingSoon = lazy(() => import("./pages/ComingSoon"));
const NotFound = lazy(() => import("./pages/NotFound"));

const ITRFiling = lazy(() => import("./pages/ITRFiling"));
const CompanyRegistration = lazy(() => import("./pages/CompanyRegistration"));
const GstRegistration = lazy(() => import("./pages/GstRegistration"));
const UdyamMsmeRegistration = lazy(
  () => import("./pages/UdyamMsmeRegistration"),
);
const FoodLicense = lazy(() => import("./pages/FoodLicense"));
const PanAadhaarLinking = lazy(() => import("./pages/PanAadhaarLinking"));

// =========================
// Lazy Loaded Components
// =========================

const Proceed = lazy(() => import("./components/Proceed"));
const LoanForm = lazy(() => import("./components/LoanForm"));
const ContactForm = lazy(() => import("./components/ContactForm"));

// =========================
// Keep Main Layout Components
// Loaded Normally
// =========================
/* =========================
   SCROLL FIX
========================= */

function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });

    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname, search]);

  return null;
}

/* =========================
   LAYOUT
========================= */

function Layout() {
  return (
    <div
      className="min-h-screen text-white flex flex-col"
      style={{
        background:
          "radial-gradient(1200px 680px at 20% -10%, rgba(90,140,255,0.18), transparent 62%), radial-gradient(980px 580px at 100% 0%, rgba(36,107,198,0.14), transparent 60%), linear-gradient(180deg, #071327 0%, #08162b 100%)",
      }}
    >
      <Navbar />

      <main className="flex-grow">
        <Outlet />
      </main>

      <Footer />

      {/* <ChatbotWidget /> */}
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
   LOADING SCREEN
========================= */

function LazyLoadingScreen() {
  return (
    <div
      className="min-h-screen flex items-center justify-center text-white"
      style={{
        background:
          "radial-gradient(1200px 680px at 20% -10%, rgba(90,140,255,0.18), transparent 62%), radial-gradient(980px 580px at 100% 0%, rgba(36,107,198,0.14), transparent 60%), linear-gradient(180deg, #071327 0%, #08162b 100%)",
      }}
    >
      <div className="flex flex-col items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-blue-400" />

        <p className="mt-3 text-sm text-white/60">Loading...</p>
      </div>
    </div>
  );
}

/* =========================
   ROUTER
========================= */

function App() {
  useEffect(() => {
    // Preload frequently used dashboard pages in the background
    import("./pages/Dashboard");
    import("./pages/TrackApplication");
    import("./pages/DocumentsPage");
  }, []);
 
  return (
    <BrowserRouter>
      {/* SCROLL FIX */}
      <ScrollToTop />

      {/* LAZY LOADING */}
      <Suspense fallback={<LazyLoadingScreen />}>
        <Routes>
            {/* =========================
                DASHBOARD ROUTES
            ========================= */}

            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />

              <Route path="/applications" element={<TrackApplication />} />

              <Route
                path="/applications/:applicationId"
                element={<TrackApplicationWithParam />}
              />

              <Route path="/documents" element={<DocumentsPage />} />

              <Route path="/profile" element={<Profilepage />} />

              <Route path="/support" element={<Support />} />
            </Route>

            {/* =========================
                MAIN LAYOUT ROUTES
            ========================= */}

            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />

              <Route path="notifications" element={<Notifications />} />

              <Route path="/balance-transfer" element={<BalanceTransfer />} />

              <Route
                path="/balance-transfer/details"
                element={<BalanceTransferDetails />}
              />

              <Route
                path="/balance-transfer/offers"
                element={<BalanceTransferOffers />}
              />

              <Route
                path="/balance-transfer/review"
                element={<BalanceTransferReview />}
              />

              <Route
                path="/balance-transfer/analysis"
                element={<BalanceTransferAnalysis />}
              />

              <Route
                path="/balance-transfer/comparison"
                element={<BalanceTransferComparison />}
              />

              <Route
                path="/balance-transfer/detailed-table"
                element={<BalanceTransferDetailedTable />}
              />

              <Route
                path="/balance-transfer/amortization"
                element={<BalanceTransferAmortization />}
              />

              <Route
                path="/balance-transfer/ready"
                element={<BalanceTransferReady />}
              />

              <Route
                path="/balance-transfer/application-portal"
                element={<BalanceTransferApplicationPortal />}
              />

              <Route
                path="/balance-transfer/application-portal/income-documents"
                element={<BalanceTransferIncomeDocuments />}
              />

              <Route
                path="/balance-transfer/application-portal/existing-loan-documents"
                element={<BalanceTransferExistingLoanDocuments />}
              />

              <Route
                path="/balance-transfer/application-portal/co-applicant-details"
                element={<BalanceTransferCoApplicantDetails />}
              />

              <Route
                path="/balance-transfer/application-portal/review-submit"
                element={<BalanceTransferReviewSubmit />}
              />

              <Route
                path="/balance-transfer/application-portal/submitted"
                element={<BalanceTransferSubmitted />}
              />

              <Route path="services" element={<Services />} />
              <Route path="tools" element={<Tools />} />
              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />
              <Route path="proceed" element={<Proceed />} />
              <Route path="career" element={<Career />} />
              <Route path="collaborate" element={<Collaborate />} />
              <Route path="privacy-policy" element={<PrivacyPolicy />} />
              <Route
                path="terms-and-conditions"
                element={<TermsAndConditions />}
              />
              <Route path="apply" element={<EmployeeForm />} />
              <Route path="/register" element={<Register />} />

              {/* SERVICE ROUTES */}
              <Route path="home-loans" element={<HomeLoan />} />
              <Route path="emi-calculator" element={<Emi />} />
              <Route path="contact-form" element={<ContactForm />} />
              <Route path="loan-form" element={<LoanForm />} />
              <Route path="coming-soon" element={<ComingSoon />} />
              <Route path="itr-filing" element={<ITRFiling />} />
              <Route
                path="pan-aadhaar-linking"
                element={<PanAadhaarLinking />}
              />
              <Route path="gst-registration" element={<GstRegistration />} />
              <Route path="food-license" element={<FoodLicense />} />
              <Route
                path="udyam-msme-registration"
                element={<UdyamMsmeRegistration />}
              />
              <Route
                path="company-registration"
                element={<CompanyRegistration />}
              />
              <Route path="personal-loans" element={<PersonalLoan />} />
              <Route
                path="loan-against-property"
                element={<LoanAgainstProperty />}
              />
              <Route path="mortgage-loan" element={<MortgageLoan />} />
              <Route path="balance-transfer" element={<BalanceTransfer />} />
              <Route
                path="balance-transfer-contact"
                element={<BalanceTransferContact />}
              />
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* AUTH ROUTES */}
            <Route path="get-started" element={<GetStarted />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-reset-otp" element={<VerifyResetOtp />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
  );
}

export default App;
