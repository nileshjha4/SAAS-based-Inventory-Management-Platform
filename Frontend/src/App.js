import React from "react";
import Login from "./pages/Login";
// import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import "./index.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Inventory from "./pages/Inventory";
import Users from "./pages/Users";
import Orders from "./pages/Order"
import NoPageFound from "./pages/NoPageFound";
import AuthContext from "./AuthContext";
import ProtectedWrapper from "./ProtectedWrapper";
import { useEffect, useState } from "react";
import Store from "./pages/Store";
import Sales from "./pages/Sales";
import PurchaseDetails from "./pages/PurchaseDetails";
// import Order from "../../Backend/models/orders";

const App = () => {
  const [user, setUser] = useState("");
  const [loader, setLoader] = useState(true);
  let myLoginUser = JSON.parse(localStorage.getItem("user"));
  // console.log("USER: ",user)

  useEffect(() => {
    if (myLoginUser) {
      setUser(myLoginUser._id);
      setLoader(false);
      // console.log("inside effect", myLoginUser)
    } else {
      setUser("");
      setLoader(false);
    }
  }, [myLoginUser]);

  const signin = (newUser, callback) => {
    setUser(newUser);
    callback();
  };

  const signout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  let value = { user, signin, signout };

  if (loader)
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h1>LOADING...</h1>
      </div>
    );

  return (
    <AuthContext.Provider value={value}>
      <BrowserRouter>
        {/* <Routes>
          <Route path="/login" element={<Login />} /> */}
          {/* <Route path="/register" element={<Register />} /> */}
          {/* <Route
            path="/"
            element={
              <ProtectedWrapper>
                <Layout />
              </ProtectedWrapper>
            }
          > */}
            {/* <Route index element={<Dashboard />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/all-orders" element={<PurchaseDetails />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/manage-store" element={<Store />} />
            <Route path="/users" element={<Users />} />
            <Route path="/orders/:userId" element={<Orders />} />
          </Route> */}
          {/* <Route path="*" element={<NoPageFound />} />
        </Routes> */}
        <Routes>
        <Route path="/login" element={<Login />} />
        {/* <Route path="/register" element={<Register />} /> */}
        
        {/* Redirect root ("/") to the login page */}
        <Route path="/" element={<Navigate to="/login" />} />
        
        <Route
          path="/dashboard"
          element={
            <ProtectedWrapper>
              <Layout />
            </ProtectedWrapper>
          }
        >
          {/* <Route index element={<Dashboard />} /> */}
          <Route index element={<Dashboard />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="all-orders" element={<PurchaseDetails />} />
          <Route path="sales" element={<Sales />} />
          <Route path="manage-store" element={<Store />} />
          <Route path="users" element={<Users />} />
          <Route path="orders/:userId" element={<Orders />} />
        </Route>
      </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

export default App;
