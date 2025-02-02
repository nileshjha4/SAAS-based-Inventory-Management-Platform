import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Layout from "./components/Layout";
import Inventory from "./pages/Inventory";
import Users from "./pages/Users";
import Orders from "./pages/Order"
import NoPageFound from "./pages/NoPageFound";
import Store from "./pages/Store";
import Sales from "./pages/Sales";
import PurchaseDetails from "./pages/PurchaseDetails";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import LoadOut from './pages/LoadOut';
import Dispatch from './pages/Dispatch';
import Summary from './pages/Summary';
import ProtectedRoutes from './components/ProtectedRoutes';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <ProtectedRoutes>
        <Login />
      </ProtectedRoutes>
    ),
  },
  {
    path: '/',
    element: (
      <ProtectedRoutes>
        <Layout />
      </ProtectedRoutes>
    ),
    children: [
      { path: "dashboard", element: <Dashboard /> },
      { path: "inventory", element: <Inventory /> },
      { path: "all-orders", element: <PurchaseDetails /> },
      { path: "loadout", element: <LoadOut /> },
      { path: "dispatch", element: <Dispatch /> },
      { path: "summary", element: <Summary /> },
      { path: "sales", element: <Sales /> },
      { path: "manage-store", element: <Store /> },
      { path: "users", element: <Users /> },
      { path: "orders/:userId", element: <Orders /> },
      { path: "*", element: <NoPageFound /> },
    ],
  },
]);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
);

reportWebVitals();
