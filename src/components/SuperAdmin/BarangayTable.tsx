import React, { useEffect, useState } from "react";
import DashboardLayout from "./DashboardLayout";
import {
  doc,
  updateDoc,
  onSnapshot,
  collection,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";
import { FaEye } from "react-icons/fa";
import UserInfo from "./UserInfo";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { httpsCallable } from "firebase/functions";
import { functions } from "../../firebase";

interface BarangayTableProps {
  barangay: string;
}
const BarangayTable: React.FC<BarangayTableProps> = ({ barangay }) => {
  const [users, setUsers] = useState<any[]>([]);
  const [viewInfo, setViewInfo] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const MySwal = withReactContent(Swal);

  //Get real-time update of Collection Users
  useEffect(() => {
    const usersQuery = query(
      collection(db, "Users"),
      where("rhuOrBarangay", "==", barangay),
      where("acc_status", "==", "pending")
    );
    const unsub = onSnapshot(usersQuery, (snapshot) => {
      const fetch = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(fetch);
    });
    return () => unsub();
  }, [barangay]);

  //view UserInfo
  const handleViewUserInfo = (user: any) => {
    setUserId(user.id);
    setViewInfo(true);
  };
  const closeModal = () => {
    setUserId(null);
    setViewInfo(false);
  };
  const handleApprovingUser = async (userId: string) => {
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
        const userRef = doc(db, "Users", userId);
        await updateDoc(userRef, { acc_status: "approved" });
        MySwal.fire({
          title: "Approve!",
          text: "User has been approved successfully.",
          icon: "success",
        });
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
  const handleDecliningUser = async (userId: string) => {
    try {
      const result = await MySwal.fire({
        title: "Are you sure?",
        text: "Are you sure you want to decline this user?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, decline it!",
      });
      if (result.isConfirmed) {
        const userRef = doc(db, "Users", userId);
        await updateDoc(userRef, { acc_status: "declined" });
        // const deleteUser = httpsCallable(functions, "deleteUser");
        // await deleteUser({ userId });
        MySwal.fire({
          title: "Declined!",
          text: "User has been declined successfully.",
          icon: "success",
        });
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

  return (
    <>
      <div className="border p-2 m-10 rounded-md shadow-lg">
        <div className="overflow-x-auto shadow-lg rounded-lg">
          <table className=" min-w-full divide-y divide-gray-300">
            <thead className="bg-teal-700 text-white">
              <tr>
                <th className="px-6 py-4 text-left text-xs">First Name</th>
                <th className="px-6 py-4 text-left text-xs">Middle Name</th>
                <th className="px-6 py-4 text-left text-xs">Last Name</th>
                <th className="px-6 py-4 text-left text-xs">Email</th>
                <th className="px-6 py-4 text-left text-xs">Action</th>
                <th className="px-6 py-4 text-left text-xs">Status</th>
              </tr>
            </thead>
            <tbody className="divided-y">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                    {user.firstname}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.middlename}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.lastname}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleViewUserInfo(user)}
                      className="bg-blue-600 rounded-md text-white p-2 hover:bg-blue-800  flex items-center space-x-1"
                    >
                      <FaEye className="w-5 h-5 text-white" />
                      {/* PDFViewer */}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleApprovingUser(user.id)}
                      className="bg-yellow-500 p-2 font-semibold rounded-md space-x-1 text-white mr-2"
                    >
                      Pending
                    </button>
                    <button
                      onClick={() => handleDecliningUser(user.id)}
                      className="bg-red-600 p-2 font-semibold rounded-md space-x-1 text-white"
                    >
                      Decline
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {viewInfo && (
        <UserInfo
          showModal={viewInfo}
          closeModal={closeModal}
          userId={userId}
        />
      )}
    </>
  );
};
export default BarangayTable;
