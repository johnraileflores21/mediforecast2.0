import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../../firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Logo from "../../assets/images/backgroundlogo.jpg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    // console.log("Submitting login with:", { email, password });

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // console.log("User logged in:", user);

      const docRef = doc(db, "SuperAdmin", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        // console.log("Document snapshot:", userData);

        if (userData.role === "Super Admin") {
          navigate("/administrator/users");
        } else {
          toast.error("This is not your position.", { position: "top-center" });
        }
      } else {
        toast.error("No such document exists in the database.", {
          position: "top-center",
        });
      }
    } catch (error: any) {
      console.error("Firestore error:", error);
      toast.error(error.message || "An error occurred accessing Firestore.", {
        position: "top-center",
        style: { width: "520px" },
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
            className="flex flex-col justify-center p-8 md:p-14 md:px-20"
            onSubmit={handleSubmit}
          >
            <span className="mb-3 text-4xl font-bold">Welcome Admin</span>
            <span className="font-light text-gray-400 mb-8">
              Welcome! Please enter your details
            </span>
            <div className="py-4">
              <span className="mb-2 text-md">Email</span>
              <input
                type="email"
                className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Email Address"
              />
            </div>
            <div className="py-4 mb-7">
              <span className="mb-2 text-md">Password</span>
              <input
                type="password"
                id="password"
                className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
              />
            </div>
            {/* <div className="flex justify-between w-full py-4">
              <div className="mr-24">
                <input type="checkbox" id="remember" className="mr-2" />
                <span className="text-md">Remember Me</span>
              </div>
            </div> */}
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
          </form>
          <div className="relative">
            <img
              className="w-[400px] h-full hidden rounded-r-2xl md:block object-cover"
              src={Logo}
              alt="/"
            ></img>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
