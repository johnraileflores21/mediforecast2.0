import React, { ReactNode, useState } from "react";
import Sidebar from "./sidebar";
import TopBar from "./TopBar";
import { useUser } from "./User";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useUser();
  console.log(user);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen flex">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar toggleSidebar={toggleSidebar} />
        <main className="flex-1 p-8 bg-gray-100 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
