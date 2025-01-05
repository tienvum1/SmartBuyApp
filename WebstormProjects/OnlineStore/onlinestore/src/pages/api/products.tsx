import { NextApiRequest, NextApiResponse } from 'next';
import { fetchProducts } from '@/db/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const products = await fetchProducts();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: 'Không thể lấy dữ liệu sản phẩm' });
    }
}
