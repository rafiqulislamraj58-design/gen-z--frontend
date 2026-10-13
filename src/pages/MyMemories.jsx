import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import api from "../services/api";

/* Same display serif as Home, Login & Register. Font link goes in index.html (see Home.jsx). */
const serif = { fontFamily: "'Fraunces', 'Playfair Display', Georgia, serif" };

/*
  All motion here is plain CSS made in code (nothing to license):
  - mm-grain: faint drifting film grain over the page
  - mm-rise: cards develop in one after another on load (a single entrance moment)
  - mm-float: the little polaroid in the header slowly bobs
  Switched off automatically when the visitor prefers reduced motion.
*/
const retroCss = `
.mm-grain{
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.55'/%3E%3C/svg%3E");
  animation:mm-grain 1.2s steps(6) infinite;
}
.mm-rise{animation:mm-rise .9s cubic-bezier(.2,.7,.2,1) both}
.mm-float{animation:mm-float 5s ease-in-out infinite}
@keyframes mm-grain{
  0%{transform:translate(0,0)}20%{transform:translate(-3%,2%)}40%{transform:translate(2%,-3%)}
  60%{transform:translate(-2%,-1%)}80%{transform:translate(3%,3%)}100%{transform:translate(0,0)}
}
@keyframes mm-rise{from{opacity:0;transform:translateY(26px)}to{opacity:1;transform:translateY(0)}}
@keyframes mm-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
@media (prefers-reduced-motion: reduce){
  .mm-grain,.mm-rise,.mm-float{animation:none}
}
`;

const MyMemories = () => {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

const fetchMyMemories = async () => {
  try {
    setLoading(true);
    const response = await api.get("/v1/memories/mine");
    console.log("My Memories Response:", response.data); 
    
    const fetchedData = response.data.data || response.data.memories || response.data;
    setMemories(Array.isArray(fetchedData) ? fetchedData : []);
  } catch (err) {
    console.error("Fetch error details:", err.response || err);
    setError(err.response?.data?.message || "Failed to load your memories.");
  } finally {
    setLoading(false);
  }
};
  useEffect(() => {
    fetchMyMemories();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this memory?")) return;

    try {
      await api.delete(`/v1/memories/${id}`);
      setMemories((prev) => prev.filter((m) => m._id !== id && m.id !== id));
    } catch (err) {
      alert("Failed to delete memory. Please try again.");
    }
  };

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
          maskImage: "linear-gradient(to bottom, black 0%, transparent 55%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 0%, transparent 55%)",
        }}
      />
      <div className="absolute -top-32 right-[6%] w-[30rem] h-[30rem] bg-coral/20 rounded-full blur-[140px] pointer-events-none" />

      {/* Drifting film grain over the whole page */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none mix-blend-multiply opacity-[0.07]" aria-hidden="true">
        <div className="mm-grain absolute -inset-[10%]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-12 sm:py-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-8 mb-6">
          <div className="flex items-end gap-6">
            {/* Floating mini polaroid (decorative) */}
            <div aria-hidden="true" className="mm-float hidden sm:block shrink-0">
              <div className="relative w-20 bg-[#fffdf9] p-1.5 pb-4 rounded-[3px] -rotate-[8deg] shadow-[0_18px_28px_-12px_rgba(60,35,20,0.5)] ring-1 ring-deepBrown/5">
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 rotate-[4deg] w-8 h-3 bg-[#f1dcb4]/85 shadow-[0_1px_2px_rgba(60,35,20,0.18)]" />
                <div className="relative aspect-[4/5] rounded-[2px] overflow-hidden bg-gradient-to-b from-[#f8d3ad] via-coral/50 to-[#6b3f33]">
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-[26%] w-5 h-5 rounded-full bg-[#fff2dc] shadow-[0_0_22px_8px_rgba(255,226,180,0.55)]" />
                </div>
              </div>
            </div>

            <div>
              <h1
                style={serif}
                className="text-4xl sm:text-5xl xl:text-6xl font-medium text-deepBrown tracking-[-0.025em] leading-[1.02]"
              >
                My memories
              </h1>
              <p className="mt-3 text-deepBrown/60 max-w-md leading-relaxed">
                Everything you've shared, in one place. View, edit or remove any of it.
              </p>
              {!loading && !error && memories.length > 0 && (
                <p className="mt-2 text-sm text-deepBrown/45">
                  {memories.length} {memories.length === 1 ? "memory" : "memories"} saved
                </p>
              )}
            </div>
          </div>
          <Link
            to="/create"
            className="shrink-0 px-7 py-3.5 rounded-full bg-deepBrown text-cream text-sm font-semibold shadow-[0_18px_40px_-16px_rgba(60,35,20,0.55)] hover:bg-coral hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
          >
            + Share new memory
          </Link>
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

        {/* Loading skeleton */}
        {loading && (
          <div
            role="status"
            aria-label="Loading your memories"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-9"
          >
            {[0, 1, 2].map((n) => (
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

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="max-w-md mx-auto flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm"
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

        {/* Empty state */}
        {!loading && !error && memories.length === 0 && (
          <div className="max-w-lg mx-auto text-center py-16 px-8 rounded-3xl bg-white/60 border border-dashed border-deepBrown/20">
            <div className="mm-float mx-auto w-24">
              <div className="relative bg-[#fffdf9] p-2 pb-4 rounded-[4px] -rotate-[6deg] shadow-[0_18px_30px_-14px_rgba(60,35,20,0.4)] ring-1 ring-deepBrown/5">
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rotate-[3deg] w-10 h-3.5 bg-[#f1dcb4]/85 shadow-[0_1px_2px_rgba(60,35,20,0.18)]" />
                <div className="aspect-[4/5] rounded-[2px] bg-gradient-to-b from-[#f8d3ad] via-coral/40 to-[#6b3f33]/80" />
              </div>
            </div>
            <h2 style={serif} className="mt-8 text-2xl font-medium text-deepBrown tracking-[-0.01em]">
              Nothing here yet
            </h2>
            <p className="mt-2 text-deepBrown/60">You haven't shared any memories yet.</p>
            <Link
              to="/create"
              className="mt-6 inline-block font-semibold text-deepBrown underline decoration-coral decoration-2 underline-offset-4 hover:text-coral transition-colors"
            >
              Create your first memory
            </Link>
          </div>
        )}

        {/* Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-9">
          {memories.map((memory, idx) => {
            const memoryId = memory._id || memory.id;
            return (
              <div
                key={memoryId}
                className="mm-rise flex"
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
                          alt={memory.title}
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
                          {memory.category}
                        </span>
                        {memory.memoryYear && (
                          <span className="text-deepBrown/50 font-medium tabular-nums">{memory.memoryYear}</span>
                        )}
                      </div>

                      <h3
                        style={serif}
                        className="text-xl font-medium text-deepBrown tracking-[-0.01em] leading-snug"
                      >
                        {memory.title}
                      </h3>
                      <p className="text-sm text-deepBrown/65 leading-relaxed line-clamp-3">
                        {memory.story}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons: View, Edit, Delete */}
                  <div className="mx-3 mt-1 pt-4 pb-2 border-t border-dashed border-deepBrown/20 flex items-center justify-between text-sm font-semibold">
                    <Link
                      to={`/memories/${memoryId}`}
                      className="text-deepBrown underline decoration-coral decoration-2 underline-offset-4 hover:text-coral transition-colors"
                    >
                      View details
                    </Link>

                    <div className="flex items-center gap-4">
                      <Link
                        to={`/edit-memory/${memoryId}`}
                        className="text-deepBrown/70 hover:text-coral transition-colors"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() => handleDelete(memoryId)}
                        className="text-red-600/80 hover:text-red-700 transition-colors focus:outline-none focus-visible:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MyMemories;