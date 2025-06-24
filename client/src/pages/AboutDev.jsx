import { useEffect, useState } from "react";
import Navbar from "../components/common/Navbar";

const AboutDev = () => {
  const [displayText, setDisplayText] = useState("");
  const fullText = "Hey, I'm Yogesh!👋";

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < fullText.length) {
        setDisplayText(fullText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 100);

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

  return (
    <div className="min-h-screen bg-black text-white font-sans relative overflow-hidden">
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-12px); }
          }
          .social-icon {
            color: #9CA3AF;
            font-size: 1.8rem;
            transition: color 0.3s;
          }
          .social-icon:hover {
            color: #FFFB00;
            text-shadow: 0 0 15px #FFFB00, 0 0 25px #FFFB00;
          }
          .typing-cursor::after {
            content: '|';
            animation: blink 1s infinite;
            margin-left: 2px;
          }
          @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
          }
          .skill-box {
            background-color: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            padding: 8px 16px;
            color: #9CA3AF;
            font-size: 0.9rem;
            font-weight: 500;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin: 4px;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
            height: 40px;
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
          }
          .skill-box:hover .skill-name {
            opacity: 0;
            transform: translateY(10px);
          }
          .skill-box:hover .skill-icon {
            opacity: 1;
          }
        `}
      </style>

      <Navbar />

      <div className="flex flex-col md:flex-row justify-center items-center gap-20 p-10 mt-7">
        <div className="relative w-[550px] h-[450px] flex justify-center items-center">
          <img
            src="/pfp.png"
            alt="Profile"
            className="w-[650px] h-[650px] object-contain rounded-full z-10"
          />
        </div>

        <div className="relative bg-[#0A0A0A] rounded-2xl border-4 border-[#FFFB00] shadow-lg px-10 py-8 w-[650px] min-h-[400px] flex flex-col justify-between">
          <div className="text-left">
            <h1 className="text-4xl font-bold text-[#FFFB00] mb-2 tracking-wide typing-cursor">{displayText}</h1>

            <h2 className="text-lg mt-2.5 text-[#ffffff] mb-3 tracking-wider flex items-center gap-1">
              <i className="fas fa-laptop-code mt-1 mr-1 text-[#FFFB00]"></i> Developer of 
              <span className="font-silkscreen ml-1 ">Gues<span className="text-[#ffffff]">sync</span></span>
            </h2>

            <p className="text-gray-300 text-sm leading-relaxed max-w-[500px]">
              I'm a full-stack developer who loves crafting playful, real-time web apps.
              Guessync was built pixel-by-pixel to bring that retro arcade magic back to life,
              blending music, fast guessing, and teamwork into pure fun. 🚀
            </p>

            <div className="mt-3 text-left">
              <h3 className="text-xl font-bold text-white mb-3 tracking-wider">My Tech Stack</h3>
              <div>
                {skills.map((skill, index) => (
                  <div key={index} className="skill-box">
                    <span className="skill-name">{skill.name}</span>
                    <i className={`skill-icon ${skill.icon}`}></i>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-5">
            <div className="flex gap-5">
              <a href="https://github.com/yep-yogesh" target="_blank" rel="noopener noreferrer" className="social-icon">
                <i className="fab fa-github"></i>
              </a>
              <a href="https://www.linkedin.com/in/yogeshwaran-m-3b19452a9/" target="_blank" rel="noopener noreferrer" className="social-icon">
                <i className="fab fa-linkedin"></i>
              </a>
              <a href="https://www.instagram.com/yogeshh.png" target="_blank" rel="noopener noreferrer" className="social-icon">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://leetcode.com/u/yogeshhhhhh/" target="_blank" rel="noopener noreferrer" className="social-icon">
                <i className="fas fa-code"></i>
              </a>
            </div>
            <a href="https://buymeacoffee.com/yogeshh" target="_blank" rel="noopener noreferrer"
              className="bg-[#FFFB00] text-black font-bold px-8 py-2 rounded-[8px] hover:bg-black hover:text-[#FFFB00] border-2 border-transparent hover:border-[#FFFB00] transition-all duration-300 text-center">
              Tip the Dev
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutDev;