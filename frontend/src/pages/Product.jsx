import React from 'react'
import LatestCollection from '../component/LatestCollection'
import BestSeller from '../component/BestSeller'

function Product() {
  return (
    <div className='w-[100vw] min-h-[100vh] bg-[linear-gradient(135deg,#f8f4e8_0%,#e9efe4_52%,#c7d1c8_100%)] flex items-center justify-start flex-col py-[20px]'>

        <div className='w-[100%] min-h-[70px] flex items-center justify-center gap-[10px]  flex-col '>
            <LatestCollection/>
        </div>
        <div className='w-[100%] min-h-[70px] flex items-center justify-center gap-[10px]  flex-col '>
            <BestSeller/>
        </div>
      
    </div>
  )
}

export default Product
