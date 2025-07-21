import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import ProductGrid from './ProductGrid';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductDetails, fetchSimilarProducts } from '../../redux/slices/ProductSlice';
import { addToCart } from '../../redux/slices/cartSlice';

const ProductDetails = ({ productId }) => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [mainImage, setMainImage] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const { selectedProduct, loading, error, similarProducts } = useSelector((state) => state.products);
  const { userId, guestId } = useSelector((state) => state.auth);

  const productFetchId = productId || id;

  useEffect(() => {
    if (productFetchId) {
      dispatch(fetchProductDetails(productFetchId));
      dispatch(fetchSimilarProducts({ id: productFetchId }));
    }
  }, [dispatch, productFetchId]);

  useEffect(() => {
    if (selectedProduct?.images?.length) {
      setMainImage(selectedProduct.images[0].url || null);
    } else {
      setMainImage(null);
    }
  }, [selectedProduct]);

  const handleQuantityChange = (sign) => {
    setQuantity((prev) => Math.max(1, sign === 'plus' ? prev + 1 : prev - 1));
  };

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      toast.error('Please select size and color before adding to the cart.', { duration: 1000 });
      return;
    }

    setIsButtonDisabled(true);
    dispatch(
      addToCart({
        productId: productFetchId,
        quantity,
        size: selectedSize,
        color: selectedColor,
        guestId,
        userId,
      })
    )
      .then(() => {
        toast.success('Product added to cart!', { duration: 1000 });
      })
      .finally(() => {
        setIsButtonDisabled(false);
      });
  };

  if (loading) return <p className="text-center text-gray-500 py-10">Loading...</p>;
  if (error) return <p className="text-center text-red-500 py-10">Error: {error}</p>;
  if (!selectedProduct) return null;

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg">
        <div className="flex flex-col md:flex-row">
          {/* Left - Thumbnails */}
          <div className="hidden md:flex flex-col space-y-4 mr-6">
            {selectedProduct?.images?.map((image, index) => (
              image?.url && (
                <img
                  key={index}
                  src={image.url}
                  alt={image.altText || `Thumbnail ${index}`}
                  className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${
                    mainImage === image.url ? 'border-2 border-black' : 'border-gray-300'
                  }`}
                  onClick={() => setMainImage(image.url)}
                />
              )
            ))}
          </div>

          {/* Center - Main Image */}
          <div className="md:w-1/2">
            {mainImage ? (
              <img
                src={mainImage}
                alt="Main Product"
                className="w-full h-auto object-cover rounded-lg mb-4"
              />
            ) : (
              <div className="w-full h-[300px] bg-gray-200 rounded-lg mb-4 flex items-center justify-center text-gray-500">
                No Image Available
              </div>
            )}

            {/* Mobile thumbnails */}
            <div className="md:hidden flex overflow-x-scroll space-x-4 mt-4">
              {selectedProduct?.images?.map((image, index) => (
                image?.url && (
                  <img
                    key={index}
                    src={image.url}
                    alt={image.altText || `Thumbnail ${index}`}
                    className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${
                      mainImage === image.url ? 'border-2 border-black' : 'border-gray-300'
                    }`}
                    onClick={() => setMainImage(image.url)}
                  />
                )
              ))}
            </div>
          </div>

          {/* Right - Info */}
          <div className="md:w-1/2 md:ml-10">
            <h1 className="text-2xl md:text-3xl font-semibold mb-2">{selectedProduct.name}</h1>
            <p className="text-lg text-gray-600 line-through">${selectedProduct.originalPrice}</p>
            <p className="text-xl text-gray-800 mb-4">${selectedProduct.price}</p>
            <p className="text-gray-700 mb-6">{selectedProduct.description}</p>

            {/* Color selection */}
            <div className="mb-4">
              <p className="text-gray-700">Color:</p>
              <div className="flex gap-2 mt-2">
                {selectedProduct?.colors?.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full border ${
                      selectedColor === color ? 'border-4 border-black' : 'border-gray-600'
                    }`}
                    style={{
                      backgroundColor: color.toLowerCase(),
                      filter: 'brightness(0.5)',
                    }}
                  ></button>
                ))}
              </div>
            </div>

            {/* Size selection */}
            <div className="mb-4">
              <p className="text-gray-700">Size:</p>
              <div className="flex gap-2 mt-2">
                {selectedProduct?.sizes?.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded border ${
                      selectedSize === size ? 'bg-black text-white' : 'border-gray-600'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <p className="text-gray-700">Quantity:</p>
              <div className="flex items-center gap-4 mt-2">
                <button
                  onClick={() => handleQuantityChange('minus')}
                  className="px-3 py-1 bg-gray-200 rounded text-lg"
                >
                  -
                </button>
                <span className="text-lg">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange('plus')}
                  className="px-3 py-1 bg-gray-200 rounded text-lg"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={isButtonDisabled}
              className={`bg-black text-white py-2 px-6 rounded w-full ${
                isButtonDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-900'
              }`}
            >
              {isButtonDisabled ? 'Adding...' : 'ADD TO CART'}
            </button>

            {/* Product Characteristics */}
            <div className="mt-10 text-gray-700">
              <h3 className="text-xl font-bold mb-4">Characteristics:</h3>
              <table className="w-full text-sm">
                <tbody>
                  <tr>
                    <td className="py-1">Brand</td>
                    <td className="py-1">{selectedProduct.brand || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td className="py-1">Material</td>
                    <td className="py-1">{selectedProduct.material || 'N/A'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Similar Products */}
        <div className="mt-20">
          <h2 className="text-2xl text-center font-bold mb-4">You May Also Like</h2>
          <ProductGrid products={similarProducts} loading={loading} error={error} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
