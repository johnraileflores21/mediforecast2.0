import React, { useState } from "react";
import { useUser } from ".././User";
import { db } from "../../firebase";
import { collection, onSnapshot, deleteDoc, doc, query, where, getDocs, getDoc, updateDoc } from "firebase/firestore";

import { ToastContainer, toast } from "react-toastify"

import { RHUs } from "../../assets/common/constants";

interface ConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> =  ({
  isOpen,
  onConfirm,
  onCancel,
}) => {
  const [inputPassword, setInputPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { user } = useUser();


  // Static password for validation
  const STATIC_PASSWORD = "password123";

  const handleConfirm = async () => {
    if (!user || !user.email) {
      setError("User not authenticated.");
      return;
    }

    if (!inputPassword) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);


      const userBarangay = user.rhuOrBarangay;
      const rhuIndex = RHUs.findIndex(rhu => rhu.barangays.includes(userBarangay)) + 1;

      if (rhuIndex === 0) {
        setError("Barangay not associated with any RHU.");
        setLoading(false);
        return;
      }

      const passwordField = `rhu${rhuIndex}Password`;

      const ruralSettingsDoc = doc(db, 'RuralSettings', 'VIFIeqU43rMRUHQEOnQm');
      const ruralSettingsSnapshot = await getDoc(ruralSettingsDoc);

      if (!ruralSettingsSnapshot.exists()) {
        setError("Rural settings not found.");
        setLoading(false);
        return;
      }

      const ruralSettingsData = ruralSettingsSnapshot.data();

      console.log('ruralSettingsData :>>', ruralSettingsData);

      // Step 4: Retrieve the actual password from the RuralSettings document
      const actualPassword = ruralSettingsData[passwordField];
      console.log('actualPassword:', actualPassword);
      console.log('inputPassword:', inputPassword);

      if (!actualPassword) {
        setError("Password configuration missing for your RHU.");
        setLoading(false);
        return;
      }

      if (inputPassword === actualPassword) {
        console.log('password matched');
        setError("");
        onConfirm();
        setInputPassword("");
      } else {
        setError("Incorrect password. Please try again.");
      }

      setLoading(false);
    } catch (error) {
      console.error("Failed to validate password", error);
      toast.error("Failed to validate password. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
      setLoading(false);
    }
  };


  const handleCancel = () => {
    setError("");
    setInputPassword("");
    onCancel();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-md p-6">
        <h2 className="text-xl font-semibold mb-4">Confirm Your Password</h2>
        <p className="mb-4">
          Please enter your password to confirm the request.
        </p>
        <input
          type="password"
          className="w-full border border-gray-300 rounded px-3 py-2 mb-2 focus:outline-none focus:border-blue-500"
          placeholder="Enter your password"
          value={inputPassword}
          onChange={(e) => setInputPassword(e.target.value)}
        />
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <div className="flex justify-end space-x-2">
          <button
          disabled={loading}
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
          disabled={loading}
            onClick={handleConfirm}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            {loading ? "Confirming..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
