import React, { useContext, useState } from 'react'
import logo from '../assets/logo.png'
import { IoSearchCircleOutline, IoSearchCircleSharp } from "react-icons/io5"
import { FaCircleUser } from "react-icons/fa6"
import { MdOutlineShoppingCart } from "react-icons/md"
import { IoMdHome } from "react-icons/io"
import { HiOutlineCollection } from "react-icons/hi"
import { MdContacts } from "react-icons/md"
import { userDataContext } from '../context/UserContext'
import { authDataContext } from '../context/AuthContext'
import { shopDataContext } from '../context/ShopContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function Nav() {
  const { getCurrentUser, userData, setUserData } = useContext(userDataContext)
  const { serverUrl } = useContext(authDataContext)
  const { showSearch, setShowSearch, search, setSearch, getCartCount } = useContext(shopDataContext)
  const [showProfile, setShowProfile] = useState(false)
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      const result = await axios.get(serverUrl + "/api/auth/logout", { withCredentials: true })
      console.log(result.data)
      setUserData(null)         // ✅ Instantly update UI after logout
      navigate("/login")
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='w-[100vw] h-[70px] bg-[#f8f4e8ec] z-10 fixed top-0 flex items-center justify-between px-[30px] shadow-md shadow-[#8f968f]'>
      <div className='w-[20%] lg:w-[30%] flex items-center justify-start gap-[10px]'>
        <img src={logo} alt="" className='w-[30px]' />
        <h1 className='text-[25px] text-[#1f2a24] font-sans'>OneCart</h1>
      </div>

      <div className='w-[50%] lg:w-[40%] hidden md:flex'>
        <ul className='flex items-center justify-center gap-[19px] text-[#1f2a24]'>
          <li className='text-[15px] hover:bg-[#aeb7b1] cursor-pointer bg-[#b7e4c7] py-[10px] px-[20px] rounded-2xl' onClick={() => navigate("/")}>HOME</li>
          <li className='text-[15px] hover:bg-[#aeb7b1] cursor-pointer bg-[#b7e4c7] py-[10px] px-[20px] rounded-2xl' onClick={() => navigate("/collection")}>COLLECTIONS</li>
          <li className='text-[15px] hover:bg-[#aeb7b1] cursor-pointer bg-[#b7e4c7] py-[10px] px-[20px] rounded-2xl' onClick={() => navigate("/about")}>ABOUT</li>
          <li className='text-[15px] hover:bg-[#aeb7b1] cursor-pointer bg-[#b7e4c7] py-[10px] px-[20px] rounded-2xl' onClick={() => navigate("/contact")}>CONTACT</li>
        </ul>
      </div>

      <div className='w-[30%] flex items-center justify-end gap-[20px]'>
        {!showSearch && <IoSearchCircleOutline className='w-[38px] h-[38px] text-[#1f2a24] cursor-pointer' onClick={() => setShowSearch(prev => !prev)} />}
        {showSearch && <IoSearchCircleSharp className='w-[38px] h-[38px] text-[#1f2a24] cursor-pointer' onClick={() => setShowSearch(prev => !prev)} />}
        {!userData && <FaCircleUser className='w-[29px] h-[29px] text-[#1f2a24] cursor-pointer' onClick={() => setShowProfile(prev => !prev)} />}
        {userData && <div className='w-[30px] h-[30px] bg-[#95d5b2] text-[#1f2a24] rounded-full flex items-center justify-center cursor-pointer' onClick={() => setShowProfile(prev => !prev)}>{userData?.name.slice(0, 1)}</div>}
        <MdOutlineShoppingCart className='w-[30px] h-[30px] text-[#1f2a24] cursor-pointer hidden md:block' onClick={() => navigate("/cart")} />
        <p className='absolute w-[18px] h-[18px] items-center justify-center bg-[#95d5b2] px-[5px] py-[2px] text-[#1f2a24] rounded-full text-[9px] top-[10px] right-[23px] hidden md:block'>{getCartCount()}</p>
      </div>

      {showSearch && (
        <div className='w-[100%] h-[80px] bg-[#d8ded8dd] absolute top-[100%] left-0 right-0 flex items-center justify-center'>
          <input type="text" className='lg:w-[50%] w-[80%] h-[60%] bg-[#fffaf0] rounded-[30px] px-[50px] placeholder:text-[#6d766f] text-[#1f2a24] text-[18px]' placeholder='Search Here' onChange={(e) => setSearch(e.target.value)} value={search} />
        </div>
      )}

      {showProfile && (
        <div className='absolute w-[220px] h-[150px] bg-[#fffaf0f2] top-[110%] right-[4%] border-[1px] border-[#b8c0ba] rounded-[10px] z-10'>
          <ul className='w-[100%] h-[100%] flex items-start justify-around flex-col text-[17px] py-[10px] text-[#1f2a24]'>
            {!userData && <li className='w-[100%] hover:bg-[#d8ded8] px-[15px] py-[10px] cursor-pointer' onClick={() => { navigate("/login"); setShowProfile(false) }}>Login</li>}
            {userData && <li className='w-[100%] hover:bg-[#d8ded8] px-[15px] py-[10px] cursor-pointer' onClick={() => { handleLogout(); setShowProfile(false) }}>LogOut</li>}
            <li className='w-[100%] hover:bg-[#d8ded8] px-[15px] py-[10px] cursor-pointer' onClick={() => { navigate("/order"); setShowProfile(false) }}>Orders</li>
            <li className='w-[100%] hover:bg-[#d8ded8] px-[15px] py-[10px] cursor-pointer' onClick={() => { navigate("/about"); setShowProfile(false) }}>About</li>
          </ul>
        </div>
      )}

      <div className='w-[100vw] h-[90px] flex items-center justify-between px-[20px] text-[12px] fixed bottom-0 left-0 bg-[#b7e4c7] md:hidden'>
        <button className='text-[#1f2a24] flex items-center justify-center flex-col gap-[2px]' onClick={() => navigate("/")}><IoMdHome className='w-[28px] h-[28px] text-[#1f2a24]' /> Home</button>
        <button className='text-[#1f2a24] flex items-center justify-center flex-col gap-[2px]' onClick={() => navigate("collection")}><HiOutlineCollection className='w-[28px] h-[28px] text-[#1f2a24]' /> Collections</button>
        <button className='text-[#1f2a24] flex items-center justify-center flex-col gap-[2px]' onClick={() => navigate("/contact")}><MdContacts className='w-[28px] h-[28px] text-[#1f2a24]' /> Contact</button>
        <button className='text-[#1f2a24] flex items-center justify-center flex-col gap-[2px]' onClick={() => navigate("/cart")}><MdOutlineShoppingCart className='w-[28px] h-[28px] text-[#1f2a24]' /> Cart</button>
        <p className='absolute w-[18px] h-[18px] flex items-center justify-center bg-[#fffaf0] px-[5px] py-[2px] text-[#1f2a24] font-semibold rounded-full text-[9px] top-[8px] right-[18px]'>{getCartCount()}</p>
      </div>
    </div>
  )
}

export default Nav
