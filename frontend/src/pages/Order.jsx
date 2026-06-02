import React, { useContext, useEffect, useState } from 'react'
import { FiAlertTriangle, FiArrowRight, FiCreditCard, FiDownload, FiHeadphones, FiMapPin, FiPackage, FiShoppingBag, FiShield, FiTruck, FiX } from "react-icons/fi"
import { shopDataContext } from '../context/ShopContext'
import { authDataContext } from '../context/AuthContext'
import axios from 'axios'
import { noSizeKey } from '../constants/categories'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

function Order() {
  const [orderData, setOrderData] = useState([])
  const [cancelItem, setCancelItem] = useState(null)
  const [cancelingOrder, setCancelingOrder] = useState(false)
  const { currency, products } = useContext(shopDataContext)
  const { serverUrl } = useContext(authDataContext)
  const navigate = useNavigate()

  const loadOrderData = async () => {
    try {
      const result = await axios.post(serverUrl + '/api/order/userorder', {}, { withCredentials: true })
      if (result.data) {
        const allOrdersItem = []
        result.data.forEach((order) => {
          order.items.forEach((item) => {
            allOrdersItem.push({
              ...item,
              status: order.status,
              payment: order.payment,
              paymentMethod: order.paymentMethod,
              date: order.date,
              orderId: order._id,
              orderAmount: order.amount,
              address: order.address,
              orderItems: order.items,
              canceledByUser: order.canceledByUser,
              canceledAt: order.canceledAt,
              refundId: order.refundId,
              refundStatus: order.refundStatus,
            })
          })
        })
        setOrderData(allOrdersItem.reverse())
      }
    } catch (error) {
      console.log(error)
    }
  }

  const cancelOrder = async () => {
    if (!cancelItem) return
    setCancelingOrder(true)

    try {
      const result = await axios.post(serverUrl + '/api/order/cancel', { orderId: cancelItem.orderId }, { withCredentials: true })
      toast.success(result.data?.message || "Order cancelled")
      setCancelItem(null)
      await loadOrderData()
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || "Order cancellation failed")
    } finally {
      setCancelingOrder(false)
    }
  }

  useEffect(() => {
    loadOrderData()
  }, [])

  const deliveryDate = (date) => {
    const estimate = new Date(date)
    estimate.setDate(estimate.getDate() + 3)
    return estimate.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
  }

  const refundLabel = (status) => String(status || "").toLowerCase() === "processed" ? "success" : status
  const refundClass = (status) => String(status || "").toLowerCase() === "processed" ? "text-[#2f6f4e]" : "text-[#c84435]"

  const downloadInvoice = (item) => {
    const orderItems = Array.isArray(item.orderItems) ? item.orderItems : [item]
    const address = item.address || {}
    const orderNumber = String(item.orderId || item._id).slice(-10).toUpperCase()
    const escapeHtml = (value = "") => String(value).replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[char]))
    const rows = orderItems.map(orderItem => {
      const option = orderItem.size && orderItem.size !== noSizeKey ? orderItem.size : "-"
      const price = Number(orderItem.price || 0)
      const quantity = Number(orderItem.quantity || 1)
      return `<tr><td>${escapeHtml(orderItem.name || "Product")}</td><td>${escapeHtml(option)}</td><td>${quantity}</td><td>${currency} ${price}</td><td>${currency} ${price * quantity}</td></tr>`
    }).join("")
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>Invoice ${orderNumber}</title><style>body{font-family:Arial,sans-serif;color:#1f2a24;padding:32px;background:#f8f4e8}main{max-width:820px;margin:auto;background:#fffaf0;border:1px solid #d8ded8;padding:28px}h1{color:#2f6f4e;margin:0 0 8px}table{width:100%;border-collapse:collapse;margin-top:22px}th,td{border-bottom:1px solid #d8ded8;padding:12px;text-align:left}th{color:#2f6f4e}.total{text-align:right;font-size:20px;font-weight:700;margin-top:22px}.muted{color:#59645d}</style></head><body><main><h1>HD Traders Invoice</h1><p class="muted">Invoice #ORD-${orderNumber}</p><p><b>Date:</b> ${new Date(item.date).toLocaleString()}</p><p><b>Customer:</b> ${escapeHtml(`${address.firstName || ""} ${address.lastName || ""}`)}</p><p><b>Address:</b> ${escapeHtml([address.street, address.city, address.state, address.pinCode, address.country].filter(Boolean).join(", "))}</p><p><b>Payment:</b> ${escapeHtml(item.paymentMethod || "COD")} (${item.payment ? "Paid" : "Pending"})</p><table><thead><tr><th>Product</th><th>Option</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead><tbody>${rows}</tbody></table><p class="total">Order Total: ${currency} ${item.orderAmount || 0}</p></main></body></html>`
    const blob = new Blob([html], { type: "text/html" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `invoice-${orderNumber}.html`
    link.click()
    URL.revokeObjectURL(link.href)
  }

  return (
    <>
    <main className='min-h-screen overflow-hidden bg-[linear-gradient(135deg,#f8f4e8_0%,#eef3ea_52%,#e1e7df_100%)] px-[18px] pb-[110px] pt-[108px] text-[#1f2a24] md:px-[34px]'>
      <div className='pointer-events-none fixed inset-0 opacity-35 [background-image:radial-gradient(#95d5b2_1px,transparent_1px)] [background-size:34px_34px]'></div>
      <div className='relative z-[1] mx-auto max-w-[1320px]'>
        <div className='relative mb-[34px] overflow-hidden rounded-2xl px-[6px] py-[8px]'>
          <div className='absolute right-[4%] top-[-40px] hidden h-[220px] w-[320px] rounded-full bg-[#d8ded8] opacity-70 md:block'></div>
          <p className='text-[15px] text-[#59645d]'>Home <span className='px-[10px]'>›</span> My Orders</p>
          <h1 className='mt-[18px] text-[54px] leading-none md:text-[72px]'>My <span className='text-[#2f6f4e]'>Order</span></h1>
          <p className='mt-[16px] text-[17px] text-[#59645d]'>Track and view all your orders in one place.</p>
        </div>

        <div className='space-y-[28px]'>
          {orderData.length === 0 && (
            <div className='rounded-2xl border-[1px] border-[#e0d9c9] bg-[#fffaf0e8] p-[34px] text-center shadow-lg shadow-[#8f968f22]'>
              <FiPackage className='mx-auto text-[44px] text-[#2f6f4e]' />
              <h2 className='mt-[14px] text-[24px] font-semibold'>No orders yet</h2>
              <p className='mt-[6px] text-[#59645d]'>Your placed orders will appear here.</p>
            </div>
          )}

          {orderData.map((item, index) => {
            const activeProduct = products.find(product => product._id === item._id)
            const placedDate = new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
            const isCancelled = item.canceledByUser || item.status === "Cancelled"
            const canCancel = !isCancelled && item.status !== "Delivered"
            return (
              <article key={`${item.orderId}-${item._id}-${index}`} className='overflow-hidden rounded-2xl border-[1px] border-[#e0d9c9] bg-[#fffaf0ef] shadow-xl shadow-[#8f968f2e]'>
                <div className='grid gap-[18px] border-b-[1px] border-[#e0d9c9] bg-[#fffaf0] p-[20px] md:grid-cols-4 md:items-center md:p-[28px]'>
                  <div className='flex items-center gap-[14px]'>
                    <span className='flex h-[54px] w-[54px] items-center justify-center rounded-xl bg-[#2f6f4e] text-[25px] text-[#fffaf0]'><FiShoppingBag /></span>
                    <div>
                      <p className='text-[12px] font-semibold uppercase text-[#59645d]'>Order Placed</p>
                      <p className='font-bold text-[#2f6f4e]'>{placedDate}</p>
                    </div>
                  </div>
                  <div>
                    <p className='text-[12px] font-semibold uppercase text-[#59645d]'>Order ID</p>
                    <p className='break-all font-bold text-[#2f6f4e]'>#{String(item.orderId || item._id).slice(-10).toUpperCase()}</p>
                  </div>
                  <div className='flex items-center gap-[12px]'>
                    <FiCreditCard className='text-[26px] text-[#2f6f4e]' />
                    <div>
                      <p className='text-[12px] font-semibold uppercase text-[#59645d]'>Payment Method</p>
                      <p className='font-bold text-[#2f6f4e]'>{item.paymentMethod || "COD"}</p>
                    </div>
                  </div>
                  {!isCancelled && (
                    <button type='button' className='inline-flex h-[50px] items-center justify-center gap-[10px] rounded-xl border-[1px] border-[#74c69d] px-[18px] text-[14px] font-bold text-[#2f6f4e] transition hover:bg-[#e9efe4]' onClick={() => downloadInvoice(item)}>
                      <FiDownload /> Download Invoice
                    </button>
                  )}
                </div>

                <div className='grid gap-[24px] p-[20px] lg:grid-cols-[1.35fr_1fr_260px] lg:items-center md:p-[28px]'>
                  <div className='flex flex-col gap-[18px] sm:flex-row'>
                    <img src={item.image1} alt={item.name} className='h-[155px] w-full rounded-xl border-[1px] border-[#e0d9c9] object-cover sm:w-[155px]' />
                    <div className='flex flex-col justify-center'>
                      <h2 className='text-[28px] font-semibold'>{item.name}</h2>
                      <p className='mt-[6px] text-[24px] font-bold text-[#2f6f4e]'>{currency} {item.price}</p>
                      <div className='mt-[14px] flex flex-wrap gap-[12px] text-[15px] text-[#59645d]'>
                        {item.size && item.size !== noSizeKey && <span>Size: <b className='text-[#1f2a24]'>{item.size}</b></span>}
                        <span>Quantity: <b className='text-[#1f2a24]'>{item.quantity}</b></span>
                      </div>
                      <p className='mt-[16px] inline-flex items-center gap-[8px] text-[14px] text-[#59645d]'><FiShield className='text-[#2f6f4e]' /> 100% Original Product</p>
                      {!activeProduct && <p className='mt-[8px] text-[14px] text-[#b15f54]'>This product is unavailable for reorder</p>}
                    </div>
                  </div>

                  <div className='border-y-[1px] border-[#e0d9c9] py-[22px] text-center lg:border-x-[1px] lg:border-y-0'>
                    <span className={`inline-flex items-center gap-[10px] rounded-full px-[20px] py-[9px] text-[15px] font-bold ${isCancelled ? "bg-[#ffe5e1] text-[#c84435]" : "bg-[#e1f0e6] text-[#2f6f4e]"}`}><FiTruck /> {isCancelled ? "Cancelled" : item.status}</span>
                    {isCancelled && <p className='mt-[12px] text-[14px] font-bold text-[#c84435]'>You cancelled this product.</p>}
                    <p className='mt-[18px] text-[15px] text-[#59645d]'>Estimated Delivery</p>
                    <p className={`mt-[8px] text-[22px] font-bold ${isCancelled ? "text-[#c84435]" : "text-[#2f6f4e]"}`}>{isCancelled ? "Not applicable" : deliveryDate(item.date)}</p>
                    {!isCancelled && <p className='text-[14px] text-[#59645d]'>by 8:00 PM</p>}
                    {isCancelled && item.refundStatus && <p className='mt-[8px] text-[14px] text-[#59645d]'>Refund: <b className={refundClass(item.refundStatus)}>{refundLabel(item.refundStatus)}</b></p>}
                  </div>

                  <div className='flex flex-col gap-[14px]'>
                    {!isCancelled && <button type='button' className='flex h-[52px] items-center justify-center gap-[12px] rounded-xl bg-[#2f6f4e] px-[18px] font-bold text-[#fffaf0] shadow-lg shadow-[#8f968f33]' onClick={loadOrderData}><FiMapPin /> Track Order <FiArrowRight /></button>}
                    {activeProduct && <button type='button' className='flex h-[52px] items-center justify-center gap-[12px] rounded-xl border-[1px] border-[#74c69d] bg-[#fffaf0] px-[18px] font-bold text-[#2f6f4e]' onClick={() => navigate(`/productdetail/${item._id}`)}>View Details <FiArrowRight /></button>}
                    {item.status === "Delivered" && !isCancelled && <button type='button' className='flex h-[52px] items-center justify-center gap-[12px] rounded-xl border-[1px] border-[#74c69d] bg-[#b7e4c7] px-[18px] font-bold text-[#1f2a24]' onClick={() => navigate(`/rate/${item._id}`)}>Rate Product <FiArrowRight /></button>}
                    {canCancel && <button type='button' className='flex h-[52px] items-center justify-center gap-[12px] rounded-xl border-[1px] border-[#f0bbb2] bg-[#fffaf0] px-[18px] font-bold text-[#c84435]' onClick={() => setCancelItem(item)}>Cancel Product</button>}
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        <div className='mx-auto mt-[34px] flex max-w-[760px] flex-col gap-[18px] rounded-2xl border-[1px] border-[#e0d9c9] bg-[#eef3eacc] p-[18px] shadow-lg shadow-[#8f968f22] sm:flex-row sm:items-center sm:justify-between'>
          <div className='flex items-center gap-[16px]'>
            <span className='flex h-[58px] w-[58px] items-center justify-center rounded-full bg-[#d8ded8] text-[30px] text-[#2f6f4e]'><FiHeadphones /></span>
            <div>
              <h3 className='font-bold'>Need help with your order?</h3>
              <p className='text-[14px] text-[#59645d]'>Our support team is here to assist you.</p>
            </div>
          </div>
          <button type='button' className='inline-flex h-[48px] items-center justify-center gap-[10px] rounded-xl border-[1px] border-[#74c69d] px-[20px] font-bold text-[#2f6f4e] transition hover:bg-[#2f6f4e] hover:text-[#fffaf0] hover:shadow-lg hover:shadow-[#8f968f33]' onClick={() => navigate("/contact")}>Contact Support <FiArrowRight /></button>
        </div>
      </div>

    </main>

      {cancelItem && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-[#1f2a2480] px-[16px] py-[24px] backdrop-blur-sm'>
          <section className='w-full max-w-[460px] rounded-2xl border-[1px] border-[#f0bbb2] bg-[#fffaf0] p-[20px] shadow-2xl shadow-[#1f2a2440]'>
            <div className='flex items-start justify-between gap-[16px]'>
              <span className='flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-full bg-[#ffe5e1] text-[26px] text-[#c84435]'><FiAlertTriangle /></span>
              <button type='button' className='flex h-[40px] w-[40px] items-center justify-center rounded-full border-[1px] border-[#d8ded8] text-[21px] text-[#59645d]' aria-label='Close cancel confirmation' onClick={() => setCancelItem(null)} disabled={cancelingOrder}>
                <FiX />
              </button>
            </div>
            <h2 className='mt-[18px] text-[26px] font-bold text-[#1f2a24]'>Are you sure you want to cancel this product?</h2>
            <p className='mt-[10px] text-[15px] leading-relaxed text-[#59645d]'>
              This will cancel the full order containing <b className='text-[#1f2a24]'>{cancelItem.name}</b>.
              {cancelItem.paymentMethod === "Razorpay" && cancelItem.payment ? " The paid amount will be sent for Razorpay refund." : ""}
            </p>
            <div className='mt-[22px] grid gap-[12px] sm:grid-cols-2'>
              <button type='button' className='h-[50px] rounded-xl border-[1px] border-[#d8ded8] bg-[#fffaf0] font-bold text-[#2f6f4e]' onClick={() => setCancelItem(null)} disabled={cancelingOrder}>Keep Order</button>
              <button type='button' className='h-[50px] rounded-xl bg-[#c84435] font-bold text-[#fffaf0] disabled:cursor-not-allowed disabled:opacity-70' onClick={cancelOrder} disabled={cancelingOrder}>{cancelingOrder ? "Cancelling..." : "Cancel Product"}</button>
            </div>
          </section>
        </div>
      )}
    </>
  )
}

export default Order
