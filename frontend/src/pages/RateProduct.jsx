import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FaRegStar, FaStar } from 'react-icons/fa'
import axios from 'axios'
import { toast } from 'react-toastify'
import { authDataContext } from '../context/AuthContext'
import { userDataContext } from '../context/UserContext'
import { shopDataContext } from '../context/ShopContext'
import Title from '../component/Title'
import Loading from '../component/Loading'

function RateProduct() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const { serverUrl } = useContext(authDataContext)
  const { userData } = useContext(userDataContext)
  const { getProducts } = useContext(shopDataContext)
  const [product, setProduct] = useState(null)
  const [orderedItem, setOrderedItem] = useState(null)
  const [canRate, setCanRate] = useState(false)
  const [selectedRating, setSelectedRating] = useState(0)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const loadRateData = async () => {
    setLoading(true)
    try {
      const [productResult, orderResult] = await Promise.all([
        axios.get(serverUrl + `/api/product/${productId}`),
        axios.post(serverUrl + '/api/order/userorder', {}, { withCredentials: true }),
      ])

      const deliveredOrder = orderResult.data.find(order =>
        order.status === "Delivered" && order.items.some(item => String(item._id) === productId)
      )
      const deliveredItem = deliveredOrder?.items.find(item => String(item._id) === productId)
      const ratings = Array.isArray(productResult.data.ratings) ? productResult.data.ratings : []
      const currentUserRating = ratings.find(item => item.userId === userData?._id)

      setProduct(productResult.data)
      setOrderedItem(deliveredItem || null)
      setCanRate(!!deliveredItem)
      setSelectedRating(currentUserRating?.rating || 0)
    } catch (error) {
      console.log(error)
      toast.error("Unable to load rating page")
    } finally {
      setLoading(false)
    }
  }

  const submitRating = async (rating) => {
    setSelectedRating(rating)
    setSaving(true)

    try {
      const result = await axios.post(serverUrl + `/api/product/rate/${productId}`, { rating }, { withCredentials: true })
      setProduct(result.data)
      await getProducts()
      toast.success("Rating saved")
    } catch (error) {
      toast.error(error.response?.data?.message || "Rating failed")
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    loadRateData()
  }, [productId, userData])

  if (loading) {
    return (
      <div className='w-[100vw] min-h-[100vh] bg-[linear-gradient(135deg,#f8f4e8_0%,#e9efe4_52%,#c7d1c8_100%)] flex items-center justify-center'>
        <Loading />
      </div>
    )
  }

  const displayItem = orderedItem || product
  const ratings = Array.isArray(product?.ratings) ? product.ratings : []
  const averageRating = ratings.length ? ratings.reduce((total, item) => total + Number(item.rating || 0), 0) / ratings.length : 0

  return (
    <div className='w-[99vw] min-h-[100vh] p-[20px] pb-[120px] overflow-hidden bg-[linear-gradient(135deg,#f8f4e8_0%,#e9efe4_52%,#c7d1c8_100%)]'>
      <div className='h-[8%] w-[100%] text-center mt-[80px]'>
        <Title text1={'RATE'} text2={'PRODUCT'} />
      </div>

      <div className='w-[100%] flex items-center justify-center'>
        <div className='w-[90%] max-w-[720px] bg-[#fffaf0cc] border-[1px] border-[#b8c0ba] rounded-xl p-[20px] flex flex-col md:flex-row gap-[20px]'>
          <img src={displayItem?.image1} alt="" className='w-[160px] h-[160px] rounded-md object-cover' />
          <div className='flex flex-col gap-[10px] text-[#1f2a24]'>
            <h1 className='text-[28px] font-semibold'>{displayItem?.name}</h1>
            <p className='text-[16px] text-[#4f8f67]'>{product?.available === false ? "This product is unavailable for new orders." : "Available in store"}</p>
            <p className='text-[16px] text-[#4f8f67]'>Average rating: {averageRating.toFixed(1)} ({ratings.length})</p>

            {canRate ? (
              <div className='flex items-center gap-[10px] mt-[10px]'>
                {[1, 2, 3, 4, 5].map(rating => (
                  <button key={rating} className='cursor-pointer' disabled={saving} onClick={() => submitRating(rating)}>
                    {selectedRating >= rating ? <FaStar className='text-[34px] fill-[#74c69d]' /> : <FaRegStar className='text-[34px] fill-[#74c69d]' />}
                  </button>
                ))}
              </div>
            ) : (
              <p className='text-[16px] text-[#1f2a24]'>You can rate this product after it is delivered.</p>
            )}

            <button className='w-fit mt-[10px] px-[18px] py-[10px] bg-[#b7e4c7] rounded-lg border-[1px] border-[#74c69d]' onClick={() => navigate("/order")}>Back to Orders</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RateProduct
