import React, { useEffect, useState } from "react";
import SidebarCustomer from "../components/SidebarCustomer";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { IoEyeOutline } from "react-icons/io5";

const HistoryOrder = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loanTransactionDetails, setLoanTransactionDetails] = useState([]);
  const [tableData, setTableData] = useState([]); // Inisialisasi sebagai array kosong
  const [activeTab, setActiveTab] = useState("PENDING"); // Tab aktif
  const [token, setToken] = useState("");

  const toggleSidebar = () => setIsSidebarOpen((prevState) => !prevState);
  const closeSidebar = () => setIsSidebarOpen(false);

  const handleClickDetail = (details) => {
    setLoanTransactionDetails(details);
    setIsModalOpen(true);
  };

  const handleCloseDetail = () => {
    setLoanTransactionDetails([]);
    setIsModalOpen(false);
  };

  const handlePayAction = async (item) => {
    console.log(item.id, item.nominal);
    console.log(token);

    try {
      const response = await fetch(
        `http://localhost:8080/api/payments/generate-token`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            orderId: item.id,
            grossAmount: Math.round(item.nominal),
          }),
        }
      );

      const transactionToken = await response.json();


      // Integrasi Snap.js
      if (transactionToken) {
        console.log(transactionToken);
        if (window.snap) {
          window.snap.pay(transactionToken.token, {
            onSuccess: function (result) {
              fetchHistory();
              handleCloseDetail();
              alert("Pembayaran berhasil!");  
              console.log(result);
            },
            onPending: function (result) {
              alert("Pembayaran ditunda.");
              console.log(result);
            },
            onError: function (result) {
              alert("Pembayaran gagal.");
              console.log(result);
            },
            onClose: function () {
              alert("Popup pembayaran ditutup.");
            },
          });
        } else {
          alert(
            "Snap.js tidak terdeteksi. Pastikan file terintegrasi dengan benar."
          );
        }
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Terjadi kesalahan saat memproses pembayaran.");
    }
  };

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      setToken(token);
      const id = localStorage.getItem("id");
      const response = await fetch(
        `http://localhost:8080/api/transactions/customer/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched data:", data);

      // Pastikan `data` adalah array
      if (Array.isArray(data.data)) {
        setTableData(data.data);
      } else {
        console.error("API did not return an array:", data);
        setTableData([]); // Jika bukan array, set ke array kosong
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setTableData([]); // Tangani error dengan set array kosong
    }
  };

  useEffect(() => {

    fetchHistory();
  }, []);

  const filterDataByStatus = (status) =>
    tableData.filter((row) => row.approvalStatus === status);

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
                activeTab === "REJECTED" ? "bg-red-500 text-white" : "bg-gray-300"
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
                          : row.approvalStatus === "REJECTED"
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
                        <button
                          className="px-6"
                          onClick={() =>
                            handleClickDetail(row.loanTransactionDetails)
                          }
                        >
                          <IoEyeOutline />
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
          {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white w-1/2 p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-bold mb-4">Detail Transaksi</h2>
                <table className="table-auto w-full border border-gray-200">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-2 border">Nominal</th>
                      <th className="px-4 py-2 border">Status</th>
                      <th className="px-4 py-2 border">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loanTransactionDetails.map((item, index) => (
                      <tr key={index} className="text-center">
                        <td className="px-4 py-2 border">{item.nominal}</td>
                        <td className="px-4 py-2 border">{item.loanStatus}</td>
                        <td className="px-4 py-2 border">
                          {item.loanStatus === "UNPAID" ? (
                            <button
                              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                              onClick={() => handlePayAction(item)}
                            >
                              Bayar
                            </button>
                          ) : (
                            <span className="text-gray-500">Lunas</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex justify-end mt-4">
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                    onClick={handleCloseDetail}
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryOrder;
