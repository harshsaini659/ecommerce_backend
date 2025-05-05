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

