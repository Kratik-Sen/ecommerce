import React, { useContext, useEffect, useState } from 'react'
import Nav from '../component/Nav'
import Sidebar from '../component/Sidebar'
import { authDataContext } from '../context/AuthContext'
import axios from 'axios'
import { FiChevronDown, FiChevronRight, FiFilter, FiPackage, FiSearch, FiTrash2 } from "react-icons/fi"

const noSizeKey = "default"

function Orders() {
  const [orders, setOrders] = useState([])
  const [search, setSearch] = useState("")
  const [updatingStatus, setUpdatingStatus] = useState({})
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
                      <select value={order.status} disabled={!!updatingStatus[order._id]} className='mt-[4px] rounded-full border-[1px] border-[#c9d0ca] bg-[#e1f0e6] px-[12px] py-[7px] text-[14px] font-bold text-[#2f6f4e] outline-none disabled:opacity-70' onChange={(e) => statusHandler(e, order._id)}>
                        <option value="Order Placed">Order Placed</option>
                        <option value="Packing">Packing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Out for delivery">Out for delivery</option>
                        <option value="Delivered">Delivered</option>
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
                    </div>
                    <div className='text-[14px] text-[#59645d]'>
                      {order.items.slice(0, 2).map((item, index) => {
                        const sizeText = item.size && item.size !== noSizeKey ? ` (${item.size})` : ""
                        return <p key={`${item._id}-${index}`}>{item.name} x {item.quantity}{sizeText}</p>
                      })}
                    </div>
                  </div>

                  <div className='flex flex-col gap-[12px] border-t-[1px] border-[#d8ded8] pt-[20px] lg:border-l-[1px] lg:border-t-0 lg:pl-[34px] lg:pt-0'>
                    <button type='button' className='inline-flex h-[54px] items-center justify-center gap-[12px] rounded-xl border-[1px] border-[#2f6f4e] bg-[#fffaf0] px-[22px] font-bold text-[#2f6f4e]'>
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
    </div>
  )
}

export default Orders
