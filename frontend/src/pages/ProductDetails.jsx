import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { shopDataContext } from '../context/ShopContext'
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa"
import { FiChevronDown, FiChevronUp, FiHeart, FiRefreshCw, FiShield, FiShoppingCart, FiTruck } from "react-icons/fi"
import { MdOutlinePayment } from "react-icons/md"
import { TbRosetteDiscountCheck } from "react-icons/tb"
import RelatedProduct from '../component/RelatedProduct'
import Loading from '../component/Loading'
import { authDataContext } from '../context/AuthContext'
import { userDataContext } from '../context/UserContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { isWeightCategory } from '../constants/categories'

function ProductDetail() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const { products, currency, addtoCart, loading, getProducts } = useContext(shopDataContext)
  const { serverUrl } = useContext(authDataContext)
  const { userData } = useContext(userDataContext)
  const [productData, setProductData] = useState(false)
  const [canRate, setCanRate] = useState(false)
  const [selectedRating, setSelectedRating] = useState(0)
  const [ratingLoading, setRatingLoading] = useState(false)
  const [image, setImage] = useState('')
  const [size, setSize] = useState('')

  const sizeOptions = Array.isArray(productData?.sizes) ? productData.sizes : []
  const hasSizeOptions = sizeOptions.length > 0
  const hasWeightOptions = isWeightCategory(productData?.category) || isWeightCategory(productData?.subCategory)
  const ratings = Array.isArray(productData?.ratings) ? productData.ratings : []
  const reviewCount = ratings.length
  const averageRating = reviewCount ? ratings.reduce((total, item) => total + Number(item.rating || 0), 0) / reviewCount : 0
  const productImages = useMemo(() => {
    if (!productData) return []
    return [productData.image1, productData.image2, productData.image3, productData.image4].filter(Boolean)
  }, [productData])

  const fetchProductData = () => {
    const foundProduct = products.find(item => item._id === productId)
    if (foundProduct) {
      setProductData(foundProduct)
      setImage(foundProduct.image1)
      setSize('')
    }
  }

  const checkRatingEligibility = async () => {
    try {
      const result = await axios.post(serverUrl + '/api/order/userorder', {}, { withCredentials: true })
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
      const result = await axios.post(serverUrl + `/api/product/rate/${productId}`, { rating }, { withCredentials: true })
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
    return [1, 2, 3, 4, 5].map((star) => {
      if (averageRating >= star) return <FaStar key={star} className='text-[19px] fill-[#2f6f4e]' />
      if (averageRating > star - 1) return <FaStarHalfAlt key={star} className='text-[19px] fill-[#2f6f4e]' />
      return <FaRegStar key={star} className='text-[19px] fill-[#2f6f4e]' />
    })
  }

  const buyNow = () => {
    if (hasSizeOptions && !size) {
      toast.error(hasWeightOptions ? "Select product weight" : "Select product size")
      return
    }
    addtoCart(productData._id, size)
    navigate("/cart")
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

  if (!productData) {
    return <div className='min-h-screen bg-[#f8f4e8]'></div>
  }

  const serviceRows = [
    { title: "100% Original Product", text: "Authentic and trusted quality", icon: FiShield },
    { title: "Cash on Delivery", text: "Pay when you receive your order", icon: MdOutlinePayment },
    { title: "Easy Return & Exchange", text: "Hassle-free return within 7 days", icon: FiRefreshCw }
  ]
  const benefitRows = [
    { title: "Free Shipping", text: "On orders above ₹999", icon: FiTruck },
    { title: "Secure Payment", text: "100% secure and encrypted", icon: FiShield },
    { title: "Quality Assured", text: "Best quality products", icon: TbRosetteDiscountCheck },
    { title: "24/7 Support", text: "We're here to help", icon: MdOutlinePayment }
  ]

  return (
    <main className='min-h-screen overflow-hidden bg-[linear-gradient(135deg,#f8f4e8_0%,#eef3ea_52%,#e1e7df_100%)] px-[18px] pb-[110px] pt-[108px] text-[#1f2a24] md:px-[34px]'>
      <div className='pointer-events-none fixed inset-0 opacity-30 [background-image:radial-gradient(#95d5b2_1px,transparent_1px)] [background-size:34px_34px]'></div>
      <section className='relative z-[1] mx-auto grid max-w-[1220px] gap-[34px] lg:grid-cols-[minmax(0,1.25fr)_minmax(360px,0.8fr)] lg:items-start'>
        <div className='grid gap-[18px] md:grid-cols-[96px_1fr]'>
          <div className='order-2 flex gap-[12px] overflow-x-auto md:order-1 md:flex-col md:overflow-visible'>
            {productImages.map((item) => (
              <button key={item} type='button' className={`h-[88px] w-[88px] shrink-0 overflow-hidden rounded-xl border-[2px] bg-[#fffaf0] p-[4px] shadow-md shadow-[#8f968f22] md:h-[104px] md:w-[96px] ${image === item ? "border-[#2f6f4e]" : "border-[#e0d9c9]"}`} onClick={() => setImage(item)}>
                <img src={item} alt={productData.name} className='h-full w-full rounded-lg object-cover' />
              </button>
            ))}
            <div className='hidden justify-center gap-[12px] pt-[8px] md:flex'>
              <button type='button' className='flex h-[34px] w-[34px] items-center justify-center rounded-full bg-[#fffaf0] shadow-md shadow-[#8f968f22]'><FiChevronUp /></button>
              <button type='button' className='flex h-[34px] w-[34px] items-center justify-center rounded-full bg-[#fffaf0] shadow-md shadow-[#8f968f22]'><FiChevronDown /></button>
            </div>
          </div>

          <div className='relative order-1 overflow-hidden rounded-2xl border-[1px] border-[#e0d9c9] bg-[#fffaf0] shadow-2xl shadow-[#8f968f3d] md:order-2'>
            <button type='button' className='absolute right-[18px] top-[18px] z-[2] flex h-[54px] w-[54px] items-center justify-center rounded-full bg-[#fffaf0ef] text-[28px] text-[#1f2a24] shadow-lg shadow-[#8f968f33]'><FiHeart /></button>
            <img src={image} alt={productData.name} className='h-[420px] w-full object-cover md:h-[620px]' />
          </div>
        </div>

        <aside className='lg:pt-[10px]'>
          {productData.bestseller && <span className='inline-flex rounded-lg bg-[#e1f0e6] px-[16px] py-[7px] text-[13px] font-bold text-[#2f6f4e]'>Best Seller</span>}
          <h1 className='mt-[18px] text-[42px] font-bold leading-tight md:text-[52px]'>{productData.name.toUpperCase()}</h1>
          <div className='mt-[14px] flex items-center gap-[8px]'>
            <div className='flex items-center gap-[4px]'>{renderAverageStars()}</div>
            <span className='text-[15px] text-[#1f2a24]'>({reviewCount})</span>
          </div>
          <p className='mt-[14px] text-[34px] font-bold text-[#0f4d45]'>{currency} {productData.price}</p>
          <p className='mt-[12px] max-w-[520px] text-[17px] leading-relaxed text-[#59645d]'>{productData.description}</p>

          <div className='my-[24px] h-[1px] bg-[#d8ded8]'></div>

          {hasSizeOptions && (
            <div>
              <p className='text-[15px] font-bold uppercase text-[#2f6f4e]'>{hasWeightOptions ? "Select Weight" : "Select Size"}</p>
              <div className='mt-[14px] flex flex-wrap gap-[14px]'>
                {sizeOptions.map((item) => (
                  <button key={item} type='button' className={`min-w-[62px] rounded-lg border-[1px] px-[18px] py-[12px] text-[14px] font-semibold transition ${item === size ? "border-[#2f6f4e] bg-[#2f6f4e] text-[#fffaf0] shadow-md shadow-[#8f968f33]" : "border-[#d8ded8] bg-[#fffaf0] text-[#1f2a24]"}`} onClick={() => setSize(item)}>
                    {item}
                  </button>
                ))}
              </div>
              <button type='button' className='mt-[14px] text-[14px] font-semibold underline text-[#2f6f4e]'>Size Guide</button>
            </div>
          )}

          <div className='mt-[26px] grid gap-[14px] sm:grid-cols-2'>
            <button type='button' className='flex h-[58px] items-center justify-center gap-[12px] rounded-xl bg-[#2f6f4e] px-[22px] font-bold text-[#fffaf0] shadow-lg shadow-[#8f968f33]' onClick={() => addtoCart(productData._id, size)}>
              {loading ? <Loading /> : <><FiShoppingCart /> Add to Cart</>}
            </button>
            <button type='button' className='h-[58px] rounded-xl border-[1px] border-[#2f6f4e] bg-[#fffaf0] px-[22px] font-bold text-[#2f6f4e]' onClick={buyNow}>Buy Now</button>
          </div>

          {canRate && (
            <div className='mt-[18px] flex flex-wrap items-center gap-[10px]'>
              <p className='font-semibold text-[#1f2a24]'>Your Rating</p>
              <div className='flex items-center gap-[4px]'>
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button key={rating} type='button' className='cursor-pointer' onClick={() => submitRating(rating)} disabled={ratingLoading}>
                    {selectedRating >= rating ? <FaStar className='text-[24px] fill-[#2f6f4e]' /> : <FaRegStar className='text-[24px] fill-[#2f6f4e]' />}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className='mt-[22px] rounded-xl border-[1px] border-[#e0d9c9] bg-[#fffaf0cc] p-[18px] shadow-lg shadow-[#8f968f22]'>
            {serviceRows.map(({ title, text, icon: Icon }, index) => (
              <div key={title} className={`flex gap-[14px] py-[12px] ${index > 0 ? "border-t-[1px] border-[#d8ded8]" : ""}`}>
                <Icon className='mt-[3px] shrink-0 text-[27px] text-[#2f6f4e]' />
                <div>
                  <h3 className='text-[15px] font-bold text-[#2f6f4e]'>{title}</h3>
                  <p className='text-[13px] text-[#59645d]'>{text}</p>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </section>

      <section className='relative z-[1] mx-auto mt-[34px] grid max-w-[1030px] gap-[18px] rounded-xl border-[1px] border-[#e0d9c9] bg-[#fffaf0e8] p-[18px] shadow-xl shadow-[#8f968f22] sm:grid-cols-2 lg:grid-cols-4'>
        {benefitRows.map(({ title, text, icon: Icon }, index) => (
          <div key={title} className={`flex gap-[14px] ${index > 0 ? "lg:border-l-[1px] lg:border-[#d8ded8] lg:pl-[18px]" : ""}`}>
            <Icon className='mt-[4px] shrink-0 text-[30px] text-[#2f6f4e]' />
            <div>
              <h3 className='text-[15px] font-bold text-[#2f6f4e]'>{title}</h3>
              <p className='text-[13px] text-[#59645d]'>{text}</p>
            </div>
          </div>
        ))}
      </section>

      <section className='relative z-[1] mx-auto mt-[46px] max-w-[1220px] rounded-2xl border-[1px] border-[#e0d9c9] bg-[#fffaf0cc] p-[22px] shadow-lg shadow-[#8f968f22]'>
        <div className='flex flex-wrap gap-[12px]'>
          <span className='rounded-xl bg-[#2f6f4e] px-[18px] py-[10px] text-[14px] font-bold text-[#fffaf0]'>Description</span>
          <span className='rounded-xl border-[1px] border-[#d8ded8] px-[18px] py-[10px] text-[14px] font-bold text-[#2f6f4e]'>Reviews ({reviewCount})</span>
        </div>
        <p className='mt-[18px] max-w-[900px] text-[15px] leading-relaxed text-[#59645d]'>{productData.description}</p>
      </section>

      <RelatedProduct category={productData.category} subCategory={productData.subCategory} currentProductId={productData._id} />
    </main>
  )
}

export default ProductDetail
