import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { GetDispatch } from "../logic/get-dispatch";
import { ChevronDown, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { SettleDispatch } from '../logic/settle-dispatch';
import { GeneratePreBillInvoice } from '../logic/generate-pre-bill-invoice';

const Dispatch = () => {
  const queryClient = useQueryClient()  
  const [returnQuantities, setReturnQuantities] = useState({});
  const [expandedOrders, setExpandedOrders] = useState({});
  const [updateInventoryQuantity, setUpdateInventoryQuantity] = useState({})

  const { data: loadoutData, isLoading: isLoadingLoadoutData } = useQuery({
    queryFn: () => GetDispatch(),
    queryKey: ["dispatch"],
  });

  const handleReturnQuantityChange = (orderId, itemId, value) => {
    if (value) {
      // Case 1: Remove key if value is 0
      if (value === 0) {
        setReturnQuantities((prevQty) => {
          const { [`${orderId}-${itemId}`]: _, ...rest } = prevQty; 
          return rest; 
        });
        setUpdateInventoryQuantity((prev) => {
          const updatedOrder = { ...prev[orderId] };
          delete updatedOrder[itemId]; 
          if (Object.keys(updatedOrder).length === 0) {
            const { [orderId]: _, ...rest } = prev;
            return rest;
          }
          return { ...prev, [orderId]: updatedOrder };
        });
        return;
      }
  
      setReturnQuantities((prev) => ({
        ...prev,
        [`${orderId}-${itemId}`]: value,
      }));
      setUpdateInventoryQuantity((prev) => ({
        ...prev,
        [orderId]: {
          ...prev[orderId],
          [itemId]: value,
        },
      }));
    }
  };  

  const { mutateAsync: settleDispatch } = useMutation({
    mutationFn: (id)=>SettleDispatch(id, updateInventoryQuantity),
    onSuccess: (data) => {
        if (data?.success) {
            queryClient.invalidateQueries(["dispatch"]);
            toast.success('Dispatch settled successfully');
        } else {
            toast.error('Failed to remove order');
        }
    },
    onError: (error) => {
        toast.error(`Error removing order: ${error.message}`);
    }
});

  const handleSubmitReturn = async(id) => {
    await settleDispatch(id);
  };

  const toggleOrderExpand = (orderId) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  const { mutateAsync: generatePreBillInvoice } = useMutation({
    mutationFn: (id) => GeneratePreBillInvoice(id),
    onSuccess: (data) => {
      if (data?.success) {
        console.log("PDF download started");
        const pdfLink = data?.data?.link;
        const link = document.createElement('a');
        link.href = pdfLink;
        link.download = pdfLink.split('/').pop(); 
        document.body.appendChild(link); 
        link.click(); 
        document.body.removeChild(link);
      }
    },
  });

  if (isLoadingLoadoutData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
  {loadoutData?.dispatch?.map((entry, index) => (
    <div
      key={index}
      className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200"
    >
      {/* Loadout Header */}
      <div className="flex items-center justify-between p-4 bg-gray-100 border-b">
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            Loadout: {entry?.loadout_id?.name}
          </h2>
          <p>
            <strong>Agent Name:</strong> {entry?.agent_id?.agentname}
          </p>
        </div>
        <button className='text-blue-500 underline italic'
        onClick={async()=>{
          await generatePreBillInvoice(entry?._id)
        }}
        >
          generate pre bill invoice
        </button>
        <button
          onClick={() => toggleOrderExpand(entry.loadout_id._id)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 transition"
        >
          {expandedOrders[entry.loadout_id._id] ? (
            <ChevronDown className="text-white" />
          ) : (
            <ChevronRight className="text-white" />
          )}
          <span>{expandedOrders[entry.loadout_id._id] ? "Collapse" : "Expand"}</span>
        </button>
      </div>

      {/* Expanded Loadout Details */}
      {expandedOrders[entry.loadout_id._id] && (
        <div className="p-4">
          {entry?.loadout_id?.order_id?.map((order, orderIndex) => (
            <div
              key={orderIndex}
              className="mb-6 border rounded-lg overflow-hidden shadow-sm"
            >
              {/* Order Header */}
              <div className="p-4 bg-gray-50 border-b">
                <h2 className="text-lg font-bold text-gray-800">
                  Order - {new Date(order?.createdAt).toLocaleString()}
                </h2>
              </div>

              {/* Items */}
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {order?.order?.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="bg-gray-50 p-4 rounded-lg shadow-sm"
                  >
                    <p>
                      <strong>Item Name:</strong> {item?.item_id?.item}
                    </p>
                    <p>
                      <strong>Company:</strong> {item?.item_id?.company}
                    </p>
                    <p>
                      <strong>Flavour:</strong> {item?.item_id?.flavour}
                    </p>
                    <p>
                      <strong>Quantity:</strong> {item?.qty}
                    </p>
                    <div className="mt-2">
                      <input
                        type="number"
                        placeholder="Return Quantity"
                        min="0"
                        max={item?.qty}
                        className="form-input block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        value={
                          returnQuantities[
                            `${order._id}-${item.item_id._id}`
                          ] || ""
                        }
                        onChange={(e) =>
                          handleReturnQuantityChange(
                            order._id,
                            item.item_id._id,
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Settle Button */}
          <div className="flex justify-end mt-4">
            <button
              onClick={() => handleSubmitReturn(entry?._id)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105"
            >
              Settle Returns
            </button>
          </div>
        </div>
      )}
    </div>
  ))}
</div>
  )
};

export default Dispatch;