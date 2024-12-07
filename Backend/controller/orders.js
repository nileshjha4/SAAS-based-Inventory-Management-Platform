const Order = require("../models/orders"); // Assuming you have defined the Order model

// Fetch Orders by User ID
const getOrdersByUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Fetch orders based on user_id from the database
    const orders = await Order.find({ user_id: userId });
    console.log()

    // If no orders are found for the user, return a 404 response
    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this user." });
    }

    // If orders are found, return the orders data
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Failed to fetch orders", error });
  }
};

const getAllOrders = async (req, res) => {
  try {
    // Fetch all orders from the database
    const orders = await Order.find();

    // If no orders are found, return a 404 response
    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found." });
    }

    // If orders are found, return the orders data
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({ message: "Failed to fetch orders", error });
  }
}

const getTotalSales = async (req, res) => {
  try {
    // Query to get all orders with "Delivered" status
    const orders = await Order.aggregate([
      {
        $match: {
          "order.final_amt": { $exists: true }, // Ensure we're only summing orders with a final amount
          status: "Delivered", // Only consider orders with "Delivered" status
        },
      },
      {
        $unwind: "$order", // Unwind the order array to process each item
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$order.final_amt" }, // Sum of all final amounts in the orders
        },
      },
    ]);

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No sales found." });
    }

    // Return the total sales amount
    res.status(200).json({ totalSales: orders[0].totalSales });
  } catch (error) {
    console.error("Error fetching total sales:", error);
    res.status(500).json({ message: "Failed to fetch total sales", error });
  }
};

module.exports = {
  getOrdersByUser,
  getAllOrders,
  getTotalSales, // Add this function to the export
};