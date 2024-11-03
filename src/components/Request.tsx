import React, { useEffect, useState } from "react";
import DashboardLayout from "./DashboardLayout";
import { FaEye, FaCaretDown } from "react-icons/fa";
import { IoMdAddCircle } from "react-icons/io";
import { useUser } from "./User";
import { IoSearchOutline } from "react-icons/io5";
import { collection, onSnapshot, updateDoc, addDoc, doc, query, where, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import Swal from "sweetalert2";
import RequestAdd from "../components/Request/RequestAdd";
import PDFPreviewModal from "./PDFPreviewModal";
import {RHUs} from "../assets/common/constants";
import { createHistoryLog }  from '../utils/historyService';
import notificationService from '../utils/notificationService';
import { useConfirmation } from '../hooks/useConfirmation';



const Request = () => {
    const confirm = useConfirmation();

    const [searchQuery, setSearchQuery] = useState<string>("");
    const [selectedOption, setSelectedOption] = useState<string>("All");
    const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [modalAdd, setModalAdd] = useState(false);
    const [modalPDF, setModalPDF] = useState(false);
    const { user } = useUser();

    const handleAdd = () => {
        setModalAdd(true);
    }
    const closeModalAdd = (bool: boolean) => {
        if(bool) loadData();
        setModalAdd(false);
    }
    const handleSearchInputChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => setSearchQuery(event.target.value);

    const handleOptionSelect = (select: string) => {
        setSelectedOption(select);
        setDropdownOpen(false);
    };
    const filteredAndSortedItems = items
        .filter(
            (itemData) =>
                selectedOption === "All" ||
                (selectedOption === "Medicines" && itemData?.item?.type === "Medicine") ||
                (selectedOption === "Vaccines" && itemData?.item?.type === "Vaccine") ||
                (selectedOption === "Vitamins" && itemData?.item?.type === "Vitamin")
        )
        .filter(
            (itemData) =>
                itemData?.item?.medicineBrandName
                    ?.toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                itemData?.item?.medicineGenericName
                    ?.toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                itemData?.item?.vaccineName
                    ?.toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                itemData?.item?.vitaminBrandName
                    ?.toLowerCase()
                    .includes(searchQuery.toLowerCase())
        );

    const loadData = async () => {
        try {
            setLoading(true);

            const q = query(
                collection(db, "Requests"),
                where(user?.role.includes('Barangay') ? "userId" : "rhuId", "==", user?.uid)
            );

            onSnapshot(q, async (snapshot: any) => {
                const itemsData = await Promise.all(
                    snapshot.docs.map(async (docSnapshot: any) => {
                        const requestData = docSnapshot.data();

                        const itemRef = doc(db, "Inventory", requestData.itemId);
                        const itemSnap = await getDoc(itemRef);

                        let itemData = null;
                        if(itemSnap.exists())
                            itemData = { id: itemSnap.id, ...itemSnap.data() };

                        return {
                            id: docSnapshot.id,
                            ...requestData,
                            item: itemData
                        };
                    })
                );

                setItems(itemsData);
                console.log('itemsData :>>', itemsData);
                console.log(itemsData);
            });
        } catch(error) {
            Swal.fire({
                title: "Error!",
                text: "Unable to get Requests. Please try again.",
                icon: "error",
            });
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadData();
    }, [])

    const handleDecline = async (id: string) => {
        const isConfirmed = await confirm({
            title: 'Confirm Submission',
            message: 'Are you sure you want to decline this item?',
          });

         if(!isConfirmed) return;

        try {
            setLoading(true);
            const requestDocRef = doc(db, "Requests", id);
            await updateDoc(requestDocRef, { status: "rejected" });

            Swal.fire({
                position: "center",
                icon: "success",
                title: "Request has been rejected!",
                showConfirmButton: false,
                timer: 1000,
            });
        } catch (error) {
            console.log(error);
            Swal.fire({
                position: "center",
                icon: "error",
                title: "Unable to decline request",
                showConfirmButton: false,
                timer: 1000,
            });
        } finally {
            setLoading(false);
        }
    }

    const handleApprove = async (id: string) => {
        const isConfirmed = await confirm({
            title: 'Confirm Submission',
            message: 'Are you sure you want to approve this item?',
          });

        if(!isConfirmed) return;
        try {
            setLoading(true);
            const requestDocRef = doc(db, "Requests", id);
            await updateDoc(requestDocRef, { status: "for_confirmation" });

            const formatFullName = `${user?.firstname}${user?.middlename ? ` ${user?.middlename.charAt(0)}.` : ''} ${user?.lastname}`;

            await createHistoryLog({
                actionType: 'approved-request',
                itemId: id,
                fullName: formatFullName,
                performedBy: user?.uid || '',
                remarks: 'Request has been approved by ${formatFullName}',
            })

            await notificationService.createNotification({
                action: 'approve',
                barangayItemId: null,
                itemId: id,
                itemName: '',
                itemType: '',
                quantity: 1,
                description: 'Request has been approved',
                performedBy: user?.uid || '',
                sentBy: user?.rhuOrBarangay || '',
                sentTo: user?.uid || '',
            });


            Swal.fire({
                position: "center",
                icon: "success",
                title: "Request approved!",
                showConfirmButton: false,
                timer: 1000,
            });
            // setLoading(true);

            // const requestDocRef = doc(db, "Requests", id);
            // const requestSnap = await getDoc(requestDocRef);

            // if(!requestSnap.exists()) throw new Error("Request not found");

            // const requestData = requestSnap.data();
            // const { rhuId, userId: barangayId, itemId, requestedQuantity } = requestData;

            // const itemDocRef = doc(db, "Inventory", itemId);
            // const itemSnap = await getDoc(itemDocRef);
            // if(!itemSnap.exists()) throw new Error("Item not found");

            // const itemData = itemSnap.data();
            // const currentStock = itemData.medicineStock || itemData.vitaminStock || itemData.vaccineStock;

            // if(requestedQuantity > currentStock) throw new Error("Insufficient stock.");

            // const stockTypes = ['medicineStock', 'vitaminStock', 'vaccineStock'];
            // let stockType = "";
            // Object.keys(itemData).forEach(type => {
            //     if(stockTypes.includes(type)) stockType = type;
            // });

            // await updateDoc(itemDocRef, { [stockType]: currentStock - requestedQuantity });

            // const barangayInventoryData = {
            //     ...itemData,
            //     [stockType]: requestedQuantity,
            //     totalQuantity: requestedQuantity,
            //     created_at: new Date().toISOString(),
            //     userId: barangayId,
            //     last_modified: new Date().toISOString()
            // };

            // const barangayInventoryRef = doc(db, "BarangayInventory", itemId);
            // const barangayInventorySnap = await getDoc(barangayInventoryRef);

            // if(barangayInventorySnap.exists()) {
            //     const currentData = barangayInventorySnap.data();
            //     const updatedStock = parseInt(currentData[stockType]) + parseInt(requestedQuantity);
            //     await updateDoc(barangayInventoryRef, { ...barangayInventoryData, [stockType]: updatedStock });
            // } else await setDoc(barangayInventoryRef, barangayInventoryData);

            // await addDoc(collection(db, "Distributions"), {
            //     barangayId,
            //     created_at: new Date().toISOString(),
            //     itemId,
            //     quantity: requestedQuantity,
            //     rhuId
            // });

            // await updateDoc(requestDocRef, { status: "approved" });

            // Swal.fire({
            //     position: "center",
            //     icon: "success",
            //     title: "Request approved!",
            //     showConfirmButton: false,
            //     timer: 1000,
            // });

            setLoading(false);

        } catch (error: any) {
            console.log(error);
            Swal.fire({
                position: "center",
                icon: "error",
                title: "Unable to request. Please try again",
                showConfirmButton: false,
                timer: 1000,
            });
        } finally {
            await loadData();
        }
    }

    const handleConfirmReceipt = async (id: string) => {
        try {
            setLoading(true);

            const requestDocRef = doc(db, "Requests", id);
            const requestSnap = await getDoc(requestDocRef);

            if(!requestSnap.exists()) throw new Error("Request not found");

            const requestData = requestSnap.data();
            const { rhuId, userId: barangayId, itemId, requestedQuantity } = requestData;

            const itemDocRef = doc(db, "Inventory", itemId);
            const itemSnap = await getDoc(itemDocRef);
            if(!itemSnap.exists()) throw new Error("Item not found");

            const itemData = itemSnap.data();
            const currentStock = itemData.medicineStock || itemData.vitaminStock || itemData.vaccineStock;

            if(requestedQuantity > currentStock) throw new Error("Insufficient stock.");

            const stockTypes = ['medicineStock', 'vitaminStock', 'vaccineStock'];
            let stockType = "";
            Object.keys(itemData).forEach(type => {
                if(stockTypes.includes(type)) stockType = type;
            });

            await updateDoc(itemDocRef, { [stockType]: currentStock - requestedQuantity });

            const barangayInventoryData = {
                ...itemData,
                [stockType]: requestedQuantity,
                totalQuantity: requestedQuantity,
                created_at: new Date().toISOString(),
                userId: barangayId,
                last_modified: new Date().toISOString()
            };

            const barangayInventoryRef = doc(db, "BarangayInventory", itemId);
            const barangayInventorySnap = await getDoc(barangayInventoryRef);

            if(barangayInventorySnap.exists()) {
                const currentData = barangayInventorySnap.data();
                const updatedStock = parseInt(currentData[stockType]) + parseInt(requestedQuantity);
                await updateDoc(barangayInventoryRef, { ...barangayInventoryData, [stockType]: updatedStock });
            } else await setDoc(barangayInventoryRef, barangayInventoryData);

            // await addDoc(collection(db, "Distributions"), {
            //     barangayId,
            //     created_at: new Date().toISOString(),
            //     itemId,
            //     quantity: requestedQuantity,
            //     rhuId
            // });

            await updateDoc(requestDocRef, { status: "approved" });

            const formatFullName = `${user?.firstname}${user?.middlename ? ` ${user?.middlename.charAt(0)}.` : ''} ${user?.lastname}`;
            await createHistoryLog({
                actionType: 'received-request',
                itemId: id,
                itemName: itemData.medicineBrandName || itemData.vitaminBrandName || itemData.vaccineName,
                fullName: formatFullName,
                performedBy: user?.uid || '',
                remarks: 'Request has been received by ${formatFullName}',
            });

            Swal.fire({
                position: "center",
                icon: "success",
                title: "Request approved!",
                showConfirmButton: false,
                timer: 1000,
            });

            setLoading(false);
        } catch (error: any) {
            console.log(error);
            Swal.fire({
                position: "center",
                icon: "error",
                title: "Unable to confirm receipt. Please try again",
                showConfirmButton: false,
                timer: 1000,
            });
        } finally {
            await loadData();
        }
    };

    const handleViewPDF = () => {
        setModalPDF(true);
      };



    const handleDropdown = () => setDropdownOpen(!dropdownOpen);

    const filteredPdfHeader = () => {
        const userBarangay = user?.rhuOrBarangay || "";
        const rhuIndex = RHUs.findIndex(rhu => rhu.barangays.includes(userBarangay)) + 1;

        const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
        const rhuRomanNumeral = romanNumerals[(rhuIndex == 0 ? parseInt(userBarangay): rhuIndex) - 1];

        console.log('rhuIndex :>>', rhuIndex);

        return {
            h1: rhuIndex == 0 ?   `Rural Health Unit ${rhuRomanNumeral}`: `${user?.rhuOrBarangay} Health Center`,
            h2: rhuIndex == 0 ? '' :  `Rural Health Unit ${rhuRomanNumeral}`,
            h3: "City of San Fernando, Pampanga",
            title: "Stock Request",
        }
    }
    const pdfHeader = filteredPdfHeader();
    return (
        <DashboardLayout>
            <h1 className="text-3xl font-bold mb-4">Stock Request</h1>
            <div className="flex justify-between mb-2 mt-10">
                <div className="flex items-middle gap-3">
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
                <div className="flex  gap-4">

                    <button
                        onClick={handleViewPDF}
                        className="bg-blue-500 text-white p-2 hover:bg-blue-700 rounded-md font-bold flex items-center space-x-1"
                    >
                        <FaEye className="w-5 h-5" />
                        <span>View All Requests</span>
                    </button>
                    {user?.role.includes('Barangay') && <button
                        onClick={handleAdd}
                        className="bg-green-500 text-white p-2 hover:bg-green-700 rounded-md font-bold flex items-center space-x-1"
                    >
                        <IoMdAddCircle className="w-5 h-5" />
                        <span>Request</span>
                    </button>}
                </div>
            </div>
            <div className="bg-white p-6 rounded-lg  mt-8 w-full overflow-x-auto overflow-scroll ">
                <div className="relative overflow-x-auto  sm:rounded-lg mt-3">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-300 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                {!user?.role.includes('Barangay') && <th
                                    scope="col"
                                    className="px-6 py-3 border text-xs font-bold text-black"
                                >
                                    Barangay
                                </th>}
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
                                    Reason
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 border text-xs font-bold text-black"
                                >
                                    Status
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 border text-xs font-bold text-black"
                                >
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAndSortedItems.map((itemData, index) => (
                                <tr
                                    key={index}
                                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                                >
                                    {!user?.role.includes('Barangay') && <td className="px-6 py-4 text-gray-900">
                                        {itemData.barangay}
                                    </td>}
                                    <td className="px-6 py-4 text-gray-900">
                                        {`${itemData?.item?.medicineBrandName || itemData?.item?.vitaminBrandName || itemData?.item?.vaccineName}`}
                                        {itemData.item.type.toLowerCase() !== 'vaccine' && (
                                        <>
                                            {` (${itemData?.item?.medicineGenericName || itemData?.item?.vitaminGenericName})`}
                                        </>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-gray-900">
                                        {itemData.requestedQuantity}
                                    </td>
                                    <td className="px-6 py-4 text-gray-900">
                                        {itemData.reason || 'N/A'}
                                    </td>
                                    <td className="px-6 py-2">
                                        <span
                                            className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                                                itemData.status === 'approved'
                                                    ? 'bg-green-100 text-green-800'
                                                    : itemData.status === 'pending'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : itemData.status === 'for_confirmation'
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : itemData.status === 'rejected'
                                                    ? 'bg-red-100 text-red-800'
                                                    : 'bg-gray-100 text-gray-800'
                                            }`}
                                        >
                                            {itemData.status.replace("_", " ").toUpperCase()}
                                        </span>
                                    </td>
                                    {!user?.role.includes('Barangay') ? <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <button
                                                className={`bg-blue-500 rounded-md text-white p-2 hover:bg-blue-700 mr-2 flex items-center ${(loading || itemData.status !== 'pending') && 'opacity-[0.5]'}`}
                                                onClick={() => handleApprove(itemData.id)}
                                                disabled={loading || itemData.status !== 'pending'}
                                            >
                                                <img
                                                    src="/images/check.png"
                                                    alt="Approve Icon"
                                                    className="w-5 h-5"
                                                />
                                                <span className="mr-5">Approve</span>
                                            </button>
                                            <button
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
                                            </button>
                                        </div>
                                    </td>
                                    : <>
                                       {itemData.status != 'pending' &&  <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <button
                                                    className={`bg-green-500 rounded-md text-white p-2 hover:bg-green-700 mr-2 flex items-center ${(loading || itemData.status == 'approved') && 'opacity-[0.5]'}`}
                                                    onClick={() => handleConfirmReceipt(itemData.id)}
                                                    disabled={loading || itemData.status !== 'for_confirmation'}
                                                >
                                                    <img
                                                        src="/images/check.png"
                                                        alt="Approve Icon"
                                                        className="w-5 h-5"
                                                    />
                                                    {itemData.stataus == 'for_confirmation' ? 'Item Received' : 'Received'}
                                                </button>
                                            </div>
                                        </td>}
                                    </>
                                    }
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>


                {modalAdd && <RequestAdd showModal={modalAdd} closeModal={closeModalAdd} />}
                {modalPDF && (
                    <PDFPreviewModal
                        showModal={modalPDF}
                        closeModal={() => setModalPDF(false)}
                        data={filteredAndSortedItems}
                        user={user}
                        header={pdfHeader}

                    />
                )}
            </div>

        </DashboardLayout>
    );
};

export default Request;
