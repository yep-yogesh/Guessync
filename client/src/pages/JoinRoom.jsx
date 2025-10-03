import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import socket from "../socket";

export default function JoinRoom() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeButton, setActiveButton] = useState(null);
  const navigate = useNavigate();
  const buttonRefs = useRef({});
  const timeoutRef = useRef(null);

  const handleDigit = useCallback(
    (digit) => {
      if (code.length < 6) {
        setCode((prev) => {
          const newCode = prev + digit;
          // Clear error when user starts typing
          if (error) setError("");
          return newCode;
        });
      }
      setActiveButton(digit);
      setTimeout(() => setActiveButton(null), 150);
    },
    [code, error]
  );

  const handleBackspace = useCallback(() => {
    setCode((prev) => {
      const newCode = prev.slice(0, -1);
      // Clear error when user starts typing
      if (error) setError("");
      return newCode;
    });
    setActiveButton("backspace");
    setTimeout(() => setActiveButton(null), 150);
  }, [error]);

  const handleRoomUpdate = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsLoading(false);
    navigate("/waiting-room");
  }, [navigate]);

  const handleJoin = useCallback(
    async () => {
      if (code.length !== 6) {
        setError("Please enter a 6-digit code");
        return;
      }

      const user = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");

      if (!user || !token) {
        setError("Please sign in first");
        navigate("/login");
        return;
      }

      setIsLoading(true);
      setActiveButton("join");
      setTimeout(() => setActiveButton(null), 150);

      try {
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

        const res = await fetch("https://guessync.onrender.com/api/room/join", {
          method: "POST",
          headers,
          body: JSON.stringify({
            code,
            uid: user.uid,
            name: user.name,
            avatar: user.avatar,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to join room");
        }

        localStorage.setItem("room", JSON.stringify(data.room));
        socket.auth = { uid: user.uid };

        if (socket.disconnected) {
          socket.connect();
        }

        socket.emit("join-room", { roomCode: code, user });
        socket.once("room-updated", handleRoomUpdate);

        // Set timeout for room update
        timeoutRef.current = setTimeout(() => {
          socket.off("room-updated", handleRoomUpdate);
          setError("Connection timeout. Please try again.");
          setIsLoading(false);
          timeoutRef.current = null;
        }, 10000);

      } catch (err) {
        console.error("Join error:", err);
        setError(err.message || "Something went wrong. Please try again.");
        setIsLoading(false);
      }
    },
    [code, navigate, handleRoomUpdate]
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key >= "0" && e.key <= "9") handleDigit(e.key);
      else if (e.key === "Backspace") handleBackspace();
      else if (e.key === "Enter" && !isLoading) handleJoin();
    };

    window.addEventListener("keydown", handleKeyDown);
    
    // Cleanup function
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      socket.off("room-updated", handleRoomUpdate);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [handleJoin, isLoading]);

  const getButtonActiveClass = (buttonValue) => {
    return activeButton === buttonValue.toString()
      ? "translate-x-[3px] translate-y-[3px] shadow-none"
      : "";
  };

  return (
    <div className="bg-black min-h-screen text-white">
      <Navbar />
      <div className="flex justify-center items-center mt-15 lg:mt-45 sm:mt-20 md:mt-25 min-h-100vh">
        <div className="bg-[#FFFB00] px-8 py-6 rounded-lg scale-100 lg:scale-130 sm:scale-90 md:scale-120 border-4 border-black shadow-[0_0_60px_#FFFB00]">
          <div className="relative bg-gray-300 text-black text-2xl px-6 py-6 mb-1 text-center border-4 border-black w-[270px] tracking-widest font-silkscreen min-h-[75px]">
            <div className="mt-6 mb-6 absolute top-1 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 whitespace-nowrap">
              Enter Room Code
            </div>
            <div className="mt-6">{code.padEnd(6, "_").split("").join(" ")}</div>
            {error && (
              <div className="text-red-600 text-[8px] text-center mt-3">{error}</div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2 mb-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
              <button
                key={digit}
                ref={(el) => (buttonRefs.current[digit] = el)}
                onClick={() => handleDigit(digit.toString())}
                disabled={isLoading}
                className={`bg-gray-200 text-black text-xl font-silkscreen py-5 px-0 border-4 border-black shadow-[4px_4px_0_#000] hover:bg-gray-300 transition-all duration-150 ${getButtonActiveClass(
                  digit
                )} w-[80px] disabled:opacity-50`}
              >
                {digit}
              </button>
            ))}

            <button
              ref={(el) => (buttonRefs.current["0"] = el)}
              onClick={() => handleDigit("0")}
              disabled={isLoading}
              className={`bg-gray-200 text-black text-xl py-5 px-0 border-4 border-black font-silkscreen shadow-[4px_4px_0_#000] hover:bg-gray-300 transition-all duration-150 ${getButtonActiveClass(
                "0"
              )} w-[80px] disabled:opacity-50`}
            >
              0
            </button>

            <button
              ref={(el) => (buttonRefs.current["join"] = el)}
              onClick={handleJoin}
              disabled={isLoading}
              className={`w-[177px] col-span-2 bg-black text-white text-lg py-0 font-silkscreen border-4 border-black shadow-[4px_4px_0_#000] hover:bg-gray-200 hover:cursor-pointer hover:text-black transition-all duration-150 ${getButtonActiveClass(
                "join"
              )} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isLoading ? 'JOINING...' : 'JOIN 🏠'}
            </button>
          </div>

          <p className="mt-4 text-black text-sm text-center">
            No Code?{" "}
            <span
              onClick={() => !isLoading && navigate("/create-room")}
              className={`font-bold ${!isLoading ? 'cursor-pointer' : 'opacity-50'} relative group inline-block`}
            >
              Create A New Room 🏡
              {!isLoading && <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full"></span>}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}