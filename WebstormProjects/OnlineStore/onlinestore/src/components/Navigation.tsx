import React, { useState } from "react";
import SearchComponent from "@/components/SearchComponent";
import Title from "@/components/Title";
import "../styles/globals.css";

const Navigation = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <button
                            className="md:hidden text-gray-600 hover:text-yellow-500"
                            onClick={toggleMenu}
                        >
                            <i className="fas fa-bars text-xl"></i>
                        </button>
                        <div className="flex items-center space-x-4">
                            <Title /> {/* Component Title */}
                            <button className="hidden md:flex items-center space-x-2 text-gray-600 hover:text-yellow-500">
                                <i className="fas fa-bars"></i>
                                <span>Danh mục sản phẩm</span>
                            </button>
                        </div>
                    </div>

                    <div className="hidden md:flex flex-1 justify-center mx-4">
                        <SearchComponent />
                    </div>

                    <div className="hidden md:flex items-center space-x-4">
                        <a href="/register" className="text-gray-600 hover:text-yellow-500 text-sm font-medium">
                            ĐĂNG KÝ
                        </a>
                        <a
                            href="/login"
                            className="text-gray-600 hover:text-white text-lg font-medium border border-transparent bg-orange-400 rounded-lg px-4 py-2 transition duration-300 ease-in-out"
                        >
                            ĐĂNG NHẬP
                        </a>
                    </div>
                </div>
            </div>

            <div
                className={`fixed top-0 left-0 h-full w-64 bg-white shadow-md z-50 transform ${
                    isMenuOpen ? "translate-x-0" : "-translate-x-full"
                } transition-transform duration-300 ease-in-out`}
            >
                <button
                    className="absolute top-4 right-4 text-gray-600 hover:text-red-500"
                    onClick={toggleMenu}
                >
                    <i className="fas fa-times text-2xl"></i>
                </button>
                <div className="mt-16 space-y-4 px-6">
                    <a href="/" className="block text-gray-800 hover:text-yellow-500 font-medium">
                        Trang chủ
                    </a>
                    <a href="/about" className="block text-gray-800 hover:text-yellow-500 font-medium">
                        Giới thiệu
                    </a>
                    <a href="/stores" className="block text-gray-800 hover:text-yellow-500 font-medium">
                        Cửa hàng
                    </a>
                    <a href="/news" className="block text-gray-800 hover:text-yellow-500 font-medium">
                        Tin tức
                    </a>
                    <a href="/contact" className="block text-gray-800 hover:text-yellow-500 font-medium">
                        Liên hệ
                    </a>
                </div>
            </div>

            <div className="bg-gray-100 border-t hidden md:flex">
                <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

                    <div className="flex items-center space-x-10">
                        <a href="/" className="text-gray-600 hover:text-yellow-500 font-medium">
                            Trang chủ
                        </a>
                        <a href="/about" className="text-gray-600 hover:text-yellow-500 font-medium">
                            Giới thiệu
                        </a>
                        <a href="/stores" className="text-gray-600 hover:text-yellow-500 font-medium">
                            Cửa hàng
                        </a>
                        <a href="/news" className="text-gray-600 hover:text-yellow-500 font-medium">
                            Tin tức
                        </a>
                        <a href="/contact" className="text-gray-600 hover:text-yellow-500 font-medium">
                            Liên hệ
                        </a>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navigation;