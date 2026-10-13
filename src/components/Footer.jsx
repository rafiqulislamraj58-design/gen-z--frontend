import React from "react";
import { Link } from "react-router";

const Footer = () => {
  return (
    <footer className="bg-white/80 backdrop-blur-md border-t border-gray-200/60 pt-16 pb-12 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="inline-block">
              <span className="text-2xl font-black tracking-wider text-nostalgiaText">
                Zen<span className="text-nostalgiaAccent">Z</span> Nostalgia
              </span>
            </Link>
            <p className="text-nostalgiaMuted text-sm max-w-sm leading-relaxed">
              A premium space to capture, share, and relive your core memories with a touch of modern aesthetics and vintage vibes.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-nostalgiaText">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm text-nostalgiaMuted">
              <li>
                <Link to="/" className="hover:text-nostalgiaAccent transition">Home</Link>
              </li>
              <li>
                <Link to="/feed" className="hover:text-nostalgiaAccent transition">Memories Feed</Link>
              </li>
              <li>
                <Link to="/create" className="hover:text-nostalgiaAccent transition">Share Memory</Link>
              </li>
            </ul>
          </div>

          {/* Support & Legal */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-nostalgiaText">
              Support & Legal
            </h4>
            <ul className="space-y-2.5 text-sm text-nostalgiaMuted">
              <li>
                <span className="hover:text-nostalgiaAccent cursor-pointer transition">Help Center</span>
              </li>
              <li>
                <span className="hover:text-nostalgiaAccent cursor-pointer transition">Privacy Policy</span>
              </li>
              <li>
                <span className="hover:text-nostalgiaAccent cursor-pointer transition">Terms of Service</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Divider & Copyright */}
        <div className="pt-8 border-t border-gray-200/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-nostalgiaMuted">
          <p>
            © {new Date().getFullYear()} Zen Z Nostalgia. Crafted with ❤️ by{" "}
            <a
              href="https://www.linkedin.com/in/rafiqul-islam-raj-9212403b0"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-nostalgiaText hover:text-nostalgiaAccent underline transition"
            >
              Khandakar Rafiqul Islam Raj
            </a>
          </p>
          <div className="flex items-center gap-6">
            <span className="hover:text-nostalgiaAccent cursor-pointer transition">Twitter</span>
            <span className="hover:text-nostalgiaAccent cursor-pointer transition">GitHub</span>
            <span className="hover:text-nostalgiaAccent cursor-pointer transition">Instagram</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;