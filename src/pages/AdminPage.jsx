import { Bars3Icon } from "@heroicons/react/24/outline";
import SidebarCustomer from "../components/SidebarCustomer";
import { useState, useEffect } from "react";
import { FiUser } from "react-icons/fi";
import { GrTransaction } from "react-icons/gr";
import { FaMoneyCheckDollar } from "react-icons/fa6";
import { Bar, Pie } from "react-chartjs-2";  // Importing the required chart types
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js";
import axiosInstance from "../api/axiosInstance";

// Register the required chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export const AdminPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);

  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  // Fetch dashboard data using axiosInstance
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axiosInstance.get("/transactions/dashboard"); // Fetch from API endpoint
        setDashboardData(response.data.data); // Set the response data to state
        console.log(response.data.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  // Function to format the currency as Rupiah
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  };

  // Data for Loan Status (Bar Chart)
  const loanStatusData = {
    labels: ["Approved", "Rejected", "Pending"],
    datasets: [
      {
        label: "Loan Status",
        data: [
          dashboardData?.approvedLoans,
          dashboardData?.rejectedLoans,
          dashboardData?.pendingLoans,
        ],
        backgroundColor: ["#4CAF50", "#D32F2F", "#FF9800"],  // Green, Red, Yellow
        borderColor: ["#4CAF50", "#D32F2F", "#FF9800"],
        borderWidth: 1,
      },
    ],
  };

  // Data for User Status (Pie Chart)
  const userStatusData = {
    labels: ["Active", "Inactive"],
    datasets: [
      {
        data: [dashboardData?.activeUsers, dashboardData?.inactiveUsers],
        backgroundColor: ["#00C853", "#D32F2F"],  // Green, Red
        borderWidth: 1,
      },
    ],
  };

  // Data for Loan Amount (Bar Chart)
  const loanAmountData = {
    labels: ["Paid", "Unpaid"],
    datasets: [
      {
        label: "Loan Amount",
        data: [
          dashboardData?.paidLoanAmount,
          dashboardData?.unpaidLoanAmount,
        ],
        backgroundColor: ["#FF9800", "#F44336"],  // Orange, Red
        borderColor: ["#FF9800", "#F44336"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="bg-blue-100 min-h-screen">
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

        <div className="p-4">
          {dashboardData ? (
            <>
              <div className="p-4 mx-10">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
                  <div className="bg-gray-100 p-6 rounded shadow flex flex-row items-center justify-between">
                    <GrTransaction size={80} color="blue" />
                    <div className="flex flex-col">
                      <h3 className="text-xl font-semibold">Total Loans</h3>
                      <p className="text-lg">{dashboardData.totalLoans} Transactions</p>
                    </div>
                  </div>
                  <div className="bg-gray-100 p-6 rounded shadow flex flex-row items-center justify-between">
                    <FiUser size={80} color="red" />
                    <div className="flex flex-col">
                      <h3 className="text-xl font-semibold">Total Users</h3>
                      <p className="text-lg">{dashboardData.totalUsers} Users</p>
                    </div>
                  </div>
                  <div className="bg-gray-100 p-6 rounded shadow flex flex-row items-center justify-between">
                    <FaMoneyCheckDollar size={80} color="green" />
                    <div className="flex flex-col">
                      <h3 className="text-xl font-semibold">Total Nominal</h3>
                      <p className="text-lg">{formatCurrency(dashboardData.loanAmount)}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between gap-6">
                  {/* Bar Chart for Loan Status */}
                  <div className="mb-6 w-full md:w-1/3 bg-gray-100">
                    <h2 className="text-lg font-semibold mb-4">Loan Status</h2>
                    <Bar data={loanStatusData} options={{ responsive: true }} />
                  </div>

                  {/* Pie Chart for User Status */}
                  <div className="mb-6 w-full md:w-1/3 bg-gray-100">
                    <h2 className="text-lg font-semibold mb-4">User Status</h2>
                    <Pie data={userStatusData} options={{ responsive: true }} />
                  </div>

                  {/* Bar Chart for Loan Amount */}
                  <div className="mb-6 w-full md:w-1/3 bg-gray-100">
                    <h2 className="text-lg font-semibold mb-4">Loan Amount</h2>
                    <Bar data={loanAmountData} options={{ responsive: true }} />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <p>Loading dashboard data...</p>
          )}
        </div>
      </div>
    </div>
  );
};
