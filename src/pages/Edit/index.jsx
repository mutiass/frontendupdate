import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Input from '../../components/Input'; // Mengimpor komponen Input

const apiUrlv1 = 'https://backendexpressmongo.vercel.app/api/v1/products';
const apiUrlv2 = 'https://backendexpressmongo.vercel.app/api/v2/products';

const Edit = () => {
  const [product, setProduct] = useState({
    name: '',
    price: '',
    stock: '',
    status: true,
  });
  const { id } = useParams(); // Mengambil id produk dari URL
  const navigate = useNavigate();

  // Mengambil detail produk untuk di-edit
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${apiUrlv1}/${id}`);
        if (response.ok) {
          const data = await response.json();
          setProduct({
            name: data.name,
            price: data.price,
            stock: data.stock,
            status: data.status,
          });
        } else {
          alert('Gagal mengambil data produk');
        }
      } catch (error) {
        console.error('Terjadi kesalahan saat mengambil produk:', error);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Validasi untuk harga dan stock
    if ((name === 'price' || name === 'stock') && value < 0) {
      alert(`${name.charAt(0).toUpperCase() + name.slice(1)} tidak boleh kurang dari 0!`);
      return; // Menghentikan perubahan state jika nilainya kurang dari 0
    }

    setProduct({
      ...product,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi sebelum submit
    if (product.price < 0 || product.stock < 0) {
      alert("Harga dan stock tidak boleh kurang dari 0!");
      return;
    }

    const updatedProduct = {
      name: product.name,
      price: product.price,
      stock: product.stock,
      status: product.status,
    };

    try {
      // Kirim permintaan PUT ke API v1
      const responseV1 = await fetch(`${apiUrlv1}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProduct),
      });

      if (!responseV1.ok) {
        alert('Gagal memperbarui produk di API v1');
        return;
      }

      // Kirim permintaan PUT ke API v2
      const responseV2 = await fetch(`${apiUrlv2}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProduct),
      });

      if (!responseV2.ok) {
        alert('Gagal memperbarui produk di API v2');
        return;
      }

      alert('Produk berhasil diperbarui di kedua API!');
      navigate('/'); // Redirect setelah sukses
    } catch (error) {
      console.error('Terjadi kesalahan saat memperbarui produk:', error);
    }
  };

  return (
    <div className="main">
      <div className="card">
        <h2>Edit Produk</h2>
        <br />
        <form onSubmit={handleSubmit}>
          <Input
            name="name"
            type="text"
            placeholder="Nama Produk..."
            label="Nama"
            value={product.name}
            onChange={handleChange}
          />
          <Input
            name="price"
            type="number"
            placeholder="Harga Produk..."
            label="Harga"
            value={product.price}
            onChange={handleChange}
            min="0" // Membatasi harga minimal 0
          />
          <Input
            name="stock"
            type="number"
            placeholder="Stock Produk..."
            label="Stock"
            value={product.stock}
            onChange={handleChange}
            min="0" // Membatasi stock minimal 0
          />
          <div className="form-group">
            <label>Status</label>
            <input
              type="checkbox"
              name="status"
              checked={product.status}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="btn btn-primary">Simpan</button>
        </form>
      </div>
    </div>
  );
};

export default Edit;
