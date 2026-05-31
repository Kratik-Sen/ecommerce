import React from 'react'
import Title from '../component/Title'
import contact from "../assets/contact.jpg"
import NewLetterBox from '../component/NewLetterBox'

function Contact() {
  return (
    <div className='w-[99vw] min-h-[100vh] flex items-center justify-center flex-col bg-[linear-gradient(135deg,#f8f4e8_0%,#e9efe4_52%,#c7d1c8_100%)] gap-[50px] pt-[80px]'>
      <Title text1={'CONTACT'} text2={'US'} />
      
      <div className='w-[100%] flex items-center justify-center flex-col lg:flex-row'>
        <div className='lg:w-[50%] w-[100%] flex items-center justify-center'>
          <img src={contact} alt="" className='lg:w-[70%] w-[80%] shadow-md shadow-[#8f968f] rounded-sm'/>
        </div>

        <div className='lg:w-[50%] w-[80%] flex items-start justify-center gap-[20px] flex-col mt-[20px] lg:mt-[0px]'>
          <p className='lg:w-[80%] w-[100%] text-[#1f2a24] font-bold lg:text-[18px] text-[15px]'>Our Store</p>

          <div className='lg:w-[80%] w-[100%] text-[#1f2a24] md:text-[16px] text-[13px]'>
            <p>12345 Random Station</p>
            <p>Random City, State, India</p>
          </div>

          <div className='lg:w-[80%] w-[100%] text-[#1f2a24] md:text-[16px] text-[13px]'>
            <p>Tel: +91-9876543210</p>
            <p>Email: admin@onecart.com</p>
          </div>

          <p className='lg:w-[80%] w-[100%] text-[15px] text-[#1f2a24] lg:text-[18px] mt-[10px] font-bold'>Careers at OneCart</p>
          <p className='lg:w-[80%] w-[100%] text-[#1f2a24] md:text-[16px] text-[13px]'>
            Learn more about our teams and job openings
          </p>

          <button className='px-[30px] py-[20px] flex items-center justify-center text-[#1f2a24] bg-transparent border active:bg-[#c9d0ca] rounded-md'>
            Explore Jobs
          </button>
        </div>
      </div>

      <NewLetterBox />
    </div>
  )
}

export default Contact
