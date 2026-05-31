import mongoose from "mongoose";
import dns from "dns"

dns.setServers([
   '1.1.1.1',
   '8.8.8.8'
])
const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("MongoDB connected")
    } catch (error) {
        console.log(`DB error- ${error}`)
    }
    
}
export default connectDb