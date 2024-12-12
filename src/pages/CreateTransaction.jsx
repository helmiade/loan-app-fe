import React, { useEffect, useState } from "react";
import SidebarCustomer from "../components/SidebarCustomer.jsx";
import { Bars3Icon } from "@heroicons/react/24/outline/index.js";

const CreateTransaction = () => {
    const [loanTypes, setLoanTypes] = useState([]);
    const [installmentTypes, setInstallmentTypes] = useState([]);
    const [transactionData, setTransactionData] = useState({
        loanTypes: { id: "" },
        instalmentTypes: { id: "" },
        customers: { id: localStorage.getItem("id") },
        nominal: "",
    });
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [document, setDocument] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const closeSidebar = () => setIsSidebarOpen(false);
    const toggleSidebar = () => setIsSidebarOpen((prevState) => !prevState);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTransactionData((prevData) => ({
            ...prevData,
            [name]: { id: value },
        }));
    };

    const handleFileChange = (e) => setDocument(e.target.files[0]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const token = localStorage.getItem("token");
                const loanTypesResponse = await fetch("http://localhost:8080/api/loan-types", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!loanTypesResponse.ok) throw new Error(`HTTP error! Status: ${loanTypesResponse.status}`);
                const loanTypesData = await loanTypesResponse.json();
                setLoanTypes(loanTypesData.data || []);

                const installmentTypesResponse = await fetch("http://localhost:8080/api/instalment-types", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!installmentTypesResponse.ok) throw new Error(`HTTP error! Status: ${installmentTypesResponse.status}`);
                const installmentTypesData = await installmentTypesResponse.json();
                setInstallmentTypes(installmentTypesData.data || []);
            } catch (error) {
                console.error("Failed to fetch data", error);
            }
        };

        loadData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const formData = new FormData();
            formData.append("request", new Blob([JSON.stringify(transactionData)], { type: "application/json" }));
            if (document) formData.append("document", document);

            const response = await fetch("http://localhost:8080/api/transactions", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            setIsModalOpen(true);
        } catch (e) {
            console.error("Failed to submit transaction:", e);
        }
    };

    return (
        <div className="flex bg-blue-900 h-screen">
            {isSidebarOpen && <SidebarCustomer onClose={closeSidebar} />}

            <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-0"}`}>
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
                <div className="flex items-center justify-center h-screen">
                    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
                        <h2 className="text-2xl font-bold mb-6 text-center">Create Transaction</h2>
                        <div className="mb-4">
                            <label htmlFor="loanTypes" className="block mb-2 font-semibold">Loan Type</label>
                            <select
                                id="loanTypes"
                                name="loanTypes"
                                value={transactionData.loanTypes.id}
                                onChange={handleChange}
                                className="w-full border border-gray-300 p-2 rounded hover:border-blue-400 focus:border-blue-400 transition"
                            >
                                <option value="">Select Loan Type</option>
                                {Array.isArray(loanTypes) && loanTypes.map((loanType) => (
                                    <option key={loanType.id} value={loanType.id}>
                                        {loanType.type}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="instalmentTypes" className="block mb-2 font-semibold">Installment Type</label>
                            <select
                                id="instalmentTypes"
                                name="instalmentTypes"
                                value={transactionData.instalmentTypes.id}
                                onChange={handleChange}
                                className="w-full border border-gray-300 p-2 rounded hover:border-blue-400 focus:border-blue-400 transition"
                            >
                                <option value="">Select Installment Type</option>
                                {Array.isArray(installmentTypes) && installmentTypes.map((installmentType) => (
                                    <option key={installmentType.id} value={installmentType.id}>
                                        {installmentType.instalmentType}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="nominal" className="block mb-2 font-semibold">Nominal</label>
                            <input
                                type="number"
                                id="nominal"
                                name="nominal"
                                value={transactionData.nominal}
                                onChange={(e) => setTransactionData(prev => ({ ...prev, nominal: e.target.value }))}
                                className="w-full border border-gray-300 p-2 rounded hover:border-blue-400 focus:border-blue-400 transition"
                                placeholder="Enter nominal"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="document" className="block mb-2 font-semibold">Document</label>
                            <input
                                type="file"
                                id="document"
                                name="document"
                                onChange={handleFileChange}
                                className="w-full border border-gray-300 p-2 rounded hover:border-blue-400 focus:border-blue-400 transition"
                            />
                        </div>

                        <button
                            type="submit"
                            className="bg-yellow-400 text-white px-4 py-2 rounded hover:bg-yellow-500 transition w-full"
                        >
                            Submit Transaction
                        </button>
                    </form>
                </div>

                {isModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-gray-100 p-6 rounded-lg shadow-lg text-center">
                            <h3 className="text-lg font-semibold mb-4">Success!</h3>
                            <p>Your loan request has been submitted successfully.</p>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="mt-4 bg-yellow-400 text-white px-4 py-2 rounded hover:bg-yellow-500"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CreateTransaction;
