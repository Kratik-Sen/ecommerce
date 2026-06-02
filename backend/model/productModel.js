import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    image1:{
        type:String,
        required:true
    },
    image2:{
        type:String,
        required:true
    },
    image3:{
        type:String,
        required:true
    },
    image4:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    subCategory:{
        type:String,
        required:true
    },
    sizes:{
        type:Array,
        required:true
    },
    variantPrices:{
        type:Object,
        default:{}
    },
    date:{
        type:Number,
        required:true
    },
    bestseller:{
        type:Boolean
    },
    available:{
        type:Boolean,
        default:true
    },
    deletedAt:{
        type:Date
    },
    ratings:[{
        userId:{
            type:String,
            required:true
        },
        userName:{
            type:String,
            default:"User"
        },
        rating:{
            type:Number,
            min:1,
            max:5,
            required:true
        },
        createdAt:{
            type:Date,
            default:Date.now
        }
    }]

},{timestamps:true})

const Product = mongoose.model("Product" , productSchema)

export default Product
