import React from "react";
import AdminDashboardLayout from "./AdminDashboardLayout";
import { MdInventory } from "react-icons/md";
import { FaQuestionCircle } from "react-icons/fa";
import { FaFileShield } from "react-icons/fa6";

const AdminDashboard = () => {
    return (
        <AdminDashboardLayout>
            <h1 className="text-3xl font-bold mb-4">
                Welcome to the Dashboard
            </h1>
            <div className="grid grid-cols-4 gap-4">
                <div className="w-full h-36 rounded-lg bg-customPurple p-6 shadow-md dark:bg-neutral-700 mb-4">
                    <div className="flex justify-between">
                        <h1 className="text-xl font-bold text-white mt-1 dark:text-neutral-200">
                            INVENTORY
                        </h1>
                        <MdInventory className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-white mt-7">
                        1,024
                    </h1>
                </div>
                <div className="w-full h-36 rounded-lg bg-customGreen p-6 shadow-md dark:bg-neutral-700 mb-4">
                    <div className="flex justify-between">
                        <h1 className="text-xl font-bold text-white mt-1 dark:text-neutral-200">
                            REQUEST
                        </h1>
                        <FaQuestionCircle className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-white mt-7">5</h1>
                </div>
                <div className="w-full h-36 rounded-lg bg-customPink p-6 shadow-md dark:bg-neutral-700 mb-4">
                    <div className="flex justify-between">
                        <h1 className="text-xl font-bold text-white mt-1 dark:text-neutral-200">
                            ITR RECORDS
                        </h1>
                        <FaFileShield className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-white mt-7">
                        2,149
                    </h1>
                </div>
                <div className="w-full h-36 rounded-lg bg-customBlue p-6 shadow-md dark:bg-neutral-700 mb-4">
                    <div className="flex justify-between">
                        <h1 className="text-xl font-bold text-white mt-1 dark:text-neutral-200">
                            SDT RECORDS
                        </h1>
                        <FaFileShield className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-white mt-7">
                        1,204
                    </h1>
                </div>
            </div>
        </AdminDashboardLayout>
    );
};

export default AdminDashboard;
