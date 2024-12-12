import React from "react";
import { Link } from "react-router-dom"; // Impor Link dari react-router-dom
import Navbar from "../components/Navbar.jsx";

const HomePage = () => {
    return (
        <div className="w-full h-screen relative bg-gradient-to-b from-[#0e002a] to-[#2b037d]">
            {/* Navbar */}
            <Navbar />

            <div className="flex justify-between items-center px-20 pb-10">
                <div>
                    <div className="m-12 text-white">
                        <h1 className="text-[28px] md:text-[45px] font-medium">Welcome !!</h1>
                        <h2 className="text-[36px] md:text-[72px] font-extrabold leading-snug">
                            Let&#39;s Start Using <br/>
                            Loan App
                        </h2>
                        <p className="text-lg md:text-2xl font-medium mt-4">
                            Financial solution in an easy way
                        </p>
                    </div>

                    {/* Buttons */}
                    <div className="pl-12 flex space-x-4 md:space-x-8">
                        <Link to={"/register"}>
                            <div
                                className="bg-[#fbb439] w-[110px] h-[40px] md:w-[138px] md:h-[47px] rounded-[15px] flex items-center justify-center">
                                <button className="text-black text-sm md:text-base font-medium">
                                    Register
                                </button>
                            </div>
                        </Link>

                        <Link to="/login"> {/* Ganti tombol dengan Link */}
                            <button
                                className="w-[110px] h-[40px] md:w-[138px] md:h-[47px] bg-transparent border-2 border-[#fbb439] rounded-[15px] text-[#fbb439] text-sm md:text-base font-medium">
                            Login
                            </button>
                        </Link>
                    </div>

                </div>
                <img
                    className="w-full md:w-[40%] right-4 md:right-[5%] top-[20%]"
                    src="src/assets/9391712.png"
                    alt="Loan App Illustration"
                />

            </div>

        </div>
    );
};

export default HomePage;
