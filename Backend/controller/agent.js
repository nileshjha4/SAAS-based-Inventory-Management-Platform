const Agent = require('../models/agent')
const jwt = require('jsonwebtoken');
const secret = process.env.SECRET_KEY
const Dispatch = require('../models/dispatch')

exports.login=(async(req,res,next)=>{
    const {email,password} = req.body;
    console.log(email)
    console.log(password)
    if(!email || !password){
        return res.status(400).json({message:'fields missing', error:true, success:false})
    }
    try{
        const agent = await Agent.findOne({agentname:email, password});
        if(!agent){
            return res.status(401).json({message:'user not found', error:true, success:false})
        }
        const payload = {
            userId: agent._id,
            username: agent.username
        };
        const token = jwt.sign(payload, secret);
        res.status(200).json({
            message: 'Login Successful',
            token: token,
            error:false,
            success:true 
        });
    }catch(error){
        console.log(error)
        res.status(500).json({message:'server error'})
    }
})

exports.getDelivery=(async(req,res,next)=>{
    console.log("hit 1")
    const {userId} = req.user;
    if(!userId){
        return res.status(401).json({message:'userId is not found', error:true, success:false})
    }
    console.log("hit 2")
    try{
        const dispatch = await Dispatch.findOne({agent_id: userId, status:'pending'})
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
})