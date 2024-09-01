import React, { useState } from "react";
import { HiMenuAlt3 } from "react-icons/hi";
import { MdHealthAndSafety } from "react-icons/md";
import { GiHealthNormal } from "react-icons/gi";
import { IoLogOut, IoPersonCircleSharp } from "react-icons/io5";
import { useNavigate, useLocation } from "react-router-dom";
// import { useUser } from "../User";
import { auth } from "../../firebase";
import Rhu1 from "../../assets/images/1.jpg";
import Rhu2 from "../../assets/images/2.jpg";
import Rhu3 from "../../assets/images/3.jpg";
import Balucuc from "../../assets/images/balucuc.jpg";
import Calantipe from "../../assets/images/calantipe.jpg";
import Cansinala from "../../assets/images/cansinala.jpg";
import Capalangan from "../../assets/images/capalangan.jpg";
import Colgante from "../../assets/images/colgante.png";
import Paligui from "../../assets/images/paligui.jpg";
import Sampaloc from "../../assets/images/sampaloc2.png";
import SanJuan from "../../assets/images/sanjuan.jpg";
import SanVicente from "../../assets/images/sanvicente.jpg";
import Sulipan from "../../assets/images/sulipan2.png";
import Tabuyuc from "../../assets/images/tabuyuc.jpg";
import Sucad from "../../assets/images/sucad.png";
import { FaUsers } from "react-icons/fa";
import { RiSettings4Line } from "react-icons/ri";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

type DropdownItem = {
  name: string;
  link: string;
  icon?: string;
};

const AdminSidebar = () => {
  const [open, setOpen] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  // const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectMenu, setSelectMenu] = useState<string>("");
  const MySwal = withReactContent(Swal);

  const menus = [
    { name: "All Users", link: "/administrator/users", icon: FaUsers },
    {
      name: "Rural Health Units",
      link: "#",
      icon: MdHealthAndSafety,
      hasDropdown: true,
      dropdownItems: [
        {
          name: "Rural Health Unit I",
          link: "/administrator/rural-health-units/1",
          icon: Rhu1,
        },
        {
          name: "Rural Health Unit II",
          link: "/administrator/rural-health-units/2",
          icon: Rhu2,
        },
        {
          name: "Rural Health Unit III",
          link: "/administrator/rural-health-units/3",
          icon: Rhu3,
        },
      ] as DropdownItem[],
    },
    {
      name: "Barangay Health Centers",
      link: "#",
      icon: GiHealthNormal,
      hasDropdown: true,
      dropdownItems: [
        {
          name: "Balucuc",
          link: "/administrator/barangay/balucuc",
          icon: Balucuc,
        },
        {
          name: "Calantipe",
          link: "/administrator/barangay/calantipe",
          icon: Calantipe,
        },
        {
          name: "Cansinala",
          link: "/administrator/barangay/cansinala",
          icon: Cansinala,
        },
        {
          name: "Capalangan",
          link: "/administrator/barangay/capalangan",
          icon: Capalangan,
        },
        {
          name: "Colgante",
          link: "/administrator/barangay/colgante",
          icon: Colgante,
        },
        {
          name: "Paligui",
          link: "/administrator/barangay/paligui",
          icon: Paligui,
        },
        {
          name: "Sampaloc",
          link: "/administrator/barangay/sampaloc",
          icon: Sampaloc,
        },
        {
          name: "San Juan",
          link: "/administrator/barangay/sanjuan",
          icon: SanJuan,
        },
        {
          name: "San Vicente",
          link: "/administrator/barangay/sanvicente",
          icon: SanVicente,
        },
        { name: "Sucad", link: "/administrator/barangay/sucad", icon: Sucad },
        {
          name: "Sulipan",
          link: "/administrator/barangay/sulipan",
          icon: Sulipan,
        },
        {
          name: "Tabuyuc",
          link: "/administrator/barangay/tabuyuc",
          icon: Tabuyuc,
        },
      ] as DropdownItem[],
    },
    {
      name: "Setting",
      link: "#",
      icon: RiSettings4Line,
      margin: true,
      hasDropdown: true,
      dropdownItems: [
        { name: "Profile", link: "/administrator/settings/profile" },
        { name: "Account", link: "/administrator/settings/account" },
        { name: "Privacy", link: "/administrator/settings/privacy" },
      ] as DropdownItem[],
    },
    { name: "Logout", link: "Logout", icon: IoLogOut },
  ];
  const handleLogout = async () => {
    MySwal.fire({
      title: "Do you want to logout?",
      showDenyButton: false,
      showCancelButton: true,
      confirmButtonText: "Logout",
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire("Logout Successfully!", "", "success");
        try {
          await auth.signOut();
          navigate("/administrator");
        } catch (error) {
          console.error("Logout failed:", error);
        }
      }
    });
  };

  const handleMenuClick = (
    menuName: string,
    link: string,
    hasDropdown: boolean
  ) => {
    setSelectMenu(menuName);
    if (hasDropdown) {
      setActiveDropdown((prev) => (prev === menuName ? null : menuName));
    } else {
      setActiveDropdown(null);
      handleClick(link);
    }
  };

  const handleClick = (link: string) => {
    if (link === "#") return; // Prevent navigation for menus with no specific link

    if (link === "Logout") {
      handleLogout();
    } else {
      navigate(link);
    }
  };

  const isActive = (link: string) => location.pathname === link;

  return (
    <section className="flex gap-6">
      <div
        className={`bg-teal-600 min-h-screen ${
          open ? "w-72" : "w-16"
        } duration-500 text-gray-100 px-4`}
      >
        <div className="py-3 flex justify-end">
          <HiMenuAlt3
            size={26}
            className="cursor-pointer"
            onClick={() => setOpen(!open)}
          />
        </div>
        <div
          className={`flex items-center gap-4 ${
            open ? "justify-start" : "justify-center"
          }`}
        >
          {open ? (
            <>
              <IoPersonCircleSharp className="w-8 h-8 rounded-full" />
              <span className="font-bold">Super Admin</span>
            </>
          ) : (
            <IoPersonCircleSharp className="w-8 h-8 rounded-full" />
          )}
        </div>
        <div className="mt-4 flex flex-col gap-4 relative">
          {menus.map((menu, i) => (
            <div key={i}>
              <div
                className={`${
                  menu.margin && "mt-5"
                } group flex items-center text-sm gap-3.5 font-medium p-2 rounded-md cursor-pointer ${
                  isActive(menu.link)
                    ? "bg-blue-gray-800 text-white"
                    : "hover:bg-blue-gray-800 text-gray-100"
                }`}
                onClick={() =>
                  handleMenuClick(menu.name, menu.link, !!menu.hasDropdown)
                }
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

              {menu.hasDropdown && activeDropdown === menu.name && open && (
                <div className="pl-8">
                  {menu.dropdownItems?.map((dropdownItem, index) => (
                    <div
                      key={index}
                      className={`flex items-center text-sm gap-3.5 font-medium p-2 rounded-md cursor-pointer mt-2 ${
                        isActive(dropdownItem.link)
                          ? "bg-blue-gray-800 text-white"
                          : "hover:bg-blue-gray-800 text-gray-100"
                      }`}
                      onClick={() => handleClick(dropdownItem.link)}
                    >
                      {dropdownItem.icon && (
                        <img
                          src={dropdownItem.icon}
                          alt={dropdownItem.name}
                          className="w-6 h-6 rounded-full"
                        />
                      )}
                      <span>{dropdownItem.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdminSidebar;
