import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import gsap from "gsap";

/* Same display serif as the other pages. Font link goes in index.html (see Home.jsx). */
const serif = { fontFamily: "'Fraunces', 'Playfair Display', Georgia, serif" };

const links = [
  { to: "/", label: "Home" },
  { to: "/feed", label: "Feed" },
  { to: "/36-july", label: "36 July" },    
  { to: "/create", label: "Share a memory" },
];

const Navbar = () => {
  const navRef = useRef(null);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const [userToken, setUserToken] = useState(() => localStorage.getItem("accessToken") || localStorage.getItem("token"));
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
      setUserToken(token);

      // ইউজার অবজেক্ট থেকে রোল চেক করা (ব্যাকএন্ড থেকে লগইনের সময় localStorage-এ user সেভ করা থাকে)
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        setIsAdmin(storedUser?.role === "admin");
      } catch {
        setIsAdmin(false);
      }
    };

    checkAuth();

    window.addEventListener("storage", checkAuth);
    window.addEventListener("auth-changed", checkAuth);
    window.addEventListener("focus", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("auth-changed", checkAuth);
      window.removeEventListener("focus", checkAuth);
    };
  }, []);

  // Entrance: items settle in once.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.from(".nav-item", {
        y: -16,
        opacity: 0,
        duration: 0.9,
        stagger: 0.08,
        ease: "power3.out",
      });
    }, navRef);

    return () => ctx.revert();
  }, []);

  // Border and shadow appear only after the page scrolls.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu with Escape.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === "Escape" && setIsOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  const close = () => setIsOpen(false);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUserToken(null);
    setIsAdmin(false);
    window.dispatchEvent(new Event("auth-changed"));
    close();
    navigate("/login");
  };

  return (
    <nav
      ref={navRef}
      className={`sticky top-0 z-50 backdrop-blur-xl transition-all duration-300 border-b ${
        scrolled || isOpen
          ? "bg-cream/90 border-sand/70 shadow-[0_10px_30px_-18px_rgba(60,35,20,0.35)]"
          : "bg-cream/60 border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-[72px]">
          {/* Logo */}
          <Link
            to="/"
            onClick={close}
            style={serif}
            className="nav-item text-xl sm:text-[22px] font-semibold tracking-tight text-deepBrown hover:text-coral transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-coral rounded"
          >
            Zen<span className="text-coral">Z</span> Nostalgia
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-9">
            {links.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  `nav-item group relative py-2 text-[15px] font-semibold transition-colors duration-300 focus:outline-none focus-visible:text-coral ${
                    isActive ? "text-deepBrown" : "text-deepBrown/55 hover:text-deepBrown"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {label}
                    <span
                      className={`absolute left-0 -bottom-0.5 h-[2px] w-full origin-left rounded-full bg-coral transition-transform duration-300 ${
                        isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-50"
                      }`}
                    />
                  </>
                )}
              </NavLink>
            ))}

            {/* 🔥 My Memories Link (Visible only when logged in) */}
            {userToken && (
              <NavLink
                to="/my-memories"
                className={({ isActive }) =>
                  `nav-item group relative py-2 text-[15px] font-semibold transition-colors duration-300 focus:outline-none focus-visible:text-coral ${
                    isActive ? "text-deepBrown" : "text-deepBrown/55 hover:text-deepBrown"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    My Memories
                    <span
                      className={`absolute left-0 -bottom-0.5 h-[2px] w-full origin-left rounded-full bg-coral transition-transform duration-300 ${
                        isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-50"
                      }`}
                    />
                  </>
                )}
              </NavLink>
            )}

            {/* 🔥 Admin Dashboard Link (Visible ONLY when admin is logged in) */}
            {userToken && isAdmin && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `nav-item group relative py-2 text-[15px] font-bold text-coral transition-colors duration-300 focus:outline-none`
                }
              >
                {({ isActive }) => (
                  <>
                    Admin Panel
                    <span
                      className={`absolute left-0 -bottom-0.5 h-[2px] w-full origin-left rounded-full bg-coral transition-transform duration-300 ${
                        isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-50"
                      }`}
                    />
                  </>
                )}
              </NavLink>
            )}
          </div>

          {/* Desktop auth / Session State */}
          <div className="hidden md:flex items-center gap-3">
            {userToken ? (
              <div className="nav-item flex items-center gap-5">
                <span className="flex items-center gap-2 text-sm font-semibold text-deepBrown/65">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 ring-4 ring-emerald-500/15" aria-hidden="true" />
                  Signed in
                </span>
                <button
                  onClick={handleLogout}
                  className="px-6 py-2.5 text-[15px] font-semibold text-deepBrown border border-deepBrown/20 rounded-full hover:bg-deepBrown hover:border-deepBrown hover:text-cream transition-[background-color,border-color,color] duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
                >
                  Log out
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="nav-item px-4 py-2 text-[15px] font-semibold text-deepBrown/70 hover:text-deepBrown transition-colors duration-300 focus:outline-none focus-visible:text-coral"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="nav-item px-6 py-2.5 text-[15px] font-semibold text-cream bg-deepBrown rounded-full shadow-[0_14px_30px_-14px_rgba(60,35,20,0.6)] hover:bg-coral hover:shadow-[0_18px_34px_-14px_rgba(255,107,107,0.7)] transition-[background-color,box-shadow] duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
                >
                  Get started
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setIsOpen((o) => !o)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            className="nav-item md:hidden p-2 -mr-2 rounded-full text-deepBrown hover:bg-sand/60 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-coral"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 8h16M4 16h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`md:hidden grid transition-[grid-template-rows] duration-300 ease-out ${
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className={`px-5 sm:px-8 pt-2 pb-7 ${isOpen ? "" : "invisible"}`}>
            <div className="flex flex-col">
              {links.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === "/"}
                  onClick={close}
                  style={serif}
                  className={({ isActive }) =>
                    `flex items-center justify-between py-4 text-2xl font-medium tracking-tight border-b border-sand/60 transition-colors ${
                      isActive ? "text-coral" : "text-deepBrown hover:text-coral"
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}

              {userToken && (
                <NavLink
                  to="/my-memories"
                  onClick={close}
                  style={serif}
                  className={({ isActive }) =>
                    `flex items-center justify-between py-4 text-2xl font-medium tracking-tight border-b border-sand/60 transition-colors ${
                      isActive ? "text-coral" : "text-deepBrown hover:text-coral"
                    }`
                  }
                >
                  My Memories
                </NavLink>
              )}

              {userToken && isAdmin && (
                <NavLink
                  to="/admin"
                  onClick={close}
                  style={serif}
                  className="flex items-center justify-between py-4 text-2xl font-medium tracking-tight border-b border-sand/60 text-coral"
                >
                  Admin Panel
                </NavLink>
              )}
            </div>

            <div className="mt-6 flex flex-col gap-3">
              {userToken ? (
                <>
                  <span className="flex items-center justify-center gap-2 text-sm font-semibold text-deepBrown/60">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 ring-4 ring-emerald-500/15" aria-hidden="true" />
                    Signed in
                  </span>
                  <button
                    onClick={handleLogout}
                    className="w-full text-center py-3.5 font-semibold text-deepBrown border border-deepBrown/20 hover:bg-deepBrown hover:border-deepBrown hover:text-cream rounded-full transition-colors"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/register"
                    onClick={close}
                    className="w-full text-center py-3.5 font-semibold text-cream bg-deepBrown hover:bg-coral rounded-full transition-colors"
                  >
                    Get started
                  </Link>
                  <Link
                    to="/login"
                    onClick={close}
                    className="w-full text-center py-3.5 font-semibold text-deepBrown border border-deepBrown/20 hover:border-deepBrown rounded-full transition-colors"
                  >
                    Log in
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;