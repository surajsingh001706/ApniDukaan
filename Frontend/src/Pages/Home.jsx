// ✅ 1. Home.jsx
import React, { useEffect, useState } from 'react';
import Hero from '../Components/Layout/Hero';
import GenderCollections from '../Components/Products/GenderCollections';
import NewArrival from '../Components/Products/NewArrival';
import ProductDetails from '../Components/Products/ProductDetails';
import ProductGrid from '../Components/Products/ProductGrid';
import FeatureCollection from '../Components/Products/FeatureCollection';
import FeatureSection from '../Components/Products/FeatureSection';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductsByFilter } from '../redux/slices/ProductSlice';
import axios from 'axios';

const Home = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const [bestSellerProduct, setBestSellerProduct] = useState(null);

  useEffect(() => {
    // Fetch top wears for women
    dispatch(fetchProductsByFilter({
      gender: 'Women',
      category: 'Bottom Wear',
      limit: 8,
    }));

    // Fetch best seller product
    const fetchBestSeller = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/best-seller`);
        setBestSellerProduct(data);
      } catch (err) {
        console.error('Failed to fetch best seller product:', err.message);
      }
    };

    fetchBestSeller();
  }, [dispatch]);

  return (
    <div>
      <Hero />
      <GenderCollections />
      <NewArrival />

      {/* Best Seller Section */}
      <section className='my-8'>
        <h2 className='text-3xl text-center font-bold mb-4'>Best Seller</h2>
        {bestSellerProduct ? (
          <ProductDetails productId={bestSellerProduct._id} />
        ) : (
          <p className='text-center text-gray-500'>Loading best seller product...</p>
        )}
      </section>

      {/* Top Wears Section */}
      <section className='container mx-auto my-8'>
        <h2 className='text-3xl text-center font-bold mb-4'>Top Wears for Women</h2>
        <ProductGrid products={products} loading={loading} error={error} />
      </section>

      <FeatureCollection />
      <FeatureSection />
    </div>
  );
};

export default Home;
