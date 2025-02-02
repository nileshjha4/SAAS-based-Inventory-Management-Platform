import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Bell,
  User, 
  LogOut, 
  Settings, 
  HelpCircle 
} from "lucide-react";
import { useAdminState } from "../store/store";

export default function Header() {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const {admin, setAdmin} = useAdminState()

  const handleSignOut = () => {
    setAdmin({
      isLoggedIn: false,
      token: '',
      name: ''
    })
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Company Logo */}
        <div className="px-4">
          <h2 className="text-xl font-bold text-gray-800">Beverage Marketplace</h2>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full">
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
          </button>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded-lg"
            >
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                {admin?.name?.charAt(0)?.toUpperCase()}
              </div>
              <span className="text-sm font-medium">{admin?.name}</span>
            </button>

            {isProfileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border rounded-lg shadow-lg z-50">
                <div className="px-4 py-3 border-b">
                  <p className="text-sm font-medium text-gray-900">{admin?.name}</p>
                  <p className="text-xs text-gray-500">admin@company.com</p>
                </div>
                <ul className="py-1">
                  <li>
                    <button 
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        // Navigate to profile or open profile modal
                        console.log("Open Profile");
                      }}
                    >
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </button>
                  </li>
                  <li>
                    <button 
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      onClick={handleSignOut}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}