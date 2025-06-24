// Added by Reshma - How To Play Page
import Navbar from "../components/common/Navbar";

const HowToPlay = () => {
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <Navbar />

      <section className="pt-10 px-6 pb-10 text-center">
        <h1 className="text-5xl font-black font-montserrat">
          How to Play
          <span className="text-[#FFFB00] drop-shadow-[0_0_15px_#FFFB00]"> ?</span>
        </h1>

        <div className="mt-14 flex flex-col gap-18 items-center w-full max-w-[1200px] mx-auto">
          <div className="flex items-center justify-center gap-10 w-full max-w-[1200px]">
            <div className="w-24 h-24 bg-[#FFFB00] shadow-[0_0_25px_#FFFB00] flex items-center justify-center text-black text-[60px] font-black">
              1
            </div>
            <img src="/howto/node.svg" className="w-20 h-20" />
            <div className="relative w-24 h-24 flex items-center justify-center">
              <div className="absolute w-full h-full bg-white shadow-[0_0_30px_white]" />
              <img src="/howto/door.svg" className="relative z-10 w-12 h-12" />
            </div>
            <img src="/howto/node.svg" className="w-20 h-20" />
            <div className="text-left max-w-md">
              <h2 className="text-[#FFFB00] text-2xl font-black drop-shadow-[0_0_20px_#FFFB00] mb-2">
                Join or Create a Room
              </h2>
              <p className="text-white font-medium leading-relaxed">
                Enter a unique room code to join an existing match.
                <br />
                Generate a new room and share the code with friends.
              </p>
            </div>
          </div>

          <div className="flex flex-row-reverse items-center justify-center gap-10 w-full max-w-[1200px]">
            <div className="w-24 h-24 bg-[#FFFB00] shadow-[0_0_25px_#FFFB00] flex items-center justify-center text-black text-[60px] font-black">
              2
            </div>
            <img src="/howto/node.svg" className="w-20 h-20" />
            <div className="relative w-24 h-24 flex items-center justify-center">
              <div className="absolute w-full h-full bg-white shadow-[0_0_30px_white]" />
              <img src="/howto/majesticons_music-line.svg" className="relative z-10 w-12 h-12" />
            </div>
            <img src="/howto/node.svg" className="w-20 h-20" />
            <div className="text-right max-w-md">
              <h2 className="text-[#FFFB00] text-2xl font-black drop-shadow-[0_0_20px_#FFFB00] mb-2">
                Listen & Guess the Song
              </h2>
              <p className="text-white font-medium leading-relaxed">
                15-second snippet of song plays with a countdown timer.
                <br />
                Submit your answer before time runs out.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-10 w-full max-w-[1200px]">
            <div className="w-24 h-24 bg-[#FFFB00] shadow-[0_0_25px_#FFFB00] flex items-center justify-center text-black text-[60px] font-black">
              3
            </div>
            <img src="/howto/node.svg" className="w-20 h-20" />
            <div className="relative w-24 h-24 flex items-center justify-center">
              <div className="absolute w-full h-full bg-white shadow-[0_0_30px_white]" />
              <img src="/howto/question.svg" className="relative z-10 w-12 h-12" />
            </div>
            <img src="/howto/node.svg" className="w-20 h-20" />
            <div className="text-left max-w-md">
              <h2 className="text-[#FFFB00] text-2xl font-black drop-shadow-[0_0_20px_#FFFB00] mb-2">
                See Hints & Earn Points
              </h2>
              <p className="text-white font-medium leading-relaxed">
                Faster guesses within 15 seconds earn more points.
                <br />
                If most players agree, a hint (movie/artist) is revealed.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowToPlay;