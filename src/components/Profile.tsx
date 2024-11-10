import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUser } from "./User";
import DashboardLayout from "./DashboardLayout";

interface UserProfile {
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string;
  phone: string;
  email: string;
  gender: string;
  imageUrl: string;
}

const Profile: React.FC = () => {
  const { user } = useUser();

  const obj = {
    firstName: user?.firstname || "",
    middleName: user?.middlename || "",
    lastName: user?.lastname || "",
    dateOfBirth: user?.dateOfBirth || "",
    phone: user?.phone || "",
    email: user?.email || "",
    gender: user?.gender || "",
    imageUrl: user?.imageUrl || "",
  };

  const [profile, setProfile] = useState<UserProfile>(obj);
  const [preview, setPreview] = useState<string | undefined>(user?.imageUrl);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        setProfile((prevState) => ({
          ...prevState,
          imageUrl: file.name,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const isProfileChanged = () => {
    return JSON.stringify(profile) !== JSON.stringify(obj);
  };

  const handleSave = () => {
    if(isProfileChanged()) {
      toast.success("[Testing] - Profile updated successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleCancel = () => {
    toast.info("Profile update canceled", {
      position: "top-right",
      autoClose: 3000,
    });
    setProfile(obj);
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-4">Profile</h1>
      <div className="flex flex-col items-center mt-16">
        <div className="w-1/2 space-y-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <span className="text-gray-700">First Name</span>
              <input
                type="text"
                value={profile.firstName}
                onChange={(e) =>
                  setProfile({ ...profile, firstName: e.target.value })
                }
                placeholder="Enter your first name"
                className="input input-bordered w-full"
              />
            </div>

            <div className="flex-1">
              <span className="text-gray-700">Middle Name</span>
              <input
                type="text"
                value={profile.middleName}
                onChange={(e) =>
                  setProfile({ ...profile, middleName: e.target.value })
                }
                placeholder="Enter your middle name"
                className="input input-bordered w-full"
              />
            </div>

            <div className="flex-1">
              <span className="text-gray-700">Last Name</span>
              <input
                type="text"
                value={profile.lastName}
                onChange={(e) =>
                  setProfile({ ...profile, lastName: e.target.value })
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
              <span className="text-gray-700">Gender</span>
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
              </select>
            </div>

            <div className="flex-1">
              <span className="text-gray-700">Email</span>
              <input
                type="email"
                value={profile.email}
                onChange={(e) =>
                  setProfile({ ...profile, email: e.target.value })
                }
                placeholder="Enter your email"
                className="input input-bordered w-full"
              />
            </div>
          </div>

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

          <div className="mt-6 flex gap-4">
            <button
              className="btn bg-green-500 text-white w-1/2"
              onClick={handleSave}
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

      <ToastContainer />
    </DashboardLayout>
  );
};

export default Profile;
