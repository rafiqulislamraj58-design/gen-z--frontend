import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router";
import api from "../services/api";

const AdminDashboard = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await api.get("/v1/admin/reports");
      const fetchedData = response.data.data || response.data;
      setReports(Array.isArray(fetchedData) ? fetchedData : []);
    } catch (err) {
      console.error("Admin fetch error:", err.response || err);
      if (err.response?.status === 403) {
        alert("Access Denied! You are not an admin.");
        navigate("/");
      } else {
        setError("Failed to load admin reports.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [navigate]);

  const handleMemoryStatus = async (memoryId, newStatus, reason = "") => {
    if (!window.confirm(`Are you sure you want to mark this memory as ${newStatus}?`)) return;

    try {
      await api.patch(`/v1/admin/memories/${memoryId}/status`, {
        status: newStatus,
        moderationReason: reason || "Violated community guidelines",
      });
      alert(`Memory status updated to ${newStatus}`);
      fetchReports(); 
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update memory status.");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-24 text-nostalgiaMuted font-medium animate-pulse">
        Loading Admin Dashboard...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Back Button & Header */}
      <div className="space-y-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-nostalgiaMuted hover:text-nostalgiaText transition-colors"
        >
          ← Back to Home
        </Link>

        <div className="border-b border-gray-100 pb-6">
          <h1 className="text-3xl font-black text-nostalgiaText">Admin Control Center</h1>
          <p className="text-sm text-nostalgiaMuted mt-1">Review reported memories and manage community safety.</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-center text-sm font-semibold">
          {error}
        </div>
      )}

      {/* Reports Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-nostalgiaText">Pending Reported Memories ({reports.length})</h2>

        {reports.length === 0 ? (
          <div className="text-center py-16 bg-nostalgiaCard rounded-3xl border border-gray-200/60 p-8">
            <p className="text-nostalgiaMuted font-medium">No pending reports found. All clean! 🎉</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {reports.map((report) => {
              const memory = report.memory;
              const reporter = report.reporter;

              return (
                <div
                  key={report._id}
                  className="bg-nostalgiaCard rounded-3xl border border-gray-200/60 shadow-sm p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                >
                  <div className="space-y-2 flex-grow">
                    <div className="flex items-center gap-3 text-xs flex-wrap">
                      <span className="px-3 py-1 bg-red-50 text-red-600 rounded-full font-bold uppercase tracking-wider">
                        Reason: {report.reason}
                      </span>
                      <span className="text-nostalgiaMuted">
                        Reported by: <strong className="text-nostalgiaText">{reporter?.name || "Unknown"}</strong> ({reporter?.email})
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-nostalgiaText">
                      {memory ? memory.title : "Memory removed or unavailable"}
                    </h3>
                    {memory && (
                      <p className="text-sm text-nostalgiaMuted line-clamp-2 leading-relaxed">
                        {memory.story}
                      </p>
                    )}
                    {report.details && (
                      <p className="text-xs text-amber-700 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                        <strong>Additional Details:</strong> {report.details}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  {memory && (
                    <div className="flex items-center gap-3 shrink-0">
                      <button
                        onClick={() => handleMemoryStatus(memory._id, "blocked", report.reason)}
                        className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold shadow-sm transition"
                      >
                        Block Memory
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;