import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("If the email is registered, a reset link has been sent.");
    } catch (error: any) {
      if (error.code === "auth/user-not-found") {
        toast.error("No user found with this email.");
      } else {
        toast.error("Failed to send reset email. Please try again.");
      }
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
            onSubmit={handleSubmit}
            className="flex flex-col justify-center p-8 md:p-16"
          >
            <span className="mb-3 text-4xl font-bold">Forgot Password?</span>
            <span className="font-light text-gray-400 mb-14 w-80">
              Enter your email and we'll send you a link to reset your password
            </span>

            <div className="py-4">
              <span className="mb-2 text-md">Email</span>
              <input
                type="email"
                className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500 mb-5"
                id="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                required
              />
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
                "Send email"
              )}
            </button>
            <div className="text-center text-gray-600">
              <Link
                to="/"
                className="font-bold text-teal-700 hover:text-teal-900"
              >
                {" "}
                Back to Login
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
    </>
  );
};

export default ForgotPassword;
