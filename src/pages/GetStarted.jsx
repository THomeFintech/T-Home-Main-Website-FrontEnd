import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GoogleAuthButton from "../components/GoogleAuthButton";
import "../App.css";

/* ══════════════════════════════════════
   SHARED CARD SHELL
══════════════════════════════════════ */
function CardShell({ children, compactLogo, withSideImage = false }) {
  if (withSideImage) {
    return (
      <div className="app-bg">
        <div className="card-container card-auth-container">
          <div className="card-auth-inner">
            <div className="card-auth-left">
              <img src="/home/Login.png" alt="T-HOME" className="card-auth-illustration" />
            </div>
            <div className="card-auth-right">
              <div className={`logo-area${compactLogo ? " logo-sm" : ""}`}>
                <div className={`logo-ring${compactLogo ? " logo-ring-sm" : ""}`}>
                  <img src="/home/logo.png" alt="T-HOME" className="logo-img" />
                </div>
              </div>
              {children}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-bg">
      <div className="card-container">
        <div className="card-inner">
          <div className="panel-left-dark" />
          <div className={`logo-area${compactLogo ? " logo-sm" : ""}`}>
            <div className={`logo-ring${compactLogo ? " logo-ring-sm" : ""}`}>
              <img src="/home/logo.png" alt="T-HOME" className="logo-img" />
            </div>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   LANDING PAGE
══════════════════════════════════════ */
function LandingPage({ onGetStarted, onSignIn }) {
  return (
    <CardShell>
      <div className="landing-content">
        <h1 className="landing-title">T-HOME</h1>
        <p className="landing-tagline">
          From <span className="hl">Dreams</span> to Real <span className="hl">Homes</span>
        </p>
        <p className="landing-sub">
          Experience Fast, Secure, and Hassle-free Loan, Tax and Business related Services.
        </p>
        <div className="landing-btns">
          <button className="btn-get-started" onClick={onGetStarted}>
            Let's Get Started &nbsp;→
          </button>
          <button className="btn-sign-in" onClick={onSignIn}>
            Sign In
          </button>
        </div>
      </div>
      <div className="landing-footer">
        <button className="footer-btn">Privacy Policy</button>
        <button className="footer-btn">Terms &amp; Conditions</button>
      </div>
    </CardShell>
  );
}

/* ══════════════════════════════════════
   LOGIN PAGE
══════════════════════════════════════ */
function LoginPage({ onBack, onLogin }) {
  const [showPw, setShowPw] = useState(false);
  const [email, setEmail] = useState("");

  return (
    <CardShell compactLogo>
      <div className="signup-wrap">
        <h1 className="signup-title">T-HOME</h1>
        <p className="signup-headline">Welcome back!</p>

        <div className="field">
          <label className="field-lbl">Email</label>
          <div className="input-box">
            <IconMail />
            <input
              className="inp"
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="field">
          <label className="field-lbl">Password</label>
          <div className="input-box input-glass">
            <IconLock />
            <input
              className="inp inp-glass"
              type={showPw ? "text" : "password"}
              placeholder="Enter your password"
            />
            <button className="eye-btn" onClick={() => setShowPw(!showPw)} type="button">
              {showPw ? <IconEyeOff /> : <IconEye />}
            </button>
          </div>
        </div>

        <div style={{ width: "100%", textAlign: "right", marginBottom: "1rem" }}>
          <button className="txt-link" style={{ fontSize: "0.84rem" }}>Forgot password?</button>
        </div>

        <button className="btn-continue" onClick={() => onLogin(email || "user@gmail.com")}>
          Login
        </button>

        <div className="divider">
          <span className="div-line" />
          <span className="div-label">OR LOGIN WITH</span>
          <span className="div-line" />
        </div>

        <div className="social-row">
          <button className="soc-btn"><IconFacebook /></button>
          <GoogleAuthButton className="soc-btn" iconOnly={true} />
          <button className="soc-btn"><IconApple /></button>
        </div>

        <p className="already-row">
          Don&apos;t have an account?{" "}
          <button className="txt-link txt-link-bold" onClick={onBack}>
            Sign Up
          </button>
        </p>
      </div>
    </CardShell>
  );
}

/* ══════════════════════════════════════
   SIGNUP PAGE — with API call
══════════════════════════════════════ */
function SignupPage({ onLogin, onContinue }) {
  const [showPw, setShowPw] = useState(false);
  const [showRePw, setShowRePw] = useState(false);
  const [agreed, setAgreed] = useState(true);
  const [loading, setLoading] = useState(false);

  // ✅ All fields tracked in state
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleContinue = async () => {
    if (!form.fullName || !form.email || !form.phone || !form.password || !form.confirmPassword) {
      alert("Please fill in all fields");
      return;
    }
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    if (!agreed) {
      alert("Please accept the Terms and Privacy Policy");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.fullName,
          email: form.email,
          phone: form.phone,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.detail || "Registration failed");
        return;
      }

      // ✅ Pass email up so OTP page knows where code was sent
      onContinue(form.email);

    } catch (error) {
      console.error("Register error:", error);
      alert("Registration failed. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CardShell compactLogo withSideImage>
      <div className="signup-wrap">
        <h1 className="signup-title">T-HOME</h1>
        <p className="signup-headline">Create your account!</p>

        <div className="field">
          <label className="field-lbl">Full Name</label>
          <div className="input-box">
            <IconUser />
            <input
              className="inp"
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
            />
          </div>
        </div>

        <div className="field">
          <label className="field-lbl">Email</label>
          <div className="input-box">
            <IconMail />
            <input
              className="inp"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email address"
            />
          </div>
        </div>

        <div className="field">
          <label className="field-lbl">Phone Number</label>
          <div className="input-box">
            <IconPhone />
            <input
              className="inp"
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Enter your mobile number"
            />
          </div>
        </div>

        <div className="field">
          <label className="field-lbl">Password</label>
          <div className="input-box input-glass">
            <IconLock />
            <input
              className="inp inp-glass"
              type={showPw ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Minimum 8 characters"
            />
            <button className="eye-btn" onClick={() => setShowPw(!showPw)} type="button">
              {showPw ? <IconEyeOff /> : <IconEye />}
            </button>
          </div>
        </div>

        <div className="field">
          <label className="field-lbl">Re-Enter Password</label>
          <div className="input-box input-glass">
            <IconLock />
            <input
              className="inp inp-glass"
              type={showRePw ? "text" : "password"}
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your password"
            />
            <button className="eye-btn" onClick={() => setShowRePw(!showRePw)} type="button">
              {showRePw ? <IconEyeOff /> : <IconEye />}
            </button>
          </div>
        </div>

        <div className="agree-row">
          <div className={`chk${agreed ? " chk-on" : ""}`} onClick={() => setAgreed(!agreed)}>
            {agreed && <IconCheck />}
          </div>
          <p className="agree-txt">
            I agree to <button className="txt-link">Terms</button> and{" "}
            <button className="txt-link">Privacy Policy</button> and want a simple, secure registration experience.
          </p>
        </div>

        <button className="btn-continue" onClick={handleContinue} disabled={loading}>
          {loading ? "Please wait..." : "Continue"}
        </button>

        <div className="divider">
          <span className="div-line" />
          <span className="div-label">OR SIGNUP WITH</span>
          <span className="div-line" />
        </div>

        <div className="social-row">
          <button className="soc-btn"><IconFacebook /></button>         
          <GoogleAuthButton className="soc-btn" iconOnly={true} />
          <button className="soc-btn"><IconApple /></button>
        </div>

        <p className="already-row">
          Already have an account?{" "}
          <button className="txt-link txt-link-bold" onClick={onLogin}>
            Login
          </button>
        </p>
      </div>
    </CardShell>
  );
}

/* ══════════════════════════════════════
   OTP PAGE — with API call
══════════════════════════════════════ */
function OtpPage({ email, onVerify, onBack }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(43);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0)
      inputRefs.current[index - 1]?.focus();
  };

  // ✅ Hits verify-otp API
  const handleVerify = async () => {
    const otpString = otp.join("");
    if (otpString.length < 6) {
      alert("Please enter the complete 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otpString }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.detail || "OTP verification failed");
        return;
      }

      onVerify(); // navigate to home / dashboard
    } catch (error) {
      console.error("OTP verify error:", error);
      alert("Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CardShell compactLogo withSideImage>
      <div className="otp-wrap">
        <h1 className="signup-title">T-HOME</h1>
        <h2 className="otp-heading">Enter OTP</h2>
        <p className="otp-sub">
          We sent a 6-digit verification code to{" "}
          <span className="otp-email">{email}</span>
          <br />
          Enter it below to continue securely
        </p>

        <div className="otp-field-label">Verification code</div>
        <div className="otp-boxes">
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => (inputRefs.current[i] = el)}
              className={`otp-box${digit ? " otp-box-filled" : ""}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
            />
          ))}
        </div>

        <div className="otp-timer-row">
          <span className="otp-timer-txt">Code expires in {formatTime(timer)}</span>
          <button
            className="txt-link otp-resend"
            onClick={() => { setOtp(["","","","","",""]); setTimer(43); inputRefs.current[0]?.focus(); }}
          >
            Resend code
          </button>
        </div>

        <button className="btn-continue" onClick={handleVerify} disabled={loading}>
          {loading ? "Verifying..." : "Verify & Continue"}
        </button>

        <button className="btn-back" onClick={onBack}>← &nbsp; Back to Register</button>

        <div className="otp-notice">
          <IconLockSmall />
          <span>Your verification code is encrypted and used only for this sign-in session.</span>
        </div>
      </div>
    </CardShell>
  );
}

/* ══════════════════════════════════════
   ROOT EXPORT
══════════════════════════════════════ */
export default function GetStarted({ initialPage = "landing" }) {
  const navigate = useNavigate();
  const [page, setPage] = useState(initialPage);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    setPage(initialPage);
  }, [initialPage]);

  const completeAuth = () => {
    navigate("/login");
  };

  if (page === "login") {
    if (initialPage === "login") {
      return (
        <LoginPage
          onBack={() => setPage("landing")}
          onLogin={() => {
            localStorage.setItem("isLoggedIn", "true");
            window.dispatchEvent(new Event("authChange"));
            navigate("/");
          }}
        />
      );
    }
    return (
      <LoginPage
        onBack={() => setPage("landing")}
        onLogin={() => {
          sessionStorage.setItem("isLoggedIn", "true");
          window.dispatchEvent(new Event("authChange"));
          navigate("/");
        }}
      />
    );
  }

  if (page === "signup") {
    return (
      <SignupPage
        onLogin={() => setPage("login")}
        onContinue={(email) => { setUserEmail(email); setPage("otp"); }}
      />
    );
  }

  if (page === "otp") {
    return (
      <OtpPage
        email={userEmail}
        onVerify={completeAuth}
        onBack={() => setPage("signup")}
      />
    );
  }

  return (
    <LandingPage
      onGetStarted={() => setPage("signup")}
       onSignIn={() => navigate("/login")} 
    />
  );
}

/* ══════════════════════════════════════
   ICONS
══════════════════════════════════════ */
const IconUser = () => (
  <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);
const IconMail = () => (
  <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="m22 7-10 6L2 7"/>
  </svg>
);
const IconPhone = () => (
  <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.42 2 2 0 0 1 3.58 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.56a16 16 0 0 0 5.5 5.5l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z"/>
  </svg>
);
const IconLock = () => (
  <svg className="ico ico-glass" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const IconEye = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);
const IconEyeOff = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);
const IconCheck = () => (
  <svg width="12" height="12" viewBox="0 0 12 12">
    <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconLockSmall = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{flexShrink:0,marginTop:'1px'}}>
    <rect x="3" y="11" width="18" height="11" rx="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const IconFacebook = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="#1877F2">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);
const IconGoogle = () => (
  <svg width="22" height="22" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);
const IconApple = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
  </svg>
);