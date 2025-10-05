// Added by Reshma - How To Play Page
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { useEffect, useState } from "react";

const HowToPlay = () => {
  const [visibleSteps, setVisibleSteps] = useState([]);

  useEffect(() => {
    // Staggered animation for steps
    const timeouts = [];
    [0, 1, 2].forEach((index) => {
      timeouts.push(
        setTimeout(() => {
          setVisibleSteps(prev => [...prev, index]);
        }, index * 300)
      );
    });

    return () => timeouts.forEach(clearTimeout);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden flex flex-col">
      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(40px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes float {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-3px);
            }
          }

          .step-container {
            opacity: 0;
            animation: fadeInUp 0.8s ease-out forwards;
          }

          .step-number {
            transition: all 0.3s ease;
          }

          .step-number:hover {
            transform: scale(1.05);
            box-shadow: 0 0 35px #FFFB00;
          }

          .step-icon {
            transition: all 0.3s ease;
            animation: float 4s ease-in-out infinite;
          }

          .step-icon:hover {
            transform: scale(1.05) translateY(-2px);
            filter: brightness(1.2);
          }

          .connector-line {
            transition: all 0.3s ease;
          }

          .connector-line:hover {
            transform: scale(1.02);
            filter: brightness(1.2);
          }

          .step-content {
            transition: all 0.3s ease;
          }

          .step-content:hover {
            transform: translateY(-1px);
          }

          .step-content h2 {
            transition: all 0.3s ease;
          }

          .step-content:hover h2 {
            text-shadow: 0 0 25px #FFFB00;
          }

          .main-heading {
            animation: fadeInUp 1s ease-out;
          }

          @media (max-width: 640px) {
            .step-icon {
              animation: float 3s ease-in-out infinite;
            }
          }
        `}
      </style>

      <Navbar />

      {/* Wrapper makes content centered on large screens */}
      <div className="flex-1 flex items-start lg:items-center justify-center">
        <section className="pt-10 lg:pt-0 px-4 sm:px-6 lg:px-12 pb-12 text-center w-full max-w-[1200px] mx-auto">
          {/* Heading */}
          <h1 className="main-heading text-3xl sm:text-4xl lg:text-5xl font-black font-montserrat">
            How to Play
            <span className="text-[#FFFB00] drop-shadow-[0_0_15px_#FFFB00]"> ?</span>
          </h1>

          {/* Steps Wrapper */}
          <div className="mt-12 flex flex-col gap-16 sm:gap-20 lg:gap-24 items-center w-full">
            
            {/* Step 1 */}
            <div className={`step-container flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 lg:gap-14 w-full ${visibleSteps.includes(0) ? 'opacity-100' : 'opacity-0'}`}>
              <div className="step-number w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-[#FFFB00] shadow-[0_0_25px_#FFFB00] flex items-center justify-center text-black text-3xl sm:text-4xl lg:text-5xl font-black cursor-pointer">
                1
              </div>
              <img
                src="/howto/node.svg"
                className="connector-line w-12 sm:w-16 lg:w-20 h-12 sm:h-16 lg:h-20 rotate-90 sm:rotate-0 cursor-pointer"
              />
              <div className="step-icon relative w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 flex items-center justify-center cursor-pointer">
                <div className="absolute w-full h-full bg-white shadow-[0_0_30px_white] transition-all duration-300 hover:shadow-[0_0_40px_white]" />
                <img
                  src="/howto/door.svg"
                  className="relative z-10 w-8 sm:w-10 lg:w-12 h-8 sm:h-10 lg:h-12 transition-transform duration-300"
                />
              </div>
              <img
                src="/howto/node.svg"
                className="connector-line w-12 sm:w-16 lg:w-20 h-12 sm:h-16 lg:h-20 rotate-90 sm:rotate-0 cursor-pointer"
              />
              <div className="step-content text-center sm:text-left max-w-md cursor-pointer">
                <h2 className="text-[#FFFB00] text-xl sm:text-2xl lg:text-3xl font-black drop-shadow-[0_0_20px_#FFFB00] mb-2 transition-all duration-300">
                  Join or Create a Room
                </h2>
                <p className="text-sm sm:text-base lg:text-lg font-medium leading-relaxed transition-all duration-300 hover:text-gray-200">
                  Enter a unique room code to join an existing match.
                  <br />
                  Generate a new room and share the code with friends.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className={`step-container flex flex-col sm:flex-row-reverse items-center justify-center gap-6 sm:gap-10 lg:gap-14 w-full ${visibleSteps.includes(1) ? 'opacity-100' : 'opacity-0'}`}>
              <div className="step-number w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-[#FFFB00] shadow-[0_0_25px_#FFFB00] flex items-center justify-center text-black text-3xl sm:text-4xl lg:text-5xl font-black cursor-pointer">
                2
              </div>
              <img
                src="/howto/node.svg"
                className="connector-line w-12 sm:w-16 lg:w-20 h-12 sm:h-16 lg:h-20 rotate-90 sm:rotate-0 cursor-pointer"
              />
              <div className="step-icon relative w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 flex items-center justify-center cursor-pointer">
                <div className="absolute w-full h-full bg-white shadow-[0_0_30px_white] transition-all duration-300 hover:shadow-[0_0_40px_white]" />
                <img
                  src="/howto/majesticons_music-line.svg"
                  className="relative z-10 w-8 sm:w-10 lg:w-12 h-8 sm:h-10 lg:h-12 transition-transform duration-300"
                />
              </div>
              <img
                src="/howto/node.svg"
                className="connector-line w-12 sm:w-16 lg:w-20 h-12 sm:h-16 lg:h-20 rotate-90 sm:rotate-0 cursor-pointer"
              />
              <div className="step-content text-center sm:text-right max-w-md cursor-pointer">
                <h2 className="text-[#FFFB00] text-xl sm:text-2xl lg:text-3xl font-black drop-shadow-[0_0_20px_#FFFB00] mb-2 transition-all duration-300">
                  Listen & Guess the Song
                </h2>
                <p className="text-sm sm:text-base lg:text-lg font-medium leading-relaxed transition-all duration-300 hover:text-gray-200">
                  15-second snippet of song plays with a countdown timer.
                  <br />
                  Submit your answer before time runs out.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className={`step-container flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 lg:gap-14 w-full ${visibleSteps.includes(2) ? 'opacity-100' : 'opacity-0'}`}>
              <div className="step-number w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-[#FFFB00] shadow-[0_0_25px_#FFFB00] flex items-center justify-center text-black text-3xl sm:text-4xl lg:text-5xl font-black cursor-pointer">
                3
              </div>
              <img
                src="/howto/node.svg"
                className="connector-line w-12 sm:w-16 lg:w-20 h-12 sm:h-16 lg:h-20 rotate-90 sm:rotate-0 cursor-pointer"
              />
              <div className="step-icon relative w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 flex items-center justify-center cursor-pointer">
                <div className="absolute w-full h-full bg-white shadow-[0_0_30px_white] transition-all duration-300 hover:shadow-[0_0_40px_white]" />
                <img
                  src="/howto/question.svg"
                  className="relative z-10 w-8 sm:w-10 lg:w-12 h-8 sm:h-10 lg:h-12 transition-transform duration-300"
                />
              </div>
              <img
                src="/howto/node.svg"
                className="connector-line w-12 sm:w-16 lg:w-20 h-12 sm:h-16 lg:h-20 rotate-90 sm:rotate-0 cursor-pointer"
              />
              <div className="step-content text-center sm:text-left max-w-md cursor-pointer">
                <h2 className="text-[#FFFB00] text-xl sm:text-2xl lg:text-3xl font-black drop-shadow-[0_0_20px_#FFFB00] mb-2 transition-all duration-300">
                  See Hints & Earn Points
                </h2>
                <p className="text-sm sm:text-base lg:text-lg font-medium leading-relaxed transition-all duration-300 hover:text-gray-200">
                  Faster guesses within 15 seconds earn more points.
                  <br />
                  If most players agree, a hint (movie/artist) is revealed.
                </p>
              </div>
            </div>

          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default HowToPlay;