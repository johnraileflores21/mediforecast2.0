import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, onSnapshot, deleteDoc, doc, query, where, getDocs, getDoc } from "firebase/firestore";
import { IoMdClose } from "react-icons/io";
import { useUser } from "../User";

interface ModalAddRequestProps {
  closeModal: () => void
  showModal: boolean;
}

const ModalAddRequest: React.FC<ModalAddRequestProps> = ({
  showModal,
  closeModal
}) => {
  const [form, setForm] = useState<any>({

  });
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [items, setItems] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useUser();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const fetchData = async () => {
    try {
        
        const inventorySnap = await getDocs(collection(db, "Inventory"));
        const inventoryItems: any = inventorySnap.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
  
        let filteredItems = [];
  
        for(const item of inventoryItems) {
            if(!item.userId) continue;

            const userDocRef = doc(db, "Users", item.userId);
            const userSnap = await getDoc(userDocRef);
    
            if(userSnap.exists()) {
                const userData = userSnap.data();
        
                if(userData.barangay === user?.barangay) {
                    filteredItems.push(item);
                }
            }
        }
  
        setItems(filteredItems);
        console.log("filteredItems :>> ", filteredItems);
    } catch (error) {
      console.error("error fetching data :>> ", error);
    }
  };
  
  useEffect(() => {
    if(user?.barangay) {
      fetchData();
    }
  }, [user]);

  const handleChange = (e: any) => {
    const findItem = items.find((x: any) => x.id === e.target.value);
    setSelectedItem(findItem);
  }

  const getStock = (item: any) => {
    return item?.medicineStock || item?.vaccineStock || item?.vitaminStock;
  }

  const getDosageForm = (item: any) => {
    return item?.medicineDosageForm || item?.vaccineDosageForm || item?.vitaminDosageForm;
  }

  const getGenericName = (item: any) => {
    return item?.medicineGenericName || item?.vaccineGenericName || item?.vitaminGenericName;
  }

  const getDosage = (item: any) => {
    return item?.medicineDosageStrength || item?.vaccineDosageStrength || item?.vitaminDosageStrength;
  }

  const getLotNo = (item: any) => {
    return item?.medicineLotNo || item?.vaccineLotNo || item?.vitaminLotNo;
  }

  const getClassification = (item: any) => {
    return item?.medicineRegulatoryClassification || item?.vaccineRegulatoryClassification || item?.vitaminRegulatoryClassification;
  }

  const handleSubmit = () => {
    try {
        setLoading(true);
    } catch(error: any) {
        // todo:: submit logic of request, distribute barangay to resident, add history
    } finally {
        setLoading(false);
    }
  }

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
                Request Item
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
                      htmlFor="selectedItem"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Select Item
                    </label>
                    <div className="relative mt-1">
                        <select
                            id="selectedItem"
                            onChange={handleChange}
                            className="block appearance-none w-full p-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:black focus:border-black sm:text-base"
                        >
                            <option value="" disabled selected>Please Select</option>
                            {items.map((item: any, index: number) => (
                                <option key={index} value={item.id}>{
                                    item.medicineBrandName ||
                                    item.vitaminBrandName ||
                                    item.vaccineBrandName
                                }</option>
                            ))}
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
                  <div>
                    <label
                      htmlFor="stock"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Quantity
                    </label>
                    <input
                      type="number"
                      id="stock"
                      // value={vitamin.vitaminGenericName}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                <div>
                    <label
                      htmlFor="stock"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Reason
                    </label>
                    <textarea
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        rows={3}
                        placeholder="Please enter your reason"
                    >

                    </textarea>
                </div>
                {selectedItem && <div>
                    <h3 className="ml-40 text-xl font-medium text-gray-900">
                        Item Details
                    </h3>
                    <br />
                    <div className="flex flex-col gap-2">
                        {/* <p>Remaining Stock: <b>{getStock(selectedItem)}</b></p> */}
                        <p>Form: <b>{getDosageForm(selectedItem)}</b></p>
                        <p>Type: <b>{selectedItem?.type}</b></p>
                        <p>Generic Name: <b>{getGenericName(selectedItem)}</b></p>
                        <p>Dosage: <b>{getDosage(selectedItem)}</b></p>
                        <p>Lot No: <b>{getLotNo(selectedItem)}</b></p>
                        <p>Regulatory Classification: <b>{getClassification(selectedItem)}</b></p>
                        <p>From: <b>Unit {selectedItem?.created_by_unit}</b></p>
                    </div>
                </div>}

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
  );
};

export default ModalAddRequest;
