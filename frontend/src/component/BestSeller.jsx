import React, { useContext, useEffect, useState } from 'react'
import Title from './Title'
import { shopDataContext } from '../context/ShopContext'
import Card from './Card'

function BestSeller() {
    let {products} = useContext(shopDataContext)
    let [bestSeller,setBestSeller] = useState([])
    let [visibleCount,setVisibleCount] = useState(8)
    let [totalBestSeller,setTotalBestSeller] = useState(0)

    useEffect(()=>{
    let filterProduct = products.filter((item) => item.bestseller)

    setTotalBestSeller(filterProduct.length)
    setBestSeller(filterProduct.slice(0,visibleCount));
    },[products,visibleCount])
  return (
    <div>
        <div className='h-[8%] w-[100%] text-center mt-[50px] '>
            <Title text1={"BEST"} text2={"SELLER"}/> 
            <p className='w-[100%] m-auto text-[13px] md:text-[20px] px-[10px] text-[#59645d]'>Tried, Tested, Loved – Discover Our All-Time Best Sellers.</p>
        </div>
        <div className='mt-[30px] grid w-full justify-items-center gap-[20px] sm:grid-cols-2 lg:grid-cols-4'>
            {
             bestSeller.map((item,index)=>(
                <Card key={index} name={item.name} id={item._id} price={item.price} image={item.image1} images={[item.image1, item.image2, item.image3, item.image4]}/>
             ))
            }
        </div>
        {visibleCount < totalBestSeller && (
          <div className='w-[100%] flex items-center justify-center mt-[30px]'>
            <button className='text-[16px] cursor-pointer bg-[#b7e4c7] py-[10px] px-[25px] rounded-2xl border-[1px] border-[#b8c0ba] text-[#1f2a24] shadow-md shadow-[#8f968f]' onClick={()=>setVisibleCount(prev => prev + 8)}>
              Show More
            </button>
          </div>
        )}
      
    </div>
  )
}

export default BestSeller
