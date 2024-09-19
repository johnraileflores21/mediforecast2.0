import React, { useState, useEffect, ChangeEvent } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, doc, updateDoc, getDoc, setDoc, getDocs, query, where, addDoc } from "firebase/firestore";
import { IoMdClose } from "react-icons/io";
import { useUser } from "./User";
import Swal from "sweetalert2";

interface DistributeVaccineProps {
  showModal: boolean;
  closeModal: (bool: any) => void;
  data: any;
}

const DistributeVaccine: React.FC<DistributeVaccineProps> = ({
  showModal,
  closeModal,
  data,
}) => {
  const [vaccine, setVaccine] = useState<any | null>(null);
  const [barangay, setBarangay] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useUser();
  const isBarangay = user?.role.includes('Barangay');

  useEffect(() => {
    if(data) {
        console.log('data :>> ', data);
      setVaccine(data);
    }
  }, [data]);

  if (!showModal || !vaccine) {
    return null;
  }

  const handleSubmit = async () => {
    try {
      setLoading(true);
      let payload = {
        ...vaccine,
        vaccineStock: parseInt(vaccine.vaccineStock)
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
        const itemDocRef = doc(db, "Inventory", vaccine.id);
        const itemSnap = await getDoc(itemDocRef);
        if(!itemSnap.exists()) throw new Error("Item not found");
  
        const itemData = itemSnap.data();
        const currentStock = itemData.vaccineStock;
  
        if(payload.vaccineStock > currentStock) throw new Error("Insufficient stock.");
  
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
          await updateDoc(itemDocRef, { vaccineStock: currentStock - payload.vaccineStock });
  
          const _user = filteredUser[0];
  
          const barangayInventoryRef = doc(db, "BarangayInventory", payload.id);
          const barangayInventorySnap = await getDoc(barangayInventoryRef);
          const existingData = barangayInventorySnap.data();
  
          const _currentStock = existingData?.vaccineStock || 0;
          const newStock = parseInt(payload.vaccineStock) + _currentStock;
  
          const barangayInventoryData = {
            ...itemData,
            vaccineStock: newStock,
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
            title: `${payload.vaccineName} has been distributed to ${payload.barangay}`,
            showConfirmButton: false,
            timer: 1500,
          });
      } else {
        //  process barangay distribution
      }

      closeModal(true);

      } else {
        Swal.fire({
          position: "center",
          icon: "error",
          title: `No existing user for ${payload.barangay}`,
          showConfirmButton: false,
          timer: 1000,
        });
      }

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleChange = (e: any, field: string) => {
    setVaccine({ ...vaccine, [field]: e.target.value });
    console.log("vaccine :>> ", { ...vaccine, [field]: e.target.value });
  };

  return (
    <div
      className={`fixed z-10 inset-0 overflow-y-auto transition-all duration-500 ease-out ${
        showModal ? "opacity-100" : "opacity-0"
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
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <div className="flex flex-row justify-between items-center">
                  <div className="flex-1 text-center">
                    <h3
                      className="text-xl pb-2 leading-6 font-medium text-gray-900"
                      id="modal-headline"
                    >
                      <span>Distribute</span> {vaccine.vaccineName}
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
                          htmlFor="vaccineName"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Brand Name
                        </label>
                        <input
                          type="text"
                          id="vaccineName"
                          value={vaccine.vaccineName}
                          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                          disabled
                        />
                      </div>
                      
                      <div className="w-full">
                        <label
                          htmlFor="vaccineBatchNo"
                          className="block text-sm font-medium text-gray-700 ml-1"
                        >
                          Batch No.
                        </label>
                        <input
                          type="text"
                          id="vaccineBatchNo"
                          value={vaccine.vaccineBatchNo}
                          className="mt-1 block w-full p-2 border border-gray-300 rounded-md ml-1"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="flex flex-row">
                      <div className="w-full">
                        <label
                          htmlFor="vaccineStock"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Quantity
                        </label>
                        <input
                          type="number"
                          id="vaccineStock"
                          value={vaccine.vaccineStock}
                          onChange={(e) => handleChange(e, 'vaccineStock')}
                          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>
                      
                      <div className="w-full">
                        <label
                          htmlFor="vaccineDosageForm"
                          className="block text-sm font-medium text-gray-700 ml-1"
                        >
                          Dosage Form
                        </label>
                        <input
                          type="text"
                          id="vaccineDosageForm"
                          value={vaccine.vaccineDosageForm}
                          className="mt-1 block w-full p-2 border border-gray-300 rounded-md ml-1"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="flex flex-row">
                    </div>

                    <div className="flex flex-row">
                      <div className="w-full">
                        <label
                          htmlFor="vaccineExpiration"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Expiration Date
                        </label>
                        <input
                          type="text"
                          id="vaccineExpiration"
                          value={formatDate(vaccine.vaccineExpiration)}
                          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                          disabled
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="vaccineDescription"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Description
                      </label>
                      <textarea
                        id="vaccineDescription"
                        value={vaccine.vaccineDescription}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        rows={4}
                        disabled
                      />
                    </div>

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
                          className="block appearance-none w-full p-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-black focus:border-black sm:text-base"
                        >
                          <option value="">Barangay</option>
                          <option value="Balucuc">Balucuc</option>
                          <option value="Calantipe">Calantipe</option>
                          <option value="Cansinala">Cansinala</option>
                          <option value="Capalangan">Capalangan</option>
                          <option value="Colgante">Colgante</option>
                          <option value="Paligui">Paligui</option>
                          <option value="Sampaloc">Sampaloc</option>
                          <option value="San Juan">San Juan</option>
                          <option value="San Vicente">San Vicente</option>
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
                    <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse w-full">
                      <button
                        disabled={loading}
                        type="button"
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

export default DistributeVaccine;
