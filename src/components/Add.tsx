import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { auth, db } from "../firebase";
import {
    collection,
    doc,
    setDoc,
    getDocs,
    DocumentData,
} from "firebase/firestore";
import DashboardLayout from "./DashboardLayout";
import { Link } from "react-router-dom";

const Add = () => {
    const [formData, setFormData] = useState({
        medicineName: "",
        medicineStock: 0,
        medicineDescription: "",
        medicineExpiration: "",
    });

    const [userData, setUserData] = useState<DocumentData[]>([]);
    const [showModal, setShowModal] = useState(false);

    const fetchData = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "Medicines"));
            const userData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setUserData(userData);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setShowModal(true);
    };

    const handleConfirmSubmit = async () => {
        const now = new Date();
        const docId = now.toISOString();
        try {
            const docRef = doc(collection(db, "Medicines"), docId);
            await setDoc(docRef, formData);
            console.log("Document written with ID: ", docId);
            setFormData({
                medicineName: "",
                medicineStock: 0,
                medicineDescription: "",
                medicineExpiration: "",
            });
            setShowModal(false);
            fetchData();
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    };

    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <DashboardLayout>
            <Link
                to="/inventory"
                className="float-right bg-blue-500 text-white rounded-md p-2 hover:bg-blue-700 font-bold flex items-center"
            >
                <img
                    src="/images/back.png"
                    alt="Back Icon"
                    className="w-4 h-4 mr-2"
                />
                Back
            </Link>

            <h1 className="text-2xl font-bold mb-4 mt-5">Add New Medicine</h1>
            <div className="bg-white p-6 rounded-lg shadow-md mt-7">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label
                            htmlFor="medicineName"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Medicine Name
                        </label>
                        <input
                            type="text"
                            id="medicineName"
                            value={formData.medicineName}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            required
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="medicineStock"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Medicine Stock
                        </label>
                        <input
                            type="number"
                            id="medicineStock"
                            value={formData.medicineStock}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            required
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="medicineDescription"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Description
                        </label>
                        <textarea
                            id="medicineDescription"
                            value={formData.medicineDescription}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            rows={4}
                            required
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="medicineExpiration"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Expiration Date
                        </label>
                        <input
                            type="date"
                            id="medicineExpiration"
                            value={formData.medicineExpiration}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            required
                        />
                    </div>
                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="bg-green-500 text-white p-2 hover:bg-green-700 rounded-md font-bold flex items-center space-x-1"
                        >
                            <img
                                src="/images/add.png"
                                alt="Add Icon"
                                className="w-5 h-5"
                            />
                            <span>Add Now</span>
                        </button>
                    </div>
                </form>
            </div>
            {showModal && (
                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <span
                            className="hidden sm:inline-block sm:align-middle sm:h-screen"
                            aria-hidden="true"
                        >
                            &#8203;
                        </span>
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3
                                            className="text-lg leading-6 font-medium text-gray-900"
                                            id="modal-headline"
                                        >
                                            Add Medicine Confirmation
                                        </h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                Are you sure you want to add
                                                this medicine?
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    onClick={handleConfirmSubmit}
                                    type="button"
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Yes
                                </button>
                                <button
                                    onClick={closeModal}
                                    type="button"
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default Add;
