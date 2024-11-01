import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import {
  collection,
  doc,
  setDoc,
  addDoc,
  getDocs,
  DocumentData,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { FaCheckCircle } from "react-icons/fa";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import { MdCancel } from "react-icons/md";
import { FaCaretDown } from "react-icons/fa";
import { FaUpload } from "react-icons/fa";
import { useUser } from "./User";
import { dosage_forms, medical_packaging, vitaminFormData } from "../assets/common/constants";
import { createHistoryLog } from "../utils/historyService";
import { useConfirmation } from '../hooks/useConfirmation';


interface ModalAddVitaminProps {
  showModal: boolean;
  closeModal: (bool: any) => void;
}
const ModalAddVitamin: React.FC<ModalAddVitaminProps> = ({
  showModal,
  closeModal,
}) => {
  const confirm = useConfirmation();


  const [showModalSuccess, setShowModalSucces] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>("Dosage Form");
  const [selectedPackaging, setSelectedPackaging] = useState<string>("Medical Packaging");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(vitaminFormData);
  const [errors, setErrors] = useState<any>({});
  const { user } = useUser();

  const validateForm = () => {
    const newErrors: any = {};
    if (!formData.vitaminGenericName)
      newErrors.vitaminGenericName = "Generic Name is required";
    if (!formData.vitaminBrandName)
      newErrors.vitaminBrandName = "Brand Name is required";
    if (!formData.vitaminStock) newErrors.vitaminStock = "Stock is required";
    if (!formData.vitaminLotNo) newErrors.vitaminLotNo = "Lot No. is required";
    if (!selectedOption)
      newErrors.vitaminDosageForm = "Dosage Form is required";
    if (!formData.vitaminDosageStrength)
      newErrors.vitaminDosageStrength = "Dosage Strength is required";
    if (!formData.vitaminExpiration)
      newErrors.vitaminExpiration = "Expiration Date is required";
    if (!formData.vitaminDescription)
      newErrors.vitaminDescription = "Description is required";
    if (!file) newErrors.vitaminImage = "Image is required";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (e.target instanceof HTMLInputElement && e.target.files) {
      const selectedFile = e.target.files[0];
      if (e.target.id === "vitaminImage") {
        setFile(selectedFile);
        setPreview(URL.createObjectURL(selectedFile));
      } else {
        setFile(null);
        setPreview(null);
      }
    } else {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit = async () => {
    const isConfirmed = await confirm({
      title: 'Confirm Submission',
      message: 'Are you sure you want to add this vitamin?',
    });

    if (isConfirmed) {
      handleConfirmSubmit();
    }
  };

  const handleConfirmSubmit = async () => {
    formData.vitaminDosageForm = selectedOption;
    formData.vitaminPackaging = selectedPackaging;
    if (!validateForm()) return;

    const now = new Date();
    const dateToday = now.toISOString();
    setLoading(true);

    try {
      let vitaminImg = "";
      if (file) {
        const imageRef = ref(storage, `Vitamins/${file.name + v4()}`);
        await uploadBytes(imageRef, file);
        vitaminImg = await getDownloadURL(imageRef);
      }

      const formDataWithImage = {
        ...formData,
        vitaminImg,
        type: "Vitamin",
        created_at: dateToday,
        updated_at: dateToday,
        userId: user?.uid,
        created_by_unit: user?.rhuOrBarangay
      };

      const docRef = await addDoc(collection(db, "Inventory"), formDataWithImage);
      console.log("Document written with ID: ", docRef.id);

      setFormData(vitaminFormData);
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
        itemName: formData.vitaminBrandName,
        fullName: formatFullName,
        barangay: '',
        performedBy: user?.uid || '',
        remarks: `Vitamin ${formData.vitaminBrandName} has been added to the inventory`,
      })


    } catch (error) {
      console.error("Error adding document: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearPreview = () => {
    setPreview(null);
    setFile(null);
    const inputElement = document.getElementById(
      "vitaminImage"
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
            <span className="text-white">Vitamin Added Successfully!</span>
          </div>
        </div>
      )}
      <div className="mt-2 ">
        <form className="space-y-4">
          <div className="flex justify-center items-center">
            <div
              className="relative bg-cover bg-center flex justify-center items-center border-dashed rounded-lg border-2 border-blue-700 w-1/2 h-36 p-2"
              style={{
                backgroundImage: preview ? `url(${preview})` : "none",
              }}
            >
              {!preview && (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    id="vitaminImage"
                    onChange={handleChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    required
                  />
                  <label
                    htmlFor="vitaminImage"
                    className="absolute cursor-pointer"
                  >
                    <FaUpload className="w-6 h-6 text-blue-700" />
                  </label>{" "}
                  <span className="mt-11">Upload Image</span>
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
            {errors.vitaminImage && (
              <span className="text-red-600">Image is required</span>
            )}
          </div>
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
                value={formData.vitaminBrandName}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                required
              />
              {errors.vitaminBrandName && (
                <span className="text-red-600">{errors.vitaminBrandName}</span>
              )}
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
                value={formData.vitaminGenericName}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md ml-1"
                required
              />
              {errors.vitaminGenericName && (
                <span className="text-red-600">
                  {errors.vitaminGenericName}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-row gap-2">
            <div className="w-1/2">
              <label
                htmlFor="vitaminStock"
                className="block text-sm font-medium text-gray-700"
              >
                Vitamin Stock
              </label>
              <input
                type="number"
                id="vitaminStock"
                value={formData.vitaminStock}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                required
              />
              {errors.vitaminStock && (
                <span className="text-red-600">{errors.vitaminStock}</span>
              )}
            </div>
            <div className="w-1/2">
              <label
                htmlFor="vitaminPiecesPerItem"
                className="block text-sm font-medium text-gray-700 ml-1"
              >
                Piece/s
              </label>
              <input
                type="number"
                id="vitaminPiecesPerItem"
                value={formData.vitaminPiecesPerItem}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md ml-1"
                required
              />
              {errors.vitaminPiecesPerItem && (
                <span className="text-red-600">
                  {errors.vitaminPiecesPerItem}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-row">
            <div className="w-1/2">
              <label
                htmlFor="vitaminLotNo"
                className="block text-sm font-medium text-gray-700"
              >
                Vitamin Lot No.
              </label>
              <input
                type="text"
                id="vitaminLotNo"
                value={formData.vitaminLotNo}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
                required
              />
              {errors.vitaminLotNo && (
                <span className="text-red-600">{errors.vitaminLotNo}</span>
              )}
            </div>
            <div className="w-1/2">
              <label
                htmlFor="vitaminDosageStrength"
                className="block text-sm font-medium text-gray-700 ml-1"
              >
                Vitamin Strength
              </label>
              <input
                type="text"
                id="vitaminDosageStrength"
                value={formData.vitaminDosageStrength}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md ml-1"
                required
              />
              {errors.vitaminDosageStrength && (
                <span className="text-red-600">
                  {errors.vitaminDosageStrength}
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
                htmlFor="vitaminExpiration"
                className="block text-sm font-medium text-gray-700 "
              >
                Expiration Date
              </label>
              <input
                type="date"
                id="vitaminExpiration"
                value={formData.vitaminExpiration}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                required
              />
              {errors.vitaminExpiration && (
                <span className="text-red-600">{errors.vitaminExpiration}</span>
              )}
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
              value={formData.vitaminDescription}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              rows={4}
              required
            />
            {errors.vitaminDescription && (
              <span className="text-red-600">{errors.vitaminDescription}</span>
            )}
          </div>
          <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse w-full">
            <button
              onClick={handleSubmit}
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
                    <g fill="#000000" fillRule="evenodd" clipRule="evenodd">
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
    </>
  );
};

export default ModalAddVitamin;
