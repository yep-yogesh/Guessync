import React, { useEffect, useState, useRef } from "react";
import Navbar from "../components/common/Navbar";
import { useNavigate } from "react-router-dom";
import socket from "../socket";
import sendIcon from "../assets/send.png";
import spotcon from "../assets/spotify.png";


const DEFAULT_PLAYLISTS = {
  Tamil: "316WvxScpeCbfvWVrTHfPa",
  Hindi: "4stlIpoPS7uKCsmUA7D8KZ",
  English: "2clGinIH6s1bj2TclAgKzW",
  Malayalam: "5tU4P1GOBDBs9nwfok79yD",
  Telugu: "1llHjtjECBo12ChwOGe38L",
  Kannada: "6utix5lfPoZkBirWlRujqa"
};

const CreateRoom = () => {
  const [roomCode, setRoomCode] = useState("");
  const [players, setPlayers] = useState(1);
  const [rounds, setRounds] = useState(1);
  const [duration, setDuration] = useState(30);
  const [spotifyInputVisible, setSpotifyInputVisible] = useState(false);
  const [spotifyValue, setSpotifyValue] = useState("");
  const [spotifyConfirmed, setSpotifyConfirmed] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [rulesFile, setRulesFile] = useState(null);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
  const handleResize = () => {
    if (window.innerWidth >= 1024) {
      document.body.style.overflow = "hidden"; // lock scroll
    } else {
      document.body.style.overflow = "auto";   // allow scroll
    }
  };

  handleResize(); // run on mount
  window.addEventListener("resize", handleResize);

  return () => {
    document.body.style.overflow = "auto"; // cleanup
    window.removeEventListener("resize", handleResize);
  };
}, []);


  useEffect(() => {
    window.scrollTo(0, 0);
    const code = Math.floor(100000 + Math.random() * 900000);
    setRoomCode(code);
  }, []);

  const toggleLanguage = (lang) => {
    setSelectedLanguage((prev) => (prev === lang ? "" : lang));
  };

  // Smooth moving blobs overlay (theme-matched)
  const LoadingOverlay = ({ text = "Loading..." }) => {
    const [movingBlobs, setMovingBlobs] = useState([]);
    const rafRef = useRef(null);

    useEffect(() => {
      const genBlobs = () => {
        const blobs = [];
        const numBlobs = Math.floor(Math.random() * 70) + 20;
        for (let i = 0; i < numBlobs; i++) {
          const size = Math.random() * 160 + 180;
          const speedX = (Math.random() * 2 - 1) * 6.5;
          const speedY = (Math.random() * 2 - 1) * 6.5;
          const x = Math.random() * window.innerWidth;
          const y = Math.random() * window.innerHeight;
          const opacity = Math.random() * 0.05 + 0.07;
          blobs.push({ id: i, size, x, y, speedX, speedY, opacity, color: "#FFFB00" });
        }
        setMovingBlobs(blobs);
      };

      const animate = () => {
        setMovingBlobs((prev) =>
          prev.map((b) => {
            let x = b.x + b.speedX;
            let y = b.y + b.speedY;
            if (x < 0 || x > window.innerWidth - b.size) b.speedX *= -1, (x = b.x + b.speedX);
            if (y < 0 || y > window.innerHeight - b.size) b.speedY *= -1, (y = b.y + b.speedY);
            return { ...b, x, y };
          })
        );
        rafRef.current = requestAnimationFrame(animate);
      };

      genBlobs();
      animate();
      return () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      };
    }, []);

    return (
      <div className="fixed inset-0 z-50 bg-black text-white flex items-center justify-center">
        {/* Background floating blobs */}
        {movingBlobs.map((blob) => (
          <div
            key={blob.id}
            className="absolute rounded-full blur-3xl"
            style={{
              width: `${blob.size}px`,
              height: `${blob.size}px`,
              left: `${blob.x}px`,
              top: `${blob.y}px`,
              backgroundColor: blob.color,
              opacity: blob.opacity,
            }}
          />
        ))}
        {/* Center spinner + text */}
        <div className="relative z-10 flex flex-col items-center font-silkscreen">
          <div className="w-12 h-12 border-4 border-[#FFFB00] border-t-transparent rounded-full animate-spin mb-6"></div>
          <h2 className="text-2xl font-bold">{text}</h2>
        </div>
      </div>
    );
  };

  const handleCreateRoom = async () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    if (!token || !user) {
      alert("Please log in first!");
      return;
    }
    if (isCreating) return; // prevent multiple clicks
    setIsCreating(true);

    socket.auth = { uid: user.uid };
    socket.connect();

    let playlistId = null;
    let useSpotify = false;
    let rulesText = "";

    if (selectedLanguage && DEFAULT_PLAYLISTS[selectedLanguage]) {
      playlistId = DEFAULT_PLAYLISTS[selectedLanguage];
      useSpotify = true;
    } else if (spotifyConfirmed && spotifyValue.trim()) {
      const extracted = spotifyValue.split("playlist/")[1]?.split("?")[0];
      if (!extracted) {
        alert("❌ Invalid Spotify Playlist URL");
        setIsCreating(false);
        return;
      }
      playlistId = extracted;
      useSpotify = true;
    }

    if (rulesFile) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        rulesText = e.target.result;
        await sendRequest();
      };
      reader.readAsText(rulesFile);
    } else {
      await sendRequest();
    }

    async function sendRequest() {
      const payload = {
        uid: user.uid,
        name: user.name,
        avatar: user.avatar || "https://i.imgur.com/placeholder.png",
        useSpotify,
        playlistId,
        players,
        rounds,
        duration,
        language: selectedLanguage,
        code: roomCode,
        rules: rulesText,
      };

      try {
        const res = await fetch("https://guessync.onrender.com/api/room/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        const data = await res.json();

        if (res.ok) {
          const room = {
            code: data.code,
            hostUID: user.uid,
            players: [{ uid: user.uid, name: user.name, avatar: user.avatar }],
          };
          localStorage.setItem("room", JSON.stringify(room));
          socket.emit("join-room", { roomCode: data.code, user });
          navigate("/waiting-room");
        } else {
          alert("❌ Failed to create room: " + data.message);
          setIsCreating(false);
        }
      } catch (err) {
        console.error("Error creating room:", err);
        alert("❌ Something went wrong.");
        setIsCreating(false);
      }
    }
  };

  const showCreateBtn = selectedLanguage || spotifyConfirmed;

return (
<div className="bg-black min-h-screen flex flex-col text-white font-montserrat overflow-y-auto overflow-x-hidden" 
     style={{
       scrollbarWidth: 'thin',
       scrollbarColor: '#FFFB00 #111111'
     }}>
  <style jsx>{`
    div::-webkit-scrollbar {
      width: 8px;
    }
    
    div::-webkit-scrollbar-track {
      background: #000000;
      border-left: 2px solid #333333;
    }
    
    div::-webkit-scrollbar-thumb {
      background: #FFFB00;
      border: 2px solid #000000;
      box-shadow: 
        inset 2px 2px 0 #FFFF33,
        inset -2px -2px 0 #CCCC00;
    }
    
    div::-webkit-scrollbar-thumb:hover {
      background: #FFE500;
      box-shadow: 
        inset 2px 2px 0 #FFFF66,
        inset -2px -2px 0 #999900,
        0 0 12px #FFFB00;
    }
    
    div::-webkit-scrollbar-thumb:active {
      background: #CCCC00;
      box-shadow: 
        inset -2px -2px 0 #FFFF33,
        inset 2px 2px 0 #999900;
    }
  `}</style>
  <Navbar />
  <div className="flex-1 flex flex-col items-center px-4 py-6 sm:px-6 md:px-8 lg:justify-center lg:scale-125">

      {/* Title */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-black mb-3 sm:mb-4 drop-shadow-[0_0_5px_#111] mt-6 sm:mt-10 text-center">
        Create A New Room
      </h1>

      {/* Room Code Section */}
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5 relative justify-center">
        <span className="font-silkscreen text-xl sm:text-xl md:text-2xl tracking-widest drop-shadow-[0_0_5px_#fff]">
          ROOM CODE:
        </span>
        <div className="flex items-center gap-2 sm:gap-3 relative">
          <span className="font-silkscreen text-2xl sm:text-xl md:text-2xl text-[#FFFB00] tracking-wider sm:tracking-[10.2px] drop-shadow-[0_0_5px_#FFFB00]">
            {roomCode}
          </span>
          <img
            src="/copy.png"
            alt="copy"
            className="w-10 h-10 sm:w-12 sm:h-12 md:w-[59.5px] md:h-[59.5px] cursor-pointer hover:scale-110 transition"
            onClick={() => {
              navigator.clipboard.writeText(roomCode);
              setShowNotification(true);
              setTimeout(() => setShowNotification(false), 2000);
            }}
            />
          {showNotification && (
            <div className="absolute left-full ml-2 bg-[#fffb0065]/60 text-[#FFFB00] border border-[#FFFB00] font-silkscreen px-3 py-1 rounded-lg drop-shadow-[0_0_5px_#111] text-sm whitespace-nowrap">
              Code copied!
            </div>
          )}
        </div>
      </div>

      {/* Custom Controls */}
      <div className="w-full max-w-2xl mx-auto text-center mb-6 sm:mb-8">
        {/* Only show Upload Rules button on large screens */}
        <div className="hidden lg:flex justify-center gap-8 items-center mb-6">
          <h2 className="text-white font-black text-[1.53rem] drop-shadow-[0_0_5px_#111] mr-6">
            CUSTOM CONTROLS
          </h2>
          <button
            onClick={() => setShowRulesModal(true)}
            className={`duration-btn font-silkscreen px-6 py-2 rounded-lg border-[3px] text-[17px] transition ${
              rulesFile
              ? "border-[#FFFB00] text-[#FFFB00] bg-[#FFFB00]/20 shadow-[0_0_15px_#FFFB00]"
              : "border-gray-600 text-gray-500 bg-gray-500/20 hover:border-[#FFFB00] hover:text-[#FFFB00] hover:bg-[#FFFB00]/10 hover:shadow-[0_0_15px_#111]"
            }`}
            >
            {rulesFile ? "UPLOADED RULES" : "UPLOAD RULES"}
          </button>
        </div>

        {/* Show only the heading on smaller screens */}
        <div className="lg:hidden mb-6">
          <h2 className="text-white font-black text-xl sm:text-[1.53rem] drop-shadow-[0_0_5px_#111]">
            CUSTOM CONTROLS
          </h2>
        </div>

        {/* Players and Rounds Controls */}
        {[
          { label: "NO. OF PLAYERS", value: players, set: setPlayers, max: 12 },
          { label: "NO. OF ROUNDS", value: rounds, set: setRounds, max: 20 },
        ].map((ctrl, i) => (
          <div key={i} className="flex flex-col sm:flex-row justify-center items-center mb-4 sm:mb-6 gap-3 sm:gap-8">
            <label className="w-full sm:w-[255px] font-silkscreen text-base sm:text-[1.275rem] whitespace-nowrap drop-shadow-[0_0_5px_#fff] text-center sm:text-left">
              {ctrl.label}
            </label>
            <div className="flex items-center gap-3 sm:gap-5">
              <button
                className="bg-[#FFFB00] w-10 h-10 sm:w-[51px] sm:h-[51px] font-silkscreen rounded-lg text-black text-xl sm:text-[1.53rem] drop-shadow-[0_0_7px_#FFFB00]"
                onClick={() => ctrl.set(Math.max(1, ctrl.value - 1))}
                >
                -
              </button>
              <span className="bg-white w-10 h-10 sm:w-[51px] sm:h-[51px] text-black rounded-lg font-silkscreen text-xl sm:text-[1.53rem] drop-shadow-[0_0_7px_#fff] flex justify-center items-center">
                {ctrl.value}
              </span>
              <button
                className="bg-[#FFFB00] w-10 h-10 sm:w-[51px] sm:h-[51px] font-silkscreen rounded-lg text-black text-xl sm:text-[1.53rem] drop-shadow-[0_0_7px_#FFFB00]"
                onClick={() =>
                  ctrl.set(Math.min(ctrl.max, ctrl.value + 1))
                }
                >
                +
              </button>
            </div>
          </div>
        ))}

        {/* Duration Control */}
        <div className="flex flex-col sm:flex-row justify-center items-center mb-4 sm:mb-6 gap-3 sm:gap-10">
          <label className="w-full sm:w-[255px] font-silkscreen text-base sm:text-[1.275rem] whitespace-nowrap drop-shadow-[0_0_5px_#fff] text-center sm:text-left">
            DURATION OF SONG
          </label>
          <div className="flex gap-3 sm:gap-5">
            {[30, 60].map((val) => (
              <button
              key={val}
              onClick={() => setDuration(val)}
              className={`duration-btn font-silkscreen px-4 py-2 sm:px-6 sm:py-2 rounded-lg border-[3px] text-sm sm:text-[17px] transition ${
                duration === val
                ? "border-[#FFFB00] text-[#FFFB00] bg-[#FFFB00]/20 shadow-[0_0_15px_#FFFB00]"
                : "border-gray-600 text-gray-500 bg-gray-500/20 hover:border-[#FFFB00] hover:text-[#FFFB00] hover:bg-[#FFFB00]/10 hover:shadow-[0_0_15px_#111]"
              }`}
              >
                {val}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons - Centered and enlarged for larger devices */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 mb-6 sm:mb-10 justify-center items-center w-full max-w-2xl px-4">
        {!spotifyConfirmed && !showCreateBtn && (
          <button
          onClick={() => setShowModal(true)}
          className="font-silkscreen w-full md:w-[280px] py-3 md:py-4 rounded-lg bg-[#FFFB00] text-black text-base md:text-[1.3rem] drop-shadow-[0_0_7px_#FFFB00] hover:drop-shadow-[0_0_10px_#FFFB00]"
          >
            CHOOSE LANGUAGE
          </button>
        )}

        {!selectedLanguage && !showCreateBtn && (
          <div className="relative w-full md:w-[280px] h-12 md:h-14">
            {!spotifyInputVisible ? (
              <button
              className="w-full h-full bg-[#1ED760] text-black font-silkscreen py-2 px-4 rounded-lg text-sm md:text-[1.1rem] drop-shadow-[0_0_7px_#1ED760] hover:drop-shadow-[0_0_10px_#1ED760] flex items-center justify-center gap-2"
              onClick={() => setSpotifyInputVisible(true)}
              >
                <img src={spotcon} alt="spotify" className="h-4 md:h-6" />
                CONNECT SPOTIFY
              </button>
            ) : (
              <div className="absolute top-0 left-0 w-full h-full bg-white flex items-center justify-between px-3 rounded-lg border-[3px] border-[#1ED760]">
                <input
                  type="text"
                  className="bg-transparent w-full text-black font-silkscreen text-xs md:text-base placeholder:text-gray-500 outline-none"
                  placeholder="Enter playlist link"
                  value={spotifyValue}
                  onChange={(e) => setSpotifyValue(e.target.value)}
                  />
                <img
                  src={sendIcon}
                  alt="send"
                  className="w-4 h-4 md:w-5 md:h-5 cursor-pointer"
                  onClick={() => {
                    if (spotifyValue.trim()) setSpotifyConfirmed(true);
                  }}
                  />
              </div>
            )}
          </div>
        )}

        {selectedLanguage && (
          <div className="text-[#FFFB00] font-silkscreen text-base md:text-xl text-center">
            Using {selectedLanguage} playlist
          </div>
        )}

        {showCreateBtn && (
          <button
            onClick={handleCreateRoom}
            disabled={isCreating}
            className={`bg-[#FFFB00] text-black font-silkscreen px-6 py-3 rounded-lg text-base md:text-xl drop-shadow-[0_0_7px_#FFFB00] hover:drop-shadow-[0_0_10px_#FFFB00] w-full md:w-[240px] md:h-14 ${isCreating ? "opacity-60 cursor-not-allowed hover:drop-shadow-none" : ""}`}
          >
            {isCreating ? "CREATING..." : "CREATE ROOM"}
          </button>
        )}
      </div>

      {/* Language Selection Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-black border-4 border-[#FFFB00] p-4 sm:p-6 md:p-8 rounded-lg w-full max-w-md sm:max-w-lg md:max-w-xl drop-shadow-[0_0_10px_#111] text-center relative">
            <button
              className="absolute -top-12 left-0 bg-[#FFFB00] text-black font-silkscreen px-3 py-1 sm:px-4 sm:py-2 rounded-lg shadow-lg hover:scale-105 transition text-base sm:text-[1.1rem]"
              onClick={() => setShowModal(false)}
              >
              ← Back
            </button>
            <h2 className="text-white font-black text-xl sm:text-2xl md:text-3xl mb-4">
              Pick Language
            </h2>
            <p className="font-silkscreen text-[#FFFB00] text-base sm:text-lg md:text-xl mb-4 sm:mb-6">
              Select one language
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
              {Object.keys(DEFAULT_PLAYLISTS).map((lang) => (
                <button
                key={lang}
                onClick={() => toggleLanguage(lang)}
                className={`py-2 px-3 sm:py-3 sm:px-4 rounded-lg font-silkscreen text-base sm:text-[1.1rem] border-[3px] transition ${
                  selectedLanguage === lang
                  ? "text-[#FFFB00] border-[#FFFB00] bg-[#FFFB00]/5 drop-shadow-[0_0_7px_#FFFB00]"
                  : "text-gray-500 bg-gray-500/20 border-gray-500 hover:border-[#FFFB00] hover:text-[#FFFB00] hover:drop-shadow-[0_0_7px_#111]"
                }`}
                >
                  {lang}
                </button>
              ))}
            </div>
            <button
              className="bg-white text-black font-silkscreen px-6 py-2 sm:px-8 sm:py-3 rounded-lg text-base sm:text-[1.2rem] drop-shadow-[0_0_7px_#111] hover:drop-shadow-[0_0_10px_#111]"
              onClick={() => {
                if (selectedLanguage) {
                  setShowModal(false);
                } else {
                  alert("Please select a language.");
                }
              }}
              >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Rules Upload Modal */}
      {showRulesModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative bg-black border-4 border-[#FFFB00] p-4 sm:p-6 md:p-8 rounded-lg w-full max-w-md sm:max-w-lg md:max-w-xl drop-shadow-[0_0_10px_#111] text-center">
            <button
              className="absolute -top-12 left-0 bg-[#FFFB00] text-black font-silkscreen px-3 py-1 sm:px-4 sm:py-2 rounded-lg shadow-lg hover:scale-105 transition text-base sm:text-[1.1rem]"
              onClick={() => setShowRulesModal(false)}
              >
              ← Back
            </button>
            <h6 className="text-white font-bold text-base sm:text-[1.1rem] mb-2">
              Optional
            </h6>
            <h2 className="text-white font-black text-xl sm:text-2xl md:text-3xl mb-4 sm:mb-6">
              Upload Rules
            </h2>
            <p className="font-silkscreen text-[#FFFB00] text-base sm:text-lg md:text-xl mb-4 sm:mb-8 leading-6 sm:leading-7">
              UPLOAD A <code className="text-white">.TXT</code> FILE WITH GAME<br />
              RULES LIKE:
              <br />– NO SHAZAM <br />– NO CHEATING <br />– NO SPAMMING <br />–
              BE RESPECTFUL
            </p>
            <label className="cursor-pointer font-silkscreen bg-[#FFFB00] text-black gap-2 sm:gap-4 px-4 py-2 sm:px-6 sm:py-3 rounded-lg shadow-lg hover:scale-105 transition inline-block text-base sm:text-[1.1rem] mb-4 sm:mb-0">
              Choose File
              <input
                type="file"
                accept=".txt"
                className="hidden"
                onChange={(e) => setRulesFile(e.target.files[0])}
                />
            </label>
            {rulesFile && (
              <div className="mt-4 sm:mt-6 group w-full flex justify-center">
                <div className="flex justify-between items-center gap-2 sm:gap-3 bg-[#111] border-[2px] border-[#FFFB00] px-3 py-2 sm:px-5 sm:py-3 rounded-lg font-silkscreen text-base sm:text-[1.1rem] text-[#FFFB00] shadow-[0_0_8px_#FFFB00] transition-all duration-300 group-hover:bg-red/0 group-hover:border-red-500 group-hover:text-red-300 group-hover:shadow-[0_0_8px_red] w-full max-w-md">
                  <span className="truncate text-xs sm:text-base">{rulesFile.name}</span>
                  <button
                    className="ml-2 sm:ml-3 text-red-400 hover:text-red-300 hover:scale-110 transition text-lg sm:text-[1.3rem]"
                    onClick={() => setRulesFile(null)}
                    title="Remove File"
                    >
                    ✕
                  </button>
                </div>
              </div>
            )}
            <button
              className="mt-6 sm:mt-8 bg-white text-black font-silkscreen px-6 py-2 sm:px-8 sm:py-3 rounded-lg text-base sm:text-[1.2rem] drop-shadow-[0_0_7px_#111] hover:drop-shadow-[0_0_10px_#111]"
              onClick={() => setShowRulesModal(false)}
              >
              DONE
            </button>
          </div>
        </div>
      )}
      </div> 
    </div>
  );
};

export default CreateRoom;