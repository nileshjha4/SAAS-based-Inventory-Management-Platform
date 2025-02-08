const jwt = require('jsonwebtoken')
function auth(req,res,next){
    try{
    const authHeader = req.headers['authorization']
    if(authHeader == null){
        return res.status(401).json({success:false, error:true, message:'unable to authorize'})
    }
    const user = jwt.verify(authHeader,process.env.SECRET_KEY)
    req.user = user
    next()
    }catch(err){
        console.log("ERROR: ",err)
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, error: true, message: 'Token expired' });
        }
        return res.status(403).json({ success: false, error: true, message: 'Invalid or expired token' });
    }
}
module.exports = auth