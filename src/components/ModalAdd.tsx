import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db, storage } from "../firebase";
import { FaCheckCircle } from "react-icons/fa";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import { MdCancel } from "react-icons/md";
import { FaCaretDown } from "react-icons/fa";
import { FaUpload } from "react-icons/fa";
import AddVaccine from "./AddVaccine";
import ModalAddVitamin from "./ModalAddVitamin";
import { useUser } from "./User";
import { medical_packaging, dosage_forms, medicineFormData } from "../assets/common/constants";
import { createHistoryLog }  from '../utils/historyService';
import { useConfirmation } from '../hooks/useConfirmation';

interface ModalAddProps {
  showModal: boolean;
  closeModal: (bool: any) => void;
}

const ModalAdd: React.FC<ModalAddProps> = ({ showModal, closeModal }) => {
  const confirm = useConfirmation();

  const [showModalSuccess, setShowModalSucces] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>("Dosage Form");
  const [selectedPackaging, setSelectedPackaging] = useState<string>("Medical Packaging");
  const [formData, setFormData] = useState(medicineFormData);
  const [errors, setErrors] = useState<any>({});
  const [activeTab, setActiveTab] = useState("Medicine");
  const tabs = ["Medicine", "Vitamin", "Vaccine"];
  const { user } = useUser();

  const validateForm = () => {
    const newErrors: any = {};
    const fields = Object.keys(formData) as Array<keyof typeof formData>;

    fields.forEach(field => {
      if(!formData[field] && field !== 'userId') {
        const types = ['medicine', 'vitamin', 'vaccine'];
        const getType = types.find(type => field.includes(type));
        if(getType) {
          const fieldName = field.split(getType)[1];
          const formatted = fieldName.replace(/([a-z])([A-Z])/g, '$1 $2');
          newErrors[field] = `${formatted} is required`;
        }
      }
    });

    setErrors(newErrors);
    console.log('newErrors :>> ', newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;

    if (e.target instanceof HTMLInputElement && e.target.files) {
      const selectedFile = e.target.files[0];
      if (id === "medicineImage") {
        setFile(selectedFile);
        setPreview(URL.createObjectURL(selectedFile));
      } else {
        setFile(null);
        setPreview(null);
      }
    } else {
      let error: string | null = null;

      if (id === "medicineExpiration") {
        const today = new Date();
        const selectedDate = new Date(value);

        if (selectedDate <= today) {
          error = "Expiration date must be in the future.";
        }
      }

      setFormData({
        ...formData,
        [id]: value,
      });

      setErrors({
        ...errors,
        [id]: error,
      });
    }
  };

  const handleConfirmSubmit = async () => {
    formData.medicineDosageForm = selectedOption;
    formData.medicinePackaging = selectedPackaging;
    if (!validateForm()) return;

    const now = new Date();
    const dateToday = now.toISOString();
    setLoading(true);

    try {
      let medicineImg = "";
      if (file) {
        const imageRef = ref(storage, `Medicines/${file.name + v4()}`);
        await uploadBytes(imageRef, file);
        medicineImg = await getDownloadURL(imageRef);
      }

      formData.totalQuantity = formData.medicineStock;
      formData.userId = user?.uid || "";

      const formDataWithImage = {
        ...formData,
        medicineImg,
        type: "Medicine",
        created_at: dateToday,
        updated_at: dateToday,
        userId: user?.uid,
        created_by_unit: user?.rhuOrBarangay
      };

      const docRef = await addDoc(collection(db, "Inventory"), formDataWithImage);
      console.log("Document written with ID: ", docRef.id);

      setFormData(medicineFormData);

      setFile(null);
      setPreview(null);
      setShowModalSucces(true);

      setTimeout(() => {
        setShowModalSucces(false);
        closeModal(true);
      }, 1000);

      const formatFullName = `${user?.firstname}${user?.middlename ? ` ${user?.middlename.charAt(0)}.` : ''} ${user?.lastname}`;

      await createHistoryLog({
        actionType: 'create',
        itemId: docRef.id,
        itemName: formData.medicineBrandName,
        fullName: formatFullName,
        barangay: '',
        performedBy: user?.uid || '',
        remarks: `Medicine ${formData.medicineBrandName} has been added to the inventory`,
      })

    } catch (error) {
      console.error("Error adding document: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    const isConfirmed = await confirm({
      title: 'Confirm Submission',
      message: 'Are you sure you want to add this medicine?',
    });

    if (isConfirmed) {
      handleConfirmSubmit();
    }
  };

  const handleClearPreview = () => {
    setPreview(null);
    setFile(null);
    const inputElement = document.getElementById(
      "medicineImage"
    ) as HTMLInputElement | null;
    if (inputElement) {
      inputElement.value = "";
    }
  };

  return (
    <>
      {showModalSuccess && (
        <div className="fixed inset-0 flex justify-end items-start z-50 p-4">
          <div
            role="alert"
            className={`absolute alert alert-success w-72 mr-2 flex justify-center items-center z-50 transition-opacity duration-500 ${
              showModalSuccess ? "opacity-100" : "opacity-0"
            }`}
          >
            <FaCheckCircle className="h-6 w-6 shrink-0 stroke-current text-white" />
            <span className="text-white">Medicine Added Successfully!</span>
          </div>
        </div>
      )}
      {showModal && (
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
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left ">
                    <h3
                      className="flex justify-center items-center text-xl p-2 leading-6 font-medium text-gray-900"
                      id="modal-headline"
                    >
                      Add {activeTab}
                    </h3>
                    <div className="w-full">
                      <div className="flex justify-evenly border-b p-2 border-gray-300">
                        {tabs.map((tab) => (
                          <button
                            key={tab}
                            className={`py-2 px-4 text-sm font-medium focus:outline-none ${
                              activeTab === tab
                                ? "border border-blue-500 text-white rounded-2xl bg-blue-500"
                                : "text-gray-500 hover:text-gray-700"
                            }`}
                            onClick={() => setActiveTab(tab)}
                          >
                            {tab}
                          </button>
                        ))}
                      </div>
                      <div className="p-4">
                        {activeTab === "Medicine" && (
                          <div className="mt-2 ">
                            <form className="space-y-4">
                              <div className="flex justify-center items-center">
                                <div
                                  className="relative bg-cover bg-center flex justify-center items-center border-dashed rounded-lg border-2 border-blue-700 w-1/2 h-36 p-2"
                                  style={{
                                    backgroundImage: preview
                                      ? `url(${preview})`
                                      : "none",
                                  }}
                                >
                                  {!preview && (
                                    <>
                                      <input
                                        type="file"
                                        accept="image/*"
                                        id="medicineImage"
                                        onChange={handleChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        required
                                      />
                                      <label
                                        htmlFor="medicineImage"
                                        className="absolute cursor-pointer"
                                      >
                                        <FaUpload className="w-6 h-6 text-blue-700" />
                                      </label>{" "}
                                      <span className="mt-11">
                                        Upload Image
                                      </span>
                                    </>
                                  )}
                                  {preview && (
                                    <button
                                      className="absolute top-2 right-2 bg-white text-gray-600 rounded-full w-6 h-6 flex justify-center items-center hover:bg-gray-200"
                                      onClick={handleClearPreview}
                                    >
                                      <MdCancel className="w-6 h-6 text-red-700" />
                                    </button>
                                  )}
                                </div>
                              </div>
                              {errors.medicineImage && (
                                <span className="text-red-600">
                                  Image is required
                                </span>
                              )}
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
                                    value={formData.medicineBrandName}
                                    onChange={handleChange}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                    required
                                  />
                                  {errors.medicineBrandName && (
                                    <span className="text-red-600">
                                      {errors.medicineBrandName}
                                    </span>
                                  )}
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
                                    value={formData.medicineGenericName}
                                    onChange={handleChange}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md ml-1"
                                    required
                                  />
                                  {errors.medicineGenericName && (
                                    <span className="text-red-600">
                                      {errors.medicineGenericName}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="flex flex-row gap-2">
                                <div className="w-1/2">
                                  <label
                                    htmlFor="medicineStock"
                                    className="block text-sm font-medium text-gray-700"
                                  >
                                    Medicine Stock
                                  </label>
                                  <input
                                    type="number"
                                    id="medicineStock"
                                    value={formData.medicineStock}
                                    onChange={handleChange}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                    required
                                  />
                                  {errors.medicineBrandName && (
                                    <span className="text-red-600">
                                      {errors.medicineBrandName}
                                    </span>
                                  )}
                                </div>
                                <div className="w-1/2">
                                  <label
                                    htmlFor="medicinePiecesPerItem"
                                    className="block text-sm font-medium text-gray-700 ml-1"
                                  >
                                    Piece/s
                                  </label>
                                  <input
                                    type="number"
                                    id="medicinePiecesPerItem"
                                    value={formData.medicinePiecesPerItem}
                                    onChange={handleChange}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md ml-1"
                                    required
                                  />
                                  {errors.medicinePiecesPerItem && (
                                    <span className="text-red-600">
                                      {errors.medicinePiecesPerItem}
                                    </span>
                                  )}
                                </div>

                                {/* <div className="dropdown dropdown-end w-28">
                                                                                                        <div
                                                                                                            tabIndex={0}
                                                                                                            role="button"
                                                                                                            className="bg-teal-600 text-white text-sm rounded-lg py-3.5 mb-2 text-center font-bold flex justify-center items-center"
                                                                                                        >
                                                                                                            {selectedOption}
                                                                                                            <FaCaretDown className="w-4 h-4 text-white ml-1" />
                                                                                                        </div>

                                                                                                        <ul
                                                                                                            tabIndex={0}
                                                                                                            className="dropdown-content menu rounded-box z-[50] relative w-52 p-2 shadow bg-teal-600 text-white"
                                                                                                        >
                                                                                                            <li className="hover:bg-base-100 rounded-lg hover:text-black">
                                                                                                                <a>Medicines</a>
                                                                                                            </li>
                                                                                                            <li className="hover:bg-base-100 rounded-lg hover:text-black">
                                                                                                                <a>Vaccines</a>
                                                                                                            </li>
                                                                                                            <li className="hover:bg-base-100 rounded-lg hover:text-black">
                                                                                                                <a>Vitamins</a>
                                                                                                            </li>
                                                                                                        </ul>
                                                                                                    </div> */}
                              </div>
                              <div className="flex flex-row">
                                <div className="w-1/2">
                                  <label
                                    htmlFor="medicineLotNo"
                                    className="block text-sm font-medium text-gray-700"
                                  >
                                    Medicine Lot No.
                                  </label>
                                  <input
                                    type="text"
                                    id="medicineLotNo"
                                    value={formData.medicineLotNo}
                                    onChange={handleChange}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded "
                                    required
                                  />
                                  {errors.medicineLotNo && (
                                    <span className="text-red-600">
                                      {errors.medicineLotNo}
                                    </span>
                                  )}
                                </div>
                                <div className="w-1/2">
                                  <label
                                    htmlFor="medicineDosageStrength"
                                    className="block text-sm font-medium text-gray-700 ml-1"
                                  >
                                    Medicine Strength
                                  </label>
                                  <input
                                    type="text"
                                    id="medicineDosageStrength"
                                    value={formData.medicineDosageStrength}
                                    onChange={handleChange}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md ml-1"
                                    required
                                  />
                                  {errors.medicineDosageStrength && (
                                    <span className="text-red-600">
                                      {errors.medicineDosageStrength}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="flex flex-row">
                                <div className="w-[1/2] flex justify-center items-center">
                                  <details className="dropdown dropdown-end ">
                                    <summary
                                      className="btn m-1 bg-black text-white w-52 flex justify-between"
                                      tabIndex={0}
                                      role="button"
                                    >
                                      {selectedOption}
                                      <FaCaretDown className="w-4 h-4 text-white ml-1" />
                                    </summary>
                                    <ul
                                      className="menu dropdown-content  bg-black text-white rounded-box z-[1] w-52 p-2 shadow"
                                      tabIndex={0}
                                    >
                                      {dosage_forms.map((label: string) => (
                                        <li key={label} className="hover:text-black hover:bg-white rounded-lg">
                                          <a
                                            onClick={() => {
                                              setSelectedOption(label);
                                            }}
                                          >
                                            {label}
                                          </a>
                                        </li>
                                      ))}
                                    </ul>
                                  </details>
                                </div>
                                <div className="w-[1/2] flex justify-center items-center">
                                  <details className="dropdown dropdown-end ">
                                    <summary
                                      className="btn m-1 bg-black text-white w-52 flex justify-between"
                                      tabIndex={0}
                                      role="button"
                                    >
                                      {selectedPackaging}
                                      <FaCaretDown className="w-4 h-4 text-white ml-1" />
                                    </summary>
                                    <ul
                                      className="menu dropdown-content  bg-black text-white rounded-box z-[1] w-52 p-2 shadow"
                                      tabIndex={0}
                                    >
                                      {medical_packaging.map((label: string) => (
                                        <li key={label} className="hover:text-black hover:bg-white rounded-lg">
                                          <a
                                            onClick={() => {
                                              setSelectedPackaging(label);
                                            }}
                                          >
                                            {label}
                                          </a>
                                        </li>
                                      ))}
                                    </ul>
                                  </details>
                                </div>
                              </div>
                              <div className="flex flex-row">
                                <div className="w-full">
                                  <label
                                    htmlFor="medicineExpiration"
                                    className="block text-sm font-medium text-gray-700 "
                                  >
                                    Expiration Date
                                  </label>
                                  <input
                                    type="date"
                                    id="medicineExpiration"
                                    value={formData.medicineExpiration}
                                    onChange={handleChange}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                    required
                                  />
                                  {errors.medicineExpiration && (
                                    <span className="text-red-600">
                                      {errors.medicineExpiration}
                                    </span>
                                  )}
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
                                  value={formData.medicineDescription}
                                  onChange={handleChange}
                                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                  rows={4}
                                  required
                                />
                                {errors.medicineDescription && (
                                  <span className="text-red-600">
                                    {errors.medicineDescription}
                                  </span>
                                )}
                              </div>
                              <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse w-full">
                                <button
                                  onClick={handleSubmit}
                                  disabled={loading}
                                  type="button"
                                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                  {loading ? (
                                    <div className="flex items-center justify-center">
                                      <svg
                                        width="800px"
                                        height="800px"
                                        viewBox="0 0 16 16"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        className="animate-spin h-5 w-5 text-white"
                                        clipRule="evenodd"
                                      >
                                        <g
                                          fill="#000000"
                                          fillRule="evenodd"
                                          clipRule="evenodd"
                                        >
                                          <path
                                            d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8z"
                                            opacity=".2"
                                          />

                                          <path d="M7.25.75A.75.75 0 018 0a8 8 0 018 8 .75.75 0 01-1.5 0A6.5 6.5 0 008 1.5a.75.75 0 01-.75-.75z" />
                                        </g>
                                      </svg>
                                      {/* Loading... */}
                                    </div>
                                  ) : (
                                    "Add"
                                  )}
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
                        )}
                        {activeTab === "Vitamin" && (
                          <ModalAddVitamin
                            showModal={showModal}
                            closeModal={closeModal}
                          />
                        )}
                        {activeTab === "Vaccine" && (
                          <AddVaccine
                            showModal={showModal}
                            closeModal={closeModal}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      ;
    </>
  );
};

export default ModalAdd;
