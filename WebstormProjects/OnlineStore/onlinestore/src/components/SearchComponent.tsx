import React, { useState, ChangeEvent, FormEvent } from "react";

const SearchComponent = () => {
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log("Searching for:", searchQuery);
    };

    return (
        <form onSubmit={handleSearchSubmit} className="w-full flex justify-center">
            <div className="relative w-3/4">
                <input
                    type="text"
                    placeholder="Nhập sản phẩm cần tìm..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full border rounded-lg py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
                <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-yellow-500">
                    <i className="fas fa-search"></i>
                </button>
            </div>
        </form>
    );
};

export default SearchComponent;