import React, { useContext, useEffect, useState } from 'react'
import Nav from '../component/Nav'
import Sidebar from '../component/Sidebar'
import { authDataContext } from '../context/AuthContext'
import axios from 'axios'
import { FiChevronDown, FiChevronRight, FiFilter, FiMail, FiMapPin, FiPackage, FiPhone, FiSearch, FiTrash2, FiUser, FiX } from "react-icons/fi"

const noSizeKey = "default"

function Orders() {
  const [orders, setOrders] = useState([])
  const [search, setSearch] = useState("")
  const [updatingStatus, setUpdatingStatus] = useState({})
  const [selectedOrder, setSelectedOrder] = useState(null)
  const { serverUrl } = useContext(authDataContext)

  const fetchAllOrders = async () => {
    try {
      const result = await axios.post(serverUrl + '/api/order/list', {}, { withCredentials: true })
      setOrders(result.data.reverse())
    } catch (error) {
      console.log(error)
    }
  }

  const statusHandler = async (e, orderId) => {
    const nextStatus = e.target.value
    const targetOrder = orders.find(order => order._id === orderId)
    if (targetOrder?.canceledByUser || targetOrder?.status === "Cancelled") {
      return
    }
    const previousStatus = orders.find(order => order._id === orderId)?.status
    setOrders(prev => prev.map(order => order._id === orderId ? { ...order, status: nextStatus } : order))
    setUpdatingStatus(prev => ({ ...prev, [orderId]: true }))

    try {
      await axios.post(serverUrl + '/api/order/status', { orderId, status: nextStatus }, { withCredentials: true })
    } catch (error) {
      console.log(error)
      setOrders(prev => prev.map(order => order._id === orderId ? { ...order, status: previousStatus } : order))
    } finally {
      setUpdatingStatus(prev => ({ ...prev, [orderId]: false }))
    }
  }

  const removeDeliveredOrder = async (orderId) => {
    try {
      const result = await axios.post(serverUrl + '/api/order/archive', { orderId }, { withCredentials: true })
      if (result.data) {
        await fetchAllOrders()
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchAllOrders()
  }, [])

  const filteredOrders = orders.filter(order => {
    const query = search.toLowerCase()
    const customer = `${order.address?.firstName || ""} ${order.address?.lastName || ""}`.toLowerCase()
    const date = new Date(order.date).toLocaleString().toLowerCase()
    return String(order._id).toLowerCase().includes(query) ||
      customer.includes(query) ||
      date.includes(query) ||
      order.paymentMethod?.toLowerCase().includes(query)
  })

  const selectedAddress = selectedOrder?.address || {}
  const selectedCustomer = `${selectedAddress.firstName || ""} ${selectedAddress.lastName || ""}`.trim()
  const refundLabel = (status) => String(status || "").toLowerCase() === "processed" ? "success" : status
  const refundClass = (status) => String(status || "").toLowerCase() === "processed" ? "text-[#2f6f4e]" : "text-[#c84435]"
  const detailFields = [
    { label: "First Name", value: selectedAddress.firstName },
    { label: "Last Name", value: selectedAddress.lastName },
    { label: "Email", value: selectedAddress.email },
    { label: "Phone", value: selectedAddress.phone },
    { label: "Street", value: selectedAddress.street },
    { label: "City", value: selectedAddress.city },
    { label: "State", value: selectedAddress.state },
    { label: "Pincode", value: selectedAddress.pinCode },
    { label: "Country", value: selectedAddress.country },
  ]

  return (
    <div className='min-h-screen bg-[linear-gradient(135deg,#f8f4e8_0%,#eef3ea_52%,#e1e7df_100%)] text-[#1f2a24]'>
      <Nav />
      <Sidebar />
      <main className='relative min-h-screen overflow-hidden pl-[86px] pt-[96px] md:pl-[258px] md:pt-[116px]'>
        <div className='pointer-events-none fixed inset-0 opacity-25 [background-image:radial-gradient(#95d5b2_1px,transparent_1px)] [background-size:34px_34px]'></div>
        <div className='relative z-[1] mx-auto max-w-[1320px] px-[18px] pb-[80px] md:px-[36px]'>
          <div className='mb-[34px] grid gap-[18px] lg:grid-cols-[1fr_640px] lg:items-end'>
            <div>
              <h1 className='text-[42px] font-bold leading-tight text-[#0f4d45] md:text-[52px]'>All Orders List</h1>
              <span className='mt-[12px] block h-[2px] w-[58px] bg-[#2f6f4e]'></span>
              <p className='mt-[16px] text-[17px] text-[#59645d]'>Track and manage all your orders in one place.</p>
            </div>
            <div className='flex flex-col gap-[14px] sm:flex-row'>
              <div className='relative flex-1'>
                <FiSearch className='absolute left-[18px] top-[15px] text-[22px] text-[#2f6f4e]' />
                <input className='h-[54px] w-full rounded-xl border-[1px] border-[#d8ded8] bg-[#fffaf0e8] pl-[54px] pr-[18px] text-[15px] shadow-md shadow-[#8f968f1f] outline-none placeholder:text-[#6d766f] focus:border-[#74c69d]' placeholder='Search orders by ID, customer or date...' value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <button type='button' className='inline-flex h-[54px] items-center justify-center gap-[12px] rounded-xl border-[1px] border-[#d8ded8] bg-[#fffaf0e8] px-[26px] font-bold text-[#2f6f4e] shadow-md shadow-[#8f968f1f]'>
                <FiFilter /> Filter <FiChevronDown />
              </button>
            </div>
          </div>

          <div className='space-y-[22px]'>
            {filteredOrders.map((order) => {
              const date = new Date(order.date).toLocaleString("en-US", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
              const customer = `${order.address?.firstName || ""} ${order.address?.lastName || ""}`.trim()
              const isCancelled = order.canceledByUser || order.status === "Cancelled"
              return (
                <article key={order._id} className='grid gap-[22px] rounded-2xl border-[1px] border-[#d8ded8] bg-[#fffaf0e8] p-[22px] shadow-xl shadow-[#8f968f22] lg:grid-cols-[96px_1fr_1fr_1fr_240px] lg:items-center'>
                  <div className='flex h-[76px] w-[76px] items-center justify-center rounded-xl border-[1px] border-[#d8ded8] bg-[#fffaf0] text-[42px] text-[#0f4d45]'>
                    <FiPackage />
                  </div>

                  <div className='space-y-[14px]'>
                    <div>
                      <p className='text-[15px] text-[#59645d]'>Order ID</p>
                      <p className='break-all text-[19px] font-bold text-[#1f2a24]'>#ORD-{String(order._id).slice(-10).toUpperCase()}</p>
                    </div>
                    <div>
                      <p className='text-[15px] text-[#59645d]'>Customer</p>
                      <p className='text-[19px] font-bold text-[#2f6f4e]'>{customer || "Customer"}</p>
                    </div>
                    <div>
                      <p className='text-[15px] text-[#59645d]'>Payment Method</p>
                      <p className='text-[18px] font-bold text-[#2f6f4e]'>{order.paymentMethod}</p>
                    </div>
                  </div>

                  <div className='space-y-[14px]'>
                    <div>
                      <p className='text-[15px] text-[#59645d]'>Date</p>
                      <p className='text-[18px] font-bold text-[#1f2a24]'>{date}</p>
                    </div>
                    <div>
                      <p className='text-[15px] text-[#59645d]'>Status</p>
                      {isCancelled && <p className='mt-[4px] rounded-full bg-[#ffe5e1] px-[14px] py-[7px] text-[14px] font-bold text-[#c84435]'>This product is canceled by user</p>}
                      <select value={order.status} disabled={isCancelled || !!updatingStatus[order._id]} className={`mt-[8px] rounded-full border-[1px] px-[12px] py-[7px] text-[14px] font-bold outline-none disabled:cursor-not-allowed disabled:opacity-70 ${isCancelled ? "border-[#f0bbb2] bg-[#ffe5e1] text-[#c84435]" : "border-[#c9d0ca] bg-[#e1f0e6] text-[#2f6f4e]"}`} onChange={(e) => statusHandler(e, order._id)}>
                        <option value="Order Placed">Order Placed</option>
                        <option value="Packing">Packing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Out for delivery">Out for delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                    <div>
                      <p className='text-[15px] text-[#59645d]'>Total Amount</p>
                      <p className='text-[19px] font-bold text-[#2f6f4e]'>₹ {order.amount}</p>
                    </div>
                  </div>

                  <div className='space-y-[14px]'>
                    <div>
                      <p className='text-[15px] text-[#59645d]'>Items</p>
                      <p className='text-[19px] font-bold text-[#1f2a24]'>{order.items.length} Items</p>
                    </div>
                    <div>
                      <p className='text-[15px] text-[#59645d]'>Payment Status</p>
                      <span className={`mt-[4px] inline-flex rounded-full px-[14px] py-[7px] text-[14px] font-bold ${order.payment ? "bg-[#e1f0e6] text-[#2f6f4e]" : "bg-[#fff3d9] text-[#9a6a16]"}`}>{order.payment ? "Paid" : "Pending"}</span>
                      {isCancelled && order.refundStatus && <p className={`mt-[8px] text-[14px] font-bold ${refundClass(order.refundStatus)}`}>Refund: {refundLabel(order.refundStatus)}</p>}
                    </div>
                    <div className='text-[14px] text-[#59645d]'>
                      {order.items.slice(0, 2).map((item, index) => {
                        const sizeText = item.size && item.size !== noSizeKey ? ` (${item.size})` : ""
                        return <p key={`${item._id}-${index}`}>{item.name} x {item.quantity}{sizeText}</p>
                      })}
                    </div>
                  </div>

                  <div className='flex flex-col gap-[12px] border-t-[1px] border-[#d8ded8] pt-[20px] lg:border-l-[1px] lg:border-t-0 lg:pl-[34px] lg:pt-0'>
                    <button type='button' className='inline-flex h-[54px] items-center justify-center gap-[12px] rounded-xl border-[1px] border-[#2f6f4e] bg-[#fffaf0] px-[22px] font-bold text-[#2f6f4e]' onClick={() => setSelectedOrder(order)}>
                      View Details <FiChevronRight />
                    </button>
                    {order.status === "Delivered" && (
                      <button type='button' className='inline-flex h-[50px] items-center justify-center gap-[10px] rounded-xl border-[1px] border-[#f0bbb2] bg-[#fffaf0] px-[18px] font-bold text-[#d36b5f]' onClick={() => removeDeliveredOrder(order._id)}>
                        <FiTrash2 /> Remove
                      </button>
                    )}
                  </div>
                </article>
              )
            })}

            {filteredOrders.length === 0 && (
              <div className='rounded-2xl border-[1px] border-[#d8ded8] bg-[#fffaf0e8] p-[34px] text-center text-[#59645d] shadow-lg shadow-[#8f968f22]'>No orders found.</div>
            )}
          </div>
        </div>
      </main>

      {selectedOrder && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-[#1f2a2480] px-[14px] py-[22px] backdrop-blur-sm'>
          <section className='max-h-[92vh] w-full max-w-[720px] overflow-y-auto rounded-2xl border-[1px] border-[#d8ded8] bg-[#fffaf0] p-[18px] shadow-2xl shadow-[#1f2a2440] md:p-[26px]'>
            <div className='flex items-start justify-between gap-[16px] border-b-[1px] border-[#d8ded8] pb-[16px]'>
              <div>
                <p className='text-[14px] font-bold uppercase tracking-[0px] text-[#2f6f4e]'>Customer Details</p>
                <h2 className='mt-[6px] text-[28px] font-bold leading-tight text-[#1f2a24]'>{selectedCustomer || "Customer"}</h2>
                <p className='mt-[6px] break-all text-[14px] text-[#59645d]'>#ORD-{String(selectedOrder._id).slice(-10).toUpperCase()}</p>
              </div>
              <button type='button' className='flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full border-[1px] border-[#d8ded8] bg-[#fffaf0] text-[22px] text-[#2f6f4e]' aria-label='Close details' onClick={() => setSelectedOrder(null)}>
                <FiX />
              </button>
            </div>

            <div className='mt-[18px] grid gap-[12px] sm:grid-cols-3'>
              <div className='rounded-xl border-[1px] border-[#d8ded8] bg-[#f8f4e8] p-[14px]'>
                <FiUser className='mb-[10px] text-[22px] text-[#2f6f4e]' />
                <p className='text-[13px] text-[#59645d]'>Name</p>
                <p className='mt-[4px] text-[16px] font-bold text-[#1f2a24]'>{selectedCustomer || "Not provided"}</p>
              </div>
              <div className='rounded-xl border-[1px] border-[#d8ded8] bg-[#f8f4e8] p-[14px]'>
                <FiMail className='mb-[10px] text-[22px] text-[#2f6f4e]' />
                <p className='text-[13px] text-[#59645d]'>Email</p>
                <p className='mt-[4px] break-all text-[16px] font-bold text-[#1f2a24]'>{selectedAddress.email || "Not provided"}</p>
              </div>
              <div className='rounded-xl border-[1px] border-[#d8ded8] bg-[#f8f4e8] p-[14px]'>
                <FiPhone className='mb-[10px] text-[22px] text-[#2f6f4e]' />
                <p className='text-[13px] text-[#59645d]'>Phone</p>
                <p className='mt-[4px] text-[16px] font-bold text-[#1f2a24]'>{selectedAddress.phone || "Not provided"}</p>
              </div>
            </div>

            <div className='mt-[18px] rounded-xl border-[1px] border-[#d8ded8] bg-[#f8f4e8] p-[16px]'>
              <div className='mb-[12px] flex items-center gap-[10px] text-[#2f6f4e]'>
                <FiMapPin className='text-[22px]' />
                <h3 className='text-[18px] font-bold'>Delivery Form Information</h3>
              </div>
              <div className='grid gap-[10px] sm:grid-cols-2'>
                {detailFields.map(field => (
                  <div key={field.label} className='rounded-lg bg-[#fffaf0] p-[12px]'>
                    <p className='text-[13px] text-[#59645d]'>{field.label}</p>
                    <p className='mt-[4px] break-words text-[16px] font-semibold text-[#1f2a24]'>{field.value || "Not provided"}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}

export default Orders
