import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  getApplication,
  updateApplicationDecision,
  updateDocumentStatus,
} from "../../api/superAdminApi";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  Shield,
  FileText,
  User,
  CreditCard,
  Briefcase,
  Calendar,
  Phone,
  Mail,
  AlertCircle,
  ExternalLink,
  Eye,
  X,
  FileCheck,
  TrendingUp,
} from "lucide-react";

export default function SuperAdminApplication() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");

  // Decision Modal State
  const [decisionModal, setDecisionModal] = useState({
    isOpen: false,
    decision: null, // "approved" | "rejected" | "pending"
    title: "",
    message: "",
  });
  const [submittingDecision, setSubmittingDecision] = useState(false);

  // Document Preview State
  const [previewModal, setPreviewModal] = useState({
    isOpen: false,
    document: null,
    previewUrl: "",
    previewType: "",
    loading: false,
    error: "",
  });

  // Updating single doc status
  const [updatingDocId, setUpdatingDocId] = useState(null);

  useEffect(() => {
    loadApplication();
  }, [id]);

  async function loadApplication() {
    try {
      setLoading(true);
      setError("");
      const response = await getApplication(id);

      if (!response?.success || !response?.data) {
        throw new Error(response?.message || "Application not found");
      }

      setApplication(response.data);
    } catch (err) {
      console.error("Failed to load application:", err);
      setError(err?.message || "Failed to load application details");
    } finally {
      setLoading(false);
    }
  }

  function handleOpenDecisionModal(targetDecision) {
    if (targetDecision === "approved") {
      setDecisionModal({
        isOpen: true,
        decision: "approved",
        title: "Approve Loan Application",
        message: `Are you sure you want to approve application #${id} for ${application?.name || "applicant"}? This will mark the application as approved in T-HOME records.`,
      });
    } else if (targetDecision === "rejected") {
      setDecisionModal({
        isOpen: true,
        decision: "rejected",
        title: "Reject Loan Application",
        message: `Are you sure you want to reject application #${id}? The record will be updated to Rejected status.`,
      });
    } else {
      setDecisionModal({
        isOpen: true,
        decision: "pending",
        title: "Reset Application to Pending",
        message: `Are you sure you want to reset application #${id} back to Pending Review status?`,
      });
    }
  }

  async function handleConfirmDecision() {
    if (!decisionModal.decision) return;
    try {
      setSubmittingDecision(true);
      await updateApplicationDecision(id, decisionModal.decision);

      setActionSuccess(`Application #${id} successfully marked as ${decisionModal.decision}.`);
      setDecisionModal({ isOpen: false, decision: null, title: "", message: "" });
      await loadApplication();

      setTimeout(() => setActionSuccess(""), 5000);
    } catch (err) {
      console.error("Failed to update application decision:", err);
      alert(err.message || "Failed to update application decision");
    } finally {
      setSubmittingDecision(false);
    }
  }

  async function handleUpdateDocStatus(document, targetStatus) {
    if (!document?.originalId) {
      alert("This document is tied to an external KYC or Income record and cannot be edited independently.");
      return;
    }

    try {
      setUpdatingDocId(document.id);
      await updateDocumentStatus(document.originalId, targetStatus);
      setActionSuccess(`Document "${document.documentName}" marked as ${targetStatus}.`);
      await loadApplication();
      setTimeout(() => setActionSuccess(""), 4000);
    } catch (err) {
      console.error("Failed to update document status:", err);
      alert(err.message || "Failed to update document status");
    } finally {
      setUpdatingDocId(null);
    }
  }

  async function handlePreviewDocument(doc) {
    if (!doc.fileUrl) {
      if (doc.source === "DigiLocker") {
        setPreviewModal({
          isOpen: true,
          document: doc,
          previewUrl: "",
          previewType: "digilocker_info",
          loading: false,
          error: "",
        });
        return;
      }
      alert("Document file URL is not available.");
      return;
    }

    setPreviewModal({
      isOpen: true,
      document: doc,
      previewUrl: "",
      previewType: "",
      loading: true,
      error: "",
    });

    try {
      const response = await fetch(doc.fileUrl);
      if (!response.ok) {
        throw new Error("Unable to fetch document for preview.");
      }
      const blob = await response.blob();
      let contentType = blob.type;

      const filename = String(doc.filename || doc.documentName || "").toLowerCase();
      if (!contentType || contentType === "application/octet-stream") {
        if (filename.endsWith(".pdf")) contentType = "application/pdf";
        else if (filename.endsWith(".jpg") || filename.endsWith(".jpeg")) contentType = "image/jpeg";
        else if (filename.endsWith(".png")) contentType = "image/png";
        else if (filename.endsWith(".webp")) contentType = "image/webp";
      }

      const objUrl = URL.createObjectURL(new Blob([blob], { type: contentType || blob.type }));
      setPreviewModal({
        isOpen: true,
        document: doc,
        previewUrl: objUrl,
        previewType: contentType || blob.type || "",
        loading: false,
        error: "",
      });
    } catch (err) {
      console.error("Preview error:", err);
      setPreviewModal((prev) => ({
        ...prev,
        loading: false,
        error: err.message || "Unable to display this document in browser preview.",
      }));
    }
  }

  function closePreview() {
    if (previewModal.previewUrl) {
      URL.revokeObjectURL(previewModal.previewUrl);
    }
    setPreviewModal({
      isOpen: false,
      document: null,
      previewUrl: "",
      previewType: "",
      loading: false,
      error: "",
    });
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium text-sm">Loading application dossier...</p>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="p-6 max-w-2xl mx-auto mt-12">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-red-900 mb-1">Application Not Found</h2>
          <p className="text-sm text-red-600 mb-6">{error || "Unable to locate application record."}</p>
          <button
            onClick={() => navigate("/super-admin/dashboard")}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const decision = String(application.decision || "pending").toLowerCase();
  const isApproved = decision === "approved";
  const isRejected = decision === "rejected";
  const isPending = !isApproved && !isRejected;

  // Safe percentage calculation for ML Propensity score
  const rawProb = application.probability != null ? Number(application.probability) : null;
  const normalizedProb =
    rawProb == null || isNaN(rawProb)
      ? null
      : rawProb <= 0
      ? 0
      : rawProb <= 1
      ? Math.round(rawProb * 100 * 10) / 10
      : Math.min(100, Math.round(rawProb * 10) / 10);

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      {/* Top Breadcrumb & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 font-medium transition mb-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to List
          </button>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-slate-900">
              Loan Application #{application.id}
            </h1>
            {application.referenceId && (
              <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md border border-slate-200">
                Ref: {application.referenceId}
              </span>
            )}
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                isApproved
                  ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                  : isRejected
                  ? "bg-rose-100 text-rose-800 border border-rose-200"
                  : "bg-amber-100 text-amber-800 border border-amber-200"
              }`}
            >
              {isApproved ? (
                <CheckCircle className="w-3.5 h-3.5" />
              ) : isRejected ? (
                <XCircle className="w-3.5 h-3.5" />
              ) : (
                <Clock className="w-3.5 h-3.5" />
              )}
              {isApproved ? "Approved" : isRejected ? "Rejected" : "Pending Review"}
            </span>
          </div>
        </div>

        {/* Super Admin Decision Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {!isApproved && (
            <button
              onClick={() => handleOpenDecisionModal("approved")}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 shadow-sm transition active:scale-95"
            >
              <CheckCircle className="w-4 h-4" /> Approve Loan
            </button>
          )}
          {!isRejected && (
            <button
              onClick={() => handleOpenDecisionModal("rejected")}
              className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-xl text-sm font-semibold hover:bg-rose-700 shadow-sm transition active:scale-95"
            >
              <XCircle className="w-4 h-4" /> Reject Loan
            </button>
          )}
          {!isPending && (
            <button
              onClick={() => handleOpenDecisionModal("pending")}
              className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 bg-white rounded-xl text-sm font-semibold hover:bg-slate-50 transition"
            >
              <Clock className="w-4 h-4" /> Reopen / Mark Pending
            </button>
          )}
        </div>
      </div>

      {/* Success Notification Banner */}
      {actionSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-sm flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess("")} className="text-emerald-700 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Core Dossier Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Loan Financial Specs */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-indigo-600 mb-3">
            <CreditCard className="w-5 h-5" />
            <h3 className="font-semibold text-slate-900 text-sm">Loan Requirements</h3>
          </div>
          <div className="space-y-2.5">
            <div>
              <p className="text-xs text-slate-400">Loan Product</p>
              <p className="text-base font-bold text-slate-800">{application.loanType || "Personal / Home Loan"}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Requested Amount</p>
              <p className="text-lg font-bold text-emerald-600">
                ₹{Number(application.loanAmount || 0).toLocaleString("en-IN")}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Tenure</p>
              <p className="text-sm font-semibold text-slate-700">
                {application.tenure ? `${application.tenure} Years` : "Not specified"}
              </p>
            </div>
          </div>
        </div>

        {/* Applicant Profile */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-blue-600 mb-3">
            <User className="w-5 h-5" />
            <h3 className="font-semibold text-slate-900 text-sm">Applicant Profile</h3>
          </div>
          <div className="space-y-2.5">
            <div>
              <p className="text-xs text-slate-400">Full Name</p>
              <p className="text-sm font-bold text-slate-800">{application.name || "Anonymous Applicant"}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Phone</p>
              <p className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                {application.phone || "Not recorded"}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Email Address</p>
              <p className="text-sm font-medium text-slate-700 flex items-center gap-1.5 truncate">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{application.email || "Not recorded"}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Underwriting & Risk Metrics */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-emerald-600 mb-3">
            <TrendingUp className="w-5 h-5" />
            <h3 className="font-semibold text-slate-900 text-sm">Credit & Propensity</h3>
          </div>
          <div className="space-y-2.5">
            <div>
              <p className="text-xs text-slate-400">CIBIL Score</p>
              <div className="mt-1 flex items-center gap-2">
                <span
                  className={`text-lg font-black px-2.5 py-0.5 rounded-lg ${
                    Number(application.cibil) >= 750
                      ? "bg-emerald-100 text-emerald-800"
                      : Number(application.cibil) >= 650
                      ? "bg-amber-100 text-amber-800"
                      : application.cibil
                      ? "bg-rose-100 text-rose-800"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {application.cibil || "N/A"}
                </span>
                <span className="text-xs text-slate-400">
                  {Number(application.cibil) >= 750 ? "Excellent" : Number(application.cibil) >= 650 ? "Moderate" : "Subprime"}
                </span>
              </div>
            </div>
            <div>
              <p className="text-xs text-slate-400">Approval Propensity</p>
              {normalizedProb != null ? (
                <div className="mt-1">
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span>ML Confidence</span>
                    <span className="text-indigo-600 font-bold">{normalizedProb.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        normalizedProb >= 70
                          ? "bg-emerald-500"
                          : normalizedProb >= 40
                          ? "bg-amber-500"
                          : "bg-rose-500"
                      }`}
                      style={{ width: `${Math.round(normalizedProb)}%` }}
                    ></div>
                  </div>
                </div>
              ) : (
                <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Model score pending</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Employment & Financial Standing */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-purple-600 mb-3">
            <Briefcase className="w-5 h-5" />
            <h3 className="font-semibold text-slate-900 text-sm">Employment Profile</h3>
          </div>
          <div className="space-y-2.5">
            <div>
              <p className="text-xs text-slate-400">Employment Type</p>
              <p className="text-sm font-semibold text-slate-800 capitalize">
                {application.employmentType || "Salaried"}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Stated Income</p>
              <p className="text-sm font-semibold text-slate-800">
                {application.income ? `₹${Number(application.income).toLocaleString("en-IN")} / mo` : "Not Stated"}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Application Date</p>
              <p className="text-xs font-medium text-slate-600 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {application.createdAt ? new Date(application.createdAt).toLocaleString("en-IN") : "Unknown"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Submitted Verification Documents Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50/50">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-indigo-600" />
              Verification Documents Dossier
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {application.documentCount || 0} files submitted via DigiLocker, KYC, or Direct Upload
            </p>
          </div>
        </div>

        {application.documents?.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600 font-semibold text-sm">No documents uploaded yet</p>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              The applicant has submitted the loan request but has not yet attached income or KYC documentation.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {application.documents.map((doc, idx) => (
              <div
                key={doc.id || idx}
                className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50 transition"
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      doc.source === "DigiLocker"
                        ? "bg-sky-100 text-sky-700"
                        : doc.source === "KYC"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-indigo-100 text-indigo-700"
                    }`}
                  >
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-sm text-slate-900 truncate">
                        {doc.documentName || "Document"}
                      </p>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 uppercase tracking-wider">
                        {doc.source}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          doc.status === "verified"
                            ? "bg-emerald-100 text-emerald-800"
                            : doc.status === "action_required"
                            ? "bg-rose-100 text-rose-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {doc.status === "verified"
                          ? "Verified"
                          : doc.status === "action_required"
                          ? "Action Required"
                          : "Pending Review"}
                      </span>
                    </div>
                    {doc.uploadedAt && (
                      <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Uploaded {new Date(doc.uploadedAt).toLocaleString("en-IN")}
                      </p>
                    )}
                  </div>
                </div>

                {/* Document Action Buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  {/* Status Action Buttons if editable */}
                  {doc.originalId && (
                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                      <button
                        onClick={() => handleUpdateDocStatus(doc, "verified")}
                        disabled={updatingDocId === doc.id || doc.status === "verified"}
                        title="Mark document as Verified"
                        className="px-2.5 py-1 text-xs font-semibold rounded-lg transition bg-white text-emerald-700 hover:bg-emerald-50 disabled:opacity-50"
                      >
                        Verify
                      </button>
                      <button
                        onClick={() => handleUpdateDocStatus(doc, "action_required")}
                        disabled={updatingDocId === doc.id || doc.status === "action_required"}
                        title="Flag document as Action Required"
                        className="px-2.5 py-1 text-xs font-semibold rounded-lg transition bg-white text-rose-700 hover:bg-rose-50 disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </div>
                  )}

                  {/* Preview Button */}
                  <button
                    onClick={() => handlePreviewDocument(doc)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl text-xs font-semibold transition"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Preview
                  </button>

                  {doc.fileUrl && (
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-semibold transition"
                      title="Open in new window"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirmation Modal for Decision */}
      {decisionModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-start gap-4">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  decisionModal.decision === "approved"
                    ? "bg-emerald-100 text-emerald-600"
                    : decisionModal.decision === "rejected"
                    ? "bg-rose-100 text-rose-600"
                    : "bg-amber-100 text-amber-600"
                }`}
              >
                {decisionModal.decision === "approved" ? (
                  <CheckCircle className="w-6 h-6" />
                ) : decisionModal.decision === "rejected" ? (
                  <XCircle className="w-6 h-6" />
                ) : (
                  <Clock className="w-6 h-6" />
                )}
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">{decisionModal.title}</h3>
                <p className="text-sm text-slate-600 mt-1">{decisionModal.message}</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setDecisionModal({ isOpen: false, decision: null, title: "", message: "" })}
                disabled={submittingDecision}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDecision}
                disabled={submittingDecision}
                className={`px-5 py-2 text-sm font-semibold text-white rounded-xl shadow-sm transition ${
                  decisionModal.decision === "approved"
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : decisionModal.decision === "rejected"
                    ? "bg-rose-600 hover:bg-rose-700"
                    : "bg-slate-900 hover:bg-slate-800"
                }`}
              >
                {submittingDecision ? "Processing..." : "Confirm Decision"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Preview Modal */}
      {previewModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
          <div className="relative w-full max-w-5xl h-[88vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/50">
              <div className="min-w-0">
                <h3 className="font-bold text-slate-900 text-base truncate">
                  {previewModal.document?.documentName || "Document Dossier"}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Source: {previewModal.document?.source} • Status: {previewModal.document?.status}
                </p>
              </div>
              <button
                onClick={closePreview}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 bg-slate-100 overflow-auto flex items-center justify-center p-4">
              {previewModal.loading ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-sm text-slate-500 font-medium">Rendering document preview...</p>
                </div>
              ) : previewModal.error ? (
                <div className="bg-white rounded-2xl p-6 max-w-md text-center border border-red-200">
                  <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-2" />
                  <p className="font-bold text-red-900 text-sm">Preview Unavailable</p>
                  <p className="text-xs text-slate-500 mt-1 mb-4">{previewModal.error}</p>
                  {previewModal.document?.fileUrl && (
                    <a
                      href={previewModal.document.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Open in New Tab
                    </a>
                  )}
                </div>
              ) : previewModal.previewType === "digilocker_info" ? (
                <div className="bg-white rounded-2xl p-8 max-w-lg w-full text-center border border-sky-200 shadow-sm">
                  <Shield className="w-12 h-12 text-sky-600 mx-auto mb-3" />
                  <h4 className="text-base font-bold text-slate-900">Government DigiLocker Asset</h4>
                  <p className="text-xs text-slate-500 mt-1 mb-4">
                    This document was cryptographically fetched and verified via Aadhaar OTP from India DigiLocker National Repository.
                  </p>
                  <div className="bg-slate-50 rounded-xl p-4 text-left font-mono text-xs text-slate-700 space-y-1.5 border border-slate-200">
                    <p><span className="text-slate-400">URI:</span> {previewModal.document?.uri || "in.gov.uidai.aadhaar"}</p>
                    <p><span className="text-slate-400">Verified ID:</span> #{previewModal.document?.originalId || "DL-OK"}</p>
                    <p><span className="text-slate-400">Status:</span> Cryptographically Authenticated</p>
                  </div>
                </div>
              ) : previewModal.previewType === "application/pdf" ? (
                <iframe
                  src={previewModal.previewUrl}
                  title="PDF Preview"
                  className="w-full h-full rounded-xl bg-white border border-slate-200"
                />
              ) : (
                <img
                  src={previewModal.previewUrl}
                  alt="Document Preview"
                  className="max-w-full max-h-full object-contain rounded-xl shadow-md"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}