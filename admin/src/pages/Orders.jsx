import React from 'react'
import Nav from '../component/Nav'
import Sidebar from '../component/Sidebar'
import { useState } from 'react'
import { useContext } from 'react'
import { authDataContext } from '../context/AuthContext'
import axios from 'axios'
import { useEffect } from 'react'
import { SiEbox } from "react-icons/si";
import { RiDeleteBin6Line } from "react-icons/ri";

const noSizeKey = "default"

function Orders() {

  let [orders,setOrders] = useState([])
  let {serverUrl} = useContext(authDataContext)

    const fetchAllOrders =async () => {
    try {
      const result = await axios.post(serverUrl + '/api/order/list' , {} ,{withCredentials:true})
      setOrders(result.data.reverse())
      
    } catch (error) {
      console.log(error)
    }
    
  }
   const statusHandler = async (e , orderId) => {
         try {
          const result = await axios.post(serverUrl + '/api/order/status' , {orderId,status:e.target.value},{withCredentials:true})
          if(result.data){
            await fetchAllOrders()
          }
         } catch (error) {
          console.log(error)
          
         }
  }
   const removeDeliveredOrder = async (orderId) => {
         try {
          const result = await axios.post(serverUrl + '/api/order/archive' , {orderId},{withCredentials:true})
          if(result.data){
            await fetchAllOrders()
          }
         } catch (error) {
          console.log(error)
         }
  }
  useEffect(()=>{
    fetchAllOrders()
  },[])
  return (
    <div className='w-[99vw] min-h-[100vh] bg-[linear-gradient(135deg,#f8f4e8_0%,#e9efe4_52%,#c7d1c8_100%)] text-[#1f2a24]'>
      
      <Nav/>
      <div className='w-[100%] h-[100%] flex items-center lg:justify-start justify-center'>
        <Sidebar/>
        <div className='lg:w-[85%] md:w-[70%] h-[100%] lg:ml-[310px] md:ml-[250px] mt-[70px] flex flex-col gap-[30px] overflow-x-hidden py-[50px] ml-[100px]'>
          <div className='w-[400px] h-[50px] text-[28px] md:text-[40px] mb-[20px] text-[#1f2a24]'>All Orders List</div>
          {
           orders.map((order)=>(
            <div key={order._id} className='w-[90%] h-[40%] bg-[#c9d0ca] rounded-xl flex lg:items-center items-start justify-between  flex-col lg:flex-row p-[10px] md:px-[20px]  gap-[20px]'>
            <SiEbox  className='w-[60px] h-[60px] text-[#1f2a24] p-[5px] rounded-lg bg-[#fffaf0]'/>

            <div>
              <div className='flex items-start justify-center flex-col gap-[5px] text-[16px] text-[#2f6f4e]'>
                {
                  order.items.map((item,index)=>{
                    const sizeText = item.size && item.size !== noSizeKey ? ` ${item.size}` : ""
                    if(index === order.items.length - 1){
                       return <p key={index}>{item.name.toUpperCase()}  *  {item.quantity}<span>{sizeText}</span></p>

                    }else{
                       return <p key={index}>{item.name.toUpperCase()}  *  {item.quantity}<span>{sizeText}</span>,</p>

                    }
                  })
                }
              </div>

              <div className='text-[15px] text-[#4f8f67]'>
                  <p>{order.address.firstName+" "+ order.address.lastName}</p>
                  <p>{order.address.street + ", "}</p>
                  <p>{order.address.city + ", " + order.address.state + ", " + order.address.country + ", " + order.address.pinCode}</p>
                  <p>{order.address.phone}</p>
                </div>
            </div>
            <div className='text-[15px] text-[#4f8f67]'>
                  <p>Items : {order.items.length}</p>
                  <p>Method : {order.paymentMethod}</p>
                  <p>Payment : {order.payment ? 'Done' : 'Pending'}</p>
                  <p>Date : {new Date(order.date).toLocaleDateString()}</p>
                   <p className='text-[20px] text-[#1f2a24]'> ₹ {order.amount}</p>
                </div>
                <select  value={order.status} className='px-[5px] py-[10px] bg-[#aeb7b1] rounded-lg border-[1px] border-[#95d5b2]' onChange={(e)=>statusHandler(e,order._id)} >
                  <option value="Order Placed">Order Placed</option>
                  <option value="Packing">Packing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Out for delivery">Out for delivery</option>
                  <option value="Delivered">Delivered</option>
                </select>
                {order.status === "Delivered" && (
                  <button className='flex items-center gap-[6px] px-[12px] py-[10px] bg-[#fffaf0] rounded-lg border-[1px] border-[#95d5b2] text-[#1f2a24]' onClick={()=>removeDeliveredOrder(order._id)}>
                    <RiDeleteBin6Line /> Remove
                  </button>
                )}
            </div>
            
           ))

          }
        </div>
      </div>
    </div>
  )
}

export default Orders
