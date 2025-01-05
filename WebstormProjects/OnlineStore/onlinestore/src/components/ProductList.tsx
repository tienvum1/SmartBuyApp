import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
    image_url: string;
    stock: number;
}

const ProductList = () => {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('/api/products');
                setProducts(response.data);
            } catch (error) {
                console.error('Failed to fetch products:', error);
            }
        };
        fetchProducts();
    }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {products.map((product) => (
                <div key={product.id} className="p-4 border rounded-lg">
                    <img src={product.image_url} alt={product.name} className="w-full h-40 object-cover mb-4 rounded-md"/>
                    <h2 className="text-black font-bold">{product.name}</h2>
x                    <p className="text-yellow-600 font-semibold">${product.price}</p>
                    <div className="flex space-x-4 mt-4">
                        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                            Tìm hiểu thêm
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProductList;