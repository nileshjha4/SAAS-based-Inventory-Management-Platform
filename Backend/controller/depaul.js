const User = require('../modal/user')
const Inventory = require('../modal/inventory')
const Cart = require('../modal/cart')
const Coupon = require('../modal/coupon')
const Order = require('../modal/order')
const PDFDocument = require('pdfkit')
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const outputDir = path.join(__dirname, 'pdfs'); 

const generateBillPDF = async (billData, outputFilePath) => {
    const { order, total } = billData;

    const doc = new PDFDocument();

    const outputFile = fs.createWriteStream(outputFilePath);

    doc.pipe(outputFile);

    doc.fontSize(20).text("Invoice", { align: "center" });
    doc.moveDown();

    doc.fontSize(12);
    doc.text("Item", 50, doc.y, { continued: true, width: 200 });
    doc.text("Qty", 250, doc.y, { continued: true });
    doc.text("Price", 300, doc.y, { continued: true });
    doc.text("Total", 400);
    doc.moveDown();

    doc.moveTo(50, doc.y).lineTo(500, doc.y).stroke();

    order.forEach((item, index) => {
        const { name, qty, price, amount } = item;

        doc.text(name, 50, doc.y, { continued: true });
        doc.text(qty, 250, doc.y, { continued: true });
        doc.text(`$${price.toFixed(2)}`, 300, doc.y, { continued: true });
        doc.text(`$${amount.toFixed(2)}`, 400);

        if (index < order.length - 1) {
            doc.moveDown(0.5);
        }
    });

    doc.moveDown();

    doc.fontSize(14).text("Grand Total:", 300, doc.y, { continued: true });
    doc.fontSize(14).text(`$${total.toFixed(2)}`, 400);

    doc.end();

    return new Promise((resolve, reject) => {
        outputFile.on('finish', () => {
            resolve(outputFilePath);
        });

        outputFile.on('error', (err) => {
            reject(err);
        });
    });
};

exports.getRecommendation=(async(req,res,next)=>{
    const { userId } = req.user
    if(!userId){
        return res.json(400).json({message:"Unauthorized, no token"})
    }
    try{
        const user = await User.findOne({_id:userId})
        if(!user){
            return res.status(400).json({message:"User not found"})
        }
        const result = await Inventory.find({})
        const groupedData = result.reduce((acc, item) => {
            const companyGroup = acc.find((group) => group.company === item.company);
            
            if (companyGroup) {
              companyGroup.items.push(item);
            } else {
              acc.push({
                company: item.company,
                items: [item]
              });
            }
            return acc;
          }, []);
        return res.status(200).json({message:"Recommendation found",success:true, error:false, result: groupedData})
    }catch(err){
        console.log(err)
        return res.status(500).json({"message":"Error finding recommendation"})
    }
})

// exports.getFilter=(async(req,res,next)=>{
//     const {degree, category} = req.body;
//     if(!degree || !category){
//         return res.status(400).json({error:"fields missing", success:false})
//     }
//     try{
//         const result = await Course.findOne({degree, category})
//         if(!result){
//             return res.status(404).json({error:"course has been removed", success:false})
//         }
//         res.status(200).json({success:true, error:false,result})
//     }catch(err){
//         console.log(error)
//         return res.status(500).json({"message":"Error finding recommendation"})
//     }
// })

exports.addToCart = async (req, res, next) => {
    const { userId } = req.user;
    let { itemId, qty, price } = req.body;

    if (!userId) {
        return res.status(400).json({ error: "User not found", success: false });
    }

    if (!itemId || !qty || !price) {
        return res
            .status(400)
            .json({ error: "Item ID, quantity, or price is missing", success: false });
    }

    const quantity = Number(qty);
    const itemPrice = Number(price);

    if (isNaN(quantity) || isNaN(itemPrice)) {
        return res
            .status(400)
            .json({ error: "Quantity and price must be valid numbers", success: false });
    }

    try {
        const cart = await Cart.findOne({ userId });

        if (cart) {
            const item = cart?.cart?.find((cartItem) => cartItem?.item_id == itemId);
            if (item) {
                item.qty += 1;
                item.sum_amt = item?.sum_amt + itemPrice;
                cart.total += itemPrice
                qty = item?.qty
                cart.markModified("cart"); 
            } else {
                cart.cart.push({
                    item_id: itemId,
                    qty: quantity,
                    sum_amt: quantity * itemPrice,
                });
                cart.total += quantity * itemPrice
            }

            await cart.save();
        } else {
            const newCart = new Cart({
                userId,
                cart: [
                    {
                        item_id: itemId,
                        qty: quantity,
                        sum_amt: quantity * itemPrice,
                    },
                ],
                total : quantity * itemPrice
            });
            await newCart.save();
        }
        console.log(qty)
        return res.status(200).json({ success: true, error: false , qty});
    } catch (err) {
        console.error("Error adding to cart:", err);
        return res.status(500).json({ error: "Internal server error", success: false });
    }
};

exports.removeFromCart = async (req, res, next) => {
    const { userId } = req.user;
    const { itemId, qty, price } = req.body;

    if (!userId) {
        return res.status(400).json({ error: "User not found", success: false });
    }
    if (!itemId || qty === undefined || price === undefined) {
        return res
            .status(400)
            .json({ error: "Item ID, quantity, or price is missing", success: false });
    }


    const quantity = Number(qty);
    const itemPrice = Number(price);

    console.log(quantity)

    if (isNaN(quantity) || isNaN(itemPrice)) {
        return res
            .status(400)
            .json({ error: "Quantity and price must be valid numbers", success: false });
    }

    try {
        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(400).json({ error: "Cart not found", success: false });
        }

        const item = cart?.cart?.find((cartItem) => cartItem.item_id == itemId);

        if (!item) {
            return res.status(400).json({ error: "Item not found in cart", success: false });
        }

        if (quantity === 0) {
            cart.total -= item?.sum_amt
            cart.cart = cart.cart.filter((cartItem) => cartItem.item_id != itemId);
        } else {
            item.qty -= 1;
            item.sum_amt -= itemPrice;
            cart.total -= itemPrice
            cart.markModified("cart"); 
        }

        await cart.save();
        return res.status(200).json({ success: true, error: false });
    } catch (err) {
        console.error("Error removing item from cart:", err);
        return res.status(500).json({ error: "Error removing item from cart", success: false });
    }
};

exports.getCart=(async(req,res,next)=>{
    const {userId} = req.user;
    if(!userId){
        return res.status(400).json({error:"User ID is missing",success:false});
    }
    try{
        const cart = await Cart.findOne({userId}).populate('cart.item_id');
        if(!cart){
            return res.status(400).json({error:"Cart not found",success:false});
        }
        return res.status(200).json({success:true,error:false,cart:cart?.cart, total: cart?.total, final_amount: cart?.final_amount || ''});
    }catch(err){
        console.error("Error getting cart:",err);
        return res.status(500).json({error:"Error getting cart",success:false});
    }
})

exports.getProfile=(async(req,res,next)=>{
    const {userId} = req.user;
    if(!userId){
        return res.status(400).json({error:"User ID is missing",success:false});
    }
    try{
        const user = await User.findOne({_id:userId});
        if(!user){
            return res.status(400).json({error:"User not found",success:false});
        }
        return res.status(200).json({success:true,error:false,personal:user});
    }catch(err){
        console.error("Error getting profile:",err);
        return res.status(500).json({error:"Error getting profile",success:false});
    }
})

exports.updateProfile=(async(req,res,next)=>{
    const {userId} = req.user;
    const data = req.body
    if(!userId){
        return res.status(400).json({error:"User ID is missing",success:false});
    }
    try{
        const user = await User.findOneAndUpdate({_id:userId},data,{new:true});
        if(!user){
            return res.status(400).json({error:"User not found",success:false});
        }
        return res.status(200).json({success:true,error:false,personal:user});
    }catch(err){
        console.error("Error updating profile:",err);
        return res.status(500).json({error:"Error updating profile",success:false});
    }
})

exports.getCompany=(async(req,res,next)=>{
    const {userId} = req.user;
    if(!userId){
        return res.status(400).json({error:"User ID is missing",success:false});
    }
    try{
        const company = await Inventory.find({}).select('company').distinct('company')
        let formattedCompany=[]
        company.forEach((item)=>{
            formattedCompany.push({label:item, value:item})
        })
        return res.status(200).json({success:true,error:false,company:formattedCompany});
    }catch(err){
        console.error("Error getting company:",err);
        return res.status(500).json({error:"Error getting company",success:false});
    }
})

exports.getFlavour=(async(req,res,next)=>{
    const {userId} = req.user;
    if(!userId){
        return res.status(400).json({error:"User ID is missing",success:false});
    }
    try{
        const flavour = await Inventory.find({}).select('flavour').distinct('flavour')
        let formattedFlavour=[]
        flavour.forEach((item)=>{
            formattedFlavour.push({label:item, value:item})
        })
        return res.status(200).json({success:true,error:false,flavour:formattedFlavour});
    }catch(err){
        console.error("Error getting company:",err);
        return res.status(500).json({error:"Error getting company",success:false});
    }
})

exports.applyCoupon=(async(req,res,next)=>{
    const {userId} = req.user;
    const {coupon} = req.body;
    if(!userId || !coupon){
        return res.status(400).json({error:"User ID or coupon code is missing",success:false})
    }
    try{
        const user = await User.findOne({_id:userId});
        if(!user){
            return res.status(400).json({error:"User not found",success:false})
        }
        const existingCoupon = await Coupon.findOne({couponCode:coupon});
        if(!existingCoupon){
            return res.status(400).json({error:"Coupon code is invalid",success:false})
        }
        if(existingCoupon?.status === 'inactive'){
            return res.status(400).json({error:"Coupon code is inactive",success:false})
        }
        const cart = await Cart.findOne({userId: userId});
        if(!cart){
            return res.status(400).json({error:"Cart is empty",success:false})
        }
        const discountPercentage = Number(existingCoupon?.discount)
        cart.cart = cart.cart.map(item => {
            const discount_amt = (Number(item.sum_amt) * discountPercentage) / 100; 
            item.discount_amt = Number(item.sum_amt) - discount_amt; 
            return item;
        });
        const final_discount_amt = (Number(cart?.total) * discountPercentage) / 100;
        cart.final_amount = Number(cart.total) - final_discount_amt
        cart.coupon = coupon
        await cart.save();
        return res.status(200).json({success:true,error:false,message:"Coupon applied successfully"});
    }catch(err){
        console.error("Error applying coupon:",err);
        return res.status(500).json({error:"Error applying coupon",success:false});
    }
})

exports.placeOrder=(async(req,res,next)=>{
    const {userId} = req.user;
    if(!userId){
        return res.status(400).json({error:"User ID is missing",success:false})
    }
    try{
        const user = await User.findOne({_id:userId});
        if(!user){
            return res.status(400).json({error:"User not found",success:false})
        }
        const cart = await Cart.findOne({userId: userId}).populate('cart.item_id');
        if(!cart){
            return res.status(400).json({error:"Cart is empty",success:false})
        }
        let orders=[]
        cart?.cart?.forEach(item=>{
            orders.push({
                item_id: item?.item_id?._id,
                qty: item?.qty,
                sum_amt: item?.discount_amt ? item?.discount_amt : item?.sum_amt,
                discount_amt : item?.discount_amt ? item?.discount_amt : 0,
                discount_percentage : item?.discount_percentage ? item?.discount_percentage : 0
            })
        })
        const order = new Order({
            user_id: userId,
            order: orders,
            total: cart?.final_amount ? cart?.final_amount : cart?.total,
            status:  "Orders",
        })
        // const myUUID = uuidv4();
        // const outputFilePath = path.join(outputDir, `${myUUID}_invoice.pdf`);
        // await generateBillPDF(order, outputFilePath);
        // order.invoice = outputFilePath
        await order.save();
        if(cart?.coupon){
            const coupon = await  Coupon.findOne({couponCode: cart?.coupon});
            if(coupon){
                coupon.status = 'inactive'
                await coupon.save();
            }
        }
        await Cart.deleteOne({userId})
        return res.status(200).json({success:true,error:false,message:"Order placed successfully"});
    }catch(err){
        console.error("Error placing order:",err);
        return res.status(500).json({error:"Error placing order",success:false});
    }
})

exports.getOrder=(async(req,res,next)=>{
    const {userId} = req.user;
    if(!userId){
        return res.status(400).json({error:"User ID is missing",success:false});
    }
    try{
        const order = await Order.find({user_id:userId,  status: 'Orders'}).populate('order.item_id');
        if(!order){
            return res.status(400).json({error:"Order not placed yet",success:false});
        }
        let formattedOrder = order.map(doc => doc.toObject());

        for (let i = 0; i < formattedOrder.length; i++) {
            let total = 0;
            formattedOrder[i].order.forEach(item => {
                total += item.sum_amt;
            });
            formattedOrder[i].total = total;
        }
        return res.status(200).json({success:true,error:false,order:formattedOrder});
    }catch(err){
        console.error("Error getting order:",err);
        return res.status(500).json({error:"Error getting order",success:false});
    }
})

exports.getInvoice=(async(req,res,next)=>{
    const {filepath} = req.params
    if(!filepath){
        return res.status(400).json({error:"File path is missing",success:false});
    }
    if (!fs.existsSync(filepath)) {
        return res.status(404).json({ error: "File not found", success: false });
    }
    res.send(filepath)
})