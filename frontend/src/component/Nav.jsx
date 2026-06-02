import React, { useContext, useState } from 'react'
import logo from '../assets/logo.png'
import { FiChevronDown, FiSearch, FiShoppingCart, FiUser } from "react-icons/fi"
import { IoMdHome } from "react-icons/io"
import { HiOutlineCollection } from "react-icons/hi"
import { MdAssignment, MdContacts } from "react-icons/md"
import { userDataContext } from '../context/UserContext'
import { authDataContext } from '../context/AuthContext'
import { shopDataContext } from '../context/ShopContext'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'

function Nav() {
  const { userData, setUserData } = useContext(userDataContext)
  const { serverUrl } = useContext(authDataContext)
  const { showSearch, setShowSearch, search, setSearch, getCartCount } = useContext(shopDataContext)
  const [showProfile, setShowProfile] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const navItems = [
    { label: "HOME", path: "/" },
    { label: "COLLECTIONS", path: "/collection" },
    { label: "ORDERS", path: "/order", protected: true },
    { label: "ABOUT", path: "/about" },
    { label: "CONTACT", path: "/contact" }
  ]

  const isActive = (path) => path === "/" ? location.pathname === "/" : location.pathname.startsWith(path)
  const goTo = (item) => navigate(item.protected && !userData ? "/login" : item.path)

  const handleLogout = async () => {
    try {
      await axios.get(serverUrl + "/api/auth/logout", { withCredentials: true })
      setUserData(null)
      setShowProfile(false)
      navigate("/login")
    } catch (error) {
      console.log(error)
    }
  }

  const mobileButtonClass = (path) => {
    return `flex min-w-[54px] items-center justify-center rounded-xl px-[6px] py-[6px] text-[11px] text-[#1f2a24] ${isActive(path) ? "bg-[#fffaf0] shadow-sm" : ""}`
  }

  return (
    <>
      <header className='fixed left-0 right-0 top-0 z-30 px-[12px] pt-[10px] md:px-[28px]'>
        <div className='mx-auto flex h-[66px] w-full max-w-[1360px] items-center justify-between rounded-[24px] border-[1px] border-[#e0d9c9] bg-[#fffaf0ef] px-[18px] shadow-lg shadow-[#8f968f33] backdrop-blur md:h-[82px] md:px-[34px]'>
          <img src={logo} alt="HD Traders" className='h-[48px] w-auto cursor-pointer object-contain md:h-[64px]' onClick={() => navigate("/")} />

          <nav className='hidden items-center gap-[30px] lg:flex'>
            {navItems.map(item => (
              <button key={item.path} type='button' onClick={() => goTo(item)} className={`relative text-[14px] font-medium tracking-[0px] text-[#1f2a24] transition hover:text-[#2f6f4e] ${isActive(item.path) ? "text-[#2f6f4e]" : ""}`}>
                <span className='inline-flex items-center gap-[4px]'>{item.label}</span>
                {isActive(item.path) && <span className='absolute left-0 right-0 top-[28px] mx-auto h-[2px] w-full rounded-full bg-[#2f6f4e]'></span>}
              </button>
            ))}
          </nav>

          <div className='flex items-center justify-end gap-[14px] text-[#1f2a24] md:gap-[22px]'>
            <button type='button' className={`text-[24px] transition hover:text-[#2f6f4e] ${showSearch ? "text-[#2f6f4e]" : ""}`} onClick={() => setShowSearch(prev => !prev)} aria-label='Search'>
              <FiSearch />
            </button>
            {!userData && <button type='button' className='hidden text-[23px] transition hover:text-[#2f6f4e] md:block' onClick={() => navigate("/login")} aria-label='Login'><FiUser /></button>}
            {userData && (
              <button type='button' className='hidden items-center gap-[9px] md:flex' onClick={() => setShowProfile(prev => !prev)}>
                <span className='flex h-[34px] w-[34px] items-center justify-center rounded-full bg-[#95d5b2] text-[14px] font-semibold text-[#1f2a24]'>{userData?.name?.slice(0, 1)}</span>
                <span className='hidden max-w-[110px] truncate text-[14px] lg:block'>{userData?.name}</span>
                <FiChevronDown className='hidden text-[13px] lg:block' />
              </button>
            )}
            <button type='button' className='relative hidden text-[25px] transition hover:text-[#2f6f4e] md:block' onClick={() => navigate("/cart")} aria-label='Cart'>
              <FiShoppingCart />
              <span className='absolute right-[-8px] top-[-9px] flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#95d5b2] px-[4px] text-[10px] font-semibold text-[#1f2a24]'>{getCartCount()}</span>
            </button>
          </div>

          {showSearch && (
            <div className='absolute left-[12px] right-[12px] top-[calc(100%+10px)] flex h-[58px] items-center justify-center rounded-2xl border-[1px] border-[#d8ded8] bg-[#fffaf0f5] px-[14px] shadow-lg shadow-[#8f968f33] md:left-[10%] md:right-[10%]'>
              <FiSearch className='mr-[10px] text-[21px] text-[#2f6f4e]' />
              <input type="text" className='h-full w-full bg-transparent text-[16px] text-[#1f2a24] outline-none placeholder:text-[#6d766f]' placeholder='Search products' onChange={(e) => setSearch(e.target.value)} value={search} />
            </div>
          )}

          {showProfile && (
            <div className='absolute right-[22px] top-[calc(100%+10px)] w-[220px] rounded-xl border-[1px] border-[#b8c0ba] bg-[#fffaf0f5] p-[8px] shadow-lg shadow-[#8f968f33]'>
              <button type='button' className='w-full rounded-lg px-[14px] py-[10px] text-left text-[15px] text-[#1f2a24] hover:bg-[#d8ded8]' onClick={handleLogout}>LogOut</button>
            </div>
          )}
        </div>
      </header>

      <div className='fixed bottom-0 left-0 right-0 z-30 flex h-[82px] items-center justify-between border-t-[1px] border-[#b8c0ba] bg-[#b7e4c7f2] px-[12px] shadow-[0_-8px_20px_#8f968f33] md:hidden'>
        <button className={mobileButtonClass("/")} onClick={() => navigate("/")}><span className='flex flex-col items-center gap-[3px]'><IoMdHome className='text-[25px]' />Home</span></button>
        <button className={mobileButtonClass("/collection")} onClick={() => navigate("/collection")}><span className='flex flex-col items-center gap-[3px]'><HiOutlineCollection className='text-[25px]' />Shop</span></button>
        <button className={mobileButtonClass("/order")} onClick={() => navigate(userData ? "/order" : "/login")}><span className='flex flex-col items-center gap-[3px]'><MdAssignment className='text-[25px]' />Orders</span></button>
        <button className={mobileButtonClass("/contact")} onClick={() => navigate("/contact")}><span className='flex flex-col items-center gap-[3px]'><MdContacts className='text-[25px]' />Contact</span></button>
        <button className={mobileButtonClass("/cart")} onClick={() => navigate("/cart")}><span className='relative flex flex-col items-center gap-[3px]'><FiShoppingCart className='text-[25px]' />Cart<span className='absolute right-[-11px] top-[-8px] flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-[#fffaf0] px-[3px] text-[9px] font-bold'>{getCartCount()}</span></span></button>
      </div>
    </>
  )
}

export default Nav
