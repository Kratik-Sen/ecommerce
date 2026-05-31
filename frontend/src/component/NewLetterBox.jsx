import React from 'react'

function NewLetterBox() {
    const handleSubmit = ()=>{
        e.preventDefault()
    }
  return (
    <div className='w-[100%] h-[40vh]  bg-[linear-gradient(135deg,#f8f4e8_0%,#e9efe4_52%,#c7d1c8_100%)] flex items-center justify-start gap-[10px] flex-col'>
      <p className='md:text-[30px] text-[20px] text-[#2f6f4e] font-semibold px-[20px]'>Subscribe now & get 20% off</p>
      <p className='md:text-[18px] text-[14px] text-center text-[#59645d] font-semibold px-[20px]'>Subscribe now and enjoy exclusive savings, special deals, and early access to new collections.</p>
      <form action="" onSubmit={handleSubmit} className='w-[100%] h-[30%] md:h-[50%] flex items-center justify-center mt-[20px] gap-[20px] px-[20px]'>
        <input type="text" placeholder='Enter Your Email' className='placeholder:text-[#6d766f] bg-[#fffaf0] w-[600px] max-w-[60%] h-[40px]  px-[20px] rounded-lg shadow-sm shadow-[#8f968f]' required />
        <button type='submit' className='text-[15px] md:text-[16px] px-[10px] md:px-[30px] py-[12px] md:py-[10px]  hover:bg-[#aeb7b1] cursor-pointer bg-[#95d5b2]  text-[#1f2a24] flex items-center justify-center gap-[20px]  border-[1px] border-[#b8c0ba]  rounded-lg shadow-sm shadow-[#8f968f]'>Subscribe</button>
      </form>
    </div>
  )
}

export default NewLetterBox
