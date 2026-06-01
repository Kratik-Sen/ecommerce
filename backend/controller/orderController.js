import Order from "../model/orderModel.js";
import User from "../model/userModel.js";
import razorpay from 'razorpay'
import dotenv from 'dotenv'
import crypto from 'crypto'
import { getSettingsDocument } from './settingsController.js'
dotenv.config()
const currency = 'inr'
const pendingRazorpayOrders = new Map()

const getRazorpayConfig = async () => {
    const settings = await getSettingsDocument()
    if (!settings.razorpayKeyId || !settings.razorpayKeySecret) {
        throw new Error("Razorpay settings are not configured")
    }

    return {
        keyId:settings.razorpayKeyId,
        keySecret:settings.razorpayKeySecret,
        instance:new razorpay({
            key_id: settings.razorpayKeyId,
            key_secret: settings.razorpayKeySecret
        })
    }
}

// for User
export const placeOrder = async (req,res) => {

     try {
         const {items , amount , address} = req.body;
         const userId = req.userId;
         const orderData = {
            items,
            amount,
            userId,
            address,
            paymentMethod:'COD',
            payment:false,
            date: Date.now()
         }

         const newOrder = new Order(orderData)
         await newOrder.save()

         await User.findByIdAndUpdate(userId,{cartData:{}})

         return res.status(201).json({message:'Order Place'})
    } catch (error) {
        console.log(error)
        res.status(500).json({message:'Order Place error'})
    }
    
}


export const placeOrderRazorpay = async (req,res) => {
    try {
        
         const {items , amount , address} = req.body;
         const userId = req.userId;
         const orderData = {
            items,
            amount,
            userId,
            address,
            paymentMethod:'Razorpay',
            payment:false,
            date: Date.now()
         }

         const options = {
            amount:amount * 100,
            currency: currency.toUpperCase(),
            receipt : `rcpt_${Date.now()}`
         }
         const {instance} = await getRazorpayConfig()
         const order = await instance.orders.create(options)
         pendingRazorpayOrders.set(order.id, orderData)
         res.status(200).json(order)
    } catch (error) {
        console.log(error)
        res.status(500).json({message:error.message
            })
    }
}


export const verifyRazorpay = async (req,res) =>{
    try {
        const userId = req.userId
        const {razorpay_order_id, razorpay_payment_id, razorpay_signature} = req.body

        const sign = `${razorpay_order_id}|${razorpay_payment_id}`
        const {instance, keySecret} = await getRazorpayConfig()
        const expectedSignature = crypto
            .createHmac('sha256', keySecret)
            .update(sign)
            .digest('hex')

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({message:'Payment verification failed'})
        }

        const pendingOrder = pendingRazorpayOrders.get(razorpay_order_id)
        if (!pendingOrder || pendingOrder.userId !== userId) {
            const existingOrder = await Order.findOne({razorpayOrderId: razorpay_order_id, userId})
            if (existingOrder) {
                await User.findByIdAndUpdate(userId , {cartData:{}})
                return res.status(200).json({message:'Payment Successful'})
            }

            return res.status(400).json({message:'Order payment session expired'})
        }

        const orderInfo = await instance.orders.fetch(razorpay_order_id)
        if(orderInfo.status === 'paid'){
            const existingOrder = await Order.findOne({razorpayOrderId: razorpay_order_id, userId})
            if (!existingOrder) {
                await Order.create({
                    ...pendingOrder,
                    payment:true,
                    razorpayOrderId: razorpay_order_id,
                    razorpayPaymentId: razorpay_payment_id
                })
            }

            pendingRazorpayOrders.delete(razorpay_order_id)
            await User.findByIdAndUpdate(userId , {cartData:{}})
            res.status(200).json({message:'Payment Successful'
            })
        }
        else{
            pendingRazorpayOrders.delete(razorpay_order_id)
            res.status(400).json({message:'Payment Failed'
            })
        }
    } catch (error) {
        console.log(error)
         res.status(500).json({message:error.message
            })
    }
}






export const userOrders = async (req,res) => {
      try {
        const userId = req.userId;
        const orders = await Order.find({userId})
        return res.status(200).json(orders)
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"userOrders error"})
    }
    
}




//for Admin



    
export const allOrders = async (req,res) => {
    try {
        const orders = await Order.find({adminArchived:{$ne:true}})
        res.status(200).json(orders)
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"adminAllOrders error"})
        
    }
    
}
    
export const updateStatus = async (req,res) => {
    
try {
    const {orderId , status} = req.body

    await Order.findByIdAndUpdate(orderId , { status })
    return res.status(201).json({message:'Status Updated'})
} catch (error) {
     return res.status(500).json({message:error.message
            })
}
}

export const archiveDeliveredOrder = async (req,res) => {
    try {
        const {orderId} = req.body
        const order = await Order.findById(orderId)

        if (!order) {
            return res.status(404).json({message:"Order not found"})
        }

        if (order.status !== "Delivered") {
            return res.status(400).json({message:"Only delivered orders can be removed from admin history"})
        }

        order.adminArchived = true
        await order.save()

        return res.status(200).json({message:"Order removed from admin history"})
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}
