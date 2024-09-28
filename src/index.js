import express from 'express';
import bodyParser from 'body-parser';
import { connect } from './config/db.js';
import passport from 'passport';
import session from 'express-session';
import './config/passport-google.js'; // Import the file where you configured GoogleStrategy
import apiRoutes from './routes/userRouter.js';
import { Secret_key } from './config/config.js';

// Initialize Express app
const app = express();

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session management (required for persistent login)
app.use(session({
  secret: Secret_key,  // Use a strong secret key
  resave: false,
  saveUninitialized: true,
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session()); // If you plan to maintain user sessions

// Use your API routes
app.use('/api/v1', apiRoutes);

// Start server and connect to MongoDB
app.listen(3000, async () => {
  console.log(`Server is running on port 3000`);
  await connect(); // Ensure this is correctly set up to connect to MongoDB
  console.log('MongoDB connected');
});
