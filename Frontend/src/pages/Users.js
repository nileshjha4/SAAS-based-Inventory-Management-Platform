import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import { GetUsers } from "../logic/get-users";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

function Users() {
  const navigate = useNavigate()
  const [searchTerm, setSearchterm] = useState('')
  const [filters, setFilters] = useState({
    searchTerm : ''
  })

  const {
    data: usersData,
    isLoading: isLoadingUsersData,
    isError: isErrorUsersData,
} = useQuery({
    queryFn: () => GetUsers(filters),
    queryKey: ["orders", filters],
    retry: 2,
});

  if(isLoadingUsersData){
    return <div>Loading...</div>
  }
  if(isErrorUsersData){
    return <div>Error...</div>
  }
  return (
    <div className="col-span-12 lg:col-span-10 flex justify-center">
      <div className="flex flex-col gap-5 w-11/12">

        {/* Search and Users Count */}
        <div className="flex justify-between pt-5 pb-3 px-3">
          <div className="flex gap-4 justify-center items-center">
            <span className="font-bold">Users</span>
            <div className="flex justify-center items-center px-2 border-2 rounded-md">
              <img
                alt="search-icon"
                className="w-5 h-5"
                src={require("../assets/search-icon.png")}
              />
              <input
                className="border-none outline-none focus:border-none text-xs"
                type="text"
                placeholder="Search by name, email, or shop name"
                value={searchTerm}
                onChange={()=>{}}
              />
            </div>
          </div>
        </div>
        
        {/* Users Table */}
        <div className="overflow-x-auto rounded-lg border bg-white border-gray-200">
          <table className="min-w-full divide-y-2 divide-gray-200 text-sm">
            <thead>
              <tr>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Name
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Mobile
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Email
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Shop Name
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Orders
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  More
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {usersData?.users?.map((user) => (
                <tr key={user._id}>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-900">
                    {user.name}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                    {user.number}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                    {user.email}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                    {user.shopname || "N/A"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                    <button
                      to={`/orders/${user._id}`}
                      className="text-blue-500 hover:underline"
                      onClick={()=>{
                        navigate('/all-orders',{
                          state: {
                            id: user?._id,
                            shopname: user?.shopname
                          }
                        })
                      }}
                    >
                      View Orders
                    </button>
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                    <div className="flex gap-2">
                    <button 
                      onClick={() =>{}}
                    >
                      <FaEdit 
                        color="#5e5e5e"
                        size="20px"
                        className="submit-icon"
                      />
                    </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Users;
