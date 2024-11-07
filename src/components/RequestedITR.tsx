import { ChangeEvent, useEffect, useState } from "react";
import { FaCaretDown, FaEye } from "react-icons/fa";
import { IoMdAddCircle, IoMdDownload } from "react-icons/io";
import { IoSearchOutline } from "react-icons/io5";
import { PatientRecord } from "./type";
import DownloadSelectedPatients from "./DownloadSelectedPatients";
import { MdArrowBackIos, MdArrowForwardIos, MdDelete, MdEdit } from "react-icons/md";
import { useUser } from "./User";
import { formatDate, getData, RHUs, toPascalCase, ucwords } from "../assets/common/constants";
import { collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { db } from "../firebase";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import TryPDF from "./TryPDF";
import ScrollToTop from "./ScrollToTop";
import Swal from "sweetalert2";
import notificationService from "../utils/notificationService";
import Try from "./Try";
import { useConfirmation } from "../hooks/useConfirmation";

interface Request {
    rhuOrBarangay: string;
    status: string;
}

interface IndividualTreatmentRecord {
    id: string;
    requests?: Request[];
    // address?: string;
    age?: string;
    broughtBy?: string;
    created_at?: string;
    date?: string;
    dateOfBirth?: string;
    familyName?: string;
    firstName?: string;
    middleName?: string;
    mobileno?: string;
    nationality?: string;
    philMember?: string;
    rhuOrBarangay?: string;
    sex?: string;
    status?: string;
    time?: string;
    updated_at?: string;
}


export const RequestedITR = ({ user }: { user: any }) => {
    const [userData, setUserData] = useState<PatientRecord[]>([]);
    const [selectedOption, setSelectedOption] = useState<string>("All");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [selectedPatients, setSelectedPatients] = useState<PatientRecord[]>([]);
    const [isSelectedAll, setIsSelectedAll] = useState<boolean>(false);
    const [selectedPatient, setSelectedPatient] = useState<any>(null);
    const [showPDF, setShowPDF] = useState(false);
    const [modalRequest, setModalRequest] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState<any>({});
    const [recordFound, setRecordFound] = useState<any>({});

    const [sexdropdown, setSexDropdown] = useState<boolean>(false);
    const [sex, setSex] = useState<string>("Choose Sex");

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const confirm = useConfirmation();

    const fetchData = async () => {
        try {
    
          const userBarangay = user?.rhuOrBarangay || "";
          const isRHU = userBarangay.length == 1;
    
          const rhuIndex = isRHU 
            ? userBarangay
            : RHUs.findIndex(rhu => rhu.barangays.includes(userBarangay)) + 1;
    
          const userQuery = query(
            collection(db, "IndividualTreatmentRecord")
          );
    
          const userSnap = await getDocs(userQuery);
    
          const data = userSnap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as PatientRecord[];

          console.log('data :>> ', data);

          const filteredData = data.filter((x: any) => {
            if(x?.requests && Array.isArray(x.requests) && x.requests.length > 0) {
                return x.requests.some((request: any) => (
                    request.rhuOrBarangay === user?.rhuOrBarangay && request.status == 'approved'
                ));
            }
            return false;
          });
          console.log('filteredData :>> ', filteredData);
          setUserData(filteredData);
        } catch (error) {
          console.error("Error fetching:", error);
        }
    };
    
    useEffect(() => {
        fetchData();
    }, []);

    const handleView = (user: PatientRecord | undefined) => {
        setShowPDF(true);
        setSelectedPatient(user || null);
    };
    
    const closeModal = () => {
        setModalRequest(false);
        fetchData();
    }

    const filteredData = userData.filter((record: any) =>
          record.familyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          record.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          record.middleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          record.sex.toLowerCase().includes(searchQuery.toLowerCase()) ||
        //   record.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
          record.nationality.toLowerCase().includes(searchQuery.toLowerCase()) ||
          record.dateOfBirth.toLowerCase().includes(searchQuery.toLowerCase())
    )

    useEffect(() => {
        setIsSelectedAll(selectedPatients.length === filteredData.length);
    }, [selectedPatients, filteredData.length]);

    const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    }

    const handleCheckboxChange = (patient: PatientRecord) => {
        setSelectedPatients((prev) =>
          prev.some((p) => p.id === patient.id)
            ? prev.filter((p) => p.id !== patient.id)
            : [...prev, patient]
        );
    }
    
    const handleSelectAll = () => {
        const _selectedAll = !isSelectedAll;
        setIsSelectedAll(_selectedAll);
        setSelectedPatients(_selectedAll ? filteredData : []);
    }

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const paginate = (pageNumber: any) => {
        setCurrentPage(pageNumber);
    }

    const pageNumbers: number[] = [];
    for(let i = 1; i <= Math.ceil(filteredData.length / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    let visiblePages: number[] = [];
    const maxVisiblePages = 3;
    const totalPages = pageNumbers.length;

    if(totalPages <= maxVisiblePages) {
        visiblePages = pageNumbers;
    } else {
        const halfVisible = Math.floor(maxVisiblePages / 2);
        const leftOffset = currentPage - 1;
        const rightOffset = totalPages - currentPage;
        if(leftOffset < halfVisible) {
            visiblePages = [...pageNumbers.slice(0, maxVisiblePages)];
        } else if(rightOffset < halfVisible) {
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

    const handleRequest = () => {
        setModalRequest(true);
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    }

    const handleSexDropdown = () => {
        setSexDropdown(!sexdropdown);
    }

    const handleSexOption = (sex: string) => {
        setSex(sex);
        setFormData({ ...formData, sex });
        setSexDropdown(false);
    }

    const validateFormData = (data: any) => {
        const requiredFields = ["familyName", "firstName", "middleName", "sex", "nationality", "dateOfBirth"];
    
        for(const field of requiredFields) {
            if(!data[field] || data[field].toString().trim() === "")
                return false;
        }
        return true;
    }

    const handleSubmit = async () => {
        try {

            if(!validateFormData(formData))
                return Swal.fire({
                    position: "center",
                    icon: "error",
                    title: `All fields are required.`,
                    showConfirmButton: false,
                    timer: 1500,
                });

            const recordsRef = collection(db, "IndividualTreatmentRecord");
            const q = query(recordsRef);
    
            const querySnapshot = await getDocs(q);
    
            const itrRecords: IndividualTreatmentRecord[] = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            const filteredItrs = itrRecords.filter((itr: any) => itr.rhuOrBarangay !== user.rhuOrBarangay);

            const matchedRecord = filteredItrs.find((record: any) => {
                return Object.keys(formData).every((key: string) => {
                    return (record[key] && record[key].toString().toLowerCase() == formData[key].toString().toLowerCase());
                });
            });

            console.log('matchedRecord :>> ', matchedRecord);

            if(!matchedRecord)
                return Swal.fire({
                    position: "center",
                    icon: "error",
                    title: `No record found.`,
                    showConfirmButton: false,
                    timer: 1500,
                });

            if(Array.isArray(matchedRecord.requests) && matchedRecord.requests.length > 0) {

                const _comm = (status: string) => {
                    return (matchedRecord.requests || []).find((request: any) => 
                        request.rhuOrBarangay === user?.rhuOrBarangay && request.status === status
                    );
                }
    
                if(_comm("pending")) {
                    return Swal.fire({
                        position: "center",
                        icon: "error",
                        title: `You already have a pending request for this ITR.`,
                        showConfirmButton: false,
                        timer: 1500,
                    });
                }
    
                if(_comm("approved")) {
                    return Swal.fire({
                        position: "center",
                        icon: "info",
                        title: `This record already exists.`,
                        showConfirmButton: false,
                        timer: 1500,
                    });
                }
            }

            setShowModal(true);
            setRecordFound({...formData, id: matchedRecord.id});
            

        } catch (error) {
            console.error("error :>> ", error);
        }
    }

    const onRequest = async () => {
        try {
            console.log('recordFound :>> ', recordFound);
            if(!recordFound || !recordFound.id) {
                return Swal.fire({
                    position: "center",
                    icon: "error",
                    title: `Error occured. Please try again`,
                    showConfirmButton: false,
                    timer: 1500,
                });
            }
            const recordRef = doc(db, 'IndividualTreatmentRecord', recordFound.id);

            await updateDoc(recordRef, {
                requests: [{ rhuOrBarangay: user?.rhuOrBarangay, status: "pending" }]
            });

            const sentTo = RHUs.findIndex((x: any) => x["barangays"].includes(user?.barangay)) + 1;

            await notificationService.createNotification({
                action: 'request-itr',
                description: `Requested ITR`,
                performedBy: user?.uid || '',
                sentBy: user?.rhuOrBarangay || '',
                sentTo: sentTo.toString(),
            });

            Swal.fire({
                position: "center",
                icon: "success",
                title: `Request successfully submitted.`,
                showConfirmButton: false,
                timer: 1500,
            });

            setFormData({});

        } catch (error) {
            console.log('error :>> ', error);
        } finally {
            setShowModal(false);
            fetchData();
        }
    }

    const handleDelete = async (item: any) => {
        try {

            const isConfirmed = await confirm({
                title: 'Confirm Submission',
                message: 'Are you sure you want to remove this ITR?',
            });

            if(!isConfirmed) return;
            
            const itemDocRef = doc(db, 'IndividualTreatmentRecord', item.id);

            const i = (item || []).requests.findIndex((req: any) => {
                return req.rhuOrBarangay == user?.rhuOrBarangay
            });

            if(i !== -1) item.requests.splice(i, 1);

            await updateDoc(itemDocRef, item);

            Swal.fire({
                position: "center",
                icon: "success",
                title: `Record successfully deleted.`,
                showConfirmButton: false,
                timer: 1500,
            });

            fetchData();

        } catch (error) {
            Swal.fire({
                position: "center",
                icon: "error",
                title: `Unable to delete record`,
                showConfirmButton: false,
                timer: 1500,
            });
        }
    }


    return (
        <>
            <div className="flex justify-between mb-4">
                <button
                    onClick={handleRequest}
                    className="bg-green-500 text-white p-2 h-12 hover:bg-green-700 rounded-md font-bold flex items-center space-x-1"
                >
                    <IoMdAddCircle className="w-5 h-5" />
                    <span>Request</span>
                </button>
                <div className="flex gap-2">

                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={handleSearchInputChange}
                            className="border border-gray-300 rounded-md p-2 pl-8"
                        />
                        <IoSearchOutline className="absolute left-3 top-5 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    </div>
                </div>

            </div>

            <div className="flex gap-2">
                <input
                    type="checkbox"
                    checked={isSelectedAll}
                    onChange={handleSelectAll}
                    id="select-all"
                />
                <label for="select-all">Select All</label>
            </div>
            <div>
                {selectedPatients.length ?
                    <div className="flex justify-between items-center mb-2">
                        <span>{selectedPatients.length} item/s selected</span>
                        <div className="flex space-x-2">
                            <DownloadSelectedPatients selectedPatients={selectedPatients} />
                        </div>
                    </div>
                    : <></>
                }
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                        {filteredData.map((card, index) => (
                            <div key={index} className="position-relative max-w-[350px] bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow duration-300" onClick={() => handleCheckboxChange(card)}>
                                <div className="position-absolute right-[10px] top-[10px]">
                                    <input
                                        type="checkbox"
                                        checked={selectedPatients.includes(card)}
                                        onChange={() => handleCheckboxChange(card)}
                                    />
                                </div>

                                <h3 className="text-lg font-semibold mb-2">{`${ucwords(card.firstName)} ${ucwords(card.middleName)} ${ucwords(card.familyName)}`}</h3>
                                <p>Gender: {card.sex}</p>
                                <p>Nationality: {card.nationality}</p>
                                <p>Date of Birth: {card.dateOfBirth}</p>
                                
                                <div className="flex justify-end mt-4 gap-2">
                                    <PDFDownloadLink
                                        document={<TryPDF userData={card} />}
                                        fileName={`${card.familyName}_${card.firstName}_record.pdf`}
                                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                    >
                                        <IoMdDownload className="w-5 h-5 text-white" />
                                    </PDFDownloadLink>
                                    <button onClick={() => handleView(card)} className="bg-blue-300 text-black px-4 py-2 rounded hover:bg-blue-400">
                                        <FaEye className="w-5 h-5 text-white" />
                                    </button>
                                    <button onClick={() => handleDelete(card)} className="bg-red-300 text-black px-4 py-2 rounded hover:bg-red-400">
                                        <MdDelete className="w-5 h-5 text-white" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            </div>

            {modalRequest && (
                <>
                    <div className="fixed z-10 inset-0 overflow-y-auto">
                        <div className="flex items-center justify-center min-h-screen text-center sm:block sm:p-0">
                            <div className="fixed inset-0 transition-opacity">
                                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                            </div>
                            <div className="inline-block align-bottom bg-white rounded-lg max-h-[600px] overflow-y-auto shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
                                <div className="bg-white sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mt-3 text-center sm:mt-0 sm:text-center">
                                            <h3 className="text-xl p-2 leading-6 font-medium text-gray-900">
                                                Request ITR
                                            </h3>
                                            <div>
                                                <div className="grid grid-cols-3 gap-4 mt-4">
                                                    <div className="w-full">
                                                        <label
                                                            htmlFor="familyName"
                                                            className="block text-sm font-medium text-gray-700"
                                                        >
                                                            Family Name
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id="familyName"
                                                            onChange={handleChange}
                                                            value={formData.familyName}
                                                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                                        />
                                                    </div>
                                                    <div className="w-full">
                                                        <label
                                                            htmlFor="firstName"
                                                            className="block text-sm font-medium text-gray-700"
                                                        >
                                                            First Name
                                                        </label>
                                                        <input
                                                            type="text"
                                                            onChange={handleChange}
                                                            value={formData.firstName}
                                                            id="firstName"
                                                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                                        />
                                                        </div>
                                                    <div>
                                                        <label
                                                            htmlFor="middleName"
                                                            className="block text-sm font-medium text-gray-700"
                                                        >
                                                            Middle Name
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id="middleName"
                                                            onChange={handleChange}
                                                            value={formData.middleName}
                                                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                                        />
                                                        </div>
                                                    <div>
                                                        <div className="dropdown w-48 relative">
                                                            <label
                                                                htmlFor="sex"
                                                                className="block text-sm font-medium text-gray-700"
                                                            >
                                                                Sex
                                                            </label>
                                                            <div
                                                                role="button"
                                                                id="sex"
                                                                tabIndex={0}
                                                                onClick={handleSexDropdown}
                                                                className="border border-gray-300 text-sm rounded-lg py-3 mb-2 text-center text-gray-700 font-bold bg-base"
                                                            >
                                                                {sex}
                                                            </div>
                                                            {sexdropdown && (
                                                                <ul
                                                                    className="dropdown-content menu rounded-box z-[50] absolute w-52 p-2 shadow-lg bg-white"
                                                                    tabIndex={0}
                                                                >
                                                                    <li className="hover:bg-base-100 rounded-lg hover:text-black">
                                                                        <a
                                                                            onClick={() =>
                                                                                handleSexOption("Choose Sex")
                                                                            }
                                                                        >
                                                                            Choose Sex
                                                                        </a>
                                                                    </li>
                                                                    <li className="hover:bg-base-100 rounded-lg hover:text-black">
                                                                        <a onClick={() => handleSexOption("Male")}>
                                                                            Male
                                                                        </a>
                                                                    </li>
                                                                    <li className="hover:bg-base-100 rounded-lg hover:text-black">
                                                                        <a onClick={() => handleSexOption("Female")}>
                                                                            Female
                                                                        </a>
                                                                    </li>
                                                                </ul>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label
                                                            htmlFor="nationality"
                                                            className="block text-sm font-medium text-gray-700"
                                                        >
                                                            Nationality
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id="nationality"
                                                            onChange={handleChange}
                                                            value={formData.nationality}
                                                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label
                                                            htmlFor="dateOfBirth"
                                                            className="block text-sm font-medium text-gray-700"
                                                        >
                                                            Date of Birth
                                                        </label>
                                                        <input
                                                            type="date"
                                                            onChange={handleChange}
                                                            value={formData.dateOfBirth}
                                                            id="dateOfBirth"
                                                            className="mt-1 block w-full p-2 text-center border border-gray-300 rounded-md"
                                                        />
                                                    </div>
                                                </div>
                                                {/* <div>
                                                    <label
                                                        htmlFor="address"
                                                        className="block text-sm font-medium text-gray-700 mt-4"
                                                    >
                                                        Address
                                                    </label>
                                                    <textarea
                                                        name=""
                                                        id="address"
                                                        onChange={handleChange}
                                                        rows={2}
                                                        value={formData.address}
                                                        className="w-full p-2 border border-gray-300 rounded-md mt-1"
                                                    ></textarea>
                                                </div> */}
                                                <div className="flex justify-end mt-[100px] gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={closeModal}
                                                        className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                                    >
                                                        Close
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={handleSubmit}
                                                        className="px-4 py-2 bg-green-500 text-white rounded-md shadow-sm hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                                    >
                                                        Submit
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
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
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-[500px] overflow-auto">
                        <h1 className="text-center font-bold text-xl">Record Found</h1>
                        <table className="min-w-full border-collapse border border-gray-300">
                            <tbody>
                                {Object.keys(formData).map((key) => (
                                    <tr key={key}>
                                        <td className="border border-gray-300 px-4 py-2 font-bold">{toPascalCase(key)}</td>
                                        <td className="border border-gray-300 px-4 py-2">{formData[key]}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="flex justify-end mt-4">
                            <button 
                                onClick={() => setShowModal(false)}
                                className="bg-gray-300 text-black py-2 px-4 rounded mr-2"
                            >
                                Close
                            </button>
                            <button 
                                onClick={() => onRequest()}
                                className="bg-blue-500 text-white py-2 px-4 rounded"
                            >
                                Request
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <ScrollToTop />
        </>
    )
}