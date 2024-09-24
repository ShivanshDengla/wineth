import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
      <div className="bg-white p-2 rounded-lg w-96 max-w-full relative" onClick={(e) => e.stopPropagation()}>
        {/* <button className="absolute top-2 right-2 text-xl" onClick={onClose}>
          &times;
        </button> */}
        {children}
      </div>
    </div>
  );
};

export default Modal;
