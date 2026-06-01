import React, { useContext } from 'react'
import { FiHeart } from "react-icons/fi"
import { shopDataContext } from '../context/ShopContext'
import { useNavigate } from 'react-router-dom'

function Card({ name, image, id, price }) {
  const { currency } = useContext(shopDataContext)
  const navigate = useNavigate()

  return (
    <article className='group relative h-[330px] overflow-hidden rounded-xl border-[1px] border-[#e0d9c9] bg-[#fffaf0e8] shadow-md shadow-[#8f968f22] transition hover:-translate-y-[3px] hover:shadow-xl hover:shadow-[#8f968f33]' onClick={() => navigate(`/productdetail/${id}`)}>
      <button type='button' className='absolute right-[12px] top-[12px] z-[2] flex h-[34px] w-[34px] items-center justify-center rounded-full bg-[#fffaf0e8] text-[#2f6f4e] shadow-md shadow-[#8f968f33]' aria-label='Add to wishlist' onClick={(e) => e.stopPropagation()}>
        <FiHeart />
      </button>
      <div className='h-[240px] w-full bg-white'>
        <img src={image} alt={name} className='h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]' />
      </div>
      <div className='min-h-[90px] bg-[#fffaf0f2] px-[16px] py-[12px]'>
        <h3 className='line-clamp-1 text-[16px] font-semibold text-[#1f2a24]'>{name}</h3>
        <p className='mt-[5px] text-[15px] font-semibold text-[#2f6f4e]'>{currency} {price}</p>
      </div>
    </article>
  )
}

export default Card
