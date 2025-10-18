// Added by Varsha - Profile Page
import React from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();

  // Reusable tape band (now supports bottom, opacity, and z-index)
  const TapeBand = ({ top, bottom, angle = -12, speed = 16, reverse = false, opacity = 1, z = 1 }) => {
    const phrase = "UNDER CONSTRUCTION ⚠ WARNING ⚠";
    const Row = () => (
      <>
        {Array.from({ length: 14 }).map((_, i) => (
          <span key={i} className="mx-4 sm:mx-6">
            {phrase}
          </span>
        ))}
      </>
    );

    const posStyle = bottom != null ? { bottom } : { top: top ?? "20%" };

    return (
      <div
        className="tape"
        style={{
          ...posStyle,
          transform: `rotate(${angle}deg)`,
          opacity,
          zIndex: z,
        }}
      >
        <div className="relative bg-[#FFFB00] text-black uppercase font-silkscreen tracking-widest border-y-4 border-black py-2 sm:py-3">
          <div
            className="absolute inset-0 opacity-30 pointer-events-none"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, rgba(0,0,0,0.75) 0 12px, transparent 12px 24px)",
            }}
          />
          <div className="overflow-hidden">
            <div
              className="marquee-track"
              style={{
                animation: `${reverse ? "scrollReverse" : "scroll"} ${speed}s linear infinite`,
              }}
            >
              <div className="marquee-content">
                <Row />
              </div>
              <div className="marquee-content" aria-hidden="true">
                <Row />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative min-h-screen bg-black text-white font-silkscreen overflow-hidden">
      {/* faint background tapes behind the text */}
      <TapeBand top="12%" angle={-8} speed={24} opacity={0.08} z={0} />
      <TapeBand top="28%" angle={12} speed={26} reverse opacity={0.06} z={0} />
      <TapeBand top="46%" angle={-10} speed={22} opacity={0.07} z={0} />

      {/* centered text content (kept) */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[60vh] text-center px-4 sm:px-6">
        <div className="text-4xl sm:text-5xl md:text-6xl animate-pulse text-[#FFFB00] drop-shadow-[0_0_15px_#FFFB00] mb-4 sm:mb-6">
          🚧
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 tracking-wide sm:tracking-widest">
          UNDER <span className="text-[#FFFB00] drop-shadow-[0_0_5px_#FFFB00]">Development</span>
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-xs sm:max-w-md font-montserrat leading-relaxed">
          We're cookin' something awesome here. Your profile page will be live very soon!
        </p>
        {/* Moved CTA below the paragraph */}
        <button
          onClick={() => navigate("/landing")}
          className="mt-5 sm:mt-6 cursor-pointer bg-[#FFFB00] text-black px-4 sm:px-6 py-2 sm:py-3 rounded-md shadow-[0_0_14px_#FFFB00] hover:scale-105 transition pointer-events-auto"
        >
          Go Back Home
        </button>
      </div>

      {/* bright, scrolling caution tapes at the bottom, behind the text */}
      <TapeBand bottom="24%" angle={-12} speed={14} z={1} />
      <TapeBand bottom="14%" angle={10} speed={18} reverse z={1} />
      <TapeBand bottom="8%" angle={-14} speed={16} z={1} />
      <TapeBand bottom="0%" angle={9} speed={20} reverse z={1} />

      {/* Local styles for marquee + glow (unchanged) */}
      <style>{`
        .tape {
          position: absolute;
          left: -25vw;
          width: 150vw;
          filter: drop-shadow(0 0 16px #FFFB00);
          will-change: transform;
          pointer-events: none; /* let buttons be clickable */
        }
        @keyframes scroll { 
          0% { transform: translateX(0); } 
          100% { transform: translateX(-50%); } 
        }
        @keyframes scrollReverse { 
          0% { transform: translateX(0); } 
          100% { transform: translateX(50%); } 
        }
        .marquee-track {
          display: flex;
          width: 200%;
          will-change: transform;
        }
        .marquee-content {
          flex: 0 0 50%;
          display: flex;
          align-items: center;
          padding: 0 1rem;
          white-space: nowrap;
        }
        .marquee-content span {
          font-weight: 700;
          letter-spacing: 0.12em;
          text-shadow: 0 0 12px rgba(255,251,0,0.85);
        }
      `}</style>
    </div>
  );
};

export default Profile;