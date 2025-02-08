const bcrypt = require('bcrypt');
const User = require('../modal/user')
const Summary = require('../modal/summary')
const jwt = require('jsonwebtoken');
const secret = process.env.SECRET_KEY

exports.addUser=(async(req,res,next)=>{
    console.log("Hit 1")
    try{
    const {
        name,
        email,
        password,
        number,
        gender,
        aadharcard,
        pancard
            } = req.body
        if(!name || !number || !email || !password){
            return res.status(400).json({message:'fields missing'})
        }
        const existingUser = await User.findOne({ email });
        if (existingUser){
            return res.status(409).json({message:'user already exist'})
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const personalInfo = new User({
            name,
            email,
            password: hashedPassword,
            number,
            gender,
            aadharcard,
            pancard
            });
        const result = await personalInfo.save();
        const payload = {
                userId: result._id,
                firstname: result.firstName
            };
        const token = jwt.sign(payload, secret);
        res.status(201).json({
                message: 'Personal Info Added Successfully',
                result: result,
                token: token
        });
    }catch(error){
        console.log(error)
        res.status(500).json({message:'server error'})
    }
})

exports.addAcademic=(async(req,res,next)=>{
    const {userId} = req.user;
    if(!userId){
        return res.status(401).json({message:'unauthorized'})
    }
    try{
    const {
        line1,
        line2,
        state,
        pincode,
        gst
        } = req.body
        const existingUser = await User.findOne({ _id: userId });
        if(!existingUser){
            return res.status(404).json({message:'user not found'})
        }
        const address = {line1, line2, state, pincode}
        existingUser.address = address
        existingUser.gst = gst
        await existingUser.save()
        res.status(201).json({
                message: 'Address Info Added Successfully',
                success: true,
                error: false
        });
    }catch(error){
        console.log(error)
        res.status(500).json({message:'server error'})
    }
})

exports.login=(async(req,res,next)=>{
    const {email,password} = req.body;
    if(!email || !password){
        return res.status(400).json({message:'fields missing', error:true, success:false})
    }
    try{
        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({message:'user not found', error:true, success:false})
        }
        const isPasswordCorrect = await bcrypt.compare(password,user.password);
        if(!isPasswordCorrect){
            return res.status(401).json({message:'password is incorrect', error:true, success:false})
        }
        console.log("Hit 3")
        const payload = {
            userId: user._id,
            firstname: user.firstName
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
        res.status(500).json({message:'server error', error:true, success:false})
    }
})


exports.addGrades=(async(req,res,next)=>{
    const { userId } = req.user;
    const { pocname, poccontact } = req.body;
    if(!userId){
        return res.status(401).json({message:'Unauthorize'})
    }
    try{
        const user = await User.findOne({_id:userId})
        if(!user){
            return res.status(401).json({message:'user not found'})
        }
        user.pocname = pocname,
        user.poccontact = poccontact
        await user.save()
        res.status(200).json({message:'grades added successfully',result:user})
    }catch(error){
        console.log(error)
        res.status(500).json({message:'server error'})
    }
})