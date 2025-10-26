import User from '../models/User.js';

export const createOrUpdateUser = async (req, res) => {
  const { uid, name, avatar } = req.body;

  try {
    let user = await User.findOne({ uid });

    if (!user) {
      user = new User({ uid, name, avatar });
      await user.save();
      return res.status(201).json({ message: "User created", user });
    }

    // Update existing user (e.g. name/avatar changed)
    user.name = name;
    user.avatar = avatar;
    await user.save();

    res.json({ message: "User updated", user });
  } catch (err) {
    console.error("createOrUpdateUser error:", err);
    res.status(500).json({ message: "Error saving user" });
  }
};

export const getUserProfile = async (req, res) => {
  const { uid } = req.params;

  try {
    const user = await User.findOne({ uid });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user });
  } catch (err) {
    console.error("getUserProfile error:", err);
    res.status(500).json({ message: "Error fetching user" });
  }
};

// Save match result after game ends
export const saveMatchResult = async (req, res) => {
  const { uid, partyName, place, points } = req.body;

  try {
    if (!uid || !partyName || !place || points === undefined) {
      return res.status(400).json({ 
        message: "Missing required fields: uid, partyName, place, points" 
      });
    }

    let user = await User.findOne({ uid });

    if (!user) {
      // Create user if doesn't exist
      user = new User({ uid, name: "User", avatar: "/avatars/1.png" });
    }

    // Add match to history
    user.matchHistory.push({
      date: new Date(),
      partyName,
      place: String(place).toUpperCase(),
      points: Number(points)
    });

    // Update statistics
    user.gamesPlayed = (user.gamesPlayed || 0) + 1;
    
    // Update wins if they placed 1st
    if (String(place).toUpperCase() === "1ST") {
      user.wins = (user.wins || 0) + 1;
      user.streak = (user.streak || 0) + 1;
    } else {
      user.streak = 0; // Reset streak on non-win
    }

    // Update best streak if current streak is higher
    if (user.streak > (user.bestStreak || 0)) {
      user.bestStreak = user.streak;
    }

    await user.save();

    res.status(200).json({ 
      message: "Match result saved", 
      user,
      stats: {
        wins: user.wins,
        gamesPlayed: user.gamesPlayed,
        streak: user.streak,
        matchHistory: user.matchHistory
      }
    });
  } catch (err) {
    console.error("saveMatchResult error:", err);
    res.status(500).json({ message: "Error saving match result" });
  }
};

// Update songs guessed count
export const updateSongsGuessed = async (req, res) => {
  const { uid, count } = req.body;

  try {
    if (!uid || count === undefined) {
      return res.status(400).json({ 
        message: "Missing required fields: uid, count" 
      });
    }

    let user = await User.findOne({ uid });

    if (!user) {
      user = new User({ uid, name: "User", avatar: "/avatars/1.png" });
    }

    user.songsGuessed = (user.songsGuessed || 0) + Number(count);
    await user.save();

    res.status(200).json({ 
      message: "Songs guessed updated", 
      songsGuessed: user.songsGuessed 
    });
  } catch (err) {
    console.error("updateSongsGuessed error:", err);
    res.status(500).json({ message: "Error updating songs guessed" });
  }
};

// Update average guess time
export const updateAverageGuessTime = async (req, res) => {
  const { uid, guessTime } = req.body;

  try {
    if (!uid || guessTime === undefined) {
      return res.status(400).json({ 
        message: "Missing required fields: uid, guessTime" 
      });
    }

    let user = await User.findOne({ uid });

    if (!user) {
      user = new User({ uid, name: "User", avatar: "/avatars/1.png" });
    }

    // Calculate new average
    const currentAvg = user.fastestGuess || 0;
    const gamesCount = user.gamesPlayed || 1;
    user.fastestGuess = (currentAvg * (gamesCount - 1) + guessTime) / gamesCount;

    await user.save();

    res.status(200).json({ 
      message: "Average guess time updated", 
      fastestGuess: user.fastestGuess 
    });
  } catch (err) {
    console.error("updateAverageGuessTime error:", err);
    res.status(500).json({ message: "Error updating guess time" });
  }
};