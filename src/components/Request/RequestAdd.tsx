import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import {
  collection,
  onSnapshot,
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
  getDoc,
  addDoc,
} from "firebase/firestore";
import { IoMdClose } from "react-icons/io";
import { useUser } from "../User";
import { requestFormData } from "../../assets/common/constants";
import { FaRegCheckCircle } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import ConfirmationModal from "./ConfirmationModal";
import { createHistoryLog }  from '../../utils/historyService';
import notificationService from '../../utils/notificationService';
import { RHUs } from "../../assets/common/constants";


interface ModalAddRequestProps {
  closeModal: (bool: any) => void;
  showModal: boolean;
}

const ModalAddRequest: React.FC<ModalAddRequestProps> = ({
  showModal,
  closeModal,
}) => {
  const [forms, setForms] = useState<any[]>([requestFormData]);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [showModalSuccess, setShowModalSucces] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [itemsLoading, setItemsLoading] = useState<boolean>(false);
  const { user } = useUser();

  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

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
      setItemsLoading(true);
      const inventorySnap = await getDocs(collection(db, "Inventory"));
      const inventoryItems: any = inventorySnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      let filteredItems = [];

      for (const item of inventoryItems) {
        if (!item.userId) continue;

        const userDocRef = doc(db, "Users", item.userId);
        const userSnap = await getDoc(userDocRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          const RHUs = [
            {
              barangays: [
                "Sulipan",
                "San Juan",
                "Capalangan",
                "Sucad",
                "Colgante",
              ],
            },
            { barangays: ["Tabuyuc", "Balucuc", "Cansinala", "Calantipe"] },
            { barangays: ["San Vicente", "Sampaloc", "Paligui"] },
          ];

          const unit =
            RHUs.findIndex((x: any) =>
              x["barangays"].includes(user?.barangay)
            ) + 1;

          if (userData.rhuOrBarangay === unit.toString()) {
            filteredItems.push(item);
          }
        }
      }

      setItems(filteredItems);
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setItemsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.barangay) {
      fetchData();
    }
  }, [user]);

  const handleChange = (index: number, e: any) => {
    const findItem = items.find((x: any) => x.id === e.target.value);
    const newForms = [...forms];
    newForms[index] = {
      ...newForms[index],
      itemId: findItem.id,
      rhuId: findItem.userId,
    };
    setForms(newForms);
    const newSelectedItems = [...selectedItems];
    newSelectedItems[index] = findItem;
    setSelectedItems(newSelectedItems);
  };

  const onInputChange = (index: number, e: any, field: string) => {
    const newForms = [...forms];
    newForms[index] = { ...newForms[index], [field]: e.target.value };
    setForms(newForms);
  };

  const getStock = (item: any) => {
    return item?.medicineStock || item?.vaccineStock || item?.vitaminStock;
  };

  const getDosageForm = (item: any) => {
    return (
      item?.medicineDosageForm ||
      item?.vaccineDosageForm ||
      item?.vitaminDosageForm
    );
  };

  const getGenericName = (item: any) => {
    return (
      item?.medicineGenericName ||
      item?.vaccineGenericName ||
      item?.vitaminGenericName
    );
  };

  const getDosage = (item: any) => {
    return (
      item?.medicineDosageStrength ||
      item?.vaccineDosageStrength || item?.vaccineDosageForm ||
      item?.vitaminDosageStrength
    );
  };

  const getLotNo = (item: any) => {
    return item?.medicineLotNo || item?.vaccineBatchNo || item?.vitaminLotNo;
  };

  const handleSubmit = async () => {
    try {
      const payloads = forms
        .map((form) => ({
          ...form,
          requestedQuantity: parseInt(form.requestedQuantity),
          userId: user?.uid,
          created_at: new Date(),
          barangay: user?.rhuOrBarangay || user?.barangay,
          status: "pending",
        }))
        .filter((form) => form.itemId && form.requestedQuantity && form.reason);

      if (payloads.length === 0) {
        return toast.error("Fill out required fields", {
          position: "top-right",
        });
      }

      // Open ConfirmationModal before proceeding
      setIsConfirmationModalOpen(true);
    } catch (error: any) {
      toast.error("An unexpected error occurred during submission.", {
        position: "top-right",
      });
    }
  };

  const handleConfirmSubmit = async () => {
    try {
      const payloads = forms
        .map((form) => ({
          ...form,
          requestedQuantity: parseInt(form.requestedQuantity),
          userId: user?.uid,
          created_at: new Date(),
          barangay: user?.rhuOrBarangay || user?.barangay,
          status: "pending",
        }))
        .filter((form) => form.itemId && form.requestedQuantity && form.reason);

      setLoading(true);
      // get index where barangay is included

      const promises = payloads.map((payload) =>
        addDoc(collection(db, "Requests"), payload)
      );
      await Promise.all(promises);

      const formatFullName = `${user?.firstname}${user?.middlename ? ` ${user?.middlename.charAt(0)}.` : ''} ${user?.lastname}`;
      const sentTo = RHUs.findIndex((x: any) => x["barangays"].includes(user?.barangay)) + 1;


      setForms([requestFormData]); // Reset to initial form
      setShowModalSucces(true);
      await createHistoryLog({
        actionType: 'request',
        fullName: formatFullName,
        barangay: user?.barangay,
        performedBy: user?.uid || '',
        remarks: `Requested ${payloads.length} item(s)`,
      })

      await notificationService.createNotification({
        action: 'request',
        barangayItemId: null,

        itemId: payloads.map((x) => x.itemId).join(','),
        itemName: payloads.map((x) => x.itemId).join(','),
        itemType: 'medicine',
        quantity: payloads.map((x) => x.requestedQuantity).reduce((a, b) => a + b, 0),
        description: `Requested ${payloads.length} item(s)`,
        performedBy: user?.uid || '',
        sentBy: user?.rhuOrBarangay || '',
        sentTo: sentTo.toString(),
      });


      setTimeout(() => {
        setShowModalSucces(false);
        closeModal(true);
      }, 1000);

      toast.success("Request submitted successfully!", {
        position: "top-right",
      });
    } catch (error: any) {
      console.error("Error submitting request:", error);
      toast.error("Unable to add request", {
        position: "top-right",
      });
    } finally {
      setLoading(false);
      setIsConfirmationModalOpen(false);
    }
  };

  // const handleSubmit = async () => {
  //   try {
  //     const payloads = forms.map(form => ({
  //       ...form,
  //       requestedQuantity: parseInt(form.requestedQuantity),
  //       userId: user?.uid,
  //       created_at: new Date(),
  //       barangay: user?.rhuOrBarangay || user?.barangay,
  //       status: 'pending'
  //     })).filter(form => form.itemId && form.requestedQuantity && form.reason);

  //     if (payloads.length === 0) {
  //       return toast.error("Fill out required fields", {
  //         position: "top-right",
  //       });
  //     }

  //     setLoading(true);

  //     const promises = payloads.map(payload => addDoc(collection(db, "Requests"), payload));
  //     await Promise.all(promises);

  //     setForms([requestFormData]); // Reset to initial form
  //     setShowModalSucces(true);

  //     setTimeout(() => {
  //       setShowModalSucces(false);
  //       closeModal(true);
  //     }, 1000);

  //   } catch (error: any) {
  //     toast.error("Unable to add request", {
  //       position: "top-right",
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleCancel = () => {
    setIsConfirmationModalOpen(false);
  };

  const addAnotherItem = () => {
    setForms([...forms, requestFormData]);
    setSelectedItems([...selectedItems, null]); // Initialize selected item for new form
  };

  return (
    <>
      <ToastContainer />

      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onConfirm={handleConfirmSubmit}
        onCancel={handleCancel}
      />
      {showModalSuccess && (
        <div className="fixed inset-0 flex justify-end items-start z-50 p-4">
          <div
            role="alert"
            className={`absolute alert alert-success w-72 mr-2 flex justify-center items-center z-50 transition-opacity duration-500 ${
              showModalSuccess ? "opacity-100" : "opacity-0"
            }`}
          >
            <FaRegCheckCircle className="h-6 w-6 shrink-0 stroke-current text-white" />
            <span className="text-white">Request Added Successfully!</span>
          </div>
        </div>
      )}
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
                  Request Items
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
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={addAnotherItem}
                    className="mt-4 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:w-auto sm:text-sm"
                  >
                    Add Another Item
                  </button>
                </div>
                <br />
                {forms.map((form, index) => (
                  <form key={index} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor={`selectedItem-${index}`}
                          className="block text-sm font-medium text-gray-700"
                        >
                          Select Item
                        </label>
                        <div className="relative mt-1">
                          <select
                            id={`selectedItem-${index}`}
                            onChange={(e) => handleChange(index, e)}
                            className="block appearance-none w-full p-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:black focus:border-black sm:text-base"
                          >
                            <option disabled selected>
                              {itemsLoading ? "Loading.." : "Please Select"}
                            </option>
                            {items.map((item: any) => (
                              <option key={item.id} value={item.id}>
                                {item.medicineBrandName ||
                                  item.vitaminBrandName ||
                                  item.vaccineName}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div>
                        <label
                          htmlFor={`requestedQuantity-${index}`}
                          className="block text-sm font-medium text-gray-700"
                        >
                          Quantity
                        </label>
                        <input
                          type="number"
                          id={`requestedQuantity-${index}`}
                          value={form.requestedQuantity}
                          onChange={(e) =>
                            onInputChange(index, e, "requestedQuantity")
                          }
                          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor={`reason-${index}`}
                        className="block text-sm font-medium text-gray-700"
                      >
                        Reason
                      </label>
                      <textarea
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        rows={3}
                        id={`reason-${index}`}
                        placeholder="Please enter your reason"
                        value={form.reason}
                        onChange={(e) => onInputChange(index, e, "reason")}
                      />
                    </div>
                    {selectedItems[index] && (
                      <div>
                        <h3 className="ml-40 text-xl font-medium text-gray-900">
                          Item Details
                        </h3>
                        <br />
                        <div className="flex flex-col gap-2">
                          <p>
                            Form: <b>{getDosageForm(selectedItems[index])}</b>
                          </p>
                          <p>
                            Type: <b>{selectedItems[index]?.type}</b>
                          </p>
                          <p>
                            Generic Name:{" "}
                            <b>{getGenericName(selectedItems[index])}</b>
                          </p>
                          <p>
                            Dosage: <b>{getDosage(selectedItems[index])}</b>
                          </p>
                          <p>
                            Lot No: <b>{getLotNo(selectedItems[index])}</b>
                          </p>
                          <p>
                            From:{" "}
                            <b>Unit {selectedItems[index]?.created_by_unit}</b>
                          </p>
                        </div>
                      </div>
                    )}
                    <br /> <br />
                  </form>
                ))}
                <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse w-full">
                  <button
                    type="button"
                    disabled={loading}
                    onClick={handleSubmit}
                    className={`${
                      loading && "opacity-[0.5]"
                    } w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm`}
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalAddRequest;
