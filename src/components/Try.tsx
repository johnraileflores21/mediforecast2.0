import React, { useState, useEffect } from "react";
import { db, storage } from "../firebase";
import { collection, onSnapshot, deleteDoc, doc, query, where, getDocs, getDoc } from "firebase/firestore";
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
  const [form, setForm] = useState<string | null>(null);
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

  // let inventory = "";

  // if (user?.rhuOrBarangay === "1") {
  //   inventory = "RHU1Inventory";
  // } else if (user?.rhuOrBarangay === "2") {
  //   inventory = "RHU2Inventory";
  // } else if (user?.rhuOrBarangay === "3") {
  //   inventory = "RHU3Inventory";
  // }

  const fetchData = async () => {
    try {
      const inventoryQuery = query(
        collection(db, user?.role.includes("Barangay") ? "BarangayInventory" : "Inventory"),
        where("userId", "==", user?.uid)
      );

      const inventorySnap = await getDocs(inventoryQuery);
      const inventoryItems = inventorySnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setItems(inventoryItems);
      console.log("inventoryItems :>> ", inventoryItems);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    console.log('user :>> ', user);
    fetchData();
  }, [user?.rhuOrBarangay]);

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
          await deleteDoc(doc(db, "Inventory", id));
          Swal.fire({
            title: "Deleted!",
            text: "Item has been deleted.",
            icon: "success",
          });
          fetchData();
        } catch (error) {
          console.error("Error deleting document: ", error);
        }
      }
    });
  };

  const handleView = (item: any) => {
    console.log("item :>> ", item)
    setForm(item);
    if (item.type === "Medicine") {
      setModalView(true);
    } else if (item.type === "Vaccine") {
      setModalViewVaccine(true);
    } else if (item.type === "Vitamin") {
      setModalViewVitamin(true);
    }
    console.log("modalView :>> ", modalView)
  };

  const closeModalView = () => setModalView(false);
  const closeModalViewVaccine = () => setModalViewVaccine(false);
  const closeModalViewVitamin = () => setModalViewVitamin(false);

  const handleEdit = (item: any) => {
    console.log("edit item :>> ", item)
    setForm(item);
    if (item.type === "Medicine") {
      setModalEdit(true);
    } else if (item.type === "Vaccine") {
      setModalEditVaccine(true);
    } else if (item.type === "Vitamin") {
      setModalEditVitamin(true);
    }
  };

  const closeModalEdit = (bool: any) => {
    if(bool) fetchData();
    setModalEdit(false);
  };
  const closeModalEditVaccine = () => setModalEditVaccine(false);
  const closeModalEditVitamin = (bool: any) => {
    if(bool) fetchData();
    setModalEditVitamin(false);
  }

  const handleDistribute = (item: any) => {
    setForm(item);
    if(item.type === "Medicine") {
      setModalDistribute(true);
    } else if (item.type === "Vaccine") {
      return;
    } else if (item.type === "Vitamin") {
      setDistributeVitamin(true);
    }
  };

  const closeDistribute = (bool: any) => {
    if(bool) fetchData();
    setModalDistribute(false);
    setDistributeVitamin(false);
    setForm(null);
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
                          <span>Stock: {item.medicineStock || item.vitaminStock || item.vaccineStock}</span>
                        <div>
                          <span>
                            {item.medicineClassification &&
                              `${item.medicineClassification}
                              ${(item.medicineDosageForm || "").toLowerCase()}${parseInt(item.medicineClassification) > 1 && "s"}
                              per item`
                            }
                          </span>
                        </div>
                        {/* Add similar conditions for vaccineStock and vitaminStock if needed */}
                        {item.vaccineStock && (
                          <>
                            {
                                item.vaccineClassification.includes('ml') ?
                                <>{item.vaccineClassification} per item</> :
                                <>
                                  {item.vaccineClassification} {`${item.vaccineDosageForm.toLowerCase()}${parseInt(item.vaccineClassification) > 1 && "s"} per item`}
                                </>
                              }
                          </>
                        )}
                        {item.vitaminStock && (
                          <>
                            <span>
                              {
                                item.vitaminClassification.includes('ml') ?
                                <>{item.vitaminClassification} per item</> :
                                <>
                                  {item.vitaminClassification} {`${item.vitaminDosageForm.toLowerCase()}${parseInt(item.vitaminClassification) > 1 && "s"} per item`}
                                </>
                              }
                            </span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  <span className="">
                    Expiration: {formatDate(
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
                  {!user?.role.includes('Barangay') && <button
                    onClick={() => handleEdit(item)}
                    className="bg-yellow-800 rounded-md text-white p-2 hover:bg-yellow-600 mr-4"
                  >
                    <MdEdit className="w-5 h-5" />
                  </button>}

                  {!user?.role.includes('Barangay') && <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-600 rounded-md text-white p-2 hover:bg-red-800 mr-4"
                  >
                    <MdDelete className="w-5 h-5" />
                  </button>}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modalAdd && <ModalAdd showModal={modalAdd} closeModal={closeModalAdd} />}

      {modalView && form && (
        <ModalViewMedicine
          showModal={modalView}
          closeModal={closeModalView}
          data={form}
        />
      )}

      {modalEdit && form && (
        <ModalEditMedicine
          showModal={modalEdit}
          closeModal={closeModalEdit}
          data={form}
        />
      )}

      {modalEditVaccine && (
        <ModalEditVaccine
          showModal={modalEditVaccine}
          closeModal={closeModalEditVaccine}
          editId={editId}
        />
      )}

      {modalViewVaccine && form && (
        <ModalViewVaccine
          showModal={modalViewVaccine}
          closeModal={closeModalViewVaccine}
          viewId={null}
        />
      )}
      {modalViewVitamin && form && (
        <ModalViewVitamins
          showModal={modalViewVitamin}
          closeModal={closeModalViewVitamin}
          data={form}
        />
      )}
      {modalEditVitamin && form && (
        <ModalEditVitamins
          showModal={modalEditVitamin}
          closeModal={closeModalEditVitamin}
          data={form}
        />
      )}
      {modalDistribute && form && (
        <ModalDistribute
          showModal={modalDistribute}
          closeModal={closeDistribute}
          data={form}
        />
      )}
      {distributeVitamin && form && (
        <DistributeVitamin
          showModal={distributeVitamin}
          closeModal={closeDistribute}
          data={form}
        />
      )}

      <ToastContainer />
      <ScrollToTop />
    </DashboardLayout>
  );
};

export default Try;
