import express from 'express'
import { addProduct, getProduct, listProduct, rateProduct, removeProduct, updateProduct } from '../controller/productController.js'
import upload from '../middleware/multer.js'
import adminAuth from "../middleware/adminAuth.js"
import isAuth from '../middleware/isAuth.js'


let productRoutes = express.Router()

productRoutes.post("/addproduct",adminAuth,upload.fields([
    {name:"image1",maxCount:1},
    {name:"image2",maxCount:1},
    {name:"image3",maxCount:1},
    {name:"image4",maxCount:1}]),addProduct)

productRoutes.get("/list", listProduct)
productRoutes.get("/:id", getProduct)
productRoutes.post("/remove/:id",adminAuth,removeProduct)
productRoutes.post("/update/:id",adminAuth,upload.fields([
    {name:"image1",maxCount:1},
    {name:"image2",maxCount:1},
    {name:"image3",maxCount:1},
    {name:"image4",maxCount:1}]),updateProduct)
productRoutes.post("/rate/:id",isAuth,rateProduct)



export default productRoutes
