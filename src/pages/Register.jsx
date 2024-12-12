import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance.jsx";
import NotificationModal from "../components/NotificationModal.jsx";  // Import the new notification modal

export default function RegisterCustomer() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [phone, setPhone] = useState("");
    const [status, setStatus] = useState("");

    const [showModal, setShowModal] = useState(false);  // For showing modal
    const [modalMessage, setModalMessage] = useState("");  // Message to show in modal
    const [isSuccess, setIsSuccess] = useState(false);  // Check if it's a success message

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const response = await axiosInstance.post("/auth/signup/customer", {
                email,
                password,
                firstName,
                lastName,
                dateOfBirth,
                phone,
                status,
            });

            // If registration is successful
            setModalMessage("Registration successful! Please log in.");
            setIsSuccess(true);
            setShowModal(true);

            // Clear form fields
            setEmail("");
            setPassword("");
            setFirstName("");
            setLastName("");
            setDateOfBirth("");
            setPhone("");
            setStatus("");

            // Optional: Redirect to login page after showing the modal
            setTimeout(() => {
                setShowModal(false);
                navigate("/login");
            }, 3000);
        } catch (error) {
            // If registration fails, show modal with error message
            setModalMessage("Registration failed. Please try again.");
            setIsSuccess(false);
            setShowModal(true);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <div className="bg-white flex justify-center items-center h-screen">
            {/* Notification Modal */}
            <NotificationModal
                show={showModal}
                onClose={handleCloseModal}
                message={modalMessage}
                isSuccess={isSuccess}
            />

            <div className="w-1/2 h-screen hidden lg:block bg-gradient-to-b from-[#0e002a] to-[#2b037d]">
                <img src="src/assets/9391712.png" alt="Placeholder Image" className="object-cover w-full h-full" />
            </div>

            <div className="lg:p-36 md:p-52 sm:20 p-8 w-full lg:w-1/2">
                <h1 className="text-2xl font-semibold mb-4">Register as Customer</h1>
                <form onSubmit={handleRegister}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-600">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                            autoComplete="off"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-gray-600">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                            autoComplete="off"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="firstName" className="block text-gray-600">First Name</label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="lastName" className="block text-gray-600">Last Name</label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="dateOfBirth" className="block text-gray-600">Date of Birth</label>
                        <input
                            type="date"
                            id="dateOfBirth"
                            name="dateOfBirth"
                            value={dateOfBirth}
                            onChange={(e) => setDateOfBirth(e.target.value)}
                            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="phone" className="block text-gray-600">Phone</label>
                        <input
                            type="text"
                            id="phone"
                            name="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="status" className="block text-gray-600">Status</label>
                        <input
                            type="text"
                            id="status"
                            name="status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div className="mb-6">
                        <button type="submit" className="bg-purple-700 hover:bg-purple-800 text-white font-semibold rounded-md py-2 px-4 w-full">
                            Register
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
