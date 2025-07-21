import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { fetchOrderDetails } from '../redux/slices/orderSlice';

const OrderDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { orderDetails, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrderDetails(id));
  }, [dispatch, id]);

  if (loading) return <p className="text-center mt-8">Loading...</p>;
  if (error) return <p className="text-red-500 text-center mt-8">Error: {error}</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <h2 className="text-3xl font-bold mb-6">Order Details</h2>

      {!orderDetails ? (
        <p className="text-gray-600">No Order details found</p>
      ) : (
        <div className="p-6 bg-white rounded-lg shadow-md border border-gray-200">
          {/* Top Order Info */}
          <div className="flex flex-col sm:flex-row justify-between mb-8">
            <div>
              <h3 className="text-lg font-semibold">Order ID: {orderDetails._id}</h3>
              <p className="text-gray-500">
                {new Date(orderDetails.paidAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex flex-col items-start sm:items-end gap-2 mt-4 sm:mt-0">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  orderDetails.isPaid
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {orderDetails.isPaid ? 'Approved' : 'Pending'}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  orderDetails.isDelivered
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}
              >
                {orderDetails.isDelivered ? 'Delivered' : 'In Transit'}
              </span>
            </div>
          </div>

          {/* Payment & Shipping Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div>
              <h4 className="text-lg font-semibold mb-2">Payment Info</h4>
              <p className="text-gray-700">Method: {orderDetails.paymentMethod}</p>
              <p className="text-gray-700">
                Status: {orderDetails.isPaid ? 'Paid' : 'Unpaid'}
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-2">Shipping Info</h4>
              <p className="text-gray-700">Method: {orderDetails.shippingMethod}</p>
              <p className="text-gray-700">
                Address: {orderDetails.shippingAdress?.city},{' '}
                {orderDetails.shippingAdress?.country}
              </p>
            </div>
          </div>

          {/* Product List */}
          <div className="overflow-x-auto mb-8">
            <h4 className="text-lg font-semibold mb-4">Ordered Products</h4>
            <table className="min-w-full border border-gray-200 rounded-md overflow-hidden">
              <thead className="bg-gray-100 text-sm text-left text-gray-700">
                <tr>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3 text-center">Unit Price</th>
                  <th className="px-4 py-3 text-center">Quantity</th>
                  <th className="px-4 py-3 text-center">Total</th>
                </tr>
              </thead>
              <tbody className="text-gray-800 text-sm bg-white">
                {orderDetails.orderItem?.map((item) => (
                  <tr key={item.productId} className="border-t">
                    <td className="px-4 py-3 flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 rounded-md object-cover border"
                      />
                      <Link
                        to={`/product/${item.productId}`}
                        className="text-blue-600 hover:underline"
                      >
                        {item.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-center">${item.price.toFixed(2)}</td>
                    <td className="px-4 py-3 text-center">{item.quantity}</td>
                    <td className="px-4 py-3 text-center">
                      ${(item.price * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Back Link */}
          <div className="text-center">
            <Link
              to="/my-orders"
              className="inline-block text-blue-600 font-medium hover:underline"
            >
              &larr; Back to My Orders
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetailsPage;
