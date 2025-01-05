import React from "react";
import { useRouter } from "next/router";

const ProductDetail = () => {
    const router = useRouter();
    const { id } = router.query;

    return (
        <div className="bg-gray-100 min-h-screen">
            {/* Header */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
                    <h1 className="text-xl font-bold">Online Store</h1>
                    <nav className="space-x-4">
                        <a href="/onlinestore/public" className="text-gray-600 hover:text-black">Home</a>
                        <a href="/cart" className="text-gray-600 hover:text-black">Cart</a>
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto my-10 grid grid-cols-2 gap-8">
                {/* Product Image */}
                <div className="bg-white p-4 shadow rounded-md">
                    <img
                        src="https://via.placeholder.com/400"
                        alt="Product Image"
                        className="w-full h-96 object-cover rounded-md"
                    />
                </div>

                {/* Product Info */}
                <div className="bg-white p-6 shadow rounded-md">
                    <h2 className="text-2xl font-bold mb-4">Product Name {id}</h2>
                    <p className="text-gray-600 text-lg mb-4">$99.99</p>
                    <p className="text-gray-700 mb-6">
                        This is a detailed description of the product. It provides all the
                        key information about the product features and benefits.
                    </p>
                    <p className="text-green-600 font-semibold mb-4">In Stock</p>
                    <div className="flex items-center space-x-4 mb-6">
                        <label htmlFor="quantity" className="font-semibold">
                            Quantity:
                        </label>
                        <input
                            type="number"
                            id="quantity"
                            min="1"
                            defaultValue="1"
                            className="border rounded-md px-4 py-2 w-16"
                        />
                    </div>
                    <button className="bg-blue-500 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-600">
                        Add to Cart
                    </button>
                </div>
            </main>

            {/* Reviews Section */}
            <section className="max-w-7xl mx-auto my-10 bg-white p-6 shadow rounded-md">
                <h3 className="text-2xl font-bold mb-6">Customer Reviews</h3>
                <div className="space-y-4">
                    {/* Review 1 */}
                    <div className="border-b pb-4">
                        <h4 className="font-semibold">John Doe</h4>
                        <p className="text-gray-600">"Great product! Highly recommend."</p>
                    </div>
                    {/* Review 2 */}
                    <div className="border-b pb-4">
                        <h4 className="font-semibold">Jane Smith</h4>
                        <p className="text-gray-600">"Quality is amazing. Worth the price!"</p>
                    </div>
                </div>

                {/* Add a Review */}
                <form className="mt-6">
                    <h4 className="font-semibold mb-4">Leave a Review</h4>
                    <textarea
                        className="w-full border rounded-md p-4 mb-4"
                        placeholder="Write your review here..."
                    ></textarea>
                    <button className="bg-blue-500 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-600">
                        Submit Review
                    </button>
                </form>
            </section>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-6">
                <div className="max-w-7xl mx-auto text-center">
                    <p>&copy; 2024 Online Store. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default ProductDetail;