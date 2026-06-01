import React from 'react'

function Title({text1 ,text2}) {
  return (
    <div className='inline-flex flex-wrap gap-2 items-center text-center mb-3 text-[28px] md:text-[36px] lg:text-[40px] leading-tight'>
        <p className='text-[#59645d]'>{text1} <span className='text-[#2f6f4e] '>{text2}</span></p>
      
    </div>
  )
}

export default Title
