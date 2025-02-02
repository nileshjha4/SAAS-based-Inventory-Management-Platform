import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Truck, 
  BarChart3, 
  Users, 
  Settings 
} from "lucide-react";

function SideMenu() {
  const location = useLocation();

  const menuItems = [
    { 
      path: "/dashboard", 
      icon: LayoutDashboard, 
      label: "Dashboard" 
    },
    { 
      path: "/inventory", 
      icon: Package, 
      label: "Inventory",
    },
    { 
      path: "/all-orders", 
      icon: ShoppingCart, 
      label: "Orders" 
    },
    { 
      path: "/loadout", 
      icon: Truck, 
      label: "Loadout" 
    },
    { 
      path: "/dispatch", 
      icon: Truck, 
      label: "Dispatch" 
    },
    { 
      path: "/summary", 
      icon: BarChart3, 
      label: "Summary" 
    },
    { 
      path: "/users", 
      icon: Users, 
      label: "Users" 
    },
    { 
      path: "/manage-store", 
      icon: Settings, 
      label: "Manage Store",
    }
  ];

  return (
    <div className="h-screen bg-white border-r w-64 flex flex-col shadow-md">
      <div className="px-4 py-6 flex-grow">
        <nav aria-label="Main Nav" className="space-y-1">
          {menuItems.map((item) => (
            item.hasSubmenu ? (
              <details 
                key={item.path} 
                className="group"
                open={location.pathname.startsWith(item.path)}
              >
                <summary 
                  className={`
                    flex cursor-pointer items-center justify-between 
                    rounded-lg px-4 py-2 
                    ${location.pathname.startsWith(item.path) 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'}
                  `}
                >
                  <Link to={item.path} className="flex items-center gap-3">
                    <item.icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                </summary>
                {/* Additional submenu items can be added here if needed */}
              </details>
            ) : (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-3 rounded-lg px-4 py-2 
                  ${location.pathname === item.path 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'}
                `}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            )
          ))}
        </nav>
      </div>
    </div>
  );
}

export default SideMenu;