import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import { setCookie } from "../utils/setCookie.js";
import ErrorHandler from "../middlewares/error.js";
import sendEmail from "../middlewares/sendEmail.js";
import crypto from 'crypto';


export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const isFound = await User.findOne({ email });
    if (isFound) {
      return next(new ErrorHandler("Already Have Account", 409));
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = User.create({
      name,
      email,
      password: hashedPassword,
    });

    setCookie(newUser, res, "SignUp Successfully.", 201);
  } catch (error) {
    next(error);
  }
};
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // here we are using  select with +password that means we will get all data of user along with the password
    // select is used for getting some selective data form all the data
    //if we will use select("password") -- it will give us only password but we are using select("+password") -- it will give us all data along with password

    const userData = await User.findOne({ email }).select("+password");
    if (!userData) {
      return next(new ErrorHandler("Incorrect email or password", 401));
    }

    const isMatch = await bcrypt.compare(password, userData.password);

    if (!isMatch) {
      return next(new ErrorHandler("Incorrect email or password", 401));
    }
    setCookie(userData, res, `Welcome ${userData.name}`, 200);
  } catch (error) {
    next(error);
  }
};
export const getMyProfile = (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
};
export const logout = (req, res) => {
  res.status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      sameSite: process.env.NODE_ENV === "Development" ? "lax" : "none",
      secure: process.env.NODE_ENV === "Development" ? false : true,
    })
    .json({
      success: true,
      message: "Logged Out Successfully",
    });
};

export const resetPassword = async(req,res,next)=>{
  try {
    //creating token hash
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire:{$gt:Date.now()},
    });

    if(!user){
      return next(new ErrorHandler("Reset Password Token is invalid or has been expired",400));
    }
    if(req.body.password !== req.body.confirmPassword){
      return next(new ErrorHandler("Password does not match",400))
    }
    user.password = req.body.password;
    user.resetPasswordToken = user.resetPasswordExpire = undefined;

    await user.save();

    setCookie(user, res, `Welcome ${user.name}`, 200);

  } catch (error) {
    next(error);
  }
}

// Forgot Password
export const forgotPassword = async(req,res,next) =>{

  try {
    const user = await User.findOne({email:req.body.email});
    
    if(!user){
      return next(new ErrorHandler("User not found",404));
    }

    const getResetPasswordToken = ()=> {
      //Generating Token
      const resetToken = crypto.randomBytes(20).toString("hex");
  
      // Hashing and adding resetPasswordToken to userSchema
      user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex")
  
      user.resetPasswordExpire = Date.now() + 5*60*1000;
      return resetToken;
  }

    //Get ResetPassword Token

    const resetToken = getResetPasswordToken();
    await user.save({validateBeforeSave:false});

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/user/resetpassword/${resetToken}`;

    const message = `Your Password reset token is :- \n\n ${resetPasswordUrl} \n\n If you have not requested this email then, please ignore it `;

    try {
      await sendEmail({
        email:user.email,
        subject:`PostHub Reset Password`,
        message,
      });
      res.status(200).json({
        success:true,
        message:`Email sent to ${user.email} successfully`,
      })


    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save({validateBeforeSave:false});
      return next(new ErrorHandler(error.message,500));
    }


  } catch (error) {
    next(error);
  }
}
