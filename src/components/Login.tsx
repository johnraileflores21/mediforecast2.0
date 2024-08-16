import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useUser } from "./User";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(true);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { setUser } = useUser();
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const persistence = rememberMe
        ? browserLocalPersistence
        : browserSessionPersistence;

      await setPersistence(auth, persistence);

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      toast.success("User Logged In Successfully!", {
        position: "top-right",
        autoClose: 1000,
      });

      const user = userCredential.user;

      const docRef = doc(db, "Users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();

        setUser({
          firstname: userData.firstname || "",
          lastname: userData.lastname || "",
          email: userData.email || "",
          rhu: userData.rhu || "",
          imageUrl: userData.imageUrl || "",
          barangay: userData.barangay || "",
        });

        setTimeout(() => {
          navigate("/dashboard");
        }, 700);
      } else {
        toast.error("User details not found.", {
          position: "top-right",
          autoClose: 1000,
        });
        setError("Invalid Email or Password!");
      }
    } catch (error) {
      toast.error("Invalid Email or Password!", {
        position: "top-right",
        autoClose: 1000,
      });
      setError("Invalid Email or Password!");
    } finally {
      setLoading(false);
    }
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
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
                className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="py-4">
              <span className="mb-2 text-md">Password</span>
              <input
                type={showPassword ? "password" : "text"}
                id="password"
                className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {showPassword ? (
                <FaEye
                  onClick={handleShowPassword}
                  className="w-6 h-6 absolute xl:left-[42%] xl:top-[56%] text-teal-800 cursor-pointer"
                />
              ) : (
                <FaEyeSlash
                  onClick={handleShowPassword}
                  className="w-6 h-6 absolute xl:left-[42%] xl:top-[56%] text-teal-800 cursor-pointer"
                />
              )}
            </div>
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
              <Link
                to="/reset-password"
                className="font-bold text-md text-teal-700 hover:text-teal-900"
              >
                Forgot password
              </Link>
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
    </>
  );
};

export default Login;
