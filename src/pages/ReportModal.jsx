import React, { useState } from "react";
import api from "../services/api";

const ReportModal = ({ memoryId, onClose }) => {
 
  const [reason, setReason] = useState("Inappropriate content");
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
   
      await api.post(`/v1/memories/${memoryId}/report`, {
        reason,
        details,
      });
      alert("Report submitted successfully. Admin will review it.");
      onClose(); 
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit report.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-xl">
        <h3 className="text-xl font-bold text-nostalgiaText">Report Memory</h3>
        <p className="text-sm text-nostalgiaMuted">Please select a reason for reporting this memory.</p>

        <form onSubmit={handleReportSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-nostalgiaText mb-1">Reason</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none"
            >
              
              <option value="Inappropriate content">Inappropriate content</option>
              <option value="Harassment or hate">Harassment or hate</option>
              <option value="Spam">Spam</option>
              <option value="Copyright concern">Copyright concern</option>
              <option value="Privacy concern">Privacy concern</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-nostalgiaText mb-1">Additional Details (Optional)</label>
            <textarea
              rows={3}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Provide more context..."
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-nostalgiaText rounded-xl text-sm font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Report"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportModal;