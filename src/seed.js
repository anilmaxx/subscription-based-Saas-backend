const mongoose = require('mongoose')
const dotenv = require('dotenv')
const Plan = require('./models/Plan')

dotenv.config();

const seedPlans = async () =>{
    try{
        await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for seeding...');
   
    //clear  existing plans to avoid duplicates
    await Plan.deleteMany();
    console.log('Existing plans cleared.');

    const plans=[
        {
        name: 'Free',
        price: 0,
        features: ['Basic Access', '1GB Storage', 'Community Support']
      },
      {
        name: 'Basic',
        price: 9.99,
        features: ['Full Access', '10GB Storage', 'Email Support']
      },
      {
        name: 'Premium',
        price: 29.99,
        features: ['Full Access', '100GB Storage', 'Priority Support', 'Exclusive Content']
      }
    ];

    await Plan.insertMany(plans);
    console.log('Default plans seeded successfully!');
    process.exit();
    } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
    
}

seedPlans();