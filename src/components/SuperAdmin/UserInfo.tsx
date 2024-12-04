import React, { useEffect, useState } from "react";
import { HiInformationCircle } from "react-icons/hi2";
import { IoMdClose } from "react-icons/io";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import ClipLoader from "react-spinners/ClipLoader";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

interface UserInfoProps {
  showModal: boolean;
  closeModal: () => void;
  userId: string | null;
  viewApproving: boolean;
}
const UserInfo: React.FC<UserInfoProps> = ({
  showModal,
  closeModal,
  userId,
  viewApproving,
}) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const MySwal = withReactContent(Swal);
  const [canApprove, setCanApprove] = useState<boolean>(viewApproving);
  const [loadingButton, setLoadingButton] = useState<boolean>(false);
  useEffect(() => {
    if (!userId) return;

    const fetchUser = async () => {
      setLoading(true);
      setError(null);
      try {
        const userDoc = await getDoc(doc(db, "Users", userId));
        if (userDoc.exists()) {
          setUser({ id: userDoc.id, ...userDoc.data() });
        } else {
          setError("User not found");
        }
      } catch (err) {
        setError("Failed to fetch user data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  useEffect(() => {
    setCanApprove(viewApproving);
  }, [viewApproving, showModal]);

  const handleApprovingUser = async () => {
    if (!userId) return;
    try {
      const result = await MySwal.fire({
        title: "Are you sure?",
        text: "Are you sure you want to approve this user?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, approve it!",
      });
      if (result.isConfirmed) {
        setLoadingButton(true);
        const userRef = doc(db, "Users", userId);
        await updateDoc(userRef, { acc_status: "approved" });
        MySwal.fire({
          title: "Approve!",
          text: "User has been approved successfully.",
          icon: "success",
        });
        closeModal();
      }
    } catch (error) {
      console.error("Error updating user status:", error);
      await MySwal.fire({
        title: "Error!",
        text: "There was an error approving the user. Please try again.",
        icon: "error",
      });
    }
  };
  if (!showModal) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };
  const rhuOrBarangayMap: Record<string, string> = {
    "1": "RHU1",
    "2": "RHU2",
    "3": "RHU3",
    Balucuc: "Balucuc Health Center",
    Calantipe: "Calantipe Health Center",
    Capalangan: "Capalangan Health Center",
    Colgante: "Colgante Health Center",
    Paligui: "Paligui Health Center",
    Sampaloc: "Sampaloc Health Center",
    "San Juan": "San Juan Health Center",
    "San Vicente": "San Vicente Health Center",
    Sucad: "Sucad Health Center",
    Sulipan: "Sulipan Health Center",
    Tabuyuc: "Tabuyuc Health Center",
  };

  return (
    <div
      className={`fixed inset-0 z-10 overflow-y-auto transition-all duration-500 ease-out ${
        showModal ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="flex items-center justify-center min-h-screen px-4 py-6 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-black bg-opacity-50"></div>
        <div
          className={`inline-block align-middle bg-white rounded-lg text-left max-h-[600px] overflow-y-auto shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full ${
            showModal ? "animate-slideDown" : "animate-slideUp"
          }`}
        >
          <div className="w-full p-3 border-b-2 border-gray-300 flex justify-between">
            <div className="flex flex-row">
              <HiInformationCircle size={40} className="text-blue-600" />
              <h1 className="ml-1 mt-1 font-semibold text-2xl text-center flex items-center justify-center">
                User Information
              </h1>
            </div>
            <button className="" onClick={closeModal}>
              <IoMdClose
                size={30}
                className="text-gray-400 hover:text-red-600"
              />
            </button>
          </div>
          <div className="px-7 py-3">
            {loading ? (
              <div className="flex justify-center">
                <ClipLoader
                  color={"#007f80"}
                  loading={loading}
                  size={50}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
              </div>
            ) : error ? (
              <p className="text-red-600">{error}</p>
            ) : user ? (
              <>
                <div className="flex justify-between mb-4">
                  <h1 className="font-bold">First Name:</h1>
                  <p className="text-gray-800 capitalize">{user.firstname}</p>
                </div>
                <div className="flex justify-between mb-4">
                  <h1 className="font-bold">Middle Name:</h1>
                  <p className="text-gray-800 capitalize">{user.middlename}</p>
                </div>
                <div className="flex justify-between mb-4">
                  <h1 className="font-bold">Last Name:</h1>
                  <p className="text-gray-800 capitalize">{user.lastname}</p>
                </div>
                <div className="flex justify-between mb-4">
                  <h1 className="font-bold">Email:</h1>
                  <p className="text-gray-800">{user.email}</p>
                </div>
                <div className="flex justify-between mb-4">
                  <h1 className="font-bold">Date of Birth:</h1>
                  <p className="text-gray-800">
                    {formatDate(user.dateOfBirth)}
                  </p>
                </div>
                <div className="flex justify-between mb-4">
                  <h1 className="font-bold">Gender:</h1>
                  <p className="text-gray-800 capitalize">{user.gender}</p>
                </div>
                <div className="flex justify-between mb-4">
                  <h1 className="font-bold">Address:</h1>
                  <div className="text-gray-800 max-w-xs break-words">
                    {user.housenoandstreetname} {user.barangay},{" "}
                    {user.municipality}
                  </div>
                </div>
                <div className="flex justify-between mb-4">
                  <h1 className="font-bold">Mobile Number:</h1>
                  <p className="text-gray-800 capitalize">{user.phone}</p>
                </div>
                <div className="flex justify-between mb-4">
                  <h1 className="font-bold">Role:</h1>
                  <p className="text-gray-800 capitalize">{user.role}</p>
                </div>
                <div className="flex justify-between mb-4">
                  <h1 className="font-bold">RHU/Barangay:</h1>
                  <p className="text-gray-800 capitalize">
                    {rhuOrBarangayMap[user.rhuOrBarangay] || "Unknown"}
                  </p>
                </div>
                <div className="flex justify-between mb-4">
                  <h1 className="font-bold">Account Status:</h1>
                  <p className="text-gray-800 capitalize">{user.acc_status}</p>
                </div>
                <div className="mb-4">
                  <h1 className="font-bold">Front ID</h1>
                  <div>
                    {user?.idFront ? (
                      <img
                        src={user?.idFront}
                        className="w-[100%] h-[250px] object-contain border-3 border-gray-100 rounded-lg shadow-md hover:shadow-lg"
                        style={{ boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)" }}
                      />
                    ) : (
                      <i>No ID available.</i>
                    )}
                  </div>
                </div>
                <div className="mb-4">
                  <h1 className="font-bold">Back ID</h1>
                  <div>
                    {user?.idBack ? (
                      <img
                        src={user?.idBack}
                        className="w-[100%] h-[250px] object-contain border-3 border-gray-100 rounded-lg shadow-md hover:shadow-lg"
                        style={{ boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)" }}
                      />
                    ) : (
                      <i>No ID available.</i>
                    )}
                  </div>
                </div>
                <div className="mb-4">
                  <h1 className="font-bold">Selfie with ID</h1>
                  <div>
                    {user?.idSelfie || user?.selfieID ? (
                      <img
                        src={user?.idSelfie || user?.selfieID}
                        className="w-[100%] h-[250px] object-contain border-3 border-gray-100 rounded-lg shadow-md hover:shadow-lg"
                        style={{ boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)" }}
                      />
                    ) : (
                      <i>No ID available.</i>
                    )}
                  </div>
                </div>
                {canApprove && (
                  <button
                    onClick={handleApprovingUser}
                    className="bg-green-500 w-full p-2 text-white rounded-lg text-md mb-3"
                    disabled={loadingButton}
                  >
                    {loadingButton ? (
                      <div className="flex items-center justify-center">
                        <svg
                          width="800px"
                          height="800px"
                          viewBox="0 0 16 16"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          className="animate-spin h-5 w-5 text-white"
                        >
                          <g
                            fill="#000000"
                            fillRule="evenodd"
                            clipRule="evenodd"
                          >
                            <path
                              d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8z"
                              opacity=".2"
                            />
                            <path d="M7.25.75A.75.75 0 018 0a8 8 0 018 8 .75.75 0 01-1.5 0A6.5 6.5 0 008 1.5a.75.75 0 01-.75-.75z" />
                          </g>
                        </svg>
                      </div>
                    ) : (
                      "Approve"
                    )}
                  </button>
                )}
                <button
                  onClick={closeModal}
                  className="bg-red-800 w-full p-2 text-white rounded-lg text-md"
                >
                  Close
                </button>
              </>
            ) : (
              <p>No user data available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
