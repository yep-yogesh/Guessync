import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/common/Navbar";

const AboutDev = () => {
  const [displayText, setDisplayText] = useState("");
  const fullText = "Hey, I'm Yogesh! 👋";

  // Typing effect with loop
  useEffect(() => {
    let i = 0;
    let forward = true;
    const interval = setInterval(() => {
      setDisplayText(fullText.slice(0, i));
      if (forward) {
        if (i < fullText.length) i++;
        else forward = false;
      } else {
        if (i > 0) i--;
        else forward = true;
      }
    }, 120);
    return () => clearInterval(interval);
  }, []);

  const skills = [
    { name: "Python", icon: "fab fa-python" },
    { name: "JavaScript", icon: "fab fa-js" },
    { name: "HTML5", icon: "fab fa-html5" },
    { name: "CSS3", icon: "fab fa-css3-alt" },
    { name: "React", icon: "fab fa-react" },
    { name: "Node.js", icon: "fab fa-node-js" },
    { name: "Express.js", icon: "fas fa-server" },
    { name: "Git", icon: "fab fa-git-alt" },
    { name: "MongoDB", icon: "fas fa-database" },
    { name: "GitHub", icon: "fab fa-github" },
    { name: "Firebase", icon: "fas fa-fire" },
    { name: "Socket.io", icon: "fas fa-plug" },
    { name: "Tailwind CSS", icon: "fab fa-css3" },
  ];

  const highlights = [
    "💻 Full-Stack Developer",
    "🎵 Built retro arcade game Guessync",
    "🚀 Passionate about Real-Time Web Apps",
    "🌐 Open Source Contributor",
    "📚 Lifelong Learner",
  ];

  return (
    <div className="min-h-screen bg-black text-white font-sans relative flex flex-col overflow-y-auto">
      {/* Fixed Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row justify-center items-center gap-6 px-4 sm:px-8 lg:px-12 py-6">
        {/* Profile Image */}
        <motion.div
          className="relative flex justify-center items-center"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <img
            src="/pfp.png"
            alt="Profile picture of Yogesh"
            className="w-40 h-40 sm:w-52 sm:h-52 md:w-64 md:h-64 lg:w-[450px] lg:h-[450px] object-contain rounded-full border-4 border-[#FFFB00] shadow-lg"
          />
        </motion.div>

        {/* Info Card */}
        <motion.div
          className="bg-[#0A0A0A] rounded-2xl border-2 sm:border-4 border-[#FFFB00] shadow-lg px-5 sm:px-8 lg:px-10 py-6 sm:py-8 w-full max-w-[550px] lg:max-w-[700px] flex flex-col justify-between"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Typing Header */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#FFFB00] mb-3 tracking-wide typing-cursor">
            {displayText}
          </h1>

          {/* Bio */}
          <p className="text-gray-300 text-sm sm:text-base lg:text-lg leading-relaxed mb-4">
            I'm a <strong>full-stack developer</strong> who loves crafting playful, interactive, and real-time web applications.  
            I built <span className="text-[#FFFB00] font-bold">Guessync</span> to combine retro arcade vibes, music, and fast-paced teamwork into a fun experience.  
            I also contribute to open-source projects and constantly explore new technologies.
          </p>

          {/* Highlights */}
          <ul className="list-disc list-inside text-gray-400 mb-4 space-y-1">
            {highlights.map((item, idx) => (
              <li key={idx} className="hover:text-[#FFFB00] transition-colors">{item}</li>
            ))}
          </ul>

          {/* Skills */}
          <div className="mt-4">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-3 tracking-wider">Tech Stack</h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <motion.div
                  key={index}
                  className="skill-box relative cursor-pointer bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 flex items-center justify-center overflow-hidden"
                  whileHover={{ scale: 1.05, boxShadow: "0 0 15px #FFFB00" }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="skill-name z-10 text-gray-300">{skill.name}</span>
                  <i className={`skill-icon ${skill.icon} absolute text-2xl text-[#FFFB00] opacity-0 transition-opacity duration-300`}></i>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Social + CTA */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
            <div className="flex gap-4">
              <a href="https://yogeshwaran-manivannan.netlify.app/" target="_blank" rel="noopener noreferrer" className="social-icon text-gray-400 text-2xl transition-colors hover:text-[#FFFB00] hover:shadow-lg">
                <i className="fas fa-globe"></i>
              </a>
              <a href="https://github.com/yep-yogesh" target="_blank" rel="noopener noreferrer" className="social-icon text-gray-400 text-2xl transition-colors hover:text-[#FFFB00] hover:shadow-lg">
                <i className="fab fa-github"></i>
              </a>
              <a href="https://www.linkedin.com/in/yogeshwaran-m-3b19452a9/" target="_blank" rel="noopener noreferrer" className="social-icon text-gray-400 text-2xl transition-colors hover:text-[#FFFB00] hover:shadow-lg">
                <i className="fab fa-linkedin"></i>
              </a>
              <a href="https://www.instagram.com/wtfisyogesh" target="_blank" rel="noopener noreferrer" className="social-icon text-gray-400 text-2xl transition-colors hover:text-[#FFFB00] hover:shadow-lg">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://leetcode.com/u/yogeshhhhhh/" target="_blank" rel="noopener noreferrer" className="social-icon text-gray-400 text-2xl transition-colors hover:text-[#FFFB00] hover:shadow-lg">
                <i className="fas fa-code"></i>
              </a>
            </div>

            <div className="flex gap-3 flex-wrap sm:flex-nowrap mt-3 sm:mt-0">
              <a
                href="https://buymeacoffee.com/yogeshh"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#FFFB00] text-black font-bold px-6 py-2 rounded-lg hover:bg-black hover:text-[#FFFB00] border-2 border-transparent hover:border-[#FFFB00] transition-all duration-300 text-center"
              >
                Tip the Dev
              </a>
              <a
                href="/Yogesh_Resume.pdf"
                download
                className="bg-transparent text-[#FFFB00] font-bold px-6 py-2 rounded-lg border-2 border-[#FFFB00] hover:bg-[#FFFB00] hover:text-black transition-all duration-300 text-center"
              >
                Download Resume
              </a>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Inline Styles for skill icon hover */}
      <style>{`
        .skill-box:hover .skill-name { opacity: 0; transform: translateY(10px); transition: all 0.3s; }
        .skill-box:hover .skill-icon { opacity: 1; transform: translateY(0); transition: all 0.3s; }
        .typing-cursor::after { content: '|'; animation: blink 1s infinite; margin-left: 2px; }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
      `}</style>
    </div>
  );
};

export default AboutDev;
