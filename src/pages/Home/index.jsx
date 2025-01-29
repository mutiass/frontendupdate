import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './index.scss';

const apiUrlv1 = 'https://backendexpressmongo-4486.vercel.app/api/v1/products';
const apiUrlv2 = 'https://backendexpressmongo-4486.vercel.app/api/v2/products';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch produk dari backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${apiUrlv1}`); // Sesuaikan endpoint
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Gagal mengambil data produk', error);
      }
    };
    fetchProducts();
  }, []);

  // Fungsi untuk menghapus produk di kedua versi API
  const handleDelete = async (id) => {
    try {
      // Menghapus di v1
      const responseV1 = await fetch(`${apiUrlv1}/${id}`, {
        method: 'DELETE',
      });
      const dataV1 = await responseV1.json();
      console.log(`[v1] ${dataV1.message}`);

      // Menghapus di v2
      const responseV2 = await fetch(`${apiUrlv2}/${id}`, {
        method: 'DELETE',
      });
      const dataV2 = await responseV2.json();
      console.log(`[v2] ${dataV2.message}`);

      // Perbarui daftar produk di frontend
      setProducts(products.filter((product) => product._id !== id));
    } catch (error) {
      console.error('Gagal menghapus produk di salah satu versi API', error);
    }
  };

  // Fungsi untuk menangani pencarian
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  // Memfilter produk berdasarkan pencarian
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery)
  );

  // Format angka ke lokal Indonesia
  const formatNumber = (number) => number.toLocaleString('id-ID');

  return (
    <div className="main">
      <Link to="/tambah" className="btn btn-primary">Tambah Produk</Link>
      <div className="search">
        <input
          type="text"
          placeholder="Masukan kata kunci..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th className="text-right">Price</th>
            <th className="text-right">Stock</th>
            <th className="text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product) => (
            <tr key={product._id}>
              <td>{product._id}</td>
              <td>{product.name}</td>
              <td className="text-right">Rp{formatNumber(product.price)}</td>
              <td className="text-right">{formatNumber(product.stock)}</td>
              <td className="text-center">
                <Link to={`/detail/${product._id}`} className="btn btn-sm btn-info">Detail</Link>
                <Link to={`/edit/${product._id}`} className="btn btn-sm btn-warning">Edit</Link>
                <button
                  onClick={() => handleDelete(product._id)}
                  className="btn btn-sm btn-danger"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Home;
