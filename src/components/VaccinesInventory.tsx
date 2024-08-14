import React, { useState, useEffect } from "react";
import DashboardLayout from "./DashboardLayout";
import { auth, db } from "../firebase";
import {
    collection,
    doc,
    setDoc,
    getDocs,
    DocumentData,
    deleteDoc,
} from "firebase/firestore";
import ModalAdd from "./AddVaccine";
import ModalEditVaccine from "./ModalEditVaccine";
import ModalViewVaccine from "./ModalViewVaccine";
import { FaEye } from "react-icons/fa";
import {
    MdDelete,
    MdEdit,
    MdArrowBackIos,
    MdArrowForwardIos,
} from "react-icons/md";
import { IoMdAddCircle } from "react-icons/io";
import { IoSearchOutline } from "react-icons/io5";
import {
    AiOutlineSortAscending,
    AiOutlineSortDescending,
} from "react-icons/ai";

const VaccinesInventory = () => {
    const [userData, setUserData] = useState<DocumentData[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [modalAdd, setModalAdd] = useState(false);
    const [expandedRow, setExpandedRow] = useState<string | null>(null);
    const [modalEdit, setModalEdit] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [modalView, setModalView] = useState(false);
    const [viewId, setViewId] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<string>("asc");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const fetchData = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "Vaccines"));
            const userData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setUserData(userData);
        } catch (error) {
            console.error("Error fetching:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAdd = () => {
        setModalAdd(true);
    };

    const closeModalAdd = () => {
        setModalAdd(false);
    };

    const handleEdit = async (id: string) => {
        setModalEdit(true);
        setEditId(id);
    };

    const closeModalEdit = () => {
        setModalEdit(false);
    };

    const handleView = (id: string) => {
        setModalView(true);
        setViewId(id);
    };

    const closeModalView = () => {
        setModalView(false);
    };

    const handleDelete = async (id: string) => {
        setDeleteId(id);
        setShowModal(true);
    };

    const confirmDelete = async () => {
        if (deleteId) {
            try {
                await deleteDoc(doc(db, "Vaccines", deleteId));
                console.log("Document deleted successfully!");
                fetchData();
            } catch (error) {
                console.error("Error deleting document: ", error);
            } finally {
                setShowModal(false);
                setDeleteId(null);
            }
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setDeleteId(null);
    };

    const filteredData = userData.filter(
        (vaccine) =>
            vaccine.vaccineName
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            vaccine.vaccineDescription
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
    );

    const handleSearchInputChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setSearchQuery(event.target.value);
    };

    const handleSort = () => {
        const sortedData = [...userData].sort((a, b) => {
            if (a.vaccineName < b.vaccineName)
                return sortOrder === "asc" ? -1 : 1;
            if (a.vaccineName > b.vaccineName)
                return sortOrder === "asc" ? 1 : -1;
            return 0;
        });
        setUserData(sortedData);
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    };

    const toggleRowExpansion = (id: string) => {
        if (expandedRow === id) {
            setExpandedRow(null);
        } else {
            setExpandedRow(id);
        }
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    const pageNumbers: number[] = [];
    for (let i = 1; i <= Math.ceil(filteredData.length / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    let visiblePages: number[] = [];
    const maxVisiblePages = 3;
    const totalPages = pageNumbers.length;

    if (totalPages <= maxVisiblePages) {
        visiblePages = pageNumbers;
    } else {
        const halfVisible = Math.floor(maxVisiblePages / 2);
        const leftOffset = currentPage - 1;
        const rightOffset = totalPages - currentPage;
        if (leftOffset < halfVisible) {
            visiblePages = [...pageNumbers.slice(0, maxVisiblePages)];
        } else if (rightOffset < halfVisible) {
            visiblePages = [...pageNumbers.slice(totalPages - maxVisiblePages)];
        } else {
            visiblePages = [
                ...pageNumbers.slice(
                    currentPage - halfVisible - 1,
                    currentPage + halfVisible
                ),
            ];
        }
    }

    return (
        <>
            <h1 className="text-xl text-center font-bold ">Vaccines</h1>
            <div className="flex justify-between mb-4">
                <button
                    onClick={handleAdd}
                    className="bg-green-500 text-white p-2 hover:bg-green-700 rounded-md font-bold flex items-center space-x-1"
                >
                    <IoMdAddCircle className="w-5 h-5" />
                    <span>Add</span>
                </button>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={handleSearchInputChange}
                        className="border border-gray-300 rounded-md p-2 pl-8"
                    />
                    <IoSearchOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md mt-3">
                <div className="flex items-center justify-center mt-2">
                    <div className="overflow-x-auto w-full rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-300">
                                <tr>
                                    <th
                                        className="px-6 py-6 text-center text-xs border font-medium text-black uppercase tracking-wider cursor-pointer"
                                        onClick={handleSort}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold">
                                                Vaccine Name
                                            </span>
                                            {sortOrder === "asc" ? (
                                                <AiOutlineSortDescending className="w-5 h-5 ml-4" />
                                            ) : (
                                                <AiOutlineSortAscending className="w-5 h-5 ml-4" />
                                            )}
                                        </div>
                                    </th>
                                    <th className="px-6 py-6 text-center text-xs border font-bold text-black uppercase tracking-wider">
                                        Stock
                                    </th>
                                    <th className="px-6 py-6 text-center text-xs border font-bold text-black uppercase tracking-wider">
                                        Description
                                    </th>
                                    <th className="px-6 py-6 text-center text-xs border font-bold text-black uppercase tracking-wider">
                                        Expiration
                                    </th>
                                    <th className="px-6 py-6 text-center text-xs border sfont-bold text-black uppercase tracking-wider">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {currentItems.map((vaccine) => (
                                    <tr
                                        key={vaccine.id}
                                        className="relative"
                                        onMouseEnter={() =>
                                            setExpandedRow(vaccine.id)
                                        }
                                        onMouseLeave={() =>
                                            setExpandedRow(null)
                                        }
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {vaccine.vaccineName}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {vaccine.vaccineStock}{" "}
                                            {vaccine.vaccineStock > 1 ? (
                                                <span> vials</span>
                                            ) : (
                                                <span> vial</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {vaccine.vaccineDescription}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {vaccine.vaccineExpiration}
                                        </td>
                                        <td>
                                            <div className="flex items-center justify-center">
                                                {/* <Link
                                                    to={`/edit/${medicine.id}`}
                                                    className="bg-yellow-800 rounded-md text-white p-2 hover:bg-yellow-900 mr-4 flex items-center space-x-1"
                                                >
                                                    <img
                                                        src="/images/edit.png"
                                                        alt="Edit Icon"
                                                        className="w-5 h-5"
                                                    />
                                                    <span>Edit</span>
                                                </Link> */}
                                                <button
                                                    onClick={() =>
                                                        handleView(vaccine.id)
                                                    }
                                                    className="bg-blue-600 rounded-md text-white p-2 hover:bg-blue-800 mr-4 flex items-center space-x-1"
                                                >
                                                    <FaEye className="w-5 h-5 text-white" />
                                                    {/* <span>Edit</span> */}
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleEdit(vaccine.id)
                                                    }
                                                    className="bg-yellow-800 rounded-md text-white p-2 hover:bg-yellow-900 mr-4 flex items-center space-x-1"
                                                >
                                                    <MdEdit className="w-5 h-5" />
                                                    {/* <span>Edit</span> */}
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(vaccine.id)
                                                    }
                                                    className="bg-red-500 rounded-md text-white p-2 hover:bg-red-700 flex items-center space-x-1"
                                                >
                                                    <MdDelete className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="flex justify-center mt-4">
                    <nav className="block">
                        <ul className="flex pl-0 rounded list-none flex-wrap">
                            <li>
                                <button
                                    onClick={() =>
                                        setCurrentPage(currentPage - 1)
                                    }
                                    disabled={currentPage === 1}
                                    className={`${
                                        currentPage === 1
                                            ? "bg-gray-300 text-gray-600"
                                            : "bg-white text-blue-600 hover:bg-gray-200"
                                    } font-semibold py-2.5 px-4 border border-gray-300 rounded-l focus:outline-none`}
                                >
                                    <MdArrowBackIos className="w-5 h-5" />
                                </button>
                            </li>
                            {visiblePages.map((page, index) => (
                                <li key={index}>
                                    <button
                                        onClick={() => setCurrentPage(page)}
                                        className={`${
                                            currentPage === page
                                                ? "bg-blue-600 text-white hover:bg-blue-700"
                                                : "bg-white text-blue-600 hover:bg-gray-200"
                                        } font-semibold py-2 px-4 border border-gray-300 focus:outline-none`}
                                    >
                                        {page}
                                    </button>
                                </li>
                            ))}
                            <li>
                                <button
                                    onClick={() =>
                                        setCurrentPage(currentPage + 1)
                                    }
                                    disabled={currentPage === totalPages}
                                    className={`${
                                        currentPage === totalPages
                                            ? "bg-gray-300 text-gray-600"
                                            : "bg-white text-blue-600 hover:bg-gray-200"
                                    } font-semibold py-2.5 px-4 border border-gray-300 rounded-r focus:outline-none`}
                                >
                                    <MdArrowForwardIos className="w-5 h-5" />
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
            {modalAdd && (
                <ModalAdd
                    showModal={modalAdd}
                    closeModal={closeModalAdd}
                    // fetchData={fetchData}
                />
            )}
            {modalEdit && (
                <ModalEditVaccine
                    showModal={modalEdit}
                    closeModal={closeModalEdit}
                    // fetchData={fetchData}
                    editId={editId}
                />
            )}
            {modalView && (
                <ModalViewVaccine
                    showModal={modalView}
                    closeModal={closeModalView}
                    // fetchData={fetchData}
                    viewId={viewId}
                />
            )}
            {showModal && (
                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <span
                            className="hidden sm:inline-block sm:align-middle sm:h-screen"
                            aria-hidden="true"
                        >
                            &#8203;
                        </span>
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <svg
                                        className="h-12 w-12 text-red-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke-width="1.5"
                                        stroke="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                                        />
                                    </svg>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3
                                            className="text-lg leading-6 font-medium text-gray-900"
                                            id="modal-headline"
                                        >
                                            Delete Vaccine Confirmation
                                        </h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                Are you sure you want to delete
                                                this vaccine?
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    onClick={confirmDelete}
                                    type="button"
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={closeModal}
                                    type="button"
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default VaccinesInventory;
