const bcrypt = require('bcrypt');
const Admin = require('../models/admin')
const jwt = require('jsonwebtoken')

exports.login = async (req, res, next) => {
    const { username, password } = req.body;

    // Validate request body
    if (!username || !password) {
        return res.status(400).json({
            message: 'Please enter both username and password',
            success: false,
            error: true,
        });
    }

    try {
        // Find the admin in the database
        const admin = await Admin.findOne({ username });
        if (!admin) {
            return res.status(400).json({
                message: 'Invalid username or password',
                success: false,
                error: true,
            });
        }

        const isMatch = await bcrypt.compare(password, admin?.password);
        if (!isMatch) {
            return res.status(400).json({
                message: 'Invalid password',
                success: false,
                error: true,
            });
        }

        const token = jwt.sign(
            { userId: admin._id, username: admin.username },
            process.env.JWT_SECRET || 'your_secret_key',
            { expiresIn: '1d' } 
        );

        // // Set token as an HTTP-only cookie
        // res.cookie('token', token, {
        //     httpOnly: true,
        //     secure: true, // Use 'false' for development if not using HTTPS
        //     sameSite: 'strict',
        //     maxAge: 24 * 60 * 60 * 1000, // 1 day
        // });

        // Successful response
        return res.status(200).json({
            message: 'Logged in successfully',
            success: true,
            error: false,
            token: token,
            name: admin.username,
        });
    } catch (err) {
        console.error('Error during login:', err);
        return res.status(500).json({
            message: 'Server error',
            success: false,
            error: true,
        });
    }
};

exports.getAdmin = async (req,res,next) =>{
    console.log(req.user)
    try {
        const admin = await Admin.findOne({ username: 'admin' });
        if (!admin) {
            return res.status(404).json({success:false, error:true, message: 'Admin not found'});
        }
        return res.status(200).json({success:true, error:false, admin: admin});
    }catch(err){
        console.error('Error during get admin:', err);
        return res.status(500).json({success:false, error:true, message: 'Server error'});
    }
}