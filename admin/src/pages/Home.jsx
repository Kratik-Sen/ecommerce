import React from 'react'
import Nav from '../component/Nav'
import Sidebar from '../component/Sidebar'
import { useState } from 'react'
import { useContext } from 'react'
import { authDataContext } from '../context/AuthContext'
import { useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

function Home() {
    const [totalProducts, setTotalProducts] = useState(0)
  const [totalOrders, setTotalOrders] = useState(0)
  const [razorpayData, setRazorpayData] = useState({keyId:"", keySecret:""})
  
  const { serverUrl } = useContext(authDataContext)

 const fetchCounts = async () => {
    try {
      const products = await axios.get(`${serverUrl}/api/product/list`, {} ,{withCredentials:true})
      setTotalProducts(products.data.length)

      const orders = await axios.post(`${serverUrl}/api/order/list`, {} ,{withCredentials:true})
      setTotalOrders(orders.data.length)
    } catch (err) {
      console.error("Failed to fetch counts", err)
    }
  }

 const fetchRazorpaySettings = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/settings/razorpay/admin`, {withCredentials:true})
      setRazorpayData({
        keyId: result.data.keyId || "",
        keySecret: result.data.keySecret || ""
      })
    } catch (err) {
      console.error("Failed to fetch Razorpay settings", err)
    }
  }

 const updateRazorpaySettings = async (e) => {
    e.preventDefault()
    try {
      const result = await axios.post(`${serverUrl}/api/settings/razorpay`, razorpayData, {withCredentials:true})
      setRazorpayData({
        keyId: result.data.keyId || "",
        keySecret: result.data.keySecret || ""
      })
      toast.success("Razorpay settings saved")
    } catch (err) {
      toast.error(err.response?.data?.message || "Razorpay settings failed")
    }
  }

 const removeRazorpaySettings = async () => {
    try {
      await axios.post(`${serverUrl}/api/settings/razorpay/remove`, {}, {withCredentials:true})
      setRazorpayData({keyId:"", keySecret:""})
      toast.success("Razorpay settings removed")
    } catch (err) {
      toast.error("Remove Razorpay settings failed")
    }
  }

  useEffect(() => {
    fetchCounts()
    fetchRazorpaySettings()
  }, [])
  return (
   
    <div className='w-[100vw] min-h-[100vh] bg-[linear-gradient(135deg,#f8f4e8_0%,#e9efe4_52%,#c7d1c8_100%)] text-[#1f2a24] relative'>
       <Nav/>
       <Sidebar/>

       <div className='w-[70vw] min-h-[100vh] absolute left-[25%] flex items-Start justify-start flex-col gap-[40px] py-[120px] pb-[60px]'>
         <h1 className='text-[35px] text-[#2f6f4e]'>HD Traders Admin Panel</h1>
         <div className='flex items-center justify-start gap-[50px] flex-col md:flex-row'>
          <div  className='text-[#1f2a24] w-[400px] max-w-[90%] h-[200px] bg-[#fffaf0cc] flex items-center justify-center flex-col gap-[20px] rounded-lg shadow-sm shadow-[#8f968f] backdrop:blur-lg  md:text-[25px] text-[20px] border-[1px] border-[#b8c0ba]'>Total No. of Products : <span className='px-[20px] py-[10px] bg-[#d8ded8] rounded-lg flex items-center justify-center border-[1px] border-[#b8c0ba]'>{totalProducts}</span></div>
          <div  className='text-[#1f2a24] w-[400px] max-w-[90%] h-[200px] bg-[#fffaf0cc] flex items-center justify-center flex-col gap-[20px] rounded-lg shadow-sm shadow-[#8f968f] backdrop:blur-lg  md:text-[25px] text-[20px] border-[1px] border-[#b8c0ba]'>Total No. of Orderss : <span className='px-[20px] py-[10px] bg-[#d8ded8] rounded-lg flex items-center justify-center border-[1px] border-[#b8c0ba]'>{totalOrders}</span></div>

         </div>
         <form onSubmit={updateRazorpaySettings} className='w-[850px] max-w-[95%] bg-[#fffaf0cc] border-[1px] border-[#b8c0ba] rounded-lg shadow-sm shadow-[#8f968f] p-[20px] flex flex-col gap-[15px]'>
          <h2 className='text-[25px] text-[#2f6f4e]'>Razorpay Settings</h2>
          <div className='flex flex-col md:flex-row gap-[15px]'>
            <input type="text" className='w-[100%] h-[45px] bg-[#c9d0ca] rounded-lg px-[15px] border-[1px] border-[#b8c0ba]' placeholder='Razorpay Key ID' value={razorpayData.keyId} onChange={(e)=>setRazorpayData(prev => ({...prev, keyId:e.target.value}))} />
            <input type="password" className='w-[100%] h-[45px] bg-[#c9d0ca] rounded-lg px-[15px] border-[1px] border-[#b8c0ba]' placeholder='Razorpay Key Secret' value={razorpayData.keySecret} onChange={(e)=>setRazorpayData(prev => ({...prev, keySecret:e.target.value}))} />
          </div>
          <div className='flex gap-[12px] flex-wrap'>
            <button type='submit' className='px-[20px] py-[10px] rounded-lg bg-[#b7e4c7] border-[1px] border-[#74c69d]'>Save / Update</button>
            <button type='button' className='px-[20px] py-[10px] rounded-lg bg-[#fffaf0] border-[1px] border-[#b8c0ba]' onClick={removeRazorpaySettings}>Remove Keys</button>
          </div>
         </form>
       </div>

      
    </div>
  )
}

export default Home
