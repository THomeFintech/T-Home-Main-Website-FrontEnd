import { useEffect, useMemo, useState } from "react";

const BASE_URL = import.meta.env.VITE_API_URL;

function Icon({ type = "bell", className = "w-5 h-5" }) {
  const common = {
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className,
  };

  switch (type) {
    case "application":
      return (
        <svg {...common}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <path d="M8 13h8M8 17h6" />
        </svg>
      );

    case "approved":
    case "success":
      return (
        <svg {...common}>
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      );

    case "rejected":
    case "error":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="m9 9 6 6M15 9l-6 6" />
        </svg>
      );

    case "document":
    case "documents":
      return (
        <svg {...common}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <path d="M8 13h8M8 17h5" />
        </svg>
      );

    case "emi":
    case "payment":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M16 3v4M8 3v4M3 10h18" />
          <path d="M8 15h3M8 18h6" />
        </svg>
      );

    case "advisor":
      return (
        <svg {...common}>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21a8 8 0 0 1 16 0" />
        </svg>
      );

    case "security":
      return (
        <svg {...common}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      );

    case "warning":
      return (
        <svg {...common}>
          <path d="M10.3 3.5 2.4 17a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.5a2 2 0 0 0-3.4 0z" />
          <path d="M12 9v4M12 17h.01" />
        </svg>
      );

    default:
      return (
        <svg {...common}>
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      );
  }
}

function getNotificationType(type = "") {
  const value = String(type).toLowerCase();

  if (
    value.includes("approve") ||
    value.includes("success") ||
    value.includes("paid") ||
    value.includes("verified") ||
    value.includes("disburs")
  ) {
    return {
      icon: "success",
      iconColor: "text-emerald-400",
      iconBg: "rgba(16,185,129,0.12)",
      iconBorder: "rgba(16,185,129,0.25)",
    };
  }

  if (
    value.includes("reject") ||
    value.includes("failed") ||
    value.includes("overdue")
  ) {
    return {
      icon: "error",
      iconColor: "text-red-400",
      iconBg: "rgba(239,68,68,0.10)",
      iconBorder: "rgba(239,68,68,0.22)",
    };
  }

  if (
    value.includes("document") ||
    value.includes("kyc") ||
    value.includes("income")
  ) {
    return {
      icon: "document",
      iconColor: "text-indigo-400",
      iconBg: "rgba(99,102,241,0.12)",
      iconBorder: "rgba(99,102,241,0.25)",
    };
  }

  if (value.includes("emi") || value.includes("payment")) {
    return {
      icon: "emi",
      iconColor: "text-blue-400",
      iconBg: "rgba(59,130,246,0.12)",
      iconBorder: "rgba(80,130,220,0.22)",
    };
  }

  if (value.includes("advisor")) {
    return {
      icon: "advisor",
      iconColor: "text-purple-400",
      iconBg: "rgba(168,85,247,0.10)",
      iconBorder: "rgba(168,85,247,0.22)",
    };
  }

  if (
    value.includes("security") ||
    value.includes("login") ||
    value.includes("password")
  ) {
    return {
      icon: "security",
      iconColor: "text-amber-400",
      iconBg: "rgba(245,158,11,0.10)",
      iconBorder: "rgba(245,158,11,0.22)",
    };
  }

  if (value.includes("warning") || value.includes("required")) {
    return {
      icon: "warning",
      iconColor: "text-amber-400",
      iconBg: "rgba(245,158,11,0.10)",
      iconBorder: "rgba(245,158,11,0.22)",
    };
  }

  if (
    value.includes("application") ||
    value.includes("loan") ||
    value.includes("submitted") ||
    value.includes("review")
  ) {
    return {
      icon: "application",
      iconColor: "text-blue-400",
      iconBg: "rgba(59,130,246,0.12)",
      iconBorder: "rgba(80,130,220,0.22)",
    };
  }

  return {
    icon: "bell",
    iconColor: "text-blue-400",
    iconBg: "rgba(59,130,246,0.12)",
    iconBorder: "rgba(80,130,220,0.22)",
  };
}

function formatDate(date) {
  if (!date) return "";

  try {
    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const [filter, setFilter] = useState("all");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [markingId, setMarkingId] = useState(null);

  async function fetchNotifications() {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("access_token");

      console.log("Notification API URL:", BASE_URL);
      console.log("Access token exists:", !!token);

      if (!BASE_URL) {
        throw new Error(
          "VITE_API_URL is missing. Check your frontend .env file.",
        );
      }

      if (!token) {
        throw new Error("Access token is missing. Please log in again.");
      }

      const url = `${BASE_URL}/dashboard/notifications`;

      console.log("Fetching notifications from:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Notification response status:", response.status);

      const text = await response.text();

      console.log("Notification response:", text);

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(
          `Backend returned a non-JSON response. HTTP status: ${response.status}`,
        );
      }

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.detail ||
            `Request failed with HTTP ${response.status}`,
        );
      }

      setNotifications(
        Array.isArray(data.notifications) ? data.notifications : [],
      );

      setUnreadCount(Number(data.unread_count || 0));
    } catch (err) {
      console.error("Notifications Error:", err);

      setError(err.message || "Unable to load notifications.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchNotifications();
  }, []);

  async function markAsRead(notification) {
    if (notification.is_read) return;

    try {
      setMarkingId(notification.id);

      const token = localStorage.getItem("access_token");

      const response = await fetch(
        `${BASE_URL}/dashboard/notifications/${notification.id}/read`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to mark notification as read");
      }

      setNotifications((current) =>
        current.map((item) =>
          item.id === notification.id ? { ...item, is_read: true } : item,
        ),
      );

      setUnreadCount((count) => Math.max(0, count - 1));
    } catch (err) {
      console.error("Mark notification error:", err);
    } finally {
      setMarkingId(null);
    }
  }

  const filteredNotifications = useMemo(() => {
    if (filter === "unread") {
      return notifications.filter((notification) => !notification.is_read);
    }

    if (filter === "read") {
      return notifications.filter((notification) => notification.is_read);
    }

    return notifications;
  }, [notifications, filter]);

  return (
    <div
      className="min-h-screen text-slate-100 font-sans pt-28 sm:pt-32 md:pt-36 lg:pt-36 pb-10 px-4 sm:px-6 lg:px-8"
      style={{
        background:
          "radial-gradient(1200px 680px at 20% -10%, rgba(90,140,255,0.18), transparent 62%), radial-gradient(980px 580px at 100% 0%, rgba(36,107,198,0.14), transparent 60%), linear-gradient(180deg, #071327 0%, #08162b 100%)",
      }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Notifications
            </h1>

            <p className="text-sm text-slate-400 mt-1">
              Stay updated with your application, loan, EMI and account
              activity.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div
              className="px-3 py-2 rounded-xl text-xs font-semibold text-blue-300"
              style={{
                background: "rgba(59,130,246,0.10)",
                border: "1px solid rgba(80,130,220,0.20)",
              }}
            >
              {unreadCount} unread
            </div>
          </div>
        </div>

        {/* Filters */}
        <div
          className="flex flex-wrap items-center gap-2 p-2 rounded-2xl mb-5"
          style={{
            background:
              "linear-gradient(145deg, rgba(16,30,54,0.72) 0%, rgba(10,20,40,0.68) 100%)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(80,130,220,0.16)",
          }}
        >
          {[
            ["all", "All"],
            ["unread", "Unread"],
            ["read", "Read"],
          ].map(([value, label]) => {
            const active = filter === value;

            return (
              <button
                key={value}
                type="button"
                onClick={() => setFilter(value)}
                className="px-4 py-2 rounded-xl text-xs font-semibold transition-all"
                style={{
                  color: active ? "#fff" : "rgb(148 163 184)",
                  background: active
                    ? "linear-gradient(90deg,#3b82f6,#6366f1)"
                    : "transparent",
                  boxShadow: active
                    ? "0 4px 14px rgba(59,130,246,0.20)"
                    : "none",
                }}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Loading */}
        {loading && (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="rounded-2xl p-5 animate-pulse"
                style={{
                  background:
                    "linear-gradient(145deg, rgba(16,30,54,0.82) 0%, rgba(10,20,40,0.78) 100%)",
                  border: "1px solid rgba(80,130,220,0.18)",
                }}
              >
                <div className="flex gap-4">
                  <div className="w-11 h-11 rounded-xl bg-slate-700/40" />

                  <div className="flex-1 space-y-3">
                    <div className="h-4 w-48 rounded bg-slate-700/40" />
                    <div className="h-3 w-full max-w-xl rounded bg-slate-700/30" />
                    <div className="h-3 w-24 rounded bg-slate-700/30" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div
            className="rounded-2xl p-8 text-center"
            style={{
              background:
                "linear-gradient(145deg, rgba(16,30,54,0.82) 0%, rgba(10,20,40,0.78) 100%)",
              backdropFilter: "blur(24px) saturate(160%)",
              WebkitBackdropFilter: "blur(24px) saturate(160%)",
              border: "1px solid rgba(80,130,220,0.18)",
              boxShadow:
                "0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(120,170,255,0.12)",
            }}
          >
            <div className="mx-auto w-12 h-12 rounded-full flex items-center justify-center text-red-400 bg-red-500/10 border border-red-500/20">
              <Icon type="warning" className="w-6 h-6" />
            </div>

            <h2 className="mt-4 text-base font-semibold text-white">
              Unable to load notifications
            </h2>

            <p className="mt-1 text-sm text-red-300 break-words">{error}</p>

            <button
              type="button"
              onClick={fetchNotifications}
              className="mt-5 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
              style={{
                background: "linear-gradient(90deg,#3b82f6,#6366f1)",
                boxShadow: "0 4px 14px rgba(59,130,246,0.25)",
              }}
            >
              Retry
            </button>
          </div>
        )}

        {/* Notifications */}
        {!loading && !error && (
          <>
            {filteredNotifications.length > 0 ? (
              <div className="space-y-3">
                {filteredNotifications.map((notification) => {
                  const style = getNotificationType(notification.type);

                  const unread = !notification.is_read;

                  return (
                    <button
                      key={notification.id}
                      type="button"
                      onClick={() => markAsRead(notification)}
                      disabled={markingId === notification.id}
                      className="w-full text-left rounded-2xl p-5 transition-all duration-200 hover:-translate-y-[1px]"
                      style={{
                        background:
                          "linear-gradient(145deg, rgba(16,30,54,0.82) 0%, rgba(10,20,40,0.78) 100%)",
                        backdropFilter: "blur(24px) saturate(160%)",
                        WebkitBackdropFilter: "blur(24px) saturate(160%)",
                        border: unread
                          ? "1px solid rgba(80,130,220,0.38)"
                          : "1px solid rgba(80,130,220,0.14)",
                        boxShadow: unread
                          ? "0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(120,170,255,0.12), 0 0 20px rgba(59,130,246,0.05)"
                          : "0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(120,170,255,0.07)",
                        opacity: markingId === notification.id ? 0.6 : 1,
                      }}
                    >
                      <div className="flex gap-4">
                        {/* Icon */}
                        <div
                          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{
                            background: style.iconBg,
                            border: `1px solid ${style.iconBorder}`,
                          }}
                        >
                          <span className={style.iconColor}>
                            <Icon type={style.icon} className="w-5 h-5" />
                          </span>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3">
                            <h3
                              className={`text-sm font-semibold ${
                                unread ? "text-white" : "text-slate-300"
                              }`}
                            >
                              {notification.title}
                            </h3>

                            {unread && (
                              <span
                                className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1.5"
                                style={{
                                  boxShadow: "0 0 8px rgba(59,130,246,0.7)",
                                }}
                              />
                            )}
                          </div>

                          <p
                            className={`text-sm mt-1 leading-6 ${
                              unread ? "text-slate-300" : "text-slate-500"
                            }`}
                          >
                            {notification.message}
                          </p>

                          <div className="flex flex-wrap items-center gap-2 mt-3">
                            <span className="text-xs text-slate-500">
                              {notification.time_ago ||
                                formatDate(notification.created_at)}
                            </span>

                            {notification.type && (
                              <>
                                <span className="text-slate-700">•</span>

                                <span className="text-[10px] uppercase tracking-wide text-slate-500">
                                  {notification.type}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              /* Empty State */
              <div
                className="rounded-2xl p-12 text-center"
                style={{
                  background:
                    "linear-gradient(145deg, rgba(16,30,54,0.82) 0%, rgba(10,20,40,0.78) 100%)",
                  backdropFilter: "blur(24px) saturate(160%)",
                  WebkitBackdropFilter: "blur(24px) saturate(160%)",
                  border: "1px solid rgba(80,130,220,0.18)",
                  boxShadow:
                    "0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(120,170,255,0.12)",
                }}
              >
                <div
                  className="mx-auto w-14 h-14 rounded-full flex items-center justify-center text-blue-400"
                  style={{
                    background: "rgba(59,130,246,0.10)",
                    border: "1px solid rgba(80,130,220,0.20)",
                  }}
                >
                  <Icon type="bell" className="w-7 h-7" />
                </div>

                <h2 className="mt-5 text-lg font-semibold text-white">
                  You're all caught up
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {filter === "all"
                    ? "You don't have any notifications right now."
                    : `You don't have any ${filter} notifications.`}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
