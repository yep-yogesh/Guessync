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

    // update existing user (e.g. name/avatar changed)
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
