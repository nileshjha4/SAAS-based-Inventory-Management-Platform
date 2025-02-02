import React, { useMemo } from "react";
import { ChevronDown, ChevronUp, Package, ShoppingCart, Tag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const OrderTable = ({
    ordersData,
    expandedOrders,
    selectedOrders,
    toggleOrderDetails,
    handleCheckboxChange
}) => {
    console.log(ordersData)
    const orderSummary = useMemo(() => {
        if (!Array.isArray(ordersData?.orders)) return null;

        return ordersData.orders.map(order => ({
            ...order,
            totalAmount: order?.order?.reduce(
                (acc, item) => acc + parseFloat(item?.sum_amt || 0),
                0
            ),
            totalDiscount: order?.order?.reduce(
                (acc, item) => acc + parseFloat(item?.discount_amt || 0),
                0
            )
        }));
    }, [ordersData]);

    const renderOrderItemDetails = (item, index) => (
        <motion.div
            key={index}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex justify-between items-center bg-gray-50 p-4 rounded-xl shadow-sm border border-gray-200 hover:bg-gray-100 transition-colors"
        >
            <div className="flex items-center space-x-4">
                <Package className="text-blue-500" size={24} />
                <div>
                    <p className="font-semibold text-gray-800 flex items-center gap-2">
                        <span>Product:</span>
                        <span className="text-blue-600">{item?.item_id?.item || "N/A"}</span>
                        <span className="text-blue-600">{item?.item_id?.flavour || "N/A"}</span>
                    </p>
                    <p className="text-gray-600 flex items-center gap-2">
                        <ShoppingCart size={16} className="text-green-500" />
                        Quantity: {item.qty || "N/A"}
                    </p>
                    <p className="text-gray-600 flex items-center gap-2">
                        <Tag size={16} className="text-purple-500" />
                        Price: ₹{parseFloat(item.sum_amt || 0).toFixed(2)}
                    </p>
                    <p className="font-semibold text-gray-800 flex items-center gap-2">
                    <span>Discount:</span>
                    <span className="text-red-600">₹{parseFloat(item.discount_amt || 0).toFixed(2)}</span>
                </p>
                <p className="text-gray-600">
                    Discount Percentage: {parseFloat(item.discount_percentage || 0).toFixed(2)}%
                </p>
                </div>
            </div>
        </motion.div>
    );

    // Render table rows with advanced features
    const renderOrderRows = () => {
        if (!orderSummary || orderSummary.length === 0) {
            return (
                <tr>
                    <td colSpan={5} className="px-4 py-6 text-center">
                        <div className="flex flex-col items-center justify-center space-y-4">
                            <ShoppingCart size={48} className="text-gray-400" />
                            <p className="text-gray-600 text-lg">No orders found</p>
                        </div>
                    </td>
                </tr>
            );
        }

        return orderSummary.map((order) => {
            const isSelected = selectedOrders?.includes(order?._id);
            
            return (
                <React.Fragment key={order?._id}>
                    <motion.tr
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className={`
                            ${isSelected ? "bg-blue-50" : ""}
                            hover:bg-gray-50 transition-colors duration-200
                            group cursor-pointer
                        `}
                    >
                        <td className="whitespace-nowrap px-4 py-3 text-gray-900">
                            <input
                                type="checkbox"
                                className="w-5 h-5 cursor-pointer 
                                           focus:ring-2 focus:ring-blue-500 
                                           text-blue-600 border-gray-300 rounded"
                                checked={isSelected}
                                onChange={() => handleCheckboxChange(order._id)}
                                aria-label={`Select order ${order._id}`}
                            />
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-gray-900">
                            <span className="font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
                                {order?._id}
                            </span>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                            <button
                                className="flex items-center gap-2 px-3 py-1.5 
                                           bg-blue-500 text-white rounded-lg 
                                           hover:bg-blue-600 transition-colors 
                                           focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onClick={() => toggleOrderDetails(order?._id)}
                                aria-expanded={expandedOrders[order?._id]}
                            >
                                {expandedOrders[order?._id] ? (
                                    <ChevronUp size={16} />
                                ) : (
                                    <ChevronDown size={16} />
                                )}
                                {expandedOrders[order?._id] ? "Hide" : "View"} Details
                            </button>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-gray-700 font-semibold">
                            ₹{order?.totalAmount?.toFixed(2)}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-blue-500 underline italic">
                            {order?.user_id?.shopname}
                        </td>
                    </motion.tr>

                    {/* Expandable Item Details with Framer Motion */}
                    <AnimatePresence>
                        {expandedOrders[order?._id] && (
                            <tr>
                                <td colSpan={5} className="px-4 py-4 bg-white">
                                    <motion.div 
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
                                    >
                                        {order?.order?.map(renderOrderItemDetails)}
                                    </motion.div>
                                </td>
                            </tr>
                        )}
                    </AnimatePresence>
                </React.Fragment>
            );
        });
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            {[
                                "Select", 
                                "Order ID", 
                                "Item Details", 
                                "Total Amount", 
                                "Shop Name"
                            ].map((header) => (
                                <th 
                                    key={header}
                                    className="whitespace-nowrap px-4 py-3 
                                               text-left text-xs font-medium 
                                               text-gray-500 uppercase tracking-wider"
                                >
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody className="bg-white divide-y divide-gray-200">
                        {renderOrderRows()}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default React.memo(OrderTable);