import React, { useState } from "react";
import CouponGeneration from "../components/CouponGeneration";
import NewAgent from "../components/NewAgent";

const Store = () => {
  const [activeComponent, setActiveComponent] = useState(null);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-center mb-6">Store Management</h1>

      <div className="flex justify-center space-x-4 mb-6">
        <button
          onClick={() => setActiveComponent("CouponGeneration")}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
        >
          Coupon Generation
        </button>
        <button
          onClick={() => setActiveComponent("NewAgent")}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none"
        >
          Add Agent
        </button>
      </div>

      <div>
        {activeComponent === "CouponGeneration" && <CouponGeneration />}
        {activeComponent === "NewAgent" && <NewAgent />}
      </div>
    </div>
  );
};

export default Store;
