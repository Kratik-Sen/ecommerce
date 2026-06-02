import React, { useContext, useEffect, useState } from 'react'
import { FiArrowRight, FiCreditCard, FiDownload, FiHeadphones, FiMapPin, FiPackage, FiShoppingBag, FiShield, FiTruck } from "react-icons/fi"
import { shopDataContext } from '../context/ShopContext'
import { authDataContext } from '../context/AuthContext'
import axios from 'axios'
import { noSizeKey } from '../constants/categories'
import { useNavigate } from 'react-router-dom'

function Order() {
  const [orderData, setOrderData] = useState([])
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
              orderItems: order.items
            })
          })
        })
        setOrderData(allOrdersItem.reverse())
      }
    } catch (error) {
      console.log(error)
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
                  <button type='button' className='inline-flex h-[50px] items-center justify-center gap-[10px] rounded-xl border-[1px] border-[#74c69d] px-[18px] text-[14px] font-bold text-[#2f6f4e] transition hover:bg-[#e9efe4]' onClick={() => downloadInvoice(item)}>
                    <FiDownload /> Download Invoice
                  </button>
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
                    <span className='inline-flex items-center gap-[10px] rounded-full bg-[#e1f0e6] px-[20px] py-[9px] text-[15px] font-bold text-[#2f6f4e]'><FiTruck /> {item.status}</span>
                    <p className='mt-[18px] text-[15px] text-[#59645d]'>Estimated Delivery</p>
                    <p className='mt-[8px] text-[22px] font-bold text-[#2f6f4e]'>{deliveryDate(item.date)}</p>
                    <p className='text-[14px] text-[#59645d]'>by 8:00 PM</p>
                  </div>

                  <div className='flex flex-col gap-[14px]'>
                    <button type='button' className='flex h-[52px] items-center justify-center gap-[12px] rounded-xl bg-[#2f6f4e] px-[18px] font-bold text-[#fffaf0] shadow-lg shadow-[#8f968f33]' onClick={loadOrderData}><FiMapPin /> Track Order <FiArrowRight /></button>
                    {activeProduct && <button type='button' className='flex h-[52px] items-center justify-center gap-[12px] rounded-xl border-[1px] border-[#74c69d] bg-[#fffaf0] px-[18px] font-bold text-[#2f6f4e]' onClick={() => navigate(`/productdetail/${item._id}`)}>View Details <FiArrowRight /></button>}
                    {item.status === "Delivered" && <button type='button' className='flex h-[52px] items-center justify-center gap-[12px] rounded-xl border-[1px] border-[#74c69d] bg-[#b7e4c7] px-[18px] font-bold text-[#1f2a24]' onClick={() => navigate(`/rate/${item._id}`)}>Rate Product <FiArrowRight /></button>}
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
  )
}

export default Order
