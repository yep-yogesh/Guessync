import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react'; // hamburger + close icons
import avatar from '/avatars/1.png';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { label: 'Home', path: '/landing' },
    { label: 'New Room', path: '/create-room' },
    { label: 'About Dev', path: '/about' },
    { label: 'How to Play', path: '/how-to-play' },
  ];

  const isActive = (path) => location.pathname === path;

  // Resolve avatar from localStorage (user.avatar -> userAvatar -> default)
  const resolveAvatar = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const candidate = user?.avatar || localStorage.getItem("userAvatar");
      if (!candidate) return "/avatars/1.png";
      if (typeof candidate === "number") return `/avatars/${candidate}.png`;
      if (typeof candidate === "string") {
        if (/^https?:\/\//.test(candidate)) return candidate;           // absolute URL
        if (candidate.startsWith("/avatars/")) return candidate;        // ready path
        if (/^\d+$/.test(candidate)) return `/avatars/${candidate}.png`; // numeric string
        return candidate;                                               // fallback as-is
      }
      return "/avatars/1.png";
    } catch {
      return "/avatars/1.png";
    }
  };

  const [avatarSrc, setAvatarSrc] = useState(resolveAvatar());
  useEffect(() => {
    const update = () => setAvatarSrc(resolveAvatar());
    window.addEventListener("storage", update);     // cross-tab changes
    window.addEventListener("focus", update);       // when tab refocuses
    window.addEventListener("avatar-updated", update); // custom event support
    return () => {
      window.removeEventListener("storage", update);
      window.removeEventListener("focus", update);
      window.removeEventListener("avatar-updated", update);
    };
  }, []);

  // Only show logo on auth pages
  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";

  return (
    <nav className='w-full bg-black text-white font-montserrat shadow-md relative z-50'>
      <div className='flex items-center justify-between px-6 py-4'>
        {/* Logo */}
        <div className='flex items-center'>
          <img src='/logo.png' alt='logo' className='w-10 h-10 mt-1.5' />
          <h1 className='ml-2 text-2xl font-silkscreen'>
            GUES
            <span className='text-[#FFFB00] drop-shadow-[0_0_5px_#FFFB00]'>
              SYNC
            </span>
          </h1>
        </div>

        {/* Desktop Menu */}
        <div className='hidden md:flex items-center gap-8 text-lg font-medium'>
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className='relative z-10 after:absolute after:left-0 after:bottom-[-5px] after:w-0 after:h-[2px] after:bg-[#FFFB00] after:shadow-[0_0_10px_#FFFB00] hover:after:w-full focus-visible:after:w-full after:transition-all after:duration-300'
            >
              {item.label}
            </Link>
          ))}

          <Link
            to='/login'
            className='text-center bg-[#FFFB00] text-black w-32 px-4 py-2 rounded-[6px] shadow-[0_0_10px_#FFFB00] hover:scale-105 transition font-silkscreen relative z-10 cursor-pointer'
          >
            Login
          </Link>

          <Link to='/profile' className='rounded-full'>
            <img
              src={avatar}
              alt='profile'
              className='w-10 h-10 rounded-full border-[2px] border-[#FFFB00] shadow-[0_0_10px_#FFFB00] cursor-pointer relative z-10'
            />
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <div className='md:hidden'>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className='text-white focus-visible:text-[#FFFB00] hover:text-[#FFFB00] transition'
          >
            {menuOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      <div
        className={`md:hidden flex flex-col items-center bg-black text-lg font-medium gap-6 py-6 transform transition-all duration-500 ease-in-out relative z-40 ${
          menuOpen
            ? 'max-h-[500px] opacity-100 scale-100'
            : 'max-h-0 opacity-0 scale-95 overflow-hidden'
        }`}
      >
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={() => {
              navigate("/profile");
              setMenuOpen(false);
            }}
            className='relative z-10 after:absolute after:left-0 after:bottom-[-5px] after:w-0 after:h-[2px] after:bg-[#FFFB00] after:shadow-[0_0_10px_#FFFB00] focus-visible:after:w-full hover:after:w-full after:transition-all after:duration-300'
          >
            {item.label}
          </button>
        ))}

        <button
          onClick={() => {
            navigate('/login');
            setMenuOpen(false);
          }}
          className='bg-[#FFFB00] text-black w-32 px-4 py-2 rounded-[6px] shadow-[0_0_10px_#FFFB00] hover:scale-105 focus-visible:scale-105 transition font-silkscreen relative z-10 cursor-pointer'
        >
          Login
        </button>

        <img
          src={avatar}
          onClick={() => {
            navigate('/profile');
            setMenuOpen(false);
          }}
          alt='profile'
          className='w-12 h-12 rounded-full border-[2px] border-[#FFFB00] shadow-[0_0_10px_#FFFB00] cursor-pointer relative z-10'
        />
      </div>
    </nav>
  );
}
