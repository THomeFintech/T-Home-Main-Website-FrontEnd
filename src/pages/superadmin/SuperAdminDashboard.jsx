import { useEffect, useMemo, useState } from "react";

import { getDashboardStats } from "../../api/superAdminApi";


export default function SuperAdminDashboard() {

  const [stats, setStats] = useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  useEffect(() => {
    loadDashboard();
  }, []);


  async function loadDashboard() {

    try {

      setLoading(true);
      setError("");

      const response =
        await getDashboardStats();

      console.log(
        "DASHBOARD RESPONSE:",
        response
      );

      if (
        !response?.success ||
        !response?.data
      ) {
        throw new Error(
          "Dashboard data not found"
        );
      }

      setStats(response.data);

    } catch (error) {

      console.error(
        "Dashboard loading error:",
        error
      );

      setError(
        error?.message ||
          "Failed to load dashboard"
      );

    } finally {

      setLoading(false);

    }
  }


  /*
   * ============================================================
   * APPLICATION CHART DATA
   * ============================================================
   */

  const applicationChart = useMemo(() => {

    if (!stats) {
      return {
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
      };
    }

    return {
      total:
        Number(
          stats.totalApplications || 0
        ),

      pending:
        Number(
          stats.pendingApplications || 0
        ),

      approved:
        Number(
          stats.approvedApplications || 0
        ),

      rejected:
        Number(
          stats.rejectedApplications || 0
        ),
    };

  }, [stats]);


  /*
   * ============================================================
   * TREND MAX
   * ============================================================
   */

  const trendMax = useMemo(() => {

    const values =
      stats?.applicationTrend?.map(
        (item) =>
          Number(item.count || 0)
      ) || [];

    return Math.max(
      1,
      ...values
    );

  }, [stats]);


  /*
   * ============================================================
   * LOAN TYPE MAX
   * ============================================================
   */

  const loanTypeMax = useMemo(() => {

    const values =
      stats?.applicationsByLoanType?.map(
        (item) =>
          Number(item.count || 0)
      ) || [];

    return Math.max(
      1,
      ...values
    );

  }, [stats]);


  /*
   * ============================================================
   * STATUS HELPERS
   * ============================================================
   */

  function getDecisionStyle(
    decision
  ) {

    const value =
      String(
        decision || ""
      ).toLowerCase();


    if (
      value.includes("approved")
    ) {

      return {
        label: "Approved",
        className:
          "bg-green-100 text-green-700",
      };

    }


    if (
      value.includes("rejected")
    ) {

      return {
        label: "Rejected",
        className:
          "bg-red-100 text-red-700",
      };

    }


    return {
      label: "Pending",
      className:
        "bg-orange-100 text-orange-700",
    };
  }


  /*
   * ============================================================
   * LOADING
   * ============================================================
   */

  if (loading) {

    return (

      <div className="p-8">

        <div className="flex items-center gap-3 text-slate-500">

          <div className="w-6 h-6 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin" />

          <span>
            Loading dashboard...
          </span>

        </div>

      </div>

    );
  }


  /*
   * ============================================================
   * ERROR
   * ============================================================
   */

  if (error) {

    return (

      <div className="p-8">

        <div className="border border-red-200 bg-red-50 rounded-xl p-6">

          <h2 className="font-semibold text-red-600">
            Failed to load dashboard
          </h2>

          <p className="text-sm text-red-500 mt-2">
            {error}
          </p>

          <button
            onClick={loadDashboard}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>

        </div>

      </div>

    );
  }


  if (!stats) {

    return null;

  }


  return (

    <div className="p-8">

      {/* ======================================================
          HEADER
      ======================================================= */}

      <div className="mb-8">

        <h1 className="text-3xl font-bold text-slate-900">
          Operations Dashboard
        </h1>

        <p className="text-slate-500 mt-1">
          Live snapshot across T-HOME users and applications.
        </p>

      </div>


      {/* ======================================================
          TOP STAT CARDS
      ======================================================= */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">


        {/* TOTAL USERS */}

        <div className="bg-white rounded-2xl border border-slate-200 p-6">

          <p className="text-sm text-slate-500">
            Total Users
          </p>

          <p className="text-3xl font-bold text-slate-900 mt-2">
            {stats.totalUsers}
          </p>

          <p className="text-sm text-green-600 mt-2">
            Registered users
          </p>

        </div>


        {/* TOTAL APPLICATIONS */}

        <div className="bg-white rounded-2xl border border-slate-200 p-6">

          <p className="text-sm text-slate-500">
            Total Applications
          </p>

          <p className="text-3xl font-bold text-slate-900 mt-2">
            {stats.totalApplications}
          </p>

          <p className="text-sm text-blue-600 mt-2">
            Applications received
          </p>

        </div>


        {/* APPROVED */}

        <div className="bg-white rounded-2xl border border-slate-200 p-6">

          <p className="text-sm text-slate-500">
            Approved Loans
          </p>

          <p className="text-3xl font-bold text-slate-900 mt-2">
            {stats.approvedApplications}
          </p>

          <p className="text-sm text-green-600 mt-2">
            {stats.approvalRate}% of processed
          </p>

        </div>


        {/* REJECTED */}

        <div className="bg-white rounded-2xl border border-slate-200 p-6">

          <p className="text-sm text-slate-500">
            Rejected Loans
          </p>

          <p className="text-3xl font-bold text-slate-900 mt-2">
            {stats.rejectedApplications}
          </p>

          <p className="text-sm text-red-600 mt-2">
            {stats.rejectionRate}% of processed
          </p>

        </div>

      </div>


      {/* ======================================================
          SECONDARY STAT CARDS
      ======================================================= */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">


        {/* PENDING APPLICATIONS */}

        <div className="bg-white rounded-2xl border border-slate-200 p-6">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-slate-500">
                Pending Applications
              </p>

              <p className="text-2xl font-bold text-slate-900 mt-2">
                {stats.pendingApplications}
              </p>

            </div>

            <div className="w-11 h-11 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 text-xl">
              !
            </div>

          </div>

          <p className="text-sm text-orange-600 mt-3">
            Require review
          </p>

        </div>


        {/* PENDING DOCUMENTS */}

        <div className="bg-white rounded-2xl border border-slate-200 p-6">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-slate-500">
                Pending Documents
              </p>

              <p className="text-2xl font-bold text-slate-900 mt-2">
                {stats.pendingDocuments}
              </p>

            </div>

            <div className="w-11 h-11 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 text-xl">
              ⧗
            </div>

          </div>

          <p className="text-sm text-orange-600 mt-3">
            Waiting for review
          </p>

        </div>


        {/* DOCUMENTS REVIEWED */}

        <div className="bg-white rounded-2xl border border-slate-200 p-6">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-slate-500">
                Verified Documents
              </p>

              <p className="text-2xl font-bold text-slate-900 mt-2">
                {stats.verifiedDocuments}
              </p>

            </div>

            <div className="w-11 h-11 rounded-xl bg-green-100 flex items-center justify-center text-green-600 text-xl">
              ✓
            </div>

          </div>

          <p className="text-sm text-green-600 mt-3">
            Successfully verified
          </p>

        </div>

      </div>


      {/* ======================================================
          APPLICATION STATUS + DOCUMENT STATUS
      ======================================================= */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">


        {/* APPLICATION STATUS */}

        <div className="bg-white rounded-2xl border border-slate-200 p-6">

          <h2 className="text-xl font-semibold text-slate-900">
            Application Status
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Current application distribution
          </p>


          <div className="flex items-center gap-8 mt-8">


            {/* DONUT */}

            <div
              className="relative w-40 h-40 rounded-full flex-shrink-0"
              style={{
                background: `conic-gradient(
                  #16a34a 0% ${
                    applicationChart.total
                      ? (applicationChart.approved /
                          applicationChart.total) *
                        100
                      : 0
                  }%,

                  #ef4444 ${
                    applicationChart.total
                      ? (applicationChart.approved /
                          applicationChart.total) *
                        100
                      : 0
                  }% ${
                    applicationChart.total
                      ? ((applicationChart.approved +
                          applicationChart.rejected) /
                          applicationChart.total) *
                        100
                      : 0
                  }%,

                  #f59e0b ${
                    applicationChart.total
                      ? ((applicationChart.approved +
                          applicationChart.rejected) /
                          applicationChart.total) *
                        100
                      : 0
                  }% 100%
                )`,
              }}
            >

              <div className="absolute inset-4 bg-white rounded-full flex flex-col items-center justify-center">

                <span className="text-2xl font-bold text-slate-900">
                  {applicationChart.total}
                </span>

                <span className="text-xs text-slate-500">
                  Applications
                </span>

              </div>

            </div>


            {/* LEGEND */}

            <div className="space-y-4 flex-1">


              <div className="flex items-center justify-between">

                <div className="flex items-center gap-2">

                  <span className="w-3 h-3 rounded-full bg-green-600" />

                  <span className="text-sm text-slate-600">
                    Approved
                  </span>

                </div>

                <span className="font-semibold text-slate-900">
                  {applicationChart.approved}
                </span>

              </div>


              <div className="flex items-center justify-between">

                <div className="flex items-center gap-2">

                  <span className="w-3 h-3 rounded-full bg-red-500" />

                  <span className="text-sm text-slate-600">
                    Rejected
                  </span>

                </div>

                <span className="font-semibold text-slate-900">
                  {applicationChart.rejected}
                </span>

              </div>


              <div className="flex items-center justify-between">

                <div className="flex items-center gap-2">

                  <span className="w-3 h-3 rounded-full bg-orange-500" />

                  <span className="text-sm text-slate-600">
                    Pending
                  </span>

                </div>

                <span className="font-semibold text-slate-900">
                  {applicationChart.pending}
                </span>

              </div>


            </div>

          </div>

        </div>


        {/* DOCUMENT STATUS */}

        <div className="bg-white rounded-2xl border border-slate-200 p-6">

          <h2 className="text-xl font-semibold text-slate-900">
            Document Review
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Current document review status
          </p>


          <div className="mt-8 space-y-6">


            {/* PENDING */}

            <div>

              <div className="flex justify-between mb-2">

                <span className="text-sm text-slate-600">
                  Pending Review
                </span>

                <span className="text-sm font-semibold text-slate-900">
                  {stats.pendingDocuments}
                </span>

              </div>

              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">

                <div
                  className="h-full bg-orange-500 rounded-full"
                  style={{
                    width: `${
                      stats.totalReviewDocuments
                        ? (
                            stats.pendingDocuments /
                            stats.totalReviewDocuments
                          ) * 100
                        : 0
                    }%`,
                  }}
                />

              </div>

            </div>


            {/* VERIFIED */}

            <div>

              <div className="flex justify-between mb-2">

                <span className="text-sm text-slate-600">
                  Verified
                </span>

                <span className="text-sm font-semibold text-slate-900">
                  {stats.verifiedDocuments}
                </span>

              </div>

              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">

                <div
                  className="h-full bg-green-600 rounded-full"
                  style={{
                    width: `${
                      stats.totalReviewDocuments
                        ? (
                            stats.verifiedDocuments /
                            stats.totalReviewDocuments
                          ) * 100
                        : 0
                    }%`,
                  }}
                />

              </div>

            </div>


            {/* ACTION REQUIRED */}

            <div>

              <div className="flex justify-between mb-2">

                <span className="text-sm text-slate-600">
                  Action Required
                </span>

                <span className="text-sm font-semibold text-slate-900">
                  {stats.actionRequiredDocuments}
                </span>

              </div>

              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">

                <div
                  className="h-full bg-red-500 rounded-full"
                  style={{
                    width: `${
                      stats.totalReviewDocuments
                        ? (
                            stats.actionRequiredDocuments /
                            stats.totalReviewDocuments
                          ) * 100
                        : 0
                    }%`,
                  }}
                />

              </div>

            </div>


          </div>

        </div>

      </div>


      {/* ======================================================
          APPLICATION TREND
      ======================================================= */}

      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">

        <div className="flex items-center justify-between mb-8">

          <div>

            <h2 className="text-xl font-semibold text-slate-900">
              Application Trend
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Applications received over the last 7 days
            </p>

          </div>

        </div>


        <div className="flex items-end gap-3 h-64">

          {stats.applicationTrend?.map(
            (item) => {

              const height =
                Number(item.count || 0) /
                trendMax *
                100;


              return (

                <div
                  key={item.date}
                  className="flex-1 h-full flex flex-col justify-end items-center gap-3"
                >

                  <span className="text-xs font-medium text-slate-600">
                    {item.count}
                  </span>

                  <div className="w-full max-w-[55px] h-48 flex items-end">

                    <div
                      className="w-full bg-blue-600 rounded-t-lg hover:bg-blue-700 transition"
                      style={{
                        height: `${Math.max(
                          height,
                          item.count > 0
                            ? 5
                            : 0
                        )}%`,
                      }}
                    />

                  </div>

                  <span className="text-xs text-slate-500">
                    {item.label}
                  </span>

                </div>

              );

            }
          )}

        </div>

      </div>


      {/* ======================================================
          LOAN TYPES + RECENT APPLICATIONS
      ======================================================= */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">


        {/* LOAN TYPE DISTRIBUTION */}

        <div className="bg-white rounded-2xl border border-slate-200 p-6">

          <h2 className="text-xl font-semibold text-slate-900">
            Applications by Loan Type
          </h2>

          <p className="text-sm text-slate-500 mt-1 mb-6">
            Distribution of submitted applications
          </p>


          <div className="space-y-5">

            {stats.applicationsByLoanType
              ?.slice(0, 6)
              .map((item) => {

                const percentage =
                  Number(item.count || 0) /
                  loanTypeMax *
                  100;


                return (

                  <div
                    key={item.loanType}
                  >

                    <div className="flex items-center justify-between mb-2">

                      <span className="text-sm text-slate-700">
                        {item.loanType}
                      </span>

                      <span className="text-sm font-semibold text-slate-900">
                        {item.count}
                      </span>

                    </div>


                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">

                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{
                          width: `${percentage}%`,
                        }}
                      />

                    </div>

                  </div>

                );

              })}


            {(!stats.applicationsByLoanType ||
              stats.applicationsByLoanType.length === 0) && (

              <p className="text-sm text-slate-500">
                No loan type data available.
              </p>

            )}

          </div>

        </div>


        {/* RECENT APPLICATIONS */}

        <div className="bg-white rounded-2xl border border-slate-200 p-6">

          <div className="flex items-center justify-between mb-6">

            <div>

              <h2 className="text-xl font-semibold text-slate-900">
                Recent Applications
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Latest applications received
              </p>

            </div>

          </div>


          <div className="space-y-3">

            {stats.recentApplications
              ?.map((application) => {

                const status =
                  getDecisionStyle(
                    application.decision
                  );


                return (

                  <div
                    key={application.id}
                    className="flex items-center justify-between gap-4 border border-slate-100 rounded-xl p-3 hover:bg-slate-50 transition"
                  >

                    <div className="min-w-0">

                      <p className="font-medium text-slate-900 truncate">
                        {application.name}
                      </p>

                      <p className="text-xs text-slate-500 mt-1">
                        {application.loanType}
                      </p>

                    </div>


                    <div className="flex-shrink-0 text-right">

                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-xs ${status.className}`}
                      >
                        {status.label}
                      </span>

                      <p className="text-xs text-slate-400 mt-1">
                        {application.createdAt
                          ? new Date(
                              application.createdAt
                            ).toLocaleDateString(
                              "en-IN"
                            )
                          : ""}
                      </p>

                    </div>

                  </div>

                );

              })}


            {(!stats.recentApplications ||
              stats.recentApplications.length === 0) && (

              <div className="py-8 text-center">

                <p className="text-sm text-slate-500">
                  No applications found.
                </p>

              </div>

            )}

          </div>

        </div>

      </div>


      {/* ======================================================
          REFRESH
      ======================================================= */}

      <div className="mt-6 flex justify-end">

        <button
          onClick={loadDashboard}
          className="px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition"
        >
          Refresh Dashboard
        </button>

      </div>

    </div>
  );
}