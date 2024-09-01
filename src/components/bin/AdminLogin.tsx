import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

import { VscError } from "react-icons/vsc";
import { FaCheckCircle } from "react-icons/fa";

const AdminLogin = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showAlertSuccess, setShowAlertSuccess] = useState(false);
    const [showAlertError, setShowAlertError] = useState(false);
    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const auth = getAuth();
            await signInWithEmailAndPassword(auth, email, password);
            setShowAlertSuccess(true);
            setTimeout(() => {
                navigate("/administrator-dashboard");
            }, 1200);
        } catch (err) {
            setShowAlertError(true);
            setTimeout(() => {
                setShowAlertError(false);
            }, 3000);
            setError(err.message);
        }
    };
    return (
        <>
            {showAlertSuccess && (
                <div className="flex flex-row-reverse z-10">
                    <div
                        role="alert"
                        className={`absolute alert alert-success w-56 mt-2 mr-2 flex justify-center items-center z-50 transition-opacity duration-500 ${
                            showAlertSuccess ? "opacity-100" : "opacity-0"
                        }`}
                    >
                        <FaCheckCircle className="h-6 w-6 shrink-0 stroke-current text-white" />
                        <span className="text-white">Login successfully!</span>
                    </div>
                </div>
            )}
            {showAlertError && (
                <div className="flex flex-row-reverse z-50 relative transition-all">
                    <div
                        role="alert"
                        className={`absolute alert bg-customDanger border border-customDanger w-[270px] mt-2 mr-2 transition-opacity duration-500 ${
                            showAlertError ? "opacity-100" : "opacity-0"
                        }`}
                    >
                        <VscError className="h-6 w-6 shrink-0 stroke-current text-white" />
                        <span className="text-white">
                            Invalid Email or Password!
                        </span>
                    </div>
                </div>
            )}
            <div className="flex items-center justify-center min-h-screen bg-gray-100 custom-img  ">
                <div className="relative flex flex-col m-6 space-y-8 bg-white shadow-2xl rounded-2xl md:flex-row md:space-y-0">
                    <div className="flex flex-col justify-center p-8 md:p-16 md:pl-18 md:pr-18">
                        <span className="mb-3 text-4xl font-bold">
                            Hello, Admin
                        </span>
                        <span className="font-light text-gray-400 mb-8">
                            Welcome back! Please enter your details
                        </span>
                        {/* {error && (
                            <span className="absolute top-[150px] left-[110px] text-red-500">
                                Invalid Email or Password!
                            </span>
                        )} */}
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
                                type="password"
                                id="password"
                                className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="flex justify-end w-full py-4">
                            <button className="font-bold text-md text-green-500">
                                Forgot password?
                            </button>
                        </div>
                        <button
                            onClick={handleLogin}
                            className="w-full bg-black text-center text-white p-2 rounded-lg mb-6 hover:bg-white hover:text-black hover:border hover:border-gray-300"
                        >
                            Login
                        </button>
                    </div>
                    <div className="relative">
                        <img
                            className="w-[400px] h-full hidden rounded-r-2xl md:block object-cover"
                            src="images/try5.jpg"
                            alt="/"
                        ></img>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminLogin;
