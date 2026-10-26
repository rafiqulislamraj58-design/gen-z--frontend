import React from "react";
import { Link } from "react-router";

/* Navbar-এর মতো একই display serif (শুধু ব্র্যান্ড নামে) */
const serif = { fontFamily: "'Fraunces', 'Playfair Display', Georgia, serif" };

const linkClass =
  "group relative inline-block py-0.5 text-deepBrown/65 hover:text-deepBrown transition-colors duration-300 focus:outline-none focus-visible:text-coral";

const Underline = () => (
  <span
    aria-hidden="true"
    className="absolute left-0 -bottom-0.5 h-[2px] w-full origin-left scale-x-0 rounded-full bg-coral transition-transform duration-300 group-hover:scale-x-100"
  />
);

const Footer = () => {
  return (
    <footer className="relative bg-cream/90 backdrop-blur-xl border-t border-sand/70 pt-16 pb-10">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-14">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-5">
            <Link
              to="/"
              style={serif}
              className="inline-block text-2xl sm:text-[26px] font-semibold tracking-tight text-deepBrown hover:text-coral transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-coral rounded"
            >
              Zen<span className="text-coral">Z</span> Nostalgia
            </Link>

            <p className="text-deepBrown/65 text-[15px] max-w-sm leading-relaxed">
              আপনার প্রিয় স্মৃতিগুলো ধরে রাখা, সবার সাথে ভাগ করে নেওয়া আর আবার নতুন করে অনুভব করার একটি জায়গা, যেখানে আধুনিক সৌন্দর্যের সাথে মিশে আছে পুরনো দিনের ছোঁয়া।
            </p>

            {/* Rubber-stamp ট্যাগ */}
            <span className="inline-block -rotate-2 px-3 py-1 border-[1.5px] border-coral/70 text-coral rounded-[4px] text-xs font-bold tracking-wide">
              স্মৃতি কখনো হারায় না
            </span>
          </div>

          {/* Quick Links */}
          <div className="space-y-5">
            <h4 className="text-sm font-bold tracking-wide text-deepBrown">
              নেভিগেশন
            </h4>
            <ul className="space-y-3 text-[15px]">
              <li>
                <Link to="/" className={linkClass}>
                  হোম
                  <Underline />
                </Link>
              </li>
              <li>
                <Link to="/feed" className={linkClass}>
                  স্মৃতির ফিড
                  <Underline />
                </Link>
              </li>
              <li>
                <Link to="/create" className={linkClass}>
                  স্মৃতি শেয়ার করুন
                  <Underline />
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Legal */}
          <div className="space-y-5">
            <h4 className="text-sm font-bold tracking-wide text-deepBrown">
              সহায়তা ও আইনি
            </h4>
            <ul className="space-y-3 text-[15px]">
              <li>
                <span className={`${linkClass} cursor-pointer`}>
                  সহায়তা কেন্দ্র
                  <Underline />
                </span>
              </li>
              <li>
                <span className={`${linkClass} cursor-pointer`}>
                  গোপনীয়তা নীতি
                  <Underline />
                </span>
              </li>
              <li>
                <span className={`${linkClass} cursor-pointer`}>
                  সেবার শর্তাবলি
                  <Underline />
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Divider & Copyright */}
        <div className="pt-8 border-t border-dashed border-deepBrown/20 flex flex-col sm:flex-row items-center justify-between gap-5 text-sm text-deepBrown/60">
          <p className="text-center sm:text-left leading-relaxed">
            © {new Date().getFullYear()} Zen Z Nostalgia। ❤️ দিয়ে তৈরি করেছেন{" "}
            <a
              href="https://www.linkedin.com/in/rafiqul-islam-raj-9212403b0"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-deepBrown underline decoration-coral decoration-2 underline-offset-4 hover:text-coral transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-coral rounded"
            >
              Khandakar Rafiqul Islam Raj
            </a>
          </p>

          <div className="flex items-center gap-3">
            {["টুইটার", "গিটহাব", "ইনস্টাগ্রাম"].map((name) => (
              <span
                key={name}
                className="cursor-pointer px-4 py-1.5 rounded-full border border-deepBrown/15 text-[13px] font-semibold text-deepBrown/70 hover:bg-deepBrown hover:border-deepBrown hover:text-cream transition-[background-color,border-color,color] duration-300"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;