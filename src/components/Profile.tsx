import React, { useState } from "react";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
import { useUser } from "./User";
import DashboardLayout from "./DashboardLayout";
import { baseUrl, generateOTP, uploadImage } from "../assets/common/constants";
import { collection, doc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import axios from "axios";
import OtpVerification from "./OtpVerification/Modal";
import Swal from "sweetalert2";

import {
  getAuth,
  reauthenticateWithCredential,
  EmailAuthProvider
} from "firebase/auth";

import { useConfirmation } from "../hooks/useConfirmation";
import { useNavigate } from "react-router-dom";

interface UserProfile {
  firstname: string;
  middlename: string;
  lastname: string;
  dateOfBirth: string;
  phone: string;
  email: string;
  gender: string;
  imageUrl: string;
}

const Profile: React.FC = () => {
  const { user } = useUser();
  const confirm = useConfirmation()

  const obj = {
    firstname: user?.firstname || "",
    middlename: user?.middlename || "",
    lastname: user?.lastname || "",
    dateOfBirth: user?.dateOfBirth || "",
    phone: user?.phone || "",
    email: user?.email || "",
    gender: user?.gender || "",
    imageUrl: user?.imageUrl || "",
  };

  const [profile, setProfile] = useState<UserProfile>(obj);
  const [preview, setPreview] = useState<string | undefined>(user?.imageUrl);
  const [showChangeEmail, setShowChangeEmail] = useState<boolean>(false);
  const [otpID, setOtpID] = useState<any>(null);
  const [modalVerification, setModalVerification] = useState(false);
  const [showNewEmail, setShowNewEmail] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState(""); 
  const [file, setFile] = useState<File | null>(null);
  const isEmailChange = true;

  const a = getAuth();
  const navigate = useNavigate();
  const userAuth = a.currentUser;

  console.log('userAuth :>> ', userAuth);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const _file = e.target.files?.[0];
    if(_file) {
      setFile(_file);
      setPreview(URL.createObjectURL(_file));
      setProfile((prevState) => ({
        ...prevState,
        imageUrl: _file.name,
      }));
    }
  };

  const isProfileChanged = () => {
    return JSON.stringify(profile) !== JSON.stringify(obj);
  };

  const handleSave = async () => {
    if (isProfileChanged()) {

      setShowNewEmail(false);

      // const isConfirmed = await confirm({
      //   title: 'Confirm Submission',
      //   message: 'Are you sure you want to save?',
      // });

      // if(!isConfirmed) return;

      const userAuth = getAuth().currentUser;

      if(!userAuth) {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "User is not authenticated.",
          showConfirmButton: true,
        });
        return;
      }

      let _fUrl = user?.imageUrl;

      if(preview !== user?.imageUrl) {
        const imageUrl = file ? await uploadImage(file, "Image") : "";
        _fUrl = imageUrl;
      }

      console.log('profile :>> ', profile);

      const credential = EmailAuthProvider.credential(userAuth.email, currentPassword);
      await reauthenticateWithCredential(userAuth, credential);

      const userRef = doc(db, "Users", user?.uid);
      await updateDoc(userRef, {
        ...profile,
        imageUrl: _fUrl
      });

      Swal.fire({
        position: "center",
        icon: "success",
        title: 'Profile updated',
        showConfirmButton: false,
        timer: 1500,
      });

      navigate('/');

    }
  };

  const handleCancel = () => {
    // toast.info("Profile update canceled", {
    //   position: "top-right",
    //   autoClose: 3000,
    // });
    setProfile(obj);
    setPreview(user?.imageUrl || undefined);
  };

  const sendCode = async () => {

    const newOtp = generateOTP();

    const newOtpDocRef = doc(collection(db, "OtpVerifications"));
      await setDoc(newOtpDocRef, {
          created_at: serverTimestamp(),
          isValid: true,
          otp: newOtp,
          userId: user?.uid
      });

      await axios.post(`${baseUrl}/forgot-password/change-email-otp`, {
        to: user?.email,
        subject: '[Mediforecast] - Change Email Address | OTP',
        firstName: user?.firstname,
        code: newOtp
    }, { headers: {'token': 's3cretKey'} });

      setOtpID(user?.uid);
      setModalVerification(true);
      setShowChangeEmail(false);
  }

  const updateEmail = (isValid: any) => {
    if(isValid) setShowNewEmail(true);

    // setModalVerification(false);
  }

  const handleUpdateEmail = async () => {
    const auth = getAuth();
    const AuthUser = auth.currentUser;
  
    if (!AuthUser) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "You are not logged in. Please log in first.",
        showConfirmButton: true,
      });
      return;
    }
  
    // Check if the user's email is verified
    if (!AuthUser.emailVerified) {
      try {
        // Resend verification email if the email is not verified
        await sendEmailVerification(user);
  
        Swal.fire({
          position: "center",
          icon: "info",
          title: "We’ve sent a verification email to your inbox. Please verify your email before updating.",
          showConfirmButton: true,
        });
      } catch (error) {
        Swal.fire({
          position: "center",
          icon: "error",
          title: `Failed to send verification email: ${error.message}`,
          showConfirmButton: true,
        });
      }
      return;
    }
  
    // Proceed with email update if the email is verified
    try {
      await updateEmail(AuthUser, newEmail);
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Your email has been updated successfully.",
        showConfirmButton: true,
      });
    } catch (error) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: `Error updating email: ${error.message}`,
        showConfirmButton: true,
      });
    }
  };
  

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-4">Profile</h1>
      <div className="flex flex-col items-center mt-16">
        <div className="w-1/2 space-y-6">

          <div className="form-control flex items-center mt-2">
            {preview && (
              <div>
                <img
                  src={preview}
                  alt="Profile"
                  className="w-14 h-14 rounded-full border border-gray-400 mb-3"
                />
              </div>
            )}
            <div className="flex flex-col">
              <input
                type="file"
                id="image"
                accept="image/*"
                className="input input-bordered w-full p-2 border mb-5 border-gray-300 rounded-md"
                onChange={handleImageChange}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <span className="text-gray-700">First Name</span>
              <input
                type="text"
                value={profile.firstname}
                onChange={(e) =>
                  setProfile({ ...profile, firstname: e.target.value })
                }
                placeholder="Enter your first name"
                className="input input-bordered w-full"
              />
            </div>

            <div className="flex-1">
              <span className="text-gray-700">Middle Name</span>
              <input
                type="text"
                value={profile.middlename}
                onChange={(e) =>
                  setProfile({ ...profile, middlename: e.target.value })
                }
                placeholder="Enter your middle name"
                className="input input-bordered w-full"
              />
            </div>

            <div className="flex-1">
              <span className="text-gray-700">Last Name</span>
              <input
                type="text"
                value={profile.lastname}
                onChange={(e) =>
                  setProfile({ ...profile, lastname: e.target.value })
                }
                placeholder="Enter your last name"
                className="input input-bordered w-full"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <span className="text-gray-700">Birthday</span>
              <input
                type="date"
                value={profile.dateOfBirth}
                onChange={(e) =>
                  setProfile({ ...profile, dateOfBirth: e.target.value })
                }
                className="input input-bordered w-full"
              />
            </div>

            <div className="flex-1">
              <span className="text-gray-700">Contact Number</span>
              <input
                type="text"
                value={profile.phone}
                onChange={(e) =>
                  setProfile({ ...profile, phone: e.target.value })
                }
                placeholder="Enter your contact number"
                className="input input-bordered w-full"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              {/* <span className="text-gray-700">Gender</span>
              <select
                value={profile.gender}
                onChange={(e) =>
                  setProfile({ ...profile, gender: e.target.value })
                }
                className="input input-bordered w-full"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select> */}
            </div>

            <div className="flex-1">
            <div className="flex justify-between items-center gap-4">
              {/* <span className="text-gray-700">Email</span>
              <a 
                onClick={() => setShowChangeEmail(true)}
                className="text-blue-700 text-sm underline hover:text-blue-500 cursor-pointer"
              >
                Change Email
              </a> */}
            </div>
              {/* <input
                type="email"
                value={profile.email}
                readOnly={true}
                onChange={(e) =>
                  setProfile({ ...profile, email: e.target.value })
                }
                placeholder="Enter your email"
                className="input input-bordered w-full"
              /> */}
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            <button
              className="btn bg-green-500 text-white w-1/2"
              onClick={async () => {
                const isConfirmed = await confirm({
                  title: 'Confirmation',
                  message: 'Are you sure you want to save changes?'
                });

                if(!isConfirmed) return;
                setShowNewEmail(true);
              }}
              disabled={!isProfileChanged()}
            >
              Save
            </button>
            <button
              className="btn bg-gray-500 text-white w-1/2"
              onClick={handleCancel}
              disabled={!isProfileChanged()}
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* change email modal */}
      {showChangeEmail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-2xl overflow-auto">
            <div className="flex justify-end mb-4">
              <span onClick={() => setShowChangeEmail(false)} className="cursor-pointer">x</span>
            </div>
            <h1 className="font-bold text-center text-lg">Change Email</h1>
            <br />
            <div style={{ width: '400px' }}>
              <span className="text-gray-700">Email</span>
              <input
                type="email"
                value={profile.email}
                readOnly={true}
                onChange={(e) =>
                  setProfile({ ...profile, email: e.target.value })
                }
                placeholder="Enter your email"
                className="input input-bordered w-full"
              />
              <div className="flex justify-end mt-3">
                <button
                  className="btn bg-green-500 h-[10px] text-white"
                  onClick={sendCode}
                >
                  Send Code
                </button>
              </div>
            </div>
            <br/>
          </div>
        </div>
      )}

      {/* set new password */}
      {showNewEmail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-2xl overflow-auto">
            <div className="flex justify-end mb-4">
              <span onClick={() => setShowNewEmail(false)} className="cursor-pointer">x</span>
            </div>
            {/* <h1 className="font-bold text-center text-lg">Enter your new email</h1> */}
            <br />
            <div style={{ width: '400px' }}>
              <br/>
              <span className="text-gray-700">Enter password to continue</span>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) =>
                  setCurrentPassword(e.target.value)
                }
                className="input input-bordered w-full"
              />
              <div className="flex justify-end mt-3">
                <button
                  className="btn bg-green-500 h-[10px] text-white"
                  onClick={handleSave}
                >
                  Submit
                </button>
              </div>
            </div>
            <br/>
          </div>
        </div>
      )}

      <OtpVerification showModal={modalVerification} userId={otpID} isEmailChange={isEmailChange} closeModal={(isValid) => (isEmailChange && isValid) ? updateEmail(isValid) : setModalVerification(false)} />

      {/* {modalVerification && <ToastContainer />} */}
    </DashboardLayout>
  );
};

export default Profile;
