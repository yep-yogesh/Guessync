import React, { useEffect, useState } from "react";
import socket from "../socket";
import { useNavigate } from "react-router-dom";

const WaitingRoom = () => {
  const [players, setPlayers] = useState([]);
  const [roomCode, setRoomCode] = useState("");
  const [hostUID, setHostUID] = useState("");
  const [currentUID, setCurrentUID] = useState("");
  const [isMovingToGame, setIsMovingToGame] = useState(false);
  const navigate = useNavigate();

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
    };
  }, [navigate]);

  const isHost = currentUID === hostUID;

  const handleStartGame = () => {
    socket.emit("start-game", { roomCode });
    setIsMovingToGame(true);
  };

  if (isMovingToGame) {
    return (
      <div className="h-screen w-full bg-black text-white flex flex-col items-center justify-center font-silkscreen">
        <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mb-6"></div>
        <h2 className="text-2xl font-bold">Starting Game...</h2>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-black text-white flex flex-col lg:flex-row overflow-hidden font-silkscreen p-2 sm:p-4 gap-2 sm:gap-3 lg:gap-4">
      {/* Players Section */}
      <div className="w-full lg:w-[22%] bg-[#1a1a1ab8] rounded-xl p-3 sm:p-4 lg:p-5 flex flex-col order-1 lg:order-none h-[30%] lg:h-full">
        <div className="flex-1">
          <h2 className="text-white text-base sm:text-lg lg:text-xl mb-2">Players ({players.length})</h2>
          <ul className="space-y-1 sm:space-y-2 lg:space-y-3 max-h-[80%] lg:max-h-none overflow-y-auto custom-scrollbar">
            {players.map((p) => (
              <li key={p.uid} className="flex items-center gap-2 bg-[#2d2d2d58] p-2 rounded-lg">
                <img
                  src={`/avatars/${p.avatar || 1}.png`}
                  alt={p.name}
                  className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 rounded-sm"
                />
                <span className={`text-xs sm:text-sm lg:text-base ${p.uid === currentUID ? "text-yellow-400" : ""}`}>
                  {p.name} {p.uid === hostUID && "👑"}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {isHost && (
          <button
            onClick={handleStartGame}
            className="mt-2 sm:mt-3 lg:mt-4 py-2 sm:py-2 lg:py-3 rounded-md font-bold bg-[#FFFB00] text-black hover:brightness-110 shadow-yellow-400 shadow-md text-xs sm:text-sm lg:text-base"
          >
            START GAME
          </button>
        )}
      </div>

      {/* Main Waiting Room Section */}
      <div className="w-full lg:w-[56%] bg-[#1a1a1ab8] rounded-xl flex flex-col items-center justify-center order-2 lg:order-none h-[40%] lg:h-full">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-3 sm:mb-4 text-center">Waiting Room</h1>
        <p className="text-gray-300 text-sm sm:text-base lg:text-lg mb-2 text-center px-4">
          Room Code: <span className="text-white font-mono text-base sm:text-lg lg:text-xl">{roomCode}</span>
        </p>
        {!isHost && (
          <p className="mt-3 sm:mt-4 lg:mt-6 text-yellow-400 text-center text-sm sm:text-base lg:text-lg px-4">
            ⏳ Waiting for host to start the game...
          </p>
        )}
      </div>

      {/* Chat Section */}
      <div className="w-full lg:w-[22%] bg-[#1a1a1ab8] rounded-xl p-3 sm:p-4 lg:p-5 flex flex-col order-3 lg:order-none h-[30%] lg:h-full">
        <h2 className="text-white text-base sm:text-lg lg:text-xl mb-2 sm:mb-3">Chat</h2>
        <div className="flex-1 bg-[#2d2d2d58] rounded-lg p-2 sm:p-2 lg:p-3 overflow-y-auto">
          <p className="text-gray-400 italic text-xs sm:text-xs lg:text-sm">System: Waiting for game to start...</p>
        </div>
      </div>
    </div>
  );
};

export default WaitingRoom;
