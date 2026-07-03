const express = require('express');
const mongoose= require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
dotenv.config();

const authRoutes = require('./routes/authRoutes')
const planRoutes = require('./routes/planRoutes')

const app = express();
app.use(express.json());

//cookies
app.use(cookieParser());

// Security Headers
app.use(helmet());

//RateLimiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(limiter);

//mongoDB conection
const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  console.error('Missing MONGODB_URI environment variable');
  process.exit(1);
}

mongoose.connect(mongoUri)
.then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err));


//Routes
app.use('/api/auth', authRoutes)
app.use('/api/plans', planRoutes)
app.use('/api/subscriptions', require('./routes/subscriptionRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

//basic route for test
app.get('/', (req, res)=>{
  res.send('saas backend API is Running')
})

app.listen(3000, () => {
  console.log('Server is running on port 3000');
 })
