import express from "express";
import adminAuth from "../middleware/adminAuth.js";
import { getRazorpayAdminSettings, getRazorpayPublicSettings, removeRazorpaySettings, updateRazorpaySettings } from "../controller/settingsController.js";

const settingsRoutes = express.Router()

settingsRoutes.get("/razorpay/public", getRazorpayPublicSettings)
settingsRoutes.get("/razorpay/admin", adminAuth, getRazorpayAdminSettings)
settingsRoutes.post("/razorpay", adminAuth, updateRazorpaySettings)
settingsRoutes.post("/razorpay/remove", adminAuth, removeRazorpaySettings)

export default settingsRoutes
