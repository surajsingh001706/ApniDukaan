import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchProductDetails, updateProduct } from '../../redux/slices/ProductSlice';
import axios from 'axios';

const EditProductPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { selectedProduct, loading, error } = useSelector((state) => state.products);

  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: 0,
    countInStock: 0,
    sku: '',
    sizes: [],
    colors: [],
    images: [],
  });

  const [uploading, setUploading] = useState(false);

  // Fetch product details on mount
  useEffect(() => {
    if (id) {
      dispatch(fetchProductDetails(id));
    }
  }, [dispatch, id]);

  // Sync Redux product to local form state
  useEffect(() => {
    if (selectedProduct && selectedProduct._id) {
      setProductData(selectedProduct);
    }
  }, [selectedProduct]);

  // Handle form field change
  const handleChange = (e) => {
    setProductData({ ...productData, [e.target.name]: e.target.value });
  };

  // Handle image upload
  const handleImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      setUploading(true);
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setProductData((prevData) => ({
        ...prevData,
        images: [...prevData.images, { url: data.imageUrl, altText: file.name }],
      }));
    } catch (error) {
      console.error('Image upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  // Submit updated product
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateProduct({ id, productData }));
    navigate('/admin/products');
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 shadow-md rounded-md">
      <h2 className="text-3xl font-bold mb-6">Edit Product</h2>
      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Product Name</label>
          <input
            type="text"
            name="name"
            value={productData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Description</label>
          <textarea
            name="description"
            value={productData.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            rows={4}
            required
          ></textarea>
        </div>

        {/* Price */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Price</label>
          <input
            type="number"
            name="price"
            value={productData.price}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        {/* Count in Stock */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Count in Stock</label>
          <input
            type="number"
            name="countInStock"
            value={productData.countInStock}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        {/* SKU */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">SKU</label>
          <input
            type="text"
            name="sku"
            value={productData.sku}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        {/* Sizes */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Sizes (comma-separated)</label>
          <input
            type="text"
            name="sizes"
            value={productData.sizes.join(',')}
            onChange={(e) =>
              setProductData({
                ...productData,
                sizes: e.target.value.split(',').map((s) => s.trim()),
              })
            }
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        {/* Colors */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Colors (comma-separated)</label>
          <input
            type="text"
            name="colors"
            value={productData.colors.join(',')}
            onChange={(e) =>
              setProductData({
                ...productData,
                colors: e.target.value.split(',').map((c) => c.trim()),
              })
            }
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        {/* Image Upload */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Upload Image</label>
          <input type="file" onChange={handleImage} />
          {uploading && <p className="text-sm text-blue-600 mt-2">Uploading image...</p>}
          <div className="flex gap-4 mt-4">
            {productData.images?.map((image, index) => (
              <div key={index}>
                <img
                  src={image.url}
                  alt={image.altText || 'Product Image'}
                  className="w-20 h-20 object-cover rounded-md shadow-md"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={uploading}
          className={`w-full py-2 rounded-md transition-colors ${
            uploading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          {uploading ? 'Uploading...' : 'Update Product'}
        </button>
      </form>
    </div>
  );
};

export default EditProductPage;
