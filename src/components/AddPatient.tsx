import React, { useState, useEffect, ChangeEvent } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

interface AddPatientProps {
  showModal: boolean;
  closeModal: () => void;
}

const AddPatient: React.FC<AddPatientProps> = ({ showModal, closeModal }) => {
  const [sexdropdown, setSexDropdown] = useState<boolean>(false);
  const [sex, setSex] = useState<string>("Choose Sex");
  const [statusdropdown, setStatusDropdown] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("Choose Status");
  const [broughtByDropdown, setBroughtByDropdown] = useState<boolean>(false);
  const [brought, setBrought] = useState<string>("Brought by");
  const [date, setDate] = useState(new Date());
  const [formData, setFormData] = useState({
    familyName: "",
    firstName: "",
    middleName: "",
    status: "",
    nationality: "",
    age: "",
    sex: "",
    address: "",
    mobileno: "",
    dateOfBirth: "",
    broughtBy: "",
    philMember: "",
    philNumber: "",
    phicMemberName: "",
    date: "",
    time: "",
    rhuOrBarangay: " ",
    created_at: "",
    updated_at: "",
  });

  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 1000);
    return function cleanup() {
      clearInterval(timer);
    };
  });

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

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    const cleanedFormData = Object.fromEntries(
      Object.entries(formData).filter(
        ([_, value]) => value !== "" && value !== null
      )
    );
    const currentDate = new Date();
    cleanedFormData.date = currentDate.toLocaleDateString();
    cleanedFormData.time = currentDate.toLocaleTimeString();
    const dateToday = currentDate.toISOString();
    cleanedFormData.created_at = dateToday;
    cleanedFormData.updated_at = dateToday;
    try {
      await addDoc(
        collection(db, "IndividualTreatmentRecord"),
        cleanedFormData
      );
      console.log("Document successfully written!");
      closeModal();
      window.location.reload();
    } catch (error) {
      console.error("Error adding document: ", error);
      alert(
        "Failed to add patient record. Please check the console for details."
      );
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
                      Add Patient Record
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
                              id="status"
                              tabIndex={0}
                              onClick={handleBroughtDropdown}
                              className="border border-gray-300 text-sm rounded-lg py-3 mb-2 text-center text-gray-700 font-bold bg-base"
                            >
                              {brought}
                            </div>
                            {broughtByDropdown && (
                              <ul
                                className="dropdown-content menu rounded-box z-[50] absolute w-52 p-2 shadow-lg bg-white"
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
