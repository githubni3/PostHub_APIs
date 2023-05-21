import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        required:true,
        type:String
    },
    username:{
        required:true,
        type:String,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
        select:false
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
});

// Generating Password Reset Token


export const User = mongoose.model("Users",userSchema);
