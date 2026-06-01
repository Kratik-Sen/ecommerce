import React from 'react'
import { FiHome, FiList, FiPlusCircle, FiSettings, FiShoppingBag } from "react-icons/fi"
import { useLocation, useNavigate } from 'react-router-dom'

function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()

  const items = [
    { label: "Home", path: "/", icon: FiHome },
    { label: "Add Items", path: "/add", icon: FiPlusCircle },
    { label: "List Items", path: "/lists", icon: FiList },
    { label: "View Orders", path: "/orders", icon: FiShoppingBag },
  ]

  return (
    <aside className='fixed bottom-0 left-0 top-[70px] z-20 w-[74px] border-r-[1px] border-[#d8ded8] bg-[#fffaf0d9] pt-[18px] shadow-lg shadow-[#8f968f22] backdrop-blur md:top-[86px] md:w-[230px]'>
      <nav className='flex flex-col gap-[8px]'>
        {items.map(({ label, path, icon: Icon }) => {
          const active = path === "/" ? location.pathname === "/" : location.pathname.startsWith(path)
          return (
            <button key={label} type='button' className={`relative flex h-[54px] items-center justify-center gap-[14px] px-[14px] text-[15px] transition md:justify-start md:px-[24px] ${active ? "bg-[#e1f0e6] text-[#2f6f4e]" : "text-[#59645d] hover:bg-[#eef3ea] hover:text-[#2f6f4e]"}`} onClick={() => path === "/settings" ? null : navigate(path)}>
              <Icon className='text-[22px]' />
              <span className='hidden md:block'>{label}</span>
              {active && <span className='absolute right-0 top-0 h-full w-[3px] bg-[#2f6f4e]'></span>}
            </button>
          )
        })}
      </nav>
      <div className='pointer-events-none absolute bottom-0 left-0 hidden h-[260px] w-full opacity-50 md:block [background-image:radial-gradient(#95d5b2_1px,transparent_1px)] [background-size:18px_18px]'></div>
    </aside>
  )
}

export default Sidebar
