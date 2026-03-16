const userModel = require('../models/user.model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')  
const blacklistModel = require('../models/blacklist.model')

/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public
 */

async function registerUserController(req,res){
    try {
        const {username,email,password}=req.body

        if(!username || !email || !password){
            return res.status(400).json({message:'Please provide username,email and password'})
        }

        const existingUser= await userModel.findOne({$or:[{username},{email}]})

        if(existingUser){
            return res.status(400).json({message:'Username or email already taken'})
        }

        const hash = await bcrypt.hash(password,10)

        const newUser= await userModel.create({
            username,
            email,
            password:hash
        })

        const token=jwt.sign({id:newUser._id,username:newUser.username},process.env.JWT_SECRET,{expiresIn:'1d'})

        res.cookie('token',token)

        res.status(201).json({message:'User registered successfully',newUser})
        
    } catch (error) {
        res.status(400).json({message:'Error in registerUserController'})
    }


}

/**
 * @route POST /api/auth/login
 * @description Login a user
 * @access Public
 */
async function loginUserController(req,res){
    try {
        const {email,password}=req.body

        const user= await userModel.findOne({email})

        if(!user){
            return res.status(400).json({message:'Invalid credentials'})
        }

        const isMatch= await bcrypt.compare(password,user.password)

        if(!isMatch){
            return res.status(400).json({message:'Invalid credentials'})
        }

        const token=jwt.sign({id:user._id,username:user.username},process.env.JWT_SECRET,{expiresIn:'1d'})

        res.cookie('token',token)

        res.status(200).json({message:'User logged in successfully',user})

    } catch (error) {
        res.status(400).json({message:'Error in loginUserController'})
    }
}


/**
 * @route POST /api/auth/logout
 * @description Logout a user
 * @access Public
 */
async function logoutUserController(req,res){
    const token = req.cookies.token

    if(token ){
        await blacklistModel.create({token})
    }

    res.clearCookie('token')

    res.status(200).json({message:'User logged out successfully'})
}

async function getMeController(req,res){

    const user = await userModel.findById(req.user.id)

    res.status(200).json({
        message:'user details fetch successfully',
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }
    })
}

module.exports={registerUserController,loginUserController,logoutUserController,getMeController}
