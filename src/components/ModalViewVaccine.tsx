import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { MdCancel } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { useUser } from "./User";

interface ModalViewVaccineProps {
  showModal: boolean;
  closeModal: () => void;
  data: any;
}

const ModalViewVaccine: React.FC<ModalViewVaccineProps> = ({
  showModal,
  closeModal,
  data,
}) => {
  const [vaccine, setVaccine] = useState<any | null>(null);
  const { user } = useUser();

  useEffect(() => {
    if(data) {
      setVaccine(data);
    }
  }, [data]);

  if (!showModal || !vaccine) {
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
          className={`inline-block align-middle bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full ${
            showModal ? "animate-slideDown" : "animate-slideUp"
          }`}
        >
          {/* Modal content */}
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
            <div className="flex items-center justify-between">
              <h3 className="ml-40 text-xl font-medium text-gray-900">
                View Vaccine
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
                      htmlFor="vaccineName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Vaccine Name
                    </label>
                    <input
                      type="text"
                      id="vaccineName"
                      value={vaccine.vaccineName}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                      disabled
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="vaccineBatchNo"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Batch No./Lot No.
                    </label>
                    <input
                      type="text"
                      id="vaccineBatchNo"
                      value={vaccine.vaccineBatchNo}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                      disabled
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="vaccineStock"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Vaccine Stock
                    </label>
                    <input
                      type="text"
                      id="vaccineStock"
                      value={vaccine.vaccineStock}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                      disabled
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="vaccineDosageForm"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Vaccine Form
                    </label>
                    <input
                      type="text"
                      id="vaccineDosageForm"
                      value={vaccine.vaccineDosageForm}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                      disabled
                    />
                  </div>
                </div>
                <div>
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
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalViewVaccine;
