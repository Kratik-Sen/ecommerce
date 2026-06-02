import React, { useContext } from 'react'
import { FiArrowRight, FiHeart } from "react-icons/fi"
import { useNavigate } from 'react-router-dom'
import Card from '../component/Card'
import { shopDataContext } from '../context/ShopContext'

function Wishlist() {
  const { products, wishlist } = useContext(shopDataContext)
  const navigate = useNavigate()
  const wishlistProducts = products.filter(item => wishlist.includes(item._id))

  return (
    <main className='min-h-screen overflow-x-hidden bg-[linear-gradient(135deg,#f8f4e8_0%,#eef3ea_52%,#e1e7df_100%)] px-[18px] pb-[118px] pt-[98px] text-[#1f2a24] md:px-[34px] md:pt-[112px]'>
      <div className='relative z-[1] mx-auto max-w-[1220px]'>
        <div className='mb-[28px] flex flex-col gap-[12px] sm:flex-row sm:items-end sm:justify-between'>
          <div>
            <h1 className='text-[42px] leading-tight text-[#2f6f4e] md:text-[58px]'>Wishlist</h1>
            <p className='mt-[8px] text-[15px] text-[#59645d] md:text-[17px]'>Products you saved for later.</p>
          </div>
          <button type='button' className='inline-flex h-[48px] items-center justify-center gap-[10px] rounded-xl border-[1px] border-[#74c69d] bg-[#fffaf0] px-[18px] font-bold text-[#2f6f4e] transition hover:bg-[#e9efe4]' onClick={() => navigate("/collection")}>
            Shop More <FiArrowRight />
          </button>
        </div>

        {wishlistProducts.length === 0 ? (
          <section className='rounded-2xl border-[1px] border-[#e0d9c9] bg-[#fffaf0e8] p-[34px] text-center shadow-lg shadow-[#8f968f22]'>
            <FiHeart className='mx-auto text-[46px] text-[#2f6f4e]' />
            <h2 className='mt-[14px] text-[24px] font-semibold'>Your wishlist is empty</h2>
            <p className='mt-[6px] text-[#59645d]'>Tap the heart on a product card to save it here.</p>
          </section>
        ) : (
          <section className='grid justify-items-center gap-[20px] sm:grid-cols-2 lg:grid-cols-4'>
            {wishlistProducts.map(item => (
              <Card key={item._id} id={item._id} name={item.name} price={item.price} image={item.image1} images={[item.image1, item.image2, item.image3, item.image4]} />
            ))}
          </section>
        )}
      </div>
    </main>
  )
}

export default Wishlist
