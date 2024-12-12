import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { Bars3Icon } from "@heroicons/react/24/outline";
import SidebarCustomer from "../../components/SidebarCustomer";
import { IoEyeOutline } from "react-icons/io5";
import { jwtDecode } from "jwt-decode";
import { body } from "framer-motion/client";

const LoanRequest = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loanTypes, setLoanTypes] = useState([]);
  const [transactionData, setTransactionData] = useState([]);

  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };
  const [activeTab, setActiveTab] = useState("PENDING"); // Tab aktif

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get("/transactions");
      setTransactionData(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      console.log(error);
      setTransactionData([]);
    }
  };
  const getIdFromToken = () => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      return decodedToken.jti; // Ensure this key corresponds to your customer ID in the token
    }
    return null;
  };

  const fetchLoanType = async () => {
    try {
      const response = await axiosInstance.get(`/loan-types`);
      console.log(response.data);
      setLoanTypes(response.data.data);
    } catch (error) {
      console.error(error);
      setLoanTypes([]);
    }
  };

  const approveTransaction = async (transactionId) => {
    try {
      const id = getIdFromToken().trim();
      console.log(transactionId);
      console.log(id);
      
      const response = await axiosInstance.put(`/transactions/${id}/approve`, {
        loanTransactionId: transactionId,
        interestRate: 0.03,
      });
      console.log(response.data);
      fetchData();
    } catch (error) {
      console.log(error);
    }
  };

  const rejectTransaction = async (transactionId) => {
    try {
      const id = getIdFromToken().trim();
      const response = await axiosInstance.put(`/transactions/${id}/reject`, {
        loanTransactionId: transactionId,
        interestRate: 0.03,
      });
      console.log(response.data);
      fetchData();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchLoanType();
  }, []);

  const filterDataByStatus = (status) =>
    transactionData.filter((row) => row.approvalStatus === status);
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
            <div className="flex space-x-4 mb-4">
              <button
                className={`px-4 py-2 rounded ${
                  activeTab === "PENDING"
                    ? "bg-yellow-500 text-white"
                    : "bg-gray-300"
                }`}
                onClick={() => setActiveTab("PENDING")}
              >
                Pending
              </button>
              <button
                className={`px-4 py-2 rounded ${
                  activeTab === "REJECTED"
                    ? "bg-red-500 text-white"
                    : "bg-gray-300"
                }`}
                onClick={() => setActiveTab("REJECTED")}
              >
                Rejected
              </button>
              <button
                className={`px-4 py-2 rounded ${
                  activeTab === "APPROVED"
                    ? "bg-green-500 text-white"
                    : "bg-gray-300"
                }`}
                onClick={() => setActiveTab("APPROVED")}
              >
                Approved
              </button>
            </div>
            <table className="table-auto w-full text-left text-blue-900">
              <thead>
                <tr className="bg-yellow-300">
                  <th className="px-4 py-2">PINJAMAN</th>
                  <th className="px-4 py-2">DURASI</th>
                  <th className="px-4 py-2">TOTAL</th>
                  <th className="px-4 py-2">STATUS</th>
                  {activeTab === "APPROVED" && (
                    <th className="px-4 py-2">TAGIHAN</th>
                  )}
                  {activeTab === "PENDING" && (
                    <th className="px-4 py-2">ACTION</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filterDataByStatus(activeTab).length > 0 ? (
                  filterDataByStatus(activeTab).map((row) => (
                    <tr key={row.id} className="bg-white">
                      <td className="px-4 py-2">{row.loanType.type}</td>
                      <td className="px-4 py-2">
                        {row.instalmentType.instalmentType}
                      </td>
                      <td className="px-4 py-2">{row.nominal}</td>
                      <td
                        className={`px-4 py-2 ${
                          row.approvalStatus === "PENDING"
                            ? "text-yellow-500"
                            : row.approvalStatus === "REJECT"
                            ? "text-red-500"
                            : row.approvalStatus === "APPROVED"
                            ? "text-green-500"
                            : ""
                        }`}
                      >
                        {row.approvalStatus}
                      </td>
                      {activeTab === "APPROVED" && (
                        <td className="px-4 py-2">
                          <button className="px-6">
                            <IoEyeOutline />
                          </button>
                        </td>
                      )}
                      {activeTab === "PENDING" && (
                        <td className="px-4 py-2 flex flex-row space-x-4">
                          <button
                            className="text-green-600"
                            onClick={() => approveTransaction(row.id)}
                          >
                            Approve
                          </button>
                          <button
                            className="text-red-600"
                            onClick={() => rejectTransaction(row.id)}
                          >
                            Reject
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={activeTab === "APPROVED" ? 5 : 4}
                      className="px-4 py-2 text-center text-yellow-300"
                    >
                      Tidak ada data yang tersedia
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
    </div>
  );
};

export default LoanRequest;
