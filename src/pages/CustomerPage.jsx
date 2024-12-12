import React, { useEffect, useState } from "react";
import SidebarCustomer from "../components/SidebarCustomer.jsx";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { jwtDecode } from "jwt-decode";

const CustomerPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);

  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const getCustomerIdFromToken = () => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      return decodedToken.jti; // Ensure this key corresponds to your customer ID in the token
    }
    return null;
  };

  useEffect(() => {
    const loadCustomerData = async () => {
      try {
        const data = await fetchCustomer();

        localStorage.setItem("id", data.data.id);
        
      } catch (err) {
        console.error("Failed to fetch customer data:", err);
      }
    };

    loadCustomerData();
  }, []);

  const fetchCustomer = async () => {
    try {
      const customerId = getCustomerIdFromToken().trim();
      if (!customerId) throw new Error("Customer ID not found in token");

      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:8080/api/customers/user/${customerId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("data get", data);
      setCustomerData(data);
      setLoading(false);
      const picture = await fetch(
        `http://localhost:8080/api/customers/picture/${data.data.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!picture.ok) {
        throw new Error(`HTTP error! Status: ${picture.status}`);
      }

      const pictureData = await picture.json();
      console.log(pictureData);

      setProfilePicture(`http://localhost:8080/assets/images/${pictureData.data}`);
      console.log(pictureData.data);
      
      return data;
    } catch (error) {
      setError("Failed to fetch customer data");
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomerData((prevData) => ({
      ...prevData,
      data: {
        ...prevData.data,
        [name]: value,
      },
    }));
  };

  const handleProfilePictureChange = (e) => {
    setProfilePicture(e.target.files[0]); // Set the selected file for profile picture
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const customerId = getCustomerIdFromToken().trim();
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append(
        "customer",
        new Blob([JSON.stringify(customerData.data)], {
          type: "application/json",
        })
      );
      if (profilePicture) {
        formData.append("profilePicture", profilePicture);
      }

      const response = await fetch(`http://localhost:8080/api/customers`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Refresh the customer data
      await fetchCustomer(); // Memanggil ulang fungsi fetchCustomer untuk mendapatkan data terbaru

      closeModal(); // Menutup modal
    } catch (error) {
      console.error("Error updating customer data:", error);
      setError("Failed to update customer data");
    }
  };

  return (
    <div className="flex bg-blue-900 h-screen">
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

        <div className="container mx-auto p-6">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-4xl font-bold mb-6 text-gray-800 ml-10">
              Profile
            </h1>

            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 flex justify-center mb-6 md:mb-0">
                  <img
                    className="w-56 h-56 rounded-full object-cover border-4 border-gray-300 shadow-lg"
                    src={profilePicture || "https://via.placeholder.com/150"}
                    alt="Customer Picture"
                  />
                </div>

                <div className="md:w-2/3 md:ml-6">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      First Name
                    </label>
                    <p className="text-xl font-semibold text-gray-900">
                      {customerData.data.firstName}
                    </p>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Last Name
                    </label>
                    <p className="text-xl font-semibold text-gray-900">
                      {customerData.data.lastName}
                    </p>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Date of Birth
                    </label>
                    <p className="text-xl font-semibold text-gray-900">
                      {customerData.data.dateOfBirth.slice(0, 10)}
                    </p>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Phone
                    </label>
                    <p className="text-xl font-semibold text-gray-900">
                      {customerData.data.phone}
                    </p>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <p className="text-xl font-semibold text-gray-900">
                      {customerData.data.status}
                    </p>
                  </div>

                  <button
                    onClick={openModal}
                    className="mt-4 px-10 py-2 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                  >
                    Edit
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-8 w-1/3">
              <h2 className="text-2xl font-bold mb-4">Edit Customer</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={customerData.data.firstName}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={customerData.data.lastName}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={customerData.data.dateOfBirth.slice(0, 10)}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={customerData.data.phone}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <input
                    type="text"
                    name="status"
                    value={customerData.data.status}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Profile Picture
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="mr-2 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerPage;
