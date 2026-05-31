import React, { useContext } from 'react'
import { shopDataContext } from '../context/ShopContext'
import { useNavigate } from 'react-router-dom'

function Card({name , image , id , price}) {
    let {currency} = useContext(shopDataContext)
    let navigate = useNavigate()
  return (
    <div className='w-[300px] max-w-[90%] h-[400px] bg-[#fffaf0cc] backdrop:blur-lg rounded-lg hover:scale-[102%] flex items-start justify-start flex-col p-[10px] cursor-pointer border-[1px] border-[#b8c0ba]' onClick={()=>navigate(`/productdetail/${id}`)}>
        <img src={image} alt="" className='w-[100%] h-[80%] rounded-sm object-cover '/>
        <div className='text-[#2f6f4e] text-[18px] py-[10px]'>{name}</div>
        <div className='text-[#59645d] text-[14px] '>{currency} {price}</div>
      
    </div>
  )
}

export default Card
