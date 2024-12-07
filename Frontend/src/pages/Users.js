import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../AuthContext";
import { FaEdit, FaTrash } from "react-icons/fa";
import UpdateUser from "../components/UpdateUser"; // Create an UpdateUser component for user editing

function Users() {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateUser, setUpdateUser] = useState(null);
  const [users, setAllUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const authContext = useContext(AuthContext);
  const [updatePage, setUpdatePage] = useState(true);


  useEffect(() => {
    fetchUsersData();
  }, [updatePage]);
  
  const handlePageUpdate = () => {
    setUpdatePage(!updatePage);
  };

  // Fetch all users data
  const fetchUsersData = () => {
    fetch(`http://localhost:4000/api/user/get/all`)
      .then((response) => response.json())
      .then((data) => {
        setAllUsers(data);
      })
      .catch((err) => console.log(err));
  };

  // Fetch filtered users data based on search term
  const fetchSearchData = () => {
    fetch(`http://localhost:4000/api/user/search?searchTerm=${searchTerm}`)
      .then((response) => response.json())
      .then((data) => {
        setAllUsers(data);
      })
      .catch((err) => console.log(err));
  };

  const handleUpdateUser = (updatedUser) => {
    fetch(`http://localhost:4000/api/user/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedUser),
    })
      .then((response) => response.json())
      .then((data) => {
        setUpdatePage(!updatePage);
        setShowUpdateModal(false);
      })
      .catch((err) => console.log(err));
  };

  const updateUserModalSetting = (selectedUserData) => {
    console.log("Clicked: edit");
    setUpdateUser(selectedUserData);
    console.log(updateUser);
    setShowUpdateModal(!showUpdateModal);
    if (showUpdateModal) {
      handlePageUpdate();
    }
  };

  // Handle search term input
  const handleSearchTerm = (e) => {
    setSearchTerm(e.target.value);
    fetchSearchData();
  };

  return (
    <div className="col-span-12 lg:col-span-10 flex justify-center">
      <div className="flex flex-col gap-5 w-11/12">
        <div className="bg-white rounded p-3">
          <span className="font-semibold px-4">User Management</span>
        </div>

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
                onChange={handleSearchTerm}
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
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-900">
                    {user.name}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                    {user.mobile}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                    {user.email}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                    {user.shopname || "N/A"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                    <Link
                      to={`/dashboard/orders/${user._id}`}
                      className="text-blue-500 hover:underline"
                    >
                      View Orders
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                    <div className="flex gap-2">
                    <button 
                      onClick={() => updateUserModalSetting(user)}
                    >
                      <FaEdit 
                        color="#5e5e5e"
                        size="20px"
                        className="submit-icon"
                      />
                    </button>
                    {/* <button 
                      onClick={() => addProductQtyModalSetting(element)}
                    >
                      <MdAddBusiness 
                        color="#5e5e5e"
                        size="20px"
                        className="submit-icon"
                      />
                    </button> */}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {showUpdateModal && (
          <UpdateUser
            updateUserData={updateUser}
            updateModalSetting={updateUserModalSetting}
          />
        )}
      </div>
    </div>
  );
}

export default Users;
