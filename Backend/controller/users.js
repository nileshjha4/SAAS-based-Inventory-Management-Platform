const User = require("../models/users"); // Assuming the model file is named User.js

// Get All Users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 }); // Sort by createdAt in descending order
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// Search Users
const searchUsers = async (req, res) => {
  const searchTerm = req.query.searchTerm || ""; // Fallback if no search term is provided
  try {
    const users = await User.find({
      $or: [
        { name: { $regex: searchTerm, $options: "i" } },
        { email: { $regex: searchTerm, $options: "i" } },
        { shopname: { $regex: searchTerm, $options: "i" } },
      ],
    }).sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({ message: "Failed to search users" });
  }
};


const updateSelectedUser = async (req, res) => {
  try {
    console.log(req.body);

    const updatedResult = await User.findByIdAndUpdate(
      { _id: req.body.userID },
      {
        name: req.body.name,
        email: req.body.email,
        mobile: req.body.mobile,
        gender: req.body.gender,
        address: {
          line1: req.body.line1,
          line2: req.body.line2,
          state: req.body.state,
          pincode: req.body.pincode,
        },
        shopname: req.body.shopname,
        pancard: req.body.pancard,
        aadharcard: req.body.aadharcard,
        gst: req.body.gst,
        pocname: req.body.pocname,
        poccontact: req.body.poccontact,
        password: req.body.password,
      },
      { new: true } // Return the updated document
    );

    console.log(updatedResult);
    res.json(updatedResult);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error updating user");
  }
};

module.exports = {
  getAllUsers,
  searchUsers,
  updateSelectedUser,
};