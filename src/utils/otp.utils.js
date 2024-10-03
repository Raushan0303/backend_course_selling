

import nodemailer from 'nodemailer';

export const sendEmail = async (email, otp) => {
  try {
    
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'nextjsraushan@gmail.com',  
        pass: 'slid palj fvuq uttq',     
      },
    });

    let mailOptions = {
      from: '"EduMerge" <nextjsraushan@gmail.com>', 
      to: email,                                      
      subject: 'Your OTP Code',                        
      html: `This is your OTP code: ${otp}`,      
    };

    const info = await transporter.sendMail(mailOptions);

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