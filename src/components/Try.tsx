import React, { useState, useEffect } from "react";
import { db, storage } from "../firebase";
import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import DashboardLayout from "./DashboardLayout";
import { IoMdAddCircle } from "react-icons/io";
import ModalAdd from "./ModalAdd";
import ModalViewMedicine from "./ModalViewMedicine";
import ModalEditMedicine from "./ModalEditMedicine";
import { IoSearchOutline } from "react-icons/io5";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ModalEditVaccine from "./ModalEditVaccine";
import ModalViewVaccine from "./ModalViewVaccine";
import ModalViewVitamins from "./ModalViewVitamins";
import ModalEditVitamins from "./ModalEditVitamins";
import { FaTruck } from "react-icons/fa6";
import ModalDistribute from "./DistributeMedicine";
import { FaEye, FaCaretDown } from "react-icons/fa";
import { MdDelete, MdEdit } from "react-icons/md";
import { useUser } from "./User";
import DistributeVitamin from "./DistributeVitamin";
import ScrollToTop from "./ScrollToTop";
import DistributeVaccine from "./DistributeVaccine";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const Try: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  const [modalAdd, setModalAdd] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [modalView, setModalView] = useState(false);
  const [viewId, setViewId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [modalEdit, setModalEdit] = useState(false);
  const [modalViewVaccine, setModalViewVaccine] = useState(false);
  const [modalEditVaccine, setModalEditVaccine] = useState(false);
  const [modalViewVitamin, setModalViewVitamin] = useState(false);
  const [modalEditVitamin, setModalEditVitamin] = useState(false);
  const [modalDistribute, setModalDistribute] = useState(false);
  const [distributeVitamin, setDistributeVitamin] = useState(false);
  const [distributeVaccine, setDistributeVaccine] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedOption, setSelectedOption] = useState<string>("All");
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const { user } = useUser();
  const MySwal = withReactContent(Swal);

  let inventory = "";

  if (user?.rhu === "1") {
    inventory = "RHU1Inventory";
  } else if (user?.rhu === "2") {
    inventory = "RHU2Inventory";
  } else {
    inventory = "RHU3Inventory";
  }

  useEffect(() => {
    const unsub = onSnapshot(collection(db, inventory), (snapshot) => {
      const itemsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setItems(itemsData);
    });
    return () => unsub();
  }, [inventory]);

  const handleAdd = () => setModalAdd(true);
  const closeModalAdd = () => setModalAdd(false);

  const handleDelete = async (id: string) => {
    // setShowDeleteModal(true);
    MySwal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteDoc(doc(db, inventory, id));
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success",
          });
        } catch (error) {
          console.error("Error deleting document: ", error);
        }
      }
    });
    // setDeleteId(id);
  };

  // const confirmDelete = async (item: any) => {
  //   if (deleteId) {
  //     setShowDeleteModal(false);
  //     try {
  //       await deleteDoc(doc(db, inventory, deleteId));
  //     } catch (error) {
  //       console.error("Error deleting document: ", error);
  //     } finally {
  //       setDeleteId(null);
  //     }
  //   }
  // };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  const handleView = (item: any) => {
    setViewId(item.id);
    if (item.type === "Medicine") {
      setModalView(true);
    } else if (item.type === "Vaccine") {
      setModalViewVaccine(true);
    } else if (item.type === "Vitamin") {
      setModalViewVitamin(true);
    }
  };

  const closeModalView = () => setModalView(false);
  const closeModalViewVaccine = () => setModalViewVaccine(false);
  const closeModalViewVitamin = () => setModalViewVitamin(false);

  const handleEdit = (item: any) => {
    setEditId(item.id);
    if (item.type === "Medicine") {
      setModalEdit(true);
    } else if (item.type === "Vaccine") {
      setModalEditVaccine(true);
    } else if (item.type === "Vitamin") {
      setModalEditVitamin(true);
    }
  };

  const closeModalEdit = () => setModalEdit(false);
  const closeModalEditVaccine = () => setModalEditVaccine(false);
  const closeModalEditVitamin = () => setModalEditVitamin(false);

  const handleDistribute = (item: any) => {
    setViewId(item.id);
    if (item.type === "Medicine") {
      setModalDistribute(true);
    } else if (item.type === "Vaccine") {
      return;
    } else if (item.type === "Vitamin") {
      setDistributeVitamin(true);
    }
  };

  const closeDistribute = () => {
    setModalDistribute(false);
    setDistributeVitamin(false);
    setViewId(null);
  };

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => setSearchQuery(event.target.value);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };
  const handleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleOptionSelect = (select: string) => {
    setSelectedOption(select);
    setDropdownOpen(false);
  };
  // const getUniqueItems = (items: any[]) => {
  //     const uniqueItems = new Map();
  //     for (const item of items) {
  //         const key =
  //             item.medicineBrandName || item.vitaminBrandName || item.vaccineName;
  //         if (!uniqueItems.has(key)) {
  //             uniqueItems.set(key, item);
  //         }
  //     }
  //     return Array.from(uniqueItems.values());
  // };

  // const filteredAndSortedItems = getUniqueItems(
  //     items
  //         .filter(
  //             (item) =>
  //                 selectedOption === "All" ||
  //                 (selectedOption === "Medicines" && item.type === "Medicine") ||
  //                 (selectedOption === "Vaccines" && item.type === "Vaccine") ||
  //                 (selectedOption === "Vitamins" && item.type === "Vitamin")
  //         )
  //         .filter(
  //             (item) =>
  //                 item.medicineBrandName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //                 item.medicineGenericName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //                 item.vaccineName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //                 item.vitaminBrandName?.toLowerCase().includes(searchQuery.toLowerCase())
  //         )
  // );
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
        item.vaccineName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.vitaminBrandName?.toLowerCase().includes(searchQuery.toLowerCase())
    );
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
            <li className="hover:bg-base-100 rounded-lg hover:text-black">
              <a onClick={() => handleOptionSelect("All")}>All</a>
            </li>
            <li className="hover:bg-base-100 rounded-lg hover:text-black">
              <a onClick={() => handleOptionSelect("Medicines")}>Medicines</a>
            </li>
            <li className="hover:bg-base-100 rounded-lg hover:text-black">
              <a onClick={() => handleOptionSelect("Vaccines")}>Vaccines</a>
            </li>
            <li className="hover:bg-base-100 rounded-lg hover:text-black">
              <a onClick={() => handleOptionSelect("Vitamins")}>Vitamins</a>
            </li>
          </ul>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        {filteredAndSortedItems.map((item) => (
          <div
            key={item.id}
            className="block rounded-lg bg-white shadow-lg dark:bg-neutral-700 text-left"
          >
            <a href="#">
              <img
                className="rounded-t-lg w-full h-32 object-cover shadow-md flex justify-center items-center"
                src={item.medicineImg || item.vaccineImg || item.vitaminImg}
                alt={
                  item.medicineBrandName ||
                  item.vaccineName ||
                  item.vaccineBrandName
                }
              />
            </a>
            <div className="overflow-auto">
              <button className="border-b-2 border-neutral-100 px-6 py-4 dark:border-neutral-500 w-full">
                {/* <div className="flex justify-center items-center mt-1">
                                    {" "}
                                    <h3 className="font-extrabold">
                                        {item.type}
                                    </h3>
                                </div> */}
                <h5 className="text-center text-neutral-500 dark:text-neutral-300">
                  <span className="text-black font-bold">
                    {item.medicineBrandName ||
                      item.vaccineName ||
                      item.vitaminBrandName}
                  </span>
                  <div>
                    {/* <div className="inline-block whitespace-nowrap rounded-[0.27rem] bg-gray-100 px-[0.65em] pb-[0.25em] pt-[0.35em] text-center align-baseline text-[0.75em] font-bold leading-none text-gray-700">
                                            {item.medicineStock ||
                                                item.vaccineStock ||
                                                item.vitaminStock}
                                        </div> */}
                    {(item.medicineStock ||
                      item.vaccineStock ||
                      item.vitaminStock) && (
                      <div>
                        {item.medicineStock && (
                          <>
                            {item.medicineStock > 1 ? (
                              <span>{item.medicineStock} boxes</span>
                            ) : (
                              <span>{item.medicineStock} box</span>
                            )}
                          </>
                        )}
                        <div>
                          <span>
                            ({item.medicineClassification}{" "}
                            {item.medicineDosageForm}
                            {item.medicineClassification > 1 ? "s" : null} per
                            box)
                          </span>
                        </div>
                        {/* Add similar conditions for vaccineStock and vitaminStock if needed */}
                        {item.vaccineStock && (
                          <>
                            {item.vaccineStock > 1 ? (
                              <span>{item.vaccineStock} boxes</span>
                            ) : (
                              <span>{item.vaccineStock} box</span>
                            )}
                            {/* <span> ({item.medicineClassification})</span> */}
                          </>
                        )}
                        {item.vitaminStock && (
                          <>
                            {item.vitaminStock > 1 ? (
                              <span>{item.vitaminStock} boxes</span>
                            ) : (
                              <span>{item.vitaminStock} box</span>
                            )}
                            {/* <span> ({item.medicineClassification})</span> */}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  <span className="">
                    {formatDate(
                      item.medicineExpiration ||
                        item.vaccineExpiration ||
                        item.vitaminExpiration
                    )}
                  </span>
                </h5>
              </button>

              <div className="border-t-1 border-neutral-500 px-6 py-4 dark:border-neutral-900">
                <div className="flex items-center justify-center">
                  <button
                    onClick={() => handleDistribute(item)}
                    className="bg-green-800 rounded-md text-white p-2 hover:bg-green-600 mr-4"
                  >
                    <FaTruck className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleView(item)}
                    className="bg-blue-600 rounded-md text-white p-2 hover:bg-blue-800 mr-4 flex items-center space-x-1"
                  >
                    <FaEye className="w-5 h-5 text-white" />
                  </button>
                  <button
                    onClick={() => handleEdit(item)}
                    className="bg-yellow-800 rounded-md text-white p-2 hover:bg-yellow-600 mr-4"
                  >
                    <MdEdit className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-600 rounded-md text-white p-2 hover:bg-red-800 mr-4"
                  >
                    <MdDelete className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* {showDeleteModal && (
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
                    strokeWidth="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                    />
                  </svg>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3
                      className="text-lg leading-6 font-medium text-gray-900"
                      id="modal-headline"
                    >
                      Delete Item Confirmation
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete this item?
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
                  onClick={closeDeleteModal}
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )} */}

      {modalAdd && <ModalAdd showModal={modalAdd} closeModal={closeModalAdd} />}

      {modalView && viewId && (
        <ModalViewMedicine
          showModal={modalView}
          closeModal={closeModalView}
          viewId={viewId}
        />
      )}

      {modalEdit && editId && (
        <ModalEditMedicine
          showModal={modalEdit}
          closeModal={closeModalEdit}
          editId={editId}
        />
      )}

      {modalEditVaccine && (
        <ModalEditVaccine
          showModal={modalEditVaccine}
          closeModal={closeModalEditVaccine}
          editId={editId}
        />
      )}

      {modalViewVaccine && viewId && (
        <ModalViewVaccine
          showModal={modalViewVaccine}
          closeModal={closeModalViewVaccine}
          viewId={viewId}
        />
      )}
      {modalViewVitamin && viewId && (
        <ModalViewVitamins
          showModal={modalViewVitamin}
          closeModal={closeModalViewVitamin}
          viewId={viewId}
        />
      )}
      {modalEditVitamin && editId && (
        <ModalEditVitamins
          showModal={modalEditVitamin}
          closeModal={closeModalEditVitamin}
          editId={editId}
        />
      )}
      {modalDistribute && (
        <ModalDistribute
          showModal={modalDistribute}
          closeModal={closeDistribute}
          viewId={viewId}
        />
      )}
      {distributeVitamin && (
        <DistributeVitamin
          showModal={distributeVitamin}
          closeModal={closeDistribute}
          viewId={viewId}
        />
      )}

      <ToastContainer />
      <ScrollToTop />
    </DashboardLayout>
  );
};

export default Try;
