import React, { useEffect, useState, useRef } from "react";
import Navbar from "../components/common/Navbar";
import { useNavigate } from "react-router-dom";
import socket from "../socket";
import sendIcon from "../assets/send.png";
import spotcon from "../assets/spotify.png";
import { auth } from "../config/firebase"; // <-- add


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
  const [showModal, setShowModal] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("");
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
    // const token = localStorage.getItem("token");
    // const user = JSON.parse(localStorage.getItem("user"));
    const currentUser = auth.currentUser;
    if (!currentUser) {
      alert("Please log in first!");
      navigate("/login");
      return;
    }

    const getToken = async (force = false) => {
      const t = await currentUser.getIdToken(force);
      localStorage.setItem("token", t); // keep localStorage in sync for other consumers
      return t;
    };

    const storedUser = JSON.parse(localStorage.getItem("user")) || {
      name: currentUser.displayName || "Player",
      uid: currentUser.uid,
      avatar: localStorage.getItem("userAvatar") || currentUser.photoURL || "/avatars/1.png",
    };
    const token = await getToken();

    let playlistId = null;
    let useSpotify = false;

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

    await sendRequest();

    async function sendRequest() {
      const payload = {
        uid: storedUser.uid,
        name: storedUser.name,
        avatar: storedUser.avatar || "https://i.imgur.com/placeholder.png",
        useSpotify,
        playlistId,
        players,
        rounds,
        duration,
        language: selectedLanguage,
        code: roomCode,
      };

      try {
        const doFetch = async (tok) =>
          fetch("https://guessync.onrender.com/api/room/create", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${tok}`,
            },
            body: JSON.stringify(payload),
          });

        let res = await doFetch(token);
        if (res.status === 401 || res.status === 403) {
          const refreshed = await getToken(true);
          res = await doFetch(refreshed);
        }

        const data = await res.json();

        if (res.ok) {
          const room = {
            code: data.code,
            hostUID: storedUser.uid,
            players: [{ uid: storedUser.uid, name: storedUser.name, avatar: storedUser.avatar }],
          };
          localStorage.setItem("room", JSON.stringify(room));
          socket.auth = { uid: storedUser.uid };
          if (socket.disconnected) socket.connect();
          socket.emit("join-room", { roomCode: data.code, user: storedUser });
          navigate("/waiting-room");
        } else {
          alert("❌ Failed to create room: " + (data.message || "Unauthorized"));
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

  // New: animated “COPIED” view support
  const [displayChars, setDisplayChars] = useState(["_", "_", "_", "_", "_", "_"]);
  const [showCopyLabel, setShowCopyLabel] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const timeoutsRef = useRef([]);

  // Helper to clear animation timers
  const clearAllTimers = () => {
    timeoutsRef.current.forEach((t) => clearTimeout(t));
    timeoutsRef.current = [];
  };

  // Letter-by-letter reveal animation
  const revealWord = (word, stepDelay = 80) => {
    const arr = Array(6).fill("_");
    setDisplayChars(arr);
    word.split("").forEach((ch, idx) => {
      const t = setTimeout(() => {
        setDisplayChars((prev) => {
          const next = [...prev];
          next[idx] = ch;
          return next;
        });
      }, idx * stepDelay);
      timeoutsRef.current.push(t);
    });
  };

  // Initialize display chars with reveal animation starting from underscores
  useEffect(() => {
    if (!roomCode) return;
    const codeStr = String(roomCode).padStart(6, "0");
    // Start with underscores and reveal digits
    setDisplayChars(Array(6).fill("_"));
    
    // Add a small delay before starting the reveal
    const initialT = setTimeout(() => {
      revealWord(codeStr, 120);
    }, 300);
    timeoutsRef.current.push(initialT);
  }, [roomCode]);

  // Copy handler with progressive underscore transition then progressive "COPIED" reveal
  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(String(roomCode));
    } catch {}
    clearAllTimers();

    // Progressive change to underscores (left to right)
    displayChars.forEach((_, idx) => {
      const t = setTimeout(() => {
        setDisplayChars((prev) => {
          const next = [...prev];
          next[idx] = "_";
          return next;
        });
      }, idx * 80);
      timeoutsRef.current.push(t);
    });

    // After all underscores are shown, progressively reveal "COPIED"
    const startCopiedReveal = setTimeout(() => {
      "COPIED".split("").forEach((ch, idx) => {
        const t = setTimeout(() => {
          setDisplayChars((prev) => {
            const next = [...prev];
            next[idx] = ch;
            return next;
          });
        }, idx * 100);
        timeoutsRef.current.push(t);
      });
    }, displayChars.length * 80 + 200);
    timeoutsRef.current.push(startCopiedReveal);

    // Revert back to original code
    const revertT = setTimeout(() => {
      const codeStr = String(roomCode).padStart(6, "0");
      // Progressive change back to underscores
      "COPIED".split("").forEach((_, idx) => {
        const t = setTimeout(() => {
          setDisplayChars((prev) => {
            const next = [...prev];
            next[idx] = "_";
            return next;
          });
        }, idx * 60);
        timeoutsRef.current.push(t);
      });
      
      // Then reveal the original code
      const finalReveal = setTimeout(() => {
        revealWord(codeStr, 80);
      }, 6 * 60 + 100);
      timeoutsRef.current.push(finalReveal);
    }, 2200);
    timeoutsRef.current.push(revertT);
  };

  const handleMouseMove = (e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    return () => clearAllTimers();
  }, []);

  return (
    <div className="bg-black min-h-screen flex flex-col text-white font-montserrat">
      {/* Sticky copy label */}
      {showCopyLabel && (
        <div
          className="fixed z-50 pointer-events-none bg-[#FFFB00] text-black px-2 py-1 rounded text-sm font-silkscreen transform -translate-x-1/2 -translate-y-8"
          style={{ left: mousePos.x, top: mousePos.y }}
        >
          Copy
        </div>
      )}

      {isCreating && <LoadingOverlay text="Creating Room..." />}
      {!isCreating && <Navbar />}

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

          {/* Code + Copy */}
          <div className="flex items-center gap-2 sm:gap-3 relative">
            {/* Per-character rendering with adjusted spacing */}
            <div className="flex items-center">
              {displayChars.map((ch, i) => (
                <span
                  key={i}
                  className="font-silkscreen text-2xl sm:text-xl md:text-2xl text-[#FFFB00] drop-shadow-[0_0_5px_#FFFB00]"
                  style={{ 
                    width: "1ch", 
                    textAlign: "center", 
                    display: "inline-block",
                    marginLeft: i === 1 ? "0.15ch" : "0" // Move "i" in COPIED slightly right
                  }}
                >
                  {ch || "_"}
                </span>
              ))}
            </div>

            {/* Paste-style copy button with hover label */}
            <button
              type="button"
              onClick={handleCopyCode}
              onMouseEnter={() => setShowCopyLabel(true)}
              onMouseLeave={() => setShowCopyLabel(false)}
              onMouseMove={handleMouseMove}
              className="p-2 rounded-md hover:bg-[#FFFB00]/10 focus:outline-none focus:ring-2 focus:ring-[#FFFB00]/40 shrink-0 flex-none transition-colors duration-200 cursor-pointer"
              aria-label="Copy room code"
              title="Copy room code"
            >
              {/* Paste/clipboard SVG */}
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                className="text-white hover:text-[#FFFB00] transition-colors duration-200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x="8" y="2" width="8" height="4" rx="1" stroke="currentColor" strokeWidth="1.5" />
                <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" stroke="currentColor" strokeWidth="1.5" />
                <path d="M9 12h6M9 16h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* Custom Controls */}
        <div className="w-full max-w-2xl mx-auto text-center mb-6 sm:mb-8">
          {/* Large screens: heading only (removed Upload Rules button) */}
          <div className="hidden lg:block mb-6">
            <h2 className="text-white font-black text-[1.53rem] drop-shadow-[0_0_5px_#111]">
              CUSTOM CONTROLS
            </h2>
          </div>

          {/* Small screens: heading (unchanged) */}
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
                  className="bg-[#FFFB00] w-10 h-10 sm:w-[51px] sm:h-[51px] font-silkscreen rounded-lg text-black text-xl sm:text-[1.53rem] drop-shadow-[0_0_7px_#FFFB00] cursor-pointer"
                  onClick={() => ctrl.set(Math.max(1, ctrl.value - 1))}
                >
                  -
                </button>
                <span className="bg-white w-10 h-10 sm:w-[51px] sm:h-[51px] text-black rounded-lg font-silkscreen text-xl sm:text-[1.53rem] drop-shadow-[0_0_7px_#fff] flex justify-center items-center">
                  {ctrl.value}
                </span>
                <button
                  className="bg-[#FFFB00] w-10 h-10 sm:w-[51px] sm:h-[51px] font-silkscreen rounded-lg text-black text-xl sm:text-[1.53rem] drop-shadow-[0_0_7px_#FFFB00] cursor-pointer"
                  onClick={() => ctrl.set(Math.min(ctrl.max, ctrl.value + 1))}
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
                  className={`duration-btn font-silkscreen px-4 py-2 sm:px-6 sm:py-2 rounded-lg border-[3px] text-sm sm:text-[17px] transition cursor-pointer ${
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
              className="font-silkscreen w-full md:w-[280px] py-3 md:py-4 rounded-lg bg-[#FFFB00] text-black text-base md:text-[1.3rem] drop-shadow-[0_0_7px_#FFFB00] hover:drop-shadow-[0_0_10px_#FFFB00] cursor-pointer"
            >
              CHOOSE LANGUAGE
            </button>
          )}

          {!selectedLanguage && !showCreateBtn && (
            <div className="relative w-full md:w-[280px] h-12 md:h-14">
              {!spotifyInputVisible ? (
                <button
                  className="w-full h-full bg-[#1ED760] text-black font-silkscreen py-2 px-4 rounded-lg text-sm md:text-[1.1rem] drop-shadow-[0_0_7px_#1ED760] hover:drop-shadow-[0_0_10px_#1ED760] flex items-center justify-center gap-2 cursor-pointer"
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
              className={`bg-[#FFFB00] text-black font-silkscreen px-6 py-3 rounded-lg text-base md:text-xl drop-shadow-[0_0_7px_#FFFB00] hover:drop-shadow-[0_0_10px_#FFFB00] w-full md:w-[240px] md:h-14 ${isCreating ? "opacity-60 cursor-not-allowed hover:drop-shadow-none" : "cursor-pointer"}`}
            >
              {isCreating ? "CREATING..." : "CREATE ROOM"}
            </button>
          )}
        </div>

        {/* Language Selection Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-black border-4 border-[#FFFB00] p-4 sm:p-6 md:p-8 rounded-lg w-full max-w-md sm:max-w-lg md:max-w-xl drop-shadow-[0_0_10px_#111] text-center relative animate-fade-in">
              <button
                className="absolute -top-3 -left-3 w-12 h-12 bg-[#FFFB00] text-black rounded-full shadow-lg hover:scale-110 hover:bg-white transition-all duration-300 flex items-center justify-center group border-2 border-black cursor-pointer"
                onClick={() => setShowModal(false)}
                aria-label="Close modal"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  className="transform group-hover:-translate-x-0.5 transition-transform duration-300"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19 12H5M12 19l-7-7 7-7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
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
                    className={`py-2 px-3 sm:py-3 sm:px-4 rounded-lg font-silkscreen text-base sm:text-[1.1rem] border-[3px] transition cursor-pointer ${
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
                className="bg-white text-black font-silkscreen px-6 py-2 sm:px-8 sm:py-3 rounded-lg text-base sm:text-[1.2rem] drop-shadow-[0_0_7px_111] hover:drop-shadow-[0_0_10px_#111] cursor-pointer"
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

        {/* Add CSS animations */}
        <style jsx>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: scale(0.95) translateY(-10px);
            }
            to {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }
          .animate-fade-in {
            animation: fadeIn 0.3s ease-out forwards;
          }
        `}</style>
        </div> 
      </div>
    // </div>
  );
};

export default CreateRoom;