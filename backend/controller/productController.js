import uploadOnCloudinary from "../config/cloudinary.js"
import Product from "../model/productModel.js"
import Order from "../model/orderModel.js"
import User from "../model/userModel.js"
import { isClothingCategory, isWeightCategory } from "../constants/categories.js"


export const addProduct = async (req,res) => {
    try {
        let {name,description,price,category,subCategory,sizes,bestseller} = req.body
        let parsedSizes = []
        try {
            parsedSizes = JSON.parse(sizes || "[]")
        } catch {
            return res.status(400).json({message:"Product sizes must be valid JSON"})
        }
        const numericPrice = Number(price)
        const needsSize = isClothingCategory(category) || isClothingCategory(subCategory) || isWeightCategory(category) || isWeightCategory(subCategory)

        if (!name?.trim() || !description?.trim() || !category?.trim() || !subCategory?.trim()) {
            return res.status(400).json({message:"All product fields are required"})
        }

        if (!numericPrice || numericPrice <= 0) {
            return res.status(400).json({message:"Product price must be greater than 0"})
        }

        if (!Array.isArray(parsedSizes)) {
            return res.status(400).json({message:"Product sizes must be an array"})
        }

        if (needsSize && parsedSizes.length === 0) {
            return res.status(400).json({message:"Select at least one size option"})
        }

        if (!req.files?.image1?.[0] || !req.files?.image2?.[0] || !req.files?.image3?.[0] || !req.files?.image4?.[0]) {
            return res.status(400).json({message:"All product images are required"})
        }

        let image1 = await uploadOnCloudinary(req.files.image1[0].path)
        let image2 = await uploadOnCloudinary(req.files.image2[0].path)
        let image3 = await uploadOnCloudinary(req.files.image3[0].path)
        let image4 = await uploadOnCloudinary(req.files.image4[0].path)
        
        let productData = {
            name:name.trim(),
            description:description.trim(),
            price :numericPrice,
            category:category.trim(),
            subCategory:subCategory.trim(),
            sizes :needsSize ? parsedSizes : [],
            bestseller :bestseller === "true" ? true : false,
            date :Date.now(),
            image1,
            image2,
            image3,
            image4
            
        }

        const product = await Product.create(productData)

        return res.status(201).json(product)

    } catch (error) {
          console.log("AddProduct error")
    return res.status(500).json({message:`AddProduct error ${error}`})
    }
    
}


export const listProduct = async (req,res) => {
     
    try {
        const product = await Product.find({available:{$ne:false}}).sort({date:-1, createdAt:-1});
        return res.status(200).json(product)

    } catch (error) {
        console.log("ListProduct error")
    return res.status(500).json({message:`ListProduct error ${error}`})
    }
}

export const getProduct = async (req,res) => {
    try {
        const {id} = req.params
        const product = await Product.findById(id)

        if (!product) {
            return res.status(404).json({message:"Product not found"})
        }

        return res.status(200).json(product)
    } catch (error) {
        console.log("GetProduct error")
        return res.status(500).json({message:`GetProduct error ${error}`})
    }
}

export const removeProduct = async (req,res) => {
    try {
        let {id} = req.params;
        const product = await Product.findByIdAndUpdate(id, {available:false, deletedAt:new Date()}, {new:true})
         return res.status(200).json(product)
    } catch (error) {
        console.log("RemoveProduct error")
    return res.status(500).json({message:`RemoveProduct error ${error}`})
    }
    
}

export const updateProduct = async (req,res) => {
    try {
        const {id} = req.params
        let {name,description,price,category,subCategory,sizes,bestseller} = req.body
        let updateData = {}

        if (name !== undefined) {
            if (!name.trim()) {
                return res.status(400).json({message:"Product name is required"})
            }
            updateData.name = name.trim()
        }

        if (description !== undefined) {
            if (!description.trim()) {
                return res.status(400).json({message:"Product description is required"})
            }
            updateData.description = description.trim()
        }

        if (price !== undefined) {
            const numericPrice = Number(price)
            if (!numericPrice || numericPrice <= 0) {
                return res.status(400).json({message:"Product price must be greater than 0"})
            }
            updateData.price = numericPrice
        }

        if (category !== undefined) {
            if (!category.trim()) {
                return res.status(400).json({message:"Product category is required"})
            }
            updateData.category = category.trim()
        }

        if (subCategory !== undefined) {
            if (!subCategory.trim()) {
                return res.status(400).json({message:"Product sub-category is required"})
            }
            updateData.subCategory = subCategory.trim()
        }

        if (sizes !== undefined) {
            try {
                const parsedSizes = JSON.parse(sizes || "[]")
                if (!Array.isArray(parsedSizes)) {
                    return res.status(400).json({message:"Product sizes must be an array"})
                }
                updateData.sizes = parsedSizes
            } catch {
                return res.status(400).json({message:"Product sizes must be valid JSON"})
            }
        }

        if (bestseller !== undefined) {
            updateData.bestseller = bestseller === "true" || bestseller === true
        }

        if (req.files?.image1?.[0]) updateData.image1 = await uploadOnCloudinary(req.files.image1[0].path)
        if (req.files?.image2?.[0]) updateData.image2 = await uploadOnCloudinary(req.files.image2[0].path)
        if (req.files?.image3?.[0]) updateData.image3 = await uploadOnCloudinary(req.files.image3[0].path)
        if (req.files?.image4?.[0]) updateData.image4 = await uploadOnCloudinary(req.files.image4[0].path)

        const product = await Product.findByIdAndUpdate(id, updateData, {new:true})

        if (!product) {
            return res.status(404).json({message:"Product not found"})
        }

        return res.status(200).json(product)
    } catch (error) {
        console.log("UpdateProduct error")
        return res.status(500).json({message:`UpdateProduct error ${error}`})
    }
}

export const rateProduct = async (req,res) => {
    try {
        const {id} = req.params
        const userId = req.userId
        const numericRating = Number(req.body.rating)

        if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
            return res.status(400).json({message:"Rating must be between 1 and 5"})
        }

        const product = await Product.findById(id)
        if (!product) {
            return res.status(404).json({message:"Product not found"})
        }

        const deliveredOrders = await Order.find({userId, status:"Delivered"})
        const hasDeliveredProduct = deliveredOrders.some(order =>
            order.items.some(item => String(item._id) === id)
        )

        if (!hasDeliveredProduct) {
            return res.status(403).json({message:"You can rate this product after it is delivered"})
        }

        const user = await User.findById(userId)
        const existingRating = product.ratings.find(item => item.userId === userId)

        if (existingRating) {
            existingRating.rating = numericRating
            existingRating.userName = user?.name || existingRating.userName
            existingRating.createdAt = new Date()
        } else {
            product.ratings.push({
                userId,
                userName:user?.name || "User",
                rating:numericRating
            })
        }

        await product.save()

        return res.status(200).json(product)
    } catch (error) {
        console.log("RateProduct error")
        return res.status(500).json({message:`RateProduct error ${error}`})
    }
}
