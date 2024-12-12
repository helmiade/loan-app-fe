import React from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";

const SidebarCustomer = ({ onClose }) => {
  const user = useSelector((state) => state.auth.user);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    navigate("/login");
  };

  // Determine if the user is a customer based on roles
  const isCustomer = user?.roles?.includes("ROLE_CUSTOMER");

  return (
    <div className="bg-yellow-400 w-64 h-full shadow-lg fixed top-0 left-0 z-30 flex flex-col">
      {/* Header Section */}
      <div className="flex items-center justify-between p-4 border-b">
        <h1 className="text-xl font-bold">Loan App</h1>
        <button onClick={onClose} className="text-gray-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Links Section */}
      <div className="flex-grow p-4">
        {isCustomer ? (
          <ul>
            <li className="mb-2">
              <Link to="/customer" className="block p-2 hover:bg-gray-200">
                Profile
              </Link>
            </li>
            <li className="mb-2">
              <Link to="/history" className="block p-2 hover:bg-gray-200">
                History
              </Link>
            </li>
            <li className="mb-2">
              <Link to="/create-loan" className="block p-2 hover:bg-gray-200">
                Ask Loan
              </Link>
            </li>
          </ul>
        ) : (
          <ul>
            <li className="mb-2">
              <Link to="/admin" className="block p-2 hover:bg-gray-200">
                Dashboard
              </Link>
            </li>
            <li className="mb-2">
              <Link to="/request" className="block p-2 hover:bg-gray-200">
                Loan Request
              </Link>
            </li>
            <li className="mb-2">
              <Link to="/loan-type" className="block p-2 hover:bg-gray-200">
                Loan Type
              </Link>
            </li>
          </ul>
        )}
      </div>

      {/* Logout Button Section */}
      <div className="p-4">
        <button
          onClick={handleLogout}
          className="block w-full p-2 text-center bg-blue-800 text-white font-semibold rounded hover:bg-blue-900"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default SidebarCustomer;
