import React from "react";

/* ══════════════════════════════════════
   SHARED CARD SHELL
   Extracted from GetStarted.jsx so Login/Register/
   ForgotPassword/VerifyResetOtp/ResetPassword all
   share the exact same look & feel.
   Relies on the classes already defined in App.css
   (app-bg, card-container, card-auth-container, etc.)
══════════════════════════════════════ */
export default function AuthCardShell({ children, compactLogo, withSideImage = false }) {
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
