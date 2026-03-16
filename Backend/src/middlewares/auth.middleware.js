const jwt = require('jsonwebtoken')
const blacklistModel = require('../models/blacklist.model')

async function authUser(req,res,next){
    const token =req.cookies.token

    if(!token){
        return res.status(401).json({
            message:'token not provided'
        })
    }

    const isTokenBlacklisted=await blacklistModel.findOne({token})

    if(isTokenBlacklisted){
        return res.status(401).json({message:'token is invalid'})
    }

    try{
        const decode = jwt.verify(token , process.env.JWT_SECRET)

        req.user=decode

        next()

    }catch(err){
        return res.status(401).json({
            message:'invalid token'
        })
    }
    
}
module.exports={authUser}