import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import api from "../services/api";

/* Same display serif as Home. Font link goes in index.html (see Home.jsx). */
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

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/register", formData);
     
      const token = 
        response.data.token || 
        response.data.accessToken || 
        response.data.data?.token || 
        response.data.data?.accessToken;

      if (token) {
        localStorage.setItem("accessToken", token);
        
        window.dispatchEvent(new Event("auth-changed"));
        navigate("/");
      } else {
        setError("Registration successful, but token was not provided by backend.");
      }
    } catch (err) {
      console.error("Register Error:", err);
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-cream">
      {/* Brand panel (desktop only) */}
      <aside className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-deepBrown p-12 xl:p-16">
        <div className="absolute -top-24 -right-24 w-[28rem] h-[28rem] rounded-full bg-coral/25 blur-[130px] pointer-events-none" />

        <Link to="/" style={serif} className="relative text-xl font-semibold text-cream tracking-tight">
          Zen<span className="text-coral">Z</span> Nostalgia
        </Link>

        <div className="relative flex flex-col items-center">
          <figure className="w-60 bg-[#fffdf9] p-3 pb-5 rounded-[6px] -rotate-[5deg] shadow-[0_35px_60px_-20px_rgba(0,0,0,0.6)]">
            <div className="relative aspect-[4/5] rounded-[3px] overflow-hidden bg-gradient-to-b from-[#f8d3ad] via-coral/50 to-[#6b3f33]">
              <div className="absolute left-1/2 -translate-x-1/2 bottom-[28%] w-14 h-14 rounded-full bg-[#fff2dc] shadow-[0_0_60px_20px_rgba(255,226,180,0.55)]" />
              <span className="absolute bottom-2 right-2.5 text-[11px] tracking-widest text-[#ff9a3c]">
                ’24  08  14
              </span>
            </div>
            <figcaption style={serif} className="mt-3 italic text-[15px] text-deepBrown/80">
              Cox's Bazar, golden hour
            </figcaption>
          </figure>
        </div>

        <div className="relative max-w-sm">
          <p style={serif} className="text-3xl xl:text-4xl text-cream leading-[1.15] tracking-[-0.01em]">
            Your first memory is a minute away.
          </p>
          <p className="mt-4 text-cream/60 leading-relaxed">
            Create an account to save the moments you want to keep.
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
            Create your account
          </h1>
          <p className="mt-2 text-deepBrown/60">It takes less than a minute.</p>

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
            <Field label="Full name" id="name">
              <input
                id="name"
                type="text"
                name="name"
                required
                autoComplete="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                className={inputClass}
              />
            </Field>

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
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
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
              {loading ? "Creating account" : "Create account"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-deepBrown/60">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-deepBrown underline decoration-coral decoration-2 underline-offset-4 hover:text-coral transition-colors"
            >
              Log in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Register;