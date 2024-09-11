import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useParams } from "react-router";
import { db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import DashboardLayout from "./DashboardLayout";

const Edit = () => {
    const { id } = useParams<{ id: string }>();

    const [formData, setFormData] = useState({
        medicineName: "",
        medicineStock: 0,
        medicineDescription: "",
        medicineExpiration: "",
    });

    useEffect(() => {
        const fetchMedicine = async () => {
            try {
                if (id) {
                    const medicineDoc = await getDoc(
                        doc(db, `Medicines/${id}`)
                    );
                    if (medicineDoc.exists()) {
                        const medicineData = medicineDoc.data();
                        setFormData({
                            medicineName: medicineData.medicineName,
                            medicineStock: medicineData.medicineStock,
                            medicineDescription:
                                medicineData.medicineDescription,
                            medicineExpiration: medicineData.medicineExpiration,
                        });
                    } else {
                        console.log("No such document!");
                    }
                }
            } catch (error) {
                console.error("Error fetching document:", error);
            }
        };

        fetchMedicine();
    }, [id]);

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
        try {
            await updateDoc(doc(db, `Medicines/${id}`), formData);
            console.log("Document successfully updated!");
            window.location.href = "/inventory";
        } catch (error) {
            console.error("Error updating document:", error);
        }
    };

    return (
        <DashboardLayout>
            <h1 className="text-2xl font-bold mb-4">Edit Medicine</h1>
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
                            className="bg-blue-500 text-white p-2 pl-10 pr-10 mt-3 rounded-md hover:bg-blue-700"
                        >
                            Update
                        </button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
};

export default Edit;
