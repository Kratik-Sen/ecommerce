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
  const [method, setMethod] = useState('cod')
  const navigate = useNavigate()
  const { cartItem, setCartItem, getCartAmount, delivery_fee, products } = useContext(shopDataContext)
  const { serverUrl } = useContext(authDataContext)
  const [loading, setLoading] = useState(false)
  const [razorpayKeyId, setRazorpayKeyId] = useState("")

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    pinCode: '',
    country: '',
    phone: ''
  })

  const inputClass = 'w-full h-[52px] rounded-lg border-[1px] border-[#b8c0ba] bg-[#fffaf0e8] px-[16px] text-[16px] text-[#1f2a24] shadow-sm outline-none transition placeholder:text-[#6d766f] focus:border-[#74c69d] focus:bg-[#fffaf0] focus:shadow-[#95d5b2]'

  const onChangeHandler = (e) => {
    const name = e.target.name
    const value = e.target.value
    setFormData(data => ({ ...data, [name]: value }))
  }

  const initPay = (order) => {
    if (!razorpayKeyId) {
      toast.error("Razorpay is not configured")
      return
    }

    if (!window.Razorpay) {
      toast.error("Razorpay checkout could not load")
      return
    }

    const options = {
      key: razorpayKeyId,
      amount: order.amount,
      currency: order.currency,
      name: 'Order Payment',
      description: 'Order Payment',
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        try {
          const { data } = await axios.post(serverUrl + '/api/order/verifyrazorpay', response, { withCredentials: true })
          if (data?.message === 'Payment Successful') {
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
    e.preventDefault()
    setLoading(true)

    try {
      const orderItems = []
      for (const items in cartItem) {
        for (const item in cartItem[items]) {
          if (cartItem[items][item] > 0) {
            const itemInfo = structuredClone(products.find(product => product._id === items))
            if (itemInfo) {
              itemInfo.size = item
              itemInfo.quantity = cartItem[items][item]
              orderItems.push(itemInfo)
            }
          }
        }
      }

      const orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee
      }

      switch (method) {
        case 'cod': {
          const result = await axios.post(serverUrl + "/api/order/placeorder", orderData, { withCredentials: true })
          if (result.data) {
            setCartItem({})
            toast.success("Order Placed")
            navigate("/order")
          } else {
            toast.error("Order Placed Error")
          }
          break
        }

        case 'razorpay': {
          const resultRazorpay = await axios.post(serverUrl + "/api/order/razorpay", orderData, { withCredentials: true })
          if (resultRazorpay.data) {
            initPay(resultRazorpay.data)
          }
          break
        }

        default:
          break
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || "Order failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className='relative min-h-screen w-full overflow-hidden bg-[linear-gradient(135deg,#f8f4e8_0%,#e9efe4_52%,#c7d1c8_100%)] px-[16px] pb-[120px] pt-[96px] md:px-[32px] md:pb-[48px] lg:px-[70px]'>
      <div className='pointer-events-none absolute inset-0 opacity-50 [background-image:radial-gradient(#95d5b2_1px,transparent_1px),radial-gradient(#b8c0ba_1px,transparent_1px)] [background-position:0_0,18px_18px] [background-size:36px_36px]'></div>
      <div className='pointer-events-none absolute left-0 top-[70px] h-[220px] w-full bg-[linear-gradient(180deg,#fffaf080,transparent)]'></div>

      <form onSubmit={onSubmitHandler} className='relative z-[1] mx-auto grid w-full max-w-[1180px] gap-[28px] lg:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)] lg:items-start'>
        <section className='rounded-lg border-[1px] border-[#b8c0ba] bg-[#f8f4e8d9] p-[18px] shadow-xl shadow-[#8f968f33] backdrop-blur md:p-[28px]'>
          <div className='mb-[18px] border-b-[1px] border-[#b8c0ba] pb-[8px]'>
            <Title text1={'DELIVERY'} text2={'INFORMATION'} />
          </div>

          <div className='grid gap-[14px] sm:grid-cols-2'>
            <input type="text" placeholder='First name' className={inputClass} required onChange={onChangeHandler} name='firstName' value={formData.firstName} />
            <input type="text" placeholder='Last name' className={inputClass} required onChange={onChangeHandler} name='lastName' value={formData.lastName} />
            <input type="email" placeholder='Email address' className={`${inputClass} sm:col-span-2`} required onChange={onChangeHandler} name='email' value={formData.email} />
            <input type="text" placeholder='Street' className={`${inputClass} sm:col-span-2`} required onChange={onChangeHandler} name='street' value={formData.street} />
            <input type="text" placeholder='City' className={inputClass} required onChange={onChangeHandler} name='city' value={formData.city} />
            <input type="text" placeholder='State' className={inputClass} required onChange={onChangeHandler} name='state' value={formData.state} />
            <input type="text" placeholder='Pincode' className={inputClass} required onChange={onChangeHandler} name='pinCode' value={formData.pinCode} />
            <input type="text" placeholder='Country' className={inputClass} required onChange={onChangeHandler} name='country' value={formData.country} />
            <input type="text" placeholder='Phone' className={`${inputClass} sm:col-span-2`} required onChange={onChangeHandler} name='phone' value={formData.phone} />
          </div>
        </section>

        <aside className='rounded-lg border-[1px] border-[#b8c0ba] bg-[#fffaf0e6] p-[18px] shadow-xl shadow-[#8f968f33] backdrop-blur md:p-[28px] lg:sticky lg:top-[108px]'>
          <CartTotal />

          <div className='mt-[24px] border-t-[1px] border-[#b8c0ba] pt-[18px]'>
            <Title text1={'PAYMENT'} text2={'METHOD'} />
            <div className='mt-[8px] grid gap-[12px] sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2'>
              <button type='button' onClick={() => setMethod('razorpay')} className={`flex h-[64px] items-center justify-center rounded-lg border-[2px] bg-[#fffaf0] p-[8px] transition ${method === 'razorpay' ? 'border-[#74c69d] shadow-md shadow-[#95d5b2]' : 'border-[#b8c0ba] hover:border-[#74c69d]'}`}>
                <img src={razorpay} className='h-full max-w-full rounded-md object-contain' alt="Razorpay" />
              </button>
              <button type='button' onClick={() => setMethod('cod')} className={`h-[64px] rounded-lg border-[2px] bg-[#fffaf0] px-[18px] text-[15px] font-bold tracking-[0px] text-[#1f2a24] transition ${method === 'cod' ? 'border-[#74c69d] shadow-md shadow-[#95d5b2]' : 'border-[#b8c0ba] hover:border-[#74c69d]'}`}>
                CASH ON DELIVERY
              </button>
            </div>
          </div>

          <button type='submit' disabled={loading} className='mt-[24px] flex h-[58px] w-full items-center justify-center rounded-lg border-[1px] border-[#74c69d] bg-[#b7e4c7] px-[24px] text-[18px] font-semibold text-[#1f2a24] shadow-lg shadow-[#8f968f55] transition hover:bg-[#95d5b2] active:bg-[#aeb7b1] disabled:cursor-not-allowed disabled:opacity-80'>
            {loading ? <Loading /> : "PLACE ORDER"}
          </button>
        </aside>
      </form>
    </main>
  )
}

export default PlaceOrder
