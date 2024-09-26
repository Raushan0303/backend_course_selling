import { Resend } from "resend";
import { RESEND_API_KEY } from "../config/config.js";

const resend = new Resend(RESEND_API_KEY);

import nodemailer from 'nodemailer';

export const sendEmail = async (email, otp) => {
  try {
    // Step 1: Create transporter with Gmail SMTP settings
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'nextjsraushan@gmail.com',  // Your Gmail address
        pass: 'slid palj fvuq uttq',     // App password or Gmail password
      },
    });

    // Step 2: Define email options
    let mailOptions = {
      from: '"Your App Name" <nextjsraushan@gmail.com>',  // Sender address
      to: email,                                       // List of receivers
      subject: 'Your OTP Code',                        // Subject line
      html: `<h1>Your OTP is: ${otp}</h1>`,            // HTML body content
    };

    // Step 3: Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
  } catch (error) {
    console.error('Error sending OTP email:', error.message);
  }
};


export const generateOtp = (otp_len)=>{
    const digit = '0123456789'
    let otp = ''

    for(let i =0; i<otp_len;i++){
        otp += digit[Math.floor(Math.random()*10)];
    }
    return otp;
}