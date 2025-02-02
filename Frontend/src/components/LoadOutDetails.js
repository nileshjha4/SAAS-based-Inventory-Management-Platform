import React, { useState, useMemo, useCallback } from 'react';
import { Trash, Check, AlertTriangle } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DeleteLoadout } from '../logic/delete-loadout';
import { AssignAgent } from '../logic/assign-agent';
import { toast } from 'sonner';

const LoadOutDetails = ({ loadout, agents }) => {
    const queryClient = useQueryClient();
    const [availabilityState, setAvailabilityState] = useState({});
    const [dispatch, setDispatch] = useState(false);
    const [selectedAgent, setSelectedAgent] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Memoized availability check to prevent unnecessary recalculations
    const availabilityAnalysis = useMemo(() => {
        const analysis = {};
        loadout?.order_id?.forEach((order) => {
            order?.order?.forEach((ord, index) => {
                const inventoryShortage = ord?.qty - ord?.item_id?.qty;
                analysis[`${order._id}-${index}`] = inventoryShortage > 0 
                    ? {
                        status: 'red',
                        message: `Inventory shortage: ${inventoryShortage} units`,
                        shortage: inventoryShortage
                    }
                    : {
                        status: 'green',
                        message: '',
                        shortage: 0
                    };
            });
        });
        return analysis;
    }, [loadout]);

    // Delete Loadout Mutation
    const { mutateAsync: deleteLoadout } = useMutation({
        mutationFn: DeleteLoadout,
        onSuccess: (data) => {
            if (data?.success) {
                queryClient.invalidateQueries(["loadoutName", "orders"]);
                toast.success('Order removed successfully');
            } else {
                toast.error('Failed to remove order');
            }
        },
        onError: (error) => {
            toast.error(`Error removing order: ${error.message}`);
        }
    });

    // Assign Agent Mutation
    const { mutateAsync: assignAgent } = useMutation({
        mutationFn: AssignAgent,
        onSuccess: (data) => {
            if (data?.success) {
                queryClient.invalidateQueries(["loadoutName"]);
                toast.success('Agent assigned successfully');
                setDispatch(false);
                setSelectedAgent('');
            } else {
                toast.error('Failed to assign agent');
            }
        },
        onError: (error) => {
            toast.error(`Error assigning agent: ${error.message}`);
        }
    });

    // Handles checking item availability
    const handleCheckAvailability = useCallback(() => {
        const allGreen = Object.values(availabilityAnalysis).every(
            (state) => state.status === 'green'
        );
        setAvailabilityState(availabilityAnalysis);
        setDispatch(allGreen);

        if (!allGreen) {
            toast.warning('Some items have inventory shortages');
        }
    }, [availabilityAnalysis]);

    // Handles ignoring inventory shortage
    const handleIgnore = useCallback((orderId, index) => {
        setAvailabilityState(prevState => {
            const newState = {
                ...prevState,
                [`${orderId}-${index}`]: {
                    status: 'green',
                    message: 'Shortage ignored',
                },
            };
    
            const allGreen = Object.values(newState).every(
                (state) => state.status === 'green'
            );
            setDispatch(allGreen);
    
            return newState; 
        });
    }, []);

    // Handle order removal
    const handleRemoveOrder = useCallback(async (loadoutId, orderId) => {
        setIsLoading(true);
        try {
            await deleteLoadout({ loadout_id: loadoutId, order_id: orderId });
        } catch (error) {
            console.error('Order removal error:', error);
        } finally {
            setIsLoading(false);
        }
    }, [deleteLoadout]);

    // Handle agent assignment
    const handleDispatch = useCallback(async () => {
        if (!selectedAgent) {
            toast.error('Please select an agent');
            return;
        }

        setIsLoading(true);
        try {
            await assignAgent({
                agent_id: selectedAgent,
                loadout_id: loadout?._id
            });
        } catch (error) {
            console.error('Dispatch error:', error);
        } finally {
            setIsLoading(false);
        }
    }, [selectedAgent, loadout, assignAgent]);

    // Render order details
    const renderOrderDetails = (order, orderIndex) => {
        return order?.order?.map((ord, index) => {
            const availability = availabilityState[`${order._id}-${index}`] || 
                                 availabilityAnalysis[`${order._id}-${index}`];
            const bgColor = availability?.status || 'gray';

            return (
                <div
                    key={index}
                    className={`p-4 rounded-lg shadow-sm transition-colors bg-${bgColor}-100 relative`}
                >
                    {availability?.status === 'red' && (
                        <div className="absolute top-2 right-2 text-red-500">
                            <AlertTriangle size={20} />
                        </div>
                    )}
                    <div className="grid grid-cols-2 gap-2">
                        <div className="text-gray-600 font-medium">Product</div>
                        <div>{ord?.item_id?.item}</div>

                        <div className="text-gray-600 font-medium">Company</div>
                        <div>{ord?.item_id?.company}</div>

                        <div className="text-gray-600 font-medium">Flavour</div>
                        <div>{ord?.item_id?.flavour}</div>

                        <div className="text-gray-600 font-medium">Quantity</div>
                        <div>{ord?.qty}</div>

                        <div className="text-gray-600 font-medium">Amount</div>
                        <div>{ord?.sum_amt}</div>

                        <div className="text-gray-600 font-medium">Discount</div>
                        <div>{ord?.discount_amt}</div>
                    </div>
                    {availability?.status === 'red' && (
                        <div className="mt-2 text-red-500 text-sm flex items-center justify-between">
                            <span>{availability.message}</span>
                            <button
                                onClick={() => handleIgnore(order._id, index)}
                                className="ml-4 px-2 py-1 bg-blue-500 text-white rounded-lg 
                                           hover:bg-blue-600 transition duration-200"
                            >
                                Ignore
                            </button>
                        </div>
                    )}
                </div>
            );
        });
    };

    return (
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-6 pb-3 border-b-2 border-gray-200">
                Order Details
            </h1>

            {loadout?.order_id?.map((order, orderIndex) => (
                <div 
                    key={order?._id} 
                    className="border-b last:border-b-0 py-6 space-y-4"
                >
                    <div className="grid md:grid-cols-2 gap-4">
                        {renderOrderDetails(order, orderIndex)}
                    </div>
                    
                    <div className="mt-4 flex justify-end">
                        <button
                            className="flex items-center gap-2 px-4 py-2 
                                       bg-red-500 text-white font-semibold 
                                       rounded-lg hover:bg-red-600 
                                       transition duration-200 
                                       disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Remove Order"
                            disabled={isLoading}
                            onClick={() => handleRemoveOrder(loadout?._id, order?._id)}
                        >
                            <Trash size={18} />
                            Remove Order
                        </button>
                    </div>
                </div>
            ))}

            <div className="mt-6 space-y-4">
                <button
                    className="w-full flex items-center justify-center gap-2 
                               px-4 py-3 bg-green-500 text-white 
                               font-semibold rounded-lg 
                               hover:bg-green-600 transition duration-200
                               disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Check availability"
                    onClick={handleCheckAvailability}
                    disabled={isLoading}
                >
                    <Check size={18} />
                    Check Availability
                </button>

                {dispatch && (
                    <div className="w-full bg-blue-50 p-6 rounded-lg">
                        {agents?.length > 0 ? (
                            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                                <div className="flex-grow">
                                    <select
                                        className="w-full px-4 py-3 border border-gray-300 
                                                   rounded-lg bg-white text-gray-700 
                                                   focus:outline-none focus:ring-2 
                                                   focus:ring-blue-500 focus:border-transparent"
                                        value={selectedAgent}
                                        onChange={(e) => setSelectedAgent(e.target.value)}
                                        aria-label="Select agent"
                                    >
                                        <option value="">Select an agent</option>
                                        {agents?.map((agent) => (
                                            <option 
                                                key={agent?._id} 
                                                value={agent?._id}
                                            >
                                                {agent?.agentname}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <button
                                    className="w-full md:w-auto px-4 py-3 
                                               bg-blue-500 text-white font-semibold 
                                               rounded-lg hover:bg-blue-600 
                                               disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={handleDispatch}
                                    disabled={!selectedAgent || isLoading}
                                >
                                    Dispatch
                                </button>
                            </div>
                        ) : (
                            <p className="text-red-500 font-semibold text-center">
                                No agents currently available
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LoadOutDetails;