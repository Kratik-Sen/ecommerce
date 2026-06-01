import Settings from "../model/settingsModel.js";

const getSettingsDocument = async () => {
    let settings = await Settings.findOne({})
    if (!settings) {
        settings = await Settings.create({})
    }
    return settings
}

export const getRazorpayPublicSettings = async (req,res) => {
    try {
        const settings = await getSettingsDocument()
        return res.status(200).json({
            keyId:settings.razorpayKeyId || ""
        })
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}

export const getRazorpayAdminSettings = async (req,res) => {
    try {
        const settings = await getSettingsDocument()
        return res.status(200).json({
            keyId:settings.razorpayKeyId || "",
            keySecret:settings.razorpayKeySecret || ""
        })
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}

export const updateRazorpaySettings = async (req,res) => {
    try {
        const keyId = String(req.body.keyId || "").trim()
        const keySecret = String(req.body.keySecret || "").trim()

        if (!keyId || !keySecret) {
            return res.status(400).json({message:"Razorpay key id and secret are required"})
        }

        const settings = await getSettingsDocument()
        settings.razorpayKeyId = keyId
        settings.razorpayKeySecret = keySecret
        await settings.save()

        return res.status(200).json({
            keyId:settings.razorpayKeyId,
            keySecret:settings.razorpayKeySecret
        })
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}

export const removeRazorpaySettings = async (req,res) => {
    try {
        const settings = await getSettingsDocument()
        settings.razorpayKeyId = ""
        settings.razorpayKeySecret = ""
        await settings.save()

        return res.status(200).json({message:"Razorpay settings removed"})
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}

export { getSettingsDocument }
