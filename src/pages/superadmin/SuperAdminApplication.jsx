import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  getApplication,
  updateApplicationDecision,
} from "../../api/superAdminApi";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

export default function SuperAdminApplication() {
  const { id } = useParams();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [approving, setApproving] = useState(false);

  // Document preview states
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewType, setPreviewType] = useState("");
  const [previewName, setPreviewName] = useState("");
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState("");


  useEffect(() => {
    loadApplication();
  }, [id]);


  async function loadApplication() {
    try {
      setLoading(true);
      setError("");

      const response = await getApplication(id);

      console.log("APPLICATION RESPONSE:", response);
      console.log("APPLICATION DATA:", response?.data);

      if (!response?.success || !response?.data) {
        throw new Error("Application data not found");
      }

      setApplication(response.data);

    } catch (error) {
      console.error("Failed to load application:", error);

      setError(
        error?.message || "Failed to load application"
      );

    } finally {
      setLoading(false);
    }
  }


  async function approveLoan() {
    try {
      setApproving(true);

      await updateApplicationDecision(
        id,
        "approved"
      );

      /*
       * Reload from DB so the UI reflects
       * the actual database value.
       */
      await loadApplication();

    } catch (error) {
      console.error(
        "Failed to approve application:",
        error
      );

      alert(error.message);

    } finally {
      setApproving(false);
    }
  }


  /*
   * ---------------------------------------------------------
   * DOCUMENT PREVIEW
   * ---------------------------------------------------------
   */

  async function previewDocument(document) {
    try {
      setPreviewLoading(true);
      setPreviewError("");

      setPreviewName(
        document.documentName || "Document"
      );

      /*
       * Remove previous preview URL
       */
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl("");
      }

      /*
       * We already receive the actual file URL
       * from the application API.
       *
       * Fetching it as a Blob prevents the browser
       * from following the original download behaviour.
       */
      const response = await fetch(
        document.fileUrl
      );

      if (!response.ok) {
        throw new Error(
          "Unable to load document for preview."
        );
      }

      const blob = await response.blob();

      /*
       * Detect the file type.
       *
       * Some storage providers may return an empty
       * or incorrect Content-Type, so we also inspect
       * the filename.
       */
      let contentType = blob.type;

      const filename = String(
        document.filename ||
        document.documentName ||
        ""
      ).toLowerCase();


      if (
        !contentType ||
        contentType === "application/octet-stream"
      ) {
        if (filename.endsWith(".pdf")) {
          contentType = "application/pdf";
        } else if (
          filename.endsWith(".jpg") ||
          filename.endsWith(".jpeg")
        ) {
          contentType = "image/jpeg";
        } else if (filename.endsWith(".png")) {
          contentType = "image/png";
        } else if (filename.endsWith(".webp")) {
          contentType = "image/webp";
        }
      }


      const objectUrl = URL.createObjectURL(
        new Blob([blob], {
          type: contentType || blob.type,
        })
      );

      setPreviewUrl(objectUrl);
      setPreviewType(
        contentType || blob.type || ""
      );

    } catch (error) {
      console.error(
        "Document preview error:",
        error
      );

      setPreviewError(
        error?.message ||
          "Unable to preview this document."
      );

    } finally {
      setPreviewLoading(false);
    }
  }


  function closePreview() {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl("");
    setPreviewType("");
    setPreviewName("");
    setPreviewError("");
  }


  /*
   * Cleanup object URL when component unmounts
   */
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);


  /*
   * Close modal with Escape key
   */
  useEffect(() => {
    function handleEscape(event) {
      if (event.key === "Escape") {
        closePreview();
      }
    }

    if (previewUrl || previewLoading) {
      document.addEventListener(
        "keydown",
        handleEscape
      );
    }

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [previewUrl, previewLoading]);


  function getDocumentStatusClass(status) {
    const value = String(
      status || ""
    ).toLowerCase();

    if (value === "verified") {
      return "bg-green-100 text-green-700";
    }

    if (value === "action_required") {
      return "bg-red-100 text-red-700";
    }

    return "bg-orange-100 text-orange-700";
  }


  function getDocumentStatusText(status) {
    if (status === "verified") {
      return "Verified";
    }

    if (status === "action_required") {
      return "Action Required";
    }

    return "Pending Review";
  }


  /*
   * ---------------------------------------------------------
   * LOADING
   * ---------------------------------------------------------
   */

  if (loading) {
    return (
      <div className="p-8 text-slate-500">
        Loading application...
      </div>
    );
  }


  /*
   * ---------------------------------------------------------
   * ERROR
   * ---------------------------------------------------------
   */

  if (error) {
    return (
      <div className="p-8">

        <div className="border border-red-300 bg-red-50 rounded-xl p-6">

          <h2 className="font-semibold text-red-600">
            Failed to load application
          </h2>

          <p className="text-red-500 mt-2">
            {error}
          </p>

          <button
            onClick={loadApplication}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>

        </div>

      </div>
    );
  }


  /*
   * ---------------------------------------------------------
   * APPLICATION NOT FOUND
   * ---------------------------------------------------------
   */

  if (!application) {
    return (
      <div className="p-8">
        Application not found.
      </div>
    );
  }


  const isApproved =
    String(application.decision || "")
      .toLowerCase()
      .includes("approved");


  return (

    <div className="p-8 max-w-6xl">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="mb-8">

        <h1 className="text-3xl font-bold text-slate-900">
          Application {application.id}
        </h1>

        <p className="text-slate-500 mt-1">
          Review applicant information and submitted documents.
        </p>

      </div>


      {/* =====================================================
          APPLICANT DETAILS
      ====================================================== */}

      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">

        <h2 className="text-xl font-semibold mb-6">
          Applicant Details
        </h2>

        <div className="grid md:grid-cols-2 gap-6">

          <div>
            <p className="text-sm text-slate-500">
              Full Name
            </p>

            <p className="font-medium mt-1 text-slate-900">
              {application?.name || "Not available"}
            </p>
          </div>


          <div>
            <p className="text-sm text-slate-500">
              Email
            </p>

            <p className="font-medium mt-1 text-slate-900">
              {application?.email || "Not available"}
            </p>
          </div>


          <div>
            <p className="text-sm text-slate-500">
              Phone
            </p>

            <p className="font-medium mt-1 text-slate-900">
              {application?.phone || "Not available"}
            </p>
          </div>


          <div>
            <p className="text-sm text-slate-500">
              Loan Type
            </p>

            <p className="font-medium mt-1 text-slate-900">
              {application?.loanType || "Not specified"}
            </p>
          </div>


          <div>
            <p className="text-sm text-slate-500">
              Loan Amount
            </p>

            <p className="font-medium mt-1 text-slate-900">

              {application?.loanAmount != null
                ? `₹${Number(
                    application.loanAmount
                  ).toLocaleString("en-IN")}`
                : "Not available"}

            </p>
          </div>


          <div>
            <p className="text-sm text-slate-500">
              Tenure
            </p>

            <p className="font-medium mt-1 text-slate-900">

              {application?.tenure != null
                ? `${application.tenure} years`
                : "Not available"}

            </p>
          </div>


          <div>
            <p className="text-sm text-slate-500">
              CIBIL Score
            </p>

            <p className="font-medium mt-1 text-slate-900">
              {application?.cibil ?? "Not available"}
            </p>
          </div>


          <div>
            <p className="text-sm text-slate-500">
              Application Date
            </p>

            <p className="font-medium mt-1 text-slate-900">

              {application?.createdAt
                ? new Date(
                    application.createdAt
                  ).toLocaleDateString("en-IN")
                : "Not available"}

            </p>
          </div>

        </div>

      </div>


      {/* =====================================================
          DOCUMENTS
      ====================================================== */}

      <div className="bg-white rounded-2xl border border-slate-200 p-6">

        <div className="mb-6">

          <h2 className="text-xl font-semibold">
            Submitted Documents
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            {application.documentCount || 0} documents submitted
          </p>

        </div>


        {application.documents?.length === 0 ? (

          <div className="border border-slate-200 rounded-xl p-8 text-center">

            <p className="text-slate-500">
              No documents have been submitted for this application.
            </p>

          </div>

        ) : (

          <div className="space-y-4">

            {application.documents.map(
              (document) => (

                <div
                  key={document.id}
                  className="flex items-center justify-between gap-4 border border-slate-200 rounded-xl p-4"
                >

                  {/* DOCUMENT INFORMATION */}

                  <div className="min-w-0">

                    <p className="font-medium text-slate-900">
                      {document.documentName}
                    </p>


                    <div className="flex flex-wrap gap-2 mt-2">

                      <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                        {document.source}
                      </span>


                      <span
                        className={`text-xs px-2 py-1 rounded-full ${getDocumentStatusClass(
                          document.status
                        )}`}
                      >
                        {getDocumentStatusText(
                          document.status
                        )}
                      </span>

                    </div>


                    {document.filename && (

                      <p className="text-xs text-slate-400 mt-2">
                        {document.filename}
                      </p>

                    )}

                  </div>


                  {/* VIEW DOCUMENT BUTTON */}

                  <div className="flex-shrink-0">

                    {document.fileUrl ? (

                      <button
                        type="button"
                        onClick={() =>
                          previewDocument(document)
                        }
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 active:bg-blue-800 transition shadow-sm"
                      >

                        {/* Eye icon */}

                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="17"
                          height="17"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
                          <circle
                            cx="12"
                            cy="12"
                            r="3"
                          />
                        </svg>

                        View Document

                      </button>

                    ) : document.source === "DigiLocker" ? (

                      <button
                        disabled
                        className="px-4 py-2 border border-slate-200 text-slate-400 rounded-lg text-sm"
                      >
                        DigiLocker File
                      </button>

                    ) : (

                      <button
                        disabled
                        className="px-4 py-2 border border-slate-200 text-slate-400 rounded-lg text-sm"
                      >
                        Document unavailable
                      </button>

                    )}

                  </div>

                </div>

              )
            )}

          </div>

        )}


        {/* ===================================================
            LOAN STATUS
        ==================================================== */}

        <div className="border-t mt-8 pt-6 flex items-center justify-between">

          <div>

            <p className="text-sm text-slate-500">
              Loan Status
            </p>


            <p
              className={`inline-block mt-2 px-3 py-1 rounded-full text-sm ${
                isApproved
                  ? "bg-green-100 text-green-700"
                  : "bg-orange-100 text-orange-700"
              }`}
            >

              {isApproved
                ? "Approved"
                : "Pending Review"}

            </p>

          </div>


          <button
            onClick={approveLoan}
            disabled={
              isApproved ||
              approving
            }
            className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >

            {approving
              ? "Approving..."
              : isApproved
              ? "Loan Approved"
              : "Approve Loan"}

          </button>

        </div>


      </div>


      {/* =====================================================
          DOCUMENT PREVIEW MODAL
      ====================================================== */}

      {(previewLoading ||
        previewUrl ||
        previewError) && (

        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onMouseDown={(event) => {

            /*
             * Close only when clicking the dark background.
             * Clicking inside the modal won't close it.
             */

            if (
              event.target ===
              event.currentTarget
            ) {
              closePreview();
            }

          }}
        >

          <div className="relative w-full max-w-5xl h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between px-5 py-4 border-b bg-white">

              <div className="min-w-0">

                <h3 className="font-semibold text-slate-900 truncate">
                  {previewName || "Document Preview"}
                </h3>

                <p className="text-xs text-slate-500 mt-1">
                  Document Preview
                </p>

              </div>


              <button
                type="button"
                onClick={closePreview}
                className="flex-shrink-0 ml-4 w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-600 text-xl"
                aria-label="Close preview"
              >
                ×
              </button>

            </div>


            {/* MODAL CONTENT */}

            <div className="flex-1 bg-slate-100 overflow-auto flex items-center justify-center p-4">

              {previewLoading ? (

                <div className="text-slate-500 flex flex-col items-center gap-3">

                  <div className="w-8 h-8 border-4 border-slate-300 border-t-blue-600 rounded-full animate-spin" />

                  <p>
                    Loading document...
                  </p>

                </div>

              ) : previewError ? (

                <div className="bg-white rounded-xl border border-red-200 p-6 max-w-md text-center">

                  <p className="font-medium text-red-600">
                    Unable to preview document
                  </p>

                  <p className="text-sm text-slate-500 mt-2">
                    {previewError}
                  </p>

                  <button
                    type="button"
                    onClick={closePreview}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Close
                  </button>

                </div>

              ) : previewUrl ? (

                previewType === "application/pdf" ? (

                  <iframe
                    src={previewUrl}
                    title={previewName}
                    className="w-full h-full rounded-lg bg-white"
                  />

                ) : previewType.startsWith("image/") ? (

                  <img
                    src={previewUrl}
                    alt={previewName}
                    className="max-w-full max-h-full object-contain rounded-lg shadow-sm"
                  />

                ) : (

                  <div className="bg-white rounded-xl border border-slate-200 p-8 text-center max-w-md">

                    <p className="font-medium text-slate-900">
                      Preview not supported
                    </p>

                    <p className="text-sm text-slate-500 mt-2">
                      This document type cannot be displayed directly in the browser.
                    </p>

                  </div>

                )

              ) : null}

            </div>

          </div>

        </div>

      )}

    </div>
  );
}