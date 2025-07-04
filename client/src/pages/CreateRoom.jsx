import React, { useEffect, useState } from "react";
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
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    const code = Math.floor(100000 + Math.random() * 900000);
    setRoomCode(code);
  }, []);

  const toggleLanguage = (lang) => {
    setSelectedLanguage((prev) => (prev === lang ? "" : lang));
  };

  const handleCreateRoom = async () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    if (!token || !user) {
      alert("Please log in first!");
      return;
    }

    socket.auth = { uid: user.uid };
    socket.connect();

    let playlistId = null;
    let useSpotify = false;
    let rulesText = "";

    if (selectedLanguage && DEFAULT_PLAYLISTS[selectedLanguage]) {
      playlistId = DEFAULT_PLAYLISTS[selectedLanguage];
      useSpotify = true;
    } else if (spotifyConfirmed && spotifyValue.trim()) {
      playlistId = spotifyValue.split("playlist/")[1]?.split("?")[0];
      if (!playlistId) {
        alert("❌ Invalid Spotify Playlist URL");
        return;
      }
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
        }
      } catch (err) {
        console.error("Error creating room:", err);
        alert("❌ Something went wrong.");
      }
    }
  };

  const showCreateBtn = selectedLanguage || spotifyConfirmed;

  return (
    <div className="bg-black min-h-screen flex flex-col items-center text-white font-montserrat">
      <Navbar />
      <h1 className="text-[2.38rem] font-black mb-5 drop-shadow-[0_0_5px_#111] mt-13">
        Create A New Room
      </h1>

      <div className="flex items-center gap-3 mb-5 relative">
        <span className="font-silkscreen text-[30.6px] tracking-widest drop-shadow-[0_0_5px_#fff]">
          ROOM CODE:
        </span>
        <span className="font-silkscreen text-[30.6px] text-[#FFFB00] tracking-[10.2px] drop-shadow-[0_0_5px_#FFFB00]">
          {roomCode}
        </span>
        <img
          src="/copy.png"
          alt="copy"
          className="w-[59.5px] h-[59.5px] cursor-pointer hover:scale-110 transition"
          onClick={() => {
            navigator.clipboard.writeText(roomCode);
            setShowNotification(true);
            setTimeout(() => setShowNotification(false), 2000);
          }}
        />
        {showNotification && (
          <div className="absolute right-[-140px] scale-70 bg-[#fffb0065]/60 text-[#FFFB00] border border-[#FFFB00] font-silkscreen px-4 py-2 rounded-lg drop-shadow-[0_0_5px_#111] text-[17px] whitespace-nowrap">
            Code copied!
          </div>
        )}
      </div>

      <div className="w-[85%] mx-auto  text-centermb-8">
        <div className="flex justify-center gap-30 items-center mb-6">
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

{[
  { label: "NO. OF PLAYERS", value: players, set: setPlayers, max: 12 },
  { label: "NO. OF ROUNDS", value: rounds, set: setRounds, max: 20 },
].map((ctrl, i) => (
  <div key={i} className="flex justify-center items-center mb-6 gap-33">
    <label className="w-[255px] font-silkscreen text-[1.275rem] whitespace-nowrap drop-shadow-[0_0_5px_#fff]">
      {ctrl.label}
    </label>
    <div className="flex items-center gap-5">
      <button
        className="bg-[#FFFB00] w-[51px] h-[51px] font-silkscreen rounded-lg text-black text-[1.53rem] drop-shadow-[0_0_7px_#FFFB00]"
        onClick={() => ctrl.set(Math.max(1, ctrl.value - 1))}
      >
        -
      </button>
      <span className="bg-white w-[51px] h-[51px] text-black rounded-lg font-silkscreen text-[1.53rem] drop-shadow-[0_0_7px_#fff] flex justify-center items-center">
        {ctrl.value}
      </span>
      <button
        className="bg-[#FFFB00] w-[51px] h-[51px] font-silkscreen rounded-lg text-black text-[1.53rem] drop-shadow-[0_0_7px_#FFFB00]"
        onClick={() =>
          ctrl.set(Math.min(ctrl.max, ctrl.value + 1))
        }
      >
        +
      </button>
    </div>
  </div>
))}


        <div className="flex justify-center items-center mb-6 gap-38">
          <label className="w-[255px] font-silkscreen text-[1.275rem] whitespace-nowrap drop-shadow-[0_0_5px_#fff]">
            DURATION OF SONG
          </label>
          <div className="flex gap-5">
            {[30, 60].map((val) => (
              <button
                key={val}
                onClick={() => setDuration(val)}
                className={`duration-btn font-silkscreen px-6 py-2 rounded-lg border-[3px] text-[17px] transition ${
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

      <div className="flex gap-[85px] mb-10 flex-wrap justify-center items-center">
        {!spotifyConfirmed && !showCreateBtn && (
          <button
            onClick={() => setShowModal(true)}
            className="font-silkscreen w-[250.5px] py-4 rounded-lg bg-[#FFFB00] text-black text-[1.15rem] drop-shadow-[0_0_7px_#FFFB00] hover:drop-shadow-[0_0_10px_#FFFB00]"
          >
            CHOOSE LANGUAGE
          </button>
        )}

        {!selectedLanguage && !showCreateBtn && (
          <div className="relative w-[250.5px] h-[55px]">
            {!spotifyInputVisible ? (
              <button
                className="w-full h-full bg-[#1ED760] text-black font-silkscreen py-2 px-5 rounded-lg text-[1rem] drop-shadow-[0_0_7px_#1ED760] hover:drop-shadow-[0_0_10px_#1ED760] flex items-center justify-center gap-3"
                onClick={() => setSpotifyInputVisible(true)}
              >
                <img src={spotcon} alt="spotify" className="h-[1.5rem]" />
                CONNECT SPOTIFY
              </button>
            ) : (
              <div className="absolute top-0 left-0 w-full h-full bg-white flex items-center justify-between px-3 rounded-lg border-[3px] border-[#1ED760]">
                <input
                  type="text"
                  className="bg-transparent w-full text-black font-silkscreen text-[0.9rem] mb-1 placeholder:text-gray-500 outline-none"
                  placeholder="Enter playlist link"
                  value={spotifyValue}
                  onChange={(e) => setSpotifyValue(e.target.value)}
                />
                <img
                  src={sendIcon}
                  alt="send"
                  className="w-5 h-5 cursor-pointer"
                  onClick={() => {
                    if (spotifyValue.trim()) setSpotifyConfirmed(true);
                  }}
                />
              </div>
            )}
          </div>
        )}

        {selectedLanguage && (
          <div className="text-[#FFFB00] font-silkscreen text-[1.02rem] mt-2">
            Using {selectedLanguage} playlist
          </div>
        )}

        {showCreateBtn && (
          <button
            onClick={handleCreateRoom}
            className="bg-[#FFFB00] text-black font-silkscreen px-6 py-2 rounded-lg text-[1.105rem] drop-shadow-[0_0_7px_#FFFB00] hover:drop-shadow-[0_0_10px_#FFFB00] w-[212.5px]"
          >
            CREATE ROOM
          </button>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/80 scale-87 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-black border-4 border-[#FFFB00] p-8 rounded-lg w-[500px] drop-shadow-[0_0_10px_#111] text-center relative">
            <button
              className="absolute top-[-50px] left-0 bg-[#FFFB00] text-black font-silkscreen px-5 py-2 rounded-l rounded-br shadow-lg hover:scale-105 transition text-[1.1rem]"
              onClick={() => setShowModal(false)}
            >
              ← Back
            </button>
            <h2 className="text-white font-black text-[2rem] mb-4">
              Pick Language
            </h2>
            <p className="font-silkscreen text-[#FFFB00] text-[1.2rem] mb-6">
              Select one language
            </p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {Object.keys(DEFAULT_PLAYLISTS).map((lang) => (
                <button
                  key={lang}
                  onClick={() => toggleLanguage(lang)}
                  className={`py-3 px-4 rounded-lg font-silkscreen text-[1.1rem] border-[3px] transition ${
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
              className="bg-white text-black font-silkscreen px-8 py-3 rounded-lg text-[1.2rem] drop-shadow-[0_0_7px_#111] hover:drop-shadow-[0_0_10px_#111]"
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

      {showRulesModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 scale-82 flex items-center justify-center">
          <div className="relative bg-black border-4 border-[#FFFB00] p-8 rounded-lg w-[500px] drop-shadow-[0_0_10px_#111] text-center">
            <button
              className="absolute top-[-50px] left-0 bg-[#FFFB00] text-black font-silkscreen px-5 py-2 rounded-l rounded-br shadow-lg hover:scale-105 transition text-[1.1rem]"
              onClick={() => setShowRulesModal(false)}
            >
              ← Back
            </button>
            <h6 className="text-white font-bold text-[1.1rem] mb-2">
              Optional
            </h6>
            <h2 className="text-white font-black text-[2rem] mb-6">
              Upload Rules
            </h2>
            <p className="font-silkscreen text-[#FFFB00] text-[1.2rem] mb-8 leading-7">
              UPLOAD A <code className="text-white">.TXT</code> FILE WITH GAME<br />
              RULES LIKE:
              <br />– NO SHAZAM <br />– NO CHEATING <br />– NO SPAMMING <br />–
              BE RESPECTFUL
            </p>
            <label className="cursor-pointer font-silkscreen bg-[#FFFB00] text-black gap-4 px-6 py-3 rounded-lg shadow-lg hover:scale-105 transition inline-block text-[1.1rem]">
              Choose File
              <input
                type="file"
                accept=".txt"
                className="hidden"
                onChange={(e) => setRulesFile(e.target.files[0])}
              />
            </label>
            {rulesFile && (
              <div className="mt-6 group w-full flex justify-center">
                <div className="flex justify-between items-center gap-3 bg-[#111] border-[2px] border-[#FFFB00] px-5 py-3 rounded-lg font-silkscreen text-[1.1rem] text-[#FFFB00] shadow-[0_0_8px_#FFFB00] transition-all duration-300 group-hover:bg-red/0 group-hover:border-red-500 group-hover:text-red-300 group-hover:shadow-[0_0_8px_red] w-full max-w-[400px]">
                  <span className="truncate">{rulesFile.name}</span>
                  <button
                    className="ml-3 text-red-400 hover:text-red-300 hover:scale-110 transition text-[1.3rem]"
                    onClick={() => setRulesFile(null)}
                    title="Remove File"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}
            <button
              className="mt-8 bg-white text-black font-silkscreen px-8 py-3 rounded-lg text-[1.2rem] drop-shadow-[0_0_7px_#111] hover:drop-shadow-[0_0_10px_#111]"
              onClick={() => setShowRulesModal(false)}
            >
              DONE
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateRoom;


