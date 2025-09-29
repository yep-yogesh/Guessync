import React, { useState } from "react";

const AvatarGrid = ({ selected, onSelect }) => {
  const avatarCount = 11;
  const [highlighted, setHighlighted] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);

  const handleSelect = (index) => {
    if (!isSpinning) {
      onSelect(`/avatars/${index + 1}.png`);
      setHighlighted(null);
    }
  };

  const randomize = () => {
    if (isSpinning) return;

    setHighlighted(null);
    onSelect(null);
    setIsSpinning(true);

    let totalSteps = 20 + Math.floor(Math.random() * 8);
    let current = 0;

    const spin = () => {
      setHighlighted(current % avatarCount);
      current++;

      if (current < totalSteps) {
        const delay = 80 + current * 20;
        setTimeout(spin, delay);
      } else {
        const selectedIndex = (current - 1) % avatarCount;
        onSelect(`/avatars/${selectedIndex + 1}.png`);
        setIsSpinning(false);
      }
    };

    spin();
  };

  return (
    <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 justify-items-center w-full max-w-2xl">
      {Array.from({ length: avatarCount }).map((_, i) => {
        const isSelected = selected === `/avatars/${i + 1}.png`;
        const isHighlighted = highlighted === i;
        return (
          <div
            key={i}
            onClick={() => handleSelect(i)}
            className={`w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-xl overflow-hidden flex items-center justify-center cursor-pointer transition-all duration-200
              ${isSelected || isHighlighted
                ? "border-4 border-[#FFFB00] bg-[#FFFB00]/20 opacity-100 shadow-[0_0_15px_#FFFB00]"
                : "opacity-40 border-2 border-gray-600"}
              hover:opacity-100 hover:shadow-[0_0_10px_#FFFB00]`}
          >
            <img
              src={`/avatars/${i + 1}.png`}
              alt={`Avatar ${i + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        );
      })}

      {/* Dice Button */}
      <div
        onClick={randomize}
        className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-xl flex items-center justify-center bg-black border-2 border-white cursor-pointer hover:shadow-[0_0_10px_white] transition-all"
      >
        <img src="/dice.png" alt="Random" className="w-10 sm:w-12 md:w-14" />
      </div>
    </div>
  );
};

export default AvatarGrid;