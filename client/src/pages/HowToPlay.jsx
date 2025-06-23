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
      </section>
    </div>
  );
};

export default HowToPlay;
