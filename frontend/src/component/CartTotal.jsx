import React, { useContext } from 'react'
import { shopDataContext } from '../context/ShopContext'
import Title from './Title'

function CartTotal() {
    const {currency , delivery_fee , getCartAmount} = useContext(shopDataContext)
  return (
    <div className='w-full'>
        <div className='text-xl'>
        <Title text1={'CART'} text2={'TOTALS'}/>
      </div>
      <div className='mt-2 flex flex-col gap-2 rounded-lg border-[1px] border-[#95d5b2] bg-[#f8f4e8cc] p-[18px] text-sm shadow-inner shadow-[#8f968f22] md:p-[24px]'>
       <div className='flex justify-between gap-[16px] text-[#1f2a24] text-[16px] md:text-[18px] p-[8px]'>
          <p >Subtotal</p>
          <p>{currency} {getCartAmount()}.00</p>
        </div>
        <hr/>
         <div className='flex justify-between gap-[16px] text-[#1f2a24] text-[16px] md:text-[18px] p-[8px]'>
          <p>Shipping Fee</p>
          <p>{currency} {delivery_fee}</p>
        </div>
        <hr/>
        <div className='flex justify-between gap-[16px] text-[#1f2a24] text-[17px] md:text-[19px] p-[8px]'>
          <b>Total</b>
          <b>{currency} {getCartAmount()=== 0 ? 0 :getCartAmount() + delivery_fee}</b>
        </div>

      </div>
      
    </div>
  )
}

export default CartTotal
