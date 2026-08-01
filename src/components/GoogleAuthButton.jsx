import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const GoogleGIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

export default function GoogleAuthButton({ className = "", iconOnly = false }) {
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    try {
      const response = await fetch(`${API_URL}/auth/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: credentialResponse.credential,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Google login failed");
        return;
      }

      localStorage.setItem("access_token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("isLoggedIn", "true");

      window.dispatchEvent(new Event("authChange"));

      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Google authentication failed.");
    }
  };

  const handleError = () => {
    alert("Google Sign-In failed.");
  };

  if (iconOnly) {
    // Google's type="icon" button intermittently renders blank (a known
    // reliability issue with the GSI script/library, not our styling).
    // Instead we render our own circular G icon for the visible UI, and
    // stack the real, reliable type="standard" button underneath it fully
    // transparent. Clicks pass through to the real button and trigger the
    // normal OAuth flow — the user only ever sees our custom icon, so the
    // visual is no longer dependent on Google's icon-button rendering.
    return (
      <div className={className} style={{ position: "relative", width: 44, height: 44 }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <GoogleGIcon />
        </div>
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0,
            overflow: "hidden",
          }}
        >
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={handleError}
            type="standard"
            theme="outline"
            size="large"
            shape="rectangular"
            text="signin"
          />
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        type="standard"
        theme="outline"
        size="large"
        shape="pill"
        text="continue_with"
      />
    </div>
  );
}