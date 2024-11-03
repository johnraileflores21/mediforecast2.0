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


const Request = () => {
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [selectedOption, setSelectedOption] = useState<string>("All");
    const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [modalAdd, setModalAdd] = useState(false);
    const { user } = useUser();

    const handleAdd = () => {
        setModalAdd(true);
    }
    const closeModalAdd = (bool: boolean) => {
        if(bool) loadData();
        setModalAdd(false);
    }
// other fucntions ...

    const filteredAndSortedItems = items
        .filter(
            (itemData) =>
                selectedOption === "All" ||
                (selectedOption === "Medicines" && itemData.item.type === "Medicine") ||
                (selectedOption === "Vaccines" && itemData.item.type === "Vaccine") ||
                (selectedOption === "Vitamins" && itemData.item.type === "Vitamin")
        )
        .filter(
            (itemData) =>
                itemData.item.medicineBrandName
                    ?.toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                itemData.item.medicineGenericName
                    ?.toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                itemData.item.vaccineName
                    ?.toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                itemData.item.vitaminBrandName
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

// other functions

    return (
        <DashboardLayout>
            <h1 className="text-3xl font-bold mb-4">Stock Request</h1>
            <div className="flex justify-between mb-2 mt-10">
                <div className="flex items-middle gap-3">
                    {/* input element */}
                   {/* select element */}
                </div>
                {user?.role.includes('Barangay') && <button
                    onClick={handleAdd}
                    className="bg-green-500 text-white p-2 hover:bg-green-700 rounded-md font-bold flex items-center space-x-1"
                >
                    <IoMdAddCircle className="w-5 h-5" />
                    <span>Request</span>
                </button>}
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
                                        {`${itemData.item.medicineBrandName || itemData.item.vitaminBrandName || itemData.item.vaccineName}`}
                                        {itemData.item.type.toLowerCase() !== 'vaccine' && (
                                        <>
                                            {` (${itemData.item.medicineGenericName || itemData.item.vitaminGenericName})`}
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
            </div>

        </DashboardLayout>
    );
};

export default Request;
