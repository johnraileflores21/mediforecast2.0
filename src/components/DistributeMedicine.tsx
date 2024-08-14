import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { MdCancel } from "react-icons/md";
import { useUser } from "./User";

interface ModalDistributeProps {
  showModal: boolean;
  viewId: string | null;
  closeModal: () => void;
}
const ModalDistribute: React.FC<ModalDistributeProps> = ({
  showModal,
  closeModal,
  viewId,
}) => {
  const [medicine, setMedicine] = useState<any | null>(null);
  const { user } = useUser();

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
      const medicinesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const selectedMedicine = medicinesData.find((med) => med.id === viewId);
      setMedicine(selectedMedicine);
    });
    return () => unsub();
  }, [viewId]);
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
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {};

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex justify-center items-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left max-h-[600px] overflow-y-auto shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
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
                  <MdCancel className="w-10 h-10 text-red-900" />
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
                      <div className="w-full">
                        <label
                          htmlFor="medicineStock"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Quantity
                        </label>
                        <input
                          type="text"
                          id="medicineStock"
                          value={
                            medicine.medicineStock > 1
                              ? `${medicine.medicineStock} boxes`
                              : `${medicine.medicineStock} box`
                          }
                          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                          readOnly
                        />
                      </div>
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
                          value={medicine.medicineExpiration}
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
                          onChange={handleChange}
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
                    <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse w-full">
                      <button
                        type="button"
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
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

export default ModalDistribute;
