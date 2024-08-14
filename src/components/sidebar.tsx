import React, { useState } from "react";
import { HiMenuAlt3 } from "react-icons/hi";
import { MdOutlineDashboard } from "react-icons/md";
import { RiSettings4Line } from "react-icons/ri";
import { TbReportAnalytics } from "react-icons/tb";
import { AiOutlineUser, AiOutlineHeart } from "react-icons/ai";
import { FiMessageSquare, FiFolder, FiShoppingCart } from "react-icons/fi";
import { MdDashboard, MdInventory } from "react-icons/md";
import { FaQuestionCircle } from "react-icons/fa";
import { SiGooglemessages } from "react-icons/si";
import { FaFileShield } from "react-icons/fa6";
import { IoLogOut, IoPersonCircleSharp } from "react-icons/io5";
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
                  src="images/backgroundlogo.jpg"
                  className="w-8 h-8 rounded-full"
                  alt="Logo"
                />
              )}
              {open && user ? (
                <span className="font-bold transition">
                  {user.firstname} {user.lastname}
                </span>
              ) : (
                !open && (
                  <img
                    src="images/backgroundlogo.jpg"
                    className="w-8 h-8 rounded-full"
                    alt="Logo"
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
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <svg
                    className="h-12 w-12 text-yellow-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                    />
                  </svg>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3
                      className="text-lg leading-6 font-medium text-gray-900"
                      id="modal-headline"
                    >
                      Logout Confirmation
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to logout?
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={handleLogout}
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-yellow-700 text-base font-medium text-white hover:bg-yellow-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Logout
                </button>
                <button
                  onClick={closeModal}
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
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
