const Order = require("../models/orders"); // Assuming you have defined the Order model
const Loadout = require("../models/loadout")
const Agent = require('../models/agent')
const Dispatch = require('../models/dispatch')
const Inventory = require('../models/Product')
const Summary = require('../models/summary')
const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs')

const generateLoadoutPDF = (loadout, pdfFilePath) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const fileStream = fs.createWriteStream(pdfFilePath);
    
    doc.pipe(fileStream);

    try {
      doc.fontSize(14).font('Helvetica-Bold')
        .text('BEVERAGE DISTRIBUTION CENTER', { align: 'left' })
        .fontSize(12)
        .text('Load Out Gate Pass (LI Completed)', { align: 'right' });

      const loadoutNo = `PL-${Math.floor(Math.random() * 10000)}`;
      const date = new Date(loadout?.createdAt).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });

      doc.moveDown(1);
      doc.fontSize(10).font('Helvetica');
      
      const startY = doc.y;
      
      doc.text(`Loadout No : ${loadoutNo}`, 50, startY);
      doc.text(`Loadout Type : Prebill`, 50, startY + 20);
      
      doc.text(`Created Date : ${date}`, 250, startY);
      doc.text(`Load Out Date : ${date}`, 250, startY + 20);
      
      doc.text(`Vehicle No : -`, 450, startY);
      doc.text(`Sales Man : -`, 450, startY + 20);

      loadout.order_id.forEach((order, index) => {
        const user = order.user_id;
        const orders = order.order;

        if (index > 0) {
          doc.addPage();
        }

        doc.moveDown(2);
        doc.font('Helvetica-Bold').text('Outlet Info:', 50);
        doc.font('Helvetica').text(
          `${user?.name} - ${user?.number} \n` +
          `${user?.address?.line1}, ${user?.address?.line2}, ${user?.address?.state}, ${user?.address?.pincode}`
        );

        doc.moveDown(1);
        doc.font('Helvetica-Bold').text('Order Details:', 50);
        const totalAmount = orders?.reduce((sum, item) => sum + (item.sum_amt || 0), 0);
        doc.font('Helvetica').text(`Order No: ${index + 1} | Total Amount: ₹${totalAmount.toFixed(2)}`);

        doc.moveDown(1);
        const tableTop = doc.y;
        const tableHeaders = ['Item Name', 'MRP', 'Quantity', 'Bill Type', 'Amount'];
        const columnWidths = [250, 70, 70, 70, 70];
        
        let xPosition = 50;
        doc.font('Helvetica-Bold');
        tableHeaders.forEach((header, i) => {
          doc.text(header, xPosition, tableTop, { width: columnWidths[i] });
          xPosition += columnWidths[i];
        });

        let yPosition = tableTop + 20;
        doc.font('Helvetica');

        orders?.forEach((item) => {
          const itemDetails = item.item_id;
          xPosition = 50;
          
          doc.text(`${itemDetails?.item} (${itemDetails?.flavour})`, xPosition, yPosition, { width: columnWidths[0] });
          xPosition += columnWidths[0];
          
          // MRP
          doc.text(`₹${itemDetails?.price?.toFixed(2) || '0.00'}`, xPosition, yPosition, { width: columnWidths[1] });
          xPosition += columnWidths[1];
          
          // Quantity
          doc.text(`${item?.qty || '0'}`, xPosition, yPosition, { width: columnWidths[2] });
          xPosition += columnWidths[2];
          
          // Bill Type
          doc.text('S', xPosition, yPosition, { width: columnWidths[3] });
          xPosition += columnWidths[3];
          
          // Amount
          doc.text(`₹${item?.sum_amt?.toFixed(2) || '0.00'}`, xPosition, yPosition, { width: columnWidths[4] });
          
          yPosition += 20;
        });
      });

      doc.end();

      fileStream.on('finish', () => {
        resolve(pdfFilePath);
      });

    } catch (error) {
      fileStream.end();
      reject(error);
    }

    fileStream.on('error', (err) => {
      reject(err);
    });
  });
};

const generatePostTaxInvoice = (summary, pdfFilePath) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 30, size: 'A4' });
    const fileStream = fs.createWriteStream(pdfFilePath);

    doc.pipe(fileStream);

    try {
      // Header
      doc.fontSize(16)
        .font('Helvetica-Bold')
        .text('TAX INVOICE', { align: 'center' })
        .moveDown(0.5);

      // Current date
      doc.fontSize(10)
        .font('Helvetica')
        .text(new Date().toLocaleString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }).replace(/\//g, '-'), { align: 'right' });

      // Supplier Information
      doc.moveDown(0.5);
      doc.text('Supplier: SUBHASH COLD DRINK CENTRE');
      doc.text('Address: HOUSE HO-13SHOP NO -1 J.F.D SOUZA CHAWL WORLI KOLIWADA, GREATER MUMBAI');
      doc.text('(SUB) MAHARASHTRA, PIN400030, GSTIN No: 27ABZPM0212C1ZU, Phone No: +919867696873');

      // Customer Information from userId
      const user = summary.userId;
      doc.moveDown(0.5);
      doc.text(`Customer: ${user.name}`);
      doc.text(`Address: ${user.address.line1}, ${user.address.line2}, ${user.address.state}, PIN: ${user.address.pincode}`);
      doc.text(`GSTIN: ${user.gst}, Aadhar Card: ${user.aadharcard}, PAN Card: ${user.pancard}`);
      doc.text(`Contact: ${user.number}, Email: ${user.email}`);

      // Invoice Information
      doc.moveDown(0.5);
      doc.text(`Invoice Date: ${new Date(summary.order_date).toLocaleDateString('en-GB')}`);

      // Table
      const tableTop = doc.y + 20;
      const columns = [
        { header: 'Item', width: 100 },
        { header: 'Description', width: 120 },
        { header: 'Qty', width: 50 },
        { header: 'Rate', width: 50 },
        { header: 'Total', width: 50 },
        { header: 'Discount', width: 50 },
        { header: 'Taxable Value', width: 65 },
        { header: 'GST (18%)', width: 70 },
      ];

      // Draw headers
      let xPos = 30;
      doc.font('Helvetica-Bold').fontSize(9);
      columns.forEach(col => {
        doc.text(col.header, xPos, tableTop, { width: col.width, align: 'center' });
        xPos += col.width;
      });

      // Draw rows
      let yPos = tableTop + 20;
      doc.font('Helvetica').fontSize(9);
      summary.orders.forEach(order => {
        const item = order.item_id;

        // Calculate row data
        const discount = (order.sum_amt * 0.05).toFixed(2);
        const taxableValue = (order.sum_amt - discount).toFixed(2);
        const gst = (taxableValue * 0.18).toFixed(2);
        const total = (parseFloat(taxableValue) + parseFloat(gst)).toFixed(2);

        // Draw each cell
        let cellXPos = 30;
        const rowData = [
          item.item,
          `${item.description} - ${item.flavour}`,
          order.qty,
          item.price.toFixed(2),
          order.sum_amt.toFixed(2),
          discount,
          taxableValue,
          gst,
        ];

        rowData.forEach((cell, index) => {
          doc.text(cell, cellXPos, yPos, {
            width: columns[index].width,
            align: index > 2 ? 'right' : 'left', // Right-align numeric data
          });
          cellXPos += columns[index].width;
        });

        yPos += 20;

        // Add new page if needed
        if (yPos > doc.page.height - 50) {
          doc.addPage();
          yPos = 50;
        }
      });

      // Total Amount
      doc.moveDown(2);
      doc.text(`Total Amount: ₹${summary.orders.reduce((sum, order) => sum + order.sum_amt, 0).toFixed(2)}`, { align: 'right' });

      doc.end();

      fileStream.on('finish', () => resolve(pdfFilePath));
      fileStream.on('error', (err) => reject(err));
    } catch (error) {
      fileStream.end();
      reject(error);
    }
  });
};


const generatePreTaxInvoice = (loadout, pdfFilePath) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ 
      margin: 30,
      size: 'A4'  // Explicitly set A4 size
    });
    const fileStream = fs.createWriteStream(pdfFilePath);
    
    doc.pipe(fileStream);

    try {
      // Header
      doc.fontSize(16).font('Helvetica-Bold')
        .text('TAX INVOICE', { align: 'center' })
        .moveDown(0.5);

      // Current date
      doc.fontSize(10).font('Helvetica')
        .text(new Date().toLocaleString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        }).replace(/\//g, '-'), { align: 'right' });

      // Supplier Information - Split into multiple lines for better readability
      doc.moveDown(0.5);
      doc.text('Supplier : SUBHASH COLD DRINK CENTRE', { continued: true })
         .text(' Address : HOUSE HO-13SHOP NO -1 J.F.D SOUZA CHAWL WORLI KOLIWADAGREATER MUMBAI');
      
      doc.text('(SUB) MAHARASHTRA, PIN400030, GSTIN No :27ABZPM0212C1ZU, Phone No : +919867696873');

      // License Information on same line with proper spacing
      doc.moveDown(0.5);
      const licenseY = doc.y;
      doc.text('Lic No : 11516004000258', 30, licenseY);
      doc.text('Lic Exp Date : 02 Apr 2026', { align: 'right' });

      loadout.order_id.forEach((order, index) => {
        if (index > 0) {
          doc.addPage();
        }

        // Invoice and LoadOut numbers on same line
        doc.moveDown(0.5);
        const invoiceY = doc.y;
        doc.text(`Invoice No - Date : PB2INV-758847 - ${new Date().toLocaleDateString('en-GB')}`, 30, invoiceY);
        doc.text(`LoadOutNo : PL-2354`, { align: 'right' });

        // Table with adjusted column widths and positions
        const tableTop = doc.y + 20;
        const columns = [
          { header: 'HSNCode', width: 60 },
          { header: 'Description of Goods', width: 120 },
          { header: 'Qty(CS.EA)', width: 60 },
          { header: 'Rate', width: 50 },
          { header: 'Total', width: 50 },
          { header: 'Discount', width: 50 },
          { header: 'TaxbleValue', width: 70 },
          { header: 'CGST\nRate%', width: 40 },
          { header: 'Amt', width: 40 },
          { header: 'SGST\nRate%', width: 40 },
          { header: 'Amt', width: 40 },
          { header: 'CESS\nRate%', width: 40 },
          { header: 'Amt', width: 40 },
          { header: 'NetAmt', width: 50 }
        ];

        // Draw table headers
        let xPos = 30;
        doc.font('Helvetica-Bold').fontSize(9);
        columns.forEach(col => {
          doc.text(col.header, xPos, tableTop, { width: col.width, align: 'center' });
          xPos += col.width;
        });

        // Draw table content
        let yPos = tableTop + 30;
        doc.font('Helvetica').fontSize(9);
        
        order.order.forEach((item) => {
          xPos = 30;
          const itemDetails = item.item_id;

          // Reset xPos for each column and draw cell content
          columns.forEach((col, index) => {
            let cellContent = '';
            switch(index) {
              case 0: cellContent = '22021010'; break;
              case 1: cellContent = `${itemDetails.item} ${itemDetails.flavour}`; break;
              case 2: cellContent = item.qty.toString(); break;
              case 3: cellContent = itemDetails.price.toFixed(2); break;
              case 4: cellContent = (item.qty * itemDetails.price).toFixed(2); break;
              case 5: cellContent = ((item.qty * itemDetails.price) * 0.05).toFixed(2); break;
              case 6: cellContent = ((item.qty * itemDetails.price) * 0.95).toFixed(2); break;
              case 7: cellContent = '9'; break;
              case 8: cellContent = ((item.qty * itemDetails.price) * 0.95 * 0.09).toFixed(2); break;
              case 9: cellContent = '9'; break;
              case 10: cellContent = ((item.qty * itemDetails.price) * 0.95 * 0.09).toFixed(2); break;
              case 11: cellContent = '9'; break;
              case 12: cellContent = ((item.qty * itemDetails.price) * 0.95 * 0.09).toFixed(2); break;
              case 13: cellContent = (((item.qty * itemDetails.price) * 0.95) * (1 + 0.09 + 0.09 + 0.09)).toFixed(2); break;
            }
            
            doc.text(cellContent, xPos, yPos, { 
              width: col.width, 
              align: index > 2 ? 'right' : 'left'  // Right align numbers
            });
            xPos += col.width;
          });

          yPos += 20;
        });

        // Draw table borders
        doc.rect(30, tableTop - 5, sum(columns.map(col => col.width)), yPos - tableTop + 10).stroke();
      });

      doc.end();

      fileStream.on('finish', () => {
        resolve(pdfFilePath);
      });

    } catch (error) {
      fileStream.end();
      reject(error);
    }

    fileStream.on('error', (err) => {
      reject(err);
    });
  });
};

const sum = arr => arr.reduce((a, b) => a + b, 0);

// Fetch Orders by User ID
const getOrdersByUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Fetch orders based on user_id from the database
    const orders = await Order.find({ user_id: userId });

    // If no orders are found for the user, return a 404 response
    if (!orders || orders.length === 0) {
      return res.status(404).json({ success:false, error:true, message: "No orders found for this user." });
    }

    // If orders are found, return the orders data
    res.status(200).json({success:true, error:false, orders:orders});
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Server Error", error: true, success:false });
  }
};

const getAllOrders = async (req, res) => {
  const {startDate, endDate} = req.query;
  console.log(startDate)
  console.log(endDate)
  try {
    // Fetch all orders from the database
    let filters = {
      status: 'Orders'
    }
    if(startDate){
      filters.createdAt = { $gte: new Date(startDate) }
    }
    if(endDate){
      filters.createdAt = { $lte: new Date(endDate) }
    }
    const orders = await Order.find(filters).populate({
      path: 'user_id',
      select: 'name email shopname',
      model: 'Users'
    }).populate({
      path: 'order.item_id',
      model: 'Inventory'
    });

    // If no orders are found, return a 404 response
    if (!orders || orders.length === 0) {
      console.log("No orders")
      return res.status(404).json({ message: "No orders found.", success:false, error:true });
    }

    // If orders are found, return the orders data
    res.status(200).json({success:true, error:false, orders:orders});
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({ message: "Failed to fetch orders", error: true, success:false });
  }
}

const getAllLoadouts = async (req, res) => {
  try {
    // Fetch all orders from the database
    const loadouts = await Loadout.find({agentAssign: false}).populate({
      path: 'order_id',
      populate: {
        path: 'order.item_id',
        model: 'Inventory'
        },
    });

    // If no orders are found, return a 404 response
    if (!loadouts || loadouts.length === 0) {
      console.log("No Loadout")
      return res.status(404).json({ message: "No loadouts found.", success:false, error:true });
    }

    // If orders are found, return the orders data
    res.status(200).json({success:true, error:false, loadouts:loadouts});
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({ message: "Failed to fetch orders", error: true, success:false });
  }
}

const getLoadoutName = async(req,res )=>{
  try{
    const loadout = await Loadout.find({agentAssign:false}).select('name')
    if(!loadout){
      return res.status(404).json({success:false, error:true, message: "No loadout present"})
    }
    res.status(200).json({success:true, error:false, loadout:loadout})
  }catch(err){
    console.error("Error fetching loadout name:", err);
    res.status(500).json({ message: "Failed to fetch loadout name", error:true, success:fale})
  }
}

const updateLoadout = async(req,res )=>{
  const {name, _id, order_id} = req.body;
  if(order_id?.length < 1){
    return res.status(400).json({success:false, error:true, message: "Order ID is required"})
  }
  try{
    if(name){
      const newLoadout = new Loadout({
        name: name,
        order_id: order_id,
        agentAssign: false
      })
      await newLoadout.save()
    }else{
      const loadout = await Loadout.findOneAndUpdate(
        { _id: _id }, 
        { $addToSet: { order_id: { $each: order_id } } }, 
        { new: true } 
    );
    }
    const updates = order_id?.map(id => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { status: 'LoadOut' } }, 
      },
    }));
    const result = await Order.bulkWrite(updates);
    res.status(200).json({success:true, error:false, message: "Loadout updated successfully"})
  }catch(err){
    console.error("Error fetching loadout name:", err);
    res.status(500).json({ message: "Failed to fetch loadout name", error:true, success:fale})
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

const deleteLoadout = async (req,res,next)=>{
  const { loadout_id , order_id } = req.body;
  if(!loadout_id || !order_id){
    return res.status(400).json({success:false, error:true, message: 'Id is not provided'})
  }
  try{
    const loadout = await Loadout.findOne({_id:loadout_id});
    if(!loadout){
      return res.status(404).json({success:false, error:true, message: 'Loadout is missing'})
    }
    const orderIdToUpdate = loadout?.order_id?.find(order=>order==order_id)
    loadout.order_id = loadout?.order_id?.filter(order=>order!=order_id)
    console.log(orderIdToUpdate)
    await Order.findOneAndUpdate({_id:orderIdToUpdate},{status:'Orders'})
    await loadout.save();
    res.status(200).json({success:true, message: 'Loadout deleted successfully', error:false})
  }catch(err){
    console.log(err)
    res.status(500).json({success:false, error:true, message: 'Failed to delete'})
  }
}

const getAgent = async (req,res,next)=>{
  try{
    const agents = await Agent.find({availabilityStatus:'Available'})
    res.status(200).json({success:true, error:false, agents:agents})
  }catch(err){
    console.log(err)
    res.status(500).json({success:false, error:true, message:"server Error"})
  }
}

const assignAgent = async (req, res, next) => {
  const { agent_id, loadout_id } = req.body;

  if (!agent_id || !loadout_id) {
    return res.status(400).json({ success: false, error: true, message: 'Id is not provided' });
  }

  try {
    const loadout = await Loadout.findOne({ _id: loadout_id })
      .populate({
        path: 'order_id',
        populate: {
          path: 'order.item_id',
          model: 'Inventory',
        },
      });

    if (!loadout) {
      return res.status(404).json({ success: false, error: true, message: 'Loadout is missing' });
    }

    const agent = await Agent.findOne({ _id: agent_id });

    if (!agent) {
      return res.status(404).json({ success: false, error: true, message: 'Agent is missing' });
    }

    const addDispatch = new Dispatch({
      agent_id,
      loadout_id,
      status: 'pending',
    });

    const orderToDispatch = {};

    loadout.order_id.forEach((order) => {
      order.order.forEach((ord)=>{
        const itemId = ord.item_id._id;
        const qty = ord.qty;
        orderToDispatch[itemId] = (orderToDispatch[itemId] || 0) + qty;
      })
    });
        // const updatePromises = Object.keys(orderToDispatch).map((key) => {
        //   console.log("Order here is", orderToDispatch[key])
        //   return Inventory.updateOne(
        //     { _id: key },
        //     { $inc: { qty: -orderToDispatch[key] } }
        //   );
        // });
        // const results = await Promise.all(updatePromises);
        // console.log(results)

    const bulkOperations = Object.entries(orderToDispatch).map(([id, qty]) => ({
      updateOne: {
        filter: { _id: id },
        update: { $inc: { qty: -qty } },  
      },
    }));

    console.log(bulkOperations)

    await Inventory.bulkWrite(bulkOperations);
    await addDispatch.save();

    loadout.agentAssign = true;
    await loadout.save();

    agent.availabilityStatus = 'Busy';
    await agent.save();

    res.status(200).json({ success: true, error: false, message: 'Agent assigned successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: true, message: 'Failed to assign agent, server error' });
  }
};

const getDispatch = async(req,res,next)=>{
  try{
    const dispatch = await Dispatch.find()
  .populate({ path: 'agent_id' })
  .populate({
    path: 'loadout_id',
    populate: {
      path: 'order_id',
      populate: {
        path: 'order.item_id',
        model: 'Inventory', 
      },
    },
  });
    res.status(200).json({ success: true, error: false, data: dispatch });
  }catch(err){
    console.error(err);
    res.status(500).json({success:false, error: true, message: 'Failed to get dispatch, server error'});
  }
}

const generateLoadoutPdf = async(req,res,next)=>{
  const {id} = req.body;
  if(!id){
    return res.status(400).json({success:false, error:true, message:'Loadout id is missing'})
  }
  try{
    const loadout = await Loadout.findOne({_id: id}).populate({
      path: 'order_id',
      populate: [
        {
        path: 'order.item_id',
        model: 'Inventory'
        },
        {
          path: 'user_id',
          model: 'Users',
        },
      ]  
    });
    const pdfFileName = `loadout_${id}.pdf`;
    const pdfFilePath = path.join(__dirname, 'public', 'pdfs', pdfFileName);
    await generateLoadoutPDF(loadout, pdfFilePath);
    res.download(pdfFilePath, pdfFileName, (err) => {
      if (err) {
        console.error("Error during file download", err);
        res.status(500).json({ success: false, error: true, message: 'Failed to download the PDF' });
      }
    });
  }catch(err){
    console.error(err);
    res.status(500).json({success:false, error:true, message:'Failed to generate pdf, server error'})
  }
}

const generatePreBillInvoice=async(req,res,next)=>{
  const {id} = req.body;
  if(!id){
    return res.status(400).json({success:false, error:true, message:'Prebill id is not generated'});
  }
  try{
    const dispatch = await Dispatch.findOne({_id: id})
    if(!dispatch || !dispatch.loadout_id){
      return res.status(404).json({success:false, error:true, message:'Dispatch not found'})
    }
    const loadout = await Loadout.findOne({_id: dispatch.loadout_id}).populate({
      path: 'order_id',
      populate: [
        {
        path: 'order.item_id',
        model: 'Inventory'
        },
        {
          path: 'user_id',
          model: 'Users',
        },
      ]  
    })
    const pdfFileName = `loadout_${id}.pdf`;
    const pdfFilePath = path.join(__dirname, 'public', 'dispatch', pdfFileName);
    await generatePreTaxInvoice(loadout, pdfFilePath);
    res.download(pdfFilePath, pdfFileName, (err) => {
      if (err) {
        console.error("Error during file download", err);
        res.status(500).json({ success: false, error: true, message: 'Failed to download the PDF' });
      }
    });
  }catch(err){
    console.error(err);
    res.status(500).json({success:false, error:true, message:'Failed to generate pre bill invoice'})
  }
}

const settleDispatch = async (req, res, next) => {
  const { id, data } = req.body;

  try {
    const dispatch = await Dispatch.findOne({ _id: id });
    if (!dispatch) {
      return res.status(404).json({ success: false, error: true, message: 'Dispatch not found' });
    }

    const loadout = await Loadout.findOne({ _id: dispatch.loadout_id }).populate({
      path: 'order_id',
      populate: {
        path: 'order.item_id',
        model: 'Inventory',
      },
    });

    if (!loadout) {
      return res.status(404).json({ success: false, error: true, message: 'Loadout not found' });
    }

    for (const order of loadout.order_id) {
      const orderId = order._id;
      const summaryItems = []; // To store items for the current order
      let totalAmount = 0; // To calculate the total amount for the current order

      for (const item of order.order) {
        const itemId = item.item_id._id;
        const returnedQty = data[orderId]?.[itemId] || 0;

        if (returnedQty > 0) {
          const inventory = await Inventory.findOne({ _id: itemId });
          if (inventory) {
            inventory.qty += Number(returnedQty);
            await inventory.save();
          }

          item.qty -= returnedQty; 
          if (item.qty < 0) {
            item.qty = 0;
          }
        }

        // Add item to the summaryItems array
        summaryItems.push({
          item_id: itemId,
          qty: item.qty,
          sum_amt: item.qty * item.item_id.price,
        });

        totalAmount += item.qty * item.item_id.price;
      }

      // Create a single summary entry for the current order
      if (summaryItems.length > 0) {
        await Summary.create({
          userId: order?.user_id,
          orders: summaryItems,
          order_date: new Date(order?.createdAt),
          total_amt: totalAmount,
        });
      }
    }

    // Filter and clean up orders
    loadout.order_id.forEach((order) => {
      order.order = order.order.filter((item) => item.qty > 0);
    });

    await Promise.all([
      Order.deleteMany({ _id: { $in: loadout.order_id.map((o) => o._id) } }),
      Loadout.deleteOne({ _id: loadout._id }),
      Dispatch.deleteOne({ _id: dispatch._id }),
    ]);

    res.status(200).json({
      success: true,
      error: false,
      message: 'Dispatch settled successfully, orders saved to summary, and records deleted.',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: true, message: 'Failed to settle dispatch' });
  }
};

const getSummary=async(req,res,next)=>{
   try {
    const summaries = await Summary.find()
      .populate({
        path: 'orders.item_id',
        model: 'Inventory', 
      })
      .populate({
        path: 'userId', 
        model: 'Users',
      });
      res.status(200).json({success:true, error:false, summaries:summaries});
   }catch(err){
    console.error(err);
    res.status(500).json({ success: false, error: true, message: 'Failed to fetch summaries' });
   }
}

const generatePostBillInvoice=async(req,res,next)=>{
  const {id} = req.body;
  if(!id){
    return res.status(400).json({success:false, error:true, message:'Prebill id is not generated'});
  }
  try{
    const summary = await Summary.findOne({_id: id}).populate({
      path: 'orders.item_id',
      model: 'Inventory', 
    })
    .populate({
      path: 'userId', 
      model: 'Users',
    });
    const pdfFileName = `summary_${id}.pdf`;
    const pdfFilePath = path.join(__dirname, 'public', 'summary', pdfFileName);
    await generatePostTaxInvoice(summary, pdfFilePath);
    res.download(pdfFilePath, pdfFileName, (err) => {
      if (err) {
        console.error("Error during file download", err);
        res.status(500).json({ success: false, error: true, message: 'Failed to download the PDF' });
      }
    });
  }catch(err){
    console.error(err);
    res.status(500).json({success:false, error:true, message:'Failed to generate pre bill invoice'})
  }
}


module.exports = {
  getOrdersByUser,
  getAllOrders,
  getTotalSales,
  getLoadoutName,
  updateLoadout,
  getAllLoadouts,
  deleteLoadout,
  getAgent,
  assignAgent,
  getDispatch,
  generateLoadoutPdf,
  generatePreBillInvoice,
  settleDispatch,
  getSummary,
  generatePostBillInvoice
}