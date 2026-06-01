import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
    razorpayKeyId:{
        type:String,
        default:""
    },
    razorpayKeySecret:{
        type:String,
        default:""
    }
},{timestamps:true})

const Settings = mongoose.model("Settings", settingsSchema)

export default Settings
