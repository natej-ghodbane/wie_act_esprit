import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import apiClient from '../../utils/api';

const VendorProducts = () => {
  const [products, setProducts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // Auth check (per instructions)
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');
    if (!token || !userData) {
      router.push('/auth/login');
      return;
    }

    // Fetch products from backend API
    apiClient.get('/products')
      .then(res => setProducts(res.data))
      .catch(err => {
        console.error('Failed to fetch products:', err);
        setProducts([]);
      });
  }, [router]);

  return (
    <div>
      <h1>Vendor Product Dashboard</h1>
      <ul>
        {products.map((product: any) => (
          <li key={product._id}>{product.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default VendorProducts;