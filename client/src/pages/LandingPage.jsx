import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AvatarSelector from "../components/LandingPage/AvatarSelector";
import GlowingButton from "../components/common/GlowingButton";
import Navbar from "../components/common/Navbar";

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
  const [isSignedUp, setIsSignedUp] = useState(!!userData);

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
    <div className="bg-black text-white font-montserrat min-h-screen w-full flex flex-col">
      <Navbar />

      {/* Scale landing body */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="flex flex-col justify-center items-center w-full max-w-4xl">
          {/* Greeting */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6 text-center">
            Hello{greeted ? `, ${name}!` : "!"}
          </h1>

          {/* Mobile Input & Button separated */}
          <div className="flex flex-col items-center gap-3 sm:hidden mb-6 w-full max-w-xs">
            <div className="flex items-center bg-[#FFFB00] px-2 py-1 rounded-lg shadow-[0_0_20px_#FFFB00] w-full">
              <input
                type="text"
                placeholder="Enter Your Name..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSignedUp}
                className="px-2 py-2 w-full text-sm border-2 border-black rounded-md text-black placeholder-black font-silkscreen bg-white outline-black disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            <button
              onClick={handleEnter}
              disabled={isSignedUp}
              className="bg-[#FFFB00] w-36 h-9 text-black font-silkscreen border border-black text-sm px-4 py-2 rounded-md hover:scale-105 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ENTER
            </button>
          </div>

          {/* Desktop Input + Button inside border */}
          <div className="hidden sm:flex flex-row items-center gap-2 bg-[#FFFB00] px-2 py-1 rounded-lg shadow-[0_0_25px_#FFFB00] mb-6 w-full max-w-lg">
            <input
              type="text"
              placeholder="Enter Your Name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSignedUp}
              className="px-4 py-3 w-full text-base border-2 border-black rounded-md text-black placeholder-black font-silkscreen bg-white outline-black disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              onClick={handleEnter}
              disabled={isSignedUp}
              className="bg-[#FFFB00] whitespace-nowrap h-11 text-black font-silkscreen border border-black text-sm px-6 py-2 rounded-md hover:scale-105 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ENTER
            </button>
          </div>

          {/* Avatar Selector */}
          <div className="w-full flex justify-center mb-8">
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
          <div className="flex flex-col md:flex-row gap-6 md:gap-12 w-full items-center justify-center">
            <div className="flex flex-col items-center w-full sm:w-auto">
              <p className="text-sm sm:text-base font-bold mb-2">
                Have A Room-Code?
              </p>
              <GlowingButton
                text="JOIN A ROOM"
                color="white"
                className="w-52 sm:w-56 md:w-60 lg:w-72 font-silkscreen text-sm sm:text-base md:text-lg"
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
                className="w-52 sm:w-56 md:w-60 lg:w-72 font-silkscreen text-sm sm:text-base md:text-lg"
                onClick={() => navigate("/create-room")}
                disabled={!name.trim() || !avatar}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}