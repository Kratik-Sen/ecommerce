import React from 'react'
import about from '../assets/about.jpg'
import { FiAward, FiHeart, FiHeadphones, FiShield, FiTruck } from "react-icons/fi"
import { LuShoppingBag } from "react-icons/lu"

function About() {
  const features = [
    { title: "Premium Quality", text: "We use trusted products and thoughtful sourcing for comfort, style, and value.", icon: FiShield },
    { title: "Made with Love", text: "Every collection is chosen to make everyday shopping feel simple and joyful.", icon: FiHeart }
  ]

  const reasons = [
    { title: "Quality Assurance", text: "We guarantee the best quality products and a reliable shopping experience.", icon: FiAward },
    { title: "Convenience", text: "Easy shopping, secure payments, and fast delivery right to your doorstep.", icon: FiTruck },
    { title: "Customer Service", text: "Our friendly support team is always here to help you anytime, anywhere.", icon: FiHeadphones }
  ]

  return (
    <main className='min-h-screen overflow-hidden bg-[linear-gradient(135deg,#f8f4e8_0%,#eef3ea_52%,#e1e7df_100%)] px-[18px] pb-[110px] pt-[110px] text-[#1f2a24] md:px-[34px]'>
      <div className='pointer-events-none fixed inset-0 opacity-35 [background-image:radial-gradient(#95d5b2_1px,transparent_1px)] [background-size:34px_34px]'></div>
      <section className='relative z-[1] mx-auto grid max-w-[1240px] gap-[42px] lg:grid-cols-[0.95fr_1fr] lg:items-center'>
        <div className='relative mx-auto w-full max-w-[560px] overflow-hidden rounded-2xl shadow-2xl shadow-[#8f968f44]'>
          <img src={about} alt="HD Traders collection" className='h-[520px] w-full object-cover' />
          <div className='absolute inset-0 bg-[linear-gradient(180deg,#00000000_38%,#1f2a24cc_100%)]'></div>
          <div className='absolute left-[34px] top-[76px]'>
            <span className='rounded-full bg-[#fffaf0e8] px-[18px] py-[7px] text-[12px] font-bold uppercase text-[#2f6f4e]'>About Us</span>
            <h2 className='mt-[18px] max-w-[310px] text-[38px] leading-tight text-[#fffaf0] md:text-[48px]'>HD Traders</h2>
            <p className='mt-[12px] max-w-[280px] text-[16px] leading-relaxed text-[#fffaf0e8]'>Premium products, practical prices, and a shopping experience designed for families.</p>
          </div>
          <div className='absolute bottom-[36px] left-[34px] right-[34px] flex flex-col gap-[18px] sm:flex-row sm:items-end sm:justify-between'>
            <div>
              <span className='mb-[14px] block h-[2px] w-[56px] bg-[#74c69d]'></span>
              <p className='text-[25px] font-semibold leading-tight text-[#fffaf0]'>SUITABLE FOR<br />EVERYDAY STYLE</p>
            </div>
            <div className='flex items-center gap-[10px] rounded-xl bg-[#fffaf0f2] px-[18px] py-[12px] text-[13px] font-bold text-[#2f6f4e]'>
              <LuShoppingBag /> WWW.HDTRADERS.COM
            </div>
          </div>
        </div>

        <div>
          <p className='text-[13px] font-bold uppercase tracking-[2px] text-[#2f6f4e]'>About Us</p>
          <span className='mt-[12px] block h-[2px] w-[48px] bg-[#2f6f4e]'></span>
          <h1 className='mt-[28px] text-[44px] leading-[1.08] md:text-[58px]'>Crafted with Care, <span className='text-[#2f6f4e]'>Loved</span> by Families</h1>
          <div className='my-[28px] h-[1px] bg-[#d8ded8]'></div>
          <p className='max-w-[650px] text-[16px] leading-relaxed text-[#59645d]'>At HD Traders, we believe shopping should feel simple, trustworthy, and inspiring. Our collection brings together quality products, trending styles, and daily essentials in one comfortable place.</p>
          <p className='mt-[18px] max-w-[650px] text-[16px] leading-relaxed text-[#59645d]'>From fashion finds to everyday needs, everything we offer is selected with attention to quality, affordability, and customer happiness.</p>

          <div className='mt-[36px] grid gap-[22px] sm:grid-cols-2'>
            {features.map(({ title, text, icon: Icon }) => (
              <div key={title} className='flex gap-[18px]'>
                <span className='flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-xl bg-[#e1f0e6] text-[28px] text-[#2f6f4e]'><Icon /></span>
                <div>
                  <h3 className='font-bold text-[#1f2a24]'>{title}</h3>
                  <p className='mt-[8px] text-[14px] leading-relaxed text-[#59645d]'>{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className='relative z-[1] mx-auto mt-[54px] max-w-[1120px] rounded-2xl border-[1px] border-[#e0d9c9] bg-[#fffaf0cc] p-[24px] shadow-xl shadow-[#8f968f22] md:p-[34px]'>
        <h2 className='mb-[28px] text-center text-[18px] font-bold uppercase tracking-[2px] text-[#2f6f4e]'>Why Choose Us</h2>
        <div className='grid gap-[24px] md:grid-cols-3'>
          {reasons.map(({ title, text, icon: Icon }, index) => (
            <div key={title} className={`flex gap-[18px] ${index > 0 ? "md:border-l-[1px] md:border-[#d8ded8] md:pl-[24px]" : ""}`}>
              <span className='flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-full bg-[#e1f0e6] text-[27px] text-[#2f6f4e]'><Icon /></span>
              <div>
                <h3 className='font-bold text-[#2f6f4e]'>{title}</h3>
                <p className='mt-[8px] text-[14px] leading-relaxed text-[#59645d]'>{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}

export default About
