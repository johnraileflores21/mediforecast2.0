import React, { useState, useEffect } from "react";
import DashboardLayout from "./DashboardLayout";
import { auth, db } from "../firebase";
import {
  collection,
  doc,
  setDoc,
  getDocs,
  DocumentData,
  deleteDoc,
} from "firebase/firestore";
import AddPatient from "./AddPatient";
import { FaEye, FaCaretDown } from "react-icons/fa";
import {
  MdDelete,
  MdEdit,
  MdArrowBackIos,
  MdArrowForwardIos,
  MdLocalPrintshop,
} from "react-icons/md";
import { IoMdAddCircle, IoMdDownload } from "react-icons/io";
import { IoSearchOutline } from "react-icons/io5";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import ScrollToTop from "./ScrollToTop";
import TryPDF from "./TryPDF";
import { PatientRecord } from "./type";

// interface filteredDataProps {
//   familyName: string;
//   firstName: string;
//   middleName: string;
//   sex: string;
//   address: string;
//   mobileno: string;
//   dateOfBirth: string;
//   status: string;
//   nationality: string;
//   broughtBy: string;
//   philMember: string;
//   philNumber: string;
//   phicMemberName: string;
// }
const Individual = () => {
  const [userData, setUserData] = useState<PatientRecord[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [modalAdd, setModalAdd] = useState(false);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [modalEdit, setModalEdit] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [showPDF, setShowPDF] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<PatientRecord | null>(
    null
  );

  const [selectedOption, setSelectedOption] = useState<string>("All");
  const [sortOrder, setSortOrder] = useState<string>("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(
        collection(db, "IndividualTreatmentRecord")
      );
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as PatientRecord[];
      setUserData(data);
    } catch (error) {
      console.error("Error fetching:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // const formData = {
  //   name: "John Doe",
  //   age: 30,
  //   email: "john.doe@example.com",
  // };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  {
    /*const handleEdit = async (id: string) => {
        // Edit logic here
    }; */
  }
  const handleAdd = () => {
    setModalAdd(true);
  };
  const closeModalAdd = () => {
    setModalAdd(false);
  };
  const handleEdit = async (id: string) => {
    setModalEdit(true);
    setEditId(id);
    console.log(id);
  };
  const closeModalEdit = () => {
    setModalEdit(false);
  };
  const handleView = (user: PatientRecord | undefined) => {
    setShowPDF(true);
    setSelectedPatient(user || null);
  };
  const handleDelete = async (id: string) => {
    setDeleteId(id);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (deleteId) {
      try {
        await deleteDoc(doc(db, "IndividualTreatmentRecord", deleteId));
        console.log("Document deleted successfully!");
        fetchData();
      } catch (error) {
        console.error("Error deleting document: ", error);
      } finally {
        setShowModal(false);
        setDeleteId(null);
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setDeleteId(null);
  };

  const filteredData = userData.filter(
    (record) =>
      record.familyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.middleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.sex.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.mobileno.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.dateOfBirth.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchQuery(event.target.value);
  };

  const toggleRowExpansion = (id: string) => {
    if (expandedRow === id) {
      setExpandedRow(null);
    } else {
      setExpandedRow(id);
    }
  };
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber: any) => setCurrentPage(pageNumber);

  // Pagination display logic
  const pageNumbers: number[] = [];
  for (let i = 1; i <= Math.ceil(filteredData.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  // Determine visible page numbers
  let visiblePages: number[] = [];
  const maxVisiblePages = 3;
  const totalPages = pageNumbers.length;

  if (totalPages <= maxVisiblePages) {
    visiblePages = pageNumbers;
  } else {
    const halfVisible = Math.floor(maxVisiblePages / 2);
    const leftOffset = currentPage - 1;
    const rightOffset = totalPages - currentPage;
    if (leftOffset < halfVisible) {
      visiblePages = [...pageNumbers.slice(0, maxVisiblePages)];
    } else if (rightOffset < halfVisible) {
      visiblePages = [...pageNumbers.slice(totalPages - maxVisiblePages)];
    } else {
      visiblePages = [
        ...pageNumbers.slice(
          currentPage - halfVisible - 1,
          currentPage + halfVisible
        ),
      ];
    }
  }
  return (
    <DashboardLayout>
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold mb-4">Files</h1>
        <div className="flex justify-center items-center mb-4">
          <div className="dropdown dropdown-end w-28">
            <div
              tabIndex={0}
              role="button"
              className="bg-teal-600 text-white text-sm rounded-lg py-3.5 mb-2 text-center font-bold flex justify-center items-center"
            >
              {selectedOption}
              <FaCaretDown className="w-4 h-4 text-white ml-1" />
            </div>

            <ul
              tabIndex={0}
              className="dropdown-content menu rounded-box z-[50] relative w-52 p-2 shadow bg-teal-600 text-white"
            >
              <li className="hover:bg-base-100 rounded-lg hover:text-black">
                <a onClick={() => setSelectedOption("All")}>All</a>
              </li>
              <li className="hover:bg-base-100 rounded-lg hover:text-black">
                <a onClick={() => setSelectedOption("A-Z")}>A-Z</a>
              </li>
              <li className="hover:bg-base-100 rounded-lg hover:text-black">
                <a onClick={() => setSelectedOption("Z-A")}>Z-A</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <>
        <div className="flex justify-between mb-4">
          <button
            onClick={handleAdd}
            className="bg-green-500 text-white p-2 hover:bg-green-700 rounded-md font-bold flex items-center space-x-1"
          >
            <IoMdAddCircle className="w-5 h-5" />
            <span>Add</span>
          </button>
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchInputChange}
              className="border border-gray-300 rounded-md p-2 pl-8"
            />
            <IoSearchOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          </div>
        </div>

        <div className="border p-2 m-10 rounded-md shadow-lg">
          <div className="overflow-x-auto shadow-lg rounded-lg">
            <table className="min-w-full bg-white divide-y divide-gray-300">
              <thead className="bg-teal-700 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                    Family Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                    First Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                    Middle Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                    Sex
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                    Mobile No
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                    Date of Birth
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                    Nationality
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                    Brought By
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                    Philhealth Member
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                    Philhealth Number
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                    PHIC Member Name
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider sticky right-0 bg-teal-700 z-10">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-100">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 max-w-xs truncate">
                      {item.familyName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 max-w-xs truncate">
                      {item.firstName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {item.middleName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {item.sex}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 max-w-xs truncate">
                      {item.address}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {item.mobileno}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {formatDate(item.dateOfBirth)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {item.status}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {item.nationality}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {item.broughtBy}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {item.philMember}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 max-w-xs truncate">
                      {item.philNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 max-w-xs truncate">
                      {item.phicMemberName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 sticky right-0 bg-white z-10 flex space-x-2">
                      <PDFDownloadLink
                        document={<TryPDF userData={item} />}
                        fileName={`${item.familyName}_${item.firstName}_record.pdf`}
                        className="bg-green-600 rounded-md text-white p-2 hover:bg-green-800 flex items-center space-x-1"
                      >
                        <IoMdDownload className="w-5 h-5 text-white" />
                      </PDFDownloadLink>
                      <button
                        onClick={() => handleView(item)}
                        className="bg-blue-600 rounded-md text-white p-2 hover:bg-blue-800  flex items-center space-x-1"
                      >
                        <FaEye className="w-5 h-5 text-white" />
                        {/* PDFViewer */}
                      </button>
                      <button
                        onClick={() => handleEdit(item.id)}
                        className="bg-yellow-800 rounded-md text-white p-2 hover:bg-yellow-900 mr-4 flex items-center space-x-1"
                      >
                        <MdEdit className="w-5 h-5" />
                        {/* <span>Edit</span> */}
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="bg-red-500 rounded-md text-white p-2 hover:bg-red-700 flex items-center space-x-1"
                      >
                        <MdDelete className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-center mt-4">
            <nav className="block">
              <ul className="flex pl-0 rounded list-none flex-wrap">
                {/* Previous button */}
                <li>
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`${
                      currentPage === 1
                        ? "bg-gray-300 text-gray-600"
                        : "bg-white text-blue-600 hover:bg-gray-200"
                    } font-semibold py-2.5 px-4 border border-gray-300 rounded-l focus:outline-none`}
                  >
                    <MdArrowBackIos className="w-5 h-5" />
                  </button>
                </li>
                {/* Page buttons */}
                {visiblePages.map((page, index) => (
                  <li key={index}>
                    <button
                      onClick={() => paginate(page)}
                      className={`${
                        currentPage === page
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "bg-white text-blue-600 hover:bg-gray-200"
                      } font-semibold py-2 px-4 border border-gray-300 focus:outline-none`}
                    >
                      {page}
                    </button>
                  </li>
                ))}
                {/* Next button */}
                <li>
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`${
                      currentPage === totalPages
                        ? "bg-gray-300 text-gray-600"
                        : "bg-white text-blue-600 hover:bg-gray-200"
                    } font-semibold py-2.5 px-4 border border-gray-300 rounded-r focus:outline-none`}
                  >
                    <MdArrowForwardIos className="w-5 h-5 " />
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {modalAdd && (
          <AddPatient
            showModal={modalAdd}
            closeModal={closeModalAdd}
            // fetchData={fetchData}
          />
        )}
        {showPDF && selectedPatient && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-4xl h-[80vh] max-h-[90vh] overflow-auto">
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => setShowPDF(false)}
                  className="bg-red-500 text-white p-2 rounded-md hover:bg-red-700"
                >
                  Close
                </button>
              </div>
              <div className="w-full h-full">
                <PDFViewer className="w-full h-full">
                  <TryPDF userData={selectedPatient} />
                </PDFViewer>
              </div>
            </div>
          </div>
        )}

        {/* {modalEdit && (
          <ModalEditMedicine
            showModal={modalEdit}
            closeModal={closeModalEdit}
            // fetchData={fetchData}
            editId={editId}
          />
        )}
        {modalView && (
          <ModalViewMedicine
            showModal={modalView}
            closeModal={closeModalView}
            // fetchData={fetchData}
            viewId={viewId}
          />
        )} */}

        {showModal && (
          <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
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
                    <svg
                      className="h-12 w-12 text-red-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                      />
                    </svg>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <h3
                        className="text-lg leading-6 font-medium text-gray-900"
                        id="modal-headline"
                      >
                        Delete ITR Confirmation
                      </h3>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Are you sure you want to delete this record?
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    onClick={confirmDelete}
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Delete
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
        <ScrollToTop />
      </>
      {/* <div className="mt-10 h-[1240px]">
        <PDFViewer className="w-full h-[100%]">
          <PDFFile />
        </PDFViewer>
      </div>*/}
      {/* <div>
        <h1>Generate PDF</h1>
        <PDFDownloadLink
          document={<TryPDF userData={userData} />}
          fileName="ITR.pdf"
        >
          {({ loading }) => (loading ? "Loading document..." : "Download PDF")}
        </PDFDownloadLink>
      </div>
      <div className="mt-10 h-[1240px]">
        <PDFViewer className="w-full h-[100%]">
          <TryPDF userData={userData} />
        </PDFViewer>
      </div>  */}
      {/* <div>
        {userData.length > 0 ? (
          userData.map((record) => (
            <PDFDownloadLink
              key={record.id}
              document={<TryPDF userData={record} />}
              fileName={`${record.familyName}_${record.firstName}_record.pdf`}
            >
              {({ loading }) =>
                loading
                  ? "Loading document..."
                  : `Download ${record.familyName} ${record.firstName}'s PDF`
              }
            </PDFDownloadLink>
          ))
        ) : (
          <p>No records found</p>
        )}
      </div> */}
    </DashboardLayout>
  );
};

export default Individual;
