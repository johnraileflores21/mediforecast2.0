import { useState } from "react";
import { IoMdNotifications, IoMdMenu } from "react-icons/io";
import { useUser } from "./User";

interface TopBarProps {
  toggleSidebar: () => void;
}

const TopBar = ({ toggleSidebar }: TopBarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="bg-teal-600 text-white p-2.5 shadow-md flex justify-between items-center relative">
      <button onClick={toggleSidebar} className="lg:hidden">
        <IoMdMenu className="h-7 w-7 text-white" />
      </button>
      <h1 className="text-3xl font-extrabold xl:ml-[30%]">
        Rural Health Unit{" "}
        {user?.rhu === "1" ? (
          <span>I</span>
        ) : user?.rhu === "2" ? (
          <span>II</span>
        ) : user?.rhu === "3" ? (
          <span>III</span>
        ) : null}
      </h1>
      <div className="relative">
        <button
          onClick={toggleDropdown}
          className="relative z-10 block rounded-md focus:outline-none"
        >
          <IoMdNotifications className="h-7 w-7 text-white" />
        </button>
        {isOpen && (
          <div className="absolute right-0 mt-2 w-80 bg-white text-teal-800 rounded-md shadow-lg overflow-hidden z-20">
            <div className="divide-y divide-gray-200">
              <a
                href="#"
                className="flex px-4 py-3 hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="relative flex-shrink-0">
                  <img
                    className="rounded-full w-12 h-12"
                    src="images/2.jpg"
                    alt="Jese image"
                  />
                  <div className="absolute flex items-center justify-center w-5 h-5 -top-1 -right-1 bg-blue-600 border border-white rounded-full">
                    <svg
                      className="w-3 h-3 text-white"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 18 18"
                    >
                      <path d="M1 18h16a1 1 0 0 0 1-1v-6h-4.439a.99.99 0 0 0-.908.6 3.978 3.978 0 0 1-7.306 0 .99.99 0 0 0-.908-.6H0v6a1 1 0 0 0 1 1Z" />
                      <path d="M4.439 9a2.99 2.99 0 0 1 2.742 1.8 1.977 1.977 0 0 0 3.638 0A2.99 2.99 0 0 1 13.561 9H17.8L15.977.783A1 1 0 0 0 15 0H3a1 1 0 0 0-.977.783L.2 9h4.239Z" />
                    </svg>
                  </div>
                </div>
                <div className="w-full ps-3">
                  <div className="text-gray-700 text-sm mb-1.5">
                    New message from{" "}
                    <span className="font-semibold text-gray-900">
                      Rural Health Unit 2
                    </span>
                    : "Hey, what's up? All set for the presentation?"
                  </div>
                  <div className="text-xs text-blue-600">a few moments ago</div>
                </div>
              </a>
              <a
                href="#"
                className="flex px-4 py-3 hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="relative flex-shrink-0">
                  <img
                    className="rounded-full w-12 h-12"
                    src="images/3.jpg"
                    alt="Joseph image"
                  />
                  <div className="absolute flex items-center justify-center w-5 h-5 -top-1 -right-1 bg-gray-900 border border-white rounded-full">
                    <svg
                      className="w-3 h-3 text-white"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 18"
                    >
                      <path d="M6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Zm11-3h-2V5a1 1 0 0 0-2 0v2h-2a1 1 0 1 0 0 2h2v2a1 1 0 0 0 2 0V9h2a1 1 0 1 0 0-2Z" />
                    </svg>
                  </div>
                </div>
                <div className="w-full ps-3">
                  <div className="text-gray-700 text-sm mb-1.5">
                    <span className="font-semibold text-gray-900">
                      Rural Health Unit 3
                    </span>{" "}
                    and{" "}
                    <span className="font-medium text-gray-900">5 others</span>{" "}
                    started following you.
                  </div>
                  <div className="text-xs text-blue-600">10 minutes ago</div>
                </div>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopBar;
