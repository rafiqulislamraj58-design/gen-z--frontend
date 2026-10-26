import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import api from "../services/api";

/* Bangla glyph-er jonno Noto Serif Bengali fallback add kora hoyeche. Font link index.html-e thakbe (Home.jsx dekhun). */
const serif = {
  fontFamily: "'Fraunces', 'Noto Serif Bengali', 'Playfair Display', Georgia, serif",
};

/* Sunburst rays for the retro poster sun (pure SVG, drawn in code: no image files, no copyright). */
const rays = Array.from({ length: 28 }, (_, i) => i * (360 / 28));

/*
  Animations are all CSS/SVG made in code, so there is nothing to license:
  - jm-grain: drifting film grain
  - jm-spin: slow rotating sunburst
  - jm-breathe: the sun softly pulsing
  - jm-flicker: faint old-projector light flicker
  - jm-rise: archive cards slide in one after another
  - jm-shimmer / jm-devbg: skeleton light sweep + "developing" photo colour
  - jm-bar: thin progress bar at the top while fetching
  - jm-dot: bouncing dots next to the loading label
  - jm-develop: real photos fade in from a blurry, sepia state
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
.jm-rise{animation:jm-rise .9s cubic-bezier(.2,.7,.2,1) both}
.jm-shimmer{position:relative;overflow:hidden}
.jm-shimmer::after{
  content:"";position:absolute;inset:0;
  background:linear-gradient(100deg,transparent 20%,rgba(255,250,240,.55) 50%,transparent 80%);
  transform:translateX(-100%);
  animation:jm-shimmer 1.6s ease-in-out infinite;
}
.jm-devbg{animation:jm-devbg 2.8s ease-in-out infinite alternate}
.jm-bar{animation:jm-bar 1.3s cubic-bezier(.65,.1,.35,.9) infinite}
.jm-dot{display:inline-block;animation:jm-dot 1.2s ease-in-out infinite}
.jm-dot:nth-child(2){animation-delay:.15s}
.jm-dot:nth-child(3){animation-delay:.3s}
.jm-develop{animation:jm-develop 1.1s ease-out backwards}
@keyframes jm-grain{
  0%{transform:translate(0,0)}20%{transform:translate(-3%,2%)}40%{transform:translate(2%,-3%)}
  60%{transform:translate(-2%,-1%)}80%{transform:translate(3%,3%)}100%{transform:translate(0,0)}
}
@keyframes jm-spin{to{transform:rotate(360deg)}}
@keyframes jm-breathe{0%,100%{transform:scale(1)}50%{transform:scale(1.04)}}
@keyframes jm-flicker{0%{opacity:1}46%{opacity:1}47%{opacity:.82}48%{opacity:1}83%{opacity:1}84%{opacity:.88}86%{opacity:1}100%{opacity:1}}
@keyframes jm-rise{from{opacity:0;transform:translateY(26px)}to{opacity:1;transform:translateY(0)}}
@keyframes jm-shimmer{to{transform:translateX(100%)}}
@keyframes jm-devbg{
  from{background-color:rgba(60,35,20,.16)}
  to{background-color:rgba(231,185,160,.6)}
}
@keyframes jm-bar{
  0%{transform:translateX(-100%) scaleX(.3)}
  50%{transform:translateX(30%) scaleX(.6)}
  100%{transform:translateX(100%) scaleX(.3)}
}
@keyframes jm-dot{0%,80%,100%{transform:translateY(0);opacity:.35}40%{transform:translateY(-4px);opacity:1}}
@keyframes jm-develop{from{opacity:0;filter:blur(14px) brightness(1.5) sepia(1)}}
@media (prefers-reduced-motion: reduce){
  .jm-grain,.jm-spin,.jm-breathe,.jm-flicker,.jm-rise,.jm-devbg,.jm-bar,.jm-dot,.jm-develop{animation:none}
  .jm-shimmer::after{animation:none;display:none}
}
`;

/* Bangla digit (০১, ০২...) banate: archive file number-er jonno */
const toBn = (n) =>
  String(n)
    .padStart(2, "0")
    .replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[d]);

/* Photo that "develops" (fades in from blur) once loaded. UI only. */
const DevelopImg = ({ src, alt }) => {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  if (failed) return null;

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onLoad={() => setLoaded(true)}
      onError={() => setFailed(true)}
      className={`absolute inset-0 w-full h-full object-cover grayscale-[0.55] sepia-[0.3] contrast-[1.05] group-hover:grayscale-0 group-hover:sepia-[0.1] group-hover:scale-[1.03] transition-all duration-700 ${
        loaded ? "jm-develop" : "opacity-0"
      }`}
    />
  );
};

/* Skeleton card that looks like an archive print being developed. */
const SkeletonCard = ({ delay }) => (
  <div
    className="jm-rise bg-[#fffdf9] p-3 pb-5 rounded-[6px] ring-1 ring-deepBrown/5 shadow-[0_20px_40px_-24px_rgba(60,35,20,0.35)]"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="jm-shimmer jm-devbg aspect-[4/3] rounded-[3px] flex items-center justify-center">
      <svg
        className="w-9 h-9 text-deepBrown/20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M4 8a2 2 0 012-2h1.5l1-1.5h7l1 1.5H18a2 2 0 012 2v9a2 2 0 01-2 2H6a2 2 0 01-2-2V8z" />
        <circle cx="12" cy="12.5" r="3.5" />
      </svg>
    </div>
    <div className="mt-5 px-2 space-y-3">
      <div className="jm-shimmer h-3 w-1/3 rounded-full bg-deepBrown/10" />
      <div className="jm-shimmer h-5 w-2/3 rounded-full bg-deepBrown/10" />
      <div className="jm-shimmer h-3 w-full rounded-full bg-deepBrown/10" />
      <div className="jm-shimmer h-3 w-4/5 rounded-full bg-deepBrown/10" />
    </div>
  </div>
);

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
        setError("৩৬ জুলাইয়ের স্মৃতিগুলো লোড করা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।");
      } finally {
        setLoading(false);
      }
    };

    fetchJulyMemories();
  }, []);

  return (
    <div className="relative min-h-screen bg-cream overflow-hidden">
      <style>{retroCss}</style>

      {/* Thin indeterminate progress bar while fetching */}
      {loading && (
        <div aria-hidden="true" className="absolute top-0 inset-x-0 h-[3px] z-20 overflow-hidden bg-red-800/10">
          <div className="jm-bar h-full w-full bg-gradient-to-r from-transparent via-red-700 to-transparent" />
        </div>
      )}

      {/* Faint dotted paper texture */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.35] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(rgba(60,35,20,0.16) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
          maskImage: "linear-gradient(to bottom, black 0%, transparent 45%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 0%, transparent 45%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        {/* Hero Banner for 36 July */}
        <div className="relative overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] mb-12 sm:mb-14 bg-gradient-to-br from-[#4a1512] via-[#5b1d17] to-deepBrown text-cream shadow-[0_40px_70px_-40px_rgba(60,15,10,0.8)] ring-1 ring-black/10">
          {/* Halftone dots, fading out toward the text */}
          <div
            aria-hidden="true"
            className="jm-halftone absolute inset-0 pointer-events-none"
            style={{
              maskImage: "linear-gradient(to left, black 0%, transparent 65%)",
              WebkitMaskImage: "linear-gradient(to left, black 0%, transparent 65%)",
            }}
          />

          {/* Retro poster sun (dimmer on mobile so the text stays readable) */}
          <div
            aria-hidden="true"
            className="absolute -right-28 sm:-right-10 lg:right-6 top-1/2 -translate-y-1/2 w-[20rem] h-[20rem] sm:w-[28rem] sm:h-[28rem] opacity-40 sm:opacity-100 pointer-events-none jm-flicker"
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

          <div className="relative z-10 max-w-2xl px-6 sm:px-12 py-12 sm:py-20 space-y-5 sm:space-y-6">
            {/* Rubber-stamp label + live count */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-block -rotate-2 px-3.5 py-1.5 border-2 border-cream/60 rounded-[4px] text-xs font-bold tracking-wide text-cream/90">
                ঐতিহাসিক আর্কাইভ
              </span>
              {!loading && !error && memories.length > 0 && (
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cream/10 ring-1 ring-cream/20 text-xs font-semibold text-cream/85">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#ff9a3c]" aria-hidden="true" />
                  {memories.length.toLocaleString("bn-BD")}টি স্মৃতি সংরক্ষিত
                </span>
              )}
            </div>

            {/* Bangla-te negative tracking ar tight leading juktakkhor kete dey, tai alada man */}
            <h1
              style={serif}
              className="text-[1.9rem] min-[400px]:text-4xl sm:text-5xl xl:text-6xl font-medium leading-[1.4] tracking-normal"
            >
              ৩৬ জুলাই: সাহস ও জাগরণের <span className="font-medium text-[#ffb59a]">দিনগুলো</span>
            </h1>
            <p className="text-[15px] sm:text-base text-cream/75 leading-[1.9] max-w-lg">
              জুলাই আন্দোলনের অদম্য চেতনা, অকৃত্রিম আবেগ আর ঐতিহাসিক মুহূর্তগুলো সংরক্ষণের একটি বিশেষ জায়গা। কখনো ভুলব না।
            </p>

            <div className="pt-2 flex flex-col min-[420px]:flex-row gap-3">
              <a
                href="#july-archive"
                className="px-7 py-3 rounded-full bg-cream text-[#4a1512] text-sm font-semibold text-center shadow-[0_16px_34px_-14px_rgba(0,0,0,0.6)] hover:bg-white hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cream focus-visible:ring-offset-2 focus-visible:ring-offset-[#4a1512]"
              >
                আর্কাইভ পড়ুন ↓
              </a>
              <Link
                to="/create"
                className="px-7 py-3 rounded-full border border-cream/35 text-cream text-sm font-semibold text-center hover:bg-cream/10 hover:border-cream/60 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cream"
              >
                আপনার স্মৃতি শেয়ার করুন
              </Link>
            </div>
          </div>

          {/* Animated film grain over everything */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none mix-blend-overlay opacity-40" aria-hidden="true">
            <div className="jm-grain absolute -inset-[10%]" />
          </div>
        </div>

        {/* Film-perforation divider */}
        <div
          id="july-archive"
          aria-hidden="true"
          className="mb-12 h-3 opacity-30 scroll-mt-24"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(74,21,18,0.95) 2.5px, transparent 3px)",
            backgroundSize: "18px 12px",
            backgroundRepeat: "repeat-x",
            backgroundPosition: "center",
          }}
        />

        {/* Loading skeleton */}
        {loading && (
          <div role="status" aria-label="ঐতিহাসিক স্মৃতিগুলো লোড হচ্ছে">
            <p
              style={serif}
              className="mb-8 text-center text-deepBrown/55 text-[15px] leading-relaxed"
            >
              আর্কাইভ খোলা হচ্ছে
              <span className="ml-1" aria-hidden="true">
                <span className="jm-dot">.</span>
                <span className="jm-dot">.</span>
                <span className="jm-dot">.</span>
              </span>
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-9">
              {[0, 1, 2].map((n) => (
                <SkeletonCard key={n} delay={n * 90} />
              ))}
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="max-w-md mx-auto flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm leading-relaxed"
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
          <div className="max-w-lg mx-auto text-center py-16 px-6 sm:px-8 rounded-3xl bg-white/60 border border-dashed border-deepBrown/20">
            <div className="mx-auto w-24 bg-[#fffdf9] p-2 pb-4 rounded-[4px] rotate-[5deg] shadow-[0_18px_30px_-14px_rgba(60,35,20,0.4)] ring-1 ring-deepBrown/5">
              <div className="aspect-[4/5] rounded-[2px] bg-gradient-to-b from-[#e7b9a0] via-[#b9382a]/70 to-[#4a1512]" />
            </div>
            <h2 style={serif} className="mt-8 text-2xl font-medium text-deepBrown leading-snug">
              আর্কাইভ আপাতত খালি
            </h2>
            <p className="mt-2 text-deepBrown/60 leading-relaxed">৩৬ জুলাইয়ের কোনো স্মৃতি এখনো পাওয়া যায়নি।</p>
            <Link
              to="/create"
              className="mt-6 inline-block font-semibold text-deepBrown underline decoration-red-700 decoration-2 underline-offset-4 hover:text-red-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-700 rounded"
            >
              জুলাইয়ের প্রথম স্মৃতিটি আপনিই শেয়ার করুন
            </Link>
          </div>
        )}

        {/* Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-9">
          {memories.map((memory, idx) => {
            const memoryId = memory._id || memory.id;
            return (
              <div
                key={memoryId}
                className="jm-rise flex"
                style={{ animationDelay: `${Math.min(idx, 8) * 90}ms` }}
              >
                <article
                  className={`group relative flex-1 bg-[#fffdf9] p-3 rounded-[6px] ring-1 ring-deepBrown/5 shadow-[0_26px_46px_-26px_rgba(60,35,20,0.5),0_2px_6px_rgba(60,35,20,0.08)] flex flex-col justify-between transition-all duration-500 hover:rotate-0 hover:-translate-y-1.5 hover:shadow-[0_34px_54px_-24px_rgba(74,21,18,0.55),0_2px_6px_rgba(60,35,20,0.08)] ${
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
                      <div className="relative aspect-[4/3] rounded-[3px] overflow-hidden bg-gradient-to-b from-[#e7b9a0] via-[#b9382a]/70 to-[#4a1512]">
                        {/* Faded archive look; colour returns on hover */}
                        <DevelopImg src={memory.images[0].url} alt={memory.title} />
                        <div className="absolute inset-0 bg-gradient-to-tr from-red-900/20 via-transparent to-[#ffd29a]/25 mix-blend-soft-light pointer-events-none" />
                        <div className="absolute inset-0 shadow-[inset_0_0_36px_rgba(40,20,10,0.35)] pointer-events-none" />
                        {/* Archive file number */}
                        <span className="absolute top-2 left-2.5 text-[11px] font-bold tracking-wide text-cream/90 [text-shadow:0_1px_2px_rgba(0,0,0,0.6)]">
                          নং {toBn(idx + 1)}
                        </span>
                      </div>
                    ) : (
                      <div className="relative aspect-[4/3] rounded-[3px] overflow-hidden bg-gradient-to-b from-[#e7b9a0] via-[#b9382a]/70 to-[#4a1512]">
                        <div className="jm-halftone absolute inset-0" />
                        <span className="absolute top-2 left-2.5 text-[11px] font-bold tracking-wide text-cream/90">
                          নং {toBn(idx + 1)}
                        </span>
                      </div>
                    )}

                    <div className="px-3 pt-5 pb-4 space-y-3">
                      <div className="flex items-center justify-between gap-3 text-xs">
                        {/* Rubber-stamp category */}
                        <span className="shrink-0 -rotate-2 px-2.5 py-1 border-[1.5px] border-red-800/60 text-red-800 rounded-[3px] font-bold">
                          ৩৬ জুলাই আর্কাইভ
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
                        className="text-xl font-medium text-deepBrown leading-snug group-hover:text-red-700 transition-colors duration-300"
                      >
                        {memory.title}
                      </h3>
                      <p className="text-sm text-deepBrown/65 leading-[1.8] line-clamp-3">
                        {memory.story}
                      </p>
                    </div>
                  </div>

                  <div className="mx-3 mt-1 pt-4 pb-2 border-t border-dashed border-deepBrown/20 flex items-center justify-between gap-3 text-sm">
                    <span style={serif} className="text-deepBrown/55 truncate">
                      লেখক: {memory.author?.name || "অজ্ঞাতনামা"}
                    </span>
                    <Link
                      to={`/memories/${memoryId}`}
                      className="shrink-0 font-semibold text-deepBrown underline decoration-red-700 decoration-2 underline-offset-4 hover:text-red-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-700 rounded"
                    >
                      গল্পটি পড়ুন{" "}
                      <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </Link>
                  </div>
                </article>
              </div>
            );
          })}
        </div>

        {/* Closing call-to-action (only when there is something in the archive) */}
        {!loading && !error && memories.length > 0 && (
          <div className="mt-16 sm:mt-20 text-center max-w-xl mx-auto">
            <span className="inline-block -rotate-2 mb-4 px-3 py-1 border-[1.5px] border-red-800/60 text-red-800 rounded-[3px] text-xs font-bold tracking-wide">
              কখনো ভুলব না
            </span>
            <p style={serif} className="text-2xl sm:text-3xl font-medium text-deepBrown leading-[1.5]">
              এমন কোনো মুহূর্ত কি আপনার কাছে আছে, যা ধরে রাখতে চান?
            </p>
            <Link
              to="/create"
              className="mt-6 inline-block px-8 py-3.5 rounded-full bg-[#4a1512] text-cream text-sm font-semibold shadow-[0_18px_40px_-16px_rgba(74,21,18,0.7)] hover:bg-red-700 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-700 focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
            >
              জুলাইয়ের একটি স্মৃতি শেয়ার করুন
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default JulyMemories;