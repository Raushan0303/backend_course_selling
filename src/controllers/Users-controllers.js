import User from "../models/users.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import { z } from "zod";
import { JWT_SECRET } from "../config/config.js";
import dotenv from 'dotenv';
import { generateOtp } from "../utils/otp.utils.js";
import { sendOtp } from "../utils/send-otp.js";
import passport from "passport";
dotenv.config();


export const SignUp = async (req, res) => {
    
    try {
        const requiredBody = z.object({
            email: z.string().min(8).max(30).email(),
            name: z.string().min(3).max(30),
            password: z.string().min(5).max(30),
            role: z.enum(['Admin','User']),
        })

        const parseDataWithSuccess = requiredBody.safeParse(req.body);
        if(!parseDataWithSuccess.success){
            res.json({
                message: "Incorrect Format"
            })
            return
        }

        const { name, email, password, role } = req.body;
        const findUserExist = await User.findOne({ email: email });
        const hashedPassword = await bcrypt.hash(password, 10);

        if (findUserExist) {
            return res.status(409).json({ 
                message: "Email already exists, try to use another email",
                success: false,
            });
        } else {
            const response = await User.create({
                name: name,
                email: email,
                password: hashedPassword,
                role: role, 
            });
            await sendOtp(email);
            return res.status(201).json({
                message: "You are signed up",
                data: response,
                success: true,
                err: {},
            });
        }
    } catch (error) {
        console.error(error); 
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            err: error.message, 
        });
    }
};

export const signin = async (req, res) => {
    try {
      const { email, password } = req.body;
    
      const userExist = await User.findOne({ email });
      if (!userExist) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
  
      console.log("user data", userExist.id);
      
      const isMatch = await bcrypt.compare(password, userExist.password);
      console.log("ismatch", isMatch);
      
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
  
      const payload = { id: userExist.id };

      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
      console.log("token", token);
  
      res.status(200).json({
        message: 'Login successful',
        token: `Bearer ${token}`,
      });
    } catch (error) {
      console.error(error); 
      return res.status(500).json({ message: 'Internal server error', error });
    }
  };

  export const verify = async (req, res) => {
    const { email, otp } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ 
          message: "User not found", 
          success: false 
        });
      }
  
      const dbOtp = user.otp;
  
      if (dbOtp === otp) {
        await User.findOneAndUpdate(
          { email }, 
          { isVerified: true },
          { new: true } 
        );
  
        return res.status(201).json({
          message: "User is verified",
          success: true,
          error: {}
        });
      } else {
        return res.status(400).json({
          message: "Invalid OTP",
          success: false
        });
      }
    } catch (error) {
      console.error("Error verifying user:", error);
  
      return res.status(500).json({
        message: "Server error",
        success: false,
        error: error.message 
      });
    }
  };
  // Trigger Google OAuth flow
export const googleAuth = passport.authenticate('google', {
  scope: ['profile', 'email']  
});

export const googleAuthCallback = (req, res, next) => {
  passport.authenticate('google', { session: false }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({ message: 'Something went wrong' });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

    res.redirect(`/auth/success?token=${token}`);
  })(req, res, next);
};

export const getUserDetails = async (req, res) => {
  try {
    console.log('Getting user details for user ID:', req.user.id); // Add this line
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      console.log('User not found'); // Add this line
      return res.status(404).json({ message: "User not found" });
    }
    console.log('User details found:', user); // Add this line
    res.json(user);
  } catch (error) {
    console.error('Error in getUserDetails:', error);
    res.status(500).json({ message: "Server error" });
  }
};
