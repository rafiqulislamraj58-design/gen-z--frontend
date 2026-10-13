import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import api from "../services/api";

const ReportModal = ({ memoryId, onClose }) => {
 
  const [reason, setReason] = useState("Spam");
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
             
              <option value="Spam">Spam</option>
              <option value="Inappropriate content">Inappropriate content</option>
              <option value="Harassment or hate">Harassment or hate</option>
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

const MemoryDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [memory, setMemory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reacting, setReacting] = useState(false);
  
  const [reacted, setReacted] = useState(false);
  const [totalReactions, setTotalReactions] = useState(0);

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

  const [isReportOpen, setIsReportOpen] = useState(false);

  useEffect(() => {
    const fetchMemoryDetails = async () => {
      try {
        setLoading(true);
        const [memoryRes, commentsRes] = await Promise.all([
          api.get(`/v1/memories/${id}`),
          api.get(`/v1/memories/${id}/comments`)
        ]);

        const memData = memoryRes.data.data || memoryRes.data;
        setMemory(memData);
        
        setTotalReactions(memData.totalReactions ?? memData.reactionsCount ?? memData.reactions?.length ?? 0);
        if (memData.reacted !== undefined) {
          setReacted(memData.reacted);
        } else if (memData.isReacted !== undefined) {
          setReacted(memData.isReacted);
        }

        const comData = commentsRes.data.data || commentsRes.data.comments || commentsRes.data;
        setComments(Array.isArray(comData) ? comData : []);

      } catch (err) {
        setError(err.response?.data?.message || "Failed to load memory details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMemoryDetails();
    }
  }, [id]);

  const handleReaction = async () => {
    const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setReacting(true);
      const response = await api.put(`/v1/memories/${id}/reaction`);
      const resData = response.data.data || response.data;
      
      if (response.data.reactionsCount !== undefined) {
        setTotalReactions(response.data.reactionsCount);
      } else if (resData.totalReactions !== undefined) {
        setTotalReactions(resData.totalReactions);
      }

      if (response.data.reacted !== undefined) {
        setReacted(response.data.reacted);
      } else if (resData.reacted !== undefined) {
        setReacted(resData.reacted);
      } else {
        setReacted((prev) => !prev);
      }

    } catch (err) {
      console.error("Reaction error:", err);
    } finally {
      setReacting(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    if (!newComment.trim()) return;

    try {
      setCommentLoading(true);
      const response = await api.post(`/v1/memories/${id}/comments`, {
        text: newComment.trim(),
      });

      const addedComment = response.data.data || response.data.comment || response.data;
      setComments((prev) => [addedComment, ...prev]);
      setNewComment("");
    } catch (err) {
      console.error("Failed to post comment:", err);
      alert("Failed to post comment. Please try again.");
    } finally {
      setCommentLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-24 text-nostalgiaMuted font-medium animate-pulse">
        Loading memory details...
      </div>
    );
  }

  if (error || !memory) {
    return (
      <div className="max-w-md mx-auto my-20 p-6 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-center">
        <p className="font-semibold mb-4">{error || "Memory not found."}</p>
        <Link to="/feed" className="px-4 py-2 bg-deepBrown text-cream rounded-xl text-sm font-semibold">
          Back to Feed
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="flex items-center justify-between">
        <Link
          to="/feed"
          className="inline-flex items-center gap-2 text-sm font-semibold text-nostalgiaMuted hover:text-nostalgiaText transition-colors"
        >
          ← Back to Feed
        </Link>

        {/* Report Button */}
        <button
          onClick={() => setIsReportOpen(true)}
          className="text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 px-3 py-1.5 rounded-xl border border-red-200 transition"
        >
          ⚠️ Report Memory
        </button>
      </div>

      <article className="bg-nostalgiaCard rounded-3xl border border-gray-200/60 shadow-sm overflow-hidden p-6 sm:p-10 space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-6">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-semibold uppercase tracking-wider text-nostalgiaText capitalize">
              {memory.category?.name || memory.category}
            </span>
            {memory.memoryYear && (
              <span className="text-sm font-medium text-nostalgiaMuted">Year: {memory.memoryYear}</span>
            )}
            {memory.location && (
              <span className="text-sm font-medium text-nostalgiaMuted flex items-center gap-1">
                📍 {memory.location}
              </span>
            )}
          </div>
          <span className="text-xs text-nostalgiaMuted">
            Shared on {new Date(memory.createdAt).toLocaleDateString()}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-nostalgiaText leading-tight">
          {memory.title}
        </h1>

        {memory.images && memory.images.length > 0 && memory.images[0].url && (
          <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-inner bg-gray-50">
            <img
              src={memory.images[0].url}
              alt={memory.images[0].altText || memory.title}
              className="w-full max-h-[500px] object-cover"
            />
          </div>
        )}

        <div className="prose max-w-none text-nostalgiaText leading-relaxed whitespace-pre-wrap text-base sm:text-lg">
          {memory.story}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-nostalgiaAccent/10 text-nostalgiaAccent flex items-center justify-center font-bold text-lg">
              {memory.author?.name ? memory.author.name.charAt(0).toUpperCase() : "A"}
            </div>
            <div>
              <p className="text-sm font-bold text-nostalgiaText">
                {memory.author?.name || "Anonymous User"}
              </p>
              <p className="text-xs text-nostalgiaMuted">Memory Creator</p>
            </div>
          </div>

          <button
            onClick={handleReaction}
            disabled={reacting}
            className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all shadow-sm disabled:opacity-50 ${
              reacted
                ? "bg-rose-600 text-white shadow-rose-200 scale-105"
                : "bg-nostalgiaAccent/10 hover:bg-nostalgiaAccent/20 text-nostalgiaAccent"
            }`}
          >
            <span>{reacted ? "❤️" : "🤍"}</span>
            <span>I Remember This Too ({totalReactions})</span>
          </button>
        </div>
      </article>

      <section className="bg-nostalgiaCard rounded-3xl border border-gray-200/60 shadow-sm p-6 sm:p-10 space-y-8">
        <h2 className="text-2xl font-black text-nostalgiaText">
          Memories & Thoughts ({comments.length})
        </h2>

        <form onSubmit={handleCommentSubmit} className="space-y-3">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts, feelings, or related memory..."
            rows={3}
            className="w-full p-4 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-nostalgiaAccent/50 transition-all resize-none"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={commentLoading || !newComment.trim()}
              className="px-6 py-2.5 bg-deepBrown text-cream rounded-full text-sm font-semibold hover:bg-coral transition-colors disabled:opacity-50"
            >
              {commentLoading ? "Posting..." : "Post Comment"}
            </button>
          </div>
        </form>

        <div className="space-y-4 pt-4 border-t border-gray-100">
          {comments.length === 0 ? (
            <p className="text-sm text-nostalgiaMuted text-center py-6">
              No comments yet. Be the first to share a thought!
            </p>
          ) : (
            comments.map((comment) => {
              const commentId = comment._id || comment.id;
              const authorName = comment.author?.name || "Anonymous";
              return (
                <div key={commentId} className="p-4 bg-white rounded-2xl border border-gray-100 shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-xs text-nostalgiaMuted">
                    <span className="font-bold text-nostalgiaText">{authorName}</span>
                    <span>{comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : "Just now"}</span>
                  </div>
                  <p className="text-sm text-nostalgiaText leading-relaxed">{comment.text}</p>
                </div>
              );
            })
          )}
        </div>
      </section>

      {isReportOpen && (
        <ReportModal memoryId={id} onClose={() => setIsReportOpen(false)} />
      )}
    </div>
  );
};

export default MemoryDetails;