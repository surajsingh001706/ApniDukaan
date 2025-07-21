import React from 'react';
import { RiDeleteBin3Line } from 'react-icons/ri';
import { useDispatch } from 'react-redux';
import { updateCartItemQuantity, removeFromCart } from '../../redux/slices/cartSlice';

const CartContent = ({ cart, userId, guestId }) => {
  const dispatch = useDispatch();

  // Increment or decrement quantity
 const handleAddToCart = (productId, delta, quantity, size, color) => {
  const newQuantity = quantity + delta;
  if (newQuantity >= 1) {
    dispatch(updateCartItemQuantity({
      productId,
      quantity: newQuantity,
      guestId,
      userId,
      size,
      color,
    }));
  }
};

  // Remove product from cart
 const handleRemoveFromCart = (productId, size, color) => {
  dispatch(removeFromCart({ productId, guestId, userId, size, color }));
};


  return (
    <div>
      {cart?.products?.length > 0 ? (
        cart.products.map((product, index) => (
          <div key={index} className='flex items-start justify-between py-4 border-b'>
            <div className='flex items-start'>
              <img
                src={product.image}
                alt={product.name}
                className='w-20 h-24 object-cover mr-4 rounded'
              />
              <div>
                <h3 className='font-semibold'>{product.name}</h3>
                <p className='text-sm text-gray-500'>
                  Size: {product.size} | Color: {product.color}
                </p>
                <div className='flex items-center mt-2'>
                  <button
                    onClick={() => handleAddToCart(product.productId, -1, product.quantity, product.size, product.color)}
                    className='px-3 py-1 text-xl font-semibold border rounded'
                  >
                    -
                  </button>
                  <span className='mx-4'>{product.quantity}</span>
                  <button
                    onClick={() => handleAddToCart(product.productId, 1, product.quantity, product.size, product.color)}
                    className='px-3 py-1 text-xl font-semibold border rounded'
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
            <div className='text-right'>
              <p className='font-medium text-lg'>$ {product.price.toLocaleString()}</p>
              <button
                onClick={() => handleRemoveFromCart(product.productId, product.size, product.color)}
              >
                <RiDeleteBin3Line className="h-6 w-6 mt-2 text-red-600 hover:text-red-800 transition" />
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500 py-8">Your cart is empty.</p>
      )}
    </div>
  );
};

export default CartContent;
