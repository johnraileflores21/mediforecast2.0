import React, { useState, ChangeEvent, useRef } from "react";
import { auth, db, storage } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import { FaCheckCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { z, ZodType } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createUserWithEmailAndPassword } from "firebase/auth";

// type FormData = {
//   firstName: string;
//   lastName: string;
//   middleName: string;
//   age: number;
//   email: string;
//   phone: string;
//   password: string;
//   confirmPassword: string;
//   barangay: string;
// };

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    middlename: "",
    dateOfBirth: "",
    email: "",
    phone: "",
    password: "",
    gender: "",
    municipality: "Apalit, Pampanga",
    housenoandstreetname: "",
    barangay: "",
    imageUrl: "",
    idFront: "",
    idBack: "",
    rhu: "",
    role: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [idFront, setIdFront] = useState<File | null>(null);
  // const [userData, setUserData] = useState<DocumentData[]>([]);
  const [preview, setPreview] = useState<string | null>(null);
  const [idFrontPreview, setIdFrontPreview] = useState<string | null>(null);
  const [idBack, setIdBack] = useState<File | null>(null);
  const [idBackPreview, setIdBackPreview] = useState<string | null>(null);
  const [showAlertSuccess, setShowAlertSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const idFrontInputRef = useRef<HTMLInputElement>(null);
  const idBackInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const imageUrl = file ? await uploadImage(file, "Image") : "";
      const idFrontUrl = idFront ? await uploadImage(idFront, "ID/Front") : "";
      const idBackUrl = idBack ? await uploadImage(idBack, "ID/Back") : "";

      const rhu = determineRhu(formData.barangay);

      await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = auth.currentUser;

      if (user) {
        const userData = {
          ...formData,
          imageUrl,
          idFront: idFrontUrl,
          idBack: idBackUrl,
          rhu,
        };

        await setDoc(doc(db, "Users", user.uid), userData);
        toast.success("User Registered Successfully!", {
          position: "top-center",
        });
      }
    } catch (error) {
      console.error("Error registering user:", error);
      toast.error("Registration failed. Please try again.", {
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file: File, path: string): Promise<string> => {
    const imageRef = ref(storage, `${path}/-${file.name + v4()}`);
    const snapshot = await uploadBytes(imageRef, file);
    return await getDownloadURL(snapshot.ref);
  };

  const determineRhu = (barangay: string): string => {
    if (["Sulipan", "San Juan", "Capalangan", "Sucad"].includes(barangay)) {
      return "1";
    } else if (
      ["Tabuyuc", "Balucuc", "Cansinala", "Calantipe"].includes(barangay)
    ) {
      return "2";
    } else {
      return "3";
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (e.target instanceof HTMLInputElement && e.target.files) {
      const selectedFile = e.target.files[0];
      if (e.target.id == "image") {
        setFile(selectedFile);
        setPreview(URL.createObjectURL(selectedFile));
      } else if (e.target.id == "id") {
        setIdFront(selectedFile);
        setIdFrontPreview(URL.createObjectURL(selectedFile));
      } else if (e.target.id == "id2") {
        setIdBack(selectedFile);
        setIdBackPreview(URL.createObjectURL(selectedFile));
      } else {
        setFile(null);
        setPreview(null);
        setIdFront(null);
        setIdFrontPreview(null);
        setIdBack(null);
        setIdBackPreview(null);
      }
    } else {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  return (
    <>
      <ToastContainer />
      {showAlertSuccess && (
        <div className="flex flex-row-reverse z-10 relative">
          <div
            role="alert"
            className={`absolute alert alert-success w-auto mt-2 mr-2 flex justify-center items-center z-50 transition-opacity duration-500 ${
              showAlertSuccess ? "opacity-100" : "opacity-0"
            }`}
          >
            <FaCheckCircle className="h-6 w-6 shrink-0 stroke-current text-white" />
            <span className="text-white">
              Registered successfully! Please wait for the admin to approve your
              account.
            </span>
          </div>
        </div>
      )}
      <div className="bg-gray-100">
        <form className="space-y-4" onSubmit={handleRegister}>
          <div className="flex items-center justify-center min-h-screen bg-gray-100 custom-img">
            <div className="relative flex flex-col m-6 space-y-8 bg-white shadow-2xl rounded-2xl md:flex-row md:space-y-0">
              <div className="flex flex-col justify-center p-8 md:px-[59.5px] md:py-[64px]">
                <div className="mb-6">
                  <span className="block mb-3 text-4xl font-bold">
                    Create an account
                  </span>
                  <span className="block font-light text-gray-400">
                    Please fill out the form
                  </span>
                </div>

                <div className="flex flex-col space-y-2 max-h-[280px] overflow-y-auto">
                  <div className="form-control mr-1">
                    <label className="label" htmlFor="firstname">
                      <span className="label-text">First Name</span>
                    </label>
                    <input
                      type="text"
                      id="firstname"
                      className="input w-full md:w-80 p-2 ml-1 border border-gray-300 rounded-md"
                      value={formData.firstname}
                      onChange={handleChange}
                      placeholder="Enter Firstname"
                    />
                  </div>
                  <div className="form-control">
                    <label className="label" htmlFor="middlename">
                      <span className="label-text">Middle Name</span>
                    </label>
                    <input
                      type="text"
                      id="middlename"
                      className="input input-bordered w-full md:w-80 p-2 ml-1 border border-gray-300 rounded-md"
                      value={formData.middlename}
                      onChange={handleChange}
                      placeholder="Enter Middlename"
                    />
                  </div>
                  <div className="form-control">
                    <label className="label" htmlFor="lastname">
                      <span className="label-text">Last Name</span>
                    </label>
                    <input
                      type="text"
                      id="lastname"
                      className="input input-bordered w-full md:w-80 p-2 ml-1 border border-gray-300 rounded-md"
                      value={formData.lastname}
                      onChange={handleChange}
                      placeholder="Enter Lastname"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label" htmlFor="email">
                      <span className="label-text">Email Address</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="input input-bordered w-full md:w-80 p-2 ml-1 border border-gray-300 rounded-md"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter Email Address"
                    />
                  </div>
                  <div className="form-control">
                    <label className="label" htmlFor="dateOfBirth">
                      <span className="label-text">Date of Birth</span>
                    </label>
                    <input
                      type="date"
                      // {...register("age", {
                      //   valueAsNumber: true,
                      // })}
                      id="dateOfBirth"
                      className="input input-bordered w-full md:w-80 ml-1 border border-gray-300 rounded-md"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      required
                    />
                    {/* {errors.age && (
                      <span className="text-red-600 mt-1">
                        {errors.age.message}
                      </span>
                    )} */}
                  </div>

                  <div className="form-control">
                    <label className="label" htmlFor="gender">
                      <span className="label-text">Gender</span>
                    </label>
                    <div className="relative w-full md:w-80">
                      <select
                        id="gender"
                        className="input input-bordered w-full ml-1 border border-gray-300 rounded-md appearance-none"
                        value={formData.gender}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="others">Others</option>
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
                  <div className="form-control">
                    <label className="label" htmlFor="phone">
                      <span className="label-text">Phone Number</span>
                    </label>
                    <input
                      type="tel"
                      // {...register("phone")}
                      id="phone"
                      className="input input-bordered w-full md:w-80 p-2 ml-1 border border-gray-300 rounded-md"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter Phone Number"
                      required
                    />
                    {/* {errors.phone && (
                      <span className="text-red-600">
                        {errors.phone.message}
                      </span>
                    )} */}
                  </div>
                  <div className="form-control">
                    <label htmlFor="address" className="label">
                      <span className="label-text">Address</span>
                    </label>
                    <div className="form-control">
                      <input
                        type="text"
                        id="municipality"
                        value="Apalit, Pampanga"
                        onChange={handleChange}
                        className="input input-bordered w-full md:w-80 p-2 ml-1 border border-gray-300 rounded-md"
                        disabled
                      />
                    </div>
                    <input
                      type="text"
                      id="housenoandstreetname"
                      value={formData.housenoandstreetname}
                      onChange={handleChange}
                      className="input input-bordered w-full md:w-80 p-2 ml-1 mt-2 border border-gray-300 rounded-md"
                      placeholder="House No. & Street Name"
                      required
                    />
                  </div>
                  <div className="form-control">
                    <div className="relative">
                      <select
                        id="barangay"
                        // {...register("barangay")}
                        value={formData.barangay}
                        onChange={handleChange}
                        className="input input-bordered w-80 p-2 ml-1 border border-gray-300 rounded-md apperance-none"
                      >
                        <option value="">Barangay</option>
                        <option value="Balucuc">Balucuc</option>
                        <option value="Calantipe">Calantipe</option>
                        <option value="Cansinala">Cansinala</option>
                        <option value="Capalangan">Capalangan</option>
                        <option value="Colgante">Colgante</option>
                        <option value="Paligui">Paligui</option>
                        <option value="Sampaloc">Sampaloc</option>
                        <option value="San juan">San Juan</option>
                        <option value="San vicente">San Vicente</option>
                        <option value="Sucad">Sucad</option>
                        <option value="Sulipan">Sulipan</option>
                        <option value="Tabuyuc">Tabuyuc</option>
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
                    {/* {errors.barangay && (
                                            <span className="text-red-600 mt-1">
                                                {errors.barangay.message}
                                            </span>
                                        )} */}
                  </div>
                  <div>
                    <label className="label" htmlFor="image">
                      <span className="label-text">Upload Image</span>
                    </label>
                    <div className="form-control flex items-center mt-2">
                      {preview && (
                        <div>
                          <img
                            src={preview}
                            alt="ID"
                            className="w-14 h-14 rounded-full border border-gray-400 mb-3"
                          />
                        </div>
                      )}
                      <div className="flex flex-col">
                        <input
                          type="file"
                          id="image"
                          accept="image/*"
                          ref={fileInputRef}
                          className="input input-bordered w-full p-2 border mb-5  border-gray-300 rounded-md"
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="label" htmlFor="id">
                      <span className="label-text">Upload ID</span>
                    </label>
                    <label className="text-center" htmlFor="id">
                      <span className="label-text flex items-center justify-center text-xs">
                        Front ID
                      </span>
                    </label>
                    <div className="form-control flex items-center mt-2">
                      {idFrontPreview && (
                        <div>
                          <img
                            src={idFrontPreview}
                            alt="ID"
                            className="w-14 h-14 rounded-xl border border-gray-400 mb-3"
                          />
                        </div>
                      )}
                      <div className="flex flex-col">
                        <input
                          type="file"
                          id="id"
                          ref={idFrontInputRef}
                          accept="image/*"
                          className="input input-bordered w-full p-2 border mb-5  border-gray-300 rounded-md"
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-center" htmlFor="id">
                      <span className="label-text flex items-center justify-center text-xs">
                        Back ID
                      </span>
                    </label>
                    <div className="form-control flex items-center mt-2">
                      {idBackPreview && (
                        <div>
                          <img
                            src={idBackPreview}
                            alt="ID"
                            className="w-14 h-14 rounded-xl border border-gray-400 mb-3"
                          />
                        </div>
                      )}
                      <div className="flex flex-col">
                        <input
                          type="file"
                          id="id2"
                          ref={idBackInputRef}
                          accept="image/*"
                          className="input input-bordered w-full p-2 border  border-gray-300 rounded-md"
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="form-control">
                    <label className="label" htmlFor="role">
                      <span className="label-text">Role</span>
                    </label>
                    <div className="relative w-full md:w-80">
                      <select
                        id="role"
                        className="input input-bordered w-full ml-1 border border-gray-300 rounded-md appearance-none"
                        value={formData.role}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select</option>
                        <option value="RHU Staff">
                          Rural Health Unit Staff
                        </option>
                        <option value="Health Center Staff">
                          Barangay Health Center Staff
                        </option>
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
                  <div className="form-control">
                    <label className="label" htmlFor="password">
                      <span className="label-text">Password</span>
                    </label>
                    <input
                      type="password"
                      id="password"
                      className="input input-bordered w-full md:w-80 p-2 ml-1 border border-gray-300 rounded-md"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter Password"
                    />
                  </div>
                  <div className="form-control">
                    <label className="label" htmlFor="password">
                      <span className="label-text">Confirm Password</span>
                    </label>
                    <input
                      type="password"
                      // {...register("confirmPassword")}
                      id="password"
                      className="input input-bordered w-full md:w-80 p-2 ml-1 border border-gray-300 rounded-md mb-4"
                      placeholder="Enter Confirm Password"
                      required
                    />
                    {/* {errors.confirmPassword && (
                      <span className="text-red-600 mt-1">
                        {errors.confirmPassword.message}
                      </span>
                    )} */}
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-teal-800 text-white p-3 rounded-lg mb-6 hover:bg-teal-900 hover:border hover:border-gray-400"
                    disabled={loading}
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
                      "Sign Up"
                    )}
                  </button>
                </div>
                <div className="mt-7 ml-10 text-gray-600">
                  Already have an account?
                  <Link
                    to={"/"}
                    className="font-bold text-teal-700 hover:text-teal-900"
                  >
                    {" "}
                    Login
                  </Link>
                </div>
              </div>

              <div className="relative">
                <img
                  className="w-[400px] h-full hidden rounded-r-2xl md:block object-cover"
                  src="images/backgroundlogo.jpg"
                  alt="/"
                ></img>
              </div>
              <div className="relative hidden md:block"></div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default Register;
