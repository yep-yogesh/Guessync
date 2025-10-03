import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthProvider from "./context/AuthContext";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CreateRoom from './pages/CreateRoom';
import JoinRoom from "./pages/JoinRoom";
import WaitingRoom from "./pages/WaitingRoom";
import GameRoom from "./pages/GameRoom";
import Profile from "./pages/Profile";
import HowToPlay from "./pages/HowToPlay";
import HomePage from './pages/HomePage';
import AboutDev from './pages/AboutDev';

function App() {
  return (
    <AuthProvider>
      <Router>
        <InnerApp /> 
      </Router>
    </AuthProvider>
  );
}

// 👇 ADD this
function InnerApp() {

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/waiting-room" element={<WaitingRoom />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/create-room" element={<CreateRoom />} />
      <Route path="/join-room" element={<JoinRoom />} />
      <Route path="/game-room" element={<GameRoom />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/how-to-play" element={<HowToPlay />} />
      <Route path="/about" element={<AboutDev />} />
    </Routes>
  );
}

export default App;
