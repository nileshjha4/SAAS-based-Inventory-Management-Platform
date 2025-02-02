import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GenearteCoupon } from "../logic/generate-coupon";
import { GetCoupons } from "../logic/get-coupon";
import { useState } from "react";

const CouponGeneration=()=>{
  const queryClient = useQueryClient();
  const [discount, setDiscount] = useState(0)

  const {
    data: couponsData,
    isLoading: isLoadingCouponsData,
  } = useQuery({
    queryFn: () => GetCoupons(),
    queryKey: ["coupon"],
  });

  const { mutateAsync: generateCoupon } = useMutation({
    mutationFn: () => GenearteCoupon(discount),
    onSuccess: (data) => {
      if (data?.success) {
        queryClient.invalidateQueries(['coupon'])
      }
    },
  });

  if(isLoadingCouponsData){
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Coupon Generator</h1>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="w-full sm:w-64">
              <input
                type="number"
                placeholder="Enter discount percentage"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>
            <button
              onClick={generateCoupon}
              className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Generate Coupon
            </button>
          </div>
        </div>

        {/* Coupons List */}
        {couponsData?.coupons?.length > 0 ? <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 border-b border-gray-200 font-medium text-gray-600">
            <div>Coupon Code</div>
            <div>Discount</div>
            <div>Expiry Date</div>
            <div>Status</div>
          </div>
          <div className="divide-y divide-gray-200">
            {couponsData?.coupons?.map((coupon, index) => (
              <div key={index} className="grid grid-cols-4 gap-4 p-4 hover:bg-gray-50 transition-colors">
                <div className="font-medium text-blue-600">{coupon?.couponCode}</div>
                <div className="text-gray-900">{coupon?.discount}</div>
                <div className="text-gray-600">{coupon?.expiryDate}</div>
                <div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${coupon?.status === 'active' ? 'bg-green-100 text-green-800': 'bg-red-200 text-red-800'} `}>
                    {coupon?.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>: null}
      </div>
    </div>
  );
  }
export default CouponGeneration