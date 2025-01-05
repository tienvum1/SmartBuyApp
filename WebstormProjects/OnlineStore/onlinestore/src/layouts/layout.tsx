'use client';

import React from 'react';
import NavigationComponent from '../components/Navigation';
import Footer from '../components/Footer';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div>
            <NavigationComponent />

            <main className="max-w-7xl mx-auto py-10 px-6">
                {children}
            </main>

            <Footer />
        </div>
    );
};

export default MainLayout;
