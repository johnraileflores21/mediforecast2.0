import React from "react";
import { PDFDownloadLink, pdf } from "@react-pdf/renderer";
import TryPDF from "./TryPDF"; // Adjust the import path as necessary
import { PatientRecord } from "./type";
import { IoMdDownload } from "react-icons/io";

interface DownloadSelectedPatientsProps {
  selectedPatients: PatientRecord[];
}

const DownloadSelectedPatients: React.FC<DownloadSelectedPatientsProps> = ({ selectedPatients }) => {
  const handleDownloadAll = async () => {
    for (const patient of selectedPatients) {
      // Create a PDF document for each patient
      const blob = await pdf(<TryPDF userData={patient} />).toBlob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${patient.familyName}_${patient.firstName}_record.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
  };

  return (
    <div className="flex space-x-2">
      <button 
        onClick={handleDownloadAll} 
        className="bg-blue-600 px-5 rounded-md text-white p-2 hover:bg-blue-800"
      >
        <IoMdDownload className="w-5 h-5 text-white" />
      </button>
    </div>
  );
};

export default DownloadSelectedPatients;
