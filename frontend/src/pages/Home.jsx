import React, { useContext, useEffect, useState } from 'react'
import { FiArrowRight, FiGrid, FiHeadphones, FiRefreshCcw, FiShield, FiTruck, FiUser } from "react-icons/fi"
import { LuShirt, LuShoppingBag } from "react-icons/lu"
import { GiTrousers } from "react-icons/gi"
import { useNavigate } from 'react-router-dom'
import back1 from "../assets/back1.jpg"
import back2 from "../assets/back2.jpg"
import back3 from "../assets/back3.jpg"
import { shopDataContext } from '../context/ShopContext'
import Card from '../component/Card'
import Footer from '../component/Footer'

function Home() {
  const { products } = useContext(shopDataContext)
  const [heroCount, setHeroCount] = useState(0)
  const navigate = useNavigate()

  const heroImages = [back2, back1, back3]
  const popularProducts = products.slice(0, 8)
  const categories = [
    { label: "All Collections", icon: FiGrid },
    { label: "Men", icon: FiUser },
    { label: "Women", icon: FiUser },
    { label: "Shirts", icon: LuShirt },
    { label: "T-Shirts", icon: LuShirt },
    { label: "Pants", icon: GiTrousers },
    { label: "New Arrivals", icon: LuShoppingBag }
  ]
  const policies = [
    { title: "Easy Exchange Policy", text: "Exchange made easy - quick, simple, and customer-friendly process.", icon: FiRefreshCcw },
    { title: "7 Days Return Policy", text: "Shop with confidence - 7 days easy return guarantee.", icon: FiTruck },
    { title: "Best Customer Support", text: "Trusted customer support - your satisfaction is our priority.", icon: FiHeadphones },
    { title: "Secure Shopping", text: "Your data and payments are always safe and protected.", icon: FiShield }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroCount(prev => (prev === heroImages.length - 1 ? 0 : prev + 1))
    }, 3500)
    return () => clearInterval(interval)
  }, [])

  return (
    <main className='min-h-screen overflow-hidden bg-[linear-gradient(135deg,#f8f4e8_0%,#eef3ea_50%,#d8ded8_100%)] pb-[1px]'>
      <section className='relative min-h-[620px] overflow-hidden pt-[92px] md:min-h-[700px]'>
        <img src={heroImages[heroCount]} alt="Fashion collection" className='absolute inset-0 h-full w-full object-cover' />
        <div className='absolute inset-0 bg-[linear-gradient(90deg,#fffaf0f2_0%,#fffaf0cc_34%,#fffaf000_72%)]'></div>
        <div className='absolute inset-0 opacity-50 [background-image:radial-gradient(#95d5b2_1px,transparent_1px)] [background-size:28px_28px]'></div>

        <div className='relative z-[1] mx-auto flex min-h-[520px] max-w-[1220px] items-center px-[24px] md:min-h-[610px]'>
          <div className='max-w-[620px]'>
            <p className='mb-[18px] text-[13px] font-semibold uppercase tracking-[7px] text-[#1f2a24]'>New Arrivals</p>
            <h1 className='text-[46px] leading-[1.02] text-[#1f2a24] md:text-[70px] lg:text-[78px]'>
              Discover the Best of <span className='text-[#2f6f4e]'>Bold Fashion</span>
            </h1>
            <p className='mt-[22px] max-w-[390px] text-[17px] leading-relaxed text-[#59645d]'>Elevate your style with our latest collection. Limited time only!</p>
            <button type='button' className='mt-[30px] inline-flex items-center gap-[12px] rounded-xl bg-[#2f6f4e] px-[28px] py-[13px] text-[15px] font-semibold text-[#fffaf0] shadow-lg shadow-[#8f968f44]' onClick={() => navigate("/collection")}>
              Shop Now <FiArrowRight />
            </button>
            <div className='mt-[50px] flex gap-[10px]'>
              {heroImages.map((_, index) => (
                <button key={index} type='button' aria-label={`Show slide ${index + 1}`} className={`h-[11px] rounded-full transition ${heroCount === index ? "w-[28px] bg-[#2f6f4e]" : "w-[11px] bg-[#d8ded8]"}`} onClick={() => setHeroCount(index)}></button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className='relative z-[2] mx-auto mt-[-58px] w-[calc(100%-32px)] max-w-[1120px] rounded-2xl border-[1px] border-[#e0d9c9] bg-[#fffaf0f2] p-[18px] shadow-xl shadow-[#8f968f33] md:p-[24px]'>
        <div className='grid grid-cols-2 gap-[14px] sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7'>
          {categories.map(({ label, icon: Icon }) => (
            <button key={label} type='button' className='flex min-h-[96px] flex-col items-center justify-center gap-[10px] rounded-xl text-[#1f2a24] transition hover:bg-[#e9efe4]' onClick={() => navigate("/collection")}>
              <span className='flex h-[58px] w-[58px] items-center justify-center rounded-full bg-[#eef3ea] text-[28px] text-[#2f6f4e]'><Icon /></span>
              <span className='text-center text-[13px] font-medium'>{label}</span>
            </button>
          ))}
        </div>
      </section>

      <section className='mx-auto max-w-[1220px] px-[20px] py-[42px] md:py-[58px]'>
        <div className='mb-[24px] flex items-end justify-between gap-[16px]'>
          <div>
            <h2 className='text-[30px] text-[#1f2a24] md:text-[36px]'>Popular Products</h2>
            <span className='mt-[9px] block h-[2px] w-[54px] rounded-full bg-[#2f6f4e]'></span>
          </div>
          <button type='button' className='inline-flex items-center gap-[10px] text-[14px] font-semibold text-[#2f6f4e]' onClick={() => navigate("/collection")}>View All <FiArrowRight /></button>
        </div>

        <div className='grid gap-[18px] sm:grid-cols-2 lg:grid-cols-4'>
          {popularProducts.map(item => (
            <Card key={item._id} name={item.name} id={item._id} price={item.price} image={item.image1} />
          ))}
        </div>
      </section>

      <section className='mx-auto grid max-w-[1220px] gap-[22px] px-[20px] pb-[30px] sm:grid-cols-2 lg:grid-cols-4'>
        {policies.map(({ title, text, icon: Icon }) => (
          <div key={title} className='rounded-xl border-[1px] border-[#e0d9c9] bg-[#fffaf0e8] p-[28px] text-center shadow-lg shadow-[#8f968f22]'>
            <span className='mx-auto flex h-[60px] w-[60px] items-center justify-center rounded-full bg-[#eef3ea] text-[29px] text-[#2f6f4e]'><Icon /></span>
            <h3 className='mt-[16px] text-[16px] font-bold text-[#2f6f4e]'>{title}</h3>
            <p className='mt-[8px] text-[14px] leading-relaxed text-[#59645d]'>{text}</p>
          </div>
        ))}
      </section>

      <Footer />
    </main>
  )
}

export default Home
