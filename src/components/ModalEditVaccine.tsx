import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Link } from "react-router-dom";
import { db, storage } from "../firebase";
import {
  doc,
  onSnapshot,
  collection,
  updateDoc,
  DocumentData,
  Timestamp,
} from "firebase/firestore";
import { FaCheckCircle, FaUpload } from "react-icons/fa";
import { FaCaretDown } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import {
  getStorage,
  ref as storageRef,
  deleteObject,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { v4 } from "uuid";
import { useUser } from "./User";
import { dosage_forms } from "../assets/common/constants";
import { createHistoryLog }  from '../utils/historyService';
import { useConfirmation } from '../hooks/useConfirmation';

interface ModalEditVaccineProps {
  showModal: boolean;
  closeModal: (bool: any) => void;
  data: any;
}
const ModalEditVaccine: React.FC<ModalEditVaccineProps> = ({
  showModal,
  closeModal,
  data,
}) => {

  const confirm = useConfirmation();

  const [showModalSuccess, setShowModalSucces] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    vaccineImg: "",
    vaccineName: "",
    vaccineBatchNo: "",
    vaccineStock: "",
    vaccineDosageForm: "",
    vaccineExpiration: "",
    vaccineDescription: "",
    updated_at: "",
  });
  const { user } = useUser();

  let inventory = "";

  if (user?.rhuOrBarangay === "1") {
    inventory = "RHU1Inventory";
  } else if (user?.rhuOrBarangay === "2") {
    inventory = "RHU2Inventory";
  } else if (user?.rhuOrBarangay === "3") {
    inventory = "RHU3Inventory";
  }

  useEffect(() => {
    if(data) {
      setFormData(data);
      setSelectedOption(data.vaccineDosageForm || null);
      setPreview(data.vaccineImg || null);
    }
  }, [data]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {



    if (e.target instanceof HTMLInputElement && e.target.files) {
      const selectedFile = e.target.files[0];
      if (e.target.id == "vaccineImg") {
        setFile(selectedFile);
        setPreview(URL.createObjectURL(selectedFile));
      } else {
        setFile(null);
      }
    } else {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleConfirmSubmit = async () => {
    const now = new Date();
    const dateToday = now.toISOString();
    setLoading(true);
    try {
      let imageUrl = formData.vaccineImg;

      if (file) {
        const storageReference = storageRef(
          storage,
          `Vaccines/${file.name + v4()}`
        );
        await uploadBytes(storageReference, file);
        imageUrl = await getDownloadURL(storageReference);
      }
      if (data) {
        if(selectedOption) formData.vaccineDosageForm = selectedOption;
        await updateDoc(doc(db, "Inventory", data.id), {
          ...formData,
          vaccineImg: imageUrl,
          updated_at: dateToday,
        });
      }
      console.log("Document successfully updated!");
      notify();
      setTimeout(() => {
        setShowModalSucces(false);
        closeModal(true);
      }, 1000);

      const formatFullName = `${user?.firstname}${user?.middlename ? ` ${user?.middlename.charAt(0)}.` : ''} ${user?.lastname}`;

      await createHistoryLog({
        actionType: 'update',
        itemId: data.id,
        itemName: data.vaccineName,
        fullName: formatFullName,
        barangay: '',
        performedBy: user?.uid || '',
        remarks: `${formatFullName} updated the ${data.vaccineName} medicine`,
      })

    } catch (error) {
      console.error("Error updating document:", error);
    }

  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const isConfirmed = await confirm({
      title: 'Confirm Submission',
      message: 'Are you sure you want to edit this vaccine?',
    });

    if (isConfirmed) {
      handleConfirmSubmit();
    }

  };

  const handleDeleteImg = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const Img = formData.vaccineImg;
    const desertRef = storageRef(storage, Img);

    deleteObject(desertRef)
      .then(() => {
        toast.success("Successfully Deleted!", {
          position: "top-right",
        });
        console.log("Deleted Successfully");
      })
      .catch((error) => {
        console.log("This is the error: ", error);
      });
    setShowDeleteModal(false);
    setPreview(null);
    setFormData({
      ...formData,
      vaccineImg: "",
    });
    const inputElement = document.getElementById(
      "vaccineImg"
    ) as HTMLInputElement | null;
    if (inputElement) {
      inputElement.value = "";
    }
  };
  const notify = () => {
    toast.success("Successfully Updated!", {
      position: "top-right",
    });
  };
  const showDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowDeleteModal(true);
  };
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  };
  return (
    <>
      <ToastContainer />
      {showModalSuccess && (
        <div className="fixed inset-0 flex justify-end items-start z-50 p-4">
          <div
            role="alert"
            className={`absolute alert alert-success w-80 mr-2 flex justify-center items-center z-50 transition-opacity duration-500 ${
              showModalSuccess ? "opacity-100" : "opacity-0"
            }`}
          >
            <FaCheckCircle className="h-6 w-6 shrink-0 stroke-current text-white" />
            <span className="text-white">Vaccine Updated Successfully!</span>
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
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3
                    className="flex justify-center items-center text-xl leading-6 font-medium text-gray-900 p-2"
                    id="modal-headline"
                  >
                    Edit Vaccine
                  </h3>
                  <div className="mt-2">
                    <form className="space-y-4">
                      <div className="flex justify-center items-center">
                        <div className="relative bg-cover bg-center flex justify-center items-center border-dashed rounded-lg border-2 border-blue-700 w-1/2 h-36 p-2">
                          {preview ? (
                            <img
                              src={preview}
                              alt="Vaccine Preview"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <>
                              <input
                                type="file"
                                accept="image/*"
                                id="vaccineImg"
                                onChange={handleChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                required
                              />
                              <label
                                htmlFor="vaccineImg"
                                className="absolute cursor-pointer flex flex-col items-center justify-center text-center w-full h-full"
                              >
                                <FaUpload className="w-6 h-6 text-blue-700" />
                                <span className="mt-1">Upload Image</span>
                              </label>
                            </>
                          )}
                          {preview && (
                            <button
                              className="absolute top-2 right-2 bg-white text-gray-600 rounded-full w-6 h-6 flex justify-center items-center hover:bg-gray-200"
                              onClick={showDelete}
                            >
                              <MdCancel className="w-6 h-6 text-red-700" />
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-row">
                        {" "}
                        <div className="w-full">
                          <label
                            htmlFor="vaccineName"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Vaccine Name
                          </label>
                          <input
                            type="text"
                            id="vaccineBrandName"
                            value={formData.vaccineName}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            required
                          />
                        </div>
                        <div className="w-full">
                          <label
                            htmlFor="vaccineBatchNo"
                            className="block text-sm font-medium text-gray-700 ml-1"
                          >
                            Batch No./Lot No.
                          </label>
                          <input
                            type="text"
                            id="vaccineBatchNo"
                            value={formData.vaccineBatchNo}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md ml-1"
                            required
                          />
                        </div>
                      </div>
                      <div className="flex flex-row">
                        <div className="w-full">
                          <label
                            htmlFor="vaccineStock"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Vaccine Stock
                          </label>
                          <input
                            type="text"
                            id="vaccineStock"
                            value={formData.vaccineStock}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            required
                          />
                        </div>
                        <details className="dropdown dropdown-end w-52 mt-4">
                          <summary
                            className="btn m-1 bg-black text-white w-52 flex justify-between"
                            tabIndex={0}
                            role="button"
                          >
                            {selectedOption || "Select Vaccine Form"}
                            <FaCaretDown className="w-4 h-4 text-white ml-1" />
                          </summary>
                          <ul
                            className="menu dropdown-content bg-black text-white rounded-box z-[1] w-52 p-2 shadow"
                            tabIndex={0}
                          >
                            {dosage_forms.map((option) => (
                              <li
                                key={option}
                                className="hover:text-black hover:bg-white rounded-lg"
                              >
                                <a
                                  onClick={() => {
                                    setSelectedOption(option);
                                    setFormData({
                                      ...formData,
                                      vaccineDosageForm: option,
                                    });
                                  }}
                                >
                                  {option}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </details>
                      </div>

                      <div className="w-full">
                        <label
                          htmlFor="vaccineExpiration"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Expiration Date
                        </label>
                        <input
                          type="date"
                          id="vaccineExpiration"
                          value={formData.vaccineExpiration}
                          onChange={handleChange}
                          className="mt-1 text-center block w-full p-2 border border-gray-300 rounded-md"
                          required
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
                          value={formData.vaccineDescription}
                          onChange={handleChange}
                          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                          rows={4}
                          required
                        />
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
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
                      className="animate-spin h-5 w-5 mr-3 text-white"
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
                  "Update"
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
          </div>
        </div>
      </div>
      {showDeleteModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <svg
                    className="h-12 w-12 text-red-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                    />
                  </svg>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3
                      className="text-lg leading-6 font-medium text-gray-900"
                      id="modal-headline"
                    >
                      Delete Vaccine Image
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete this vaccine image?
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={handleDeleteImg}
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Delete
                </button>
                <button
                  onClick={closeDeleteModal}
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ModalEditVaccine;
