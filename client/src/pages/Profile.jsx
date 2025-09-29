// Added by Varsha - Profile Page
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";


const Profile = () => {
  const navigate = useNavigate();


  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white font-silkscreen px-4 sm:px-6">
      <div className="text-4xl sm:text-5xl md:text-6xl animate-pulse text-[#FFFB00] drop-shadow-[0_0_15px_#FFFB00] mb-4 sm:mb-6">
        🚧
      </div>

      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-center font-bold mb-3 sm:mb-4 tracking-wide sm:tracking-widest px-2">
        UNDER <span className="text-[#FFFB00] drop-shadow-[0_0_5px_#FFFB00]">Development</span>
      </h1>

      <p className="text-sm sm:text-base md:text-lg text-gray-300 text-center max-w-xs sm:max-w-md font-montserrat mb-6 sm:mb-8 leading-relaxed px-2">
        We're cookin' something awesome here. Your profile page will be live very soon!
      </p>

      <button
        onClick={() => navigate("/landing")}
        className="mt-2 sm:mt-4 bg-[#FFFB00] text-black font-silkscreen px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base rounded-md shadow-[0_0_10px_#FFFB00] hover:scale-105 transition-all duration-200"
      >
        Go Back Home
      </button>
    </div>
  );
};

export default Profile;