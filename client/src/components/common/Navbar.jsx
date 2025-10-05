// client/src/components/common/Navbar.jsx

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import defaultAvatar from "/avatars/1.png";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Your hook to get the real-time user status
  const { currentUser, logout } = useAuth();

  const navItems = [
    { label: "Home", path: "/landing" },
    { label: "New Room", path: "/create-room" },
    { label: "About Dev", path: "/about" },
    { label: "How to Play", path: "/how-to-play" },
  ];

  // Your function to handle logging out
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  // The maintainer's function to style the active link
  const isActive = (path) => location.pathname === path;

  // The maintainer's logic to hide the navbar on auth pages
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
          <h1 className="ml-2 text-2xl font-silkscreen">
            GUES
            <span className="text-[#FFFB00] drop-shadow-[0_0_5px_#FFFB00]">
              SYNC
            </span>
          </h1>
        </div>

        {/* Desktop Menu - Wrapped in maintainer's logic */}
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

            {/* Your conditional logic for Login/Logout */}
            {currentUser ? (
              <>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white w-32 px-4 py-2 rounded-[6px] shadow-[0_0_10px_#FF0000] hover:scale-105 transition font-silkscreen relative z-10"
                >
                  Logout
                </button>
                <img
                  src={currentUser.photoURL || defaultAvatar}
                  onClick={() => navigate("/profile")}
                  alt="profile"
                  className="w-10 h-10 rounded-full border-[2px] border-[#FFFB00] shadow-[0_0_10px_#FFFB00] cursor-pointer relative z-10"
                />
              </>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="bg-[#FFFB00] text-black w-32 px-4 py-2 rounded-[6px] shadow-[0_0_10px_#FFFB00] hover:scale-105 transition font-silkscreen relative z-10"
              >
                Login
              </button>
            )}
          </div>
        )}

        {/* Mobile Hamburger - Wrapped in maintainer's logic */}
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

      {/* Mobile Dropdown - Wrapped in maintainer's logic */}
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
          
          {/* Your conditional logic for Login/Logout for mobile */}
          {currentUser ? (
            <>
              <button
                onClick={() => { handleLogout(); setMenuOpen(false); }}
                className="bg-red-500 text-white w-32 px-4 py-2 rounded-[6px] shadow-[0_0_10px_#FF0000] hover:scale-105 transition font-silkscreen relative z-10"
              >
                Logout
              </button>
              <img
                src={currentUser.photoURL || defaultAvatar}
                onClick={() => { navigate("/profile"); setMenuOpen(false); }}
                alt="profile"
                className="w-12 h-12 rounded-full border-[2px] border-[#FFFB00] shadow-[0_0_10px_#FFFB00] cursor-pointer relative z-10"
              />
            </>
          ) : (
            <button
              onClick={() => { navigate("/login"); setMenuOpen(false); }}
              className="bg-[#FFFB00] text-black w-32 px-4 py-2 rounded-[6px] shadow-[0_0_10px_#FFFB00] hover:scale-105 transition font-silkscreen relative z-10"
            >
              Login
            </button>
          )}
        </div>
      )}
    </nav>
  );
}