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