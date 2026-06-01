import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from "../assets/logo.png"
import axios from 'axios'
import { authDataContext } from '../context/AuthContext'
import { adminDataContext } from '../context/AdminContext'
import { toast } from 'react-toastify'

function Nav() {
    let navigate = useNavigate()
    let {serverUrl} = useContext(authDataContext)
    let {getAdmin} = useContext(adminDataContext)

    const logOut = async () => {
        try {
            const result = await axios.get(serverUrl + "/api/auth/logout", {withCredentials:true})
            console.log(result.data)
            toast.success("LogOut Successfully")
            getAdmin()
            navigate("/login")

        } catch (error) {
            console.log(error)
            toast.error("LogOut Failed")
        }
        
    }
  return (
    <div className='w-[100vw] h-[70px] md:h-[86px] bg-[#f8f4e8f8] z-10 fixed top-0 flex  items-center justify-between px-[30px] overflow-x-hidden shadow-md shadow-[#8f968f] '>
        <div className='w-[30%]  flex items-center justify-start   gap-[10px] cursor-pointer ' onClick={()=>navigate("/")}>
        <img src={logo} alt=""  className='w-[90px] md:w-[130px] lg:w-[170px]'/>

       


        </div>
         <button className='text-[15px] hover:border-[2px] border-[#74c69d] cursor-pointer bg-[#b7e4c7] py-[10px] px-[20px] rounded-2xl text-[#1f2a24] ' onClick={logOut}>LogOut</button>
      
    </div>
  )
}

export default Nav
