import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserOrders } from "../redux/slices/orderSlice";
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle } from 'lucide-react'; // optional icons

const MyOrderPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  const handleClick = (_id) => {
    navigate(`/order/${_id}`);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-6">My Orders</h2>
      <div className="relative shadow-md sm:rounded-lg overflow-x-auto">
        <table className="min-w-full text-left text-gray-500">
          <thead className="bg-gray-100 text-xs uppercase text-gray-700">
            <tr>
              <th className="py-2 px-4 sm:py-3">Image</th>
              <th className="py-2 px-4 sm:py-3">Order ID</th>
              <th className="py-2 px-4 sm:py-3">Created</th>
              <th className="py-2 px-4 sm:py-3">Shipping Address</th>
              <th className="py-2 px-4 sm:py-3">Items</th>
              <th className="py-2 px-4 sm:py-3 text-right">Price</th>
              <th className="py-2 px-4 sm:py-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => {
                const firstItem = order.orderItem?.[0];
                const address = order.shippingAdress;

                return (
                  <tr
                    key={order._id}
                    onClick={() => handleClick(order._id)}
                    className="border-b hover:bg-gray-50 cursor-pointer transition-all"
                  >
                    <td className="py-2 px-2 sm:py-4 sm:px-4">
                      {firstItem ? (
                        <img
                          src={firstItem.image}
                          alt={firstItem.name}
                          className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border"
                        />
                      ) : (
                        <span className="text-gray-400">No Image</span>
                      )}
                    </td>
                    <td className="py-2 px-2 sm:px-4 sm:py-4 font-medium text-gray-900 whitespace-nowrap">
                      #{order._id}
                    </td>
                    <td className="py-2 px-2 sm:px-4 sm:py-4">
                      {order.paidAt
                        ? new Date(order.paidAt).toLocaleDateString() +
                          " " +
                          new Date(order.paidAt).toLocaleTimeString()
                        : "N/A"}
                    </td>
                    <td className="py-2 px-2 sm:px-4 sm:py-4">
                      {address?.city && address?.country
                        ? `${address.city}, ${address.country}`
                        : "N/A"}
                    </td>
                    <td className="py-2 px-2 sm:px-4 sm:py-4">
                      {order.orderItem?.length ?? 0}
                    </td>
                    <td className="py-2 px-2 sm:px-4 sm:py-4 text-right whitespace-nowrap">
                      ${order.totalPrice?.toFixed(2)}
                    </td>
                    <td className="py-2 px-2 sm:px-4 sm:py-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                          order.isPaid
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {order.isPaid ? (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            Paid
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4" />
                            Unpaid
                          </>
                        )}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="py-4 px-4 text-center text-gray-500">
                  You have no orders
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyOrderPage;
