import mysql from 'mysql2/promise';

export const createConnection = async () => {
    const connection = await mysql.createConnection({
        host: 'localhost', // Địa chỉ host của MySQL
        user: 'root',      // Tên người dùng MySQL
        password: 'hung300403', // Mật khẩu MySQL
        database: 'onlinestore', // Tên cơ sở dữ liệu
    });
    return connection;
};

// Hàm lấy danh sách sản phẩm
export const fetchProducts = async () => {
    const connection = await createConnection();
    try {
        const [rows] = await connection.execute('SELECT * From products');
        return rows;
    } catch (error) {
        throw error;
    } finally {
        await connection.end();
    }
};
