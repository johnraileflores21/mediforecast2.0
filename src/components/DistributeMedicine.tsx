import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, doc, updateDoc, getDoc, setDoc, getDocs, query, where, addDoc } from "firebase/firestore";
import { MdCancel } from "react-icons/md";
import { useUser } from "./User";
import { IoMdClose } from "react-icons/io";
import Swal from "sweetalert2";

interface ModalDistributeProps {
  showModal: boolean;
  data: any;
  closeModal: (bool: any) => void;
}
export default function ModalDistribute({ showModal, closeModal, data }: ModalDistributeProps): any {
  const [medicine, setMedicine] = useState<any | null>(null);
  const [loading, setLoading] = useState<any | null>(false);
  const { user } = useUser();

  const isBarangay = user?.role.includes('Barangay');

  useEffect(() => {
    console.log('showModal :>> ', showModal);
    console.log("distribute :>> ", data);
    const remainingPieces = (data?.totalPerPiece || 0) - (data?.totalDistributed || 0);
    const totalPieces = remainingPieces % (data?.medicinePiecesPerItem || 0);
    console.log('totalPieces :>> ', totalPieces);
    if(data) setMedicine({...data, totalPieces});
  }, [data]);
  if (!medicine) {
    return null;
  }
  const formatDate = (dateString: any) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };
  const handleChange = (e: any, field: string) => {
    setMedicine({ ...medicine, [field]: e.target.value });
    console.log("medicine :>> ", { ...medicine, [field]: e.target.value });
  };


  const handleSubmit = async () => {
    try {
      setLoading(true);
      let payload = {
        ...medicine,
        medicineStock: parseInt(medicine.medicineStock)
      };

      if(!isBarangay) {
        if(!payload.barangay) return Swal.fire({
          position: "center",
          icon: "error",
          title: `Barangay is required`,
          showConfirmButton: false,
          timer: 1000,
        });
  
        console.log("payload :>> ", payload);
        const itemDocRef = doc(db, "Inventory", medicine.id);
        const itemSnap = await getDoc(itemDocRef);
        if(!itemSnap.exists()) throw new Error("Item not found");
  
        const itemData = itemSnap.data();
        const currentStock = itemData.medicineStock;
  
        if(payload.medicineStock > currentStock) throw new Error("Insufficient stock.");
  
        const userQuery = query(
          collection(db, "Users"),
          where("barangay", "==", payload.barangay)
        );
  
        const userSnap = await getDocs(userQuery);
        console.log("userSnap :>> ", userSnap);
        const userData = userSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
  
        console.log("userData :>> ", userData);
        
        const filteredUser = userData.filter((x: any) => x?.role.includes('Barangay'));
        if(filteredUser.length > 0) {
          await updateDoc(itemDocRef, { medicineStock: currentStock - payload.medicineStock });
  
          const _user = filteredUser[0];
  
          const barangayInventoryRef = doc(db, "BarangayInventory", payload.id);
          const barangayInventorySnap = await getDoc(barangayInventoryRef);
          const existingData = barangayInventorySnap.data();
  
          const _currentStock = existingData?.medicineStock || 0;
          const newStock = parseInt(payload.medicineStock) + _currentStock;
  
          const barangayInventoryData = {
            ...itemData,
            medicineStock: newStock,
            totalQuantity: (existingData?.totalQuantity + newStock) || newStock,
            created_at: new Date().toISOString(),
            userId: _user?.id,
            totalPerPiece: newStock * payload.medicinePiecesPerItem
          };
  
          if(barangayInventorySnap.exists()) {
            await setDoc(barangayInventoryRef, barangayInventoryData, { merge: true });
          } else await setDoc(barangayInventoryRef, barangayInventoryData);
  
          Swal.fire({
            position: "center",
            icon: "success",
            title: `${payload.medicineBrandName} has been distributed to ${payload.barangay}`,
            showConfirmButton: false,
            timer: 1500,
          });
  
        } else {
          Swal.fire({
            position: "center",
            icon: "error",
            title: `No existing user for ${payload.barangay}`,
            showConfirmButton: false,
            timer: 1000,
          });
        }
      } else {
        const itemDocRef = doc(db, "BarangayInventory", medicine.id);
        const itemSnap = await getDoc(itemDocRef);
        if(!itemSnap.exists()) throw new Error("Item not found in Barangay Inventory");

        const itemData = itemSnap.data();
        let totalPerPiece = parseInt(itemData.totalPerPiece);
        let currentStock = parseInt(itemData.medicineStock);
        let quantityToDistribute = parseInt(medicine.totalPieces);
        let medicinePiecesPerItem = parseInt(medicine.medicinePiecesPerItem);

        if(quantityToDistribute > totalPerPiece) {
          throw new Error("Insufficient stock to distribute this quantity.");
        }

        totalPerPiece -= quantityToDistribute;
        while(quantityToDistribute > 0) {
          if(quantityToDistribute <= currentStock * medicinePiecesPerItem) {
            currentStock -= Math.ceil(quantityToDistribute / medicinePiecesPerItem);
            quantityToDistribute = 0;
          } else {
            quantityToDistribute -= currentStock * medicinePiecesPerItem;
            currentStock = 0;
          }
        }

        await updateDoc(itemDocRef, {
          totalPerPiece: totalPerPiece,
          medicineStock: currentStock,
        });

        Swal.fire({
          position: "center",
          icon: "success",
          title: `${medicine.medicineBrandName} has been successfully distributed to ${medicine.fullName}`,
          showConfirmButton: false,
          timer: 1500,
        });

      }
  
      closeModal(true);

    } catch(error: any) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: `Distribution error`,
        showConfirmButton: false,
        timer: 1000,
      });
    } finally {
      setLoading(false);
    }
  }


  return (
    <div
      className={`fixed z-10 inset-0 overflow-y-auto transition-all duration-500 ease-out ${
        showModal ? "opacity-100" : "opacity-100"
      }`}
    >
      <div className="flex items-center justify-center min-h-screen px-4 py-6 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-black bg-opacity-50"></div>
        <div
          className={`inline-block align-middle bg-white rounded-lg text-left max-h-[600px] overflow-y-auto shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full ${
            showModal ? "animate-slideDown" : "animate-slideUp"
          }`}
        >
          {/* Modal content */}
          <div className="bg-white px- pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <div className="flex flex-row justify-between items-center">
                  <div className="flex-1 text-center">
                    <h3
                      className="text-xl pb-2 leading-6 font-medium text-gray-900"
                      id="modal-headline"
                    >
                      <span>Distribute</span> {medicine.medicineBrandName}
                    </h3>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  type="button"
                  className="absolute top-3 right-3 rounded-md text-gray-700 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  <IoMdClose className="w-8 h-8 text-gray-400 hover:text-red-600" />
                </button>
                <div className="mt-2">
                  <form className="space-y-4">
                    <div className="flex flex-row">
                      <div className="w-full">
                        <label
                          htmlFor="medicineBrandName"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Brand Name
                        </label>
                        <input
                          type="text"
                          id="medicineBrandName"
                          value={medicine.medicineBrandName}
                          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                          disabled
                          readOnly
                        />
                      </div>
                      <div className="w-full">
                        <label
                          htmlFor="medicineGenericName"
                          className="block text-sm font-medium text-gray-700 ml-1"
                        >
                          Generic Name
                        </label>
                        <input
                          type="text"
                          id="medicineGenericName"
                          value={medicine.medicineGenericName}
                          className="mt-1 block w-full p-2 border border-gray-300 rounded-md ml-1"
                          disabled
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="flex flex-row">
                      {isBarangay ?
                        <div className="w-full">
                          <label
                            htmlFor="totalPieces"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Quantity
                          </label>
                          <input
                            type="number"
                            id="totalPieces"
                            value={medicine.totalPieces}
                            onChange={(e) => handleChange(e, 'totalPieces')}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                          />
                        </div> : 
                        <div className="w-full">
                          <label
                            htmlFor="medicineStock"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Quantity
                          </label>
                          <input
                            type="number"
                            id="medicineStock"
                            value={medicine.medicineStock}
                            onChange={(e) => handleChange(e, 'medicineStock')}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                          />
                        </div>
                      }
                      <div className="w-full">
                        <label
                          htmlFor="medicineLotNo"
                          className="block text-sm font-medium text-gray-700 ml-1"
                        >
                          Medicine Lot No.
                        </label>
                        <input
                          type="text"
                          id="medicineLotNo"
                          value={medicine.medicineLotNo}
                          className="mt-1 block w-full p-2 border border-gray-300 rounded-md ml-1"
                          disabled
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="flex flex-row">
                      <div className="w-full">
                        <label
                          htmlFor="medicineStrength"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Strength
                        </label>
                        <input
                          type="text"
                          id="medicineDosageStrength"
                          value={medicine.medicineDosageStrength}
                          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                          disabled
                          readOnly
                        />
                      </div>
                      <div className="w-full">
                        <label
                          htmlFor="medicineDosageForm"
                          className="block text-sm font-medium text-gray-700 ml-1"
                        >
                          Dosage Form
                        </label>
                        <input
                          type="text"
                          id="medicineDosageForm"
                          value={medicine.medicineDosageForm}
                          className="mt-1 block w-full p-2 border border-gray-300 rounded-md ml-1"
                          disabled
                          readOnly
                        />
                      </div>
                    </div>

                    <div className="flex flex-row">
                      <div className="w-full">
                        <label
                          htmlFor="medicineExpiration"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Expiration Date
                        </label>
                        <input
                          type="text"
                          id="medicineExpiration"
                          value={formatDate(medicine.medicineExpiration)}
                          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                          disabled
                          readOnly
                        />
                      </div>
                      <div className="w-full">
                        <label
                          htmlFor="medicineRegulatoryClassification"
                          className="block text-sm font-medium text-gray-700 ml-1"
                        >
                          RegulatoryClassification
                        </label>
                        <input
                          type="text"
                          id="medicineRegulatoryClassification"
                          value={medicine.medicineRegulatoryClassification}
                          className="mt-1 block w-full p-2 border border-gray-300 rounded-md ml-1"
                          disabled
                          readOnly
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="medicineDescription"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Description
                      </label>
                      <textarea
                        id="medicineDescription"
                        value={medicine.medicineDescription}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        rows={4}
                        disabled
                        readOnly
                      />
                    </div>

                    {!isBarangay ? (
                      <div className="relative">
                        <label
                          htmlFor="barangay"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Where to Distribute
                        </label>
                        <div className="relative mt-1">
                          <select
                            id="barangay"
                            onChange={(e) => handleChange(e, 'barangay')}
                            className="block appearance-none w-full p-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:black focus:border-black sm:text-base"
                          >
                            <option value="">Barangay</option>
                            <option value="Balucuc">Balucuc</option>
                            <option value="Calantipe">Calantipe</option>
                            <option value="Cansinala">Cansinala</option>
                            <option value="Capalangan">Capalangan</option>
                            <option value="Colgante">Colgante</option>
                            <option value="Paligui">Paligui</option>
                            <option value="Sampaloc">Sampaloc</option>
                            <option value="San juan">San Juan</option>
                            <option value="San vicente">San Vicente</option>
                            <option value="Sucad">Sucad</option>
                            <option value="Sulipan">Sulipan</option>
                            <option value="Tabuyuc">Tabuyuc</option>
                          </select>
                          <svg
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="relative">
                          <label
                            htmlFor="address"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Full Name
                          </label>
                          <div className="relative mt-1">
                            <input
                              type="text"
                              id="address"
                              value={medicine.fullName}
                              onChange={(e) => handleChange(e, 'fullName')}
                              className="mt-1 block w-full p-2 border border-gray-300 rounded-md ml-1"
                            />
                          </div>
                        </div>
                        <div className="relative mt-4">
                          <label
                            htmlFor="address"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Full Address
                          </label>
                          <div className="relative mt-1">
                            <input
                              type="text"
                              id="address"
                              value={medicine.address}
                              onChange={(e) => handleChange(e, 'address')}
                              className="mt-1 block w-full p-2 border border-gray-300 rounded-md ml-1"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse w-full">
                      <button
                        type="button"
                        disabled={loading}
                        onClick={handleSubmit}
                        className={`${loading && 'opacity-[0.5]'} w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm`}
                      >
                        Submit
                      </button>
                      <button
                        onClick={closeModal}
                        type="button"
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
