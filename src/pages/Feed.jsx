import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import api from "../services/api";

/* Same display serif as the other pages. Font link goes in index.html (see Home.jsx). */
const serif = { fontFamily: "'Fraunces', 'Playfair Display', Georgia, serif" };

/*
  All motion is plain CSS made in code (nothing to license):
  - fd-grain: faint drifting film grain
  - fd-rise: cards develop in one after another when the list loads
  - fd-float: the two header polaroids slowly bob
  Switched off automatically when the visitor prefers reduced motion.
*/
const retroCss = `
.fd-grain{
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.55'/%3E%3C/svg%3E");
  animation:fd-grain 1.2s steps(6) infinite;
}
.fd-rise{animation:fd-rise .9s cubic-bezier(.2,.7,.2,1) both}
.fd-float{animation:fd-float 5s ease-in-out infinite}
.fd-float-b{animation:fd-float 6.2s ease-in-out infinite reverse}
@keyframes fd-grain{
  0%{transform:translate(0,0)}20%{transform:translate(-3%,2%)}40%{transform:translate(2%,-3%)}
  60%{transform:translate(-2%,-1%)}80%{transform:translate(3%,3%)}100%{transform:translate(0,0)}
}
@keyframes fd-rise{from{opacity:0;transform:translateY(26px)}to{opacity:1;transform:translateY(0)}}
@keyframes fd-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
@media (prefers-reduced-motion: reduce){
  .fd-grain,.fd-rise,.fd-float,.fd-float-b{animation:none}
}
`;

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
        const response = await api.get("/v1/categories"); // অথবা তোমার রাউট অনুযায়ী
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
    <div className="relative min-h-screen bg-cream overflow-hidden">
      <style>{retroCss}</style>

      {/* Faint dotted paper texture + one quiet glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.35] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(rgba(60,35,20,0.16) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
          maskImage: "linear-gradient(to bottom, black 0%, transparent 50%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 0%, transparent 50%)",
        }}
      />
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[34rem] h-[34rem] bg-coral/20 rounded-full blur-[150px] pointer-events-none" />

      {/* Drifting film grain over the whole page */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none mix-blend-multiply opacity-[0.07]" aria-hidden="true">
        <div className="fd-grain absolute -inset-[10%]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Header Section */}
        <div className="relative text-center max-w-2xl mx-auto mb-12">
          {/* Floating mini polaroids (decorative, wide screens only) */}
          <div aria-hidden="true" className="fd-float hidden xl:block absolute -left-56 top-0">
            <div className="relative w-24 bg-[#fffdf9] p-1.5 pb-4 rounded-[3px] -rotate-[9deg] shadow-[0_18px_28px_-12px_rgba(60,35,20,0.5)] ring-1 ring-deepBrown/5">
              <span className="absolute -top-2 left-1/2 -translate-x-1/2 rotate-[4deg] w-9 h-3 bg-[#f1dcb4]/85 shadow-[0_1px_2px_rgba(60,35,20,0.18)]" />
              <div className="relative aspect-[4/5] rounded-[2px] overflow-hidden bg-gradient-to-b from-[#f8d3ad] via-coral/50 to-[#6b3f33]">
                <div className="absolute left-1/2 -translate-x-1/2 bottom-[26%] w-6 h-6 rounded-full bg-[#fff2dc] shadow-[0_0_24px_8px_rgba(255,226,180,0.55)]" />
              </div>
            </div>
          </div>
          <div aria-hidden="true" className="fd-float-b hidden xl:block absolute -right-56 top-6">
            <div className="relative w-24 bg-[#fffdf9] p-1.5 pb-4 rounded-[3px] rotate-[7deg] shadow-[0_18px_28px_-12px_rgba(60,35,20,0.5)] ring-1 ring-deepBrown/5">
              <span className="absolute -top-2 left-1/2 -translate-x-1/2 -rotate-[3deg] w-9 h-3 bg-[#f1dcb4]/85 shadow-[0_1px_2px_rgba(60,35,20,0.18)]" />
              <div className="aspect-[4/5] rounded-[2px] bg-gradient-to-b from-[#3b2a26] via-[#5a3a31] to-coral/70" />
            </div>
          </div>

          <h1
            style={serif}
            className="text-4xl sm:text-5xl xl:text-6xl font-medium text-deepBrown tracking-[-0.025em] leading-[1.04]"
          >
            Community memories feed
          </h1>
          <p className="mt-4 text-deepBrown/60 leading-relaxed">
            Explore raw, genuine moments, history, and nostalgic stories shared by the community.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="mb-10 space-y-5">
          {/* Search Input */}
          <div className="max-w-xl mx-auto relative">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-deepBrown/40">
              <svg className="w-[18px] h-[18px]" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <circle cx="9" cy="9" r="6" />
                <path d="M14 14l3.5 3.5" />
              </svg>
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search memories by title, keyword, or story..."
              className="w-full pl-11 pr-24 py-3.5 rounded-full bg-white/70 border border-deepBrown/15 text-deepBrown placeholder:text-deepBrown/35 text-[15px] shadow-[0_14px_30px_-20px_rgba(60,35,20,0.45)] transition-all duration-200 hover:border-deepBrown/30 focus:outline-none focus:bg-white focus:border-coral focus:ring-4 focus:ring-coral/15"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-5 flex items-center text-xs font-semibold text-deepBrown/50 hover:text-coral transition-colors focus:outline-none focus-visible:text-coral"
              >
                Clear ✕
              </button>
            )}
          </div>

          {/* Dynamic Category Filter Pills from Backend */}
          <div className="flex flex-wrap justify-center gap-2.5 pt-1">
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
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 capitalize focus:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-cream ${
                    selectedCategory === catId
                      ? "bg-deepBrown text-cream shadow-[0_12px_24px_-12px_rgba(60,35,20,0.6)] scale-105"
                      : "bg-white/70 text-deepBrown/65 border border-deepBrown/15 hover:border-coral hover:text-deepBrown hover:bg-white"
                  }`}
                >
                  {catName}
                </button>
              );
            })}
          </div>
        </div>

        {/* Film-perforation divider */}
        <div
          aria-hidden="true"
          className="mb-12 h-3 opacity-30"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(60,35,20,0.9) 2.5px, transparent 3px)",
            backgroundSize: "18px 12px",
            backgroundRepeat: "repeat-x",
            backgroundPosition: "center",
          }}
        />

        {/* Loading State */}
        {loading && (
          <div
            role="status"
            aria-label="Loading memories"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-9"
          >
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="bg-[#fffdf9] p-3 pb-5 rounded-[6px] ring-1 ring-deepBrown/5 shadow-[0_20px_40px_-24px_rgba(60,35,20,0.35)] animate-pulse"
              >
                <div className="aspect-[4/3] rounded-[3px] bg-deepBrown/10" />
                <div className="mt-5 px-2 space-y-3">
                  <div className="h-3 w-1/3 rounded-full bg-deepBrown/10" />
                  <div className="h-5 w-2/3 rounded-full bg-deepBrown/10" />
                  <div className="h-3 w-full rounded-full bg-deepBrown/10" />
                  <div className="h-3 w-4/5 rounded-full bg-deepBrown/10" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div
            role="alert"
            className="max-w-md mx-auto flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm my-10"
          >
            <svg className="w-5 h-5 shrink-0 mt-px" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-4a1 1 0 00-1 1v3a1 1 0 002 0V7a1 1 0 00-1-1zm0 8a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && memories.length === 0 && (
          <div className="max-w-lg mx-auto text-center py-16 px-8 rounded-3xl bg-white/60 border border-dashed border-deepBrown/20 my-10">
            <div className="fd-float mx-auto w-24">
              <div className="relative bg-[#fffdf9] p-2 pb-4 rounded-[4px] -rotate-[6deg] shadow-[0_18px_30px_-14px_rgba(60,35,20,0.4)] ring-1 ring-deepBrown/5">
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rotate-[3deg] w-10 h-3.5 bg-[#f1dcb4]/85 shadow-[0_1px_2px_rgba(60,35,20,0.18)]" />
                <div className="aspect-[4/5] rounded-[2px] bg-gradient-to-b from-[#f8d3ad] via-coral/40 to-[#6b3f33]/80" />
              </div>
            </div>
            <p style={serif} className="mt-8 text-2xl font-medium text-deepBrown tracking-[-0.01em]">
              No memories found
            </p>
            <p className="mt-2 mb-6 text-deepBrown/60">Try adjusting your search query or category filter.</p>
            <Link
              to="/create"
              className="inline-block px-7 py-3 rounded-full bg-deepBrown text-cream text-sm font-semibold shadow-[0_18px_40px_-16px_rgba(60,35,20,0.55)] hover:bg-coral hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
            >
              Share the first memory →
            </Link>
          </div>
        )}

        {/* Grid Layout for Memories */}
        {!loading && memories.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-9">
            {memories.map((memory, idx) => {
              const memoryId = memory._id || memory.id;
              return (
                <div
                  key={memoryId}
                  className="fd-rise flex"
                  style={{ animationDelay: `${Math.min(idx, 8) * 90}ms` }}
                >
                  <article
                    className={`group relative flex-1 bg-[#fffdf9] p-3 rounded-[6px] ring-1 ring-deepBrown/5 shadow-[0_26px_46px_-26px_rgba(60,35,20,0.5),0_2px_6px_rgba(60,35,20,0.08)] flex flex-col justify-between transition-all duration-500 hover:rotate-0 hover:-translate-y-1.5 hover:shadow-[0_34px_54px_-24px_rgba(60,35,20,0.55),0_2px_6px_rgba(60,35,20,0.08)] ${
                      idx % 2 ? "rotate-[0.8deg]" : "-rotate-[0.8deg]"
                    }`}
                  >
                    {/* Washi tape */}
                    <span
                      aria-hidden="true"
                      className={`absolute -top-3 left-1/2 -translate-x-1/2 ${
                        idx % 2 ? "rotate-[3deg]" : "-rotate-[3deg]"
                      } w-16 h-5 bg-[#f1dcb4]/85 shadow-[0_1px_3px_rgba(60,35,20,0.18)] z-10`}
                    />

                    <div>
                      {memory.images && memory.images.length > 0 && memory.images[0].url ? (
                        <div className="relative aspect-[4/3] rounded-[3px] overflow-hidden bg-deepBrown/10">
                          <img
                            src={memory.images[0].url}
                            alt={memory.images[0].altText || memory.title}
                            className="w-full h-full object-cover saturate-[1.08] sepia-[0.2] contrast-[1.04] group-hover:sepia-0 group-hover:scale-[1.04] transition-all duration-700"
                          />
                          {/* Film warmth + light leak + inner vignette */}
                          <div className="absolute inset-0 bg-gradient-to-tr from-coral/25 via-transparent to-[#ffd29a]/30 mix-blend-soft-light pointer-events-none" />
                          <div className="absolute inset-0 shadow-[inset_0_0_36px_rgba(40,20,10,0.3)] pointer-events-none" />
                          {memory.memoryYear && (
                            <span className="absolute bottom-2 right-2.5 text-[11px] tracking-widest text-[#ff9a3c] [text-shadow:0_1px_2px_rgba(0,0,0,0.5)] tabular-nums">
                              ’{String(memory.memoryYear).slice(-2)}
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="aspect-[4/3] rounded-[3px] bg-gradient-to-b from-[#f8d3ad] via-coral/40 to-[#6b3f33]/80" />
                      )}

                      <div className="px-3 pt-5 pb-4 space-y-3">
                        <div className="flex items-center justify-between text-xs">
                          {/* Rubber-stamp category */}
                          <span className="-rotate-2 px-2.5 py-1 border-[1.5px] border-coral/70 text-deepBrown rounded-[3px] font-bold capitalize">
                            {memory.category?.name || memory.category}
                          </span>
                          {memory.memoryYear && (
                            <span className="text-deepBrown/50 font-medium tabular-nums">{memory.memoryYear}</span>
                          )}
                        </div>

                        <h3
                          style={serif}
                          className="text-xl font-medium text-deepBrown tracking-[-0.01em] leading-snug group-hover:text-coral transition-colors duration-300"
                        >
                          {memory.title}
                        </h3>

                        <p className="text-sm text-deepBrown/65 leading-relaxed line-clamp-3">
                          {memory.story}
                        </p>

                        {memory.location && (
                          <p className="text-xs text-deepBrown/55 flex items-center gap-1.5 pt-1">
                            <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path
                                fillRule="evenodd"
                                d="M10 18s6-5.2 6-9.5A6 6 0 004 8.5C4 12.8 10 18 10 18zm0-7a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span className="truncate">{memory.location}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mx-3 mt-1 pt-4 pb-2 border-t border-dashed border-deepBrown/20 flex items-center justify-between gap-3 text-sm">
                      <span style={serif} className="italic text-deepBrown/55 truncate">
                        By {memory.author?.name || "Anonymous"}
                      </span>

                      <Link
                        to={`/memories/${memoryId}`}
                        className="shrink-0 font-semibold text-deepBrown underline decoration-coral decoration-2 underline-offset-4 hover:text-coral transition-colors"
                      >
                        Read more →
                      </Link>
                    </div>
                  </article>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && !loading && (
          <div className="flex justify-center items-center gap-4 mt-14">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="px-6 py-2.5 rounded-full bg-white/70 border border-deepBrown/15 text-deepBrown text-sm font-semibold hover:border-coral hover:bg-white disabled:opacity-40 disabled:hover:border-deepBrown/15 disabled:hover:bg-white/70 disabled:cursor-not-allowed transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-coral"
            >
              Previous
            </button>
            <span style={serif} className="italic text-deepBrown/60 tabular-nums">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="px-6 py-2.5 rounded-full bg-deepBrown text-cream text-sm font-semibold shadow-[0_14px_28px_-14px_rgba(60,35,20,0.55)] hover:bg-coral disabled:opacity-40 disabled:hover:bg-deepBrown disabled:cursor-not-allowed transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;