// components/PDFPreviewModal.tsx
import React from 'react';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import RequestsPDF from './RequestsPDF';

const PDFPreviewModal = ({ showModal, closeModal, data, user, header }: any) => {
  if (!showModal) return null;

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen">
        <div className="fixed inset-0 bg-gray-500 opacity-75" onClick={closeModal}></div>
        <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-4xl sm:w-full">
          <div className="bg-white p-4">
            <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 float-right">
              &times;
            </button>
            <div className="mt-4">
              <PDFViewer style={{ width: '100%', height: '500px' }}>
                <RequestsPDF data={data} user={user} header={header}/>
              </PDFViewer>
              <div className="mt-4 text-center">
                <PDFDownloadLink
                  document={<RequestsPDF data={data} user={user} header={header} />}
                  fileName="stock_requests.pdf"
                  className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700"
                >
                  {({ loading }) => (loading ? 'Preparing document...' : 'Download PDF')}
                </PDFDownloadLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFPreviewModal;
