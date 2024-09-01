import React, { useEffect, useState } from "react";
import DashboardLayout from "./DashboardLayout";
import { doc, onSnapshot, collection, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import { FaEye } from "react-icons/fa";
import UserInfo from "./UserInfo";

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [viewInfo, setViewInfo] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  //Get real-time update of Collection Users
  useEffect(() => {
    const usersQuery = query(
      collection(db, "Users"),
      where("role", "==", "RHU Staff")
    );
    const unsub = onSnapshot(collection(db, "Users"), (snapshot) => {
      const fetch = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(fetch);
    });
    return () => unsub();
  }, []);

  //view UserInfo
  const handleViewUserInfo = (user: any) => {
    setUserId(user.id);
    setViewInfo(true);
  };
  const closeModal = () => {
    setUserId(null);
    setViewInfo(false);
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
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-4">All Users</h1>
      <div className="border p-2 m-10 rounded-md shadow-lg">
        <div className="overflow-x-auto shadow-lg rounded-lg">
          <table className=" min-w-full divide-y divide-gray-300">
            <thead className="bg-teal-700 text-white">
              <tr>
                <th className="px-6 py-4 text-left text-xs">First Name</th>
                <th className="px-6 py-4 text-left text-xs">Middle Name</th>
                <th className="px-6 py-4 text-left text-xs">Last Name</th>
                <th className="px-6 py-4 text-left text-xs">Email</th>
                <th className="px-6 py-4 text-left text-xs">Account Status</th>
                {/* <th className="px-6 py-4 text-left text-xs">Role</th> */}
                <th className="px-6 py-4 text-left text-xs">RHU/Barangay</th>
                <th className="px-6 py-4 text-left text-xs">Action</th>
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
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm capitalize font-semibold ${
                      user.acc_status === "approved" && "text-green-600"
                    } ${user.acc_status === "declined" && "text-red-800"} ${
                      user.acc_status === "pending" && "text-yellow-700"
                    }`}
                  >
                    {user.acc_status}
                  </td>
                  {/* <td className="px-6 py-4 whitespace-nowrap">{user.role}</td> */}
                  <td className="px-6 py-4 whitespace-nowrap max-w-12 overflow-hidden">
                    {rhuOrBarangayMap[user.rhuOrBarangay] || "Unknown"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleViewUserInfo(user)}
                      className="bg-blue-600 rounded-md text-white p-2 hover:bg-blue-800  flex items-center space-x-1"
                    >
                      <FaEye className="w-5 h-5 text-white" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* <div className="border p-2 m-10 rounded-md shadow-lg">
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
                  
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button className="bg-yellow-500 p-2 font-semibold rounded-md space-x-1 text-white mr-2">
                      Pending
                    </button>
                    <button className="bg-red-600 p-2 font-semibold rounded-md space-x-1 text-white">
                      Decline
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div> */}
      {viewInfo && (
        <UserInfo
          showModal={viewInfo}
          closeModal={closeModal}
          userId={userId}
        />
      )}
    </DashboardLayout>
  );
};
export default AdminDashboard;
