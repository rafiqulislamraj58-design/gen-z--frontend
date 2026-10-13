import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import api from "../services/api";

const Feed = () => {
  const [memories, setMemories] = useState([]);
  const [categories, setCategories] = useState([{ _id: "all", name: "All Memories" }]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // ব্যাকএন্ড থেকে ক্যাটাগরিগুলো ফেচ করা
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/v1/categories"); // অথবা তোমার রাউট অনুযায়ী
        const catData = response.data.data || response.data.categories || response.data;
        if (Array.isArray(catData)) {
          setCategories([{ _id: "all", name: "All Memories" }, ...catData]);
        }
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };
    fetchCategories();
  }, []);

  // মেমোরি লিস্ট এবং ফিল্টার/সার্চ হ্যান্ডেল করা
  useEffect(() => {
    const fetchMemories = async () => {
      try {
        setLoading(true);
        let url = `/v1/memories?page=${page}&limit=12`;
        
        if (selectedCategory && selectedCategory !== "all") {
          url += `&category=${selectedCategory}`;
        }
        if (searchQuery.trim()) {
          url += `&search=${encodeURIComponent(searchQuery.trim())}`;
        }

        const response = await api.get(url);
        
        setMemories(response.data.data || response.data.memories || []);
        if (response.data.pagination) {
          setTotalPages(response.data.pagination.totalPages);
        }
      } catch (err) {
        setError("Failed to load memories feed. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchMemories();
    }, 300);

    return () => clearTimeout(timer);
  }, [page, searchQuery, selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header Section */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h1 className="text-4xl font-black text-nostalgiaText tracking-tight">Community Memories Feed</h1>
        <p className="text-sm text-nostalgiaMuted mt-2">
          Explore raw, genuine moments, history, and nostalgic stories shared by the community.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="mb-10 space-y-4">
        {/* Search Input */}
        <div className="max-w-xl mx-auto relative">
          <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
            🔍
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search memories by title, keyword, or story..."
            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-nostalgiaAccent/50 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-xs text-gray-400 hover:text-gray-600"
            >
              Clear ✕
            </button>
          )}
        </div>

        {/* Dynamic Category Filter Pills from Backend */}
        <div className="flex flex-wrap justify-center gap-2 pt-2">
          {categories.map((cat) => {
            const catId = cat._id || cat.id || cat.slug || cat;
            const catName = cat.name || cat.label || cat;
            return (
              <button
                key={catId}
                onClick={() => {
                  setSelectedCategory(catId);
                  setPage(1);
                }}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all shadow-sm capitalize ${
                  selectedCategory === catId
                    ? "bg-deepBrown text-cream shadow-md scale-105"
                    : "bg-white text-nostalgiaMuted border border-gray-200 hover:border-gray-300 hover:text-nostalgiaText"
                }`}
              >
                {catName}
              </button>
            );
          })}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 py-10">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm animate-pulse space-y-4 h-80">
              <div className="w-full h-40 bg-gray-200 rounded-xl" />
              <div className="h-4 bg-gray-200 rounded w-1/3" />
              <div className="h-6 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-full" />
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="max-w-md mx-auto p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-center text-sm my-10">
          {error}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && memories.length === 0 && (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-200/60 p-8 my-10 shadow-sm">
          <p className="text-lg font-semibold text-nostalgiaText mb-2">No memories found</p>
          <p className="text-sm text-nostalgiaMuted mb-6">Try adjusting your search query or category filter.</p>
          <Link
            to="/create"
            className="inline-block px-6 py-2.5 bg-deepBrown text-cream rounded-full text-sm font-semibold hover:bg-coral transition-colors"
          >
            Share the first memory →
          </Link>
        </div>
      )}

      {/* Grid Layout for Memories */}
      {!loading && memories.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {memories.map((memory) => {
            const memoryId = memory._id || memory.id;
            return (
              <div
                key={memoryId}
                className="bg-nostalgiaCard rounded-2xl border border-gray-200/60 shadow-sm overflow-hidden hover:shadow-md transition-all flex flex-col justify-between group"
              >
                {memory.images && memory.images.length > 0 && memory.images[0].url && (
                  <div className="overflow-hidden h-48 border-b border-gray-100">
                    <img
                      src={memory.images[0].url}
                      alt={memory.images[0].altText || memory.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                
                <div className="p-6 space-y-3 flex-grow">
                  <div className="flex items-center justify-between text-xs text-nostalgiaMuted">
                    <span className="px-2.5 py-1 bg-gray-100 rounded-full font-medium capitalize">
                      {memory.category?.name || memory.category}
                    </span>
                    {memory.memoryYear && <span className="font-semibold">{memory.memoryYear}</span>}
                  </div>

                  <h3 className="text-lg font-bold text-nostalgiaText group-hover:text-nostalgiaAccent transition-colors">
                    {memory.title}
                  </h3>
                  
                  <p className="text-sm text-nostalgiaMuted leading-relaxed line-clamp-3">
                    {memory.story}
                  </p>

                  {memory.location && (
                    <p className="text-xs text-nostalgiaMuted flex items-center gap-1 pt-1">
                      📍 {memory.location}
                    </p>
                  )}
                </div>

                <div className="px-6 pb-6 pt-0 text-xs text-nostalgiaMuted flex items-center justify-between border-t border-gray-100/50 pt-4">
                  <span>By {memory.author?.name || "Anonymous"}</span>
                  
                  <Link
                    to={`/memories/${memoryId}`}
                    className="font-semibold text-nostalgiaAccent hover:underline"
                  >
                    Read more →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && !loading && (
        <div className="flex justify-center items-center gap-4 mt-12">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold disabled:opacity-40 hover:bg-gray-50 transition-colors shadow-sm"
          >
            Previous
          </button>
          <span className="text-sm font-medium text-nostalgiaMuted">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className="px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold disabled:opacity-40 hover:bg-gray-50 transition-colors shadow-sm"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Feed;