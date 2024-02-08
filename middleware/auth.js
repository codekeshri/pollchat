const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authenticate = async(req, res, next)=>{
    try{
        const token = req.header('authorization');
        if(!token) return res.status(401).json({success:false, message:'Token Missing'});
        const decodedUser = jwt.verify(token, 'secretKey');
        const userid = decodedUser.userId;
        const user =  await User.findOne({where: {id: userid}, attributes: {exclude: ['password']}});
            req.user = user;
            console.log(req.user.id);
            next();

    }catch (err){
        return res.status(401).json({success:"Not authenticated"});
    }
}

module.exports = {
    authenticate
};





