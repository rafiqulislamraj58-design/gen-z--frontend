import React, { useState } from "react";
import { useNavigate, Link } from "react-router";
import api from "../services/api";

/* Same display serif as Home & Register. Font link goes in index.html. */
const serif = { fontFamily: "'Fraunces', 'Playfair Display', Georgia, serif" };

const inputClass =
  "w-full px-4 py-3.5 rounded-xl bg-white/70 border border-deepBrown/15 text-deepBrown placeholder:text-deepBrown/35 text-[15px] transition-all duration-200 hover:border-deepBrown/30 focus:outline-none focus:bg-white focus:border-coral focus:ring-4 focus:ring-coral/15";

const Field = ({ label, id, children }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-semibold text-deepBrown mb-2">
      {label}
    </label>
    {children}
  </div>
);

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // UI only (show/hide toggle)

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/login", {
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      const resData = response.data?.data || response.data;
      const accessToken = resData?.accessToken || resData?.token;
      const userObj = resData?.user;

      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);

        if (userObj) {
          localStorage.setItem("user", JSON.stringify(userObj));
        }

        window.dispatchEvent(new Event("auth-changed"));

        navigate("/");
      } else {
        setError("Access token not found in server response.");
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError(
        err.response?.data?.message || "Failed to login. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-cream">
      {/* Brand panel (desktop only) */}
      <aside className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-deepBrown p-12 xl:p-16">
        <div className="absolute -bottom-24 -left-24 w-[28rem] h-[28rem] rounded-full bg-coral/25 blur-[130px] pointer-events-none" />

        <Link to="/" style={serif} className="relative text-xl font-semibold text-cream tracking-tight">
          Zen<span className="text-coral">Z</span> Nostalgia
        </Link>

        <div className="relative flex flex-col items-center">
          <figure className="w-60 bg-[#fffdf9] p-3 pb-5 rounded-[6px] rotate-[4deg] shadow-[0_35px_60px_-20px_rgba(0,0,0,0.6)]">
            <div className="relative aspect-[4/5] rounded-[3px] overflow-hidden bg-gradient-to-b from-[#cfe0e4] via-[#e9c9a6] to-[#5a3a2e]">
              <div className="absolute left-1/2 -translate-x-1/2 top-[18%] w-12 h-12 rounded-full bg-[#fff6e6] shadow-[0_0_50px_16px_rgba(255,240,210,0.6)]" />
              <span className="absolute bottom-2 right-2.5 text-[11px] tracking-widest text-[#ff9a3c]">
                ’23  12  02
              </span>
            </div>
            <figcaption style={serif} className="mt-3 italic text-[15px] text-deepBrown/80">
              Sylhet, early morning mist
            </figcaption>
          </figure>
        </div>

        <div className="relative max-w-sm">
          <p style={serif} className="text-3xl xl:text-4xl text-cream leading-[1.15] tracking-[-0.01em]">
            Your memories are right where you left them.
          </p>
          <p className="mt-4 text-cream/60 leading-relaxed">
            Log in to share new moments and revisit the old ones.
          </p>
        </div>
      </aside>

      {/* Form panel */}
      <main className="flex items-center justify-center px-5 sm:px-8 py-12">
        <div className="w-full max-w-md">
          <Link
            to="/"
            style={serif}
            className="lg:hidden block text-center text-xl font-semibold text-deepBrown tracking-tight mb-10"
          >
            Zen<span className="text-coral">Z</span> Nostalgia
          </Link>

          <h1 style={serif} className="text-4xl font-medium text-deepBrown tracking-[-0.02em]">
            Welcome back
          </h1>
          <p className="mt-2 text-deepBrown/60">Log in to share and explore your memories.</p>

          {error && (
            <div
              role="alert"
              className="mt-6 flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm"
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

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <Field label="Email" id="email">
              <input
                id="email"
                type="email"
                name="email"
                required
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={inputClass}
              />
            </Field>

            <Field label="Password" id="password">
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Your password"
                  className={`${inputClass} pr-16`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 px-4 text-sm font-semibold text-deepBrown/50 hover:text-coral transition-colors focus:outline-none focus-visible:text-coral"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </Field>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2.5 py-4 rounded-full bg-deepBrown text-cream font-semibold shadow-[0_18px_40px_-16px_rgba(60,35,20,0.55)] hover:bg-coral hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:hover:bg-deepBrown disabled:hover:translate-y-0 disabled:cursor-not-allowed transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
            >
              {loading && (
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                  <path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
              )}
              {loading ? "Logging in" : "Log in"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-deepBrown/60">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-deepBrown underline decoration-coral decoration-2 underline-offset-4 hover:text-coral transition-colors"
            >
              Create one
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Login;