'use client';

import React from 'react';
import HeroCarousel from '../components/HeroCarousel';
import ProductList from '@/components/ProductList';
import MainLayout from '../layouts/layout';

const Homepage = () => {
    return (
        <MainLayout>
            <HeroCarousel />
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Sản Phẩm Nổi Bật</h2>
            <ProductList />
        </MainLayout>
    );
};

export default Homepage;
