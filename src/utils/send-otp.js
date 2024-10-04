
import User from "../models/users.js";
import { sendEmail } from "./otp.utils.js";
import { generateOtp } from "./otp.utils.js";

export const sendOtp = async (email) => {
    const user = await User.findOne({ email });
    if (!user) {
      throw { status: 404, message: "User not found" };
    }

    const otp = generateOtp(6);
    user.otp = otp;
    const updateuser=await user.save();
    console.log("updateUser",updateuser)

    sendEmail(email,otp);

    return otp;
}
