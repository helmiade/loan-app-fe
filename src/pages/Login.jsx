import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance.jsx";
import { setAuthState } from "../redux/feature/authSlice.jsx";
import ErrorModal from "../components/ErrorModal.jsx";  // Import the modal

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showErrorModal, setShowErrorModal] = useState(false);  // For showing error modal
    const [errorMessage, setErrorMessage] = useState("");  // Error message to show in modal

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axiosInstance.post("/auth/signin", { email, password });
            const { token, data: { roles } } = response.data;

            // Save token to localStorage
            localStorage.setItem("token", token);

            // Update login status in Redux
            dispatch(setAuthState({ isLoggedIn: true, user: { email, roles } }));

            // Redirect user based on roles
            if (roles.includes("ROLE_ADMIN")) {
                navigate("/admin");
            } else if (roles.includes("ROLE_CUSTOMER")) {
                navigate("/customer");
            }
        } catch (error) {
            // If login fails, show modal with error message
            setErrorMessage("Invalid email or password. Please try again.");
            setShowErrorModal(true);
        }
    };

    const handleCloseModal = () => {
        setShowErrorModal(false);
    };

    return (
        <div className="bg-white flex justify-center items-center h-screen">
            {/* Error Modal */}
            <ErrorModal
                show={showErrorModal}
                onClose={handleCloseModal}
                message={errorMessage}
            />

            <div className="w-1/2 h-screen hidden lg:block bg-gradient-to-b from-[#0e002a] to-[#2b037d]">
                <img src="src/assets/9391712.png" alt="Placeholder Image" className="object-cover w-full h-full" />
            </div>

            <div className="lg:p-36 md:p-52 sm:20 p-8 w-full lg:w-1/2">
                <h1 className="text-2xl font-semibold mb-4">Login</h1>
                <form onSubmit={handleLogin}>
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
                        />
                    </div>
                    <div className="mb-6">
                        <button type="submit" className="bg-purple-700 hover:bg-purple-800 text-white font-semibold rounded-md py-2 px-4 w-full">
                            Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
