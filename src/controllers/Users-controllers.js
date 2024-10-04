import User from "../models/users.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import { z } from "zod";
import { JWT_SECRET } from "../config/config.js";
import dotenv from 'dotenv';
// import { generateOtp } from "../utils/otp.utils.js";
import Instructor from "../models/instructor.js";
import { sendOtp } from "../utils/send-otp.js";
import passport from "passport";
import { generateSubdomain } from "../utils/subdomain.utils.js";
dotenv.config();

export const SignUp = async (req, res) => {
  try {
    const requiredBody = z.object({
      email: z.string().min(8).max(30).email(),
      name: z.string().min(3).max(30),
      password: z.string().min(5).max(30),
      role: z.enum(['Admin', 'Instructor', 'User']),
      bio: z.string().optional(),
      profilePicture: z.string().optional(),
    });

    const parseDataWithSuccess = requiredBody.safeParse(req.body);
    if (!parseDataWithSuccess.success) {
      return res.status(400).json({ message: "Incorrect Format" });
    }

    const { name, email, password, role, bio, profilePicture } = req.body;

    // Check if the user already exists
    const findUserExist = await User.findOne({ email: email });
    if (findUserExist) {
      return res.status(409).json({
        message: "Email already exists, try to use another email",
        success: false,
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    let subdomain = null;

    // If the user is an Instructor, generate a subdomain
    if (role === 'Instructor') {
      subdomain = generateSubdomain(name);  
    }

    // Create the new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      subdomain,
    });
      if (role === 'Instructor') {
          subdomain = generateSubdomain(name);
          // Check if the generated subdomain already exists
          const existingUser = await User.findOne({ subdomain });
          if (existingUser) {
              // If it exists, append a number to make it unique
              let counter = 1;
              while (await User.findOne({ subdomain: `${subdomain}${counter}` })) {
                  counter++;
              }
              subdomain = `${subdomain}${counter}`;
          }
      }

      // const newUser = new User({
      //     name,
      //     email,
      //     password: hashedPassword,
      //     role,
      //     subdomain,
      // });

    // If the user is an Instructor, create the instructor details
    if (role === 'Instructor') {
      await Instructor.create({
        user: newUser._id,
        bio: bio || '',
        profilePicture: profilePicture || '',
      });
    }
      await newUser.save();

      if (role === 'Instructor') {
          await Instructor.create({
              user: newUser._id, 
              bio: bio || '', 
              profilePicture: profilePicture || '', 
          });
      }

    // Send OTP (Assuming this is for verification)
    await sendOtp(email);

    // Include subdomain in the response if the user is an Instructor
    return res.status(201).json({
      message: "You are signed up",
      data: {
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        subdomain: newUser.subdomain || null,  // Include subdomain for instructors
      },
      success: true,
      err: {},
    });
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
  
      
      const isMatch = await bcrypt.compare(password, userExist.password);
     
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
  
      const payload = { id: userExist.id };

      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
  
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
      user.isVerified = true;

      // Generate subdomain for Instructor
      if (user.role === 'Instructor' && !user.subdomain) {
        let subdomain = generateSubdomain(user.name);
        let counter = 1;
        while (await User.findOne({ subdomain })) {
          subdomain = `${generateSubdomain(user.name)}${counter}`;
          counter++;
        }
        user.subdomain = subdomain;
      }

      await user.save();

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
    console.log('Getting user details for user ID:', req.user.id);
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      console.log('User not found'); 
      return res.status(404).json({ message: "User not found" });
    }
    console.log('User details found:', user); 
    res.json(user);
  } catch (error) {
    console.error('Error in getUserDetails:', error);
    res.status(500).json({ message: "Server error" });
  }
};
