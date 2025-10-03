import { useEffect, useState } from "react";

const avatars = Array.from({ length: 12 }, (_, i) => `/avatars/${i + 1}.png`);

export default function AvatarSelector({ selectedAvatar = null, disabled = false }) {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(false);
  const [selected, setSelected] = useState(false);

  useEffect(() => {
    if (selectedAvatar) {
      const idx = avatars.indexOf(selectedAvatar);
      if (idx !== -1) {
        setIndex(idx);
        setSelected(true);
      }
    }
  }, [selectedAvatar]);

  const cycle = (dir) => {
    if (selected || disabled) return;
    setFade(true);
    setTimeout(() => {
      setIndex((prev) => (prev + dir + avatars.length) % avatars.length);
      setFade(false);
    }, 150);
  };

  const handleSelect = () => {
    localStorage.setItem("userAvatar", avatars[index]);
    setSelected(true);
  };

  const isLocked = selected || disabled;

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
              rounded-[6px] transition-opacity duration-300 ${
              fade ? "opacity-0" : "opacity-100"
            }`}
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
        >
          &gt;
        </button>
      </div>

      {/* Select button */}
      <button
        disabled={isLocked}
        onClick={handleSelect}
        className={`mt-5 font-silkscreen text-black 
          text-base sm:text-lg md:text-xl 
          py-2 sm:py-2.5 px-6 sm:px-8 rounded-[6px] transition-all duration-300 
          ${
            isLocked
              ? "bg-white shadow-[0_0_14px_white] cursor-not-allowed"
              : "bg-[#FFFB00] shadow-[0_0_18px_#FFFB00] hover:scale-105"
          }`}
      >
        {isLocked ? "SELECTED!" : "SELECT"}
      </button>
    </div>
  );
}