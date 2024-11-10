import Swal from "sweetalert2";
import DashboardLayout from "./SuperAdmin/DashboardLayout";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from "react";
import { FaKey } from "react-icons/fa";

const DefaultPassword = () => {

  const [item, setItem] = useState<any>({});

  const fetchData = async () => {
    try {
      
      const querySnapshot = await getDocs(collection(db, "RuralSettings"));
      const itemsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      setItem(itemsData[0]);

    } catch (error) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: 'Error fetching data',
        showConfirmButton: false,
        timer: 1000,
      });
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const filteredPasswords = ['RHU I', 'RHU II', 'RHU III'];

  const handleChangePassword = (data: any) => {

  }

  const formatUnit = (str: string) => {
    const w = str.toUpperCase().split('rhu')[0];
    return `${w}`;
  }


  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-4">Default Password</h1>
      <div className="border p-2 m-10 rounded-md shadow-lg">
        <div className="overflow-x-auto shadow-lg rounded-lg">
          <table className=" min-w-full divide-y divide-gray-300">
            <thead className="bg-teal-700 text-white">
              <tr>
                <th className="px-6 py-4 text-left text-xs">Unit</th>
                <th className="px-6 py-4 text-right text-xs w-[100px]">Action</th>
              </tr>
            </thead>
            <tbody className="divided-y">
              {filteredPasswords.map((key: any, index: number) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                    {key}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleChangePassword(user)}
                      className="bg-blue-600 rounded-md text-white p-2 hover:bg-blue-800  flex items-center space-x-1"
                    >
                      <FaKey className="w-4 h-5 text-white" />
                      <span className="text-sm">Change Password</span>
                    </button>
                  </td>
                </tr>
              ))}
              {/* {items.map((item) => (
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
                      onClick={() => handleChangePassword(user)}
                      className="bg-blue-600 rounded-md text-white p-2 hover:bg-blue-800  flex items-center space-x-1"
                    >
                      <FaKey className="w-5 h-5 text-white" />
                      <span>Change Password</span>
                    </button>
                  </td>
                </tr>
              ))} */}
            </tbody>
          </table>
        </div>
      </div>
      {/* {viewInfo && (
        <UserInfo
          showModal={viewInfo}
          closeModal={closeModal}
          userId={userId}
        />
      )} */}
    </DashboardLayout>
  );
};

export default DefaultPassword;
