import React, { useEffect, useState } from "react";
import { GrLogout } from "react-icons/gr";
import { FaBars } from "react-icons/fa";
import { PiChalkboardTeacherFill, PiStudent } from "react-icons/pi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { SiGoogleclassroom } from "react-icons/si";
import Cookies from "universal-cookie";
import { CiSettings } from "react-icons/ci";
import { removeCookie } from "../../axios/cookieFunc";

const listData = [
  {
    name: "Dashboard",
    type: ["Admin"],
    icon: <PiChalkboardTeacherFill size={20} />,
    link: "/user/admin",
  },
  {
    name: "All Reports",
    type: ["Admin"],
    icon: <SiGoogleclassroom size={20} />,
    link: "/user/dashboard/class",
  },
  {
    name: "Manage Users",
    type: ["Admin", "Convenor"],
    icon: <SiGoogleclassroom size={20} />,
    link: "/user/dashboard/events",
  },
  {
    name: "Profile",
    type: ["Class"],
    icon: <CiSettings size={20} />,
    link: "/user/dashboard/profile",
  },
];

export default function Sidebar({ open, setOpen }) {
  // const [filteredListData, setFilteredListData] = useState(listData);
  const location = useLocation();
  const navigate = useNavigate();

  const signOut = () => {
    removeCookie("authToken");
    navigate("/login");
  };

  // useEffect(() => {
  //   const storedUser = localStorage.getItem("user");
  //   if (storedUser) {
  //     const parsedUser = JSON.parse(storedUser);
  //     const filteredData = listData.filter((item) =>
  //       item.type.includes(parsedUser?.user_type)
  //     );
  //     setFilteredListData(filteredData);
  //   }
  // }, []);

  return (
    <div className="relative min-h-full text-stone-700">
      <div className="relative flex items-center gap-4 py-4 text-2xl font-bold border-b border-zinc-700 border-opacity-30">
        {open ? (
          <Link
            to="/"
            className="relative w-fit text-text-secondary-dark px-4 max-lg:flex items-center lg:w-60 text-2xl font-bold"
          >
            <span className="text-dark-primary">C</span>ivic{" "}
            <span className="text-dark-primary">T</span>rack
          </Link>
        ) : (
          <Link
            to="/"
            className="relative w-fit text-text-secondary-dark px-1.5 max-lg:flex items-center lg:w-60 text-2xl font-bold"
          >
            <span className="text-dark-primary">CT</span>
          </Link>
        )}

        <FaBars
          size={20}
          onClick={() => setOpen((prev) => !prev)}
          className="sticky cursor-pointer md:hidden bottom-2 hover:text-slate-500"
        />
      </div>

      <div className="flex flex-col gap-2 mt-5">
        {listData.map((item, index) => (
          <Link
            to={item.link}
            key={index}
            onClick={() => setOpen(false)}
            className={`
              ${
                item.link === location.pathname
                  ? "bg-dark-primary text-white"
                  : ""
              }
              rounded-md p-2 transition-all cursor-pointer
              hover:bg-gradient-to-r hover:bg-dark-primary hover:text-white
              font-semibold flex items-center gap-3
              ${!open ? "w-fit" : "w-full"}
            `}
          >
            {item.icon}
            {open && item.name}
          </Link>
        ))}
      </div>

      <div
        title="logout"
        onClick={signOut}
        className={`lg:absolute lg:bottom-3 ${!open ? "w-fit" : "w-[80%]"}
          font-medium flex items-center gap-4
          cursor-pointer
          py-3 px-2 rounded-md 
          hover:text-white
          hover:bg-gradient-to-r hover:from-stone-900 hover:to-zinc-700
        `}
      >
        <GrLogout size={20} className="text-red-700" />
        {open && "Log Out"}
      </div>
    </div>
  );
}
