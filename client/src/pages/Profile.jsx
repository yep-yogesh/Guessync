import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Trophy, Gamepad2, Music, Flame, Clock, Copy, Check, History, LogOut } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/common/Navbar";
import { auth } from "../config/firebase";
import { signOut } from "firebase/auth";

const Profile = () => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);

  const handleLogout = async () => {
    try {
      // Sign out from Firebase
      await signOut(auth);
      
      // Clear localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      
      console.log("✅ User logged out successfully");
      
      // Redirect to login page
      navigate('/login');
    } catch (error) {
      console.error("❌ Logout failed:", error);
    }
  };

  const generateUserTag = (name) => {
    if (!name) return "#GUEST";
    const hash = name.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    const tag = Math.abs(hash).toString(36).toUpperCase().substring(0, 6);
    return `#${tag}`;
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!authContext) {
          console.error("AuthContext not available");
          setError("Authentication context not available");
          setLoading(false);
          return;
        }

        const { user, isGuest, guestName, guestAvatar } = authContext;

        if (isGuest && guestName) {
          setProfileData({
            name: guestName,
            avatar: guestAvatar || "/avatars/1.png",
            userTag: generateUserTag(guestName),
            stats: {
              wins: 0,
              gamesPlayed: 0,
              songsGuessed: 0,
              streak: 0,
              averageGuessTime: 0
            },
            matchHistory: []
          });
          setLoading(false);
          return;
        }

        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');

        let currentUser = user;
        if (!currentUser && storedUser) {
          try {
            currentUser = JSON.parse(storedUser);
          } catch (e) {
            console.error("Error parsing stored user:", e);
          }
        }

        if (currentUser && currentUser.uid) {
          const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

          try {
            const response = await fetch(`${apiUrl}/api/user/profile/${currentUser.uid}`, {
              headers: {
                'Authorization': `Bearer ${storedToken}`,
                'Content-Type': 'application/json'
              }
            });

            if (response.ok) {
              const data = await response.json();
              const userData = data.user;
              
              const avgTime = userData.fastestGuess ? userData.fastestGuess.toFixed(1) : 0;
              
              setProfileData({
                name: userData.name || currentUser.name,
                avatar: userData.avatar || currentUser.avatar || "/avatars/1.png",
                userTag: generateUserTag(userData.name || currentUser.name),
                stats: {
                  wins: userData.wins || 0,
                  gamesPlayed: userData.gamesPlayed || 0,
                  songsGuessed: userData.songsGuessed || 0,
                  streak: userData.streak || 0,
                  averageGuessTime: avgTime
                },
                matchHistory: (userData.matchHistory || []).sort((a, b) => new Date(b.date) - new Date(a.date))
              });
            } else {
              setProfileData({
                name: currentUser.name || "User",
                avatar: currentUser.avatar || "/avatars/1.png",
                userTag: generateUserTag(currentUser.name || "User"),
                stats: {
                  wins: 0,
                  gamesPlayed: 0,
                  songsGuessed: 0,
                  streak: 0,
                  averageGuessTime: 0
                },
                matchHistory: []
              });
            }
          } catch (apiError) {
            console.error("API call failed:", apiError);
            setProfileData({
              name: currentUser.name || "User",
              avatar: currentUser.avatar || "/avatars/1.png",
              userTag: generateUserTag(currentUser.name || "User"),
              stats: {
                wins: 0,
                gamesPlayed: 0,
                songsGuessed: 0,
                streak: 0,
                averageGuessTime: 0
              },
              matchHistory: []
            });
          }
          
          setLoading(false);
        } else {
          setTimeout(() => {
            navigate("/login");
          }, 1000);
        }
      } catch (error) {
        console.error("Error in fetchProfileData:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [navigate]);

  const handleCopyTag = () => {
    if (profileData && profileData.userTag) {
      navigator.clipboard.writeText(profileData.userTag);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
        <div className="text-[#FFFB00] text-2xl font-silkscreen animate-pulse">
          Loading Profile...
        </div>
        <div className="text-gray-400 text-sm font-montserrat">
          This should only take a moment
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
        <div className="text-red-500 text-xl font-silkscreen">
          Error: {error}
        </div>
        <button
          onClick={() => navigate("/login")}
          className="bg-[#FFFB00] text-black px-6 py-3 rounded-lg font-silkscreen hover:scale-105 transition-transform"
        >
          Go to Login
        </button>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
        <div className="text-white text-xl font-silkscreen">
          Profile not found
        </div>
        <button
          onClick={() => navigate("/login")}
          className="bg-[#FFFB00] text-black px-6 py-3 rounded-lg font-silkscreen hover:scale-105 transition-transform"
        >
          Go to Login
        </button>
      </div>
    );
  }

  const { name, avatar, userTag, stats, matchHistory } = profileData;

  return (
    <div className="min-h-screen bg-black text-white font-silkscreen">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 tracking-wider">
          PROFILE
        </h1>

        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-6">
          <div className="flex items-center gap-6">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden border-4 border-[#FFFB00] shadow-[0_0_20px_#FFFB00]">
              <img 
                src={avatar} 
                alt={name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "/avatars/1.png";
                }}
              />
            </div>
            
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">{name}</h2>
              <div 
                className="flex items-center gap-2 text-gray-400 text-lg cursor-pointer hover:text-[#FFFB00] transition-colors"
                onClick={handleCopyTag}
                title="Click to copy"
              >
                <span>{userTag}</span>
                {copied ? (
                  <Check className="w-5 h-5 text-green-500" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 justify-center md:justify-end items-center">
            <StatCard icon={<Trophy />} value={stats.wins} label="WINS" />
            <StatCard icon={<Gamepad2 />} value={stats.gamesPlayed} label="GAMES" />
            
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-montserrat">Logout</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-[#FFFB00] rounded-xl overflow-hidden">
              <div className="bg-[#FFFB00] px-6 py-4 flex items-center gap-3 border-b-4 border-black">
                <History className="w-6 h-6 text-black" />
                <h3 className="text-xl font-bold text-black">Match History</h3>
              </div>

              <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                {matchHistory.length === 0 ? (
                  <div className="text-center py-12 text-black font-montserrat">
                    <p className="text-lg">No matches played yet!</p>
                    <p className="text-sm mt-2">Start playing to build your match history</p>
                  </div>
                ) : (
                  <table className="w-full text-black">
                    <thead className="bg-[#FFFB00] sticky top-0">
                      <tr className="border-b-2 border-black">
                        <th className="px-4 py-3 text-left font-bold">S no.</th>
                        <th className="px-4 py-3 text-left font-bold">Date & Time</th>
                        <th className="px-4 py-3 text-left font-bold">Party Name</th>
                        <th className="px-4 py-3 text-left font-bold">Place</th>
                        <th className="px-4 py-3 text-left font-bold">Points</th>
                      </tr>
                    </thead>
                    <tbody>
                      {matchHistory.map((match, index) => (
                        <tr 
                          key={index}
                          className={`border-b border-black/20 hover:bg-black/10 transition-colors ${
                            index % 2 === 0 ? 'bg-[#FFFB00]' : 'bg-[#FFFB00]/80'
                          }`}
                        >
                          <td className="px-4 py-3">{index + 1}.</td>
                          <td className="px-4 py-3 font-montserrat text-sm">
                            {formatDate(match.date)}
                          </td>
                          <td className="px-4 py-3 uppercase">{match.partyName}</td>
                          <td className="px-4 py-3 font-bold">{match.place}</td>
                          <td className="px-4 py-3 font-bold">{match.points}PTS</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <StatCard 
              icon={<Music />} 
              value={stats.songsGuessed} 
              label="SONGS GUESSED"
              large 
            />
            <StatCard 
              icon={<Flame />} 
              value={stats.streak} 
              label="STREAK"
              large 
            />
            <StatCard 
              icon={<Clock />} 
              value={`${stats.averageGuessTime}s`} 
              label="AVG TIME"
              large 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, value, label, large = false }) => {
  return (
    <div className={`bg-[#FFFB00] rounded-xl p-4 flex items-center gap-4 border-2 border-black shadow-lg hover:shadow-xl transition-shadow ${
      large ? 'w-full' : 'min-w-[140px]'
    }`}>
      <div className="text-black">
        {React.cloneElement(icon, { className: "w-8 h-8" })}
      </div>
      <div className="flex-1">
        <div className="text-2xl md:text-3xl font-bold text-black">{value}</div>
        {large && (
          <div className="text-xs text-black/70 font-montserrat mt-1">{label}</div>
        )}
      </div>
    </div>
  );
};

export default Profile;