import React from 'react'
import logo from "../assets/logo.png"
import { useNavigate } from 'react-router-dom'
import { FiArrowRight, FiFacebook, FiInstagram, FiMail, FiMapPin, FiPhone, FiTwitter } from "react-icons/fi"

function Footer() {
  const navigate = useNavigate()

  return (
    <footer className='mx-auto mb-[82px] mt-[30px] w-[calc(100%-28px)] max-w-[1220px] overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#4f8f67_0%,#1f6f4d_45%,#14543b_100%)] text-[#fffaf0] shadow-2xl shadow-[#8f968f55] md:mb-[28px]'>
      <div className='flex flex-col gap-[18px] border-b-[1px] border-[#ffffff2e] bg-[#ffffff12] px-[24px] py-[24px] lg:flex-row lg:items-center lg:justify-between lg:px-[48px]'>
        <div>
          <h2 className='text-[28px] leading-tight md:text-[36px]'>Join Our Newsletter</h2>
          <p className='mt-[4px] text-[14px] text-[#f8f4e8d9]'>Get exclusive updates, new arrivals, and offers.</p>
        </div>
        <div className='flex w-full max-w-[560px] overflow-hidden rounded-xl border-[2px] border-[#fffaf0] bg-[#fffaf0] p-[4px]'>
          <input className='min-w-0 flex-1 bg-transparent px-[16px] text-[14px] text-[#1f2a24] outline-none placeholder:text-[#6d766f]' placeholder='Enter your email' />
          <button type='button' className='flex items-center gap-[10px] rounded-lg bg-[#2f6f4e] px-[18px] py-[10px] text-[13px] font-semibold text-[#fffaf0] md:px-[24px]'>
            Subscribe <FiArrowRight />
          </button>
        </div>
      </div>

      <div className='grid gap-[28px] px-[24px] py-[28px] sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:px-[48px]'>
        <div>
          <img src={logo} alt="HD Traders" className='h-[62px] w-auto rounded-md bg-[#fffaf0ee] object-contain p-[4px]' />
          <p className='mt-[12px] max-w-[260px] text-[14px] leading-relaxed text-[#f8f4e8d9]'>Your destination for premium fashion and timeless style.</p>
          <div className='mt-[14px] flex gap-[10px]'>
            {[FiFacebook, FiInstagram, FiTwitter].map((Icon, index) => (
              <span key={index} className='flex h-[28px] w-[28px] items-center justify-center rounded-full bg-[#fffaf0] text-[#2f6f4e]'><Icon /></span>
            ))}
          </div>
        </div>

        <div>
          <h3 className='mb-[12px] text-[16px] font-semibold'>Quick Links</h3>
          <ul className='space-y-[7px] text-[14px] text-[#f8f4e8d9]'>
            <li className='cursor-pointer hover:text-white' onClick={() => navigate("/")}>Home</li>
            <li className='cursor-pointer hover:text-white' onClick={() => navigate("/collection")}>Collections</li>
            <li className='cursor-pointer hover:text-white' onClick={() => navigate("/order")}>Orders</li>
            <li className='cursor-pointer hover:text-white' onClick={() => navigate("/about")}>About</li>
            <li className='cursor-pointer hover:text-white' onClick={() => navigate("/contact")}>Contact</li>
          </ul>
        </div>

        <div>
          <h3 className='mb-[12px] text-[16px] font-semibold'>Customer Care</h3>
          <ul className='space-y-[7px] text-[14px] text-[#f8f4e8d9]'>
            <li>FAQ</li>
            <li>Shipping Policy</li>
            <li>Return Policy</li>
            <li>Privacy Policy</li>
            <li>Terms & Conditions</li>
          </ul>
        </div>

        <div>
          <h3 className='mb-[12px] text-[16px] font-semibold'>Contact Us</h3>
          <ul className='space-y-[9px] text-[14px] text-[#f8f4e8d9]'>
            <li className='flex items-center gap-[10px]'><FiPhone /> +91 12345 67890</li>
            <li className='flex items-center gap-[10px]'><FiMail /> support@hdtraders.com</li>
            <li className='flex items-center gap-[10px]'><FiMapPin /> Kolkata, West Bengal, India</li>
          </ul>
        </div>
      </div>

      <div className='border-t-[1px] border-[#ffffff2e] px-[24px] py-[14px] text-center text-[13px] text-[#f8f4e8d9]'>© 2026 HD Traders. All Rights Reserved.</div>
    </footer>
  )
}

export default Footer
