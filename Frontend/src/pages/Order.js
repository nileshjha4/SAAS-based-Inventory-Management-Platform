import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // For getting the userId from the URL

function UserOrders() {
  const [orders, setOrders] = useState([]);
  const [expandedOrders, setExpandedOrders] = useState({}); // State to track expanded orders
  const { userId } = useParams(); // Get the userId from the route parameter

  useEffect(() => {
    fetchOrders();
  }, []);

  // Fetch Orders by User ID
  const fetchOrders = () => {
    fetch(`http://103.160.144.19:4000/api/orders/user/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        setOrders(data);
      })
      .catch((err) => console.log(err));
  };

  // Toggle item details visibility for an order
  const toggleOrderDetails = (orderId) => {
    setExpandedOrders((prevState) => ({
      ...prevState,
      [orderId]: !prevState[orderId],
    }));
  };

  return (
    <div className="col-span-12 lg:col-span-10 flex justify-center">
      <div className="flex flex-col gap-5 w-11/12">
        <div className="bg-white rounded p-3">
          <span className="font-semibold px-4">User Orders</span>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto rounded-lg border bg-white border-gray-200">
          <table className="min-w-full divide-y-2 divide-gray-200 text-sm">
            <thead>
              <tr>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">Order ID</th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">Status</th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">Item Details</th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">Total Amount</th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">Discount</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <React.Fragment key={order._id}>
                  <tr>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-900">{order._id}</td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">{order.status}</td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      <button
                        className="px-3 py-1 bg-blue-500 text-white rounded-lg"
                        onClick={() => toggleOrderDetails(order._id)}
                      >
                        {expandedOrders[order._id] ? "Hide Details" : "View Details"}
                      </button>
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      ₹{order.order.reduce((acc, item) => acc + parseFloat(item.sum_amt || 0), 0).toFixed(2)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      ₹{order.order.reduce((acc, item) => acc + parseFloat(item.discount_amt || 0), 0).toFixed(2)}
                    </td>
                  </tr>

                  {/* Expandable Item Details */}
                  {expandedOrders[order._id] && (
                    <tr>
                      <td colSpan={5} className="px-4 py-2">
                        <div className="flex flex-col gap-3">
                          {order.order.map((item, index) => (
                            <div
                              key={index}
                              className="flex justify-between items-center bg-gray-100 p-3 rounded-lg shadow-sm"
                            >
                              <div className="flex flex-col">
                                <span className="font-semibold text-gray-800">Item ID: {item.item_id}</span>
                                <span className="text-gray-600">Quantity: {item.qty || "N/A"}</span>
                                <span className="text-gray-600">Price: ₹{item.sum_amt || "N/A"}</span>
                              </div>
                              <div className="flex flex-col items-end">
                                <span className="font-semibold text-gray-800">
                                  Discount: ₹{item.discount_amt || "N/A"}
                                </span>
                                <span className="text-gray-600">
                                  Discount Percentage: {item.discount_percentage || "N/A"}%
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default UserOrders;
