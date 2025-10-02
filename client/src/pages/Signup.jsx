import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import googleIcon from "../assets/google.svg";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
} from "firebase/auth";
import { auth, provider } from "../config/firebase";
import AvatarGrid from "../components/common/AvatarGrid";
import Navbar from "../components/common/Navbar";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateFields = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Enter your name";
    if (!email.trim()) newErrors.email = "Enter your email";
    if (!password.trim()) newErrors.password = "Enter your password";
    if (!selectedAvatar) newErrors.avatar = "Choose an avatar";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEmailSignup = async () => {
    if (!validateFields()) return;

    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, { displayName: name });
      const token = await result.user.getIdToken();

      localStorage.setItem("token", token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          name,
          uid: result.user.uid,
          avatar: selectedAvatar,
        })
      );

      window.location.href = "/landing";
    } catch (err) {
      console.error("❌ Signup failed:", err.message);
      const newErrors = {};

      if (err.code === "auth/email-already-in-use") {
        newErrors.email = "Email already in use";
      } else if (err.code === "auth/invalid-email") {
        newErrors.email = "Invalid email address";
      } else if (err.code === "auth/weak-password") {
        newErrors.password = "Password should be at least 6 characters";
      } else {
        newErrors.general = "Something went wrong. Try again.";
      }

      setErrors((prev) => ({ ...prev, ...newErrors }));
    }
  };

  const handleGoogleSignup = async () => {
    if (!selectedAvatar) {
      setErrors({ avatar: "Choose an avatar before continuing" });
      return;
    }

    try {
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();

      localStorage.setItem("token", token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          name: result.user.displayName || "Google User",
          uid: result.user.uid,
          avatar: selectedAvatar,
        })
      );

      window.location.href = "/landing";
    } catch (err) {
      console.error("Google signup failed:", err.message);
      setErrors((prev) => ({
        ...prev,
        general: "Google signup failed. Try again.",
      }));
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />
      <div className="flex flex-col lg:flex-row items-center justify-center flex-1 gap-10 px-6 py-10">
        {/* Signup Form */}
        <div className="bg-[#FFFB00] p-6 sm:p-8 rounded-xl shadow-xl text-black w-full sm:w-[320px] md:w-[380px] lg:w-[420px]">
          <h1 className="text-2xl sm:text-3xl font-black text-center mb-6 font-montserrat">
            Sign-Up
          </h1>

          {/* Name */}
          <label className="block text-xs sm:text-sm font-silkscreen mb-1">
            ENTER YOUR NAME
          </label>
          <input
            type="text"
            className={`w-full rounded px-3 py-2 mb-1 text-black bg-white border-2 transition ${
              errors.name ? "border-red-500" : "border-transparent"
            }`}
            value={name}
            placeholder="Name"
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && (
            <p className="text-red-500 text-xs font-silkscreen mb-2">
              {errors.name}
            </p>
          )}

          {/* Email */}
          <label className="block text-xs sm:text-sm font-silkscreen mb-1">
            ENTER YOUR EMAIL ADDRESS
          </label>
          <input
            type="email"
            className={`w-full rounded px-3 py-2 mb-1 text-black bg-white border-2 transition ${
              errors.email ? "border-red-500" : "border-transparent"
            }`}
            value={email}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && (
            <p className="text-red-500 text-xs font-silkscreen mb-2">
              {errors.email}
            </p>
          )}

          {/* Password */}
          <label className="block text-xs sm:text-sm font-silkscreen mb-1">
            ENTER YOUR PASSWORD
          </label>
          <input
            type="password"
            className={`w-full rounded px-3 py-2 mb-1 text-black bg-white border-2 transition ${
              errors.password ? "border-red-500" : "border-transparent"
            }`}
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && (
            <p className="text-red-500 text-xs font-silkscreen mb-2">
              {errors.password}
            </p>
          )}

          <button
            className="bg-black cursor-pointer text-white w-full py-2 rounded mb-3 font-silkscreen hover:scale-105 transition"
            onClick={handleEmailSignup}
          >
            SIGN-UP!
          </button>

          {errors.general && (
            <p className="text-red-500 text-xs text-center font-silkscreen mb-2">
              {errors.general}
            </p>
          )}

          <p className="text-sm text-center text-black font-montserrat">
            Already Have an Account?{" "}
            <span
              className="relative cursor-pointer font-semibold transition-all group hover:text-black"
              onClick={() => navigate("/login")}
            >
              Login!
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-black rounded-full transition-all duration-300 group-hover:w-full"></span>
            </span>
          </p>

          <div className="flex gap-2 mt-4">
            <button
              onClick={handleGoogleSignup}
              className="flex-1 cursor-pointer flex justify-center items-center gap-3 bg-white text-black px-4 py-3 rounded text-sm sm:text-base font-silkscreen border-2 border-transparent hover:border-black transition-all duration-200"
            >
              <img src={googleIcon} alt="G" className="w-5 h-5" />
              Sign Up With Google
            </button>
          </div>
        </div>

        {/* Avatar Picker */}
        <div className="flex flex-col items-center gap-4 w-full max-w-xl">
          <div
            className={`bg-[#FFFB00]/35 text-[#FFFB00] whitespace-nowrap w-fit px-6 sm:px-10 py-2 rounded border-2 border-[#FFFB00] shadow-[0_0_12px_#FFFB00] font-silkscreen text-base sm:text-lg text-center ${
              errors.avatar
                ? "border-red-500 text-red-500 bg-red-400/25 shadow-[0_0_12px_red]"
                : ""
            }`}
          >
            PICK YOUR AVATAR
          </div>

          <AvatarGrid
            selected={selectedAvatar}
            onSelect={(avatar) => {
              setSelectedAvatar(avatar);
              setErrors((prev) => ({ ...prev, avatar: null }));
            }}
          />

          {errors.avatar && (
            <p className="text-red-500 text-xs font-silkscreen -mt-2">
              {errors.avatar}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;