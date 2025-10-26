import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import socket from "../socket";
import { auth } from "../config/firebase"; // <-- add

export default function JoinRoom() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [activeButton, setActiveButton] = useState(null);
  const navigate = useNavigate();
  const buttonRefs = useRef({});

  // Tooltip + paste support
  const [showPasteTip, setShowPasteTip] = useState(false);
  const [pasteTip, setPasteTip] = useState({ text: "Click to paste code", type: "info" });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const tipTimeoutRef = useRef(null);

  // New: paste animation support
  const pasteTimersRef = useRef([]);
  const [pasteAnimating, setPasteAnimating] = useState(false);
  const clearPasteTimers = () => {
    pasteTimersRef.current.forEach((t) => clearTimeout(t));
    pasteTimersRef.current = [];
  };

  const clearTipTimeout = () => {
    if (tipTimeoutRef.current) clearTimeout(tipTimeoutRef.current);
    tipTimeoutRef.current = null;
  };
  const showTip = (text, type = "info", persistMs = 0) => {
    clearTipTimeout();
    setPasteTip({ text, type });
    setShowPasteTip(true);
    if (persistMs > 0) {
      tipTimeoutRef.current = setTimeout(() => {
        setPasteTip({ text: "Click to paste code", type: "info" });
        setShowPasteTip(false);
      }, persistMs);
    }
  };

  // Animate filling digits one-by-one
  const animatePaste = (target) => {
    clearPasteTimers();
    setPasteAnimating(true);
    setCode("");
    setError("");
    showTip("Code pasted", "info", 900);

    target.split("").forEach((ch, idx) => {
      const t = setTimeout(() => {
        setCode((prev) => (prev + ch).slice(0, 6));
        if (idx === target.length - 1) {
          const endT = setTimeout(() => setPasteAnimating(false), 150);
          pasteTimersRef.current.push(endT);
        }
      }, idx * 100); // 100ms per digit
      pasteTimersRef.current.push(t);
    });
  };

  const tryExtractAndAnimate = (txt) => {
    const match = (txt || "").match(/\d{6}/);
    if (match) {
      animatePaste(match[0]);
    } else {
      showTip("Paste 6-digit code", "error", 1400);
    }
  };

  const handleDisplayClick = async () => {
    try {
      const txt = await navigator.clipboard.readText();
      tryExtractAndAnimate(txt);
    } catch {
      showTip("Allow clipboard permission", "error", 1600);
    }
  };

  // Handle Ctrl/Cmd+V directly over the display
  const handleDisplayPaste = (e) => {
    e.preventDefault();
    const txt = e.clipboardData?.getData("text") || "";
    tryExtractAndAnimate(txt);
  };

  const handleDisplayMouseEnter = () => showTip("Click to paste code", "info", 0);
  const handleDisplayMouseLeave = () => {
    if (pasteTip.type !== "error") setShowPasteTip(false);
  };
  const handleDisplayMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });

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
      return;
    }

    setActiveButton("join");
    setTimeout(() => setActiveButton(null), 150);

    const currentUser = auth.currentUser;
    if (!currentUser) {
      setError("Session expired. Please log in again.");
      navigate("/login");
      return;
    }

    const getToken = async (force = false) => {
      const t = await currentUser.getIdToken(force);
      localStorage.setItem("token", t);
      return t;
    };

    const token = await getToken();
    const storedUser = JSON.parse(localStorage.getItem("user")) || {
      name: currentUser.displayName || "Player",
      uid: currentUser.uid,
      avatar: localStorage.getItem("userAvatar") || currentUser.photoURL || "/avatars/1.png",
    };

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const doFetch = async (tok) =>
        fetch(`${apiUrl}/api/room/join`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tok}`,
          },
          body: JSON.stringify({
            code,
            uid: storedUser.uid,
            name: storedUser.name,
            avatar: storedUser.avatar,
          }),
        });

      let res = await doFetch(token);
      if (res.status === 401 || res.status === 403) {
        const refreshed = await getToken(true);
        res = await doFetch(refreshed);
      }

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("room", JSON.stringify(data.room));

        socket.auth = { uid: storedUser.uid };
        if (socket.disconnected) socket.connect();

        socket.emit("join-room", { roomCode: code, user: storedUser });

        socket.once("room-updated", () => {
          navigate("/waiting-room");
        });

        const timeout = setTimeout(() => {
          socket.off("room-updated");
          setError("Connection timeout. Please try again.");
        }, 5000);

        socket.once("room-updated", () => {
          clearTimeout(timeout);
        });
      } else {
        setError(data.message || "Room not found");
      }
    } catch (err) {
      console.error("Join error:", err);
      setError("Something went wrong. Try again.");
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key >= "0" && e.key <= "9") handleDigit(e.key);
      else if (e.key === "Backspace") handleBackspace();
      else if (e.key === "Enter") handleJoin();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [code]);

  useEffect(() => {
    return () => {
      clearTipTimeout();
      clearPasteTimers();
    };
  }, []);

  const getButtonActiveClass = (buttonValue) => {
    return activeButton === buttonValue.toString()
      ? "translate-x-[3px] translate-y-[3px] shadow-none"
      : "";
  };

  return (
    <div className="bg-black min-h-screen text-white flex flex-col">
      {/* Fixed black backdrop to avoid white gaps on large screens */}
      <div className="fixed inset-0 -z-10 bg-black" aria-hidden="true" />

      {/* Floating themed tooltip following cursor */}
      {showPasteTip && (
        <div
          className={`fixed z-50 pointer-events-none px-2 py-1 rounded font-silkscreen text-xs border-2 ${
            pasteTip.type === "error"
              ? "bg-red-600 text-white border-red-300 shadow-[0_0_10px_#f87171]"
              : "bg-[#FFFB00] text-black border-black shadow-[0_0_10px_#FFFB00]"
          }`}
          style={{ left: mousePos.x + 12, top: mousePos.y - 24 }}
        >
          {pasteTip.text}
        </div>
      )}

      <Navbar />
      {/* Centered main area without extra margins; no scroll when content fits */}
      <main className="flex-1 flex items-center justify-center">
        {/* The join room card */}
        <div className="bg-[#FFFB00] px-8 py-6 rounded-lg scale-100 lg:scale-130 sm:scale-90 md:scale-120  border-4 border-black shadow-[0_0_60px_#FFFB00] -translate-y-1 md:translate-y-0">
          <div
            className={`relative bg-gray-300 text-black text-2xl px-6 py-6 mb-1 text-center border-4 border-black w-[270px] tracking-widest font-silkscreen min-h-[75px] cursor-copy transition-all duration-200 ${
              pasteAnimating ? "ring-4 ring-[#FFFB00] scale-[1.02]" : ""
            }`}
            onClick={handleDisplayClick}
            onMouseEnter={handleDisplayMouseEnter}
            onMouseLeave={handleDisplayMouseLeave}
            onMouseMove={handleDisplayMouseMove}
            onPaste={handleDisplayPaste}
            title="Click to paste room code"
            aria-label="Room code display - click to paste"
          >
            <div className="mt-3 sm:mt-6 mb-6 absolute top-1 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 whitespace-nowrap">
              Enter Room Code
            </div>
            <div className="mt-3 sm:mt-6">{code.padEnd(6, "_").split("").join(" ")}</div>

            {/* Mobile-only subtle hint inside display */}
            <div className="absolute inset-x-0 bottom-1 sm:hidden pointer-events-none text-[10px] text-black/50 font-silkscreen">
              Tap to paste code
            </div>

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
                className={`bg-gray-200 text-black text-xl font-silkscreen py-5 px-0 border-4 border-black shadow-[4px_4px_0_#000] hover:bg-gray-300 transition-all duration-150 ${getButtonActiveClass(
                  digit
                )} w-[80px] cursor-pointer`}
              >
                {digit}
              </button>
            ))}

            <button
              ref={(el) => (buttonRefs.current["0"] = el)}
              onClick={() => handleDigit("0")}
              className={`bg-gray-200 text-black text-xl py-5 px-0 border-4 border-black font-silkscreen shadow-[4px_4px_0_#000] hover:bg-gray-300 transition-all duration-150 ${getButtonActiveClass(
                "0"
              )} w-[80px] cursor-pointer`}
            >
              0
            </button>

            <button
              ref={(el) => (buttonRefs.current["join"] = el)}
              onClick={handleJoin}
              className={`w-[177px] col-span-2 bg-black text-white text-lg py-0 font-silkscreen border-4 border-black shadow-[4px_4px_0_#000] hover:bg-gray-200 hover:text-black transition-all duration-150 ${getButtonActiveClass(
                "join"
              )} cursor-pointer`}
            >
              JOIN 🏠
            </button>
          </div>

          <p className="mt-4 text-black text-sm text-center">
            No Code?{" "}
            <span
              onClick={() => navigate("/create-room")}
              className="font-bold cursor-pointer relative group inline-block"
            >
              Create A New Room 🏡
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full"></span>
            </span>
          </p>
        </div>
      </main>
    </div>
  );
}