const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const requirePlan = require('../middlewares/roleMiddleware');

const router = express.Router();
//GET /api/users/Profile
//get logged in users profiles
router.get('/profile', authMiddleware, (req, res)=>{
    res.json({
        user:{
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            current_plan: req.user.current_plan ? req.user.current_plan.name : 'None',
            joined_at: req.user.created_at
        }
    })
})

//GET /api/users/dashboard
//user Dasboard
router.get('/dashboard', authMiddleware, (req, res) => {
  res.json({ 
    message: `Welcome to your dashboard, ${req.user.name}!`,
    plan_info: `You are currently on the ${req.user.current_plan ? req.user.current_plan.name : 'Free'} plan.`
  });
});

//GET /appi/users/premium-content
//permium content access
router.get(
  '/premium-content', 
  authMiddleware, 
  requirePlan(['Premium']), // Use our role middleware to restrict access
  (req, res) => {
    res.json({
      message: 'Welcome to the Premium Content section!',
      content: 'Here are some exclusive tutorials and downloads only available for premium members.'
    });
  }
);

//GET /appi/users/basic-content
//permium content access

router.get(
  '/basic-content', 
  authMiddleware, 
  requirePlan(['Basic', 'Premium']), // Both Basic and Premium can access
  (req, res) => {
    res.json({
      message: 'Welcome to the Basic Content section!',
      content: 'Here is content for Basic and Premium members.'
    });
  }
);

module.exports = router;