import React, { useContext, useEffect, useState } from 'react'
import Title from '../component/Title'
import { shopDataContext } from '../context/ShopContext'
import { authDataContext } from '../context/AuthContext'
import axios from 'axios'
import { noSizeKey } from '../constants/categories'
import { useNavigate } from 'react-router-dom'

function Order() {
    let [orderData,setOrderData] = useState([])
    let {currency} = useContext(shopDataContext)
    let {serverUrl} = useContext(authDataContext)
    let navigate = useNavigate()

    const loadOrderData = async () => {
       try {
      const result = await axios.post(serverUrl + '/api/order/userorder',{},{withCredentials:true})
      if(result.data){
        let allOrdersItem = []
        result.data.map((order)=>{
          order.items.map((item)=>{
            item['status'] = order.status
            item['payment'] = order.payment
            item['paymentMethod'] = order.paymentMethod
            item['date'] = order.date
            allOrdersItem.push(item)
          })
        })
        setOrderData(allOrdersItem.reverse())
      }
    } catch (error) {
      console.log(error)
    }
    }

useEffect(()=>{
 loadOrderData()
},[])


  return (
    <div className='w-[99vw] min-h-[100vh] p-[20px] pb-[150px]  overflow-hidden bg-[linear-gradient(135deg,#f8f4e8_0%,#e9efe4_52%,#c7d1c8_100%)] '>
      <div className='h-[8%] w-[100%] text-center mt-[80px]'>
        <Title text1={'MY'} text2={'ORDER'} />
      </div>
      <div className=' w-[100%] h-[92%] flex flex-wrap gap-[20px]'>
        {
         orderData.map((item,index)=>(
            <div key={index} className='w-[100%] h-[10%] border-t border-b '>
                <div className='w-[100%] h-[80%] flex items-start gap-6 bg-[#c9d0ca80]  py-[10px] px-[20px] rounded-2xl relative '>
                    <img src={item.image1} alt="" className='w-[130px] h-[130px] rounded-md '/>
                    <div className='flex items-start justify-center flex-col gap-[5px]'>
                    <p className='md:text-[25px] text-[20px] text-[#1f2a24]'>{item.name}</p>
                    <div className='flex items-center gap-[8px]   md:gap-[20px]'>
                      <p className='md:text-[18px] text-[12px] text-[#4f8f67]'>{currency} {item.price}</p>
                      <p className='md:text-[18px] text-[12px] text-[#4f8f67]'>Quantity: {item.quantity}</p>
                      {item.size && item.size !== noSizeKey && <p className='md:text-[18px] text-[12px] text-[#4f8f67]'>Size: {item.size}</p>}
                    </div>
                    <div className='flex items-center'>
                     <p className='md:text-[18px] text-[12px] text-[#4f8f67]'>Date: <span className='text-[#59645d] pl-[10px] md:text-[16px] text-[11px]'>{new Date(item.date).toDateString()}</span></p>
                    </div>
                    <div className='flex items-center'>
                      <p className='md:text-[16px] text-[12px] text-[#4f8f67]'>Payment Method :{item.paymentMethod}</p>
                    </div>
                    <div className='absolute md:left-[55%] md:top-[40%] right-[2%] top-[2%]  '>
                        <div className='flex items-center gap-[5px]'>
                      <p className='min-w-2 h-2 rounded-full bg-[#74c69d]'></p> 
                      <p className='md:text-[17px] text-[10px] text-[#1f2a24]'>{item.status}</p>

                    </div>

                    </div>
                     <div className='absolute md:right-[5%] right-[1%] md:top-[40%] top-[70%]'> 
                    <button className='md:px-[15px] px-[5px] py-[3px] md:py-[7px] rounded-md bg-[#d8ded8] text-[#1f2a24] text-[12px] md:text-[16px] cursor-pointe active:bg-[#aeb7b1]' onClick={loadOrderData} >Track Order</button>
                    {item.status === "Delivered" && <button className='md:px-[15px] px-[5px] py-[3px] md:py-[7px] rounded-md bg-[#b7e4c7] text-[#1f2a24] text-[12px] md:text-[16px] cursor-pointer active:bg-[#aeb7b1] ml-[8px]' onClick={()=>navigate(`/productdetail/${item._id}`)} >Rate</button>}
                  </div>
                    </div>
                </div>
               
            </div>
         ))
        }
      </div>
    </div>
  )
}

export default Order
