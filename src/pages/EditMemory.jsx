import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import api from "../services/api";

const EditMemory = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    story: "",
    category: "",
    memoryYear: "",
    location: "",
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMemoryDetails = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/v1/memories/${id}`);
        const data = response.data.data || response.data;
        
        setFormData({
          title: data.title || "",
          story: data.story || "",
          category: data.category || "",
          memoryYear: data.memoryYear || "",
          location: data.location || "",
        });
      } catch (err) {
        setError("Failed to load memory details for editing.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMemoryDetails();
    }
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await api.patch(`/v1/memories/${id}`, formData);
      alert("Memory updated successfully!");
      navigate("/my-memories"); 
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update memory.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-24 text-nostalgiaMuted font-medium animate-pulse">
        Loading memory data...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-nostalgiaCard rounded-3xl border border-gray-200/60 shadow-sm p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-black text-nostalgiaText">Edit Memory</h1>
          <p className="text-sm text-nostalgiaMuted">Update your nostalgic story details and memories.</p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-center text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-nostalgiaText mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-nostalgiaAccent/50"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-nostalgiaText mb-1">Category</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-nostalgiaAccent/50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-nostalgiaText mb-1">Year</label>
              <input
                type="number"
                name="memoryYear"
                value={formData.memoryYear}
                onChange={handleChange}
                className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-nostalgiaAccent/50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-nostalgiaText mb-1">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-nostalgiaAccent/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-nostalgiaText mb-1">Story</label>
            <textarea
              name="story"
              rows={6}
              value={formData.story}
              onChange={handleChange}
              required
              className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-nostalgiaAccent/50 resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate("/my-memories")}
              className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-nostalgiaText text-sm font-semibold rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-nostalgiaAccent hover:bg-[#ff5252] text-white text-sm font-semibold rounded-xl shadow-md transition disabled:opacity-50"
            >
              {submitting ? "Updating..." : "Update Memory"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMemory;