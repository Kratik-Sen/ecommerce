import React from 'react'
import logo from "../assets/logo.png"
import { useNavigate } from 'react-router-dom'
function Footer() {
    let navigate = useNavigate()
  return (
   <>
    <div className='w-[100%] md:h-[36vh] h-[21vh] mb-[77px] md:mb-[0px]'>
        <div className='w-[100%] md:h-[30vh] h-[15vh]  md:mb-[0px] bg-[#f8f4e8ec] flex items-center justify-center md:px-[50px] px-[5px]'>
            <div className='md:w-[30%] w-[35%] h-[100%] flex items-start justify-center flex-col gap-[5px]  '>
                <div className='flex items-start justify-start gap-[5px] mt-[10px] md:mt-[40px]'>
                    <img src={logo} alt=""  className='md:w-[40px] md:h-[40px] w-[30px] h-[30px]'/>
                    <p className='text-[19px] md:text-[20px] text-[#1f2a24] '>OneCart</p>
            
                </div>
                <p className='text-[15px] text-[#1f2a24] hidden md:block'>OneCart is your all-in-one online shopping destination, offering top-quality products, unbeatable deals, and fast delivery—all backed by trusted service designed to make your life easier every day.</p>
                    <p className='text-[15px] text-[#1f2a24] flex md:hidden'>Fast. Easy. Reliable. OneCart Shopping</p>

                
            </div>
            <div className='md:w-[25%] w-[30%] h-[100%] flex items-center justify-center flex-col text-center'>
                    <div className='flex items-center justify-center gap-[5px] mt-[10px] md:mt-[40px]'>
                        <p className='text-[19px] md:text-[20px] text-[#1f2a24] font-sans '>COMPANY</p>

                    </div>
                    <ul>
                         <li className='text-[15px] text-[#1f2a24] hidden md:block cursor-pointer' onClick={()=>{navigate("/")}}>Home</li>
                        <li className='text-[15px] text-[#1f2a24] cursor-pointer'  onClick={()=>{navigate("/about")}}>About us</li>
                        <li className='text-[15px] text-[#1f2a24] hidden md:block cursor-pointer'>Delivery</li>
                        <li className='text-[15px] text-[#1f2a24] cursor-pointer'>Privacy Policy</li>
                    </ul>
                </div>

                <div className='md:w-[25%] w-[40%]  h-[100%] flex items-center justify-center flex-col text-center '>
                     <div className='flex items-center justify-center gap-[5px] mt-[10px] md:mt-[40px]'>
                        <p className='text-[19px] md:text-[20px] text-[#1f2a24] font-sans '>GET IN TOUCH</p>

                    </div>
                     <ul>
                         <li className='text-[15px] text-[#1f2a24] '>+91-9876543210</li>
                        <li className='text-[15px] text-[#1f2a24] '>contact@onecart.com</li>
                        <li className='text-[15px] text-[#1f2a24] hidden md:block'>+1-123-456-7890</li>
                        <li className='text-[15px] text-[#1f2a24] hidden md:block'>admin@onecart.com</li>
                    </ul>
                </div>

        </div>
        <div className='w-[100%] h-[1px] bg-[#aeb7b1]'></div>
        <div className='w-[100%] h-[5vh] bg-[#f8f4e8ec] flex items-center justify-center'>Copyright 2025@onecart.com-All Rights Reserved</div> 
    
    </div>
   </>
  )
}

export default Footer
