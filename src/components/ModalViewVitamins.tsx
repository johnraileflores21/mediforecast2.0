import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { IoMdClose } from "react-icons/io";
import { useUser } from "./User";

interface ModalViewVitaminsProps {
  showModal: boolean;
  closeModal: () => void;
  data: any;
}

const ModalViewVitamins: React.FC<ModalViewVitaminsProps> = ({
  showModal,
  closeModal,
  data,
}) => {
  const [vitamin, setVitamin] = useState<any | null>(null);
  const { user } = useUser();

  useEffect(() => {
    if(data) {
      setVitamin(data);
    }
  }, [data]);

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
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
            <div className="flex items-center justify-between">
              <h3 className="ml-40 text-xl font-medium text-gray-900">
                View Vitamin
              </h3>
              <button
                onClick={closeModal}
                type="button"
                className="text-gray-700 hover:text-gray-900"
              >
                <IoMdClose className="w-8 h-8 text-gray-400 hover:text-red-600" />
              </button>
            </div>

            <div className="mt-4">
              <form className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
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
                  <div>
                    <label
                      htmlFor="vitaminGenericName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Generic Name
                    </label>
                    <input
                      type="text"
                      id="vitaminGenericName"
                      value={vitamin.vitaminGenericName}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                      disabled
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="vitaminStock"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Vitamin Stock
                    </label>
                    <input
                      type="text"
                      id="vitaminStock"
                      value={vitamin.vitaminStock}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                      disabled
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="vitaminLotNo"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Vitamin Lot No.
                    </label>
                    <input
                      type="text"
                      id="vitaminLotNo"
                      value={vitamin.vitaminLotNo}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                      disabled
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
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
                  <div>
                    <label
                      htmlFor="vitaminDosageForm"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Dosage Form
                    </label>
                    <input
                      type="text"
                      id="vitaminDosageForm"
                      value={vitamin.vitaminDosageForm}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                      disabled
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
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
                  <div>
                    <label
                      htmlFor="vitaminRegulatoryClassification"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Regulatory Classification
                    </label>
                    <input
                      type="text"
                      id="vitaminRegulatoryClassification"
                      value={vitamin.vitaminRegulatoryClassification}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
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
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalViewVitamins;
