import React from 'react';
import { IoMdClose } from 'react-icons/io';
import CartContent from '../Cart/CartContent';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const CartDrawer = ({ drawerOpen, toggleCartdrawer }) => {
  const navigate = useNavigate();
  const { user, guestId } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);
  const userId = user?user._id : null;

  const handleCheckout = () => {
    toggleCartdrawer();
    navigate(user ? "/checkout" : "/login?redirect=checkout");
  };

  return (
    <div
      className={`fixed top-0 right-0 w-3/4 sm:w-1/2 md:w-[25rem] h-full bg-white shadow-lg transform transition-transform duration-300 flex flex-col z-50 ${
        drawerOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      {/* Close Button */}
      <div className='flex justify-end p-4'>
        <button onClick={toggleCartdrawer} aria-label="Close Cart">
          <IoMdClose className='h-6 w-6 text-gray-600 hover:text-black transition' />
        </button>
      </div>

      {/* Cart Content Area */}
      <div className='flex-grow p-4 overflow-y-auto'>
        <h2 className='text-xl font-semibold mb-4'>Your Cart</h2>
        {cart?.products?.length > 0 ? (
          <CartContent cart={cart} userId={userId} guestId={guestId} />
        ) : (
          <p className="text-gray-500 text-sm">Your cart is empty.</p>
        )}
      </div>

      {/* Checkout Button */}
      <div className='p-4 bg-white sticky bottom-0 border-t'>
        {cart?.products?.length > 0 && (
          <>
            <button
              onClick={handleCheckout}
              className='w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition'
            >
              Checkout
            </button>
            <p className='text-xs tracking-tight text-gray-500 mt-2 text-center'>
              Shipping, taxes and discount codes calculated at checkout.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
