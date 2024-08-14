import React, { useState } from "react";
import DashboardLayout from "./DashboardLayout";
import { FaEye, FaCaretDown } from "react-icons/fa";
import { IoMdAddCircle } from "react-icons/io";
import { IoSearchOutline } from "react-icons/io5";

const Request = () => {
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [selectedOption, setSelectedOption] = useState<string>("All");
    const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
    const [items, setItems] = useState<any[]>([]);
    const [modalAdd, setModalAdd] = useState(false);

    const handleAdd = () => setModalAdd(true);
    const closeModalAdd = () => setModalAdd(false);
    const handleSearchInputChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => setSearchQuery(event.target.value);

    const handleOptionSelect = (select: string) => {
        setSelectedOption(select);
        setDropdownOpen(false);
    };
    const filteredAndSortedItems = items
        .filter(
            (item) =>
                selectedOption === "All" ||
                (selectedOption === "Medicines" && item.type === "Medicine") ||
                (selectedOption === "Vaccines" && item.type === "Vaccine") ||
                (selectedOption === "Vitamins" && item.type === "Vitamin")
        )
        .filter(
            (item) =>
                item.medicineBrandName
                    ?.toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                item.medicineGenericName
                    ?.toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                item.vaccineName
                    ?.toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                item.vitaminBrandName
                    ?.toLowerCase()
                    .includes(searchQuery.toLowerCase())
        );
    const handleDropdown = () => setDropdownOpen(!dropdownOpen);
    return (
        <DashboardLayout>
            <h1 className="text-3xl font-bold mb-4">Request</h1>
            <div className="flex justify-between mb-2 mt-10">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={handleSearchInputChange}
                        className="border border-gray-300 rounded-md p-2 pl-8 shadow-md"
                    />
                    <IoSearchOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                </div>

                {/* <button
                    onClick={handleAdd}
                    className="bg-green-500 text-white p-2 hover:bg-green-700 rounded-md font-bold flex items-center space-x-1"
                >
                    <IoMdAddCircle className="w-5 h-5" />
                    <span>Add</span>
                </button> */}
                <div className="dropdown w-28 relative">
                    <div
                        tabIndex={0}
                        role="button"
                        className="bg-teal-600 text-white text-sm rounded-lg py-3 mb-2 text-center font-bold flex justify-center items-center"
                        onClick={handleDropdown}
                    >
                        {selectedOption}
                        <FaCaretDown className="w-4 h-4 text-white ml-1" />
                    </div>

                    {dropdownOpen && (
                        <ul
                            tabIndex={0}
                            className="dropdown-content menu rounded-box z-[50] absolute w-52 p-2 shadow bg-teal-600 text-white"
                        >
                            <li className="hover:bg-base-100 rounded-lg hover:text-black">
                                <a onClick={() => handleOptionSelect("All")}>
                                    All
                                </a>
                            </li>
                            <li className="hover:bg-base-100 rounded-lg hover:text-black">
                                <a
                                    onClick={() =>
                                        handleOptionSelect("Medicines")
                                    }
                                >
                                    Medicines
                                </a>
                            </li>
                            <li className="hover:bg-base-100 rounded-lg hover:text-black">
                                <a
                                    onClick={() =>
                                        handleOptionSelect("Vaccines")
                                    }
                                >
                                    Vaccines
                                </a>
                            </li>
                            <li className="hover:bg-base-100 rounded-lg hover:text-black">
                                <a
                                    onClick={() =>
                                        handleOptionSelect("Vitamins")
                                    }
                                >
                                    Vitamins
                                </a>
                            </li>
                        </ul>
                    )}
                </div>
            </div>

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
                                    Barangay
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-center border text-xs font-bold text-black"
                                >
                                    Item Name
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 border text-center text-xs font-bold text-black"
                                >
                                    Quantity
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 border text-center text-xs font-bold text-black"
                                >
                                    Reason
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
                                <td className="px-6 py-4 text-gray-900">
                                    Sulipan
                                </td>
                                <td className="px-6 py-4 text-gray-900">
                                    Biogesic(Paracetamol)
                                </td>
                                <td className="px-6 py-4 text-gray-900">100</td>
                                <td className="px-6 py-4 text-gray-900">
                                    Low Stock
                                </td>
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

export default Request;
