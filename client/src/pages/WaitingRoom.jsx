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
    <div className="h-screen w-full bg-black text-white flex overflow-hidden font-silkscreen p-4 gap-4">
      <div className="w-[22%] bg-[#303030] rounded-xl p-5 flex flex-col">
        <div>
          <h2 className="text-white text-xl mb-2">Players ({players.length})</h2>
          <ul className="space-y-3">
            {players.map((p) => (
              <li key={p.uid} className="flex items-center gap-2">
                <img
                  src={`/avatars/${p.avatar || 1}.png`}
                  alt={p.name}
                  className="w-6 h-6 rounded-sm"
                />
                <span className={p.uid === currentUID ? "text-yellow-400" : ""}>
                  {p.name} {p.uid === hostUID && "👑"}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {isHost && (
          <button
            onClick={handleStartGame}
            className="mt-4 py-2 rounded-md font-bold bg-[#FFFB00] text-black hover:brightness-110 shadow-yellow-400 shadow-md"
          >
            START GAME
          </button>
        )}
      </div>

      <div className="w-[56%] bg-[#303030] rounded-xl py-8 px-6 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-white mb-4">Waiting Room</h1>
        <p className="text-gray-300 text-lg mb-2">
          Room Code: <span className="text-white font-mono text-xl">{roomCode}</span>
        </p>
        {!isHost && (
          <p className="mt-6 text-yellow-400 text-center text-lg">
            ⏳ Waiting for host to start the game...
          </p>
        )}
      </div>

      <div className="w-[22%] bg-[#303030] rounded-xl p-5 flex flex-col">
        <h2 className="text-white text-xl mb-3">Chat</h2>
        <div className="h-64 bg-black/30 rounded-lg p-3 overflow-y-auto mb-3">
          <p className="text-gray-400 italic">System: Waiting for game to start...</p>
        </div>
      </div>
    </div>
  );
};

export default WaitingRoom;
