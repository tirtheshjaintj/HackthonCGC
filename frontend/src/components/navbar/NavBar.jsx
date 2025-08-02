import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { navListItems } from "../../constants/constants";
import { Menu, LogOut, LogIn } from "lucide-react"; // Replace with your icon library
import useAuthStore from "../../store/authSlice/authSlice";

export default function NavBar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [setLogutModalOpen] = useState(false); // replace with your actual modal handler
  const profileRef = useRef(null);

  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`h-16 py-4 px-4 xl:px-[90px] lg:px-15 md:px-10 flex items-center justify-between sticky top-0 z-50 w-full transition-shadow duration-300 ${isScrolled
          ? "shadow-md bg-white/40 backdrop-blur-xl"
          : "bg-white shadow"
        }`}
    >
      {/* Menu icon (mobile) */}
      <div className="flex items-center max-sm:w-14">
        <Menu
          strokeWidth={1.75}
          onClick={() => setIsOpen(true)}
          className="lg:hidden"
        />
      </div>

      {/* Logo */}
      <Link
        to="/"
        className="relative w-fit text-text-secondary-dark max-lg:flex items-center lg:w-60 text-2xl font-bold"
      >
        <span className="text-dark-primary">C</span>ivic{" "}
        <span className="text-dark-primary">T</span>rack
      </Link>

      {/* Center Nav Menu */}
      <div className="flex-1 flex items-center justify-center max-lg:hidden">
        <nav className="w-full flex items-center justify-center text-sm font-medium gap-9">
          {navListItems.map((item, idx) => (
            <Link key={idx} to={item.link} className="hover:text-yellow-600">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Right Section: Profile or Login */}
      <div className="flex items-center gap-4 lg:max-w-60 min-w-14 justify-end">
        {user ? (
          <div
            ref={profileRef}
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="max-lg:hidden flex relative items-center gap-2 cursor-pointer"
          >
            <div className="min-w-7 min-h-7 rounded-full relative overflow-hidden">
              <img src={"/"} alt="profile" className="w-7 h-7 object-cover" />
            </div>
            <p className="font-semibold truncate max-w-[100px] hover:opacity-80">
              {user?.name || user?.email}
            </p>

            {isProfileOpen && (
              <div className="absolute -bottom-40 right-0 w-60 bg-white shadow-md p-4.5 flex flex-col gap-4">
                <h4 className="text-gray-700 font-semibold">Profile</h4>
                <div className="h-px w-full bg-gray-200" />
                <div
                  onClick={() => setLogutModalOpen(true)}
                  className="flex items-center gap-3 cursor-pointer hover:opacity-70 text-red-500"
                >
                  <LogOut strokeWidth={1.5} className="rotate-180" />
                  Log Out
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="max-lg:hidden">
            <button className="flex items-center bg-dark-primary border rounded-2xl text-white px-4 py-1.5 cursor-pointer gap-2 hover:opacity-80">
              <LogIn size={20} strokeWidth={1.5} />
              <p className="font-semibold">Log In</p>
            </button>
          </div>
        )}
      </div>

      {/* MobileNavbar could go here */}
    </header>
  );
}
