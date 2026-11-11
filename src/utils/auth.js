// Unified Authentication Utilities for T-HOME Fintech
// Ensures single source of truth and full synchronization between sessionStorage and localStorage

export const getAuthToken = () => {
  try {
    return (
      sessionStorage.getItem("access_token") ||
      sessionStorage.getItem("token") ||
      localStorage.getItem("access_token") ||
      localStorage.getItem("token") ||
      null
    );
  } catch {
    return null;
  }
};

export const getAuthUser = () => {
  try {
    const raw =
      sessionStorage.getItem("user") ||
      localStorage.getItem("user") ||
      "{}";
    return JSON.parse(raw);
  } catch {
    return {};
  }
};

export const isUserLoggedIn = () => {
  try {
    const hasToken = !!getAuthToken();
    const sessionFlag = sessionStorage.getItem("isLoggedIn") === "true";
    const localFlag = localStorage.getItem("isLoggedIn") === "true";
    return hasToken || sessionFlag || localFlag;
  } catch {
    return false;
  }
};

export const setAuthSession = ({ token, user }) => {
  try {
    if (token) {
      sessionStorage.setItem("access_token", token);
      sessionStorage.setItem("token", token);
      localStorage.setItem("access_token", token);
      localStorage.setItem("token", token);
    }
    if (user) {
      const userStr = typeof user === "string" ? user : JSON.stringify(user);
      sessionStorage.setItem("user", userStr);
      localStorage.setItem("user", userStr);
    }
    sessionStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("isLoggedIn", "true");

    // Notify all open tabs and components
    window.dispatchEvent(new Event("authChange"));
  } catch (err) {
    console.error("Failed to store auth session:", err);
  }
};

export const clearAuthSession = () => {
  try {
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("refresh_token");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("isLoggedIn");

    localStorage.removeItem("access_token");
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");

    // Clear legacy digilocker session keys that might cause confusion
    localStorage.removeItem("digilocker_verified_identity");

    // Dispatch event to update navbar and dependent components immediately
    window.dispatchEvent(new Event("authChange"));
  } catch (err) {
    console.error("Failed to clear auth session:", err);
  }
};

export const getSafeReturnUrl = (location) => {
  try {
    const searchString = location?.search || window.location.search;
    const params = new URLSearchParams(searchString);
    const redirectParam = params.get("redirect") || params.get("return_url") || params.get("from");
    const stored = localStorage.getItem("digilocker_return_url");
    const stateFrom = location?.state?.from;

    const candidate = redirectParam || stateFrom || stored;
    if (stored) {
      localStorage.removeItem("digilocker_return_url");
    }

    if (
      candidate &&
      typeof candidate === "string" &&
      candidate.startsWith("/") &&
      !candidate.startsWith("//")
    ) {
      return candidate;
    }
  } catch (err) {
    console.error("Failed to parse return URL:", err);
  }
  return "/";
};
