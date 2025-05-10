const bcrypt = require('bcryptjs')
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

//Register User
exports.register = async(req,res)=>{
    const session = await mongoose.startSession()  //Session Start
    session.startTransaction()  //Transaction Start
    try{
        const {name,email,password} = req.body
        //Check if user already exists
        const existingUser = await User.findOne({email})
        if(existingUser){
            return res.status(400).json({ msg: "User already exists" })
        }
        //Create Salt and Hash password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)
        //Create new user
        const newUser = await User.create({
            name,
            email,
            password:hashedPassword,
        })

        //Generate JWT Token
        const token = jwt.sign(
            { id: newUser._id, email: newUser.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        )

        //Commit the transaction
        await session.commitTransaction()

        //Send response with token and user data
        res.status(201).json({
            message:'User created successfully',
            token,
        })

    }catch(err){
        res.status(500).json({
            message:err.message
        })
    }finally{
        //End the session
        session.endSession()
    }
}

//Login User
exports.login = async(req,res)=>{
    try{
        const {email,password} = req.body
        if(!email || !password){
            return res.status(400).json({ msg: "Email & Password are required" })
        }
        const user = await User.findOne({email})
        if(!user){
            return res.status(404).json({ msg: "User not found" })
        }
        //Check password
        const isPwdValid = await bcrypt.compare(password,user.password)
        if(!isPwdValid){
            return res.status(401).json({msg:"Invalid Password"})
        }
        const token = jwt.sign({id: user._id},process.env.JWT_SECRET,{expiresIn:'1h'})

        //Send response with token and user data
        res.status(200).json({
            msg:"Login successful",
            token,
            user:{
                id:user._id,
                name:user.name,
                email:user.email,
                createdAt:user.createdAt,
            }
        })
    }catch(err){
        res.status(500).json({
            message:err.message
        })
    }
}

