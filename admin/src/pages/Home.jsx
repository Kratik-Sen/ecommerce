import React from 'react'
import Nav from '../component/Nav'
import Sidebar from '../component/Sidebar'
import { useState } from 'react'
import { useContext } from 'react'
import { authDataContext } from '../context/AuthContext'
import { useEffect } from 'react'
import axios from 'axios'

function Home() {
    const [totalProducts, setTotalProducts] = useState(0)
  const [totalOrders, setTotalOrders] = useState(0)
  
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

   useEffect(() => {
    fetchCounts()
  }, [])
  return (
   
    <div className='w-[100vw] h-[100vh] bg-[linear-gradient(135deg,#f8f4e8_0%,#e9efe4_52%,#c7d1c8_100%)] text-[#1f2a24] relative'>
       <Nav/>
       <Sidebar/>

       <div className='w-[70vw] h-[100vh] absolute left-[25%] flex items-Start justify-start flex-col  gap-[40px] py-[100px]'>
         <h1 className='text-[35px] text-[#2f6f4e]'>OneCart Admin Panel</h1>
         <div className='flex items-center justify-start gap-[50px] flex-col md:flex-row'>
          <div  className='text-[#1f2a24] w-[400px] max-w-[90%] h-[200px] bg-[#fffaf0cc] flex items-center justify-center flex-col gap-[20px] rounded-lg shadow-sm shadow-[#8f968f] backdrop:blur-lg  md:text-[25px] text-[20px] border-[1px] border-[#b8c0ba]'>Total No. of Products : <span className='px-[20px] py-[10px] bg-[#d8ded8] rounded-lg flex items-center justify-center border-[1px] border-[#b8c0ba]'>{totalProducts}</span></div>
          <div  className='text-[#1f2a24] w-[400px] max-w-[90%] h-[200px] bg-[#fffaf0cc] flex items-center justify-center flex-col gap-[20px] rounded-lg shadow-sm shadow-[#8f968f] backdrop:blur-lg  md:text-[25px] text-[20px] border-[1px] border-[#b8c0ba]'>Total No. of Orderss : <span className='px-[20px] py-[10px] bg-[#d8ded8] rounded-lg flex items-center justify-center border-[1px] border-[#b8c0ba]'>{totalOrders}</span></div>

         </div>
       </div>

      
    </div>
  )
}

export default Home
