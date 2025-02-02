import { useQuery } from "@tanstack/react-query";
import { GetSummary } from "../logic/get-summary";
import SummaryDetails from "../components/Summary-details";
import { Loader2 } from "lucide-react";

const Summary = () => {
  const {
    data: summaryData,
    isLoading: isLoadingSummaryData,
    error: summaryError,
  } = useQuery({
    queryFn: () => GetSummary(),
    queryKey: ["summary"],
  });

  if (isLoadingSummaryData) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          <p className="text-lg text-gray-600">Loading your summaries...</p>
        </div>
      </div>
    );
  }

  if (summaryError) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="bg-red-50 p-6 rounded-lg max-w-lg text-center">
          <p className="text-lg text-red-600 font-medium mb-2">Oops! Something went wrong</p>
          <p className="text-red-500">{summaryError?.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Order Summaries</h1>
            <p className="text-gray-600 mt-1">
              Showing {summaryData?.summaries?.length || 0} orders
            </p>
          </div>
          <div className="flex gap-4">
            <button className="px-4 py-2 bg-white text-gray-600 rounded-lg shadow-sm hover:shadow-md transition-shadow border">
              Filter
            </button>
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-sm hover:shadow-md transition-shadow hover:bg-blue-600">
              Export All
            </button>
          </div>
        </div>
        <div className="space-y-4">
          {summaryData?.summaries?.map((summary, index) => (
            <SummaryDetails
              key={index} 
              summary={summary}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Summary;