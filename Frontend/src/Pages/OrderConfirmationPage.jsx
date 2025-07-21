import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearCart } from '../redux/slices/cartSlice';

const OrderConfirmationPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { checkout } = useSelector((state) => state.checkout);

  // Clear the cart once order is confirmed
  useEffect(() => {
    if (checkout && checkout._id) {
      dispatch(clearCart());
      localStorage.removeItem("cart");
    } else {
      navigate("/my-orders");
    }
  }, [checkout, dispatch, navigate]);

  const calculateEstimatedDelivery = (createdAt) => {
    const orderDate = new Date(createdAt);
    orderDate.setDate(orderDate.getDate() + 10);
    return orderDate.toLocaleDateString();
  };

  if (!checkout) {
    return (
      <div className='text-center py-10'>
        <p className='text-lg text-gray-600'>No order found.</p>
      </div>
    );
  }

  return (
    <div className='max-w-4xl mx-auto p-6 bg-white'>
      <h1 className='text-4xl font-bold text-center text-emerald-700 mb-8'>
        Thank you for your Order!
      </h1>

      {checkout && checkout._id && (
        <div className='p-6 rounded-lg border'>
          {/* Order Info */}
          <div className='flex justify-between mb-20'>
            <div>
              <h2 className='text-xl font-semibold'>Order ID: {checkout._id}</h2>
              <p className='text-gray-500'>
                Order Date: {new Date(checkout.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className='text-sm text-emerald-700'>
                Estimated Delivery: {calculateEstimatedDelivery(checkout.createdAt)}
              </p>
            </div>
          </div>

          {/* Ordered Items */}
          <div className='mb-20'>
            {Array.isArray(checkout.checkoutItem) &&
              checkout.checkoutItem.map((items) => (
                <div key={items.productId} className='flex items-center mb-4'>
                  <img
                    src={items.image || '/placeholder.png'}
                    alt={items.name}
                    onError={(e) => {
                      e.target.src = '/placeholder.png';
                    }}
                    className='w-16 h-16 object-cover rounded-md mr-4'
                  />
                  <div>
                    <h4 className='text-md font-semibold'>{items.name}</h4>
                    {(items.color || items.size) && (
                      <p className='text-sm text-gray-500'>
                        {[items.color, items.size].filter(Boolean).join(' | ')}
                      </p>
                    )}
                  </div>
                  <div className='ml-auto text-right'>
                    <p className='text-md'>${items.price}</p>
                    <p className='text-sm text-gray-500'>Qty: {items.quantity}</p>
                  </div>
                </div>
              ))}
          </div>

          {/* Payment & Delivery Info */}
          <div className='grid grid-cols-2 gap-8'>
            <div>
              <h4 className='text-lg font-semibold mb-2'>Payment</h4>
              <p className='text-gray-700'>PayPal</p>
            </div>
            <div>
              <h4 className='text-lg font-semibold mb-2'>Delivery</h4>
              <p className='text-gray-600'>{checkout.shippingAdress?.address}</p>
              <p className='text-gray-600'>{checkout.shippingAdress?.city}</p>
              <p className='text-gray-600'>{checkout.shippingAdress?.country}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderConfirmationPage;
