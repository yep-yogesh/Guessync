import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../config/firebase";

const Profile = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const getToken = async () => {
      const user = auth.currentUser;
      if (user) {
        const token = await user.getIdToken(true);
        console.log("🔥 Firebase ID Token:", token);
      } else {
        console.warn("⚠️ No user is logged in.");
      }
    };

    getToken();
  }, []);

  return (
    <div><h1>YET TO DO</h1></div>
  );
};

export default Profile;
