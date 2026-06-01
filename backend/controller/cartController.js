import User from "../model/userModel.js";
import Product from "../model/productModel.js";
import { noSizeKey } from "../constants/categories.js";


export const addToCart = async (req,res) => {
    try {
    const {itemId, size } = req.body;

    if (!itemId) {
      return res.status(400).json({ message: "Product id is required" });
    }

    const userData = await User.findById(req.userId);
    const product = await Product.findById(itemId);

    // Check if user exists
    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const productSizes = Array.isArray(product.sizes) ? product.sizes : [];
    const hasSizeOptions = productSizes.length > 0;

    if (hasSizeOptions && (!size || !productSizes.includes(size))) {
      return res.status(400).json({ message: "Select a valid product size" });
    }

    const selectedSize = hasSizeOptions ? size : noSizeKey;

    // Ensure cartData is initialized
    let cartData = userData.cartData || {};

    if (cartData[itemId]) {
      if (cartData[itemId][selectedSize]) {
        cartData[itemId][selectedSize] += 1;
      } else {
        cartData[itemId][selectedSize] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][selectedSize] = 1;
    }

    await User.findByIdAndUpdate(req.userId, { cartData });

    return res.status(201).json({ message: "Added to cart" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "addToCart error" });
  }


    
}


export const UpdateCart = async (req,res) => {
     try {
         const {itemId , size , quantity } = req.body
         const numericQuantity = Number(quantity)

         if (!itemId) {
          return res.status(400).json({message:"Product id is required"})
         }

         if (Number.isNaN(numericQuantity) || numericQuantity < 0) {
          return res.status(400).json({message:"Quantity must be 0 or greater"})
         }

         const userData = await User.findById(req.userId)
         const product = await Product.findById(itemId)

         if (!userData) {
          return res.status(404).json({message:"User not found"})
         }

         if (!product) {
          return res.status(404).json({message:"Product not found"})
         }

         const productSizes = Array.isArray(product.sizes) ? product.sizes : []
         const hasSizeOptions = productSizes.length > 0
         const selectedSize = hasSizeOptions ? size : noSizeKey

         if (hasSizeOptions && (!size || !productSizes.includes(size))) {
          return res.status(400).json({message:"Select a valid product size"})
         }

         let cartData = await userData.cartData || {};

         if (!cartData[itemId]) {
          cartData[itemId] = {}
         }

         cartData[itemId][selectedSize] = numericQuantity

          await User.findByIdAndUpdate(req.userId,{cartData})

    return res.status(201).json({message:"cart updated"})




    } catch (error) {
         console.log(error)
    return res.status(500).json({message:"updateCart error"})
    }
    
    

    
}

export const getUserCart = async (req,res) => {

     try {
         
         const userData = await User.findById(req.userId)
         let cartData = await userData.cartData;


    return res.status(200).json(cartData)




    } catch (error) {
         console.log(error)
    return res.status(500).json({message:"getUserCart error"})
    }
    
    
}
