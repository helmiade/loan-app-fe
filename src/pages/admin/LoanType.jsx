import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { Bars3Icon } from "@heroicons/react/24/outline";
import SidebarCustomer from "../../components/SidebarCustomer";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";

const LoanType = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loanTypes, setLoanTypes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [isEditLoan, setIsEditLoan] = useState(false);
  const [selectedLoanType, setSelectedLoanType] = useState(null); // Untuk menyimpan data yang akan diedit/hapus
  const [formData, setFormData] = useState({
    id: "",
    type: "",
    maxLoan: "",
  });

  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const fetchLoanType = async () => {
    try {
      const response = await axiosInstance.get(`/loan-types`);
      setLoanTypes(response.data.data);
    } catch (error) {
      console.error(error);
      setLoanTypes([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addLoanType = async () => {
    try {
      const response = await axiosInstance.post(`/loan-types`, {
        type: formData.type,
        maxLoan: parseInt(formData.maxLoan, 10),
      });
      console.log(response.data);
      setIsModalOpen(false); // Close modal
      fetchLoanType(); // Refresh loan type data
    } catch (error) {
      console.error("Error adding loan type:", error);
    }
  };

  const editLoanType = async () => {
    try {
      const response = await axiosInstance.put(`/loan-types`, {
        id: selectedLoanType.id,
        type: formData.type,
        maxLoan: parseInt(formData.maxLoan, 10),
      });
      console.log(response.data);
      setIsEditLoan(false); // Close modal
      fetchLoanType(); // Refresh loan type data
    } catch (error) {
      console.error("Error editing loan type:", error);
    }
  };

  const deleteLoanType = async () => {
    try {
      await axiosInstance.delete(`/loan-types/${selectedLoanType.id}`);
      setIsDeleteModal(false); // Close modal
      fetchLoanType(); // Refresh loan type data
    } catch (error) {
      console.error("Error deleting loan type:", error);
    }
  };

  useEffect(() => {
    fetchLoanType();
  }, []);

  return (
    <div className="bg-blue-900 h-screen">
      {isSidebarOpen && <SidebarCustomer onClose={closeSidebar} />}
      <div
        className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        {!isSidebarOpen && (
          <div className="flex justify-start p-4">
            <button
              onClick={toggleSidebar}
              className="focus:outline-none fixed top-4 left-4 z-10"
            >
              <Bars3Icon className="w-8 h-8 text-yellow-400" />
            </button>
          </div>
        )}
        <div className="container mx-auto p-4">
          <button
            className="bg-yellow-500 text-white px-4 py-2 rounded mb-4"
            onClick={() => setIsModalOpen(true)}
          >
            Add Loan Types
          </button>
          <table className="table-auto w-full text-left text-blue-900">
            <thead>
              <tr className="bg-yellow-300">
                <th className="px-4 py-2">No</th>
                <th className="px-4 py-2">Loan Type</th>
                <th className="px-4 py-2">Maximum Nominal</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {loanTypes.map((row, index) => (
                <tr key={row.id} className="bg-white">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{row.type}</td>
                  <td className="px-4 py-2">{row.maxLoan}</td>
                  <td className="px-4 py-2 flex flex-row space-x-2">
                    <button
                      onClick={() => {
                        setSelectedLoanType(row);
                        setFormData({
                          id: row.id,
                          type: row.type,
                          maxLoan: row.maxLoan,
                        });
                        setIsEditLoan(true);
                      }}
                    >
                      <CiEdit style={{ color: "blue", fontSize: "24px" }} />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedLoanType(row);
                        setIsDeleteModal(true);
                      }}
                    >
                      <MdDelete style={{ color: "red", fontSize: "24px" }} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Editing Loan Type */}
      {isEditLoan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-lg font-bold mb-4">Edit Loan Type</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Loan Type
              </label>
              <input
                type="text"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Maximum Loan
              </label>
              <input
                type="number"
                name="maxLoan"
                value={formData.maxLoan}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setIsEditLoan(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={editLoanType}
                className="bg-yellow-500 text-white px-4 py-2 rounded"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-lg font-bold mb-4">Add Loan Type</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Loan Type
              </label>
              <input
                type="text"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Maximum Loan
              </label>
              <input
                type="number"
                name="maxLoan"
                value={formData.maxLoan}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={addLoanType}
                className="bg-yellow-500 text-white px-4 py-2 rounded"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Delete Confirmation */}
      {isDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-lg font-bold mb-4">Delete Loan Type</h2>
            <p>Are you sure you want to delete this loan type?</p>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setIsDeleteModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={deleteLoanType}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanType;
