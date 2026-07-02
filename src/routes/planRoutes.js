const express = require('express');
const Plan = require('../models/Plan');

const router = express.Router();

//GET /api/plans
//get all availble subscriptions

router.get('/', async (req, res)=>{
    try{
        const plans = await Plan.find();
        res.json(plans)
    } catch(error){
        console.error(error);
        res.status(500).json({
            message: 'server Error'
        })
    }
})

module.exports = router;