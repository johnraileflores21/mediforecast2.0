import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { useUser } from "./User";
import { IoMdClose } from "react-icons/io";
import { HiInformationCircle } from "react-icons/hi2";
interface ModalViewMedicineProps {
  showModal: boolean;
  closeModal: () => void;
  data: any;
}

const ModalViewMedicine: React.FC<ModalViewMedicineProps> = ({
  showModal,
  closeModal,
  data,
}) => {
  const [medicine, setMedicine] = useState<any | null>(null);
  const { user } = useUser();

  useEffect(() => {
    console.log("data 123 :>> ", data);
    if (!data) return;
    setMedicine(data);

    // const unsub = onSnapshot(collection(db, "Inventory"), (snapshot) => {
    //   const medicinesData = snapshot.docs.map((doc) => ({
    //     id: doc.id,
    //     ...doc.data(),
    //   }));
    //   const selectedMedicine = medicinesData.find((med) => med.id === data);
    //   setMedicine(selectedMedicine);
    //   console.log("selectedMedicine :>> ", selectedMedicine);
    // });

    // return () => unsub();
  }, [data]);

  if (!showModal || !data) {
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
          <div className="bg-white px-2 pt-5 pb-4 sm:p-6">
            <div className="flex items-start">
              <div className="w-full">
                <button
                  onClick={closeModal}
                  type="button"
                  className="text-gray-700 hover:text-gray-900 float-right"
                >
                  <IoMdClose className="w-6 h-6 text-gray-400 hover:text-red-600" />
                </button>

                <div className="flex flex-row justify-center items-center mt-2 mb-3">
                  <HiInformationCircle size={40} className="text-blue-600" />
                  <h3 className="ml-1 mt-1 font-semibold text-2xl text-center flex items-center justify-center">
                    Medicine Information
                  </h3>
                </div>

                <div className="mt-2">
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="medicineBrandName"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Brand Name
                        </label>
                        <input
                          type="text"
                          id="medicineBrandName"
                          value={medicine?.medicineBrandName}
                          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                          readOnly
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="medicineGenericName"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Generic Name
                        </label>
                        <input
                          type="text"
                          id="medicineGenericName"
                          value={medicine?.medicineGenericName}
                          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="medicineStock"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Medicine Stock
                        </label>
                        <input
                          type="text"
                          id="medicineStock"
                          value={medicine?.medicineStock}
                          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                          readOnly
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="medicineStockClassification"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Stock Classification
                        </label>
                        <input
                          type="text"
                          id="medicineClassification"
                          value={`${medicine?.medicineClassification} ${medicine?.medicineDosageForm}`}
                          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="medicineLotNo"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Medicine Lot No.
                        </label>
                        <input
                          type="text"
                          id="medicineLotNo"
                          value={medicine?.medicineLotNo}
                          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                          readOnly
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="medicineStrength"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Strength
                        </label>
                        <input
                          type="text"
                          id="medicineDosageStrength"
                          value={medicine?.medicineDosageStrength}
                          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="flex justify-center items-center">
                      <div className="">
                        <label
                          htmlFor="medicineDosageForm"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Dosage Form
                        </label>
                        <input
                          type="text"
                          id="medicineDosageForm"
                          value={medicine?.medicineDosageForm}
                          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                          readOnly
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="medicineExpiration"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Expiration Date
                        </label>
                        <input
                          type="text"
                          id="medicineExpiration"
                          value={formatDate(medicine?.medicineExpiration)}
                          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                          readOnly
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="medicineRegulatoryClassification"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Regulatory Classification
                        </label>
                        <input
                          type="text"
                          id="medicineRegulatoryClassification"
                          value={medicine?.medicineRegulatoryClassification}
                          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
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
                        value={medicine?.medicineDescription}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        rows={4}
                        readOnly
                      />
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

export default ModalViewMedicine;
