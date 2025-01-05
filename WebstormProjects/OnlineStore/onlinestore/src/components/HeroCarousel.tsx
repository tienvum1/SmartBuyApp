'use client';

import React from 'react';
import { Carousel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const HeroCarousel = () => {
    return (
        <Carousel>
            <Carousel.Item>
                <img
                    className="d-block w-100"
                    src="https://via.placeholder.com/800x400"
                    alt="Thời Trang Hiện Đại"
                />
                <div className="text-center py-20 px-4">
                    <h1 className="text-5xl font-bold text-gray-800 uppercase">Thời Trang Hiện Đại</h1>
                    <p className="text-lg text-gray-600 mt-4">Nơi mua sắm lý tưởng dành cho bạn</p>
                    <button className="mt-8 bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600">
                        Mua Ngay
                    </button>
                </div>
            </Carousel.Item>
            <Carousel.Item>
                <img
                    className="d-block w-100"
                    src="https://via.placeholder.com/800x400"
                    alt="Phong Cách Mới"
                />
                <div className="text-center py-20 px-4">
                    <h1 className="text-5xl font-bold text-gray-800 uppercase">Phong Cách Mới</h1>
                    <p className="text-lg text-gray-600 mt-4">Khám phá bộ sưu tập mới nhất</p>
                    <button className="mt-8 bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600">
                        Khám Phá
                    </button>
                </div>
            </Carousel.Item>
            <Carousel.Item>
                <img
                    className="d-block w-100"
                    src="https://via.placeholder.com/800x400"
                    alt="Ưu Đãi Đặc Biệt"
                />
                <div className="text-center py-20 px-4">
                    <h1 className="text-5xl font-bold text-gray-800 uppercase">Ưu Đãi Đặc Biệt</h1>
                    <p className="text-lg text-gray-600 mt-4">Giảm giá lên đến 50%</p>
                    <button className="mt-8 bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600">
                        Mua Ngay
                    </button>
                </div>
            </Carousel.Item>
        </Carousel>
    );
};

export default HeroCarousel;
