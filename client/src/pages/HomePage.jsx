import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRightToBracket,
  faEarListen,
  faBolt,
  faTrophy,
} from "@fortawesome/free-solid-svg-icons";

const HomePage = () => {
  const navigate = useNavigate();
  const blobRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  });
  const [letters, setLetters] = useState(Array(8).fill(""));
  const targetWord = "GUESSYNC";
  const [movingBlobs, setMovingBlobs] = useState([]);
  const containerRef = useRef(null);

  const getRandomChar = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    return chars.charAt(Math.floor(Math.random() * chars.length));
  };

  // Title letters spin animation
  useEffect(() => {
    const spinDuration = 2000;
    const letterDelay = 200;
    const framesPerLetter = 15;
    let timeoutIds = [];

    targetWord.split("").forEach((targetLetter, index) => {
      timeoutIds.push(
        setTimeout(() => {
          for (let i = 0; i < framesPerLetter; i++) {
            timeoutIds.push(
              setTimeout(() => {
                setLetters((prev) => {
                  const newLetters = [...prev];
                  newLetters[index] = getRandomChar();
                  return newLetters;
                });
              }, i * (spinDuration / framesPerLetter))
            );
          }

          timeoutIds.push(
            setTimeout(() => {
              setLetters((prev) => {
                const newLetters = [...prev];
                newLetters[index] = targetLetter;
                return newLetters;
              });
            }, spinDuration)
          );
        }, index * letterDelay)
      );
    });

    return () => timeoutIds.forEach((id) => clearTimeout(id));
  }, []);

  // Moving background blobs
  useEffect(() => {
    const generateMovingBlobs = () => {
      const newBlobs = [];
      const colors = ["#FFFB00"];
      const numBlobs = Math.floor(Math.random() * 40) + 20;

      for (let i = 0; i < numBlobs; i++) {
        const size = Math.random() * 60 + 80;
        const speedX = (Math.random() * 2 - 1) * 6.5;
        const speedY = (Math.random() * 2 - 1) * 6.5;
        const initialX = Math.random() * (window.innerWidth - size);
        const initialY = Math.random() * (window.innerHeight - size);
        const opacity = Math.random() * 0.05 + 0.07;

        newBlobs.push({
          id: i,
          size,
          x: initialX,
          y: initialY,
          color: colors[0],
          opacity,
          speedX,
          speedY,
        });
      }
      setMovingBlobs(newBlobs);
    };

    generateMovingBlobs();

    const animateBlobs = () => {
      setMovingBlobs((prevBlobs) =>
        prevBlobs.map((blob) => {
          let newX = blob.x + blob.speedX;
          let newY = blob.y + blob.speedY;

          if (newX < 0 || newX > window.innerWidth - blob.size) {
            blob.speedX *= -1;
            newX = blob.x + blob.speedX;
          }
          if (newY < 0 || newY > window.innerHeight - blob.size) {
            blob.speedY *= -1;
            newY = blob.y + blob.speedY;
          }

          return { ...blob, x: newX, y: newY };
        })
      );
      requestAnimationFrame(animateBlobs);
    };

    animateBlobs();
  }, []);

  // Mouse-follow blob
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const blobStyle = {
    top: `${mousePosition.y - 150}px`,
    left: `${mousePosition.x - 150}px`,
    transform: "translate(-50%, -50%) scale(1)",
    filter: "blur(120px)",
    opacity: 0.26,
    zIndex: 0,
    position: "absolute",
    width: "400px",
    height: "400px",
    borderRadius: "50%",
    backgroundColor: "#FFFB00",
    pointerEvents: "none",
    animation: "morph 8s infinite alternate ease-in-out",
  };

  return (
    <div
      className="relative w-full h-screen overflow-hidden bg-black text-white flex flex-col justify-center items-center px-4 sm:px-6 md:px-10"
      ref={containerRef}
    >
      <style>
        {`
          @keyframes morph {
            0%, 100% {
              border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
            }
            30% {
              border-radius: 30% 70% 40% 60% / 50% 60% 30% 40%;
            }
            60% {
              border-radius: 70% 30% 60% 40% / 30% 70% 40% 60%;
            }
            80% {
              border-radius: 40% 60% 70% 30% / 40% 30% 50% 70%;
            }
          }

          .letter-glow {
            transition: all 0.1s;
          }
          .letter-glow:nth-child(n) {
            text-shadow: 0 0 8px #FFFB00, 0 0 15px #FFFB00;
          }

          .glow-btn {
            transition: all 0.3s ease-in-out;
          }
          .glow-btn:hover {
            box-shadow: 0 0 15px #FFFB00, 0 0 30px #FFFB00;
            transform: scale(1.05);
          }

          /* Skill-box animations */
          .skill-box {
            background-color: rgba(255, 255, 255, 0.09);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            padding: 8px 16px;
            font-size: 1rem;
            font-weight: 500;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin: 8px;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
            height: 48px;
            width: 120px;
            cursor: pointer;
          }
          .skill-name {
            transition: all 0.3s ease;
            z-index: 1;
          }
          .skill-icon {
            position: absolute;
            font-size: 1.4rem;
            color: black;
            opacity: 0;
            transition: all 0.3s ease;
            z-index: 2;
          }
          .skill-box:hover {
            background-color: #FFFB00;
            border-color: #FFFB00;
            box-shadow: 0 0 10px #FFFB00, 0 0 20px #FFFB00;
            transform: translateY(-2px);
            color: black;
          }
          .skill-box:hover .skill-name {
            opacity: 0;
            transform: translateY(10px);
          }
          .skill-box:hover .skill-icon {
            opacity: 1;
          }
          @media (max-width: 768px) {
            .hover-trigger {
              background-color: #FFFB00 !important;
              border-color: #FFFB00 !important;
              box-shadow: 0 0 10px #FFFB00, 0 0 20px #FFFB00 !important;
              transform: translateY(-2px);
              color: black !important;
            }
            .hover-trigger .skill-name {
              opacity: 0 !important;
              transform: translateY(10px) !important;
            }
            .hover-trigger .skill-icon {
              opacity: 1 !important;
            }
          }
        `}
      </style>

      {/* Mouse-follow blob */}
      <div ref={blobRef} style={blobStyle} className="absolute" />

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

      {/* Main Content */}
      <div className="z-10 text-center space-y-6 w-full">
        {/* Logo + Title */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
          <img
            src="/logo.png"
            alt="logo"
            className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mt-4 sm:mt-6 animate-bounce"
          />
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-silkscreen text-white">
            {letters.map((letter, index) => (
              <span
                key={index}
                className={`letter-glow ${
                  index >= 4
                    ? "text-[#FFFB00] drop-shadow-[0_0_5px_#FFFB00]"
                    : ""
                }`}
              >
                {letter}
              </span>
            ))}
          </h1>
        </div>

        {/* Tagline */}
        <p className="text-base sm:text-lg md:text-xl text-white max-w-md sm:max-w-lg md:max-w-2xl mx-auto leading-relaxed px-2 animate-fadeIn">
          Fast-paced multiplayer music guessing game.
          <br className="hidden sm:block" />
          Play with friends, guess songs in seconds, and race to the top of the leaderboard.
        </p>

        {/* Skills */}
        <div className="flex flex-wrap justify-center items-center gap-3 mt-4 animate-fadeIn">
          <div className="skill-box hover-trigger">
            <span className="skill-name">Listen</span>
            <FontAwesomeIcon icon={faEarListen} className="skill-icon" />
          </div>
          <div className="skill-box hover-trigger">
            <span className="skill-name">Guess</span>
            <FontAwesomeIcon icon={faBolt} className="skill-icon" />
          </div>
          <div className="skill-box hover-trigger">
            <span className="skill-name">Win</span>
            <FontAwesomeIcon icon={faTrophy} className="skill-icon" />
          </div>
        </div>

        {/* Login Button */}
        <div className="flex justify-center items-center w-full mt-8 sm:mt-10 animate-fadeIn">
          <button
            onClick={() => navigate("/login")}
            className="glow-btn flex items-center gap-4 sm:gap-6 bg-[#FFFB00] text-black px-6 sm:px-8 md:px-10 py-2 sm:py-3 rounded-lg font-silkscreen text-lg sm:text-xl md:text-2xl"
          >
            <FontAwesomeIcon icon={faRightToBracket} size="lg" />
            Login
          </button>
        </div>
      </div>

      {/* Fade-in animation */}
      <style>{`
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(10px);}
          100% { opacity: 1; transform: translateY(0);}
        }
        .animate-fadeIn {
          animation: fadeIn 1s ease forwards;
        }
      `}</style>
    </div>
  );
};

export default HomePage;
