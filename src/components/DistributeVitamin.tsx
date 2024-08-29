import React, { useState, useEffect, ChangeEvent } from "react";
import { db } from "../firebase";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { IoMdClose } from "react-icons/io";
import { useUser } from "./User";

interface DistributeVitaminProps {
  showModal: boolean;
  closeModal: () => void;
  viewId: string | null;
}

const DistributeVitamin: React.FC<DistributeVitaminProps> = ({
  showModal,
  closeModal,
  viewId,
}) => {
  const [vitamin, setVitamin] = useState<any | null>(null);
  const [barangay, setBarangay] = useState<string>("");
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
    if (!viewId) return;

    const unsub = onSnapshot(doc(db, inventory, viewId), (doc) => {
      setVitamin({ id: doc.id, ...doc.data() });
    });

    return () => unsub();
  }, [viewId, inventory]);

  if (!showModal || !vitamin) {
    return null;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setBarangay(e.target.value);
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
                      <span>Distribute</span> {vitamin.vitaminBrandName}
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
                          htmlFor="vitaminBrandName"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Brand Name
                        </label>
                        <input
                          type="text"
                          id="vitaminBrandName"
                          value={vitamin.vitaminBrandName}
                          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                          disabled
                        />
                      </div>
                      <div className="w-full">
                        <label
                          htmlFor="vitaminGenericName"
                          className="block text-sm font-medium text-gray-700 ml-1"
                        >
                          Generic Name
                        </label>
                        <input
                          type="text"
                          id="vitaminGenericName"
                          value={vitamin.vitaminGenericName}
                          className="mt-1 block w-full p-2 border border-gray-300 rounded-md ml-1"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="flex flex-row">
                      <div className="w-full">
                        <label
                          htmlFor="vitaminStock"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Quantity
                        </label>
                        <input
                          type="text"
                          id="vitaminStock"
                          value={
                            vitamin.vitaminStock > 1
                              ? `${vitamin.vitaminStock} boxes`
                              : `${vitamin.vitaminStock} box`
                          }
                          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                          disabled
                        />
                      </div>
                      <div className="w-full">
                        <label
                          htmlFor="vitaminLotNo"
                          className="block text-sm font-medium text-gray-700 ml-1"
                        >
                          Lot No.
                        </label>
                        <input
                          type="text"
                          id="vitaminLotNo"
                          value={vitamin.vitaminLotNo}
                          className="mt-1 block w-full p-2 border border-gray-300 rounded-md ml-1"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="flex flex-row">
                      <div className="w-full">
                        <label
                          htmlFor="vitaminStrength"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Strength
                        </label>
                        <input
                          type="text"
                          id="vitaminStrength"
                          value={vitamin.vitaminDosageStrength}
                          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                          disabled
                        />
                      </div>
                      <div className="w-full">
                        <label
                          htmlFor="vitaminDosageForm"
                          className="block text-sm font-medium text-gray-700 ml-1"
                        >
                          Dosage Form
                        </label>
                        <input
                          type="text"
                          id="vitaminDosageForm"
                          value={vitamin.vitaminDosageForm}
                          className="mt-1 block w-full p-2 border border-gray-300 rounded-md ml-1"
                          disabled
                        />
                      </div>
                    </div>

                    <div className="flex flex-row">
                      <div className="w-full">
                        <label
                          htmlFor="vitaminExpiration"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Expiration Date
                        </label>
                        <input
                          type="text"
                          id="vitaminExpiration"
                          value={formatDate(vitamin.vitaminExpiration)}
                          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                          disabled
                        />
                      </div>
                      <div className="w-full">
                        <label
                          htmlFor="vitaminRegulatoryClassification"
                          className="block text-sm font-medium text-gray-700 ml-1"
                        >
                          Regulatory Classification
                        </label>
                        <input
                          type="text"
                          id="vitaminRegulatoryClassification"
                          value={vitamin.vitaminRegulatoryClassification}
                          className="mt-1 block w-full p-2 border border-gray-300 rounded-md ml-1"
                          disabled
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="vitaminDescription"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Description
                      </label>
                      <textarea
                        id="vitaminDescription"
                        value={vitamin.vitaminDescription}
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
                          value={barangay}
                          onChange={handleChange}
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

export default DistributeVitamin;
