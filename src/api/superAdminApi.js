const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

function getToken() {
  return localStorage.getItem("superadmin_token");
}

async function handleResponse(response) {
  const data = await response.json().catch(() => null);

  if (response.status === 401) {
    localStorage.removeItem("superadmin_token");
    localStorage.removeItem("superadmin_admin");

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

function getAuthHeaders() {
  const token = getToken();

  if (!token) {
    throw new Error("Super Admin authentication token is missing.");
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}


/* =========================================================
   DASHBOARD
========================================================= */

export async function getDashboardStats() {
  const response = await fetch(
    `${API_URL}/super-admin/dashboard`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  return handleResponse(response);
}


/* =========================================================
   DOCUMENTS
========================================================= */

export async function getDocuments() {
  const response = await fetch(
    `${API_URL}/super-admin/documents`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  return handleResponse(response);
}


/* =========================================================
   APPLICATION
========================================================= */

export async function getApplication(id) {
  const response = await fetch(
    `${API_URL}/super-admin/applications/${id}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  return handleResponse(response);
}


/* =========================================================
   DOCUMENT STATUS
========================================================= */

export async function updateDocumentStatus(
  documentId,
  status,
  notes = ""
) {
  const response = await fetch(
    `${API_URL}/super-admin/documents/${documentId}/status`,
    {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        status,
        notes,
      }),
    }
  );

  return handleResponse(response);
}


/* =========================================================
   APPLICATION DECISION
========================================================= */

export async function updateApplicationDecision(
  applicationId,
  decision
) {
  const response = await fetch(
    `${API_URL}/super-admin/applications/${applicationId}/decision`,
    {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        decision,
      }),
    }
  );

  return handleResponse(response);
}

export async function getDocumentPreviewUrl(documentId) {
  const token = localStorage.getItem("superadmin_token");

  return `${API_URL}/super-admin/documents/${encodeURIComponent(
    documentId
  )}/view?token=${encodeURIComponent(token)}`;
}


/* =========================================================
   LEADS MANAGEMENT
========================================================= */

export async function getLeads(params = {}) {
  const query = new URLSearchParams();
  if (params.service && params.service !== "All") query.append("service", params.service);
  if (params.status && params.status !== "All") query.append("status", params.status);
  if (params.search) query.append("search", params.search);

  const url = `${API_URL}/super-admin/leads${query.toString() ? `?${query.toString()}` : ""}`;

  const response = await fetch(url, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  return handleResponse(response);
}

export async function updateLead(id, data) {
  const response = await fetch(`${API_URL}/super-admin/leads/${id}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  return handleResponse(response);
}


/* =========================================================
   BALANCE TRANSFER & LPS
========================================================= */

export async function getBtAndLps() {
  const response = await fetch(`${API_URL}/super-admin/bt-lps`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  return handleResponse(response);
}


/* =========================================================
   BANK FORWARDING TRACKER
========================================================= */

export async function getBankForwarding() {
  const response = await fetch(`${API_URL}/super-admin/bank-forwarding`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  return handleResponse(response);
}

export async function updateBankForwarding(id, data) {
  const response = await fetch(`${API_URL}/super-admin/bank-forwarding/${id}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  return handleResponse(response);
}


/* =========================================================
   CUSTOMER DIRECTORY (USERS)
========================================================= */

export async function getUsersList(params = {}) {
  const query = new URLSearchParams();
  if (params.status && params.status !== "All") query.append("status", params.status);
  if (params.search) query.append("search", params.search);

  const url = `${API_URL}/super-admin/users${query.toString() ? `?${query.toString()}` : ""}`;

  const response = await fetch(url, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  return handleResponse(response);
}

export async function updateUserStatus(id, isActive) {
  const response = await fetch(`${API_URL}/super-admin/users/${id}/status`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({ isActive }),
  });

  return handleResponse(response);
}


/* =========================================================
   REPORTS & ANALYTICS
========================================================= */

export async function getReportsData() {
  const response = await fetch(`${API_URL}/super-admin/reports`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  return handleResponse(response);
}


/* =========================================================
   SETTINGS & SUPER ADMINS
========================================================= */

export async function getSettingsData() {
  const response = await fetch(`${API_URL}/super-admin/settings`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  return handleResponse(response);
}

export async function updateAdminActiveStatus(id, isActive) {
  const response = await fetch(`${API_URL}/super-admin/settings/admin/${id}/status`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({ isActive }),
  });

  return handleResponse(response);
}


/* =========================================================
   AUDIT LOGS
========================================================= */

export async function getAuditLogs(params = {}) {
  const query = new URLSearchParams();
  if (params.limit) query.append("limit", params.limit);
  if (params.entityType) query.append("entityType", params.entityType);
  if (params.action) query.append("action", params.action);

  const url = `${API_URL}/super-admin/audit-logs${
    query.toString() ? `?${query.toString()}` : ""
  }`;

  const response = await fetch(url, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  return handleResponse(response);
}