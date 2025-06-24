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
                setLetters(prev => {
                  const newLetters = [...prev];
                  newLetters[index] = getRandomChar();
                  return newLetters;
                });
              }, i * (spinDuration / framesPerLetter))
            );
          }

          timeoutIds.push(
            setTimeout(() => {
              setLetters(prev => {
                const newLetters = [...prev];
                newLetters[index] = targetLetter;
                return newLetters;
              });
            }, spinDuration)
          );
        }, index * letterDelay)
      );
    });

    return () => timeoutIds.forEach(id => clearTimeout(id));
  }, []);

  useEffect(() => {
    const generateMovingBlobs = () => {
      const newBlobs = [];
      const colors = ["#FFFB00"];
      const numBlobs = Math.floor(Math.random() * 80) + 30;

      for (let i = 0; i < numBlobs; i++) {
        const size = Math.random() * 80 + 110;
        const speedX = (Math.random() * 2 - 1) * 10.6;
        const speedY = (Math.random() * 2 - 1) * 10.5;
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
      setMovingBlobs(prevBlobs =>
        prevBlobs.map(blob => {
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
    transform: 'translate(-50%, -50%) scale(1)',
    filter: 'blur(120px)',
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
    <div className="relative w-full h-screen overflow-hidden bg-black text-white flex flex-col justify-center items-center px-4" ref={containerRef}>
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
          }
          .skill-name {
            transition: all 0.3s ease;
            z-index: 1;
          }
          .skill-icon {
            position: absolute;
            font-size: 1.2rem;
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

          .glow-btn {
            transition: all 0.3s ease;
          }
          .glow-btn:hover {
            box-shadow: 0 0 8px #FFFB00, 0 0 16px #FFFB00;
            transform: scale(1.05);
          }

          .moving-blob {
            position: absolute;
            border-radius: 50%;
            filter: blur(60px);
          }
        `}
      </style>

      <div ref={blobRef} style={blobStyle} className="absolute" />

      {movingBlobs.map(blob => (
        <div
          key={blob.id}
          className="moving-blob"
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

      <div className="z-10 text-center space-y-6 w-full">
        <div className="flex items-center justify-center gap-1">
          <img src="/logo.png" alt="logo" className="w-25 h-25 mt-7" />
          <h1 className="text-8xl font-silkscreen text-white">
            {letters.map((letter, index) => (
              <span
                key={index}
                className={`transition-all duration-100 ${
                  index >= 4 ? "text-[#FFFB00] drop-shadow-[0_0_5px_#FFFB00]" : ""
                }`}
              >
                {letter}
              </span>
            ))}
          </h1>
        </div>

        <p className="text-lg text-white max-w-lg mx-auto leading-relaxed">
          Fast-paced multiplayer music guessing game.
          Play with friends, guess songs in seconds, and race to the top of the leaderboard.
        </p>

        <div className="flex flex-wrap justify-center items-center gap-3 mt-4">
          <div className="skill-box">
            <span className="skill-name">Listen</span>
            <FontAwesomeIcon icon={faEarListen} className="skill-icon" />
          </div>
          <div className="skill-box">
            <span className="skill-name">Guess</span>
            <FontAwesomeIcon icon={faBolt} className="skill-icon" />
          </div>
          <div className="skill-box">
            <span className="skill-name tex">Win</span>
            <FontAwesomeIcon icon={faTrophy} className="skill-icon" />
          </div>
        </div>

        <div className="flex justify-center items-center w-full mt-10">
          <button
            onClick={() => navigate("/login")}
            className="glow-btn flex items-center gap-7 bg-[#FFFB00] text-black px-8 py-3 mr-2 rounded-lg font-silkscreen text-2xl"
          >
            <FontAwesomeIcon icon={faRightToBracket} size="lg" />
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;