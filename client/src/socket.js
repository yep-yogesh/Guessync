import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_SOCKET_URL || "https://guessync.onrender.com/", {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  randomizationFactor: 0.5,
  timeout: 20000,

  transports: ["websocket"],
  upgrade: false,
  forceNew: true,
  withCredentials: true,

  query: {
    clientType: "player",
    version: "1.0"
  }
});

socket
  .on("connect", () => {
    console.log("⚡ Socket connected:", socket.id);
  })
  .on("connect_error", (err) => {
    console.error("Connection error:", err.message);
    setTimeout(() => socket.connect(), 1000 + Math.random() * 2000);
  })
  .on("reconnect_attempt", (attempt) => {
    console.log(`Reconnect attempt #${attempt}`);
  })
  .on("reconnect_failed", () => {
    console.error("Reconnection failed");
  });

export default socket;