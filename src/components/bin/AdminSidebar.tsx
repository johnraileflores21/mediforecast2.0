import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useUser } from "../User";
import { MdDashboard, MdInventory } from "react-icons/md";
import { FaQuestionCircle } from "react-icons/fa";
import { SiGooglemessages } from "react-icons/si";
import { FaFileShield } from "react-icons/fa6";
import { IoLogOut, IoPersonCircleSharp } from "react-icons/io5";

const AdminSidebar = () => {
  const location = useLocation();
  const { currentUser, logout } = useUser();
  const [recordsOpen, setRecordsOpen] = useState(false);

  const toggleRecords = () => {
    setRecordsOpen(!recordsOpen);
  };

  return (
    <div className="h-100% w-64 bg-teal-600 text-white flex flex-col">
      <div className="p-2 ml-2 text-2xl font-bold border-b border-white flex items-center">
        <img src="/images/logo1.1.png" alt="Logo" className="w-10 h-10 mr-3" />
        MediForecast
      </div>
      <div className="p-2 ml-2 text-l font-bold border-b border-white flex items-center">
        <IoPersonCircleSharp className="w-10 h-10 mr-3" />
        Administrator
      </div>

      <nav className="flex flex-col p-4 flex-grow space-y-2">
        <Link
          to="/administrator-dashboard"
          className={`hover:bg-gray-500 p-4 border-b border-white flex items-center ${
            location.pathname === "/dashboard" ? "bg-gray-500" : ""
          }`}
        >
          <MdDashboard className="w-7 h-7 mr-3 text-white" />
          Dashboard
        </Link>
        <button
          onClick={toggleRecords}
          className={`hover:bg-gray-500 p-4 border-b border-white flex items-center ${
            recordsOpen ? "bg-gray-500" : ""
          }`}
        >
          <FaFileShield className="w-7 h-7 mr-3 text-white" />
          Rural Health Units
        </button>
        <div className={`ml-6 ${recordsOpen ? "" : "hidden"}`}>
          <Link
            to="/rural-health-unit-1"
            className="hover:bg-gray-500 p-4 border-b border-white flex items-center"
          >
            <img
              src="/images/1.jpg"
              alt=""
              className="w-9 h-9 mr-3 rounded-full"
            />
            RHU - I
          </Link>
          <Link
            to="/rural-health-unit-2"
            className="hover:bg-gray-500 p-4 border-b border-white flex items-center"
          >
            <img
              src="/images/2.jpg"
              alt=""
              className="w-9 h-9 mr-3 rounded-full"
            />
            RHU - II
          </Link>
          <Link
            to="/rural-health-unit-3"
            className="hover:bg-gray-500 p-4 border-b border-white flex items-center"
          >
            <img
              src="/images/3.jpg"
              alt=""
              className="w-9 h-9 mr-3 rounded-full"
            />
            RHU - III
          </Link>
        </div>

        <Link
          to="#"
          className={`hover:bg-gray-500 p-4 border-b border-white flex items-center ${
            location.pathname === "/request" ? "bg-gray-500" : ""
          }`}
        >
          <FaQuestionCircle className="w-7 h-7 mr-3 text-white" />
          Barangay Health Center Users
        </Link>
        <Link
          to="#"
          className="hover:bg-gray-500 p-4 border-b border-white flex items-center"
        >
          <SiGooglemessages className="w-7 h-7 mr-3 text-white" />
          Resident Users
        </Link>

        <button
          onClick={logout}
          className="hover:bg-gray-500 p-4 border-b border-white flex items-center"
        >
          <IoLogOut className="w-7 h-7 mr-3 text-white" />
          Logout
        </button>
      </nav>
    </div>
  );
};

export default AdminSidebar;
