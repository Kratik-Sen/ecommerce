import express from "express"
import dotenv from "dotenv"
import cookieParser from 'cookie-parser'
import connectDb from "./config/db.js"
dotenv.config()
import cors from "cors"
import authRoutes from "./routes/authRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import productRoutes from "./routes/productRoutes.js"
import cartRoutes from "./routes/cartRoutes.js"
import orderRoutes from "./routes/orderRoutes.js"
dotenv.config()


const app = express()

let port = process.env.PORT || 8000

app.use(express.json())
app.use(cookieParser())
app.use(cors({
 origin:["http://localhost:5173" , "http://localhost:5174"],
 credentials:true
}))

app.use("/api/auth",authRoutes)
app.use("/api/user",userRoutes)
app.use("/api/product",productRoutes)
app.use("/api/cart",cartRoutes)
app.use("/api/order",orderRoutes)




app.listen(port,()=>{
    console.log(`server is running at ${port}`)
    connectDb()
})
