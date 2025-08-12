import React, { type ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    // Main overlay
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
      onClick={onClose}
    >
      {/* Modal content */}
      <div 
        className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm"
        onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside the modal
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;