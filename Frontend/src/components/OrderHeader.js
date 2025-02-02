import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { GetLoadoutName } from "../logic/get-loadout-name";
import { UpdateLoadout } from "../logic/update-loadout";
import { ChevronDown, Plus, Check, Loader2 } from "lucide-react";

const OrderHeader = ({ selectedOrders }) => {
  const queryClient = useQueryClient();
  const { data: loadoutName, isLoading: isLoadingLoadoutName } = useQuery({
    queryFn: () => GetLoadoutName(),
    queryKey: ["loadoutName"],
  });

  const { mutateAsync: updateLoadout, isPending } = useMutation({
    mutationFn: (item) => UpdateLoadout(item),
    onSuccess: (data) => {
      if (data?.success) {
        queryClient.invalidateQueries(["loadoutName", "orders"]);
      }
      setIsAddingNew(false);
    },
  });

  const [selectedLoadoutId, setSelectedLoadoutId] = useState("");
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newLoadoutName, setNewLoadOutName] = useState('');

  const handleDropdownChange = (event) => {
    const value = event.target.value;

    if (value === "add-new") {
      setIsAddingNew(true);
      setSelectedLoadoutId("");
    } else {
      setIsAddingNew(false);
      setSelectedLoadoutId(value);
    }
  };

  const handleSubmit = async () => {
    if (isAddingNew && !newLoadoutName.trim()) {
      return;
    }

    let dataToSubmit = {
      order_id: selectedOrders
    };

    if (isAddingNew) {
      dataToSubmit.name = newLoadoutName;
      dataToSubmit._id = '';
    } else {
      dataToSubmit._id = selectedLoadoutId;
      dataToSubmit.name = '';
    }

    await updateLoadout(dataToSubmit);
  };

  if (isLoadingLoadoutName) {
    return (
      <div className="flex justify-center items-center h-40 w-full">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <>
    {selectedOrders.length > 0 ? (<div className="bg-white shadow-lg rounded-xl border border-gray-100 p-6 w-full mx-auto mt-6 transform transition-all duration-300 hover:shadow-xl">
      <div className="space-y-4">

        {/* Content */}
          <div className="space-y-4">
            {/* Dropdown Selection */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Loadout
              </label>
              <div className="relative w-full">
                <select
                  className="w-full appearance-none border border-gray-300 rounded-md pl-4 pr-10 py-2.5 
                    text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 
                    focus:border-blue-500 transition duration-200"
                  value={selectedLoadoutId}
                  onChange={handleDropdownChange}
                >
                  <option value="">Choose an existing loadout</option>
                  {loadoutName?.names?.map((loadout) => (
                    <option key={loadout?._id} value={loadout?._id}>
                      {loadout?.name}
                    </option>
                  ))}
                  <option value="add-new">Create New Loadout</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                  <ChevronDown className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Input field for adding new */}
            {isAddingNew && (
              <div className="animate-fade-in w-full">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Loadout Name
                </label>
                <input
                  type="text"
                  placeholder="Enter a name for the new loadout"
                  className="w-full border border-gray-300 rounded-md px-4 py-2.5 
                    text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 
                    focus:border-blue-500 transition duration-200"
                  value={newLoadoutName}
                  onChange={(e) => setNewLoadOutName(e.target.value)}
                />
                {!newLoadoutName.trim() && isAddingNew && (
                  <p className="text-red-500 text-xs mt-1">
                    Loadout name is required
                  </p>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              className={`w-full mt-4 px-4 py-2.5 text-white font-semibold rounded-md 
                transition duration-300 ease-in-out flex items-center justify-center
                ${isPending || (isAddingNew && !newLoadoutName.trim())
                  ? 'bg-blue-300 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
              }`}
              onClick={handleSubmit}
              disabled={isPending || (isAddingNew && !newLoadoutName.trim())}
            >
              {isPending ? (
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
              ) : (
                <Check className="w-5 h-5 mr-2" />
              )}
              {isPending ? 'Submitting...' : 'Assign to Loadout'}
            </button>
          </div>
      </div>
    </div>) : (
      null
    )}
    </>
  );
};

export default OrderHeader;