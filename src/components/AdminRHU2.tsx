import React from "react";
import DashboardLayout from "./AdminDashboardLayout";

const AdminRHU2 = () => {
    return (
        <DashboardLayout>
            <h1 className="text-3xl font-bold mb-4">Rural Health Unit II</h1>
            {/* <div className="bg-white p-6 rounded-lg shadow-md mt-8 w-full overflow-x-auto overflow-scroll ">
                <div className="flex items-center justify-center mt-5 max-w-max">
                    <div className="w-full xl:w-full max-w-max">
                        <table className="min-w-full divide-y divide-gray-200 ">
                            <thead className="bg-gray-300 sticky">
                                <tr>
                                    <th className="px-6 text-left text-xs font-medium text-black uppercase tracking-wider">
                                        First Name
                                    </th>
                                    <th className="px-6  text-left text-xs font-medium text-black uppercase tracking-wider">
                                        Middle Name
                                    </th>
                                    <th className="px-6  text-left text-xs font-medium text-black uppercase tracking-wider">
                                        Last Name
                                    </th>
                                    <th className="px-6  text-left text-xs font-medium text-black uppercase tracking-wider">
                                        Contact
                                    </th>
                                    <th className="px-6 left text-xs font-medium text-black uppercase tracking-wider">
                                        Barangay
                                    </th>
                                    <th className="px-6 text-left text-xs font-medium text-black uppercase tracking-wider">
                                        Medicine Name
                                    </th>
                                    <th className="px-6  text-left text-xs font-medium text-black uppercase tracking-wider">
                                        Medicine Quantity
                                    </th>
                                    <th className="px-6  text-left text-xs font-medium text-black uppercase tracking-wider">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                <tr>
                                    <td className="pl-4 py-2 whitespace-nowrap">
                                        John Raile
                                    </td>
                                    <td className="pl-4 py-2 whitespace-nowrap">
                                        Esguerra
                                    </td>
                                    <td className="pl-4 py-2 whitespace-nowrap">
                                        Flores
                                    </td>
                                    <td className="pl-4 py-2 whitespace-nowrap">
                                        123441241
                                    </td>
                                    <td className="pl-4 py-2 whitespace-nowrap">
                                        San Vicente
                                    </td>
                                    <td className="pl-4 py-2 whitespace-nowrap">
                                        Biogesic
                                    </td>
                                    <td className="pl-4 py-2 whitespace-nowrap">
                                        20 box
                                    </td>
                                    <td className="py-2 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <button className="bg-blue-500 rounded-md text-white p-2 hover:bg-blue-700 mr-2 flex items-center">
                                                <img
                                                    src="/images/check.png"
                                                    alt="Approve Icon"
                                                    className="w-5 h-5 mr-1"
                                                />
                                                <span className="mr-4">
                                                    Approve
                                                </span>
                                            </button>
                                            <button className="bg-red-500 rounded-md text-white p-2 hover:bg-red-700 flex items-center ">
                                                <img
                                                    src="/images/wrong.png"
                                                    alt="Decline Icon"
                                                    className="w-5 h-5 mr-1"
                                                />
                                                <span className="mr-4">
                                                    Decline
                                                </span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                
                            </tbody>
                        </table>
                    </div>
                </div>
            </div> */}
            <div className="bg-white p-6 rounded-lg  mt-8 w-full overflow-x-auto overflow-scroll ">
                <div className="relative overflow-x-auto  sm:rounded-lg mt-3">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-300 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-center border text-xs font-bold text-black"
                                >
                                    First Name
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-center border text-xs font-bold text-black"
                                >
                                    Middle Name
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-center border text-xs font-bold text-black"
                                >
                                    Last Name
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-center border text-xs font-bold text-black"
                                >
                                    Age
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-center border text-xs font-bold text-black"
                                >
                                    Email
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-center border text-xs font-bold text-black"
                                >
                                    Gender
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 border text-center text-xs font-bold text-black"
                                >
                                    Address
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 border text-center text-xs font-bold text-black"
                                >
                                    Image
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 border text-center text-xs font-bold text-black"
                                >
                                    ID Front
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 border text-center text-xs font-bold text-black"
                                >
                                    ID Back
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 border text-center text-xs font-bold text-black"
                                >
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    John Raile
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                                    Esguerra
                                </td>
                                <td className="px-6 py-4 text-gray-900">
                                    Flores
                                </td>
                                <td className="px-6 py-4 text-gray-900">21</td>
                                <td className="px-6 py-4 text-gray-900">
                                    example@gmail.com
                                </td>
                                <td className="px-6 py-4 text-gray-900">
                                    Male
                                </td>
                                <td className="px-6 py-4 text-gray-900">
                                    Sulipan, Apalit, Pampanga
                                </td>
                                <td className="px-6 py-4 text-gray-900">#</td>
                                <td className="px-6 py-4 text-gray-900">#</td>
                                <td className="px-6 py-4 text-gray-900">#</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        <button className="bg-blue-500 rounded-md text-white p-2 hover:bg-blue-700 mr-2 flex items-center">
                                            <img
                                                src="/images/check.png"
                                                alt="Approve Icon"
                                                className="w-5 h-5"
                                            />
                                            <span className="mr-5">
                                                Approve
                                            </span>
                                        </button>
                                        <button className="bg-red-500 rounded-md text-white p-2 hover:bg-red-700 flex items-center">
                                            <img
                                                src="/images/wrong.png"
                                                alt="Decline Icon"
                                                className="w-5 h-5"
                                            />
                                            <span className="mr-5">
                                                Decline
                                            </span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminRHU2;
