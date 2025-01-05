import React from "react";

const Buttons = () => {
    return (
        <div className="flex justify-center items-center space-x-8">
            <div className="text-gray-700 hover:text-black relative">
                <i className="fas fa-shopping-cart text-xl"></i>
                <span className="absolute top-0 right-0 -mt-1 -mr-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                    0
                </span>
            </div>

            <div className="text-gray-600 flex items-center space-x-4">
                <i className="fas fa-user text-xl"></i>
                <a href="/register" className="text-gray-600 hover:text-yellow-500 text-sm font-medium">ĐĂNG KÝ</a>
                <a href="/login"
                   className="text-gray-600 hover:text-white text-lg font-medium border border-transparent bg-orange-400 rounded-lg px-4 py-2 transition duration-300 ease-in-out">
                    ĐĂNG NHẬP
                </a>
            </div>
        </div>
    );
};

export default Buttons;