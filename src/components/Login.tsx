import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  sendPasswordResetEmail,
  updatePassword,
} from "firebase/auth";
import bcrypt from "bcryptjs";
import { auth, db } from "../firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useUser } from "./User";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { collection, onSnapshot, updateDoc, addDoc, doc, query, where, getDoc, setDoc, getDocs } from "firebase/firestore";
import { baseUrl } from "../assets/common/constants";
import axios from 'axios';
import OtpVerification from "./OtpVerification/Modal";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(true);
  const [modalVerification, setModalVerification] = useState(false);
  const [otpID, setOtpID] = useState<string>("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { setUser } = useUser();
  const [error, setError] = useState("");
  const [errorEmail, setErrorEmail] = useState<string | null>(null);
  const [errors, setErrors] = useState(false);
  const [forgotPasswordModalOpen, setForgotPasswordModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [errorPass, setErrorPass] = useState<string | null>(null);
  const MySwal = withReactContent(Swal);
  const [newPassword, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isOtpSent, setIsOtpSent] = useState<boolean>(false);
  const [submitLoading, setSubmitLoading] = useState(false);


  const showCommonToast = (message: string) => {
    const errMessage = !message.includes('Invalid')
      ? `Your account ${message}.`
      : 'Invalid Email or Password';
      
    toast.error(errMessage, { position: "top-right", autoClose: 3000 });
    setError(errMessage);
    setErrors(true);
  }

  const sendOtp = async () => {
    try {
      setSubmitLoading(true);

      const q = query(
        collection(db, "Users"),
        where("email", "==", resetEmail)
      );

      console.log('resetEmail :>> ', resetEmail);
      const querySnapshot = await getDocs(q);
      console.log('querySnapshot.docs :>> ', querySnapshot.docs);

      if(querySnapshot.empty) {
        MySwal.fire({
          position: "center",
          icon: "error",
          title: "User not found!",
          showConfirmButton: false,
          timer: 1000,
        });
        return;
      } else {
        const user = querySnapshot.docs[0].data();

        console.log('user :>> ', user);
        const code = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;

        await axios.post(`${baseUrl}/forgot-password/send-otp`, {
          to: user?.email,
          subject: 'Reset Password | OTP',
          firstName: user?.firstName,
          code
        }, { headers: {'token': 's3cretKey'} });

        await addDoc(collection(db, "OtpVerifications"), {
          otp: code,
          userId: querySnapshot.docs[0]?.id,
          isValid: true,
          created_at: new Date()
        });

        setIsOtpSent(true);
      }
      
    } catch (error) {
      MySwal.fire({
        position: "center",
        icon: "error",
        title: "Unable to send OTP!",
        showConfirmButton: false,
        timer: 1000,
      });
    } finally {
      setSubmitLoading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    if (!email) {
      setErrorEmail("This field is required!");
      setLoading(false);
      return;
    }

    setError("");

    try {
      const persistence = rememberMe
        ? browserLocalPersistence
        : browserSessionPersistence;

      await setPersistence(auth, persistence);

      const userQuery = query(collection(db, "Users"), where("email", "==", email));
      const querySnapshot = await getDocs(userQuery);
      if(querySnapshot.empty)
        return showCommonToast('Invalid');

      const userDoc = querySnapshot.docs[0];
      console.log('userDoc :>> ', userDoc);
      const userData = userDoc.data();

      console.log('userData :>> ', userData);

      const isPasswordValid = await bcrypt.compare(password, userData.password);
      console.log('isPasswordValid :>> ', isPasswordValid);

      if(!isPasswordValid) {
        const log = await signInWithEmailAndPassword(auth, email, password);
        if(!log.user) return showCommonToast('Invalid');
        await updatePassword(log.user, password);
        const userDocRef = doc(db, 'Users', log.user.uid);
        const newPass = await bcrypt.hash(password, 10);
        await updateDoc(userDocRef, { password: newPass });
      }

      if(userData.acc_status === "for_verification") {
        console.log('test');
        setOtpID(userDoc.id);
        return setModalVerification(true);
      } else if(userData.acc_status === "pending") {
        return showCommonToast('is pending approval');
      } else if (userData.acc_status === "decline") {
        return showCommonToast('has been declined');
      } else {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        const user = userCredential.user;

        MySwal.fire({
          position: "center",
          icon: "success",
          title: "User Logged In Successfully!",
          showConfirmButton: false,
          timer: 1000,
        });

        const payload = {
          firstname: userData.firstname || "",
          lastname: userData.lastname || "",
          email: userData.email || "",
          rhuOrBarangay: userData.rhuOrBarangay || "",
          imageUrl: userData.imageUrl || "",
          barangay: userData.barangay || "",
          uid: user.uid || "",
          role: userData.role
        };

        setUser(payload);

        setTimeout(() => {
          navigate("/dashboard");
        }, 700);
      }

    } catch (error) {
      console.log('error :>> ', error);
      toast.error("Invalid Email or Password!", {
        position: "top-right",
        autoClose: 1000,
      });
      setError("Invalid Email or Password!");
      setErrors(true);
    } finally {
      setLoading(false);
    }
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleForgotPassword = () => {
    setForgotPasswordModalOpen(true);
  };

  const handleResetEmailSend = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log('test');
    e.preventDefault();
    setLoading(true);

    // Regular expression for password validation
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    // Check if new password meets criteria
    // if (!passwordRegex.test(newPassword)) {
    //   setPasswordError(
    //     "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character."
    //   );
    //   setLoading(false);
    //   return;
    // } else {
    //   setPasswordError(""); // Clear error if password is valid
    // }

    try {
      // Check if the email is associated with an existing user
      const usersCollection = collection(db, "Users");
      const q = query(usersCollection, where("email", "==", resetEmail));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        toast.error("No user found with this email address.", {
          position: "top-right",
          autoClose: 3000,
        });
        setLoading(false);
        return;
      }

      // If the user exists, send the password reset email
      await sendPasswordResetEmail(auth, resetEmail);
      MySwal.fire({
        position: "center",
        icon: "success",
        title: "Password reset email sent successfully!",
        showConfirmButton: false,
        timer: 1500,
      });

      // Close the modal
      setForgotPasswordModalOpen(false);
    } catch (error) {
      console.error("Error sending reset email:", error);
      toast.error("Failed to send password reset email. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="flex items-center justify-center min-h-screen bg-gray-100 custom-img">
        <div className="relative flex flex-col m-6 space-y-8 bg-white shadow-2xl rounded-2xl md:flex-row md:space-y-0">
          <form
            className="flex flex-col justify-center p-8 md:p-14"
            onSubmit={handleSubmit}
          >
            <span className="mb-3 text-4xl font-bold">Welcome</span>
            <span className="font-light text-gray-400 mb-8">
              Welcome! Please enter your details
            </span>
            {error && (
              <span className="absolute top-[26%] left-32 text-red-500">
                {error}
              </span>
            )}
            <div className="py-4">
              <span className="mb-2 text-md">Email</span>
              <input
                type="email"
                className={`w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500 ${
                  errorEmail ? "border-red-800" : "border-gray-300"
                } ${errors ? "border-red-800" : " border-gray-300"} `}
                id="email"
                placeholder="Enter Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {errorEmail && (
              <span className="text-red-500 text-sm">{errorEmail}</span>
            )}
            <div className="py-4">
              <span className="mb-2 text-md">Password</span>
              <input
                type={showPassword ? "password" : "text"}
                id="password"
                className={`w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500 ${
                  errorPass ? "border-red-800" : "border-gray-300"
                } ${errors ? "border-red-800" : " border-gray-300"}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
              />
              {showPassword ? (
                <FaEye
                  onClick={handleShowPassword}
                  className={`w-6 h-6 absolute left-[42%] top-[56%] md:left-[42%] md:top-[53%] text-teal-800 cursor-pointer ${
                    errorEmail ? "xl:top-[57%]" : "xl:top-[56%]"
                  }`}
                />
              ) : (
                <FaEyeSlash
                  onClick={handleShowPassword}
                  className={`w-6 h-6 absolute left-[42%] top-[56%] md:left-[42%] md:top-[53%] text-teal-800 cursor-pointer ${
                    errorEmail ? "xl:top-[57%]" : "xl:top-[56%]"
                  }`}
                />
              )}
            </div>
            {errorPass && (
              <span className="text-red-500 text-sm relative">{errorPass}</span>
            )}
            <div className="flex justify-between w-full py-4">
              <div className="mr-24">
                <input
                  type="checkbox"
                  id="remember"
                  className="mr-2"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="text-md">Remember Me</span>
              </div>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="font-bold text-md text-teal-700 hover:text-teal-900"
              >
                Forgot password
              </button>
            </div>
            <button
              type="submit"
              className="w-full bg-teal-700 text-center text-white p-2 rounded-lg mb-6 hover:bg-teal-800 hover:border hover:border-gray-300"
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
                "Login"
              )}
            </button>
            <div className="text-center text-gray-600">
              Don't have an account?
              <Link
                to="/register"
                className="font-bold text-teal-700 hover:text-teal-900"
              >
                {" "}
                Sign up
              </Link>
            </div>
          </form>
          <div className="relative">
            <img
              className="w-[400px] h-full hidden rounded-r-2xl md:block object-cover"
              src="images/backgroundlogo.jpg"
              alt="/"
            />
          </div>
        </div>
      </div>

      {forgotPasswordModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-semibold mb-4">Forgot Password</h2>
            <form onSubmit={handleResetEmailSend}>
              <label htmlFor="reset-email" className="block mb-2 text-md">
                Enter your email address
              </label>
              <input
                type="email"
                id="reset-email"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="Enter Email Address"
                required
              />

              {/* New Password Field */}
              {/* {isOtpSent && <>
                <label htmlFor="new-password" className="block mb-2 text-md mt-4">
                  New Password
                </label>
                <input
                  type="password"
                  id="new-password"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter New Password"
                  required
                />
                {passwordError && (
                  <span className="text-red-500 text-sm">{passwordError}</span>
                )}
              </>} */}

              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  onClick={() => setForgotPasswordModalOpen(false)}
                  className="mr-2 bg-gray-300 p-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-teal-700 text-white p-2 rounded"
                  // onClick={sendOtp}
                >
                  Send Reset Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <OtpVerification showModal={modalVerification} userId={otpID} closeModal={() => setModalVerification(false)} />
    </>
  );
};

export default Login;
