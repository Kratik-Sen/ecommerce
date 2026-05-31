import React from 'react'
import { useNavigate } from 'react-router-dom'

function NotFound() {
    let navigate = useNavigate()
  return (
    <div className='w-[100vw] h-[100vh] bg-[linear-gradient(135deg,#f8f4e8_0%,#e9efe4_52%,#c7d1c8_100%)] md:text-[70px] text-[30px] flex items-center justify-center text-[#1f2a24] flex-col gap-[20px]'>
      404 Page Not Found
      <button className='bg-[#fffaf0] px-[20px] py-[10px] rounded-xl text-[18px] text-[#1f2a24] cursor-pointer' onClick={()=>navigate("/login")}>Login</button>
    </div>
  )
}

export default NotFound
