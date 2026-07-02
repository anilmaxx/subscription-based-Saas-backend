const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Plan = require('../models/Plan');


const router = express.Router();

//POST /api/auth/signup
//register a new user
router.post('/signup', async(req, res)=>{
    try{
        const {name, email, password} = req.body;

        //check the user exists
        let user = await User.findOne({email});
        if (user){
            return res.status(400).json({
                message:'user already exists'
            })
        }

        //Find the FREE plan by default
        const freePlan = await Plan.findOne({name: 'Free'});

        //password Hasing
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        // create a new user
        user = new User({
            name,
            email,
            password: hashPassword,
            current_plan: freePlan ? freePlan._id : null
        });

        //save data into database
        await user.save();
        res.status(201).json({
            message:'User registered successfully',
            userId: user._id
        });
    } catch (error){
        res.status(500).json({
             message: 'Server Error'
        })
    }
});

//POST /api/auth/login
// auth user and get token
router.post('/login', async (req, res)=>{
    try{
        const { email, password } = req.body;

        //check the email of user (include password which is excluded by default)
        const user = await User.findOne({email}).select('+password');
        if(!user){
            return res.status(400).json({
                message: 'Invaild Credentials'
            })
        }

        //check password
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({
                message: 'Invaild Credentials'
            })
        }

        //create jwt token
        const payload = { userId: user._id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '1h'});

        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 3600000 // 1 hour
        });

        res.json({ token, message: 'Logged in successfully' });
    } catch (error){
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
       }
    }
)



module.exports = router; 