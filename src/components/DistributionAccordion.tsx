import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import { MdExpandMore } from 'react-icons/md';

interface DistributionAccordionProps {
  index: number;
  form: any;
  handleFormsChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    field: string,
    index: number
  ) => void;
  expanded: number | false;
  handleAccordionChange: (
    index: number
  ) => (event: React.SyntheticEvent, isExpanded: boolean) => void;
  activeTab: number;
  handleTabChange: (index: number, tabIndex: number) => void;
  isBarangay: boolean;
  filteredBarangays: string[];
}

const DistributionAccordion: React.FC<DistributionAccordionProps> = ({
  index,
  form,
  handleFormsChange,
  expanded,
  handleAccordionChange,
  activeTab,
  handleTabChange,
  isBarangay,
  filteredBarangays,
}) => {
  return (
    <Accordion expanded={expanded === index} onChange={handleAccordionChange(index)}>
      <AccordionSummary
        expandIcon={<MdExpandMore />}
        aria-controls={`panel${index}-content`}
        id={`panel${index}-header`}
        sx={{ bgcolor: '#f0f0f0', '&.Mui-expanded': { bgcolor: '#f0f0f0' } }}
      >
        <Typography>Distribution #{index + 1}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {/* Tabs for Barangay and Resident */}
        {!isBarangay && (
          <div className="my-6">
            <button
              type="button"
              onClick={() => handleTabChange(index, 0)}
              className={`px-4 py-2 ${activeTab === 0 ? 'bg-gray-300' : 'bg-gray-200'}`}
            >
              Barangay
            </button>
            <button
              type="button"
              onClick={() => handleTabChange(index, 1)}
              className={`px-4 py-2 ${activeTab === 1 ? 'bg-gray-300' : 'bg-gray-200'}`}
            >
              Resident
            </button>
          </div>
        )}

        {isBarangay ? (
          <div className="w-full">
            <label htmlFor={`totalPieces-${index}`} className="block text-sm font-medium text-gray-700">
              Quantity
            </label>
            <input
              type="number"
              id={`totalPieces-${index}`}
              value={form.totalPieces}
              onChange={(e) => handleFormsChange(e, 'totalPieces', index)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        ) : (
          <div className="w-full">
            <label htmlFor={`medicineStock-${index}`} className="block text-sm font-medium text-gray-700">
              Quantity
            </label>
            <input
              type="number"
              id={`medicineStock-${index}`}
              value={form.medicineStock}
              onChange={(e) => handleFormsChange(e, 'medicineStock', index)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        )}
        <br />

        {!isBarangay && activeTab === 0 ? (
          <div className="relative">
            <label htmlFor={`barangay-${index}`} className="block text-sm font-medium text-gray-700">
              Where to Distribute
            </label>
            <div className="relative mt-1">
              <select
                id={`barangay-${index}`}
                onChange={(e) => handleFormsChange(e, 'barangay', index)}
                className="block appearance-none w-full p-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:black focus:border-black sm:text-base"
              >
                <option value="">Barangay</option>
                {filteredBarangays.map((brgy) => (
                  <option key={brgy} value={brgy}>
                    {brgy}
                  </option>
                ))}
              </select>
              {/* SVG icon */}
              <svg
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        ) : (
          <div>
            <div className="relative">
              <label htmlFor={`fullName-${index}`} className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div className="relative mt-1">
                <input
                  type="text"
                  id={`fullName-${index}`}
                  value={form.fullName}
                  onChange={(e) => handleFormsChange(e, 'fullName', index)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md ml-1"
                />
              </div>
            </div>
            <div className="relative mt-4">
              <label htmlFor={`address-${index}`} className="block text-sm font-medium text-gray-700">
                Full Address
              </label>
              <div className="relative mt-1">
                <input
                  type="text"
                  id={`address-${index}`}
                  value={form.address}
                  onChange={(e) => handleFormsChange(e, 'address', index)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md ml-1"
                />
              </div>
            </div>
          </div>
        )}
      </AccordionDetails>
    </Accordion>
  );
};

export default DistributionAccordion;
