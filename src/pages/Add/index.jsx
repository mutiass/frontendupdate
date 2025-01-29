import React, { useState } from 'react';
import Input from '../../components/Input';
import './index.scss';

const apiUrlv1 = 'https://backendexpressmongo-7c1i.vercel.app/api/v1/products';
const apiUrlv2 = 'https://backendexpressmongo-7c1i.vercel.app/api/v2/products';

const Add = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [status, setStatus] = useState(true); // status default terceklis (true)

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newProduct = {
      name,
      price,
      stock,
      status,
    };

    try {
      // Mengirim data ke v1 dan v2 secara paralel
      const responses = await Promise.all([
        fetch(`${apiUrlv1}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newProduct)
        }),
        fetch(`${apiUrlv2}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newProduct)
        })
      ]);

      const [responseV1, responseV2] = responses;

      // Jika kedua API berhasil
      if (responseV1.ok && responseV2.ok) {
        alert('Produk berhasil ditambahkan ke v1 dan v2!');
        // Reset form setelah submit berhasil
        setName('');
        setPrice('');
        setStock('');
        setStatus(true);
      } else {
        alert('Gagal menambahkan produk ke salah satu API!');
        
        // Log error jika ada respons yang gagal
        if (!responseV1.ok) {
          console.error('Gagal di v1:', await responseV1.text());
        }
        if (!responseV2.ok) {
          console.error('Gagal di v2:', await responseV2.text());
        }
      }
    } catch (error) {
      console.error('Terjadi kesalahan saat menambah produk:', error);
    }
  };

  return (
    <div className="main">
      <div className="card">
        <h2>Tambah Produk</h2>
        <br />
        <form onSubmit={handleSubmit}>
          <Input
            name="name"
            type="text"
            placeholder="Nama Produk..."
            label="Nama"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            name="price"
            type="number"
            placeholder="Harga Produk..."
            label="Harga"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <Input
            name="stock"
            type="number"
            placeholder="Stock Produk..."
            label="Stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />
          <div className="form-group">
            <label>Status</label>
            <input
              type="checkbox"
              checked={status}
              onChange={() => setStatus(!status)}
            />
          </div>
          <button type="submit" className="btn btn-primary">Simpan</button>
        </form>
      </div>
    </div>
  );
}

export default Add;
