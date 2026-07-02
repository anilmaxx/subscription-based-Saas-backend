const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware')
const Plan = require('../models/Plan')
const Subscription = require("../models/Subscription");
const User = require('../models/User')

const router = express.Router();


//POST /api/subscriptions/subscribe
//subscribe to a plan for login user

router.post('/subscribe', authMiddleware, async(req, res)=>{
    try{
        const { plan_id } = req.body;
        const userId = req.user._id;

        //check if the plan exists
        const plan = await Plan.findById(plan_id);
        if(!plan){
            return res.status(404).json({ message: 'Plan not found' });
        }

        //set an end date
        const endDate = new Date();
        endDate.setDate(endDate.getDate()+30);

        // create and store  sub data
        const newSubscription = new Subscription({
        user_id: userId,
        plan_id: plan._id,
        end_date: endDate,
        status: 'active'
        });

        await newSubscription.save();

        //upadte user current paln
        req.user.current_plan = plan._id;
        await req.user.save();

        res.json({ message: `Successfully subscribed to ${plan.name} plan`, subscription: newSubscription });
    } catch (error){
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// PUT /api/subscriptions/upgrade-plan
// upgrade or downdrade the plan for login user

router.put('/upgrade-plan', authMiddleware, async (req, res) => {
  try {
    const { new_plan_id } = req.body;
    const newPlan = await Plan.findById(new_plan_id);
    if (!newPlan) {
      return res.status(404).json({ message: 'New plan not found' });
    }

    // Cancel old subscription (simple implementation)
    await Subscription.updateMany(
      { user_id: req.user._id, status: 'active' },
      { status: 'expired' }
    );

    // Create new subscription
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30);

    const newSubscription = new Subscription({
      user_id: req.user._id,
      plan_id: newPlan._id,
      end_date: endDate,
      status: 'active'
    });

    await newSubscription.save();

    // Update User model
    req.user.current_plan = newPlan._id;
    await req.user.save();

    res.json({ message: `Successfully changed plan to ${newPlan.name}`, subscription: newSubscription });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }

  

});

//POST /api/subscriptions/cancel
//Cancel current subscription
router.post('/cancel', authMiddleware, async (req, res) => {
  try {
    // Mark subscriptions as cancelled
    await Subscription.updateMany(
      { user_id: req.user._id, status: 'active' },
      { status: 'cancelled' }
    );

    // Revert user to 'Free' plan by default, or just set to null
    const freePlan = await Plan.findOne({ name: 'Free' });
    if (freePlan) {
      req.user.current_plan = freePlan._id;
    } else {
      req.user.current_plan = null;
    }
    
    await req.user.save();

    res.json({ message: 'Subscription cancelled successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// GET /api/subscriptions/my-subscription
router.get('/my-subscription', authMiddleware, async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ user_id: req.user._id, status: 'active' }).populate('plan_id');
    res.json(subscriptions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
