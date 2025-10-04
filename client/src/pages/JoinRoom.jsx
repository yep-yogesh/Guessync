import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import socket from "../socket";

export default function JoinRoom() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [activeButton, setActiveButton] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const buttonRefs = useRef({});
  const codeDisplayRef = useRef(null);

  const handleDigit = (digit) => {
    if (code.length < 6) {
      setCode((prev) => prev + digit);
      setError("");
    }
    setActiveButton(digit);
    setTimeout(() => setActiveButton(null), 150);
  };

  const handleBackspace = () => {
    setCode((prev) => prev.slice(0, -1));
    setError("");
    setActiveButton("backspace");
    setTimeout(() => setActiveButton(null), 150);
  };

  const handleJoin = async () => {
    if (code.length !== 6) {
      setError("Please enter a 6-digit code");
      // Announce error to screen readers
      setTimeout(() => {
        const errorElement = document.getElementById("error-message");
        if (errorElement) {
          errorElement.focus();
        }
      }, 100);
      return;
    }

    setActiveButton("join");
    setIsLoading(true);
    setTimeout(() => setActiveButton(null), 150);

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

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

      if (res.ok) {
        localStorage.setItem("room", JSON.stringify(data.room));

        socket.auth = { uid: user.uid };
        if (socket.disconnected) {
          socket.connect();
        }

        socket.emit("join-room", { roomCode: code, user });

        socket.once("room-updated", () => {
          navigate("/waiting-room");
        });

        const timeout = setTimeout(() => {
          socket.off("room-updated");
          setError("Connection timeout. Please try again.");
          setIsLoading(false);
        }, 5000);

        socket.once("room-updated", () => {
          clearTimeout(timeout);
          setIsLoading(false);
        });
      } else {
        setError(data.message || "Room not found");
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Join error:", err);
      setError("Something went wrong. Try again.");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Only handle keyboard input if focus is not on a button
      if (document.activeElement?.tagName === 'BUTTON') return;
      
      if (e.key >= "0" && e.key <= "9") {
        e.preventDefault();
        handleDigit(e.key);
      } else if (e.key === "Backspace") {
        e.preventDefault();
        handleBackspace();
      } else if (e.key === "Enter") {
        e.preventDefault();
        handleJoin();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [code]);

  const handleButtonKeyDown = (e, callback) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      callback();
    }
  };

  const formatCodeDisplay = () => {
    const displayCode = code.padEnd(6, "_").split("").join(" ");
    return displayCode;
  };

  const getAriaLabel = (digit) => {
    if (digit === "backspace") return "Delete last digit";
    if (digit === "join") return isLoading ? "Joining room, please wait" : "Join room";
    return `Enter digit ${digit}`;
  };

  const getButtonActiveClass = (buttonValue) => {
    return activeButton === buttonValue.toString()
      ? "translate-x-[3px] translate-y-[3px] shadow-none"
      : "";
  };

return (
  <div className="bg-black min-h-screen text-white">
    <Navbar />
    <main className="flex justify-center items-center mt-15 lg:mt-45 sm:mt-20 md:mt-25 min-h-100vh">
      {/* The join room card */}
      <section 
        className="bg-[#FFFB00] px-8 py-6 rounded-lg scale-100 lg:scale-130 sm:scale-90 md:scale-120 border-4 border-black shadow-[0_0_60px_#FFFB00]"
        role="region"
        aria-labelledby="join-room-title"
        aria-describedby="join-room-description"
      >
        <h1 id="join-room-title" className="sr-only">Join Room</h1>
        <p id="join-room-description" className="sr-only">
          Enter a 6-digit room code to join an existing game room. Use the number pad below or your keyboard to enter the code.
        </p>
        
        <div 
          className="relative bg-gray-300 text-black text-2xl px-6 py-6 mb-1 text-center border-4 border-black w-[270px] tracking-widest font-silkscreen min-h-[75px]"
          role="region"
          aria-labelledby="code-input-label"
          aria-describedby={error ? "error-message" : "code-display-help"}
        >
          <label 
            id="code-input-label"
            className="mt-6 mb-6 absolute top-1 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 whitespace-nowrap"
          >
            Enter Room Code
          </label>
          <div 
            ref={codeDisplayRef}
            className="mt-6"
            aria-live="polite"
            aria-atomic="true"
            aria-label={`Room code: ${code.length} of 6 digits entered. Current code: ${formatCodeDisplay()}`}
          >
            {formatCodeDisplay()}
          </div>
          <div id="code-display-help" className="sr-only">
            Enter 6 digits for the room code. {6 - code.length} digits remaining.
          </div>
          {error && (
            <div 
              id="error-message"
              className="text-red-600 text-[8px] text-center mt-3"
              role="alert"
              aria-live="assertive"
              tabIndex="-1"
            >
              {error}
            </div>
          )}
        </div>

        <div 
          className="grid grid-cols-3 gap-2 mb-2"
          role="grid"
          aria-label="Number pad for entering room code"
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
            <button
              key={digit}
              ref={(el) => (buttonRefs.current[digit] = el)}
              onClick={() => handleDigit(digit.toString())}
              onKeyDown={(e) => handleButtonKeyDown(e, () => handleDigit(digit.toString()))}
              className={`bg-gray-200 text-black text-xl font-silkscreen py-5 px-0 border-4 border-black shadow-[4px_4px_0_#000] hover:bg-gray-300 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-150 ${getButtonActiveClass(
                digit
              )} w-[80px]`}
              aria-label={getAriaLabel(digit)}
              disabled={code.length >= 6}
              role="gridcell"
            >
              {digit}
            </button>
          ))}

          <button
            ref={(el) => (buttonRefs.current["0"] = el)}
            onClick={() => handleDigit("0")}
            onKeyDown={(e) => handleButtonKeyDown(e, () => handleDigit("0"))}
            className={`bg-gray-200 text-black text-xl py-5 px-0 border-4 border-black font-silkscreen shadow-[4px_4px_0_#000] hover:bg-gray-300 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-150 ${getButtonActiveClass(
              "0"
            )} w-[80px]`}
            aria-label={getAriaLabel("0")}
            disabled={code.length >= 6}
            role="gridcell"
          >
            0
          </button>

          <button
            ref={(el) => (buttonRefs.current["join"] = el)}
            onClick={handleJoin}
            onKeyDown={(e) => handleButtonKeyDown(e, handleJoin)}
            className={`w-[177px] col-span-2 bg-black text-white text-lg py-0 font-silkscreen border-4 border-black shadow-[4px_4px_0_#000] hover:bg-gray-200 hover:cursor-pointer hover:text-black focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-150 ${getButtonActiveClass(
              "join"
            )} ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
            aria-label={getAriaLabel("join")}
            disabled={code.length !== 6 || isLoading}
            role="gridcell"
          >
            {isLoading ? "JOINING..." : "JOIN 🏠"}
          </button>
        </div>

        {/* Add backspace button for better UX */}
        <div className="flex justify-center mb-4">
          <button
            ref={(el) => (buttonRefs.current["backspace"] = el)}
            onClick={handleBackspace}
            onKeyDown={(e) => handleButtonKeyDown(e, handleBackspace)}
            className={`bg-red-500 text-white text-sm font-silkscreen py-2 px-4 border-4 border-black shadow-[4px_4px_0_#000] hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-150 ${getButtonActiveClass(
              "backspace"
            )} rounded`}
            aria-label={getAriaLabel("backspace")}
            disabled={code.length === 0}
          >
            ⌫ DELETE
          </button>
        </div>

        <p className="mt-4 text-black text-sm text-center">
          No Code?{" "}
          <button
            onClick={() => navigate("/create-room")}
            onKeyDown={(e) => handleButtonKeyDown(e, () => navigate("/create-room"))}
            className="font-bold cursor-pointer relative group inline-block underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded-sm bg-transparent border-none p-0"
            aria-label="Create a new room instead"
          >
            Create A New Room 🏡
            <span 
              className="absolute left-0 -bottom-1 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full"
              aria-hidden="true"
            ></span>
          </button>
        </p>
      </section>
    </main>
  </div>
);

}
