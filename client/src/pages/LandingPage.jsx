import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AvatarSelector from "../components/LandingPage/AvatarSelector";
import GlowingButton from "../components/common/GlowingButton";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

export default function LandingPage() {
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("user"));

  const [name, setName] = useState(
    userData?.name || localStorage.getItem("userName") || ""
  );
  const [avatar, setAvatar] = useState(
    userData?.avatar || localStorage.getItem("userAvatar") || null
  );
  const [greeted, setGreeted] = useState(!!userData || (!!name && !!avatar));
  const isSignedUp = !!userData; // User is signed up if userData exists

  useEffect(() => {
    if (name.trim()) localStorage.setItem("userName", name);
    if (avatar) localStorage.setItem("userAvatar", avatar);
  }, [name, avatar]);

  const handleEnter = () => {
    if (name.trim() && avatar) {
      const formatted =
        name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
      setName(formatted);
      setGreeted(true);
      localStorage.setItem("userName", formatted);
      localStorage.setItem("userAvatar", avatar);
    }
  };

  return (
    <div className="bg-black text-white font-montserrat flex flex-col">
      <Navbar />

      {/* Scale landing body - Takes full viewport height */}
      <div className="min-h-screen flex items-center justify-center px-4 py-8">
        <div className="flex flex-col justify-center items-center w-full max-w-4xl">
          {/* Greeting */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6 text-center">
            Hello{greeted ? `, ${name}!` : "!"}
          </h1>

          {/* Mobile Input & Button separated */}
          <div className="flex flex-col items-center gap-3 sm:hidden mb-6">
            <div className="flex items-center bg-[#FFFB00] px-2 py-1 rounded-[8px] shadow-[0_0_20px_#FFFB00] w-[220px]">
              <input
                type="text"
                placeholder="Enter Your Name..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSignedUp}
                className="px-2 py-2 w-full text-sm border-2 border-black rounded-[6px] text-black placeholder-black font-silkscreen bg-white outline-black disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            <button
              onClick={handleEnter}
              disabled={isSignedUp}
              className="bg-[#FFFB00] w-[140px] h-9 text-black font-silkscreen border border-black text-sm px-4 py-2 rounded-[6px] hover:scale-105 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ENTER
            </button>
          </div>

          {/* Desktop Input + Button inside border */}
          <div className="hidden sm:flex flex-row items-center gap-2 bg-[#FFFB00] px-2 py-1 rounded-[8px] shadow-[0_0_25px_#FFFB00] mb-6 w-full max-w-[500px]">
            <input
              type="text"
              placeholder="Enter Your Name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSignedUp}
              className="px-4 py-3 w-full text-base border-2 border-black rounded-[6px] text-black placeholder-black font-silkscreen bg-white outline-black disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              onClick={handleEnter}
              disabled={isSignedUp}
              className="bg-[#FFFB00] w-auto h-11 text-black font-silkscreen border border-black text-sm px-6 py-[9px] rounded-[6px] hover:scale-105 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ENTER
            </button>
          </div>

          {/* Avatar Selector */}
          <div className="scale-[1.05] sm:scale-100">
            <AvatarSelector
              selectedAvatar={avatar}
              onSelect={(a) => {
                setAvatar(a);
                localStorage.setItem("userAvatar", a);
              }}
              disabled={isSignedUp}
            />
          </div>

          {/* Join/Create Buttons */}
          <div className="flex flex-col md:flex-row gap-6 md:gap-12 mt-8 w-full items-center justify-center">
            <div className="flex flex-col items-center w-full sm:w-auto">
              <p className="text-sm sm:text-base font-bold mb-2">
                Have A Room-Code?
              </p>
              <GlowingButton
                text="JOIN A ROOM"
                color="white"
                className="w-[200px] sm:w-[220px] md:w-[240px] lg:w-[280px] font-silkscreen text-sm sm:text-base md:text-lg"
                onClick={() => navigate("/join-room")}
                disabled={!name.trim() || !avatar}
              />
            </div>
            <div className="flex flex-col items-center w-full sm:w-auto">
              <p className="text-sm sm:text-base font-bold mb-2">
                Want to Host a game?
              </p>
              <GlowingButton
                text="CREATE A ROOM"
                color="yellow"
                className="w-[200px] sm:w-[220px] md:w-[240px] lg:w-[280px] font-silkscreen text-sm sm:text-base md:text-lg"
                onClick={() => navigate("/create-room")}
                disabled={!name.trim() || !avatar}
              />
            </div>
          </div>
          
          {/* Spacer to ensure footer is below viewport */}
          <div className="h-20"></div>
        </div>
      </div>
      <Footer />
    </div>
  );
}