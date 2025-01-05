import Link from "next/link";

const Footer = () => {
    return (
        <footer className="bg-white text-gray-800 py-8">
            <div className="container ml-12 px-4">
                <div className="flex flex-col md:flex-row items-center gap-8 border-b border-b-gray-100 pb-8 mb-8">
                    {/* Đăng ký nhận tin */}
                    <div className="flex-1 flex items-center">
                        <div className="mr-4">
                            <h3 className="font-semibold text-lg">Đăng ký nhận tin</h3>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="email"
                                placeholder="Nhập email của bạn"
                                className="border border-gray-300 rounded-2xl px-4 py-2 w-full focus:outline-none"
                            />
                            <button className="bg-red-600 text-white px-4 py-2 rounded-2xl w-50 ml-4">
                                ĐĂNG KÝ
                            </button>
                        </div>
                    </div>

                    {/* Kết nối với chúng tôi */}
                    <div className="flex-1 flex items-center ml-20 justify-center">
                        <p className="font-semibold text-lg mr-4">Kết nối với chúng tôi</p>
                        <div className="flex space-x-4">
                            <Link href="https://facebook.com" className="text-gray-600 hover:text-gray-800">
                                <div
                                    className="flex items-center justify-center border border-gray-600 rounded-full p-2 hover:bg-blue-500 hover:text-white transition-colors duration-300">
                                    <i className="fab fa-facebook text-2xl"></i>
                                </div>
                            </Link>
                            <Link href="https://youtube.com" className="text-gray-600 hover:text-gray-800">
                                <div
                                    className="flex items-center justify-center border border-gray-600 rounded-full p-2 hover:bg-red-600 hover:text-white transition-colors duration-300">
                                    <i className="fab fa-youtube text-2xl"></i>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Phần thứ hai: Các liên kết khác */}
                <div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="col-span-1">
                            <h3 className="font-semibold text-lg mb-4">CÔNG TY CỔ PHẦN NỘI THẤT BAYA</h3>
                            <p>🏠 BAYA Thủ Đức: 20 Nguyễn Cơ Thạch, P. An Lợi Đông, TP Thủ Đức.</p>
                            <p>📍 BAYA Hà Nội: Toà nhà Luxury Park Views, D32 KĐT mới Cầu Giấy...</p>
                            <p>📞 1900 63 64 76</p>
                            <p>✉️ webshop@baya.vn</p>
                        </div>

                        <div className="col-span-1">
                            <h3 className="font-semibold text-lg mb-4">Về TECHZONE</h3>
                            <ul>
                                <li><Link href="/">Giới thiệu</Link></li>
                                <li><Link href="/">Liên hệ</Link></li>
                                <li><Link href="/">Blog</Link></li>
                                <li><Link href="/">Hệ thống cửa hàng</Link></li>
                            </ul>
                        </div>

                        <div className="col-span-1">
                            <h3 className="font-semibold text-lg mb-4">Hỗ trợ khách hàng</h3>
                            <ul>
                                <li><Link href="/">Câu hỏi thường gặp</Link></li>
                                <li><Link href="/">Hướng dẫn đặt hàng</Link></li>
                                <li><Link href="/">Mua hàng trả góp</Link></li>
                                <li><Link href="/">Hướng dẫn thanh toán VNPAY-QR</Link></li>
                            </ul>
                        </div>

                        <div className="col-span-1">
                            <h3 className="font-semibold text-lg mb-4">Chính sách</h3>
                            <ul>
                                <li><Link href="/">Chính sách bảo hành</Link></li>
                                <li><Link href="/">Chi phí vận chuyển</Link></li>
                                <li><Link href="/">Chính sách đổi trả và hoàn tiền</Link></li>
                                <li><Link href="/">Chính sách bảo mật thông tin</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
