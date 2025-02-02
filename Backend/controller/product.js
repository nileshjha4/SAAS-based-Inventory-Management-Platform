const Product = require("../models/Product");
const Purchase = require("../models/purchase");
const Sales = require("../models/sales");
const Coupon = require('../models/coupon')

// Add Post
const addProduct = async (req, res, next) => {
  const {item, flavor, company, minqty, qty, price, description} = req.body;
  if(!item || !flavor || !company || !minqty || !qty || !price) {
    return res.status(400).json({message: "Please fill in all fields.", success:false, error:true});
  }
  try{
    const addProduct = new Product({
      item: item,
      flavour: flavor,
      company: company,
      minqty: minqty,
      qty: qty,
      price: price,
      description: description,
    });
    await addProduct.save();
    res.status(201).json({message: "Product Added Successfully", success:true, error:false})
  }catch(err){
    console.log(err)
    return res.status(400).json({message: "Error adding product.", success:false, error:true})
  }
};

// Get All Products
const getAllProducts = async (req, res) => {
  const {searchTerm} = req.query;
  console.log(searchTerm)
  try{
    let filters={}
    if(searchTerm){
      filters={item:{$regex:searchTerm,$options:'i'}}
    }
    const findAllProducts = await Product.find(filters)
    res.status(200).json({success:true, error:false, data:findAllProducts})
  }catch(err){
    console.log(err)
    res.status(500).json({success:false, error:true, message:"Server Error"})
  }
};

// Delete Selected Product
const deleteSelectedProduct = async (req, res) => {
  const deleteProduct = await Product.deleteOne(
    { _id: req.params.id }
  );
  const deletePurchaseProduct = await Purchase.deleteOne(
    { ProductID: req.params.id }
  );

  const deleteSaleProduct = await Sales.deleteOne(
    { ProductID: req.params.id }
  );
  res.json({ deleteProduct, deletePurchaseProduct, deleteSaleProduct });
};

// Update Selected Product
const updateSelectedProduct = async (req, res) => {
  try {
    console.log(req.body);
    const updatedResult = await Product.findByIdAndUpdate(
      { _id: req.body.productID },
      {
        item: req.body.item,
        flavor: req.body.flavor,
        company: req.body.company,
        minqty: req.body.minqty,
        qty: req.body.qty,
        price: req.body.price,
        description: req.body.description,
      },
      { new: true }
    );
    console.log(updatedResult);
    res.json(updatedResult);
  } catch (error) {
    console.log(error);
    res.status(402).send("Error");
  }
};

const addProductQty = async (req, res) => {
  try {
    const updatedResult = await Product.findByIdAndUpdate(
      { _id: req.body.productID },
      {
        qty: req.body.qty,
        price: req.body.price,
        description: req.body.description,
      },
      { new: true }
    );
    console.log(updatedResult);
    res.json(updatedResult);
  } catch (error) {
    console.log(error);
    res.status(402).send("Error");
  }
};

// Search Products
const searchProduct = async (req, res) => {
  const searchTerm = req.query.searchTerm;
  const products = await Product.find({
    name: { $regex: searchTerm, $options: "i" },
  });
  res.json(products);
};

const generateCoupon = async (req, res) => {
  const { discount } = req.body;

  if (!discount) {
      return res.status(400).json({
          success: false,
          error: true,
          message: "Discount percentage is required",
      });
  }

  try {
      const couponCode = Math.random().toString(36).substring(2, 10).toUpperCase();

      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 48);

      const coupon = new Coupon({
          couponCode: couponCode,
          discount: discount,
          expiryDate: expiryDate,
          status: 'active',
      });

      await coupon.save();

      res.status(201).json({
          success: true,
          error: false,
          message: "Coupon generated successfully",
          coupon,
      });
  } catch (error) {
      res.status(500).json({
          success: false,
          error: true,
          message: "An error occurred while generating the coupon",
          details: error.message,
      });
  }
};

const getCoupon=async(req,res)=>{
    try{
      const coupon=await Coupon.find({}).sort({expiryDate:-1})
      if(!coupon){
        return res.status(404).json({error:true, success:false, message:"No coupons found"})
      }
      res.status(200).json({error:false, success:true, message:"Coupons found", coupons: coupon})
    }catch(error){
      res.status(500).json({error:true, success:false, message:"An error occurred"})
    }
}


module.exports = {
  addProduct,
  getAllProducts,
  deleteSelectedProduct,
  updateSelectedProduct,
  searchProduct,
  generateCoupon,
  getCoupon
};
