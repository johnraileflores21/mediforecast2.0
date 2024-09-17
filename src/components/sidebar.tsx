import React, { useState } from "react";
import { MdOutlineDashboard } from "react-icons/md";
import { RiSettings4Line } from "react-icons/ri";
import { MdInventory } from "react-icons/md";
import { FaQuestionCircle } from "react-icons/fa";
import { SiGooglemessages } from "react-icons/si";
import { FaFileShield } from "react-icons/fa6";
import { IoLogOut } from "react-icons/io5";
import { GiHamburgerMenu } from "react-icons/gi";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "./User";
import { auth } from "../firebase";

const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const closeModal = () => setShowDeleteModal(false);

  const menus = [
    { name: "Dashboard", link: "/dashboard", icon: MdOutlineDashboard },
    { name: "Inventory", link: "/inventory", icon: MdInventory },
    // { name: "Inventory2", link: "/inventory2", icon: MdInventory },
    { name: "Request", link: "/request", icon: FaQuestionCircle },
    { name: "Community Post", link: "/community", icon: SiGooglemessages },
    {
      name: "Individual Treatment Record",
      link: "/individual-treatment-record",
      icon: FaFileShield,
    },
    { name: "Setting", link: "/settings", icon: RiSettings4Line, margin: true },
    { name: "Logout", link: "#", icon: IoLogOut }, // Prevent navigation on click
  ];

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleClick = (link: string) => {
    if (link === "#") {
      setShowDeleteModal(true);
    } else {
      navigate(link);
    }
  };

  const isActive = (link: string) => location.pathname === link;

  return (
    <>
      <section className="flex gap-6">
        <div
          className={`bg-teal-600 min-h-screen ${
            open ? "w-72" : "w-16"
          } duration-500 text-gray-100 px-4`}
        >
          <div className="py-3 flex justify-end">
            <GiHamburgerMenu
              size={26}
              className="cursor-pointer"
              onClick={() => setOpen(!open)}
            />
          </div>
          <div className="">
            <div
              className={`flex items-center gap-4 mt-5 mb-10 border-b-2 pb-2  ${
                open ? "justify-start" : "justify-center"
              }`}
            >
              {open && (
                <img
                  src={user?.imageUrl}
                  className="w-8 h-8 rounded-full"
                  alt="User image"
                />
              )}
              {open && user ? (
                <span className="font-bold transition">
                  {user.firstname} {user.lastname}
                </span>
              ) : (
                !open && (
                  <img
                    src={user?.imageUrl}
                    className="w-8 h-8 rounded-full"
                    alt="User image"
                  />
                )
              )}
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-4 relative">
            {menus.map((menu, i) => (
              <div
                key={i}
                className={`${
                  menu.margin && "mt-5"
                } group flex items-center text-sm gap-3.5 font-medium p-2 rounded-md cursor-pointer ${
                  isActive(menu.link)
                    ? "bg-blue-gray-900 text-white"
                    : "hover:bg-blue-gray-900 text-gray-100"
                }`}
                onClick={() => handleClick(menu.link)}
              >
                <div>{React.createElement(menu.icon, { size: "20" })}</div>
                <h2
                  style={{
                    transitionDelay: `${i + 3}00ms`,
                  }}
                  className={`whitespace-pre duration-500 ${
                    !open && "opacity-0 translate-x-28 overflow-hidden"
                  }`}
                >
                  {menu.name}
                </h2>
                <h2
                  className={`${
                    open && "hidden"
                  } absolute left-48 bg-white font-semibold whitespace-pre text-gray-900 rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit`}
                >
                  {menu.name}
                </h2>
              </div>
            ))}
          </div>
        </div>
      </section>
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-md shadow-lg text-center">
            <p>Are you sure you want to logout?</p>
            <div className="mt-4 space-x-4">
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-md"
              >
                Logout
              </button>
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-400 text-white rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;

// import { Link, useLocation } from "react-router-dom";
// import { useUser } from "./User";
// import { MdDashboard, MdInventory } from "react-icons/md";
// import { FaQuestionCircle } from "react-icons/fa";
// import { SiGooglemessages } from "react-icons/si";
// import { FaFileShield } from "react-icons/fa6";
// import { IoLogOut, IoPersonCircleSharp } from "react-icons/io5";

// interface SidebarProps {
//   isOpen: boolean;
//   toggleSidebar: () => void;
// }

// const Sidebar = ({ isOpen, toggleSidebar }: SidebarProps) => {
//   const location = useLocation();
//   const { user } = useUser();

//   return (
//     <div
//       className={`w-64 bg-teal-600 text-white flex flex-col fixed lg:relative transform ${
//         isOpen ? "translate-x-0" : "-translate-x-full"
//       } transition-transform duration-300 ease-in-out lg:translate-x-0 z-10`}
//     >
//       <div className="p-2 ml-2 text-2xl font-bold border-b border-white flex items-center">
//         <img
//           src="/images/finalelogo.png"
//           alt="Logo"
//           className="w-10 h-10 mr-3"
//         />
//         MediForecast
//       </div>
//       <div className="p-2 ml-2 text-l font-bold border-b border-white flex items-center">
//         <IoPersonCircleSharp className="w-10 h-10 mr-3" />
//         {user ? `${user.firstname} ${user.lastname}` : ""}
//       </div>
//       <nav className="flex flex-col flex-grow p-4 space-y-2">
//         <Link
//           to="/dashboard"
//           className={`hover:bg-gray-500 p-4 border-b border-white flex items-center ${
//             location.pathname === "/dashboard" ? "bg-gray-500" : ""
//           }`}
//           onClick={toggleSidebar}
//         >
//           <MdDashboard className="w-7 h-7 mr-3 text-white" />
//           Dashboard
//         </Link>
//         <Link
//           to="/try"
//           className={`hover:bg-gray-500 p-4 border-b border-white flex items-center ${
//             location.pathname === "/inventory" ? "bg-gray-500" : ""
//           }`}
//           onClick={toggleSidebar}
//         >
//           <MdInventory className="w-7 h-7 mr-3 text-white" />
//           Inventory
//         </Link>
//         <Link
//           to="/request"
//           className={`hover:bg-gray-500 p-4 border-b border-white flex items-center ${
//             location.pathname === "/request" ? "bg-gray-500" : ""
//           }`}
//           onClick={toggleSidebar}
//         >
//           <FaQuestionCircle className="w-7 h-7 mr-3 text-white" />
//           Request
//         </Link>
//         <Link
//           to="/community"
//           className="hover:bg-gray-500 p-4 border-b border-white flex items-center"
//           onClick={toggleSidebar}
//         >
//           <SiGooglemessages className="w-7 h-7 mr-3 text-white" />
//           Community Post
//         </Link>
//         <Link
//           to="/individual"
//           className="hover:bg-gray-500 p-4 border-b border-white flex items-center"
//           onClick={toggleSidebar}
//         >
//           <FaFileShield className="w-7 h-7 mr-3 text-white" />
//           Individual Treatment Records
//         </Link>

//         <button className="hover:bg-gray-500 p-4 border-b border-white flex items-center">
//           <IoLogOut className="w-7 h-7 mr-3 text-white" />
//           Logout
//         </button>
//       </nav>
//     </div>
//   );
// };

// export default Sidebar;
