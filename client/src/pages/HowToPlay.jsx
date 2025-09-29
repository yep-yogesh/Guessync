// Added by Reshma - How To Play Page
import Navbar from "../components/common/Navbar";

const HowToPlay = () => {
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden flex flex-col">
      <Navbar />

      {/* Wrapper makes content centered on large screens */}
      <div className="flex-1 flex items-start lg:items-center justify-center">
        <section className="pt-10 lg:pt-0 px-4 sm:px-6 lg:px-12 pb-12 text-center w-full max-w-[1200px] mx-auto">
          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-montserrat">
            How to Play
            <span className="text-[#FFFB00] drop-shadow-[0_0_15px_#FFFB00]"> ?</span>
          </h1>

          {/* Steps Wrapper */}
          <div className="mt-12 flex flex-col gap-16 sm:gap-20 lg:gap-24 items-center w-full">
            
            {/* Step 1 */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 lg:gap-14 w-full">
              <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-[#FFFB00] shadow-[0_0_25px_#FFFB00] flex items-center justify-center text-black text-3xl sm:text-4xl lg:text-5xl font-black">
                1
              </div>
              <img
                src="/howto/node.svg"
                className="w-12 sm:w-16 lg:w-20 h-12 sm:h-16 lg:h-20 rotate-90 sm:rotate-0"
              />
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 flex items-center justify-center">
                <div className="absolute w-full h-full bg-white shadow-[0_0_30px_white]" />
                <img
                  src="/howto/door.svg"
                  className="relative z-10 w-8 sm:w-10 lg:w-12 h-8 sm:h-10 lg:h-12"
                />
              </div>
              <img
                src="/howto/node.svg"
                className="w-12 sm:w-16 lg:w-20 h-12 sm:h-16 lg:h-20 rotate-90 sm:rotate-0"
              />
              <div className="text-center sm:text-left max-w-md">
                <h2 className="text-[#FFFB00] text-xl sm:text-2xl lg:text-3xl font-black drop-shadow-[0_0_20px_#FFFB00] mb-2">
                  Join or Create a Room
                </h2>
                <p className="text-sm sm:text-base lg:text-lg font-medium leading-relaxed">
                  Enter a unique room code to join an existing match.
                  <br />
                  Generate a new room and share the code with friends.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col sm:flex-row-reverse items-center justify-center gap-6 sm:gap-10 lg:gap-14 w-full">
              <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-[#FFFB00] shadow-[0_0_25px_#FFFB00] flex items-center justify-center text-black text-3xl sm:text-4xl lg:text-5xl font-black">
                2
              </div>
              <img
                src="/howto/node.svg"
                className="w-12 sm:w-16 lg:w-20 h-12 sm:h-16 lg:h-20 rotate-90 sm:rotate-0"
              />
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 flex items-center justify-center">
                <div className="absolute w-full h-full bg-white shadow-[0_0_30px_white]" />
                <img
                  src="/howto/majesticons_music-line.svg"
                  className="relative z-10 w-8 sm:w-10 lg:w-12 h-8 sm:h-10 lg:h-12"
                />
              </div>
              <img
                src="/howto/node.svg"
                className="w-12 sm:w-16 lg:w-20 h-12 sm:h-16 lg:h-20 rotate-90 sm:rotate-0"
              />
              <div className="text-center sm:text-right max-w-md">
                <h2 className="text-[#FFFB00] text-xl sm:text-2xl lg:text-3xl font-black drop-shadow-[0_0_20px_#FFFB00] mb-2">
                  Listen & Guess the Song
                </h2>
                <p className="text-sm sm:text-base lg:text-lg font-medium leading-relaxed">
                  15-second snippet of song plays with a countdown timer.
                  <br />
                  Submit your answer before time runs out.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 lg:gap-14 w-full">
              <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-[#FFFB00] shadow-[0_0_25px_#FFFB00] flex items-center justify-center text-black text-3xl sm:text-4xl lg:text-5xl font-black">
                3
              </div>
              <img
                src="/howto/node.svg"
                className="w-12 sm:w-16 lg:w-20 h-12 sm:h-16 lg:h-20 rotate-90 sm:rotate-0"
              />
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 flex items-center justify-center">
                <div className="absolute w-full h-full bg-white shadow-[0_0_30px_white]" />
                <img
                  src="/howto/question.svg"
                  className="relative z-10 w-8 sm:w-10 lg:w-12 h-8 sm:h-10 lg:h-12"
                />
              </div>
              <img
                src="/howto/node.svg"
                className="w-12 sm:w-16 lg:w-20 h-12 sm:h-16 lg:h-20 rotate-90 sm:rotate-0"
              />
              <div className="text-center sm:text-left max-w-md">
                <h2 className="text-[#FFFB00] text-xl sm:text-2xl lg:text-3xl font-black drop-shadow-[0_0_20px_#FFFB00] mb-2">
                  See Hints & Earn Points
                </h2>
                <p className="text-sm sm:text-base lg:text-lg font-medium leading-relaxed">
                  Faster guesses within 15 seconds earn more points.
                  <br />
                  If most players agree, a hint (movie/artist) is revealed.
                </p>
              </div>
            </div>

          </div>
        </section>
      </div>
    </div>
  );
};

export default HowToPlay;