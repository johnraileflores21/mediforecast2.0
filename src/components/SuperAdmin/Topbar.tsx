import { useState } from "react";
import { IoMdNotifications } from "react-icons/io";

const AdminTopBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="bg-teal-600 text-white p-2.5 shadow-md flex justify-between items-center relative">
      <h1 className="text-3xl font-extrabold xl:ml-[33%]">
        Welcome Super Admin!
      </h1>
      <div className="relative">
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

export default AdminTopBar;
