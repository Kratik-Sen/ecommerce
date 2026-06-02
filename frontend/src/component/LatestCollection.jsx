import React, { useContext, useEffect, useState } from 'react'
import Title from './Title'
import { shopDataContext } from '../context/ShopContext'
import Card from './Card'

function LatestCollection() {
    let {products} = useContext(shopDataContext)
    let [latestProducts,setLatestProducts] = useState([])
    let [visibleCount,setVisibleCount] = useState(8)

    useEffect(()=>{
    setLatestProducts(products.slice(0,visibleCount));
    },[products,visibleCount])

  return (
    <div>
      <div className='h-[8%] w-[100%] text-center md:mt-[50px]  '>
        <Title text1={"LATEST"} text2={"COLLECTIONS"}/>
        <p className='w-[100%] m-auto text-[13px] md:text-[20px] px-[10px] text-[#59645d] '>Step Into Style – New Collection Dropping This Season!</p>
      </div>
      <div className='mt-[30px] grid w-full justify-items-center gap-[20px] sm:grid-cols-2 lg:grid-cols-4'>
        {
            latestProducts.map((item,index)=>(
                <Card key={index} name={item.name} image={item.image1} images={[item.image1, item.image2, item.image3, item.image4]} id={item._id} price={item.price}/>
            ))
        }
        
        </div>
        {visibleCount < products.length && (
          <div className='w-[100%] flex items-center justify-center mt-[30px]'>
            <button className='text-[16px] cursor-pointer bg-[#b7e4c7] py-[10px] px-[25px] rounded-2xl border-[1px] border-[#b8c0ba] text-[#1f2a24] shadow-md shadow-[#8f968f]' onClick={()=>setVisibleCount(prev => prev + 8)}>
              Show More
            </button>
          </div>
        )}
    </div>
  )
}

export default LatestCollection
