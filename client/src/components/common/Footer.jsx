import { useNavigate } from "react-router-dom";
import { FaGithub, FaLinkedin, FaInstagram, FaTwitter } from "react-icons/fa";

export default function Footer() {
  const navigate = useNavigate();

  const quickLinks = [
    { label: "Home", path: "/landing" },
    { label: "Create Room", path: "/create-room" },
    { label: "Join Room", path: "/join-room" },
    { label: "How to Play", path: "/how-to-play" },
    { label: "About Dev", path: "/about" },
  ];

  return (
    <footer className="w-full bg-black border-t-2 border-[#FFFB00] text-white py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo & Description */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-2 mb-3">
              <img src="/logo.png" alt="GuessSync Logo" className="w-10 h-10" />
              <h2 className="text-2xl font-silkscreen">
                GUES<span className="text-[#FFFB00] drop-shadow-[0_0_5px_#FFFB00]">SYNC</span>
              </h2>
            </div>
            <p className="text-sm text-gray-400 text-center md:text-left font-montserrat">
              Fast-paced multiplayer music guessing game. Play with friends and race to the top!
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-silkscreen text-[#FFFB00] mb-3">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <button
                    onClick={() => navigate(link.path)}
                    className="text-sm text-gray-400 hover:text-[#FFFB00] transition-colors font-montserrat"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links & Copyright */}
          <div className="flex flex-col items-center md:items-end">
            <h3 className="text-lg font-silkscreen text-[#FFFB00] mb-3">Connect</h3>
            <div className="flex gap-4 mb-4">
              <a
                href="https://github.com/yogeshwaran9125"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#FFFB00] transition-colors"
                aria-label="GitHub"
              >
                <FaGithub size={24} />
              </a>
              <a
                href="https://www.linkedin.com/in/yogeshwaran-m-3b19452a9/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#FFFB00] transition-colors"
                aria-label="LinkedIn"
              >
                <FaLinkedin size={24} />
              </a>
              <a
                href="https://www.instagram.com/wtfisyogesh"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#FFFB00] transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram size={24} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#FFFB00] transition-colors"
                aria-label="Twitter"
              >
                <FaTwitter size={24} />
              </a>
            </div>
            <p className="text-xs text-gray-500 text-center md:text-right font-montserrat">
              © {new Date().getFullYear()} GuessSync. All rights reserved.
            </p>
            <p className="text-xs text-gray-500 text-center md:text-right font-montserrat mt-1">
              Made with ❤️ for Hacktoberfest
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
