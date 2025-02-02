import React, { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { 
  ChevronDown, 
  ChevronUp, 
  Package, 
  Layers, 
  // Filter, 
  Search,
  PlusCircle
} from "lucide-react";
import { GetLoadouts } from "../logic/get-loadout-data";
import LoadOutDetails from "../components/LoadOutDetails";
import { GetAgentData } from "../logic/get-agent-data";
import { useNavigate } from "react-router-dom";
import { GenerateLoadoutPdf } from "../logic/generate-loadout-pdf";

const LoadOut = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate()
  // const [filterStatus, setFilterStatus] = useState("all");
  const [expandedLoadouts, setExpandedLoadouts] = useState({});

  const { 
    data: loadoutData, 
    isLoading: isLoadingLoadoutData, 
    error: loadoutError 
  } = useQuery({
    queryFn: () => GetLoadouts(),
    queryKey: ["loadout"],
  });

  const { 
    data: agentData, 
    isLoading: isLoadingAgentData,
    error: agentError 
  } = useQuery({
    queryFn: () => GetAgentData(),
    queryKey: ["agent"]
  });

  const { mutateAsync: generateLoadoutPdf } = useMutation({
    mutationFn: (id) => GenerateLoadoutPdf(id),
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

  // Memoized filtered loadouts
  const filteredLoadouts = useMemo(() => {
    if (!loadoutData?.loadouts) return [];

    return loadoutData.loadouts.filter(loadout => {
      const matchesSearch = loadout.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Add more filter logic if needed
      return matchesSearch;
    });
  }, [loadoutData, searchTerm]);

  // Toggle loadout expansion
  const toggleLoadout = (id) => {
    setExpandedLoadouts((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Loading State
  if (isLoadingLoadoutData || isLoadingAgentData) {
    return (
      <div className="flex justify-center items-center w-full h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading Loadout Information...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (loadoutError || agentError) {
    return (
      <div className="flex flex-col justify-center items-center w-full h-screen bg-red-50 p-4">
        <Package className="w-24 h-24 text-red-400 mb-4" />
        <h2 className="text-2xl font-semibold text-red-700 mb-2">
          Error Loading Data
        </h2>
        <p className="text-red-500 text-center">
          {loadoutError?.message || agentError?.message || "An unexpected error occurred"}
        </p>
        <button 
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          onClick={() => window.location.reload()}
        >
          Retry Loading
        </button>
      </div>
    );
  }

  // Empty State
  if (!loadoutData?.loadouts?.length) {
    return (
      <div className="flex flex-col justify-center items-center w-full h-screen bg-gray-50 p-4">
        <Package className="w-24 h-24 text-gray-400 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">
          No Loadouts Available
        </h2>
        <p className="text-gray-500 mb-6 text-center">
          Create your first loadout to get started
        </p>
        <button 
          className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          onClick={()=>navigate('/all-orders')}
        >
          <PlusCircle className="mr-2" />
          Create New Loadout
        </button>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 p-6">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <div className="flex items-center">
          <Layers className="w-10 h-10 text-blue-600 mr-4" />
          <h1 className="text-3xl font-bold text-gray-800">Loadouts</h1>
        </div>
        
        {/* Actions */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search loadouts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg w-64 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button 
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center"
            onClick={()=>navigate('/all-orders')}
          >
            <PlusCircle className="mr-2" />
            New Loadout
          </button>
        </div>
      </div>
      
      {/* Loadouts Grid */}
      <div className="grid grid-cols-1 gap-6">
        {filteredLoadouts.map((loadout) => (
          <div
            key={loadout._id}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
          >
            <div
              className="flex justify-between items-center p-5 bg-gray-100 cursor-pointer hover:bg-gray-200 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <Package className="w-6 h-6 text-blue-500" />
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {loadout.name}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Created on {new Date(loadout.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div>
                <button className="text-blue-400 underline"
                onClick={async()=>{
                    await generateLoadoutPdf(loadout?._id)
                }}
                >
                  generate loadout
                </button>
              </div>
              
              <div className="flex items-center space-x-4"
              onClick={() => toggleLoadout(loadout._id)}
              >
                <div className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                  {loadout?.order_id?.length || 0} Orders
                </div>
                {expandedLoadouts[loadout._id] ? (
                  <ChevronUp className="text-gray-600" />
                ) : (
                  <ChevronDown className="text-gray-600" />
                )}
              </div>
            </div>
            
            {expandedLoadouts[loadout._id] && (
              <div className="p-4 bg-gray-50">
                <LoadOutDetails loadout={loadout} agents={agentData?.agents} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* No Results for Search */}
      {filteredLoadouts.length === 0 && searchTerm && (
        <div className="text-center py-10">
          <Search className="mx-auto h-16 w-16 text-gray-300 mb-4" />
          <p className="text-gray-600">
            No loadouts found matching "{searchTerm}"
          </p>
        </div>
      )}
    </div>
  );
};

export default LoadOut;