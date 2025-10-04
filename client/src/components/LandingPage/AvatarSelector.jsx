import { useEffect, useState } from "react";

const avatars = Array.from({ length: 12 }, (_, i) => `/avatars/${i + 1}.png`);

export default function AvatarSelector({ selectedAvatar = null, disabled = false }) {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(false);
  const [selected, setSelected] = useState(false);

  // Consider user "authenticated" if either authToken or userAvatar exists in localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return !!(localStorage.getItem("authToken") || localStorage.getItem("userAvatar"));
    } catch {
      return false;
    }
  });

  // Initialize selected/index based on incoming prop or localStorage
  useEffect(() => {
    // If prop provided, prefer it
    if (selectedAvatar) {
      const idx = avatars.indexOf(selectedAvatar);
      if (idx !== -1) {
        setIndex(idx);
        setSelected(true);
        setIsAuthenticated(true);
        return;
      }
    }

    // If saved in localStorage, use that
    try {
      const saved = localStorage.getItem("userAvatar");
      if (saved) {
        const idx = avatars.indexOf(saved);
        if (idx !== -1) {
          setIndex(idx);
          setSelected(true);
          setIsAuthenticated(true);
        }
      }
    } catch {
      // ignore localStorage errors (e.g. SSR)
    }
  }, [selectedAvatar]);

  // Keep component in sync across tabs (storage event)
  useEffect(() => {
    const handler = (e) => {
      if (!e?.key) return;
      if (e.key === "userAvatar") {
        if (e.newValue) {
          const idx = avatars.indexOf(e.newValue);
          if (idx !== -1) {
            setIndex(idx);
            setSelected(true);
            setIsAuthenticated(true);
          }
        } else {
          // userAvatar removed => logged out
          setSelected(false);
          setIsAuthenticated(false);
        }
      } else if (e.key === "authToken") {
        setIsAuthenticated(!!(localStorage.getItem("authToken") || localStorage.getItem("userAvatar")));
      }
    };

    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const cycle = (dir) => {
    // lock cycling if avatar already selected or external disabled
    if (selected || disabled) return;
    setFade(true);
    setTimeout(() => {
      setIndex((prev) => (prev + dir + avatars.length) % avatars.length);
      setFade(false);
    }, 150);
  };

  const handleAuthToggle = () => {
    // If authenticated, treat this as logout
    if (isAuthenticated) {
      try {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userAvatar");
      } catch {
        // ignore errors
      }
      setSelected(false);
      setIsAuthenticated(false);
      return;
    }

    // Not authenticated: treat as selecting / "logging in" with avatar
    try {
      localStorage.setItem("userAvatar", avatars[index]);
      // Optionally, you might want to set an auth token:
      // localStorage.setItem("authToken", "your-jwt-or-flag");
    } catch {
      // ignore localStorage errors
    }
    setSelected(true);
    setIsAuthenticated(true);
  };

  // If either selected or externally disabled, lock the arrows
  const isLocked = selected || disabled;

  // Button label logic: show LOGOUT when authenticated
  const buttonText = isAuthenticated ? "LOGOUT" : isLocked ? "SELECTED!" : "SELECT";

  return (
    <div className="flex flex-col items-center px-4 sm:px-6 md:px-8">
      {/* Title */}
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-black font-montserrat mb-5 mt-2 text-center">
        Choose An Avatar
      </h2>

      {/* Avatar + Arrows */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Left button */}
        <button
          disabled={isLocked}
          onClick={() => cycle(-1)}
          className={`w-10 h-10 sm:w-[42px] sm:h-[42px] md:w-[48px] md:h-[48px] 
            text-black text-xl sm:text-2xl font-silkscreen rounded-[6px] transition 
            ${
              isLocked
                ? "bg-gray-500 opacity-50 cursor-not-allowed"
                : "bg-[#FFFB00] shadow-[0_0_18px_#FFFB00] hover:scale-110"
            }`}
          aria-label="Previous avatar"
        >
          &lt;
        </button>

        {/* Avatar preview */}
        <div
          className={`p-2 sm:p-3 rounded-[6px] border-[2px] border-[#FFFB00] transition-all duration-300 ${
            isLocked ? "shadow-[0_0_22px_#FFFB00]" : "shadow-[0_0_14px_#FFFB00]"
          }`}
        >
          <img
            src={avatars[index]}
            alt="avatar"
            className={`w-[80px] h-[80px] sm:w-[90px] sm:h-[90px] md:w-[100px] md:h-[100px] 
              rounded-[6px] transition-opacity duration-300 ${fade ? "opacity-0" : "opacity-100"}`}
          />
        </div>

        {/* Right button */}
        <button
          disabled={isLocked}
          onClick={() => cycle(1)}
          className={`w-10 h-10 sm:w-[42px] sm:h-[42px] md:w-[48px] md:h-[48px] 
            text-black text-xl sm:text-2xl font-silkscreen rounded-[6px] transition 
            ${
              isLocked
                ? "bg-gray-500 opacity-50 cursor-not-allowed"
                : "bg-[#FFFB00] shadow-[0_0_18px_#FFFB00] hover:scale-110"
            }`}
          aria-label="Next avatar"
        >
          &gt;
        </button>
      </div>

      {/* Select / Logout button */}
      <button
        onClick={handleAuthToggle}
        className={`mt-5 font-silkscreen text-black 
          text-base sm:text-lg md:text-xl 
          py-2 sm:py-2.5 px-6 sm:px-8 rounded-[6px] transition-all duration-300 
          ${
            isAuthenticated
              ? "bg-white shadow-[0_0_14px_white] hover:bg-gray-100"
              : isLocked
              ? "bg-white shadow-[0_0_14px_white] cursor-not-allowed"
              : "bg-[#FFFB00] shadow-[0_0_18px_#FFFB00] hover:scale-105"
          }`}
      >
        {buttonText}
      </button>
    </div>
  );
}
