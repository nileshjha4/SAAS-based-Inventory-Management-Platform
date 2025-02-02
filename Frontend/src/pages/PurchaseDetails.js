import React, { useState, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Package, Loader2 } from "lucide-react";
import { GetOrders } from "../logic/get-order";
import OrderTable from "../components/OrderTable";
import OrderHeader from "../components/OrderHeader";
import { toast } from "sonner";
import OrderFilter from "../components/OrderFilter";
import { useLocation } from "react-router-dom";

const PurchaseDetails = () => {
    const [expandedOrders, setExpandedOrders] = useState({});
    const [selectedOrders, setSelectedOrders] = useState([]);
    const location = useLocation()
    const { shopname = '', id = '' } = location.state || {};
    const [filters, setFilters] = useState({
        startDate: "",
        endDate: "",
        shopname: shopname,
        userId: id,
    });

    // Update filters state when date inputs change
    const handleDateChange = (e) => {
        const { name, value } = e.target;
        console.log(name)
        console.log(value)
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,
        }));
    };

    // Fetch orders with error handling and loading state
    const {
        data: ordersData,
        isLoading: isLoadingOrdersData,
        isError,
        error,
    } = useQuery({
        queryFn: () => GetOrders(filters),
        queryKey: ["orders", filters],
        onError: (error) => {
            toast.error("Failed to fetch orders", {
                description: error.message,
            });
        },
        retry: 2,
    });

    // Memoized toggle order details to prevent unnecessary re-renders
    const toggleOrderDetails = useCallback((orderId) => {
        setExpandedOrders((prevState) => ({
            ...prevState,
            [orderId]: !prevState[orderId],
        }));
    }, []);

    // Memoized checkbox handler with improved logic
    const handleCheckboxChange = useCallback((orderId) => {
        setSelectedOrders((prevState) =>
            prevState.includes(orderId)
                ? prevState.filter((id) => id !== orderId)
                : [...prevState, orderId]
        );
    }, []);

    // Loading state component
    if (isLoadingOrdersData) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center">
                    <Loader2
                        className="mx-auto mb-4 animate-spin text-blue-500"
                        size={48}
                    />
                    <p className="text-gray-600">Loading orders...</p>
                </div>
            </div>
        );
    }

    // Error state component
    if (isError) {
        return (
            <div className="flex justify-center items-center h-screen bg-red-50">
                <div className="text-center">
                    <Package
                        className="mx-auto mb-4 text-red-500"
                        size={48}
                    />
                    <h2 className="text-xl font-semibold text-red-700 mb-2">
                        Failed to Load Orders
                    </h2>
                    <p className="text-red-600">
                        {error?.message || "An unexpected error occurred"}
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    // Empty state when no orders
    if (!ordersData?.orders?.length) {
        return (
            <>
            <OrderFilter filters={filters} handleDateChange={handleDateChange} setFilters={setFilters} />
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="text-center">
                    <Package
                        className="mx-auto mb-4 text-gray-400"
                        size={48}
                    />
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">
                        No Orders Found
                    </h2>
                    <p className="text-gray-600">
                        You don't have any orders at the moment.
                    </p>
                </div>
            </div>
            </>
        );
    }

    return (
        <div className="container mx-auto px-4 space-y-6 w-full">
            {/* Filters Section */}
            <OrderFilter filters={filters} handleDateChange={handleDateChange} setFilters={setFilters} />

            <div className="space-y-4 w-full">
                <OrderHeader selectedOrders={selectedOrders} />

                <OrderTable
                    ordersData={ordersData}
                    expandedOrders={expandedOrders}
                    selectedOrders={selectedOrders}
                    toggleOrderDetails={toggleOrderDetails}
                    handleCheckboxChange={handleCheckboxChange}
                />
            </div>
        </div>
    );
};

export default PurchaseDetails;