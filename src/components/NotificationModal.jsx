import React from "react";

const NotificationModal = ({ show, onClose, message, isSuccess }) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-md w-1/3">
                <h2 className={`text-lg font-semibold mb-4 ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>
                    {isSuccess ? "Success" : "Error"}
                </h2>
                <p className="text-gray-700">{message}</p>
                <div className="flex justify-end mt-4">
                    <button
                        onClick={onClose}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotificationModal;
