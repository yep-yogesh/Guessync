import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react"; // hamburger + close icons

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { label: "Home", path: "/landing" },
    { label: "New Room", path: "/create-room" },
    { label: "About Dev", path: "/about" },
    { label: "How to Play", path: "/how-to-play" },
  ];

  const isActive = (path) => location.pathname === path;

  // Resolve avatar from localStorage (user.avatar -> userAvatar -> default)
  const resolveAvatar = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const candidate = user?.avatar || localStorage.getItem("userAvatar");
      if (!candidate) return "/avatars/1.png";
      if (typeof candidate === "number") return `/avatars/${candidate}.png`;
      if (typeof candidate === "string") {
        if (/^https?:\/\//.test(candidate)) return candidate;           // absolute URL
        if (candidate.startsWith("/avatars/")) return candidate;        // ready path
        if (/^\d+$/.test(candidate)) return `/avatars/${candidate}.png`; // numeric string
        return candidate;                                               // fallback as-is
      }
      return "/avatars/1.png";
    } catch {
      return "/avatars/1.png";
    }
  };

  const [avatarSrc, setAvatarSrc] = useState(resolveAvatar());
  useEffect(() => {
    const update = () => setAvatarSrc(resolveAvatar());
    window.addEventListener("storage", update);     // cross-tab changes
    window.addEventListener("focus", update);       // when tab refocuses
    window.addEventListener("avatar-updated", update); // custom event support
    return () => {
      window.removeEventListener("storage", update);
      window.removeEventListener("focus", update);
      window.removeEventListener("avatar-updated", update);
    };
  }, []);

  // Only show logo on auth pages
  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";

  return (
    <nav className="w-full bg-black text-white font-montserrat shadow-md relative z-50">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <div
          className="flex items-center cursor-pointer"
          onClick={() => {
            setMenuOpen(false);
            navigate("/landing");
          }}
          role="button"
          aria-label="Go to Home"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setMenuOpen(false);
              navigate("/landing");
            }
          }}
        >
          <img src="/logo.png" alt="logo" className="w-10 h-10 mt-1.5" />
                    <Link to="/landing" className="flex items-center">
            <h1 className="ml-2 text-2xl font-silkscreen">
              GUES
              <span className="text-[#FFFB00] drop-shadow-[0_0_5px_#FFFB00]">
                SYNC
              </span>
            </h1>
          </Link>
        </div>

        {/* Desktop Menu */}
        {!isAuthPage && (
          <div className="hidden md:flex items-center gap-8 text-lg font-medium">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                aria-current={isActive(item.path) ? "page" : undefined}
                className={`relative z-10 after:absolute after:left-0 after:bottom-[-5px] after:h-[2px] after:bg-[#FFFB00] after:shadow-[0_0_10px_#FFFB00] after:transition-all after:duration-300
                  ${isActive(item.path) ? "text-[#FFFB00] after:w-full" : "after:w-0 hover:after:w-full"}`}
              >
                {item.label}
              </button>
            ))}

            <img
              src={avatarSrc}
              onClick={() => navigate("/profile")}
              alt="profile"
              onError={(e) => { e.currentTarget.src = "/avatars/1.png"; }}
              className="w-10 h-10 rounded-full border-[2px] border-[#FFFB00] shadow-[0_0_10px_#FFFB00] cursor-pointer relative z-10"
            />
          </div>
        )}

        {/* Mobile Hamburger */}
        {!isAuthPage && (
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-white hover:text-[#FFFB00] transition"
            >
              {menuOpen ? <X size={32} /> : <Menu size={32} />}
            </button>
          </div>
        )}
      </div>

      {/* Mobile Dropdown */}
      {!isAuthPage && (
        <div
          className={`md:hidden flex flex-col items-center bg-black text-lg font-medium gap-6 py-6 transform transition-all duration-500 ease-in-out relative z-40 ${
            menuOpen
              ? "max-h-[500px] opacity-100 scale-100"
              : "max-h-0 opacity-0 scale-95 overflow-hidden"
          }`}
        >
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                navigate(item.path);
                setMenuOpen(false);
              }}
              aria-current={isActive(item.path) ? "page" : undefined}
              className={`relative z-10 after:absolute after:left-0 after:bottom-[-5px] after:h-[2px] after:bg-[#FFFB00] after:shadow-[0_0_10px_#FFFB00] after:transition-all after:duration-300
                ${isActive(item.path) ? "text-[#FFFB00] after:w-full" : "after:w-0 hover:after:w-full"}`}
            >
              {item.label}
            </button>
          ))}
          <img
            src={avatarSrc}
            onClick={() => {
              navigate("/profile");
              setMenuOpen(false);
            }}
            alt="profile"
            onError={(e) => { e.currentTarget.src = "/avatars/1.png"; }}
            className="w-12 h-12 rounded-full border-[2px] border-[#FFFB00] shadow-[0_0_10px_#FFFB00] cursor-pointer relative z-10"
          />
        </div>
      )}
    </nav>
  );
}
