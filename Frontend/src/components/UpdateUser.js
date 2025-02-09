import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { PlusIcon } from "@heroicons/react/24/outline";

export default function UpdateUser({
  updateUserData,
  updateModalSetting,
//   handlePageUpdate
}) {
//   const { _id, name, manufacturer, description } = updateProductData;
  const [user, setUser] = useState({
    userID: updateUserData._id,
    name: updateUserData.name,
    mobile: updateUserData.mobile,
    email: updateUserData.email,
    shopname: updateUserData.shopname || "",
    // address: {
    line1: updateUserData.address?.line1 || "",
    line2: updateUserData.address?.line2 || "",
    state: updateUserData.address?.state || "",
    pincode: updateUserData.address?.pincode || "",
    // },
    gender: updateUserData.gender || "",
    gst: updateUserData.gst || "",
    pancard: updateUserData.pancard || "",
    pocname: updateUserData.pocname || "",
    poccontact: updateUserData.poccontact || "",
    password: updateUserData.password || "",
  });
  
  const [open, setOpen] = useState(true);
  const cancelButtonRef = useRef(null);

  const handleInputChange = (key, value) => {
    console.log(key);
    setUser({ ...user, [key]: value });
  };
  console.log(updateUserData);
  const updateUser = () => {
    console.log(user);
    fetch("http://103.160.144.19:4600/api/user/update", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(user),
    })
      .then((result) => {
        alert("Product Updated");
        // setOpen(false);
        // handlePageUpdate();
        updateModalSetting();
      })
      .catch((err) => console.log(err));
  };

  return (
    // Modal
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={setOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                        <PlusIcon
                        className="h-6 w-6 text-blue-400"
                        aria-hidden="true"
                        />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <Dialog.Title
                        as="h3"
                        className="text-lg font-semibold leading-6 text-gray-900"
                        >
                        Update User
                        </Dialog.Title>
                        <form action="#">
                        <div className="grid gap-4 mb-4 sm:grid-cols-2">
                            <div>
                            <label
                                htmlFor="name"
                                className="block mb-2 text-sm font-medium text-gray-900"
                            >
                                Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                value={user.name}
                                onChange={(e) =>
                                handleInputChange(e.target.name, e.target.value)
                                }
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                                placeholder="Enter name"
                            />
                            </div>
                            <div>
                            <label
                                htmlFor="email"
                                className="block mb-2 text-sm font-medium text-gray-900"
                            >
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                value={user.email}
                                onChange={(e) =>
                                handleInputChange(e.target.name, e.target.value)
                                }
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                                placeholder="Enter email"
                            />
                            </div>
                            <div>
                            <label
                                htmlFor="mobile"
                                className="block mb-2 text-sm font-medium text-gray-900"
                            >
                                Mobile
                            </label>
                            <input
                                type="tel"
                                name="mobile"
                                id="mobile"
                                value={user.mobile}
                                onChange={(e) =>
                                handleInputChange(e.target.name, e.target.value)
                                }
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                                placeholder="Enter mobile number"
                            />
                            </div>
                            <div>
                            <label
                                htmlFor="gender"
                                className="block mb-2 text-sm font-medium text-gray-900"
                            >
                                Gender
                            </label>
                            <select
                                name="gender"
                                id="gender"
                                value={user.gender}
                                onChange={(e) =>
                                handleInputChange(e.target.name, e.target.value)
                                }
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                            </div>
                            <div className="sm:col-span-2">
                            <label
                                htmlFor="line1"
                                className="block mb-2 text-sm font-medium text-gray-900"
                            >
                                Address: 
                            </label>
                            <label
                                htmlFor="address"
                                className="block mb-2 text-sm font-medium text-gray-900"
                            >
                                Line1: 
                            </label>
                        {/* }, ${user.address.line2}, ${user.address.state} - ${user.address.pincode}` */}
                            <textarea
                                name="line1"
                                id="line1"
                                rows="1"
                                value={user.line1}
                                onChange={(e) =>
                                handleInputChange(e.target.value)
                                }
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                                placeholder="Enter address"
                            />
                            <label
                                htmlFor="line2"
                                className="block mb-2 text-sm font-medium text-gray-900"
                            >
                                Line2: 
                            </label>
                        {/* }, ${user.address.line2}, ${user.address.state} - ${user.address.pincode}` */}
                            <textarea
                                name="line2"
                                id="line2"
                                rows="1"
                                value={user.line2}
                                onChange={(e) =>
                                handleInputChange(e.target.value)
                                }
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                                placeholder="Enter address"
                            />
                            </div>
                            <div>
                            <label
                                htmlFor="state"
                                className="block mb-2 text-sm font-medium text-gray-900"
                            >
                                State
                            </label>
                            <input
                                type="text"
                                name="state"
                                id="state"
                                value={user.state}
                                onChange={(e) =>
                                handleInputChange(e.target.name, e.target.value)
                                }
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                                placeholder="Enter name"
                            />
                            </div>
                            <div>
                            <label
                                htmlFor="pincode"
                                className="block mb-2 text-sm font-medium text-gray-900"
                            >
                                Pincode
                            </label>
                            <input
                                type="text"
                                name="pincode"
                                id="pincode"
                                value={user.pincode}
                                onChange={(e) =>
                                handleInputChange(e.target.name, e.target.value)
                                }
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                                placeholder="Enter email"
                            />
                            </div>
                            <div>
                            <label
                                htmlFor="gst"
                                className="block mb-2 text-sm font-medium text-gray-900"
                            >
                                GST
                            </label>
                            <input
                                type="text"
                                name="gst"
                                id="gst"
                                value={user.gst}
                                onChange={(e) =>
                                handleInputChange(e.target.name, e.target.value)
                                }
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                                placeholder="Enter GST"
                            />
                            </div>
                            <div>
                            <label
                                htmlFor="pancard"
                                className="block mb-2 text-sm font-medium text-gray-900"
                            >
                                PAN Card
                            </label>
                            <input
                                type="text"
                                name="pancard"
                                id="pancard"
                                value={user.pancard}
                                onChange={(e) =>
                                handleInputChange(e.target.name, e.target.value)
                                }
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                                placeholder="Enter PAN card"
                            />
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button
                            type="button"
                            className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                            onClick={updateUser}
                            >
                            Update User
                            </button>
                            <button
                            type="button"
                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                            onClick={() => updateModalSetting()}
                            ref={cancelButtonRef}
                            >
                            Cancel
                            </button>
                        </div>
                        </form>
                    </div>
                    </div>
                </div>
              </Dialog.Panel>

            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
