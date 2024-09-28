import express from 'express';
import bodyParser from 'body-parser';
import { connect } from './config/db.js';
import passport from 'passport';
import session from 'express-session';
import './config/passport-google.js';
import userRoutes from './routes/userRouter.js';
import courseRoute from './routes/courseRouter.js'
import { Secret_key } from './config/config.js';


const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: Secret_key,  
  resave: false,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session()); 


app.use('/api/v1', userRoutes);
app.use('/api/v1',courseRoute);


app.listen(3000, async () => {
  console.log(`Server is running on port 3000`);
  await connect(); 
  console.log('MongoDB connected');
});
