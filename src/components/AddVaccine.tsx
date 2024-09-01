import React, { useState, ChangeEvent } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db, storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import { MdCancel } from "react-icons/md";
import { FaCaretDown, FaUpload } from "react-icons/fa";
import { useUser } from "./User";
import { useForm, SubmitHandler } from "react-hook-form";

interface ModalAddVaccineProps {
  showModal: boolean;
  closeModal: () => void;
}

type FormData = {
  vaccineName: string;
  vaccineBatchNo: string;
  vaccineStock: string;
  vaccineExpiration: string;
  vaccineDescription: string;
  vaccineImage: FileList | null;
};

const ModalAddVaccine: React.FC<ModalAddVaccineProps> = ({
  showModal,
  closeModal,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>();
  const [showModalSuccess, setShowModalSuccess] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>("Vaccine Form");
  const { user } = useUser();
  let inventory = "";

  if (user?.rhuOrBarangay === "1") {
    inventory = "RHU1Inventory";
  } else if (user?.rhuOrBarangay === "2") {
    inventory = "RHU2Inventory";
  } else if (user?.rhuOrBarangay === "3") {
    inventory = "RHU3Inventory";
  }

  const watchImage = watch("vaccineImage");

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleClearPreview = () => {
    setPreview(null);
    reset({ vaccineImage: null } as Partial<FormData>);
  };

  // Custom validation function for future date
  const validateFutureDate = (value: string) => {
    const today = new Date();
    const expirationDate = new Date(value);
    return expirationDate > today || "Expiration date must be in the future";
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const now = new Date();
    const dateToday = now.toISOString();
    setLoading(true);

    try {
      let vaccineImg = "";
      if (data.vaccineImage && data.vaccineImage[0]) {
        const imageRef = ref(
          storage,
          `Vaccines/${data.vaccineImage[0].name + v4()}`
        );
        await uploadBytes(imageRef, data.vaccineImage[0]);
        vaccineImg = await getDownloadURL(imageRef);
      }

      const formDataWithImage = {
        ...data,
        vaccineImg,
        created_at: dateToday,
        updated_at: dateToday,
        vaccineForm: selectedOption,
        type: "Vaccine",
      };

      const docRef = await addDoc(collection(db, inventory), formDataWithImage);
      console.log("Document written with ID: ", docRef.id);

      reset();
      setShowModalSuccess(true);
      setTimeout(() => {
        setShowModalSuccess(false);
        closeModal();
      }, 1000);
    } catch (error) {
      console.error("Error adding document: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-2">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                  {...register("vaccineImage", {
                    required: true,
                  })}
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <label className="absolute cursor-pointer">
                  <FaUpload className="w-6 h-6 text-blue-700" />
                </label>
                <span className="mt-11">Upload Image</span>
              </>
            )}
            {preview && (
              <button
                type="button"
                className="absolute top-2 right-2 bg-white text-gray-600 rounded-full w-6 h-6 flex justify-center items-center hover:bg-gray-200"
                onClick={handleClearPreview}
              >
                <MdCancel className="w-6 h-6 text-red-700" />
              </button>
            )}
          </div>
        </div>
        <div className="flex justify-center items-center">
          {errors.vaccineImage && (
            <span className="text-red-600">Image is required</span>
          )}
        </div>

        <div className="flex flex-row">
          <div className="w-full">
            <label
              htmlFor="vaccineName"
              className="block text-sm font-medium text-gray-700"
            >
              Vaccine Name
            </label>
            <input
              type="text"
              {...register("vaccineName", { required: true })}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.vaccineName && (
              <span className="text-red-600">Vaccine Name is required</span>
            )}
          </div>
          <div className="w-full">
            <label
              htmlFor="vaccineBatchNo"
              className="block text-sm font-medium text-gray-700 ml-1"
            >
              Lot No./Batch No.
            </label>
            <input
              type="text"
              {...register("vaccineBatchNo", { required: true })}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md ml-1"
            />
            {errors.vaccineBatchNo && (
              <span className="text-red-600">Batch No. is required</span>
            )}
          </div>
        </div>
        <div className="flex flex-row">
          <div className="w-1/2">
            <label
              htmlFor="vaccineStock"
              className="block text-sm font-medium text-gray-700"
            >
              Vaccine Stock
            </label>
            <input
              type="text"
              {...register("vaccineStock", { required: true })}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.vaccineStock && (
              <span className="text-red-600">Vaccine Stock is required</span>
            )}
          </div>
          <div className="w-1/2">
            <label
              htmlFor="vaccineStock"
              className="block text-sm font-medium text-gray-700 ml-1"
            >
              Stock Classification
            </label>
            <input
              type="text"
              {...register("vaccineStock", { required: true })}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md ml-1"
            />
            {errors.vaccineStock && (
              <span className="text-red-600">Vaccine Stock is required</span>
            )}
          </div>
        </div>
        <div className="w-full flex justify-center items-center">
          <details className="dropdown dropdown-end">
            <summary
              className="btn m-1 bg-black text-white w-52 flex justify-between"
              tabIndex={0}
              role="button"
            >
              {selectedOption}
              <FaCaretDown className="w-4 h-4 text-white ml-1" />
            </summary>
            <ul
              className="menu dropdown-content bg-black text-white rounded-box z-[1] w-52 p-2 shadow"
              tabIndex={0}
            >
              <li className="hover:text-black hover:bg-white rounded-lg">
                <a onClick={() => setSelectedOption("Vial")}>Vial</a>
              </li>
              <li className="hover:text-black hover:bg-white rounded-lg">
                <a onClick={() => setSelectedOption("Ampoule")}>Ampoule</a>
              </li>
            </ul>
          </details>
        </div>
        <div className="flex flex-row">
          <div className="w-full">
            <label
              htmlFor="vaccineExpiration"
              className="block text-sm font-medium text-gray-700"
            >
              Expiration Date
            </label>
            <input
              type="date"
              {...register("vaccineExpiration", {
                required: "Expiration Date is required",
                validate: validateFutureDate,
              })}
              className="mt-1 text-center block w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.vaccineExpiration && (
              <span className="text-red-600">
                {errors.vaccineExpiration.message}
              </span>
            )}
          </div>
        </div>
        <div>
          <label
            htmlFor="vaccineDescription"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            {...register("vaccineDescription", { required: true })}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            rows={4}
          />
          {errors.vaccineDescription && (
            <span className="text-red-600">Description is required</span>
          )}
        </div>
        <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse w-full">
          <button
            type="submit"
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg
                  width="800px"
                  height="800px"
                  viewBox="0 0 24 24"
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
              </div>
            ) : (
              "Add"
            )}
          </button>
          <button
            type="button"
            onClick={closeModal}
            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ModalAddVaccine;
