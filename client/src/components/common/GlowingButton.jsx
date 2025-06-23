export default function GlowingButton({ text, onClick, color = "white", className = "" }) {
  const colorMap = {
    white: {
      bg: "bg-white",
      text: "text-black",
      shadow: "shadow-[0_0_20px_white] hover:shadow-[0_0_30px_white]",
    },
    yellow: {
      bg: "bg-[#FFFB00]",
      text: "text-black",
      shadow: "shadow-[0_0_20px_#FFFB00] hover:shadow-[0_0_30px_#FFFB00]",
    },
    green: {
      bg: "bg-green-400",
      text: "text-black",
      shadow: "shadow-green-500 hover:shadow-green-300",
    },
  };

  const styles = colorMap[color] || colorMap.white;

  return (
    <button
      onClick={onClick}
      className={`
        px-8 py-3 rounded-[6px] font-silkscreen text-base transition-all duration-300
        ${styles.bg} ${styles.text} ${styles.shadow}
        hover:scale-105 hover:brightness-110
        ${className}
      `}
    >
      {text}
    </button>
  );
}
