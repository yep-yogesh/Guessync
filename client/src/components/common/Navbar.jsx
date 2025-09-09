import { useNavigate } from "react-router-dom";
import avatar from "/avatars/1.png"; 


export default function Navbar() {
  const navigate = useNavigate();
  

  return (
    <nav className="w-full flex items-center justify-between px-6 py-4 bg-black text-white font-montserrat">
    <div
      className="flex items-center cursor-pointer"
      onClick={() => navigate("/")}
    >
      <img src="/logo.png" alt="logo" className="w-10 h-10 mt-1.5" />
      <h1 className="text-2xl font-silkscreen text-white">
        GUES
        <span className="text-[#FFFB00] drop-shadow-[0_0_5px_#FFFB00]">SYNC</span>
      </h1>
    </div>

      <div className="flex items-center gap-8 text-lg font-medium">
        <button
          onClick={() => navigate("/landing")}
          className="relative after:absolute after:left-0 after:bottom-[-5px] after:w-0 after:h-[2px] after:bg-[#FFFB00] after:shadow-[0_0_10px_#FFFB00] hover:after:w-full after:transition-all after:duration-300"
        >
          Home
        </button>
        <button
          onClick={() => navigate("/create-room")}
          className="relative after:absolute after:left-0 after:bottom-[-5px] after:w-0 after:h-[2px] after:bg-[#FFFB00] after:shadow-[0_0_10px_#FFFB00] hover:after:w-full after:transition-all after:duration-300"
        >
          New Room
        </button>
        <button
          onClick={() => navigate("/about")}
          className="relative after:absolute after:left-0 after:bottom-[-5px] after:w-0 after:h-[2px] after:bg-[#FFFB00] after:shadow-[0_0_10px_#FFFB00] hover:after:w-full after:transition-all after:duration-300"
        >
          About Dev
        </button>
        <button
          onClick={() => navigate("/how-to-play")}
          className="relative after:absolute after:left-0 after:bottom-[-5px] after:w-0 after:h-[2px] after:bg-[#FFFB00] after:shadow-[0_0_10px_#FFFB00] hover:after:w-full after:transition-all after:duration-300"
        >
          How to Play
        </button>

        <button
          onClick={() => navigate("/login")}
          className="bg-[#FFFB00] text-black w-32 px-4 py-2 rounded-[6px] shadow-[0_0_10px_#FFFB00] hover:scale-105 transition font-silkscreen"
        >
          Login
        </button>

        <img
          src={avatar}
          onClick={() => navigate("/profile")}
          alt="profile"
          className="w-10 h-10 rounded-full border-[2px] border-[#FFFB00] shadow-[0_0_10px_#FFFB00] cursor-pointer"
        />
      </div>
    </nav>
  );
}