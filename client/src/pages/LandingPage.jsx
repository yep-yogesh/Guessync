import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AvatarSelector from "../components/LandingPage/AvatarSelector";
import GlowingButton from "../components/common/GlowingButton";
import Navbar from "../components/common/Navbar";

export default function LandingPage() {
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("user"));

  const [name, setName] = useState(userData?.name || localStorage.getItem("userName") || "");
  const [avatar, setAvatar] = useState(userData?.avatar || localStorage.getItem("userAvatar") || null);
  const [greeted, setGreeted] = useState(!!userData || (!!name && !!avatar));
  const [isSignedUp, setIsSignedUp] = useState(!!userData);

  useEffect(() => {
    if (name.trim()) localStorage.setItem("userName", name);
    if (avatar) localStorage.setItem("userAvatar", avatar);
  }, [name, avatar]);

  const handleEnter = () => {
    if (name.trim() && avatar) {
      const formatted = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
      setName(formatted);
      setGreeted(true);
      localStorage.setItem("userName", formatted);
      localStorage.setItem("userAvatar", avatar);
    }
  };

  return (
    <div className="bg-black text-white font-montserrat h-screen overflow-hidden">
      <Navbar />

      <div className="flex flex-col justify-start items-center h-full pt-11 scale-[0.95]">
        <h1 className="text-5xl font-black mb-6 font-montserrat">
          Hello{greeted ? `, ${name}!` : "!"}
        </h1>

        <div className="flex items-center gap-2 bg-[#FFFB00] px-2 py-1 rounded-[8px] shadow-[0_0_25px_#FFFB00] mb-6">
          <input
            type="text"
            placeholder="Enter Your Name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isSignedUp}
            className="px-4 py-3 w-[500px] h-[42px] border-2 border-black rounded-l-[6px] text-black text-base placeholder-black font-silkscreen bg-white outline-black m-1 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            onClick={handleEnter}
            disabled={isSignedUp}
            className="bg-[#FFFB00] h-11 text-black font-silkscreen border border-black text-sm px-6 py-[9px] rounded-[6px] hover:scale-105 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ENTER
          </button>
        </div>

        <AvatarSelector
          selectedAvatar={avatar}
          onSelect={(a) => {
            setAvatar(a);
            localStorage.setItem("userAvatar", a);
          }}
          disabled={isSignedUp}
        />

        <div className="flex gap-20 mt-12">
          <div className="flex flex-col items-center">
            <p className="text-sm font-bold font-montserrat mb-2">Have A Room-Code?</p>
            <GlowingButton
              text="JOIN A ROOM"
              color="white"
              className="w-[280px] font-silkscreen text-lg"
              onClick={() => navigate("/join-room")}
              disabled={!name.trim() || !avatar}
            />
          </div>
          <div className="flex flex-col items-center">
            <p className="text-sm font-bold font-montserrat mb-2">Want to Host a game?</p>
            <GlowingButton
              text="CREATE A ROOM"
              color="yellow"
              className="w-[280px] font-silkscreen text-lg"
              onClick={() => navigate("/create-room")}
              disabled={!name.trim() || !avatar}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
