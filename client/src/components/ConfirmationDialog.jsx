/* eslint-disable react/prop-types */
import  'react';

const ConfirmationDialog = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl  dark:bg-slate-900 text-slate-800 dark:text-slate-100">
        <h3 className="text-lg font-semibold mb-2 ">{title}</h3>
        <p className="text-gray-600 mb-6 dark:text-slate-100">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded text-gray-600 hover:bg-gray-100 transition-colors dark:text-slate-100  hover:dark:bg-slate-500 "
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-primary text-white hover:bg-secondary transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;