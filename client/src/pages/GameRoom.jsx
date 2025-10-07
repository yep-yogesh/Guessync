import React, { useEffect, useState, useRef } from "react";
import socket from "../socket";
import ColorThief from "colorthief";
import Navbar from "../components/common/Navbar";


const GameRoom = () => {
  const [song, setSong] = useState(null);
  const [guess, setGuess] = useState("");
  const [chat, setChat] = useState([]);
  const [round, setRound] = useState(1);
  const [timer, setTimer] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [hintRevealed, setHintRevealed] = useState({
    movie: false,
    composer: false,
    cover: false,
    aiHint: "",
  });
  const [players, setPlayers] = useState([]);
  const [voteCounts, setVoteCounts] = useState({
    movie: 0,
    composer: 0,
    ai: 0,
  });
  const [loadingNext, setLoadingNext] = useState(false);
  const [correctGuess, setCorrectGuess] = useState(false);
  const [roundEnded, setRoundEnded] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [hintsUsed, setHintsUsed] = useState({
    movie: false,
    composer: false,
    ai: false,
  });
  const [currentSongDetails, setCurrentSongDetails] = useState(null);
  const [showPlayButton, setShowPlayButton] = useState(false);
  const [isFirstRound, setIsFirstRound] = useState(true);

  const audioRef = useRef(null);
  const blobCanvasRef = useRef(null);
  const blobsRef = useRef([]);
  const animationRef = useRef(null);
  const targetColorsRef = useRef([
    [255, 251, 0],
    [78, 78, 78],
    [40, 40, 40],
    [255, 200, 0],
  ]);
  const currentColorsRef = useRef([
    [255, 251, 0],
    [78, 78, 78],
    [40, 40, 40],
    [255, 200, 0],
  ]);
  const chatEndRef = useRef(null);
  const gameStartedRef = useRef(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const room = JSON.parse(localStorage.getItem("room"));
  const roomCode = room?.code;

  class Blob {
    constructor(x, y, radius, colorIndex, speed, drift) {
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.colorIndex = colorIndex;
      this.speed = speed;
      this.angle = Math.random() * Math.PI * 2;
      this.drift = drift;
      this.alpha = 0.7 + Math.random() * 0.3;
    }

    update(canvas) {
      this.angle += this.drift;
      this.x += Math.cos(this.angle) * this.speed;
      this.y += Math.sin(this.angle) * this.speed;
      if (this.x < -this.radius) this.x = canvas.width + this.radius;
      if (this.x > canvas.width + this.radius) this.x = -this.radius;
      if (this.y < -this.radius) this.y = canvas.height + this.radius;
      if (this.y > canvas.height + this.radius) this.y = -this.radius;
    }

    draw(ctx) {
      const [r, g, b] =
        currentColorsRef.current[
          this.colorIndex % currentColorsRef.current.length
        ];
      ctx.beginPath();
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${this.alpha})`;
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const initBlobCanvas = () => {
    const canvas = blobCanvasRef.current;
    if (!canvas) return () => {};

    const ctx = canvas.getContext("2d");

    const resizeCanvas = () => {
      if (!canvas || !canvas.parentElement) return;
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    };
    resizeCanvas();

    const generateBlobs = () => {
      if (blobsRef.current.length > 0) return;

      const blobCount = 65 + Math.floor(Math.random() * 16);

      for (let i = 0; i < blobCount; i++) {
        blobsRef.current.push(
          new Blob(
            Math.random() * canvas.width,
            Math.random() * canvas.height,
            20 + Math.random() * 100,
            i % targetColorsRef.current.length,
            0.3 + Math.random() * 0.7,
            (Math.random() - 0.5) * 0.02
          )
        );
      }
    };

    const updateColors = () => {
      if (!currentColorsRef.current || !targetColorsRef.current) return;
      
      for (let i = 0; i < currentColorsRef.current.length; i++) {
        if (!currentColorsRef.current[i] || !targetColorsRef.current[i]) continue;
        
        for (let j = 0; j < 3; j++) {
          currentColorsRef.current[i][j] +=
            (targetColorsRef.current[i][j] - currentColorsRef.current[i][j]) *
            0.1;
          if (
            Math.abs(
              currentColorsRef.current[i][j] - targetColorsRef.current[i][j]
            ) < 1
          ) {
            currentColorsRef.current[i][j] = targetColorsRef.current[i][j];
          }
        }
      }
    };

    const animate = () => {
      if (!canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      updateColors();
      blobsRef.current.forEach((blob) => {
        blob.update(canvas);
        blob.draw(ctx);
      });
      animationRef.current = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      resizeCanvas();
      blobsRef.current.forEach((blob) => {
        blob.x = Math.max(
          blob.radius,
          Math.min(canvas.width - blob.radius, blob.x)
        );
        blob.y = Math.max(
          blob.radius,
          Math.min(canvas.height - blob.radius, blob.y)
        );
      });
    };

    generateBlobs();
    animate();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  };

  const extractAlbumColors = (imageUrl) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imageUrl;

    img.onload = () => {
      try {
        const colorThief = new ColorThief();
        const palette = colorThief.getPalette(img, 4);
        targetColorsRef.current = palette;
      } catch (err) {
        console.error("Color extraction failed:", err);
      }
    };

    img.onerror = () => {
      console.error("Failed to load album image");
    };
  };

  const scrollChatToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollChatToBottom();
  }, [chat]);

  const handlePlayFirstSong = () => {
    if (audioRef.current && song) {
      audioRef.current.src = `https://www.youtube.com/embed/${song.videoId}?autoplay=1&start=0&end=${timer}`;
      setShowPlayButton(false);
      setIsFirstRound(false);
    }
  };

  useEffect(() => {
    const cleanupBlobCanvas = initBlobCanvas();

    socket.on("start-round", ({ song, round, duration, players }) => {
      setSong(song);
      setCurrentSongDetails(song);
      setRound(round);
      setTimer(duration);
      setChat([]);
      setHintRevealed({
        movie: false,
        composer: false,
        cover: false,
        aiHint: "",
      });
      setVoteCounts({ movie: 0, composer: 0, ai: 0 });
      setPlayers(players || []);
      setLoadingNext(false);
      setCorrectGuess(false);
      setRoundEnded(false);
      setCountdown(3);

      if (isFirstRound) {
        setShowPlayButton(true);
      }

      if (song.cover) {
        extractAlbumColors(song.cover);
      }

      if (!gameStartedRef.current) {
        gameStartedRef.current = true;
      }
    });

    socket.on("preload-next-song", ({ song, duration }) => {
      if (audioRef.current) {
        audioRef.current.src = `https://www.youtube.com/embed/${song.videoId}?autoplay=1&start=0&end=${duration+3}`;
      }
    });

    socket.on("room-updated", ({ players, hintsUsed: serverHintsUsed }) => {
      setPlayers(players);
      if (serverHintsUsed) {
        setHintsUsed(serverHintsUsed);
      }
    });

    socket.on("new-guess", ({ user, text, correct }) => {
      setChat((prev) => [...prev, { user, text, correct }]);
    });

    socket.on("correct-guess", ({ user: guesser }) => {
      const isCurrentUser = guesser.uid === user.uid;
      setChat((prev) => [
        ...prev,
        { system: true, type: "crct-guess", text: `✅ ${guesser.name} guessed it right!` },
      ]);

      if (isCurrentUser) {
        setCorrectGuess(true);
        setHintRevealed((prev) => ({
          ...prev,
          movie: true,
          composer: true,
          cover: true,
        }));
      }
    });

    socket.on("reveal-hint", ({ hintType, aiHint }) => {
      if (hintType === "movie") {
        setHintRevealed((prev) => ({
          ...prev,
          movie: true,
          cover: true,
        }));
        setHintsUsed((prev) => ({ ...prev, movie: true }));
      } else if (hintType === "composer") {
        setHintRevealed((prev) => ({
          ...prev,
          composer: true,
        }));
        setHintsUsed((prev) => ({ ...prev, composer: true }));
      } else if (hintType === "ai" && aiHint) {
        setHintRevealed((prev) => ({
          ...prev,
          aiHint,
        }));
        setHintsUsed((prev) => ({ ...prev, ai: true }));
        setChat((prev) => [
          ...prev,
          {
            system: true,
            type: "ai-hint",
            text: (
              <span className="flex items-center gap-1">
                <img
                  src="/AI-p.png"
                  alt="AI"
                  className="w-4 h-4 inline-block"
                />
                <span>IS.AI: {aiHint}</span>
              </span>
            ),
          },
        ]);       
      }
    });

    socket.on("hint-vote-count", ({ hintType, votes }) => {
      setVoteCounts((prev) => ({ ...prev, [hintType]: votes }));
    });

    socket.on("game-over", ({ leaderboard }) => {
      setGameOver(true);
      setLeaderboard(leaderboard);
    });

    socket.on("loading-next-round", () => {
      setLoadingNext(true);
    });

    socket.on("round-ended", () => {
      setRoundEnded(true);
      setHintRevealed((prev) => ({
        ...prev,
        movie: true,
        composer: true,
        cover: true,
      }));

      let counter = 3;
      setCountdown(counter);
      const interval = setInterval(() => {
        counter -= 1;
        setCountdown(counter);
        if (counter <= 0) {
          clearInterval(interval);
        }
      }, 1000);
    });

    return () => {
      socket.off("start-round");
      socket.off("room-updated");
      socket.off("new-guess");
      socket.off("correct-guess");
      socket.off("reveal-hint");
      socket.off("hint-vote-count");
      socket.off("game-over");
      socket.off("loading-next-round");
      socket.off("round-ended");
      socket.emit("leave-room", { roomCode, user });
      cleanupBlobCanvas();
    };
  }, [roomCode, user, isFirstRound]);

  useEffect(() => {
    let interval;
    if (timer > 0 && !roundEnded) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer, roundEnded]);

  const handleGuessSubmit = (e) => {
    e.preventDefault();
    if (guess.trim() && !correctGuess && !roundEnded) {
      socket.emit("submit-guess", {
        roomCode,
        user,
        text: guess.trim(),
      });
      setGuess("");
    }
  };

  const handleVote = (type) => {
    if (!hintsUsed[type] && !roundEnded) {
      socket.emit("vote-hint", { roomCode, uid: user.uid, hintType: type });
    }
  };

  const LoadingOverlay = ({ text = "Starting Game..." }) => {
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
          <h2 className="text-2xl font-bold text-white">{text}</h2>
        </div>
      </div>
    );
  };

  if (!song) {
    return <LoadingOverlay text="Starting Game..." />;
  }

  if (gameOver) {
    return (
      <div className="h-screen bg-black text-white">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] p-4">
          <h2 className="text-3xl font-bold mb-8">Game Over!</h2>
          <div className="w-full max-w-sm sm:w-64 bg-[#1a1a1ab8] rounded-[20px] p-6 shadow-2xl">
            <h3 className="text-xl text-center sm:text-left sm:ml-5 mb-4 text-[#FFFB00] font-silkscreen glow-yellow">
              LEADERBOARD
            </h3>
            {leaderboard.map((p, i) => (
              <div key={i} className="flex justify-between mb-2 items-center">
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-[#2d2d2d69] rounded-full mr-2"></div>
                  <span className={p.uid === user.uid ? "text-[#FFFB00]" : ""}>
                    {p.name}
                  </span>
                </div>
                <span className="font-bold text-[#FFFB00]">{p.score} pts</span>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 sm:gap-10">
            <a
              href="/landing"
              className="border-2 border-[#FFFB00] text-white font-bold py-2 px-6 rounded-xl hover:scale-105 transition-transform text-center"
            >
              Go to Home
            </a>
            <a
              href="/create-room"
              className="bg-[#FFFB00] text-black font-bold py-2 px-6 rounded-xl hover:scale-105 transition-transform text-center"
            >
              Play Again
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen lg:h-screen w-screen bg-black text-white flex flex-col lg:flex-row lg:overflow-hidden font-montserrat lg:pt-5.5 p-2 lg:px-2 lg:gap-x-3">
      <div className="w-full lg:w-1/4 lg:h-full order-3 lg:order-1 bg-[#1a1a1ab8] p-4 lg:p-6 flex flex-col rounded-[20px] shadow-2xl lg:my-3 lg:overflow-hidden">
        <div className="mb-8">
          <h2 className="font-silkscreen text-[#FFFB00] text-xl mb-4 glow-yellow">
            LEADERBOARD 
          </h2>
          <div className="space-y-3 overflow-y-auto max-h-[30vh] lg:max-h-[40vh] pr-2">
            {players
              .sort((a, b) => (b.score || 0) - (a.score || 0))
              .map((p, i) => (
                <div
                  key={p.uid}
                  className="flex items-center justify-between bg-[#2d2d2d58] p-3 rounded-lg"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-[#2d2d2d69] rounded-full mr-3"></div>
                    <span
                      className={
                        p.uid === user.uid ? "text-[#FFFB00]" : "text-white"
                      }
                    >
                      {p.name}
                    </span>
                  </div>
                  <span className="text-[#FFFB00] font-bold">
                    {p.score || 0}
                  </span>
                </div>
              ))}
          </div>
        </div>

        <div className="mt-auto">
          <div className="flex items-center space-x-2 pl-3 mb-2">
            <img src="/AI.png" alt="AI Icon" className="w-6 h-6" />
            <h2 className="font-silkscreen text-[#FFFB00] text-xl glow-yellow">
              IS.AI
            </h2>
          </div>

          <div className="space-y-4 bg-[#2d2d2d58] p-4 rounded-lg shadow-inner">
            {["movie", "composer", "ai"].map((type) => {
              const icons = {
                movie: "/film.png",
                composer: "/music.png",
                ai: "/AI.png",
              };
              const labels = {
                movie: "REVEAL MOVIE NAME",
                composer: "REVEAL ARTIST NAME",
                ai: "ASK AI FOR HINT",
              };

              return (
                <button
                  key={type}
                  onClick={() => handleVote(type)}
                  disabled={hintsUsed[type] || roundEnded}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-300 text-sm lg:text-base ${
                    voteCounts[type] > 0
                      ? "bg-[#FFFB00] text-black shadow-glow-yellow"
                      : hintsUsed[type] || roundEnded
                      ? "bg-[#3d3d3d90] cursor-not-allowed opacity-50"
                      : "bg-[#3d3d3d47] hover:shadow-[0_0_10px_2px_#FFFB00]"
                  }`}
                >
                  <span className="flex items-center space-x-3">
                    <img
                      src={icons[type]}
                      alt={`${type} icon`}
                      className="w-5 h-5 object-contain"
                    />
                    <span className="text-left">{labels[type]}</span>
                  </span>
                  {voteCounts[type] > 0 && (
                    <span className="text-xs px-2 py-0.5 bg-[#ffffff] rounded-md text-black font-bold">
                      {voteCounts[type]}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="w-full lg:w-2/4 lg:h-full order-1 lg:order-2 flex flex-col rounded-[20px] items-center justify-center relative overflow-hidden my-4 lg:my-3 p-4 lg:p-0">
        <canvas
          ref={blobCanvasRef}
          className="absolute top-0 left-0 w-full h-full z-0 opacity-70 mix-blend-screen"
          style={{ filter: "blur(90px)" }}
        />

        <div className="relative z-10 w-full flex flex-col items-center">
          {showPlayButton && (
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <button
                onClick={handlePlayFirstSong}
                className="mt-[40px] bg-[#FFFB00] hover:bg-[#FFFB00CC] text-black px-4 py-2 rounded-md text-[10px] font-bold shadow-[0_0_10px_3px_rgba(255,251,0,0.4)] transition-all"
              >
                PLAY SONG
              </button>
            </div>
          )}

          <div className="bg-[#000000AA]/45 px-6 py-2 rounded-md mb-6">
            <h2 className="text-[#FFFB00] text-xl font-bold text-center">
              {roundEnded
                ? `Round Over - Next in ${countdown}s`
                : `Round ${round} - ${timer}s left`}
            </h2>
          </div>
          <div
            className={`bg-[#2D2D2D]/45 p-4 rounded-lg mb-5 transition-all duration-500 text-center ${
              roundEnded ? "" : "filter blur-md"
            }`}
          >
            <div className="flex justify-center items-center space-x-2 text-[#FFFB00]">
              <img src="/film.png" alt="Movie" className="w-4 h-4" />
              <span>
                {roundEnded ? `${song.song}` : "Hidden"}
              </span>
            </div>
          </div>

          <div className="relative mb-8 group">
            <div
              className={`absolute inset-0 transition-all rounded-md duration-500 ${
                hintRevealed.cover ? "opacity-0" : "opacity-100 blur-xl"
              }`}
            >
              <img
                src={song?.cover}
                className="w-[150px] h-[150px] lg:w-[180px] lg:h-[180px] object-cover grayscale"
                alt="Blurred cover"
              />
            </div>
            <img
              src={song?.cover}
              alt="Album cover"
              crossOrigin="anonymous"
              className={`w-[150px] h-[150px] lg:w-[180px] lg:h-[180px] object-cover shadow-2xl rounded-md transition-all duration-500 ${
                hintRevealed.cover ? "grayscale-0 blur-0" : "grayscale blur-md"
              }`}
            />
            <div className="absolute inset-0 border-2 border-white rounded-md opacity-60 pointer-events-none" />
          </div>

          <div className="w-full max-w-md space-y-3">
            <div
              className={`bg-[#2D2D2D]/45 p-4 rounded-lg transition-all duration-500 ${
                hintRevealed.movie ? "" : "filter blur-md"
              }`}
            >
              <div className="flex items-center space-x-2 text-[#FFFB00]">
                <img src="/film.png" alt="Movie" className="w-4 h-4" />
                <span>
                  {hintRevealed.movie
                    ? song.movie
                        .replace(/\s*[\--]?\s*\(.*?(original motion picture soundtrack|ost|from.*?)\)/gi, "") // remove entire (Original Motion Picture Soundtrack)
                        .replace(/\s*[\--]?\s*(original motion picture soundtrack|ost|from.*)/gi, "") // fallback for non-parentheses versions
                        .replace(/\s*\)+$/, "") // remove leftover closing parenthesis
                        .trim()
                    : "Hidden"}
                </span>
              </div>
            </div>

            <div
              className={`bg-[#2D2D2D]/45 p-4 rounded-lg transition-all duration-500 ${
                hintRevealed.composer ? "" : "filter blur-md"
              }`}
            >
              <div className="flex items-center space-x-2 text-white">
                <img src="/music.png" alt="Composer" className="w-4 h-4" />
                <span>{hintRevealed.composer ? song?.composer : "Hidden"}</span>
              </div>
            </div>
            {hintRevealed.aiHint && (
              <div className="bg-purple-900/50 p-4 rounded-lg border border-purple-400/30">
                <div className="flex items-center space-x-2 text-purple-300 italic text-sm">
                  <img src="/AI-p.png" alt="AI Hint" className="w-4 h-4" />
                  <span>{hintRevealed.aiHint}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/4 lg:h-full order-2 lg:order-3 bg-[#1a1a1ab8] p-4 lg:p-6 flex flex-col rounded-[20px] shadow-2xl lg:my-3 lg:overflow-hidden">
        <h2 className="font-silkscreen text-[#FFFB00] text-xl mb-4 border-b border-[#FFFB0030] pb-2 glow-yellow">
          GUESS — BOX
        </h2>

        <div className="flex-1 overflow-y-auto pr-2 space-y-3 mb-4 min-h-[20vh] lg:min-h-0">
          {chat.map((message, i) => (
            <div
              key={i}
              className={`p-3 rounded-lg text-sm lg:text-base ${
                message.system
                  ? message.type === "crct-guess"
                    ? "text-green-400 border border-green-400 bg-green-400/10 shadow-[0_0_10px_2px_rgba(34,197,94,0.5)]"
                    : message.type === "ai-hint"
                    ? "text-purple-300 italic bg-[#2D2D2D]"
                    : "text-gray-400 italic"
                  : message.correct
                  ? "text-green-400 bg-[#2D2D2D]"
                  : "bg-[#2D2D2D]"
              }`}
            >
              {message.system
                ? message.text
                : `${message.user?.name}: ${message.text}`}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        <form onSubmit={handleGuessSubmit} className="mt-auto">
          <input
            type="text"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            placeholder={correctGuess ? "✅ Correct!" : "Guess the song..."}
            disabled={correctGuess || roundEnded}
            className="w-full bg-[#2d2d2d58] text-white px-4 py-3 rounded-xl border-2 border-[#FFFB00] mb-3 focus:outline-none focus:ring-2 focus:ring-[#FFFB00]"
          />
          <button
            type="submit"
            disabled={correctGuess || roundEnded}
            className={`w-full bg-[#FFFB00] text-black font-bold py-3 rounded-xl transition-all ${
              correctGuess || roundEnded
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-[#FFFB00CC] shadow-glow-yellow"
            }`}
          >
            {correctGuess ? "GUESSED!" : "SUBMIT"}
          </button>
        </form>
      </div>

      <iframe
        ref={audioRef}
        width="0"
        height="0"
        allow="autoplay"
        title="YouTube Audio"
        className="hidden"
      ></iframe>
    </div>
  );
};

export default GameRoom;