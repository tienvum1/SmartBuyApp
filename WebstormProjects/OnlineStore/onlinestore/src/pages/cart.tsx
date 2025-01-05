import React, { useState } from "react";

const Cart = () => {
    const [cartitems, setCartItems] = useState([
        {
            id: 1,
            name: "Product 1",
            price: 99.99,
            quantity: 1,
        },
        {
            id: 2,
            name: "Product 2",
            price: 149.99,
            quantity: 2,
        },
    ]);

    // Calculate the total price of all items in the cart
    const calculateTotal = () =>
        cartitems.reduce((total, item) => total + item.price * item.quantity, 0);
    const removeItem = (id: number) => {
        setCartItems(cartitems.filter((item) => item.id !== id));
    }

    const updateQuantity = (id: number, quantity: number) => {
        setCartItems(
            cartitems.map((item) =>
                item.id === id ? { ...item, quantity } : item
            )
        );
    }

    return(
        <div className="bg-gray-100 min-h-screen">
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
                    <h1 className="text-xl font-bold">Online Store</h1>
                    <nav className="space-x-4">
                        <a href="/" className="text-gray-600 hover:text-black">Home</a>
                        <a href="/cart" className="text-gray-600 hover:text-black">Cart ({cartitems.length})
                        </a>
                    </nav>
                    </div>
            </header>

            <main className="max-w-7xl mx-auto my-10">
            <h2 className="text-3xl font-bold mb-6">Shopping Cart</h2>

            {/* Cart Items */}
            <div className="bg-white p-6 shadow rounded-md">
                {cartitems.length === 0 ? (
                    <p className="text-gray-600">Your cart is empty.</p>
                ) : (
                    <div className="space-y-6">
                        {cartitems.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center justify-between border-b pb-4"
                            >
                                <img
                                    alt={item.name}
                                    className="w-20 h-20 object-cover rounded"
                                />
                                <div className="flex-1 ml-4">
                                    <h3 className="text-lg font-semibold">{item.name}</h3>
                                    <p className="text-gray-600">${item.price.toFixed(2)}</p>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <input
                                        type="number"
                                        value={item.quantity}
                                        min="1"
                                        className="border rounded w-16 px-2 py-1 text-center"
                                        onChange={(e) =>
                                            updateQuantity(item.id, parseInt(e.target.value, 10))
                                        }
                                    />
                                    <p className="font-semibold">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </p>
                                    <button
                                        onClick={() => removeItem(item.id)}
                                        className="text-red-500 hover:underline"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Total Section */}
            <div className="mt-6 flex justify-between items-center bg-white p-6 shadow rounded-md">
                <h3 className="text-xl font-semibold">Total:</h3>
                <p className="text-2xl font-bold">${calculateTotal().toFixed(2)}</p>
                <button
                    className="bg-blue-500 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-600"
                    onClick={() => alert("Proceed to Checkout")}
                >
                    Checkout
                </button>
            </div>
        </main>
    </div>
        )
}
export default Cart;