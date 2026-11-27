const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

function getToken() {
  return localStorage.getItem("superadmin_token") || null;
}

function getAuthHeaders() {
  const headers = {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  };

  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

async function handleResponse(response) {
  const data = await response.json().catch(() => null);

  if (response.status === 401) {
    localStorage.removeItem("superadmin_token");
    localStorage.removeItem("superadmin_admin");
    localStorage.removeItem("superadmin_logged_in");
    localStorage.removeItem("superadmin_authenticated");

    window.location.href = "/super-admin";

    throw new Error(
      data?.message || "Your session has expired."
    );
  }

  if (!response.ok) {
    throw new Error(
      data?.message ||
        `Request failed with status ${response.status}`
    );
  }

  return data;
}

async function adminFetch(endpoint, options = {}) {
  const url = endpoint.startsWith("http") ? endpoint : `${API_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      ...getAuthHeaders(),
      ...(options.headers || {}),
    },
  });

  return handleResponse(response);
}

/* =========================================================
   DASHBOARD
========================================================= */

export async function getDashboardStats() {
  return adminFetch("/super-admin/dashboard", { method: "GET" });
}

/* =========================================================
   DOCUMENTS
========================================================= */

export async function getDocuments() {
  return adminFetch("/super-admin/documents", { method: "GET" });
}

/* =========================================================
   APPLICATION
========================================================= */

export async function getApplication(id) {
  return adminFetch(`/super-admin/applications/${id}`, { method: "GET" });
}

/* =========================================================
   DOCUMENT STATUS
========================================================= */

export async function updateDocumentStatus(
  documentId,
  status,
  notes = ""
) {
  return adminFetch(`/super-admin/documents/${documentId}/status`, {
    method: "PATCH",
    body: JSON.stringify({
      status,
      notes,
    }),
  });
}

/* =========================================================
   APPLICATION DECISION
========================================================= */

export async function updateApplicationDecision(
  applicationId,
  decision
) {
  return adminFetch(`/super-admin/applications/${applicationId}/decision`, {
    method: "PATCH",
    body: JSON.stringify({
      decision,
    }),
  });
}

export async function getDocumentPreviewUrl(documentId) {
  return `${API_URL}/super-admin/documents/${encodeURIComponent(
    documentId
  )}/view`;
}

/* =========================================================
   LEADS MANAGEMENT
========================================================= */

export async function getLeads(params = {}) {
  const query = new URLSearchParams();
  if (params.service && params.service !== "All") query.append("service", params.service);
  if (params.status && params.status !== "All") query.append("status", params.status);
  if (params.search) query.append("search", params.search);

  const url = `/super-admin/leads${query.toString() ? `?${query.toString()}` : ""}`;
  return adminFetch(url, { method: "GET" });
}

export async function updateLead(id, data) {
  return adminFetch(`/super-admin/leads/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

/* =========================================================
   BALANCE TRANSFER & LPS
========================================================= */

export async function getBtAndLps() {
  return adminFetch("/super-admin/bt-lps", { method: "GET" });
}

/* =========================================================
   BANK FORWARDING TRACKER
========================================================= */

export async function getBankForwarding() {
  return adminFetch("/super-admin/bank-forwarding", { method: "GET" });
}

export async function updateBankForwarding(id, data) {
  return adminFetch(`/super-admin/bank-forwarding/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

/* =========================================================
   CUSTOMER DIRECTORY (USERS)
========================================================= */

export async function getUsersList(params = {}) {
  const query = new URLSearchParams();
  if (params.status && params.status !== "All") query.append("status", params.status);
  if (params.search) query.append("search", params.search);

  const url = `/super-admin/users${query.toString() ? `?${query.toString()}` : ""}`;
  return adminFetch(url, { method: "GET" });
}

export async function updateUserStatus(id, isActive) {
  return adminFetch(`/super-admin/users/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ isActive }),
  });
}

/* =========================================================
   REPORTS & ANALYTICS
========================================================= */

export async function getReportsData() {
  return adminFetch("/super-admin/reports", { method: "GET" });
}

/* =========================================================
   SETTINGS & SUPER ADMINS
========================================================= */

export async function getSettingsData() {
  return adminFetch("/super-admin/settings", { method: "GET" });
}

export async function updateAdminActiveStatus(id, isActive) {
  return adminFetch(`/super-admin/settings/admin/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ isActive }),
  });
}

/* =========================================================
   AUDIT LOGS
========================================================= */

export async function getAuditLogs(params = {}) {
  const query = new URLSearchParams();
  if (params.limit) query.append("limit", params.limit);
  if (params.entityType) query.append("entityType", params.entityType);
  if (params.action) query.append("action", params.action);

  const url = `/super-admin/audit-logs${
    query.toString() ? `?${query.toString()}` : ""
  }`;
  return adminFetch(url, { method: "GET" });
}

/* =========================================================
   CAREER OPENINGS
========================================================= */

export async function getCareerOpenings(params = {}) {
  const query = new URLSearchParams();
  if (params.search) query.append("search", params.search);
  if (params.department) query.append("department", params.department);
  if (params.employmentType) query.append("employmentType", params.employmentType);
  if (params.status) query.append("status", params.status);

  const url = `/super-admin/careers${
    query.toString() ? `?${query.toString()}` : ""
  }`;
  return adminFetch(url, { method: "GET" });
}

export async function getCareerOpening(id) {
  return adminFetch(`/super-admin/careers/${id}`, { method: "GET" });
}

export async function createCareerOpening(data) {
  return adminFetch("/super-admin/careers", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateCareerOpening(id, data) {
  return adminFetch(`/super-admin/careers/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function toggleCareerOpeningStatus(id, isActive) {
  return adminFetch(`/super-admin/careers/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ is_active: isActive }),
  });
}

export async function deleteCareerOpening(id) {
  return adminFetch(`/super-admin/careers/${id}`, { method: "DELETE" });
}
