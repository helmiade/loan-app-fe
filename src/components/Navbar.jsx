import React from "react";

const Navbar = () => {
    return (
        <nav className="flex mr-10 justify-end space-x-14 p-6 text-white font-semibold text-[18px]">
            <a href="#home" className="hover:text-yellow-500">
                Home
            </a>
            <a href="#about-us" className="hover:text-yellow-500">
                About Us
            </a>
            <a href="#services" className="hover:text-yellow-500">
                Services
            </a>
            <a href="#register" className="hover:text-yellow-500">
                Register
            </a>
        </nav>
    );
};

export default Navbar;
