import uploadOnCloudinary from "../config/cloudinary.js"
import Product from "../model/productModel.js"
import { isClothingCategory } from "../constants/categories.js"


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
        const needsSize = isClothingCategory(category) || isClothingCategory(subCategory)

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
            return res.status(400).json({message:"Select at least one size for clothing products"})
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
        const product = await Product.find({});
        return res.status(200).json(product)

    } catch (error) {
        console.log("ListProduct error")
    return res.status(500).json({message:`ListProduct error ${error}`})
    }
}

export const removeProduct = async (req,res) => {
    try {
        let {id} = req.params;
        const product = await Product.findByIdAndDelete(id)
         return res.status(200).json(product)
    } catch (error) {
        console.log("RemoveProduct error")
    return res.status(500).json({message:`RemoveProduct error ${error}`})
    }
    
}
