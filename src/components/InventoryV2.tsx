import { IoMdAddCircle } from "react-icons/io";
import DashboardLayout from "./DashboardLayout";
import { ToastContainer } from "react-toastify";
import { IoSearchOutline } from "react-icons/io5";
import { useState } from "react";
import { inventoryFilters } from "../assets/common/constants";
import { FaCaretDown } from "react-icons/fa";
import AddItemModal from './Inventory/AddModal';


export default function Inventory() {

    const [searchQuery, setSearchQuery] = useState<string>("");
    const [modalAdd, setModalAdd] = useState<boolean>(false);
    const [selectedOption, setSelectedOption] = useState<string>("All");
    const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

    const handleSearchInputChange = (event: any) => {
        setSearchQuery(event.target.value);
    };

    const handleAdd = () => {
        setModalAdd(true);
    };

    const closeModalAdd = () => {
        setModalAdd(false);
    };

    const handleOptionSelect = (select: string) => {
        setSelectedOption(select);
        setDropdownOpen(false);
    };

    const handleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    }

    

    return (
        <DashboardLayout>
            <ToastContainer />

            <h1 className="text-3xl font-bold mb-4">Inventory Management</h1>
            <div className="flex justify-between mb-4">
                <div className="relative shadow-md">
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    className="border border-gray-300 rounded-md p-2 pl-8"
                />
                <IoSearchOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                </div>

                <button
                    onClick={handleAdd}
                    className="bg-green-500 text-white p-2 hover:bg-green-700 rounded-md font-bold flex items-center space-x-1"
                >
                    <IoMdAddCircle className="w-5 h-5" />
                    <span>Add</span>
                </button>
            </div>
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
                        {inventoryFilters.map((item, index) => (
                            <li className="hover:bg-base-100 rounded-lg hover:text-black" key={index}>
                                <a onClick={() => handleOptionSelect(item)}>{item}</a>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* content */}
            <AddItemModal showModal={modalAdd} closeModal={closeModalAdd} />
            

        </DashboardLayout>
    );
}