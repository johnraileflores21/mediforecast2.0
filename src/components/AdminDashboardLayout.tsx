import React, { ReactNode } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminTopBar from "./AdminTopbar";

interface DashboardLayoutProps {
    children: ReactNode;
}

const AdminDashboardLayout = ({ children }: DashboardLayoutProps) => {
    return (
        <div className="min-h-screen flex">
            <AdminSidebar />
            <div className="flex-1 flex flex-col overflow-x-auto">
                <AdminTopBar />
                <main className="flex-1 p-8 bg-gray-100 overflow-x-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminDashboardLayout;
