import React, { useState, useEffect } from "react";
import { db, storage } from "../firebase";
import { collection, onSnapshot, deleteDoc, doc, query, where, getDocs, getDoc, updateDoc } from "firebase/firestore";
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
import { getTypes, RHUs } from "../assets/common/constants";
import { createHistoryLog }  from '../utils/historyService';
import notificationService from '../utils/notificationService';
import { useConfirmation } from '../hooks/useConfirmation';

const Try: React.FC = () => {
  const confirm = useConfirmation();

  const [items, setItems] = useState<any[]>([]);
  const [pendingItems, setPendingItems] = useState<any[]>([]);
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
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedOption, setSelectedOption] = useState<string>("All");
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const { user } = useUser();
  const MySwal = withReactContent(Swal);

  const isBarangay = user?.role.includes("Barangay");

  const fetchData = async () => {
    try {

      const unit = RHUs.findIndex((x: any) => x['barangays'].includes(user?.barangay)) + 1;
      console.log('unit :>> ', unit);

      const inventoryQuery = query(
        collection(db, isBarangay ? "BarangayInventory" : "Inventory"),
        where("created_by_unit", "==", isBarangay ? unit.toString() : user?.rhuOrBarangay)
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

  const fetchPending = async () => {
    try {
      const unit = RHUs.findIndex((x: any) => x['barangays'].includes(user?.barangay)) + 1;

      const inventoryQuery = query(
        collection(db, "BarangayInventory"),
        where("created_by_unit", "==", isBarangay ? unit.toString() : user?.rhuOrBarangay)
      );

      const inventorySnap = await getDocs(inventoryQuery);
      const inventoryItems = inventorySnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPendingItems(inventoryItems);
      console.log("pending :>> ", inventoryItems);
    } catch (error) {
      console.error("Error fetching pending :>> ", error);
    }
  }

  useEffect(() => {
    console.log('user :>> ', user);
    fetchData();
    fetchPending();
  }, [user?.rhuOrBarangay]);

  const handleAdd = () => setModalAdd(true);
  const closeModalAdd = (bool: any) => {
    if(bool) {
      fetchData();
      fetchPending();
    }
    setModalAdd(false);
  };

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

          const formatFullName = `${user?.firstname}${user?.middlename ? ` ${user?.middlename.charAt(0)}.` : ''} ${user?.lastname}`;
          await createHistoryLog({
            actionType: 'delete',
            itemId: id,
            itemName: '',
            fullName: formatFullName,
            barangay: '',
            performedBy: user?.uid || '',
            remarks: `Deleted item with id ${id}`,
          })

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

  const handleDistribute = async (item: any) => {
    setForm(item);
    if(item.type === "Medicine") {
      setModalDistribute(true);
      setDistributeVaccine(false);
      setDistributeVitamin(false);
    } else if (item.type === "Vaccine") {
      setModalDistribute(false);
      setDistributeVaccine(true);
      setDistributeVitamin(false);
    } else if (item.type === "Vitamin") {
      setModalDistribute(false);
      setDistributeVaccine(false);
      setDistributeVitamin(true);
    }
  };

  const closeDistribute = (bool: any) => {
    if(bool) fetchData();
    setModalDistribute(false);
    setDistributeVitamin(false);
    setForm(null);
  };






  /**
   * @description todo: update inventory (deduct stock), add to brgy inventory and update status to approved
   * @param data
   */


  const handleApprove = async (data: any) => {
    const isConfirmed = await confirm({
      title: 'Confirm Submission',
      message: 'Are you sure you want to receive this item?',
    });

    if(!isConfirmed) return;

    try {

      const barangayInventoryRef = doc(db, 'BarangayInventory', data.id);
      const distributionBarangayId = barangayInventoryRef.id;
      console.log('distributionBarangayId :>> ', distributionBarangayId);

      const distributionsQuery = query(
        collection(db, 'Distributions'),
        where('barangayInventoryId', '==', distributionBarangayId)
      );

      const querySnapshot = await getDocs(distributionsQuery);


      if (!querySnapshot.empty) {
          querySnapshot.forEach(async (docSnapshot) => {
              const distributionDocRef = doc(db, 'Distributions', docSnapshot.id);
              await updateDoc(distributionDocRef, { isDistributed: true });


              // get the index of the barangay where the user belongs
              const sentTo = RHUs.findIndex((x: any) => x['barangays'].includes(user?.barangay)) + 1;

              await notificationService.createNotification({
                action: 'receive',
                barangayItemId: distributionBarangayId,
                itemId: data.itemId,
                itemName: data.medicineBrandName || data.vaccineName || data.vitaminBrandName,
                itemType: data.type,
                quantity: data.pendingQuantity,
                description: `Received ${data.pendingQuantity} ${data.medicineBrandName || data.vaccineName || data.vitaminBrandName} by ${user?.barangay || ''}`,
                performedBy: user?.uid || '',
                sentBy: user?.uid || '',
                sentTo: sentTo.toString(),
              });


              console.log(`Updated document ${docSnapshot.id} with isDistributed: true`);
          });
      } else {
          console.log('No matching distribution found with barangayInventoryId:', distributionBarangayId);
      }



      // Check if the document exists
      const barangayInventoryDoc = await getDoc(barangayInventoryRef);
      console.log('data.id :>> ', data.id);

      if(!barangayInventoryDoc.exists()) {
        throw new Error(`No document found to update: ${data.id}`);
      }
        await updateDoc(barangayInventoryRef, {
          status: 'approved',
        });
        console.log('Document approved.');


      console.log('data.itemId :>> ', data.itemId);

      const inventoryRef = doc(db, 'Inventory', data.itemId);
      const inventoryDoc = await getDoc(inventoryRef);




      if(inventoryDoc.exists()) {

        const stockData = inventoryDoc.data();

        const typeVal = getTypes(stockData);
        console.log('typeVal :>> ', typeVal);

        const currentStock = stockData[`${typeVal}Stock`] || 0

        console.log('currentStock :>> ', currentStock);
        const newStock = currentStock - data.pendingQuantity;

        const formatFullName = `${user?.firstname}${user?.middlename ? ` ${user?.middlename.charAt(0)}.` : ''} ${user?.lastname}`;
        const itemName = typeVal == 'vaccine' ? data[`${typeVal}Name`] : data[`${typeVal}BrandName`];
        if(newStock >= 0) {
          await createHistoryLog({
            actionType: 'receive',
            itemId: data.itemId,
            itemName: itemName,
            fullName: formatFullName,
            barangay: user?.barangay || '',
            performedBy: user?.uid || '',
            remarks: `Received ${data.pendingQuantity} ${itemName}`,
          })

          await updateDoc(inventoryRef, {
            [`${typeVal}Stock`]: newStock,
          });
          Swal.fire({
            position: "center",
            icon: "success",
            title: `${itemName} has been added to your inventory`,
            showConfirmButton: false,
            timer: 1500,
          });
        } else {
          Swal.fire({
            position: "center",
            icon: "error",
            title: 'Insufficient stock.',
            showConfirmButton: false,
            timer: 1500,
          });
        }
      } else {
        Swal.fire({
          position: "center",
          icon: "error",
          title: 'Item doesn\'t exist.',
          showConfirmButton: false,
          timer: 1500,
        });
      }

    } catch (error) {
      console.error("Error approving item: ", error);
      Swal.fire({
        position: "center",
        icon: "error",
        title: 'Error receiving item',
        showConfirmButton: false,
        timer: 1500,
      });
    } finally {
      fetchData();
      fetchPending();
    }
  }

  const handleDecline = async (id: string) => {
    try {

    } catch (error) {

    }
  }

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
      <div className="flex mb-6">
          <button
            className={`px-4 py-2 ${selectedTab === 0 ? "bg-gray-300" : "bg-gray-200"}`}
            onClick={() => setSelectedTab(0)}
          >
            Inventory
          </button>
          <button
            className={`px-4 py-2 ${selectedTab === 1 ? "bg-gray-300" : "bg-gray-200"}`}
            onClick={() => setSelectedTab(1)}
          >
            Pending Distributions
          </button>
        </div>
        {selectedTab === 0 ?   <>
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

            {!isBarangay && <button
              onClick={handleAdd}
              className="bg-green-500 text-white p-2 hover:bg-green-700 rounded-md font-bold flex items-center space-x-1"
            >
              <IoMdAddCircle className="w-5 h-5" />
              <span>Add</span>
            </button>}
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
            {(filteredAndSortedItems).filter(x => x.status == 'approved' || x.status == null).map((item) => (
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
                        {(item.medicineStock !== null ||
                          item.vaccineStock  !== null ||
                          item.vitaminStock  !== null) && (
                          <div>
                              <span>Stock: {(item.medicineStock || 0) || (item.vitaminStock || 0) || (item.vaccineStock || 0)}</span>
                              {/* {item.id} */}
                            <div>
                              <span>
                                {
                                  (item.medicineClassification)
                                    ? (item.medicineClassification.includes('ml')
                                        ? `${item.medicinePiecesPerItem} per ${item.medicinePackaging}`
                                        : `${item.medicinePiecesPerItem}
                                          ${(item.medicineDosageForm || "").toLowerCase()}${parseInt(item.medicinePiecesPerItem) > 1 ? "s" : ""}
                                          per ${item.medicinePackaging}`)

                                    : (item.vitaminClassification)
                                      ? (item.vitaminClassification.includes('ml')
                                          ? `${item.vitaminPiecesPerItem} per ${item.vitaminPackaging}`
                                          : `${item.vitaminPiecesPerItem}
                                            ${(item.vitaminDosageForm || "").toLowerCase()}${parseInt(item.vitaminClassification) > 1 && "/s"}
                                            per ${item.vitaminPackaging}`)

                                    : ""
                                    // (item.vaccineClassification.includes('ml')
                                    //   ? `${item.vaccineClassification} per ${item.vaccinePackaging}`
                                    //   : `${item.vaccineClassification}
                                    //     ${(item.vaccineDosageForm || "").toLowerCase()}${parseInt(item.vaccineClassification) > 1 && "s"}
                                    //     per ${item.vaccinePackaging}`)
                                }
                                {/* {item.medicineClassification && item.vaccineClassification.includes('ml') &&
                                  `${item.medicineClassification}
                                  ${(item.medicineDosageForm || "").toLowerCase()}${parseInt(item.medicineClassification) > 1 && "s"}
                                  per ${item.medicinePackaging}`
                                } */}
                              </span>
                            </div>
                            {/* Add similar conditions for vaccineStock and vitaminStock if needed */}
                            {item.vaccineStock && (
                              <>
                                {/* {
                                    item.vaccineClassification.includes('ml') ?
                                    <>{item.vaccinePiecesPerItem} per ${item.vaccinePackaging}</> :
                                    <>
                                      {item.vaccinePiecesPerItem} {`${item.vaccineDosageForm.toLowerCase()}${parseInt(item.vaccinePiecesPerItem) > 1 && "s"} per ${item.vaccinePackaging}`}
                                    </>
                                  } */}
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
        </> : <>
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-300 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                  <th
                      scope="col"
                      className="px-6 py-3 border text-xs font-bold text-black"
                  >
                      Item Name
                  </th>
                  <th
                      scope="col"
                      className="px-6 py-3 border text-xs font-bold text-black"
                  >
                      Quantity
                  </th>
                  <th
                      scope="col"
                      className="px-6 py-3 border text-xs font-bold text-black"
                  >
                      Created Date
                  </th>
                  <th
                      scope="col"
                      className="px-6 py-3 border text-xs font-bold text-black"
                  >
                      Status
                  </th>
                  {user?.role?.includes('Barangay') && <th
                      scope="col"
                      className="px-6 py-3 border text-xs font-bold text-black"
                  >
                      Action
                  </th>}
              </tr>
          </thead>
          <tbody>
            {pendingItems.map((itemData, index) => (
              <tr
                  key={index}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                 <td className="px-6 py-4 text-gray-900">
                    {`${itemData.medicineBrandName || itemData.vitaminBrandName || itemData.vaccineName}`}
                    {itemData.type.toLowerCase() !== 'vaccine' && (
                      <>
                        {` (${itemData.medicineGenericName || itemData.vitaminGenericName})`}
                      </>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-900">
                      {itemData.pendingQuantity}
                  </td>
                  <td className="px-6 py-4 text-gray-900">
                      {formatDate(itemData.created_at)}
                  </td>
                  <td className="px-6 py-2">
                      <span
                          className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                              itemData.status === 'approved'
                                  ? 'bg-green-100 text-green-800'
                                  : itemData.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : itemData.status === 'rejected'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-gray-100 text-gray-800'
                          }`}
                      >
                          {itemData?.status ? itemData.status.replace("_", " ").toUpperCase() : ''}
                      </span>
                  </td>
                  {user?.role.includes('Barangay') && <td className="px-6 py-4">
                      <div className="flex items-center">
                          <button
                              className={`bg-green-500 rounded-md text-white p-2 hover:bg-green-700 mr-2 flex items-center ${(loading || itemData.status !== 'pending') && 'opacity-[0.5]'}`}
                              onClick={() => handleApprove(itemData)}
                              disabled={loading || itemData.status !== 'pending'}
                          >
                              <img
                                  src="/images/check.png"
                                  alt="Approve Icon"
                                  className="w-5 h-5"
                              />
                              <span className="mx-2">{itemData.status === 'pending' ? 'Receive Item' : 'Received'}</span>
                          </button>
                          {itemData.status != 'pending' && <button
                              className={`bg-red-500 rounded-md text-white p-2 hover:bg-red-700 mr-2 flex items-center ${(loading || itemData.status !== 'pending') && 'opacity-[0.5]'}`}
                              onClick={() => handleDecline(itemData.id)}
                              disabled={loading || itemData.status !== 'pending'}
                          >
                              <img
                                  src="/images/wrong.png"
                                  alt="Decline Icon"
                                  className="w-5 h-5"
                              />
                              <span className="mr-5">Decline</span>
                          </button>}
                      </div>
                  </td>
                  }
              </tr>
          ))}
          </tbody>
      </table>
        </>}

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

      {modalEditVaccine && form && (
        <ModalEditVaccine
          showModal={modalEditVaccine}
          closeModal={closeModalEditVaccine}
          data={form}
        />
      )}

      {modalViewVaccine && form && (
        <ModalViewVaccine
          showModal={modalViewVaccine}
          closeModal={closeModalViewVaccine}
          data={form}
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
      {distributeVaccine && form && (
        <DistributeVaccine
          showModal={distributeVaccine}
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
