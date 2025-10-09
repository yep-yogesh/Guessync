import React, { useEffect, useState, useRef } from "react";
import socket from "../socket";
import { useNavigate } from "react-router-dom";

const WaitingRoom = () => {
  const [players, setPlayers] = useState([]);
  const [roomCode, setRoomCode] = useState("");
  const [hostUID, setHostUID] = useState("");
  const [currentUID, setCurrentUID] = useState("");
  const [isMovingToGame, setIsMovingToGame] = useState(false);
  const navigate = useNavigate();

  // Copy tooltip state for middle section
  const [showCopyTip, setShowCopyTip] = useState(false);
  const [copyTipText, setCopyTipText] = useState("Click to copy code");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const tipTimeoutRef = useRef(null);
  const showTip = (text, ms = 0) => {
    if (tipTimeoutRef.current) clearTimeout(tipTimeoutRef.current);
    setCopyTipText(text);
    setShowCopyTip(true);
    if (ms > 0) {
      tipTimeoutRef.current = setTimeout(() => {
        setCopyTipText("Click to copy code");
        setShowCopyTip(false);
      }, ms);
    }
  };

  // Arrival glow state for new players
  const [arrivalGlow, setArrivalGlow] = useState({});
  const arrivalTimersRef = useRef({});
  const prevPlayersRef = useRef(new Set());
  const firstUpdateRef = useRef(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const roomData = JSON.parse(localStorage.getItem("room"));

    if (!user || !roomData) {
      navigate("/");
      return;
    }

    setCurrentUID(user.uid);
    setRoomCode(roomData.code);
    setHostUID(roomData.hostUID);

    const joinRoom = () => {
      socket.emit("join-room", { roomCode: roomData.code, user });
    };

    if (!socket.connected) {
      socket.once("connect", joinRoom);
      if (socket.disconnected) socket.connect();
    } else {
      joinRoom();
    }

    socket.on("room-updated", (data) => {
      const incomingSet = new Set(data.players.map((p) => p.uid));
      if (firstUpdateRef.current) {
        firstUpdateRef.current = false;
        prevPlayersRef.current = incomingSet;
        setPlayers(data.players);
        return;
      }
      // Detect new players
      const newOnes = data.players.filter((p) => !prevPlayersRef.current.has(p.uid));
      if (newOnes.length) {
        setArrivalGlow((old) => {
          const next = { ...old };
          newOnes.forEach((p) => {
            next[p.uid] = true;
            if (arrivalTimersRef.current[p.uid]) clearTimeout(arrivalTimersRef.current[p.uid]);
            arrivalTimersRef.current[p.uid] = setTimeout(() => {
              setArrivalGlow((curr) => {
                const n = { ...curr };
                delete n[p.uid];
                return n;
              });
              delete arrivalTimersRef.current[p.uid];
            }, 1200);
          });
          return next;
        });
      }
      prevPlayersRef.current = incomingSet;
      setPlayers(data.players);
    });

    socket.on("move-to-game-room", () => {
      setIsMovingToGame(true);
      setTimeout(() => navigate("/game-room"), 500);
    });

    return () => {
      socket.off("room-updated");
      socket.off("move-to-game-room");
      socket.off("connect");
      Object.values(arrivalTimersRef.current).forEach((t) => clearTimeout(t));
      arrivalTimersRef.current = {};
      if (tipTimeoutRef.current) clearTimeout(tipTimeoutRef.current);
    };
  }, [navigate]);

  const isHost = currentUID === hostUID;

  // Resolve avatar value (number, "/avatars/x.png", "3", or external URL) to a valid img src
  const getAvatarSrc = (avatar) => {
    if (!avatar) return "/avatars/1.png";
    if (typeof avatar === "number") return `/avatars/${avatar}.png`;
    if (typeof avatar === "string") {
      if (/^https?:\/\//.test(avatar)) return avatar;         // absolute URL
      if (avatar.startsWith("/avatars/")) return avatar;       // already a path
      if (/^\d+$/.test(avatar)) return `/avatars/${avatar}.png`; // numeric string
      return avatar; // fallback as-is
    }
    return "/avatars/1.png";
  };

  const handleStartGame = () => {
    socket.emit("start-game", { roomCode });
    setIsMovingToGame(true);
  };

  // Theme-matched smooth blob loading screen
  const LoadingOverlay = ({ text = "Loading..." }) => {
    const [movingBlobs, setMovingBlobs] = useState([]);
    const rafRef = useRef(null);

    useEffect(() => {
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
      animate();
      return () => rafRef.current && cancelAnimationFrame(rafRef.current);
    }, []);

    return (
      <div className="h-screen w-full bg-black text-white flex flex-col items-center justify-center font-silkscreen relative overflow-hidden">
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
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-[#FFFB00] border-t-transparent rounded-full animate-spin mb-6"></div>
          <h2 className="text-2xl font-bold">{text}</h2>
        </div>
      </div>
    );
  };

  if (isMovingToGame) {
    return <LoadingOverlay text="Starting Game..." />;
  }

  return (
    <div className="h-screen w-full bg-black text-white flex flex-col lg:flex-row overflow-hidden font-silkscreen p-2 sm:p-4 gap-2 sm:gap-3 lg:gap-4">
      {/* Floating copy tooltip */}
      {showCopyTip && (
        <div
          className="fixed z-50 pointer-events-none bg-[#FFFB00] text-black border-2 border-black px-2 py-1 rounded text-xs shadow-[0_0_10px_#FFFB00]"
          style={{ left: mousePos.x + 12, top: mousePos.y - 24 }}
        >
          {copyTipText}
        </div>
      )}

      {/* Players Section */}
      <div className="w-full lg:w-[22%] bg-[#1a1a1ab8] rounded-xl p-3 sm:p-4 lg:p-5 flex flex-col order-1 lg:order-none h-[45vh] lg:h-full overflow-hidden">
        <div className="flex-1">
          <h2 className="text-white text-base sm:text-lg lg:text-xl mb-2">Players ({players.length})</h2>
          <ul className="h-full overflow-y-auto custom-scrollbar space-y-1 sm:space-y-2 lg:space-y-3">
            {players.map((p) => (
              <li
                key={p.uid}
                className={`flex items-center gap-2 bg-[#2d2d2d58] p-2 rounded-lg transition-all duration-300 ${
                  arrivalGlow[p.uid] ? "animate-neon-punch ring-2 ring-[#FFFB00]/70 shadow-[0_0_18px_#FFFB00]" : ""
                }`}
              >
                <img
                  src={getAvatarSrc(p.avatar)}
                  alt={p.name}
                  className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 rounded-sm"
                  onError={(e) => { e.currentTarget.src = "/avatars/1.png"; }}
                />
                <span className={`text-xs sm:text-sm lg:text-base ${p.uid === currentUID ? "text-[#FFFB00]" : ""}`}>
                  {p.name}
                  {p.uid === hostUID && (
                    <i className="fa-solid fa-crown text-[#FFFB00] ml-3" aria-label="Host" title="Host" />
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {isHost && (
          <button
            onClick={handleStartGame}
            className="mt-2 sm:mt-3 lg:mt-4 py-2 sm:py-2 lg:py-3 rounded-md font-bold bg-[#FFFB00] text-black hover:brightness-110 shadow-[0_0_10px_#FFFB00] text-xs sm:text-sm lg:text-base"
          >
            START GAME
          </button>
        )}
      </div>

      {/* Main Waiting Room Section */}
      <div
        className="w-full lg:w-[56%] bg-[#1a1a1ab8] rounded-xl flex flex-col items-center justify-center order-2 lg:order-none h-[40%] lg:h-full cursor-pointer"
        onMouseEnter={() => showTip("Click to copy code")}
        onMouseLeave={() => setShowCopyTip(false)}
        onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}
        onClick={async () => {
          try {
            if (roomCode) {
              await navigator.clipboard.writeText(String(roomCode));
              showTip("Copied!", 900);
            }
          } catch {
            showTip("Copy failed", 1200);
          }
        }}
      >
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-3 sm:mb-4 text-center">Waiting Room</h1>
        <p className="text-gray-300 text-sm sm:text-base lg:text-lg mb-2 text-center px-4">
          Room Code: <span className="text-white font-mono text-base sm:text-lg lg:text-xl">{roomCode}</span>
        </p>
        {!isHost && (
          <div className="mt-3 sm:mt-4 lg:mt-6 text-[#FFFB00] text-center text-sm sm:text-base lg:text-lg px-4 flex items-center justify-center gap-2">
            <span
              className="inline-block w-4 h-4 sm:w-5 sm:h-5 border-2 border-[#FFFB00] border-t-transparent rounded-full animate-spin drop-shadow-[0_0_6px_#FFFB00]"
              aria-hidden="true"
            />
            <span>Waiting for host to start the game...</span>
          </div>
        )}
      </div>

      {/* Chat Section */}
      <div className="w-full lg:w-[22%] bg-[#1a1a1ab8] rounded-xl p-3 sm:p-4 lg:p-5 flex flex-col order-3 lg:order-none h-[30%] lg:h-full">
        <h2 className="text-white text-base sm:text-lg lg:text-xl mb-2 sm:mb-3">Chat</h2>
        <div className="flex-1 bg-[#2d2d2d58] rounded-lg p-2 sm:p-2 lg:p-3 overflow-y-auto">
          <p className="text-gray-400 italic text-xs sm:text-xs lg:text-sm">System: Waiting for game to start...</p>
        </div>
      </div>

      {/* Neon punch animation style */}
      <style>{`
        @keyframes neonPunch {
          0% { box-shadow: 0 0 0 transparent; transform: scale(0.98); background-color: rgba(255, 251, 0, 0.10); }
          40% { box-shadow: 0 0 18px #FFFB00; transform: scale(1.01); background-color: rgba(255, 251, 0, 0.14); }
          100% { box-shadow: 0 0 0 transparent; transform: scale(1); background-color: rgba(45, 45, 45, 0.35); }
        }
        .animate-neon-punch {
          animation: neonPunch 1.1s ease-out;
        }
      `}</style>
    </div>
  );
};

export default WaitingRoom;
