import React, { useContext, useMemo, useState } from 'react'
import { FiHeart } from "react-icons/fi"
import { FaHeart } from "react-icons/fa"
import { shopDataContext } from '../context/ShopContext'
import { useNavigate } from 'react-router-dom'

function Card({ name, image, images, id, price }) {
  const { currency, isWishlisted, toggleWishlist } = useContext(shopDataContext)
  const [activeImage, setActiveImage] = useState(0)
  const [touchStart, setTouchStart] = useState(null)
  const navigate = useNavigate()
  const imageList = useMemo(() => {
    const list = Array.isArray(images) ? images.filter(Boolean) : []
    return list.length ? list : [image].filter(Boolean)
  }, [image, images])
  const wished = isWishlisted(id)

  const changeImage = (direction) => {
    if (imageList.length < 2) return
    setActiveImage(prev => (prev + direction + imageList.length) % imageList.length)
  }

  const handleTouchEnd = (e) => {
    if (touchStart === null) return
    const distance = touchStart - e.changedTouches[0].clientX
    if (Math.abs(distance) > 35) {
      changeImage(distance > 0 ? 1 : -1)
    }
    setTouchStart(null)
  }

  return (
    <article className='group relative h-[360px] w-full max-w-[390px] overflow-hidden rounded-xl border-[1px] border-[#e0d9c9] bg-[#fffaf0e8] shadow-md shadow-[#8f968f22] transition hover:-translate-y-[3px] hover:shadow-xl hover:shadow-[#8f968f33] sm:h-[340px]' onClick={() => navigate(`/productdetail/${id}`)}>
      <button type='button' className={`absolute right-[12px] top-[12px] z-[2] flex h-[40px] w-[40px] items-center justify-center rounded-full bg-[#fffaf0ee] text-[18px] shadow-md shadow-[#8f968f33] transition hover:scale-105 ${wished ? "text-[#d36b5f]" : "text-[#2f6f4e]"}`} aria-label={wished ? "Remove from wishlist" : "Add to wishlist"} onClick={(e) => {
        e.stopPropagation()
        toggleWishlist(id)
      }}>
        {wished ? <FaHeart /> : <FiHeart />}
      </button>
      <div className='relative h-[270px] w-full touch-pan-y bg-white sm:h-[245px]' onTouchStart={(e) => setTouchStart(e.touches[0].clientX)} onTouchEnd={handleTouchEnd}>
        <img src={imageList[activeImage]} alt={name} className='h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]' />
        {imageList.length > 1 && (
          <div className='absolute bottom-[10px] left-0 right-0 flex justify-center gap-[6px] md:hidden'>
            {imageList.map((_, index) => (
              <span key={index} className={`h-[6px] rounded-full ${activeImage === index ? "w-[18px] bg-[#2f6f4e]" : "w-[6px] bg-[#fffaf0cc]"}`}></span>
            ))}
          </div>
        )}
      </div>
      <div className='min-h-[90px] bg-[#fffaf0f2] px-[16px] py-[12px]'>
        <h3 className='line-clamp-1 text-[18px] font-semibold text-[#1f2a24] sm:text-[16px]'>{name}</h3>
        <p className='mt-[5px] text-[17px] font-semibold text-[#2f6f4e] sm:text-[15px]'>{currency} {price}</p>
      </div>
    </article>
  )
}

export default Card
