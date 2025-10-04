import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react"; // hamburger + close icons
import avatar from "/avatars/1.png";

export default function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);
  const hamburgerRef = useRef(null);

  const navItems = [
    { label: "Home", path: "/landing" },
    { label: "New Room", path: "/create-room" },
    { label: "About Dev", path: "/about" },
    { label: "How to Play", path: "/how-to-play" },
  ];

  // Handle escape key and focus management
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && menuOpen) {
        setMenuOpen(false);
        hamburgerRef.current?.focus();
      }
    };

    const handleClickOutside = (e) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("keydown", handleEscape);
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  const handleKeyDown = (e, callback) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      callback();
    }
  };

  return (
    <nav 
      className="w-full bg-black text-white font-montserrat shadow-md relative z-50"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <div className="flex items-center">
          <img 
            src="/logo.png" 
            alt="Guessync logo" 
            className="w-10 h-10 mt-1.5"
          />
          <h1 className="ml-2 text-2xl font-silkscreen">
            GUES
            <span className="text-[#FFFB00] drop-shadow-[0_0_5px_#FFFB00]">
              SYNC
            </span>
          </h1>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-lg font-medium" role="menubar">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              onKeyDown={(e) => handleKeyDown(e, () => navigate(item.path))}
              className="relative z-10 after:absolute after:left-0 after:bottom-[-5px] after:w-0 after:h-[2px] after:bg-[#FFFB00] after:shadow-[0_0_10px_#FFFB00] hover:after:w-full after:transition-all after:duration-300 focus:outline-none focus:ring-2 focus:ring-[#FFFB00] focus:ring-offset-2 focus:ring-offset-black rounded-sm"
              role="menuitem"
              aria-label={`Navigate to ${item.label}`}
            >
              {item.label}
            </button>
          ))}

          <button
            onClick={() => navigate("/login")}
            onKeyDown={(e) => handleKeyDown(e, () => navigate("/login"))}
            className="bg-[#FFFB00] text-black w-32 px-4 py-2 rounded-[6px] shadow-[0_0_10px_#FFFB00] hover:scale-105 transition font-silkscreen relative z-10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#FFFB00]"
            aria-label="Go to login page"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/profile")}
            onKeyDown={(e) => handleKeyDown(e, () => navigate("/profile"))}
            className="w-10 h-10 rounded-full border-[2px] border-[#FFFB00] shadow-[0_0_10px_#FFFB00] cursor-pointer relative z-10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black overflow-hidden"
            aria-label="Go to profile page"
          >
            <img
              src={avatar}
              alt="User profile avatar"
              className="w-full h-full object-cover"
            />
          </button>
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <button
            ref={hamburgerRef}
            onClick={handleMenuToggle}
            onKeyDown={(e) => handleKeyDown(e, handleMenuToggle)}
            className="text-white hover:text-[#FFFB00] transition focus:outline-none focus:ring-2 focus:ring-[#FFFB00] focus:ring-offset-2 focus:ring-offset-black rounded-sm p-1"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          >
            {menuOpen ? <X size={32} aria-hidden="true" /> : <Menu size={32} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      <div
        ref={mobileMenuRef}
        id="mobile-menu"
        className={`md:hidden flex flex-col items-center bg-black text-lg font-medium gap-6 py-6 transform transition-all duration-500 ease-in-out relative z-40 ${
          menuOpen
            ? "max-h-[500px] opacity-100 scale-100"
            : "max-h-0 opacity-0 scale-95 overflow-hidden"
        }`}
        role="menu"
        aria-label="Mobile navigation menu"
        aria-hidden={!menuOpen}
      >
        {navItems.map((item, index) => (
          <button
            key={item.label}
            onClick={() => handleNavigation(item.path)}
            onKeyDown={(e) => handleKeyDown(e, () => handleNavigation(item.path))}
            className="relative z-10 after:absolute after:left-0 after:bottom-[-5px] after:w-0 after:h-[2px] after:bg-[#FFFB00] after:shadow-[0_0_10px_#FFFB00] hover:after:w-full after:transition-all after:duration-300 focus:outline-none focus:ring-2 focus:ring-[#FFFB00] focus:ring-offset-2 focus:ring-offset-black rounded-sm"
            role="menuitem"
            aria-label={`Navigate to ${item.label}`}
            tabIndex={menuOpen ? 0 : -1}
          >
            {item.label}
          </button>
        ))}

        <button
          onClick={() => handleNavigation("/login")}
          onKeyDown={(e) => handleKeyDown(e, () => handleNavigation("/login"))}
          className="bg-[#FFFB00] text-black w-32 px-4 py-2 rounded-[6px] shadow-[0_0_10px_#FFFB00] hover:scale-105 transition font-silkscreen relative z-10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#FFFB00]"
          role="menuitem"
          aria-label="Go to login page"
          tabIndex={menuOpen ? 0 : -1}
        >
          Login
        </button>

        <button
          onClick={() => handleNavigation("/profile")}
          onKeyDown={(e) => handleKeyDown(e, () => handleNavigation("/profile"))}
          className="w-12 h-12 rounded-full border-[2px] border-[#FFFB00] shadow-[0_0_10px_#FFFB00] cursor-pointer relative z-10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black overflow-hidden"
          role="menuitem"
          aria-label="Go to profile page"
          tabIndex={menuOpen ? 0 : -1}
        >
          <img
            src={avatar}
            alt="User profile avatar"
            className="w-full h-full object-cover"
          />
        </button>
      </div>
    </nav>
  );
}
