import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ConfirmationContextType, ConfirmationOptions } from './type';

export const ConfirmationContext = createContext<ConfirmationContextType | undefined>(undefined);

interface ConfirmationProviderProps {
  children: ReactNode;
}

interface ConfirmationState {
  isOpen: boolean;
  options: ConfirmationOptions;
  resolve: (value: boolean) => void;
}

export const ConfirmationProvider: React.FC<ConfirmationProviderProps> = ({ children }) => {
  const [confirmationState, setConfirmationState] = useState<ConfirmationState | null>(null);

  const confirm = (options: ConfirmationOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setConfirmationState({
        isOpen: true,
        options,
        resolve,
      });
    });
  };

  const handleConfirm = () => {
    if (confirmationState) {
      confirmationState.resolve(true);
      setConfirmationState(null);
    }
  };

  const handleCancel = () => {
    if (confirmationState) {
      confirmationState.resolve(false);
      setConfirmationState(null);
    }
  };

  return (
    <ConfirmationContext.Provider value={{ confirm }}>
      {children}
      {confirmationState && confirmationState.isOpen && (
        <ConfirmationModal
          title={confirmationState.options.title || 'Confirm'}
          message={confirmationState.options.message || 'Are you sure?'}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </ConfirmationContext.Provider>
  );
};

// ConfirmationModal Component
interface ConfirmationModalProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ title, message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Overlay */}
      <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onCancel}></div>

      {/* Modal Content */}
      <div className="bg-white rounded-lg p-6 z-10 max-w-md w-full relative">
        {/* Close Button */}
        <button
          onClick={onCancel}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
          aria-label="Close"
        >
          &times;
        </button>

        {/* Modal Header */}
        <h3 className="text-lg font-bold mb-4">{title}</h3>

        {/* Modal Body */}
        <p className="mb-6">{message}</p>

        {/* Modal Actions */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};
