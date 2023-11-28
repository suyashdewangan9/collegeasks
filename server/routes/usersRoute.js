const router = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const jwt= require('jsonwebtoken');
const mongoose= require("mongoose");
const { response } = require('express');
const authMiddleware = require('../middlewares/authMiddleware');




//register new user
router.post('/register', async (req, res) => {
    try {
        //check if user aleardy exist or not
        const userExists = await User.findOne({ email: req.body.email });
        if (userExists) {
            return res.send({
                success: false,
                message: "user already exists",
            });
        }

        //hash passward

        const salt = await bcrypt.genSalt(10); //10 is no of rounds
        const hashedPassward = await bcrypt.hash(req.body.passward, salt);

        req.body.passward = hashedPassward;

        //save user
        const user = new User(req.body);
        await user.save();


        return res.send({
            success: true,
            message: "User registration successfully",
        });

    } catch (error) {
        return res.send({
            success: false,
            message: error.message,
        });
    }
});


//login user

router.post('/login',async(req,res)=>{
    try {
        //check if user exist or not
        const user =await User.findOne({email: req.body.email});
        if(!user){
            return res.send({
                success: false,
                message: "user not found",
            });
        }
        
        //compare passward
        const validPassword =await bcrypt.compare(req.body.passward,user.passward);
        if(!validPassword){
            return res.send({
                success:false,
                message:"Invalid passward",
            });
        }

        //genrate token //encrypted form of userid
        const token =jwt.sign({userId: user._id},process.env.jwt_secret,{expiresIn: '1d'});
        return res.send({
            success: true,
            message:"User logged in sucessfully",
            data: token,
        })
    } catch (error) {
        return res.send({
            sucess:false,
            message: error.message,
        });
    }
});

//get current user
router.get("/get-current-user",authMiddleware, async (req,res)=>{
    try {
       const user= await User.findOne({_id:req.body.userId});
       //remove the password from user object
       
       
       return res.send({
        success:true,
        message: "User fetched successfully",
        data: user,
       })
    } catch (error) {
        return response.send({
            success: false,
            message: error.message,
        });
    }
})

module.exports= router;