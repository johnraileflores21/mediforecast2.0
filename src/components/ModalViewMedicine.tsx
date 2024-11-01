import React, { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import ReceiptPDF from "./ReceiptPDF";

import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { useUser } from "./User";
import {RHUs} from "../assets/common/constants";

interface Medicine {
  medicineBrandName: string;
  medicineGenericName: string;
  medicineStock: number;
  medicineLotNo: string;
  medicineDosageStrength: string;
  medicineDosageForm: string;
  medicineExpiration: string;
  medicineDescription: string;
}

interface ModalViewMedicineProps {
  showModal: boolean;
  closeModal: () => void;
  data: Medicine | null;
}

const ModalViewMedicine: React.FC<ModalViewMedicineProps> = ({
  showModal,
  closeModal,
  data,
}) => {
  const [medicine, setMedicine] = useState<Medicine | null>(null);
  const [showPDFModal, setShowPDFModal] = useState<boolean>(false);

  const { user } = useUser();

  useEffect(() => {
    if (!data) return;
    setMedicine(data);
  }, [data]);

  if (!showModal || !medicine) {
    return null;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const filteredPdfHeader = () => {
    const userBarangay = user?.rhuOrBarangay || "";
    const rhuIndex = RHUs.findIndex(rhu => rhu.barangays.includes(userBarangay)) + 1;

    const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
    const rhuRomanNumeral = romanNumerals[(rhuIndex == 0 ? parseInt(userBarangay): rhuIndex) - 1];

    console.log('rhuIndex :>>', rhuIndex);
    console.log('rhuRomanNumeral :>>', rhuRomanNumeral);
    return {
      h1: rhuIndex == 0 ?   `Rural Health Unit ${rhuRomanNumeral}`: `${user?.rhuOrBarangay} Health Center`,
      h2: rhuIndex == 0 ? '' :  `Rural Health Unit ${rhuRomanNumeral}`,
      h3: 'City of San Fernando, Pampanga',
    };
  };

  const headerForPdf = filteredPdfHeader();

  const filteredData = (medicine: Medicine) => {
    const fieldsToInclude = [
      'medicineBrandName',
      'medicineGenericName',
      'medicineStock',
      'medicineLotNo',
      'medicineDosageStrength',
      'medicineDosageForm',
      'medicineExpiration',
      'medicineDescription',
      'created_at',
      'updated_at',
    ];

    // Create a filtered object only with the fields you want
    return fieldsToInclude.reduce((acc, field) => {
      if (medicine[field as keyof Medicine]) {
        acc[field] = medicine[field as keyof Medicine];
      }
      return acc;
    }, {} as { [key: string]: string | number });
  };

  const dataForPdf = filteredData(medicine);





  return (
    <div
      className={`fixed z-10 inset-0 overflow-y-auto transition-all duration-500 ease-out ${
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
          {/* Modal content */}
          <div className="bg-white px-2 pt-5 pb-4 sm:p-6">
            <div className="flex items-start">
              <div className="w-full">
                <div className="flex items-center justify-between">
                  <h3 className="ml-40 text-xl font-medium text-gray-900">
                    View Medicine
                  </h3>
                  <button
                    onClick={closeModal}
                    type="button"
                    className="text-gray-700 hover:text-gray-900"
                  >
                    <IoMdClose className="w-6 h-6 text-gray-400 hover:text-red-600" />
                  </button>
                </div>

                <div className="mt-2">
                  {/* Existing form fields */}
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="medicineBrandName"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Brand Name
                        </label>
                        <input
                          type="text"
                          id="medicineBrandName"
                          value={medicine.medicineBrandName}
                          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                          readOnly
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="medicineGenericName"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Generic Name
                        </label>
                        <input
                          type="text"
                          id="medicineGenericName"
                          value={medicine.medicineGenericName}
                          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
                      <div>
                        <label
                          htmlFor="medicineStock"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Medicine Stock
                        </label>
                        <input
                          type="text"
                          id="medicineStock"
                          value={medicine.medicineStock}
                          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="medicineLotNo"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Medicine Lot No.
                        </label>
                        <input
                          type="text"
                          id="medicineLotNo"
                          value={medicine.medicineLotNo}
                          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                          readOnly
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="medicineStrength"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Strength
                        </label>
                        <input
                          type="text"
                          id="medicineDosageStrength"
                          value={medicine.medicineDosageStrength}
                          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex justify-center items-center">
                        <div className="">
                          <label
                            htmlFor="medicineDosageForm"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Dosage Form
                          </label>
                          <input
                            type="text"
                            id="medicineDosageForm"
                            value={medicine.medicineDosageForm}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            readOnly
                          />
                        </div>
                      </div>
                      <div>
                        <label
                          htmlFor="medicineExpiration"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Expiration Date
                        </label>
                        <input
                          type="text"
                          id="medicineExpiration"
                          value={formatDate(medicine.medicineExpiration)}
                          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                          readOnly
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="medicineDescription"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Description
                      </label>
                      <textarea
                        id="medicineDescription"
                        value={medicine.medicineDescription}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        rows={4}
                        readOnly
                      />
                    </div>
                  </form>


                  {/* View & Download Button */}
                  <div className="mt-4">
                    <button
                      onClick={() => setShowPDFModal(true)}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                      View & Download Receipt
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PDF Viewer */}
      {showPDFModal && (
        <div
          className="fixed inset-0 z-30 flex items-start justify-center p-4"
          style={{ width: "90%", height: "90%", top: "5%", left: "5%" }}
        >
          <div className="relative bg-white w-full h-full rounded-lg shadow-xl p-4">
            {/* Close button */}
            <button
              onClick={() => setShowPDFModal(false)}
              type="button"
              className="absolute top-3 right-3 text-gray-700 hover:text-gray-900"
            >
              <IoMdClose className="w-6 h-6 text-gray-400 hover:text-red-600" />
            </button>

            <div className="mt-8 w-[90%] h-[90%] mx-auto">
              {/* PDF Viewer */}
              <div className="w-full h-full">
                <PDFViewer style={{ width: "100%", height: "100%" }}>
                  <ReceiptPDF title="Medicine" data={dataForPdf} headerText={headerForPdf} />
                </PDFViewer>
              </div>
              {/* Download Link */}
              <div className="mt-4 text-center">
                <PDFDownloadLink
                  document={<ReceiptPDF title="Medicine" data={dataForPdf} headerText={headerForPdf}/>}
                  fileName="medicine_receipt.pdf"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  {({ loading }: { loading: boolean }) =>
                    loading ? "Preparing document..." : "Download PDF"
                  }
                </PDFDownloadLink>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModalViewMedicine;
