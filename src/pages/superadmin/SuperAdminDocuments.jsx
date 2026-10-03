import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
 
import { getDocuments } from "../../api/superAdminApi";

export default function SuperAdminDocuments() {

  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadApplications();
  }, []);

  async function loadApplications() {
    try {
      setLoading(true);
      setError("");

      const response = await getDocuments();

      console.log("DOCUMENTS API RESPONSE:", response);
      console.log("DOCUMENTS DATA:", response?.data);

      setApplications(response?.data || []);

    } catch (error) {
      console.error("Failed to load documents:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }


  function getStatusStyle(decision) {

    const value = String(decision || "").toLowerCase();

    if (value.includes("approved")) {
      return "bg-green-100 text-green-700";
    }

    if (value.includes("reject")) {
      return "bg-red-100 text-red-700";
    }

    return "bg-orange-100 text-orange-700";
  }


  function getDisplayStatus(decision) {

    if (!decision) {
      return "Pending Review";
    }

    const value = String(decision).toLowerCase();

    if (value.includes("approved")) {
      return "Approved";
    }

    if (value.includes("reject")) {
      return "Rejected";
    }

    return "Pending Review";
  }


  if (loading) {
    return (
      
        <div className="p-8 text-slate-500">
          Loading documents...
        </div>
       
    );
  }


  if (error) {
    return (
     
        <div className="p-8">

          <div className="border border-red-300 bg-red-50 rounded-xl p-6">

            <h2 className="font-semibold text-red-600">
              Failed to load applications
            </h2>

            <p className="text-red-500 mt-2">
              {error}
            </p>

            <button
              onClick={loadApplications}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Try Again
            </button>

          </div>

        </div>
     
    );
  }


  return (
     

      <div className="p-8">

        <h1 className="text-3xl font-bold text-slate-900">
          Documents Submitted
        </h1>

        <p className="text-slate-500 mt-1 mb-8">
          Review user applications and submitted documents.
        </p>


        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-slate-50 border-b">

                <tr>

                  <th className="text-left p-4 text-sm text-slate-600">
                    Applicant
                  </th>

                  <th className="text-left p-4 text-sm text-slate-600">
                    Loan Type
                  </th>

                  <th className="text-left p-4 text-sm text-slate-600">
                    Documents
                  </th>

                  <th className="text-left p-4 text-sm text-slate-600">
                    Status
                  </th>

                  <th className="text-left p-4 text-sm text-slate-600">
                    Action
                  </th>

                </tr>

              </thead>


              <tbody>

                {applications.length === 0 ? (

                  <tr>

                    <td
                      colSpan="5"
                      className="p-10 text-center text-slate-500"
                    >
                      No applications found.
                    </td>

                  </tr>

                ) : (

                  applications.map((application) => (

                    <tr
                      key={application.id}
                      className="border-b last:border-b-0 hover:bg-slate-50"
                    >

                      <td className="p-4">

                        <p className="font-medium text-slate-900">
                          {application.name}
                        </p>

                        <p className="text-sm text-slate-500">
                          {application.email}
                        </p>

                      </td>


                      <td className="p-4 text-slate-700">
                        {application.loanType}
                      </td>


                      <td className="p-4">

                        <span className="font-medium text-slate-900">
                          {application.documentCount || 0}
                        </span>

                        <span className="text-sm text-slate-500 ml-1">
                          document
                          {application.documentCount === 1 ? "" : "s"}
                        </span>

                      </td>


                      <td className="p-4">

                        <span
                          className={`px-3 py-1 rounded-full text-xs ${getStatusStyle(
                            application.decision
                          )}`}
                        >
                          {getDisplayStatus(application.decision)}
                        </span>

                      </td>


                      <td className="p-4">

                        <button
                          onClick={() =>
                            navigate(
                              `/super-admin/applications/${application.id}`
                            )
                          }
                          className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm hover:bg-slate-800"
                        >
                          Review
                        </button>

                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    
  );
}