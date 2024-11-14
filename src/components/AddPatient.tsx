import React, { useState, useEffect, ChangeEvent } from "react";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useUser } from "./User";
import { itrFields, RHUs, ucfirst, ucwords } from "../assets/common/constants";
import { useConfirmation } from "../hooks/useConfirmation";
import Swal from "sweetalert2";

interface AddPatientProps {
  showModal: boolean;
  closeModal: () => void;
  editForm?: any;
  isEdit?: boolean;
}

const AddPatient: React.FC<AddPatientProps> = ({
  showModal,
  closeModal,
  editForm,
  isEdit,
}) => {
  const [sexdropdown, setSexDropdown] = useState<boolean>(false);
  const [sex, setSex] = useState<string>("Choose Sex");
  const [statusdropdown, setStatusDropdown] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("Choose Status");
  const [broughtByDropdown, setBroughtByDropdown] = useState<boolean>(false);
  const [brought, setBrought] = useState<string>("Brought by");
  const [date, setDate] = useState(new Date());
  const { user } = useUser();
  const [formData, setFormData] = useState(itrFields);
  const [error, setError] = useState<any>([]);

  const confirm = useConfirmation();

  const userBarangay = user?.rhuOrBarangay || "";
  const isRHU = userBarangay.length == 1;

  const rhuIndex = isRHU
    ? userBarangay
    : RHUs.findIndex((rhu) => rhu.barangays.includes(userBarangay)) + 1;

  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 1000);
    return function cleanup() {
      clearInterval(timer);
    };
  });

  useEffect(() => {
    console.log("editForm :>> ", editForm);
    if (editForm && isEdit) {
      setFormData(editForm);
    }
  }, [editForm]);

  const handleSexDropdown = () => {
    setSexDropdown(!sexdropdown);
  };

  const handleSexOption = (sex: string) => {
    setSex(sex);
    setFormData({ ...formData, sex });
    setSexDropdown(false);
  };

  const handleStatusDropdown = () => {
    setStatusDropdown(!statusdropdown);
  };

  const handleStatusOption = (status: string) => {
    setStatus(status);
    setFormData({ ...formData, status });
    setStatusDropdown(false);
  };

  const handleBroughtDropdown = () => {
    setBroughtByDropdown(!broughtByDropdown);
  };

  const handleBroughtOption = (brought: string) => {
    setBrought(brought);
    setFormData({ ...formData, broughtBy: brought });
    setBroughtByDropdown(false);
  };

  // const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  //   const isName = ['familyName', 'firstName', 'middleName'];
  //   const ucFields = ['nationality', 'phicMemberName', 'complaints', 'history', 'diagnosis', 'order'];

  //   setFormData({
  //     ...formData,
  //     [e.target.id]: (isName.includes(e.target.id)) ? ucwords(e.target.value)
  //       : (ucFields.includes(e.target.id)) ? ucfirst(e.target.value)
  //       : (e.target.id) == 'address' ? ucwords(e.target.value, true)
  //       : e.target.value,
  //   });
  // };
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const isName = ["familyName", "firstName", "middleName"];
    const ucFields = [
      "nationality",
      "phicMemberName",
      "complaints",
      "history",
      "diagnosis",
      "order",
    ];

    setFormData((prevData) => ({
      ...prevData,
      [e.target.id]: isName.includes(e.target.id)
        ? ucwords(e.target.value) // Capitalizes each word for name fields
        : ucFields.includes(e.target.id)
        ? ucfirst(e.target.value) // Capitalizes the first letter for certain fields
        : e.target.id === "address"
        ? ucwords(e.target.value, true) // Capitalizes each word for address
        : e.target.value,
    }));
  };

  // Usage example for ucwords and ucfirst:
  const ucwords = (str: string, capitalizeAll: boolean = false): string => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const ucfirst = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const handleSubmit = async () => {
    const isConfirmed = await confirm({
      title: "Confirm Submission",
      message: `Are you sure you want to ${
        isEdit ? "update" : "add"
      } this ITR?`,
    });

    if (!isConfirmed) return;

    const cleanedFormData = Object.fromEntries(
      Object.entries(formData).filter(
        ([_, value]) => value !== "" && value !== null
      )
    );
    const currentDate = new Date();
    cleanedFormData.date = currentDate.toLocaleDateString();
    cleanedFormData.time = currentDate.toLocaleTimeString();
    const dateToday = currentDate.toISOString();

    cleanedFormData.updated_at = dateToday;
    cleanedFormData.rhuOrBarangay = userBarangay;

    const requiredFields = [
      "familyName",
      "firstName",
      "middleName",
      "sex",
      "status",
      "nationality",
      "age",
      "mobileno",
      "dateOfBirth",
      "address",
    ];

    const missingFields = requiredFields.filter(
      (field) => !cleanedFormData[field]
    );
    if (missingFields.length) {
      setError(missingFields.length ? missingFields : []);
      return Swal.fire({
        position: "center",
        icon: "error",
        title: `Fill out required fields`,
        showConfirmButton: false,
        timer: 1000,
      });
    }

    try {
      if (!isEdit) {
        cleanedFormData.created_at = dateToday;

        await addDoc(
          collection(db, "IndividualTreatmentRecord"),
          cleanedFormData
        );
      } else {
        const id = editForm.id;

        const docRef = doc(db, "IndividualTreatmentRecord", id);
        await updateDoc(docRef, cleanedFormData);
      }
      Swal.fire({
        position: "center",
        icon: "success",
        title: `ITR ${isEdit ? "updated" : "created"} successfully`,
        showConfirmButton: false,
        timer: 1000,
      });
      closeModal();
    } catch (error) {
      console.error("Error adding document: ", error);
      Swal.fire({
        position: "center",
        icon: "error",
        title: `Unable to create ITR`,
        showConfirmButton: false,
        timer: 1000,
      });
    }
  };

  return (
    <>
      {showModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <div className="inline-block align-bottom bg-white rounded-lg max-h-[600px] overflow-y-auto shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-center">
                    <h3 className="text-xl p-2 leading-6 font-medium text-gray-900">
                      {isEdit ? "Update" : "Add"} Patient Record
                    </h3>
                    <div>
                      <div className="grid grid-cols-3 gap-4 mt-4">
                        <div className="w-full">
                          <label
                            htmlFor="familyName"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Family Name
                          </label>
                          <input
                            type="text"
                            id="familyName"
                            onChange={handleChange}
                            value={formData.familyName}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                          />
                          {error.includes("familyName") && (
                            <p className="text-red-500 text-sm ">
                              Family Name is required
                            </p>
                          )}
                        </div>
                        <div className="w-full">
                          <label
                            htmlFor="firstName"
                            className="block text-sm font-medium text-gray-700"
                          >
                            First Name
                          </label>
                          <input
                            type="text"
                            onChange={handleChange}
                            value={formData.firstName}
                            id="firstName"
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                          />
                          {error.includes("firstName") && (
                            <p className="text-red-500 text-sm ">
                              First Name is required
                            </p>
                          )}
                        </div>
                        <div>
                          <label
                            htmlFor="middleName"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Middle Name
                          </label>
                          <input
                            type="text"
                            id="middleName"
                            onChange={handleChange}
                            value={formData.middleName}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                          />
                          {error.includes("middleName") && (
                            <p className="text-red-500 text-sm ">
                              Middle Name is required
                            </p>
                          )}
                        </div>
                        <div>
                          <div className="dropdown w-48 relative">
                            <label
                              htmlFor="sex"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Sex
                            </label>
                            <div
                              role="button"
                              id="sex"
                              tabIndex={0}
                              onClick={handleSexDropdown}
                              className="border border-gray-300 text-sm rounded-lg py-3 mb-2 text-center text-gray-700 font-bold bg-base"
                            >
                              {sex}
                            </div>
                            {sexdropdown && (
                              <ul
                                className="dropdown-content menu rounded-box z-[50] absolute w-52 p-2 shadow-lg bg-white"
                                tabIndex={0}
                              >
                                <li className="hover:bg-base-100 rounded-lg hover:text-black">
                                  <a
                                    onClick={() =>
                                      handleSexOption("Choose Sex")
                                    }
                                  >
                                    Choose Sex
                                  </a>
                                </li>
                                <li className="hover:bg-base-100 rounded-lg hover:text-black">
                                  <a onClick={() => handleSexOption("Male")}>
                                    Male
                                  </a>
                                </li>
                                <li className="hover:bg-base-100 rounded-lg hover:text-black">
                                  <a onClick={() => handleSexOption("Female")}>
                                    Female
                                  </a>
                                </li>
                              </ul>
                            )}
                            {error.includes("sex") && (
                              <p className="text-red-500 text-sm ">
                                Sex is required
                              </p>
                            )}
                          </div>
                        </div>
                        <div>
                          <div className="dropdown w-48 relative">
                            <label
                              htmlFor="status"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Status
                            </label>
                            <div
                              role="button"
                              id="status"
                              tabIndex={0}
                              onClick={handleStatusDropdown}
                              className="border border-gray-300 text-sm rounded-lg py-3 mb-2 text-center text-gray-700 font-bold bg-base"
                            >
                              {status}
                            </div>
                            {statusdropdown && (
                              <ul
                                className="dropdown-content menu rounded-box z-[50] absolute w-52 p-2 shadow-lg bg-white"
                                tabIndex={0}
                              >
                                <li className="hover:bg-base-100 rounded-lg hover:text-black">
                                  <a
                                    onClick={() =>
                                      handleStatusOption("Choose Status")
                                    }
                                  >
                                    Choose Status
                                  </a>
                                </li>
                                <li className="hover:bg-base-100 rounded-lg hover:text-black">
                                  <a
                                    onClick={() => handleStatusOption("Single")}
                                  >
                                    Single
                                  </a>
                                </li>
                                <li className="hover:bg-base-100 rounded-lg hover:text-black">
                                  <a
                                    onClick={() =>
                                      handleStatusOption("Married")
                                    }
                                  >
                                    Married
                                  </a>
                                </li>
                                <li className="hover:bg-base-100 rounded-lg hover:text-black">
                                  <a
                                    onClick={() =>
                                      handleStatusOption("Widowed")
                                    }
                                  >
                                    Widowed
                                  </a>
                                </li>
                                <li className="hover:bg-base-100 rounded-lg hover:text-black">
                                  <a
                                    onClick={() =>
                                      handleStatusOption("Divorced")
                                    }
                                  >
                                    Divorced
                                  </a>
                                </li>
                              </ul>
                            )}
                            {error.includes("status") && (
                              <p className="text-red-500 text-sm ">
                                Status is required
                              </p>
                            )}
                          </div>
                        </div>
                        <div>
                          <label
                            htmlFor="nationality"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Nationality
                          </label>
                          <input
                            type="text"
                            id="nationality"
                            onChange={handleChange}
                            value={formData.nationality}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                          />
                          {error.includes("nationality") && (
                            <p className="text-red-500 text-sm ">
                              Nationality is required
                            </p>
                          )}
                        </div>
                        <div>
                          <label
                            htmlFor="age"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Age
                          </label>
                          <input
                            type="number"
                            id="age"
                            onChange={handleChange}
                            value={formData.age}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                          />
                          {error.includes("age") && (
                            <p className="text-red-500 text-sm ">
                              Age is required
                            </p>
                          )}
                        </div>
                        <div>
                          <label
                            htmlFor="mobileno"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Mobile No.
                          </label>
                          <input
                            type="tel"
                            onChange={handleChange}
                            value={formData.mobileno}
                            id="mobileno"
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                          />
                          {error.includes("mobileno") && (
                            <p className="text-red-500 text-sm ">
                              Mobile No is required
                            </p>
                          )}
                        </div>
                        <div>
                          <label
                            htmlFor="dateOfBirth"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Date of Birth
                          </label>
                          <input
                            type="date"
                            onChange={handleChange}
                            value={formData.dateOfBirth}
                            id="dateOfBirth"
                            className="mt-1 block w-full p-2 text-center border border-gray-300 rounded-md"
                          />
                          {error.includes("dateOfBirth") && (
                            <p className="text-red-500 text-sm ">
                              Date of Birth is required
                            </p>
                          )}
                        </div>
                      </div>
                      <div>
                        <label
                          htmlFor="address"
                          className="block text-sm font-medium text-gray-700 mt-4"
                        >
                          Address
                        </label>
                        <textarea
                          name=""
                          id="address"
                          onChange={handleChange}
                          rows={2}
                          value={formData.address}
                          className="w-full p-2 border border-gray-300 rounded-md mt-1"
                        ></textarea>
                        {error.includes("address") && (
                          <p className="text-red-500 text-sm ">
                            Address is required
                          </p>
                        )}
                      </div>
                      <div className="grid grid-cols-3 gap-4 mt-4">
                        <div>
                          <div className="dropdown w-48 relative">
                            <label
                              htmlFor="brought"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Brought By
                            </label>
                            <div
                              role="button"
                              id="brought"
                              tabIndex={0}
                              onClick={handleBroughtDropdown}
                              className="border border-gray-300 text-sm rounded-lg py-3 mb-2 text-center text-gray-700 font-bold bg-base"
                            >
                              {brought}
                            </div>
                            {broughtByDropdown && (
                              <ul
                                className="dropdown-content menu rounded-box absolute w-52 p-2 shadow-lg bg-white z-[100] top-[-220px]" // Increased z-index
                                tabIndex={0}
                              >
                                <li className="hover:bg-base-100 rounded-lg hover:text-black">
                                  <a
                                    onClick={() =>
                                      handleBroughtOption("Choose Brought By")
                                    }
                                  >
                                    Choose Brought By
                                  </a>
                                </li>
                                <li className="hover:bg-base-100 rounded-lg hover:text-black">
                                  <a
                                    onClick={() => handleBroughtOption("Self")}
                                  >
                                    Self
                                  </a>
                                </li>
                                <li className="hover:bg-base-100 rounded-lg hover:text-black">
                                  <a
                                    onClick={() =>
                                      handleBroughtOption("Police")
                                    }
                                  >
                                    Police
                                  </a>
                                </li>
                                <li className="hover:bg-base-100 rounded-lg hover:text-black">
                                  <a
                                    onClick={() =>
                                      handleBroughtOption("Ambulance")
                                    }
                                  >
                                    Ambulance
                                  </a>
                                </li>
                                <li className="hover:bg-base-100 rounded-lg hover:text-black">
                                  <a
                                    onClick={() =>
                                      handleBroughtOption("Relative")
                                    }
                                  >
                                    Relatives
                                  </a>
                                </li>
                                <li className="hover:bg-base-100 rounded-lg hover:text-black">
                                  <a
                                    onClick={() => handleBroughtOption("Other")}
                                  >
                                    Other
                                  </a>
                                </li>
                              </ul>
                            )}
                          </div>
                          {/* {error.includes('broughtBy') && <p className="text-red-500 text-sm ">Brought By is required</p>} */}
                        </div>

                        <div>
                          <label
                            htmlFor="philmem"
                            className="block text-sm font-medium text-gray-700"
                          >
                            PhilHealth Member?
                          </label>
                          <div className="w-full p-3 border border-gray-300 rounded-md">
                            <div className="flex flex-row gap-1 justify-center items-center">
                              <input
                                type="radio"
                                name="philmem"
                                id="philmemyes"
                                value="Yes"
                                checked={formData.philMember === "Yes"}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    philMember: e.target.value,
                                  })
                                }
                              />
                              <label
                                htmlFor="philmemyes"
                                className="block text-sm font-medium text-gray-700 mr-4"
                              >
                                Yes
                              </label>
                              <input
                                type="radio"
                                name="philmem"
                                id="philmemno"
                                value="No"
                                checked={formData.philMember === "No"}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    philMember: e.target.value,
                                  })
                                }
                              />
                              <label
                                htmlFor="philmemno"
                                className="block text-sm font-medium text-gray-700"
                              >
                                No
                              </label>
                            </div>
                          </div>
                          {/* {error.includes('philMember') && <p className="text-red-500 text-sm ">This field is required</p>} */}
                        </div>
                        <div>
                          <label
                            htmlFor="philnum"
                            className="block text-sm font-medium text-gray-700"
                          >
                            PhilHealth Number
                          </label>
                          <input
                            type="text"
                            onChange={handleChange}
                            id="philNumber"
                            value={formData.philNumber}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                          />
                          {/* {error.includes('philNumber') && <p className="text-red-500 text-sm ">Philhealth Number is required</p>} */}
                        </div>
                      </div>
                      <div>
                        <label
                          htmlFor="phicmemname"
                          className="block text-sm font-medium text-gray-700 mt-4"
                        >
                          PHIC Member Name
                        </label>
                        <input
                          type="text"
                          onChange={handleChange}
                          id="phicMemberName"
                          value={formData.phicMemberName}
                          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        />
                        {/* {error.includes('phicMemberName') && <p className="text-red-500 text-sm ">PHIC Member Name is required</p>} */}
                      </div>
                      <div>
                        <label
                          htmlFor="complaints"
                          className="block text-sm font-medium text-gray-700 mt-4"
                        >
                          Chief Complaints
                        </label>
                        <textarea
                          name=""
                          id="complaints"
                          onChange={handleChange}
                          rows={2}
                          value={formData.complaints}
                          className="w-full p-2 border border-gray-300 rounded-md mt-1"
                        ></textarea>
                        {/* {error.includes('complaints') && <p className="text-red-500 text-sm ">Chief Complaints is required</p>} */}
                      </div>
                      <div>
                        <label
                          htmlFor="history"
                          className="block text-sm font-medium text-gray-700 mt-4"
                        >
                          Brief History
                        </label>
                        <textarea
                          name=""
                          id="history"
                          onChange={handleChange}
                          rows={2}
                          value={formData.history}
                          className="w-full p-2 border border-gray-300 rounded-md mt-1"
                        ></textarea>
                        {/* {error.includes('history') && <p className="text-red-500 text-sm ">Brief History is required</p>} */}
                      </div>
                      <div className="grid grid-cols-6 gap-4 mt-4">
                        <div className="w-full">
                          <label
                            htmlFor="physicalExamBP"
                            className="block text-sm font-medium text-gray-700"
                          >
                            VS:BP
                          </label>
                          <input
                            type="text"
                            id="physicalExamBP"
                            onChange={handleChange}
                            value={formData.physicalExamBP}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                          />
                        </div>
                        <div className="w-full">
                          <label
                            htmlFor="physicalExamHR"
                            className="block text-sm font-medium text-gray-700"
                          >
                            HR
                          </label>
                          <input
                            type="text"
                            onChange={handleChange}
                            value={formData.physicalExamHR}
                            id="physicalExamHR"
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="physicalExamPR"
                            className="block text-sm font-medium text-gray-700"
                          >
                            PR
                          </label>
                          <input
                            type="text"
                            id="physicalExamPR"
                            onChange={handleChange}
                            value={formData.physicalExamPR}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="physicalExamT"
                            className="block text-sm font-medium text-gray-700"
                          >
                            T
                          </label>
                          <input
                            type="text"
                            id="physicalExamT"
                            onChange={handleChange}
                            value={formData.physicalExamT}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="physicalExamT"
                            className="block text-sm font-medium text-gray-700"
                          >
                            WT
                          </label>
                          <input
                            type="text"
                            id="physicalExamWT"
                            onChange={handleChange}
                            value={formData.physicalExamWT}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="physicalExamH"
                            className="block text-sm font-medium text-gray-700"
                          >
                            H
                          </label>
                          <input
                            type="text"
                            id="physicalExamH"
                            onChange={handleChange}
                            value={formData.physicalExamH}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                          />
                        </div>
                      </div>
                      {/* {error.map((e: string) => e.includes('physicalExam') ? 'physicalExam' : e)
                        .includes('physicalExam') &&
                          <p className="text-red-500 text-sm ">Physical Exam Fields are required</p>} */}
                      <div>
                        <label
                          htmlFor="diagnosis"
                          className="block text-sm font-medium text-gray-700 mt-4"
                        >
                          Diagnosis
                        </label>
                        <textarea
                          name=""
                          id="diagnosis"
                          onChange={handleChange}
                          rows={2}
                          value={formData.diagnosis}
                          className="w-full p-2 border border-gray-300 rounded-md mt-1"
                        ></textarea>
                        {/* {error.includes('diagnosis') && <p className="text-red-500 text-sm ">Diagnosis is required</p>} */}
                      </div>
                      <div>
                        <label
                          htmlFor="order"
                          className="block text-sm font-medium text-gray-700 mt-4"
                        >
                          Doctor's Order
                        </label>
                        <textarea
                          name=""
                          id="order"
                          onChange={handleChange}
                          rows={2}
                          value={formData.order}
                          className="w-full p-2 border border-gray-300 rounded-md mt-1"
                        ></textarea>
                        {/* {error.includes('order') && <p className="text-red-500 text-sm ">Doctor's Order is required</p>} */}
                      </div>
                    </div>
                    <div className="flex justify-end mt-4 gap-2">
                      <button
                        type="button"
                        onClick={closeModal}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        Close
                      </button>
                      <button
                        type="button"
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-green-500 text-white rounded-md shadow-sm hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddPatient;
