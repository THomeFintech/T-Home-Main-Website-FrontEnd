import React, {
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
  useCallback,
} from "react";

const TURNSTILE_SCRIPT_URL =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

let scriptPromise = null;

function loadTurnstileScript() {
  if (window.turnstile) {
    return Promise.resolve(window.turnstile);
  }

  if (scriptPromise) {
    return scriptPromise;
  }

  scriptPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector(
      `script[src^="${TURNSTILE_SCRIPT_URL}"]`
    );

    if (existingScript) {
      if (window.turnstile) {
        resolve(window.turnstile);
        return;
      }
      existingScript.addEventListener("load", () => resolve(window.turnstile));
      existingScript.addEventListener("error", () =>
        reject(new Error("Failed to load Cloudflare Turnstile script."))
      );
      return;
    }

    const script = document.createElement("script");
    script.src = TURNSTILE_SCRIPT_URL;
    script.async = true;
    script.defer = true;
    script.id = "cf-turnstile-script";

    script.onload = () => {
      if (window.turnstile) {
        resolve(window.turnstile);
      } else {
        reject(new Error("Turnstile loaded but window.turnstile not found."));
      }
    };

    script.onerror = () => {
      scriptPromise = null;
      reject(new Error("Failed to connect to Cloudflare Turnstile service."));
    };

    document.head.appendChild(script);
  });

  return scriptPromise;
}

const TurnstileWidget = forwardRef(function TurnstileWidget(
  {
    onSuccess,
    onError,
    onExpire,
    theme = "dark",
    size = "normal",
    action,
    className = "",
    siteKey: propSiteKey,
  },
  ref
) {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);
  const [loadError, setLoadError] = useState(null);
  const [isReady, setIsReady] = useState(false);

  // Keep stable references to callback props to prevent re-render loops
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);
  const onExpireRef = useRef(onExpire);

  useEffect(() => {
    onSuccessRef.current = onSuccess;
    onErrorRef.current = onError;
    onExpireRef.current = onExpire;
  });

  // Read site key from props or Vite environment variable
  const siteKey =
    propSiteKey || import.meta.env.VITE_TURNSTILE_SITE_KEY;

  const reset = useCallback(() => {
    if (window.turnstile && widgetIdRef.current) {
      try {
        window.turnstile.reset(widgetIdRef.current);
      } catch (err) {
        console.warn("Error resetting Turnstile widget:", err);
      }
    }
  }, []);

  const getResponse = useCallback(() => {
    if (window.turnstile && widgetIdRef.current) {
      try {
        return window.turnstile.getResponse(widgetIdRef.current);
      } catch (err) {
        console.warn("Error getting Turnstile response:", err);
        return null;
      }
    }
    return null;
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      reset,
      getResponse,
    }),
    [reset, getResponse]
  );

  const renderWidget = useCallback(() => {
    if (!containerRef.current || !siteKey || widgetIdRef.current) return;

    loadTurnstileScript()
      .then((turnstile) => {
        if (!containerRef.current || widgetIdRef.current) return;

        containerRef.current.innerHTML = "";

        try {
          const widgetId = turnstile.render(containerRef.current, {
            sitekey: siteKey,
            theme: theme || "dark",
            size: size || "normal",
            action: action || undefined,
            callback: (token) => {
              setLoadError(null);
              setIsReady(true);
              if (typeof onSuccessRef.current === "function") {
                onSuccessRef.current(token);
              }
            },
            "error-callback": (errorCode) => {
              console.error("Turnstile challenge failed. Error code:", errorCode);
              setLoadError("Security check failed. Please try again.");
              setIsReady(false);
              if (typeof onErrorRef.current === "function") {
                onErrorRef.current(errorCode);
              }
            },
            "expired-callback": () => {
              if (typeof onExpireRef.current === "function") {
                onExpireRef.current();
              }
            },
          });

          widgetIdRef.current = widgetId;
          setLoadError(null);
          setIsReady(true);
        } catch (renderErr) {
          console.error("Error during Turnstile render:", renderErr);
        }
      })
      .catch((err) => {
        console.error("Cloudflare Turnstile initialization error:", err.message);
        setLoadError(
          "Unable to load security verification. Please check your network connection."
        );
        setIsReady(false);
      });
  }, [siteKey, theme, size, action]);

  useEffect(() => {
    let isMounted = true;
    let localWidgetId = null;

    if (!siteKey || !containerRef.current) {
      return;
    }

    loadTurnstileScript()
      .then((turnstile) => {
        // StrictMode / unmount check
        if (!isMounted || !containerRef.current || widgetIdRef.current) {
          return;
        }

        containerRef.current.innerHTML = "";

        try {
          localWidgetId = turnstile.render(containerRef.current, {
            sitekey: siteKey,
            theme: theme || "dark",
            size: size || "normal",
            action: action || undefined,
            callback: (token) => {
              if (!isMounted) return;
              setLoadError(null);
              setIsReady(true);
              if (typeof onSuccessRef.current === "function") {
                onSuccessRef.current(token);
              }
            },
            "error-callback": (errorCode) => {
              if (!isMounted) return;
              console.error("Turnstile challenge failed. Error code:", errorCode);
              setLoadError("Security check failed. Please try again.");
              setIsReady(false);
              if (typeof onErrorRef.current === "function") {
                onErrorRef.current(errorCode);
              }
            },
            "expired-callback": () => {
              if (!isMounted) return;
              if (typeof onExpireRef.current === "function") {
                onExpireRef.current();
              }
            },
          });

          if (!isMounted) {
            if (localWidgetId && window.turnstile) {
              try {
                window.turnstile.remove(localWidgetId);
              } catch (cleanupErr) {
                console.debug("StrictMode unmount cleanup:", cleanupErr);
              }
            }
            return;
          }

          widgetIdRef.current = localWidgetId;
          setLoadError(null);
          setIsReady(true);
        } catch (renderErr) {
          console.error("Error during Turnstile render:", renderErr);
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error("Cloudflare Turnstile initialization error:", err.message);
        setLoadError(
          "Unable to load security verification. Please check your network connection."
        );
        setIsReady(false);
      });

    return () => {
      isMounted = false;
      setIsReady(false);
      const idToRemove = localWidgetId || widgetIdRef.current;
      if (idToRemove && window.turnstile) {
        try {
          window.turnstile.remove(idToRemove);
        } catch (err) {
          console.debug("Widget cleanup note:", err);
        }
      }
      widgetIdRef.current = null;
    };
  }, [siteKey, theme, size, action]);

  const activeError = !siteKey ? "Turnstile site key is not configured." : loadError;

  return (
    <div
      className={`cf-turnstile-container relative my-2 flex flex-col items-center justify-center ${className}`}
      style={{ minHeight: "65px", width: "100%", maxWidth: "300px", margin: "0.5rem auto" }}
      role="region"
      aria-label="Security verification challenge"
    >
      {/* Real Turnstile Container (always in DOM with fixed footprint to prevent CLS) */}
      <div
        ref={containerRef}
        className="cf-turnstile-wrapper w-full flex justify-center"
        style={{ minHeight: "65px", minWidth: "300px" }}
      />

      {/* Subtle Fintech Skeleton Placeholder shown while loading */}
      {!isReady && !activeError && (
        <div
          className="absolute inset-0 flex items-center justify-between px-3.5 py-2.5 rounded-md border border-blue-500/25 bg-[#081a3a]/90 text-blue-200/80 shadow-inner backdrop-blur-sm pointer-events-none transition-opacity duration-200"
          style={{ width: "300px", height: "65px", boxSizing: "border-box" }}
          aria-hidden="true"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 rounded-full border-2 border-blue-400/30 border-t-blue-400 animate-spin" />
            <div className="flex flex-col text-left">
              <span className="text-xs font-semibold text-blue-100 tracking-wide">
                Verifying connection...
              </span>
              <span className="text-[10px] text-blue-300/70">
                Cloudflare Turnstile Security
              </span>
            </div>
          </div>
          <div className="flex items-center opacity-70">
            <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
        </div>
      )}

      {/* Error / Retry display */}
      {activeError && (
        <div className="mt-2 text-xs text-red-400 bg-red-950/40 border border-red-800/50 rounded px-2.5 py-1.5 flex items-center gap-2">
          <span>{activeError}</span>
          {siteKey && (
            <button
              type="button"
              onClick={() => {
                setLoadError(null);
                setIsReady(false);
                if (widgetIdRef.current && window.turnstile) {
                  try {
                    window.turnstile.reset(widgetIdRef.current);
                    setIsReady(true);
                  } catch (e) {
                    console.debug("Reset note:", e);
                    widgetIdRef.current = null;
                    renderWidget();
                  }
                } else {
                  widgetIdRef.current = null;
                  renderWidget();
                }
              }}
              className="text-blue-400 hover:text-blue-300 underline font-medium"
            >
              Retry
            </button>
          )}
        </div>
      )}
    </div>
  );
});

export default TurnstileWidget;
