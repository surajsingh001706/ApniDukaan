import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllOrders, updateOrderStatus } from '../../redux/slices/adminOrderSlice';
import { useNavigate } from 'react-router-dom';

const OrderManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { orders, loading, error } = useSelector((state) => state.adminOrders);

  useEffect(() => {
    if (!user) return; // wait for user to be loaded
    if (user.role !== 'admin') {
      navigate('/');
    } else {
      dispatch(fetchAllOrders());
    }
  }, [user, dispatch, navigate]);

  const handleStatusChange = (orderId, status) => {
    dispatch(updateOrderStatus({ id: orderId, status }));
  };

  if (loading) return <p className="text-center py-10">Loading...</p>;
  if (error) return <p className="text-center text-red-500 py-10">Error: {error}</p>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Order Management</h2>
      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="min-w-full text-left text-gray-700">
          <thead className="text-xs font-semibold uppercase bg-gray-100">
            <tr>
              <th className="p-3">Order ID</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Total Price</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order._id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium text-gray-900 whitespace-nowrap">
                    #{order._id.slice(-6).toUpperCase()}
                  </td>
                  <td className="p-3">{order.user?.name || 'Guest User'}</td>
                  <td className="p-3">${order.totalPrice.toFixed(2)}</td>
                  <td className="p-3">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      disabled={loading}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block p-2"
                    >
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="p-3">
                    {order.status !== 'Delivered' && (
                      <button
                        onClick={() => handleStatusChange(order._id, 'Delivered')}
                        disabled={loading}
                        className="bg-green-500 hover:bg-green-700 text-white py-1 px-3 rounded disabled:opacity-50"
                      >
                        Mark as Delivered
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-6 text-center text-gray-500">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderManagement;
