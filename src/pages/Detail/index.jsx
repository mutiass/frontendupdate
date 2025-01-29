import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './index.scss';

const apiUrlv1 = 'https://backendexpressmongo.vercel.app/api/v1/products';
const apiUrlv2 = 'https://backendexpressmongo.vercel.app/api/v2/products';

const Detail = () => {
  const [product, setProduct] = useState(null);
  const { id } = useParams(); // Mengambil id produk dari URL

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Coba ambil data dari API v1
        let response = await fetch(`${apiUrlv1}/${id}`);
        
        if (!response.ok) {
          // Jika gagal, coba ambil data dari API v2
          response = await fetch(`${apiUrlv2}/${id}`);
        }

        if (response.ok) {
          const data = await response.json();
          setProduct(data);
        } else {
          console.error('Gagal mengambil detail produk');
        }
      } catch (error) {
        console.error('Terjadi kesalahan saat mengambil detail produk:', error);
      }
    };

    fetchProduct();
  }, [id]); // Efek berjalan ulang jika id berubah

  if (!product) {
    return <div>Loading...</div>; // Tampilkan loading jika data produk belum tersedia
  }

  return (
    <div className="main">
      <div className="card">
        <h2>Detail Produk</h2>
        <br />
        <div className="product-detail">
          <p><strong>Nama Produk:</strong> {product.name}</p>
          <p><strong>Harga:</strong> Rp{product.price}</p>
          <p><strong>Stock:</strong> {product.stock}</p>
          <p><strong>Status:</strong> {product.status ? 'Aktif' : 'Tidak Aktif'}</p>
        </div>
      </div>
    </div>
  );
}

export default Detail;
