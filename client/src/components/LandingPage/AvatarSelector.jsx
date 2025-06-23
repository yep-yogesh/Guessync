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
    <div className="flex flex-col items-center">
      <h2 className="text-3xl font-black font-montserrat mb-7 mt-2">Choose An Avatar</h2>

      <div className="flex items-center gap-4 scale-[1.05]">
        <button
          disabled={isLocked}
          onClick={() => cycle(-1)}
          className={`w-[45px] h-[45px] text-black text-xl font-silkscreen rounded-[6px] transition ${
            isLocked
              ? "bg-gray-500 opacity-50 cursor-not-allowed"
              : "bg-[#FFFB00] shadow-[0_0_20px_#FFFB00] hover:scale-110"
          }`}
        >
          &lt;
        </button>

        <div
          className={`p-2 rounded-[6px] border-[2px] border-[#FFFB00] transition-all duration-300 ${
            isLocked ? "shadow-[0_0_25px_#FFFB00]" : "shadow-[0_0_15px_#FFFB00]"
          }`}
        >
          <img
            src={avatars[index]}
            alt="avatar"
            className={`w-[90px] h-[90px] rounded-[6px] transition-opacity duration-300 ${
              fade ? "opacity-0" : "opacity-100"
            }`}
          />
        </div>

        <button
          disabled={isLocked}
          onClick={() => cycle(1)}
          className={`w-[45px] h-[45px] text-black text-xl font-silkscreen rounded-[6px] transition ${
            isLocked
              ? "bg-gray-500 opacity-50 cursor-not-allowed"
              : "bg-[#FFFB00] shadow-[0_0_20px_#FFFB00] hover:scale-110"
          }`}
        >
          &gt;
        </button>
      </div>

      <button
        disabled={isLocked}
        onClick={handleSelect}
        className={`mt-4 font-silkscreen text-black py-2 px-6 rounded-[6px] transition-all duration-300 ${
          isLocked
            ? "bg-white shadow-[0_0_15px_white] cursor-not-allowed"
            : "bg-[#FFFB00] shadow-[0_0_20px_#FFFB00] hover:scale-105"
        }`}
      >
        {isLocked ? "SELECTED!" : "SELECT"}
      </button>
    </div>
  );
}
