import React, { useContext, useEffect, useState } from 'react'
import { FiArrowRight, FiMinus, FiPlus, FiShield, FiShoppingBag, FiTrash2, FiTruck } from "react-icons/fi"
import { MdOutlineAssignmentReturn } from "react-icons/md"
import { shopDataContext } from '../context/ShopContext'
import { useNavigate } from 'react-router-dom'
import { noSizeKey } from '../constants/categories'
import { userDataContext } from '../context/UserContext'
import { toast } from 'react-toastify'

function Cart() {
  const { products, currency, cartItem, updateQuantity, getCartAmount, delivery_fee, getVariantPrice } = useContext(shopDataContext)
  const { userData } = useContext(userDataContext)
  const [cartData, setCartData] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const tempData = []
    for (const items in cartItem) {
      for (const item in cartItem[items]) {
        if (cartItem[items][item] > 0) {
          tempData.push({
            _id: items,
            size: item,
            quantity: cartItem[items][item],
          })
        }
      }
    }
    setCartData(tempData)
  }, [cartItem])

  const checkout = () => {
    if (!userData) {
      toast.error("Please login to place order")
      navigate("/login", { state: { from: "/placeorder" } })
    } else if (cartData.length > 0) {
      navigate("/placeorder")
    } else {
      toast.error("Your cart is empty")
    }
  }

  const features = [
    { title: "Secure Checkout", text: "Your payments are safe and encrypted", icon: FiShield },
    { title: "Fast Delivery", text: "Quick delivery at your doorstep", icon: FiTruck },
    { title: "Easy Returns", text: "7 days easy return policy", icon: MdOutlineAssignmentReturn }
  ]

  return (
    <main className='min-h-screen overflow-hidden bg-[linear-gradient(135deg,#f8f4e8_0%,#eef3ea_52%,#e1e7df_100%)] px-[18px] pb-[110px] pt-[108px] text-[#1f2a24] md:px-[34px]'>
      <div className='pointer-events-none fixed inset-0 opacity-35 [background-image:radial-gradient(#95d5b2_1px,transparent_1px)] [background-size:34px_34px]'></div>
      <div className='relative z-[1] mx-auto max-w-[1240px]'>
        <div className='mb-[34px] text-center'>
          <h1 className='text-[46px] leading-none text-[#0f4d45] md:text-[64px]'>Your Cart</h1>
          <span className='mx-auto mt-[16px] block h-[2px] w-[58px] bg-[#95d5b2]'></span>
        </div>

        <div className='space-y-[22px]'>
          {cartData.length === 0 && (
            <div className='rounded-2xl border-[1px] border-[#e0d9c9] bg-[#fffaf0e8] p-[34px] text-center shadow-lg shadow-[#8f968f22]'>
              <FiShoppingBag className='mx-auto text-[46px] text-[#2f6f4e]' />
              <h2 className='mt-[14px] text-[24px] font-semibold'>Your cart is empty</h2>
              <button type='button' className='mt-[18px] inline-flex items-center gap-[10px] rounded-xl bg-[#2f6f4e] px-[22px] py-[12px] font-bold text-[#fffaf0]' onClick={() => navigate("/collection")}>Start Shopping <FiArrowRight /></button>
            </div>
          )}

          {cartData.map((item) => {
            const productData = products.find((product) => product._id === item._id)
            if (!productData) return null
            const hasSize = item.size && item.size !== noSizeKey
            const itemPrice = getVariantPrice(productData, item.size)
            return (
              <article key={`${item._id}-${item.size}`} className='grid gap-[20px] rounded-2xl border-[1px] border-[#e0d9c9] bg-[#fffaf0d9] p-[18px] shadow-xl shadow-[#8f968f26] md:grid-cols-[180px_1fr_auto_auto] md:items-center md:p-[24px]'>
                <img className='h-[180px] w-full rounded-xl border-[1px] border-[#e0d9c9] object-cover md:w-[180px]' src={productData.image1} alt={productData.name} />
                <div>
                  <h2 className='text-[26px] font-bold capitalize text-[#0f4d45]'>{productData.name}</h2>
                  <p className='mt-[12px] text-[22px] font-bold text-[#2f6f4e]'>{currency} {itemPrice}</p>
                  {hasSize && <span className='mt-[14px] inline-flex rounded-lg bg-[#d8ded8] px-[16px] py-[9px] text-[14px] font-semibold text-[#1f2a24]'>Size: {item.size}</span>}
                </div>

                <div className='flex h-[52px] w-[170px] overflow-hidden rounded-xl border-[1px] border-[#d8ded8] bg-[#fffaf0]'>
                  <button type='button' className='flex w-[52px] items-center justify-center text-[#2f6f4e]' onClick={() => updateQuantity(item._id, item.size, Math.max(0, item.quantity - 1))}><FiMinus /></button>
                  <span className='flex flex-1 items-center justify-center border-x-[1px] border-[#d8ded8] font-bold'>{item.quantity}</span>
                  <button type='button' className='flex w-[52px] items-center justify-center text-[#2f6f4e]' onClick={() => updateQuantity(item._id, item.size, item.quantity + 1)}><FiPlus /></button>
                </div>

                <div className='flex items-center justify-between gap-[24px] md:justify-end'>
                  <p className='text-[18px] font-bold text-[#2f6f4e]'>{currency} {itemPrice * item.quantity}</p>
                  <button type='button' className='flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#eef3ea] text-[23px] text-[#0f4d45] transition hover:bg-[#d8ded8]' onClick={() => updateQuantity(item._id, item.size, 0)} aria-label='Remove item'>
                    <FiTrash2 />
                  </button>
                </div>
              </article>
            )
          })}
        </div>

        <div className='mt-[34px] grid gap-[28px] lg:grid-cols-[420px_1fr] lg:items-center'>
          <section className='rounded-2xl border-[1px] border-[#e0d9c9] bg-[#fffaf0e8] p-[24px] shadow-xl shadow-[#8f968f26]'>
            <div className='mb-[22px] flex items-center gap-[14px]'>
              <span className='flex h-[54px] w-[54px] items-center justify-center rounded-full bg-[#eef3ea] text-[27px] text-[#2f6f4e]'><FiShoppingBag /></span>
              <h2 className='text-[25px] text-[#0f4d45]'>Cart Totals</h2>
            </div>
            <div className='space-y-[14px] text-[16px]'>
              <div className='flex justify-between border-b-[1px] border-[#d8ded8] pb-[12px]'><span>Subtotal</span><span>{currency} {getCartAmount()}.00</span></div>
              <div className='flex justify-between border-b-[1px] border-[#d8ded8] pb-[12px]'><span>Shipping Fee</span><span>{currency} {delivery_fee}.00</span></div>
              <div className='flex justify-between text-[18px] font-bold'><span>Total</span><span className='text-[#2f6f4e]'>{currency} {getCartAmount() === 0 ? 0 : getCartAmount() + delivery_fee}.00</span></div>
            </div>
            <button type='button' className='mt-[24px] flex h-[58px] w-full items-center justify-center gap-[12px] rounded-xl bg-[#2f6f4e] px-[22px] font-bold text-[#fffaf0] shadow-lg shadow-[#8f968f33]' onClick={checkout}>
              PROCEED TO CHECKOUT <FiArrowRight />
            </button>
          </section>

          <section className='grid gap-[20px] rounded-2xl border-[1px] border-[#e0d9c9] bg-[#fffaf0cc] p-[24px] shadow-xl shadow-[#8f968f22] md:grid-cols-3 md:p-[34px]'>
            {features.map(({ title, text, icon: Icon }, index) => (
              <div key={title} className={`text-center ${index > 0 ? "md:border-l-[1px] md:border-[#d8ded8]" : ""}`}>
                <span className='mx-auto flex h-[64px] w-[64px] items-center justify-center rounded-full bg-[#e1f0e6] text-[31px] text-[#2f6f4e]'><Icon /></span>
                <h3 className='mt-[18px] text-[18px] font-bold text-[#2f6f4e]'>{title}</h3>
                <p className='mx-auto mt-[10px] max-w-[170px] text-[14px] leading-relaxed text-[#59645d]'>{text}</p>
              </div>
            ))}
          </section>
        </div>
      </div>
    </main>
  )
}

export default Cart
