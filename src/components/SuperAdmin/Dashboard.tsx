import React, { useEffect, useState } from "react";
import DashboardLayout from "./DashboardLayout";
import { doc, onSnapshot, collection, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import { FaEye } from "react-icons/fa";
import UserInfo from "./UserInfo";
import { IoSearchOutline } from "react-icons/io5";
import { MdDownload, MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [viewInfo, setViewInfo] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
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

      const filtered = fetch.filter(
        (user: any) => user.status != "for_verification"
      );

      setUsers(filtered);
      setFilteredUsers(filtered);
    });
    return () => unsub();
  }, []);
  // Handle search
  useEffect(() => {
    if (searchQuery) {
      const filtered = users.filter(
        (user) =>
          user.firstname.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.lastname.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.acc_status.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users); // Reset if search query is cleared
    }
    setCurrentPage(1); // Reset to the first page after search
  }, [searchQuery, users]);

  // Paginate the filtered users
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => setSearchQuery(event.target.value);

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
  // const handleSearchInputChange = (event: React:ChangeEvent<HTMLInputElement>) => setSearchQuery(event.target.value);
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-4">All Users</h1>
      <div className="relative">
        <input
          className="border border-gray-300 rounded-md p-2 pl-8 shadow-md"
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchInputChange}
        />
        <IoSearchOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
      </div>
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
              {paginatedUsers.map((user) => (
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
        {/* Pagination */}
        <div className="flex justify-end mt-4">
          <nav className="block">
            <ul className="flex pl-0 rounded list-none flex-wrap">
              <li>
                <button
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  disabled={currentPage === 1}
                  className={`${
                    currentPage === 1
                      ? "bg-gray-300 text-gray-600"
                      : "bg-white text-blue-600 hover:bg-gray-200"
                  } font-semibold py-2.5 px-4 border border-gray-300 rounded-l`}
                >
                  <MdArrowBackIos />
                </button>
              </li>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (page) => (
                  <li key={page}>
                    <button
                      onClick={() => setCurrentPage(page)}
                      className={`${
                        currentPage === page
                          ? "bg-blue-600 text-white"
                          : "bg-white text-blue-600 hover:bg-gray-200"
                      } font-semibold py-2 px-4 border border-gray-300`}
                    >
                      {page}
                    </button>
                  </li>
                )
              )}
              <li>
                <button
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  disabled={currentPage === totalPages}
                  className={`${
                    currentPage === totalPages
                      ? "bg-gray-300 text-gray-600"
                      : "bg-white text-blue-600 hover:bg-gray-200"
                  } font-semibold py-2.5 px-4 border border-gray-300 rounded-r`}
                >
                  <MdArrowForwardIos />
                </button>
              </li>
            </ul>
          </nav>
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
