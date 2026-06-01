import React, { useContext, useEffect, useState } from 'react'
import Title from '../component/Title'
import CartTotal from '../component/CartTotal'
import razorpay from '../assets/Razorpay.jpg'
import { shopDataContext } from '../context/ShopContext'
import { authDataContext } from '../context/AuthContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Loading from '../component/Loading'

function PlaceOrder() {
    let [method,setMethod] = useState('cod')
    let navigate = useNavigate()
    const {cartItem , setCartItem , getCartAmount , delivery_fee , products } = useContext(shopDataContext)
    let {serverUrl} = useContext(authDataContext)
    let [loading ,setLoading] = useState(false)
    let [razorpayKeyId,setRazorpayKeyId] = useState("")

    let [formData,setFormData] = useState({
        firstName:'',
    lastName:'',
    email:'',
    street:'',
    city:'',
    state:'',
    pinCode:'',
    country:'',
    phone:''
    })

    const onChangeHandler = (e)=>{
    const name = e.target.name;
    const value = e.target.value;
    setFormData(data => ({...data,[name]:value}))
    }

    const initPay = (order) =>{
        if (!razorpayKeyId) {
          toast.error("Razorpay is not configured")
          return
        }
        const options = {
      key:razorpayKeyId,
      amount: order.amount,
      currency: order.currency,
      name:'Order Payment',
      description: 'Order Payment',
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        try {
          console.log(response)
          const {data} = await axios.post(serverUrl + '/api/order/verifyrazorpay',response,{withCredentials:true})
          if(data?.message === 'Payment Successful'){
              toast.success("Payment Successful")
              navigate("/order")
              setCartItem({})

          }
        } catch (error) {
          console.log(error)
          toast.error(error.response?.data?.message || "Payment verification failed")
        }
      },
      modal: {
        ondismiss: () => {
          toast.error("Payment cancelled")
        }
      }
    }
    const rzp = new window.Razorpay(options)
    rzp.on('payment.failed', (response) => {
      console.log(response.error)
      toast.error("Payment Failed")
    })
    rzp.open()
   }

   const getRazorpayKey = async () => {
    try {
      const result = await axios.get(serverUrl + '/api/settings/razorpay/public')
      setRazorpayKeyId(result.data.keyId || "")
    } catch (error) {
      console.log(error)
    }
   }

   useEffect(() => {
    getRazorpayKey()
   }, [])

    
     const onSubmitHandler = async (e) => {
        
    setLoading(true)
        e.preventDefault()
    try {
      let orderItems = []
      for(const items in cartItem){
        for(const item in cartItem[items]){
          if(cartItem[items][item] > 0){
            const itemInfo = structuredClone(products.find(product => product._id === items))
            if(itemInfo){
               itemInfo.size = item
               itemInfo.quantity = cartItem[items][item]
               orderItems.push(itemInfo)
            }
          }
        }
      }
      let orderData = {
        address:formData,
        items:orderItems,
        amount:getCartAmount() + delivery_fee
      }
      switch(method){
        case 'cod': 
      
        const result = await axios.post(serverUrl + "/api/order/placeorder" , orderData , {withCredentials:true})
        console.log(result.data)
        if(result.data){
            setCartItem({})
            toast.success("Order Placed")
            navigate("/order")
            setLoading(false)

        }else{
            console.log(result.data.message)
            toast.error("Order Placed Error")
             setLoading(false)
        }

        break;

        case 'razorpay':
        const resultRazorpay = await axios.post(serverUrl + "/api/order/razorpay" , orderData , {withCredentials:true})
        if(resultRazorpay.data){
          initPay(resultRazorpay.data)
           setLoading(false)
        }

        break;




        default:
        break;

      }
    
      
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || "Order failed")
      setLoading(false)
    
    }
     }
  return (
    <div className='w-[100vw] min-h-[100vh] bg-[linear-gradient(135deg,#f8f4e8_0%,#e9efe4_52%,#c7d1c8_100%)] flex items-center justify-center flex-col md:flex-row gap-[50px]  relative'>
        <div className='lg:w-[50%] w-[100%] h-[100%] flex items-center justify-center  lg:mt-[0px] mt-[90px] '>
            <form action="" onSubmit={onSubmitHandler} className='lg:w-[70%] w-[95%] lg:h-[70%] h-[100%]'>
        <div className='py-[10px]'>
        <Title text1={'DELIVERY'} text2={'INFORMATION'}/>
        </div>
        <div className='w-[100%] h-[70px] flex items-center justify-between px-[10px]'>

         <input type="text" placeholder='First name' className='w-[48%] h-[50px] rounded-md bg-[#c9d0ca] placeholder:text-[#6d766f] text-[18px] px-[20px] shadow-sm shadow-[#8f968f]'required  onChange={onChangeHandler} name='firstName' value={formData.firstName}/>

          <input type="text" placeholder='Last name' className='w-[48%] h-[50px] rounded-md shadow-sm shadow-[#8f968f] bg-[#c9d0ca] placeholder:text-[#6d766f] text-[18px] px-[20px]' required onChange={onChangeHandler} name='lastName' value={formData.lastName} />
        </div>

        <div className='w-[100%] h-[70px] flex items-center justify-between px-[10px]'>
          <input type="email" placeholder='Email address' className='w-[100%] h-[50px] rounded-md shadow-sm shadow-[#8f968f] bg-[#c9d0ca] placeholder:text-[#6d766f] text-[18px] px-[20px]'required onChange={onChangeHandler} name='email' value={formData.email} />
         
        </div>
        <div className='w-[100%] h-[70px] flex items-center justify-between px-[10px]'>
          <input type="text" placeholder='Street' className='w-[100%] h-[50px] rounded-md bg-[#c9d0ca] shadow-sm shadow-[#8f968f] placeholder:text-[#6d766f] text-[18px] px-[20px]' required onChange={onChangeHandler} name='street' value={formData.street} />
         
        </div>
        <div className='w-[100%] h-[70px] flex items-center justify-between px-[10px]'>
          <input type="text" placeholder='City' className='w-[48%] h-[50px] rounded-md bg-[#c9d0ca] shadow-sm shadow-[#8f968f] placeholder:text-[#6d766f] text-[18px] px-[20px]' required onChange={onChangeHandler} name='city' value={formData.city} />
          <input type="text" placeholder='State' className='w-[48%] h-[50px] rounded-md bg-[#c9d0ca] shadow-sm shadow-[#8f968f] placeholder:text-[#6d766f] text-[18px] px-[20px]' required onChange={onChangeHandler} name='state' value={formData.state} />
        </div>
        <div className='w-[100%] h-[70px] flex items-center justify-between px-[10px]'>
          <input type="text" placeholder='Pincode' className='w-[48%] h-[50px] rounded-md bg-[#c9d0ca] shadow-sm shadow-[#8f968f] placeholder:text-[#6d766f] text-[18px] px-[20px]' required onChange={onChangeHandler} name='pinCode' value={formData.pinCode} />
          <input type="text" placeholder='Country' className='w-[48%] h-[50px] rounded-md bg-[#c9d0ca] shadow-sm shadow-[#8f968f] placeholder:text-[#6d766f] text-[18px] px-[20px]' required onChange={onChangeHandler} name='country' value={formData.country} />
        </div>
         <div className='w-[100%] h-[70px] flex items-center justify-between px-[10px]'>
          <input type="text" placeholder='Phone' className='w-[100%] h-[50px] rounded-md bg-[#c9d0ca] shadow-sm shadow-[#8f968f] placeholder:text-[#6d766f] text-[18px] px-[20px]' required onChange={onChangeHandler} name='phone' value={formData.phone} />
         
        </div>
        <div>
          <button type='submit' className='text-[18px] active:bg-[#aeb7b1] cursor-pointer bg-[#b7e4c7] py-[10px] px-[50px] rounded-2xl text-[#1f2a24] flex items-center justify-center gap-[20px] absolute lg:right-[20%] bottom-[10%] right-[35%] border-[1px] border-[#b8c0ba] ml-[30px] mt-[20px]' >{loading? <Loading/> : "PLACE ORDER"}</button>
         </div> 


            </form>

       
        </div>
         <div className='lg:w-[50%] w-[100%] min-h-[100%] flex items-center justify-center gap-[30px] '>
            <div className='lg:w-[70%] w-[90%] lg:h-[70%] h-[100%]  flex items-center justify-center gap-[10px] flex-col'>
                <CartTotal/>
                <div className='py-[10px]'>
        <Title text1={'PAYMENT'} text2={'METHOD'}/>
        </div>
        <div className='w-[100%] h-[30vh] lg:h-[100px] flex items-start mt-[20px] lg:mt-[0px] justify-center gap-[50px]'>
        <button onClick={()=>setMethod('razorpay')} className={`w-[150px] h-[50px] rounded-sm  ${method === 'razorpay' ? 'border-[5px] border-[#74c69d] rounded-sm' : ''}`}> <img src={razorpay} className='w-[100%] h-[100%] object-fill rounded-sm ' alt="" /></button>
        <button onClick={()=>setMethod('cod')} className={`w-[200px] h-[50px] bg-[#fffaf0] border-[1px] border-[#b8c0ba] text-[14px] px-[20px] rounded-sm text-[#1f2a24] font-bold ${method === 'cod' ? 'border-[5px] border-[#74c69d] rounded-sm' : ''}`}>CASH ON DELIVERY </button>
        </div>
            </div>
        </div>
      
    </div>
  )
}

export default PlaceOrder
