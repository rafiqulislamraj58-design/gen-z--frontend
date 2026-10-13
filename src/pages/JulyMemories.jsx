import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import api from "../services/api";

/* Same display serif as the other pages. Font link goes in index.html (see Home.jsx). */
const serif = { fontFamily: "'Fraunces', 'Playfair Display', Georgia, serif" };

/* Sunburst rays for the retro poster sun (pure SVG, drawn in code: no image files, no copyright). */
const rays = Array.from({ length: 28 }, (_, i) => i * (360 / 28));

/*
  Animations are all CSS/SVG made in code, so there is nothing to license:
  - jm-grain: drifting film grain
  - jm-spin: slow rotating sunburst
  - jm-breathe: the sun softly pulsing
  - jm-flicker: faint old-projector light flicker
  All of it switches off when the visitor prefers reduced motion.
*/
const retroCss = `
.jm-grain{
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.55'/%3E%3C/svg%3E");
  animation:jm-grain 1.2s steps(6) infinite;
}
.jm-halftone{
  background-image:radial-gradient(rgba(255,240,220,.28) 1.2px, transparent 1.6px);
  background-size:9px 9px;
}
.jm-spin{animation:jm-spin 140s linear infinite;transform-origin:center}
.jm-breathe{animation:jm-breathe 6s ease-in-out infinite;transform-origin:center}
.jm-flicker{animation:jm-flicker 5s steps(1) infinite}
@keyframes jm-grain{
  0%{transform:translate(0,0)}20%{transform:translate(-3%,2%)}40%{transform:translate(2%,-3%)}
  60%{transform:translate(-2%,-1%)}80%{transform:translate(3%,3%)}100%{transform:translate(0,0)}
}
@keyframes jm-spin{to{transform:rotate(360deg)}}
@keyframes jm-breathe{0%,100%{transform:scale(1)}50%{transform:scale(1.04)}}
@keyframes jm-flicker{0%{opacity:1}46%{opacity:1}47%{opacity:.82}48%{opacity:1}83%{opacity:1}84%{opacity:.88}86%{opacity:1}100%{opacity:1}}
@media (prefers-reduced-motion: reduce){
  .jm-grain,.jm-spin,.jm-breathe,.jm-flicker{animation:none}
}
`;

const JulyMemories = () => {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJulyMemories = async () => {
      try {
        setLoading(true);
        
       
        const catRes = await api.get("/v1/categories");
        const categories = catRes.data.data || catRes.data.categories || catRes.data;
        
        let julyCatId = "36-july"; 
        if (Array.isArray(categories)) {
          const found = categories.find(
            (c) => 
              c.slug?.toLowerCase().includes("july") || 
              c.name?.toLowerCase().includes("july") ||
              c.name?.toLowerCase().includes("৩৬")
          );
          if (found) {
            julyCatId = found._id || found.slug;
          }
        }

        const response = await api.get(`/v1/memories?category=${julyCatId}`);
        const data = response.data.data || response.data.memories || response.data;
       
        setMemories(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load July memories:", err);
        setError("Failed to load 36 July memories. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchJulyMemories();
  }, []);

  return (
    <div className="min-h-screen bg-cream">
      <style>{retroCss}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        {/* Hero Banner for 36 July */}
        <div className="relative overflow-hidden rounded-[2rem] mb-14 bg-gradient-to-br from-[#4a1512] via-[#5b1d17] to-deepBrown text-cream shadow-[0_40px_70px_-40px_rgba(60,15,10,0.8)] ring-1 ring-black/10">
          {/* Halftone dots, fading out toward the text */}
          <div
            aria-hidden="true"
            className="jm-halftone absolute inset-0 pointer-events-none"
            style={{
              maskImage: "linear-gradient(to left, black 0%, transparent 65%)",
              WebkitMaskImage: "linear-gradient(to left, black 0%, transparent 65%)",
            }}
          />

          {/* Retro poster sun */}
          <div
            aria-hidden="true"
            className="absolute -right-24 sm:-right-10 lg:right-6 top-1/2 -translate-y-1/2 w-[22rem] h-[22rem] sm:w-[28rem] sm:h-[28rem] pointer-events-none jm-flicker"
          >
            <svg viewBox="-200 -200 400 400" className="w-full h-full">
              <g className="jm-spin">
                {rays.map((deg) => (
                  <polygon
                    key={deg}
                    points="-5,-70 5,-70 14,-195 -14,-195"
                    transform={`rotate(${deg})`}
                    fill="#f6d9b0"
                    opacity="0.1"
                  />
                ))}
              </g>
              <g className="jm-breathe">
                <circle r="110" fill="#c0301f" />
                <circle r="110" fill="none" stroke="#f6d9b0" strokeOpacity="0.35" strokeWidth="2" />
                <circle r="86" fill="none" stroke="#f6d9b0" strokeOpacity="0.18" strokeWidth="1.5" strokeDasharray="2 7" />
              </g>
            </svg>
          </div>

          <div className="relative z-10 max-w-2xl px-7 sm:px-12 py-14 sm:py-20 space-y-6">
            {/* Rubber-stamp label */}
            <span className="inline-block -rotate-2 px-3.5 py-1.5 border-2 border-cream/60 rounded-[4px] text-xs font-bold tracking-widest uppercase text-cream/90">
              Historical Archive
            </span>
            <h1
              style={serif}
              className="text-4xl sm:text-5xl xl:text-6xl font-medium leading-[1.05] tracking-[-0.02em]"
            >
              36 July: The Days of Courage &amp; Awakening
            </h1>
            <p className="text-base text-cream/75 leading-relaxed max-w-lg">
              A dedicated space preserving the undying spirit, raw emotions, and historical moments of the July movement. Never forget.
            </p>
          </div>

          {/* Animated film grain over everything */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none mix-blend-overlay opacity-40" aria-hidden="true">
            <div className="jm-grain absolute -inset-[10%]" />
          </div>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div
            role="status"
            aria-label="Loading historical memories"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
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
            <div className="mx-auto w-24 bg-[#fffdf9] p-2 pb-4 rounded-[4px] rotate-[5deg] shadow-[0_18px_30px_-14px_rgba(60,35,20,0.4)] ring-1 ring-deepBrown/5">
              <div className="aspect-[4/5] rounded-[2px] bg-gradient-to-b from-[#e7b9a0] via-[#b9382a]/70 to-[#4a1512]" />
            </div>
            <h2 style={serif} className="mt-8 text-2xl font-medium text-deepBrown tracking-[-0.01em]">
              The archive is empty for now
            </h2>
            <p className="mt-2 text-deepBrown/60">No memories found for 36 July yet.</p>
            <Link
              to="/create"
              className="mt-6 inline-block font-semibold text-deepBrown underline decoration-red-700 decoration-2 underline-offset-4 hover:text-red-700 transition-colors"
            >
              Be the first to share a July memory
            </Link>
          </div>
        )}

        {/* Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-9">
          {memories.map((memory, idx) => {
            const memoryId = memory._id || memory.id;
            return (
              <article
                key={memoryId}
                className={`group relative bg-[#fffdf9] p-3 rounded-[6px] ring-1 ring-deepBrown/5 shadow-[0_26px_46px_-26px_rgba(60,35,20,0.5),0_2px_6px_rgba(60,35,20,0.08)] flex flex-col justify-between transition-all duration-500 hover:rotate-0 hover:-translate-y-1.5 ${
                  idx % 2 ? "rotate-[0.7deg]" : "-rotate-[0.7deg]"
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
                      {/* Faded archive look; colour returns on hover */}
                      <img
                        src={memory.images[0].url}
                        alt={memory.title}
                        className="w-full h-full object-cover grayscale-[0.55] sepia-[0.3] contrast-[1.05] group-hover:grayscale-0 group-hover:sepia-[0.1] group-hover:scale-[1.03] transition-all duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-tr from-red-900/20 via-transparent to-[#ffd29a]/25 mix-blend-soft-light pointer-events-none" />
                      <div className="absolute inset-0 shadow-[inset_0_0_36px_rgba(40,20,10,0.35)] pointer-events-none" />
                    </div>
                  ) : (
                    <div className="relative aspect-[4/3] rounded-[3px] overflow-hidden bg-gradient-to-b from-[#e7b9a0] via-[#b9382a]/70 to-[#4a1512]">
                      <div className="jm-halftone absolute inset-0" />
                    </div>
                  )}

                  <div className="px-3 pt-5 pb-4 space-y-3">
                    <div className="flex items-center justify-between gap-3 text-xs">
                      {/* Rubber-stamp category */}
                      <span className="shrink-0 -rotate-2 px-2.5 py-1 border-[1.5px] border-red-800/60 text-red-800 rounded-[3px] font-bold">
                        36 July Archive
                      </span>
                      {memory.location && (
                        <span className="flex items-center gap-1 text-deepBrown/55 min-w-0">
                          <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path
                              fillRule="evenodd"
                              d="M10 18s6-5.2 6-9.5A6 6 0 004 8.5C4 12.8 10 18 10 18zm0-7a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="truncate">{memory.location}</span>
                        </span>
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

                <div className="mx-3 mt-1 pt-4 pb-2 border-t border-dashed border-deepBrown/20 flex items-center justify-between gap-3 text-sm">
                  <span style={serif} className="italic text-deepBrown/55 truncate">
                    By {memory.author?.name || "Anonymous"}
                  </span>
                  <Link
                    to={`/memories/${memoryId}`}
                    className="shrink-0 font-semibold text-deepBrown underline decoration-red-700 decoration-2 underline-offset-4 hover:text-red-700 transition-colors"
                  >
                    Read story
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default JulyMemories;