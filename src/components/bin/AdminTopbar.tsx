import React, { useState } from "react";
import { IoMdNotifications } from "react-icons/io";
import { useUser } from "../User";

const AdminTopbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="bg-teal-600 text-white p-2.5 shadow-md flex justify-center items-center relative">
      <h1 className="text-3xl font-extrabold ">
        Admin{" "}
        {user?.barangay === "Sulipan" ||
        user?.barangay === "San Juan" ||
        user?.barangay === "Capalangan" ||
        user?.barangay === "Sucad" ? (
          <span>I</span>
        ) : null}
        {user?.barangay === "Tabuyuc" ||
        user?.barangay === "Balucuc" ||
        user?.barangay === "Cansinala" ||
        user?.barangay === "Calantipe" ? (
          <span>II</span>
        ) : null}
        {user?.barangay === "Sampaloc" ||
        user?.barangay === "Paligui" ||
        user?.barangay === "San Vicente" ||
        user?.barangay === "Colgante" ? (
          <span>III</span>
        ) : null}
      </h1>
      <div className="absolute right-0 mr-3">
        <button
          onClick={toggleDropdown}
          className="relative z-10 block rounded-md focus:outline-none"
        >
          <IoMdNotifications className="h-7 w-7 text-white" />
        </button>
        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white text-teal-800 rounded-md shadow-lg overflow-hidden z-20">
            <div className="py-2">
              <a
                href="#"
                className="block px-4 py-2 text-sm hover:bg-teal-600 hover:text-white"
              >
                Notification 1
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-sm hover:bg-teal-600 hover:text-white"
              >
                Notification 2
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-sm hover:bg-teal-600 hover:text-white"
              >
                Notification 3
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTopbar;
