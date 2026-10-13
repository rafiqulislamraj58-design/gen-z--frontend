import React, { useEffect, useRef } from "react";
import { Link } from "react-router";
import gsap from "gsap";

/*
  Add this once (index.html or index.css) for the display serif:
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;1,9..144,400&display=swap" rel="stylesheet" />
*/
const serif = { fontFamily: "'Fraunces', 'Playfair Display', Georgia, serif" };

/*
  PHOTOS: picsum.photos serves free Unsplash-licensed photos (free for commercial use,
  no attribution needed). Each `seed` always returns the same photo, so the page stays
  stable. To use your own Gen Z-style shots, download free ones from unsplash.com,
  pexels.com or pixabay.com, put them in /public/memories/ and set e.g. img: "/memories/rooftop.jpg".
*/
const prints = [
  {
    caption: "Cox's Bazar, golden hour",
    stamp: "’24  08  14",
    rot: -8,
    pos: "left-0 top-14 w-52 sm:w-60 z-10",
    photo: "from-[#f8d3ad] via-coral/50 to-[#6b3f33]",
    sun: true,
    img: "https://picsum.photos/seed/zenz-beach-sunset/600/750",
  },
  {
    caption: "Rooftop, last day of exams",
    stamp: "’23  12  02",
    rot: 5,
    pos: "right-0 top-0 w-56 sm:w-64 z-20",
    photo: "from-cream via-sand to-coral/40",
    sun: false,
    img: "https://picsum.photos/seed/zenz-friends-city/600/750",
  },
  {
    caption: "Lofi, 2 a.m., finally shipped",
    stamp: "’25  03  27",
    rot: -2,
    pos: "left-10 sm:left-16 bottom-0 w-52 sm:w-56 z-30",
    photo: "from-[#3b2a26] via-[#5a3a31] to-coral/70",
    sun: false,
    img: "https://picsum.photos/seed/zenz-night-desk/600/750",
  },
];

/* Little pieces of washi tape holding each print down (UI only). */
const tapes = ["-rotate-[4deg]", "rotate-[3deg]", "-rotate-[2deg]"];

const Home = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (reduce) {
        prints.forEach((p, i) => gsap.set(`.print-${i}`, { rotation: p.rot }));
        return;
      }

      // One orchestrated entrance: headline lines rise, copy settles, prints land.
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.from(".line", { yPercent: 115, duration: 1.2, stagger: 0.12 })
        .from(".fade", { opacity: 0, y: 14, duration: 0.9, stagger: 0.1 }, "-=0.7");

      prints.forEach((p, i) => {
        tl.fromTo(
          `.print-${i}`,
          { opacity: 0, y: -90, rotation: p.rot + 14 },
          { opacity: 1, y: 0, rotation: p.rot, duration: 1.3, ease: "back.out(1.25)" },
          0.35 + i * 0.18
        );
      });

      // Slow idle drift so the stack feels alive without being busy.
      gsap.utils.toArray(".drift").forEach((el, i) => {
        gsap.to(el, {
          y: i % 2 ? 9 : -9,
          duration: 3.2 + i * 0.6,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const lift = (i) => (e) =>
    gsap.to(e.currentTarget, { rotation: 0, scale: 1.04, y: -6, duration: 0.5, ease: "power3.out" });
  const settle = (i) => (e) =>
    gsap.to(e.currentTarget, { rotation: prints[i].rot, scale: 1, y: 0, duration: 0.6, ease: "power3.out" });

  return (
    <section
      ref={containerRef}
      className="relative min-h-[88vh] flex items-center px-5 sm:px-8 lg:px-12 py-16 lg:py-24 overflow-hidden"
    >
      {/* Faint dotted paper texture */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 opacity-[0.35] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(rgba(60,35,20,0.16) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
          maskImage: "radial-gradient(ellipse at 70% 50%, black 0%, transparent 70%)",
          WebkitMaskImage: "radial-gradient(ellipse at 70% 50%, black 0%, transparent 70%)",
        }}
      />

      {/* A single, quiet glow behind the prints */}
      <div className="absolute top-1/2 right-[8%] -translate-y-1/2 w-[34rem] h-[34rem] bg-coral/20 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="mx-auto max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-center">
        {/* Copy */}
        <div className="lg:col-span-6 text-center lg:text-left">
          <h1
            style={serif}
            className="text-5xl sm:text-6xl xl:text-[5.25rem] font-medium text-deepBrown tracking-[-0.025em] leading-[1.02]"
          >
            <span className="block overflow-hidden pb-[0.12em]">
              <span className="line block">Keep the moments</span>
            </span>
            <span className="block overflow-hidden pb-[0.12em]">
              <span className="line block italic font-normal text-coral">that made you.</span>
            </span>
          </h1>

          <p className="fade mt-7 text-base sm:text-lg text-deepBrown/70 max-w-md mx-auto lg:mx-0 leading-relaxed">
            Save the photos, songs and small days you never want to lose, and look back on them in a
            space that feels like yours.
          </p>

          <div className="fade mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4">
            <Link
              to="/feed"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-deepBrown text-cream font-semibold text-center shadow-[0_18px_40px_-16px_rgba(60,35,20,0.55)] hover:bg-coral hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
            >
              Browse memories
            </Link>
            <Link
              to="/create"
              className="w-full sm:w-auto px-8 py-4 rounded-full text-deepBrown font-semibold text-center border border-deepBrown/20 hover:border-deepBrown hover:bg-white/60 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-coral"
            >
              Add your first memory
            </Link>
          </div>

          <p className="fade mt-8 text-sm text-deepBrown/50">
            Free to start. Your memories stay yours.
          </p>
        </div>

        {/* Stack of prints: the one memorable element */}
        <div className="lg:col-span-6 flex justify-center">
          <div className="relative w-full max-w-md h-[420px] sm:h-[480px]">
            {prints.map((p, i) => (
              <div key={p.caption} className={`drift absolute ${p.pos}`}>
                <figure
                  onMouseEnter={lift(i)}
                  onMouseLeave={settle(i)}
                  className={`print-${i} relative bg-[#fffdf9] p-3 pb-6 rounded-[6px] shadow-[0_30px_55px_-22px_rgba(60,35,20,0.5),0_2px_6px_rgba(60,35,20,0.1)] ring-1 ring-deepBrown/5 cursor-default will-change-transform`}
                >
                  {/* Washi tape */}
                  <span
                    aria-hidden="true"
                    className={`absolute -top-3 left-1/2 -translate-x-1/2 ${tapes[i]} w-16 h-5 bg-[#f1dcb4]/85 shadow-[0_1px_3px_rgba(60,35,20,0.18)] z-10`}
                  />

                  <div
                    className={`relative aspect-[4/5] rounded-[3px] overflow-hidden bg-gradient-to-b ${p.photo}`}
                  >
                    {/* Photo (gradient above is the fallback if it fails to load) */}
                    <img
                      src={p.img}
                      alt={p.caption}
                      loading="lazy"
                      draggable="false"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                      className="absolute inset-0 w-full h-full object-cover saturate-[1.12] contrast-[1.05] sepia-[0.18]"
                    />

                    {/* Film warmth + light leak + inner vignette */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-coral/25 via-transparent to-[#ffd29a]/30 mix-blend-soft-light pointer-events-none" />
                    <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(40,20,10,0.28)] pointer-events-none" />

                    <span className="absolute bottom-2 right-2.5 text-[11px] tracking-widest text-[#ff9a3c] opacity-95 [text-shadow:0_1px_2px_rgba(0,0,0,0.45)]">
                      {p.stamp}
                    </span>
                  </div>
                  <figcaption
                    style={serif}
                    className="mt-3.5 px-0.5 italic text-[15px] text-deepBrown/80 leading-snug"
                  >
                    {p.caption}
                  </figcaption>
                </figure>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;