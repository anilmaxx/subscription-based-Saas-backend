const requirePlan = (planNames) =>{
    return (req, res, next) =>{
        // req.user is set by authMiddleware
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    // If the user has no current plan
    if (!req.user.current_plan) {
      return res.status(403).json({ message: 'Access denied. No active plan found.' });
    }

    // Check if the user's plan name is in the allowed plan names
    const userPlanName = req.user.current_plan.name;
    
    if (!planNames.includes(userPlanName)) {
      return res.status(403).json({ 
        message: `Access denied. Requires one of the following plans: ${planNames.join(', ')}` 
      });
    }

    next();
    }
}

module.exports = requirePlan;