import React, { useState } from "react";
import DashboardLayout from "./DashboardLayout";
import {
  getAuth,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
} from "firebase/auth";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Settings: React.FC = () => {
  const auth = getAuth();
  const user = auth.currentUser;

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordValidation = (password: string): string | null => {
    const upperCaseRegex = /[A-Z]/;
    const lowerCaseRegex = /[a-z]/;
    const symbolRegex = /[!@#$%^&*(),.?":{}|<>]/;
    const isLengthValid = password.length >= 8;

    if (!upperCaseRegex.test(password)) {
      return "Password must include at least one uppercase letter.";
    }
    if (!lowerCaseRegex.test(password)) {
      return "Password must include at least one lowercase letter.";
    }
    if (!symbolRegex.test(password)) {
      return "Password must include at least one symbol.";
    }
    if (!isLengthValid) {
      return "Password must be at least 8 characters long.";
    }
    return null;
  };

  const handleSave = () => {
    // Validate form inputs
    const newErrors: { [key: string]: string } = {};

    if (!oldPassword) {
      newErrors.oldPassword = "Please enter your old password";
    }
    if (!newPassword) {
      newErrors.newPassword = "Please enter a new password";
    } else {
      const validationError = passwordValidation(newPassword);
      if (validationError) {
        newErrors.newPassword = validationError;
      }
    }
    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // No errors, proceed to show confirmation modal
      setIsModalOpen(true);
    }
  };

  const handleConfirm = async () => {
    if (!user) {
      toast.error("No user is currently logged in.", {
        position: "top-right",
        autoClose: 3000,
      });
      setIsModalOpen(false);
      return;
    }

    const email = user.email;

    if (!email) {
      toast.error("User email not found.", {
        position: "top-right",
        autoClose: 3000,
      });
      setIsModalOpen(false);
      return;
    }

    try {
      const credential = EmailAuthProvider.credential(email, oldPassword);

      await reauthenticateWithCredential(user, credential);

      await updatePassword(user, newPassword);

      toast.success("Password updated successfully!", {
        position: "top-right",
        autoClose: 3000,
      });

      setIsModalOpen(false);

      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setErrors({});
    } catch (error: any) {
      let errorMessage = "Failed to update password. Please try again.";

      if (error.code === "auth/wrong-password") {
        errorMessage = "The current password is incorrect.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "The new password is too weak.";
      } else if (error.code === "auth/requires-recent-login") {
        errorMessage = "Please log in again and try updating your password.";
      } else if (error.code === "auth/network-request-failed") {
        errorMessage = "Network error. Please check your internet connection.";
      }

      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // SVG Icons (Same as your existing icons)
  const lockIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      fill="currentColor"
      className="h-4 w-4 opacity-70"
    >
      <path
        fillRule="evenodd"
        d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
        clipRule="evenodd"
      />
    </svg>
  );

  const eyeIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5 opacity-70 cursor-pointer"
    >
      <path d="M12 5c-7.633 0-12 7-12 7s4.367 7 12 7 12-7 12-7-4.367-7-12-7zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-8a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
    </svg>
  );

  const eyeOffIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5 opacity-70 cursor-pointer"
    >
      <path d="M12 5c-7.633 0-12 7-12 7s1.407 2.29 3.523 4.232l-1.414 1.414a16.86 16.86 0 0 1 2.89-3.276C5.237 12.006 8.74 9.645 12 9c1.927-.486 3.733.193 5.107 1.568a8.999 8.999 0 0 1 1.414 1.414C18.707 12.29 19.115 12 20 12c.555 0 1.1.038 1.631.111l1.414-1.414A16.86 16.86 0 0 0 12 5zm0 14c7.633 0 12-7 12-7s-1.407-2.29-3.523-4.232a8.999 8.999 0 0 0-1.414-1.414C18.707 7.71 19.115 8 20 8c.555 0 1.1-.038 1.631-.111l1.414 1.414A16.86 16.86 0 0 1 12 19zm0-10a3 3 0 0 1-3-3c0-.722.264-1.392.733-1.933l1.2 1.2A1.99 1.99 0 0 0 12 9zm0 0a3 3 0 0 1 3-3c.722 0 1.392.264 1.933.733l1.2-1.2A16.86 16.86 0 0 0 12 5c-.722 0-1.392.264-1.933.733l1.2 1.2A1.99 1.99 0 0 0 12 9z" />
    </svg>
  );

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-4">Settings</h1>
      <div className="flex flex-col items-center mt-16">
        {/* Old Password */}
        <div className="w-1/2 space-y-6 ">
        <div>
          <span className="text-gray-700">Old Password</span>
          <div className="relative mt-1">
            <label className="input input-bordered flex items-center gap-2 w-full">
              {lockIcon}
              <input
                type={showOldPassword ? "text" : "password"}
                className="w-full pr-10"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Enter your old password"
              />
            </label>
            {/* Toggle Password Visibility */}
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 focus:outline-none"
              onClick={() => setShowOldPassword(!showOldPassword)}
              aria-label={showOldPassword ? "Hide password" : "Show password"}
            >
              {showOldPassword ? eyeOffIcon : eyeIcon}
            </button>
          </div>
          {errors.oldPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.oldPassword}</p>
          )}
        </div>

        {/* New Password */}
        <div>
          <span className="text-gray-700">New Password</span>
          <div className="relative mt-1">
            <label className="input input-bordered flex items-center gap-2 w-full">
              {lockIcon}
              <input
                type={showNewPassword ? "text" : "password"}
                className="w-full pr-10"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter your new password"
              />
            </label>
            {/* Toggle Password Visibility */}
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 focus:outline-none"
              onClick={() => setShowNewPassword(!showNewPassword)}
              aria-label={showNewPassword ? "Hide password" : "Show password"}
            >
              {showNewPassword ? eyeOffIcon : eyeIcon}
            </button>
          </div>
          {errors.newPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
          )}
        </div>

        {/* Confirm New Password */}
        <div>
          <span className="text-gray-700">Confirm New Password</span>
          <div className="relative mt-1">
            <label className="input input-bordered flex items-center gap-2 w-full">
              {lockIcon}
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="w-full pr-10"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your new password"
              />
            </label>
            {/* Toggle Password Visibility */}
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 focus:outline-none"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={
                showConfirmPassword ? "Hide password" : "Show password"
              }
            >
              {showConfirmPassword ? eyeOffIcon : eyeIcon}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        {/* Save Button */}
        <div>
          <button className="btn  w-full bg-green-500 text-white" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
      </div>

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed z-20 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all max-w-lg w-full z-30">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4">
                  Confirm Password Change
                </h2>
                <p>Are you sure you want to change your password?</p>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    className="btn text-white bg-red-500"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn text-white bg-green-500"
                    onClick={handleConfirm}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Initialize React Toastify */}
      <ToastContainer />
    </DashboardLayout>
  );
};

export default Settings;
