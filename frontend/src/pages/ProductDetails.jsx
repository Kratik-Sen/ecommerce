import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { shopDataContext } from '../context/ShopContext'
import { FaStar } from "react-icons/fa";
import { FaStarHalfAlt } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa";
import RelatedProduct from '../component/RelatedProduct';
import Loading from '../component/Loading';
import { authDataContext } from '../context/AuthContext';
import { userDataContext } from '../context/UserContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { isWeightCategory } from '../constants/categories';

function ProductDetail() {
    let {productId} = useParams()
    let {products,currency ,addtoCart ,loading,getProducts} = useContext(shopDataContext)
    let {serverUrl} = useContext(authDataContext)
    let {userData} = useContext(userDataContext)
    let [productData,setProductData] = useState(false)
    let [canRate,setCanRate] = useState(false)
    let [selectedRating,setSelectedRating] = useState(0)
    let [ratingLoading,setRatingLoading] = useState(false)

    const [image, setImage] = useState('')
  const [image1, setImage1] = useState('')
  const [image2, setImage2] = useState('')
  const [image3, setImage3] = useState('')
  const [image4, setImage4] = useState('')
  const [size, setSize] = useState('')
  const sizeOptions = Array.isArray(productData?.sizes) ? productData.sizes : []
  const hasSizeOptions = sizeOptions.length > 0
  const hasWeightOptions = isWeightCategory(productData?.category) || isWeightCategory(productData?.subCategory)
  const ratings = Array.isArray(productData?.ratings) ? productData.ratings : []
  const reviewCount = ratings.length
  const averageRating = reviewCount ? ratings.reduce((total,item)=>total + Number(item.rating || 0),0) / reviewCount : 0



   const fetchProductData = async () => {
    products.map((item) => {
      if (item._id === productId) {
        setProductData(item)
        // console.log(productData)
        setImage1(item.image1)
        setImage2(item.image2)
        setImage3(item.image3)
        setImage4(item.image4)
        setImage(item.image1)
        setSize('')

        return null;
      }

    })
  }

  const checkRatingEligibility = async () => {
    try {
      const result = await axios.post(serverUrl + '/api/order/userorder',{},{withCredentials:true})
      const hasDeliveredProduct = result.data.some(order =>
        order.status === "Delivered" && order.items.some(item => String(item._id) === productId)
      )
      setCanRate(hasDeliveredProduct)
    } catch (error) {
      console.log(error)
      setCanRate(false)
    }
  }

  const submitRating = async (rating) => {
    setSelectedRating(rating)
    setRatingLoading(true)
    try {
      const result = await axios.post(serverUrl + `/api/product/rate/${productId}`,{rating},{withCredentials:true})
      setProductData(result.data)
      await getProducts()
      toast.success("Rating saved")
    } catch (error) {
      toast.error(error.response?.data?.message || "Rating failed")
    } finally {
      setRatingLoading(false)
    }
  }

  const renderAverageStars = () => {
    return [1,2,3,4,5].map((star)=>{
      if (averageRating >= star) {
        return <FaStar key={star} className='text-[20px] fill-[#74c69d]' />
      }

      if (averageRating > star - 1) {
        return <FaStarHalfAlt key={star} className='text-[20px] fill-[#74c69d]' />
      }

      return <FaRegStar key={star} className='text-[20px] fill-[#74c69d]' />
    })
  }

  useEffect(() => {
    fetchProductData()
  }, [productId, products])

  useEffect(() => {
    checkRatingEligibility()
  }, [productId, serverUrl])

  useEffect(() => {
    const currentUserRating = ratings.find(item => item.userId === userData?._id)
    setSelectedRating(currentUserRating?.rating || 0)
  }, [productData, userData])
  return productData ? (
    <div >
        <div className=' w-[99vw] h-[130vh] md:h-[100vh] bg-[linear-gradient(135deg,#f8f4e8_0%,#e9efe4_52%,#c7d1c8_100%)] flex items-center justify-start flex-col lg:flex-row gap-[20px]'>
            <div className='lg:w-[50vw] md:w-[90vw] lg:h-[90vh] h-[50vh] mt-[70px] flex items-center justify-center md:gap-[10px] gap-[30px] flex-col-reverse lg:flex-row'>
                <div className='lg:w-[20%] md:w-[80%] h-[10%] lg:h-[80%] flex items-center justify-center gap-[50px] lg:gap-[20px] lg:flex-col flex-wrap '>
                    <div className='md:w-[100px]  w-[50px] h-[50px] md:h-[110px] bg-[#fffaf0] border-[1px] border-[#b8c0ba] rounded-md'>
                        <img src={image1} alt="" className='w-[100%] h-[100%]  cursor-pointer rounded-md' onClick={()=>setImage(image1)}/>
                    </div>
                    <div className='md:w-[100px]  w-[50px] h-[50px] md:h-[110px] bg-[#fffaf0] border-[1px] border-[#b8c0ba] rounded-md'>
                        <img src={image2} alt="" className='w-[100%] h-[100%]  cursor-pointer rounded-md' onClick={()=>setImage(image2)}/>
                    </div>
                    <div className='md:w-[100px]  w-[50px] h-[50px] md:h-[110px] bg-[#fffaf0] border-[1px] border-[#b8c0ba] rounded-md'>
                        <img src={image3} alt="" className='w-[100%] h-[100%]  cursor-pointer rounded-md' onClick={()=>setImage(image3)}/>
                    </div>
                    <div className='md:w-[100px]  w-[50px] h-[50px] md:h-[110px] bg-[#fffaf0] border-[1px] border-[#b8c0ba] rounded-md'>
                        <img src={image4} alt="" className='w-[100%] h-[100%]  cursor-pointer rounded-md' onClick={()=>setImage(image4)}/>
                    </div>

                </div>
                <div className='lg:w-[60%] w-[80%] lg:h-[78%] h-[70%] border-[1px] border-[#b8c0ba] rounded-md  overflow-hidden'>
                    <img src={image} alt="" className=' w-[100%] lg:h-[100%] h-[100%] text-[30px] text-[#1f2a24]  text-center rounded-md object-fill ' />
                </div>
            </div>

            <div className='lg:w-[50vw] w-[100vw] lg:h-[75vh] h-[40vh] lg:mt-[80px] flex items-start justify-start flex-col py-[20px] px-[30px] md:pb-[20px] md:pl-[20px] lg:pl-[0px] lg:px-[0px] lg:py-[0px] gap-[10px]'>
                <h1 className='text-[40px] font-semibold text-[#59645d]'>{productData.name.toUpperCase()}</h1>
                <div className='flex items-center gap-1 '>
                    {renderAverageStars()}
                    <p className='text-[18px] font-semibold pl-[5px] text-[#1f2a24]'>({reviewCount})</p>
                </div>
                <p className='text-[30px] font-semibold pl-[5px] text-[#1f2a24]'>{currency} {productData.price}</p>

                <p className=' w-[80%] md:w-[60%] text-[20px] font-semibold pl-[5px] text-[#1f2a24]'>{productData.description}</p>
                <div className='flex flex-col gap-[10px] my-[10px] '>
                  {hasSizeOptions && <>
                    <p className='text-[25px] font-semibold pl-[5px] text-[#1f2a24]'>{hasWeightOptions ? "Select Weight" : "Select Size"}</p>
          <div className='flex gap-2'>
            {
              sizeOptions.map((item, index) => (
                <button key={index} className={`border py-2 px-4 bg-[#fffaf0] rounded-md 
                  ${item === size ? 'bg-[#95d5b2] text-[#1f2a24] text-[20px]' : ''}`} onClick={() => setSize(item)}  >{item}</button>
              ))
            }
          </div>
                  </>}
           <button className='text-[16px] active:bg-[#aeb7b1] cursor-pointer bg-[#b7e4c7] py-[10px] px-[20px] rounded-2xl mt-[10px] border-[1px] border-[#b8c0ba] text-[#1f2a24] shadow-md shadow-[#8f968f]' onClick={()=>addtoCart(productData._id , size)} >{loading? <Loading/> : "Add to Cart"}</button>
                </div>
                {canRate && (
                  <div className='flex items-center gap-[10px]'>
                    <p className='text-[18px] font-semibold text-[#1f2a24]'>Your Rating</p>
                    <div className='flex items-center gap-[4px]'>
                      {[1,2,3,4,5].map((rating)=>(
                        <button key={rating} className='cursor-pointer' onClick={()=>submitRating(rating)} disabled={ratingLoading}>
                          {selectedRating >= rating ? <FaStar className='text-[24px] fill-[#74c69d]' /> : <FaRegStar className='text-[24px] fill-[#74c69d]' />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
            <div className='w-[90%] h-[1px] bg-[#c9d0ca]'></div>
            <div className='w-[80%] text-[16px] text-[#1f2a24] '>

          <p>100% Original Product.</p>
          <p>Cash on delivery is available on this product</p>
          <p>East return and exchange policy within 7 days</p>
            </div>
            </div>


        </div>

        <div className='w-[100%] min-h-[70vh] bg-[linear-gradient(135deg,#f8f4e8_0%,#e9efe4_52%,#c7d1c8_100%)] flex items-start justify-start flex-col  overflow-x-hidden'>

            <div className='flex px-[20px] mt-[90px] lg:ml-[80px] ml-[0px]  lg:mt-[0px]  '>

     <p className='border px-5 py-3 text-sm text-[#1f2a24]'>
       Description
      </p>
      <p className='border px-5 py-3 text-sm text-[#1f2a24]'>
       Reviews ({reviewCount})
      </p>
     </div>

     <div className='w-[80%] md:h-[150px] h-[220px] bg-[#fffaf0cc] border text-[#1f2a24] text-[13px] md:text-[15px] lg:text-[20px] px-[10px] md:px-[30px] lg:ml-[100px] ml-[20px]'>
        <p className='w-[95%] h-[90%] flex items-center justify-center '>
      {productData.description}</p>
     </div>

     <RelatedProduct category={productData.category} subCategory={productData.subCategory} currentProductId={productData._id}/>
        </div>
      
    </div>
  ) :<div className='opacity-0'></div>
}

export default ProductDetail
