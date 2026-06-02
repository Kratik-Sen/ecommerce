import React, { useContext, useEffect, useState } from 'react'
import Nav from '../component/Nav'
import Sidebar from '../component/Sidebar'
import { authDataContext } from '../context/AuthContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { FiEdit2, FiFilter, FiSearch, FiX } from "react-icons/fi"
import { MdDragIndicator } from "react-icons/md"

function Lists() {
  const [list, setList] = useState([])
  const [search, setSearch] = useState("")
  const [editingProduct, setEditingProduct] = useState(null)
  const [editData, setEditData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    subCategory: "",
    sizes: "",
    variantPrices: "",
    bestseller: false,
  })
  const { serverUrl } = useContext(authDataContext)

  const filteredList = list.filter(item => {
    const searchText = search.toLowerCase()
    return item.name?.toLowerCase().includes(searchText) ||
      item.category?.toLowerCase().includes(searchText) ||
      item.subCategory?.toLowerCase().includes(searchText)
  })

  const fetchList = async () => {
    try {
      const result = await axios.get(serverUrl + "/api/product/list")
      setList(result.data)
    } catch (error) {
      console.log(error)
    }
  }

  const removeList = async (id) => {
    try {
      const result = await axios.post(`${serverUrl}/api/product/remove/${id}`, {}, { withCredentials: true })

      if (result.data) {
        toast.success("Product removed from store")
        fetchList()
      } else {
        console.log("Failed to remove Product")
      }
    } catch (error) {
      console.log(error)
      toast.error("Remove product failed")
    }
  }

  const openEdit = (product) => {
    setEditingProduct(product)
    setEditData({
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      category: product.category || "",
      subCategory: product.subCategory || "",
      sizes: Array.isArray(product.sizes) ? product.sizes.join(", ") : "",
      variantPrices: JSON.stringify(product.variantPrices || {}, null, 2),
      bestseller: !!product.bestseller,
    })
  }

  const updateEditData = (e) => {
    const { name, value, type, checked } = e.target
    setEditData(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }))
  }

  const updateProduct = async (e) => {
    e.preventDefault()

    try {
      const formData = new FormData()
      formData.append("name", editData.name.trim())
      formData.append("description", editData.description.trim())
      formData.append("price", editData.price)
      formData.append("category", editData.category.trim())
      formData.append("subCategory", editData.subCategory.trim())
      formData.append("sizes", JSON.stringify(editData.sizes.split(",").map(item => item.trim()).filter(Boolean)))
      formData.append("variantPrices", editData.variantPrices || "{}")
      formData.append("bestseller", editData.bestseller)

      const result = await axios.post(`${serverUrl}/api/product/update/${editingProduct._id}`, formData, { withCredentials: true })

      if (result.data) {
        toast.success("Product updated")
        setEditingProduct(null)
        fetchList()
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || "Update failed")
    }
  }

  useEffect(() => {
    fetchList()
  }, [])

  return (
    <div className='min-h-screen bg-[linear-gradient(135deg,#f8f4e8_0%,#eef3ea_52%,#e1e7df_100%)] text-[#1f2a24]'>
      <Nav />
      <Sidebar />
      <main className='relative min-h-screen overflow-hidden pl-[86px] pt-[96px] md:pl-[258px] md:pt-[116px]'>
        <div className='pointer-events-none fixed inset-0 opacity-25 [background-image:radial-gradient(#95d5b2_1px,transparent_1px)] [background-size:34px_34px]'></div>
        <div className='relative z-[1] mx-auto max-w-[1320px] px-[18px] pb-[80px] md:px-[36px]'>
          <div className='mb-[26px] flex flex-col gap-[16px] lg:flex-row lg:items-center lg:justify-between'>
            <div className='relative w-full max-w-[560px]'>
              <FiSearch className='absolute left-[18px] top-[15px] text-[22px] text-[#59645d]' />
              <input type="text" className='h-[54px] w-full rounded-xl border-[1px] border-[#d8ded8] bg-[#fffaf0e8] pl-[54px] pr-[18px] text-[15px] shadow-md shadow-[#8f968f1f] outline-none placeholder:text-[#6d766f] focus:border-[#74c69d]' placeholder='Search products, categories, sub-categories...' value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <button type='button' className='inline-flex h-[54px] items-center justify-center gap-[12px] rounded-xl border-[1px] border-[#d8ded8] bg-[#fffaf0e8] px-[24px] font-bold text-[#2f6f4e] shadow-md shadow-[#8f968f1f]'>
              <FiFilter /> Filter
            </button>
          </div>

          {editingProduct && (
            <>
            <div className='fixed inset-0 z-40 bg-[#1f2a2473] backdrop-blur-sm' onClick={() => setEditingProduct(null)}></div>
            <form onSubmit={updateProduct} className='fixed left-1/2 top-1/2 z-50 max-h-[calc(100vh-32px)] w-[calc(100vw-32px)] max-w-[920px] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border-[1px] border-[#d8ded8] bg-[#fffaf0] p-[20px] shadow-2xl shadow-[#1f2a2455]'>
              <div className='mb-[16px] flex items-center justify-between gap-[12px]'>
                <div className='text-[24px] font-bold text-[#0f4d45]'>Update Product</div>
                <button type='button' className='flex h-[42px] w-[42px] items-center justify-center rounded-full bg-[#eef3ea] text-[22px] text-[#2f6f4e]' onClick={() => setEditingProduct(null)} aria-label='Close update product'><FiX /></button>
              </div>
              <div className='grid gap-[12px] lg:grid-cols-2'>
                <input name='name' value={editData.name} onChange={updateEditData} className='h-[44px] rounded-lg border-[1px] border-[#d8ded8] bg-[#fffaf0] px-[14px] outline-none focus:border-[#74c69d]' placeholder='Product name' required />
                <input name='price' type='number' value={editData.price} onChange={updateEditData} className='h-[44px] rounded-lg border-[1px] border-[#d8ded8] bg-[#fffaf0] px-[14px] outline-none focus:border-[#74c69d]' placeholder='Price' required />
                <textarea name='description' value={editData.description} onChange={updateEditData} className='min-h-[90px] rounded-lg border-[1px] border-[#d8ded8] bg-[#fffaf0] px-[14px] py-[10px] outline-none focus:border-[#74c69d] lg:col-span-2' placeholder='Product description' required />
                <input name='category' value={editData.category} onChange={updateEditData} className='h-[44px] rounded-lg border-[1px] border-[#d8ded8] bg-[#fffaf0] px-[14px] outline-none focus:border-[#74c69d]' placeholder='Category' required />
                <input name='subCategory' value={editData.subCategory} onChange={updateEditData} className='h-[44px] rounded-lg border-[1px] border-[#d8ded8] bg-[#fffaf0] px-[14px] outline-none focus:border-[#74c69d]' placeholder='Sub-category' required />
                <input name='sizes' value={editData.sizes} onChange={updateEditData} className='h-[44px] rounded-lg border-[1px] border-[#d8ded8] bg-[#fffaf0] px-[14px] outline-none focus:border-[#74c69d]' placeholder='Sizes, e.g. S, M or 250g, 500g' />
                <textarea name='variantPrices' value={editData.variantPrices} onChange={updateEditData} className='min-h-[90px] rounded-lg border-[1px] border-[#d8ded8] bg-[#fffaf0] px-[14px] py-[10px] font-mono text-[13px] outline-none focus:border-[#74c69d] lg:col-span-2' placeholder='Gram prices JSON, e.g. {"250g": 199, "500g": 349}' />
                <label className='flex h-[44px] items-center gap-[10px] text-[15px]'>
                  <input type='checkbox' name='bestseller' checked={editData.bestseller} onChange={updateEditData} className='h-[18px] w-[18px]' />
                  Bestseller
                </label>
              </div>
              <div className='mt-[16px] flex gap-[12px]'>
                <button type='submit' className='rounded-lg bg-[#2f6f4e] px-[24px] py-[11px] font-bold text-[#fffaf0]'>Save</button>
                <button type='button' className='rounded-lg border-[1px] border-[#d8ded8] bg-[#fffaf0] px-[24px] py-[11px] font-bold text-[#2f6f4e]' onClick={() => setEditingProduct(null)}>Cancel</button>
              </div>
            </form>
            </>
          )}

          <div className='space-y-[18px]'>
            {filteredList?.length > 0 ? (
              filteredList.map((item) => (
                <article className='grid gap-[16px] rounded-2xl border-[1px] border-[#d8ded8] bg-[#fffaf0e8] p-[14px] shadow-lg shadow-[#8f968f22] md:grid-cols-[28px_130px_1fr_auto] md:items-center md:p-[16px]' key={item._id}>
                  <MdDragIndicator className='hidden text-[25px] text-[#c9d0ca] md:block' />
                  <img src={item.image1} className='h-[130px] w-full rounded-xl object-cover md:w-[130px]' alt={item.name} />
                  <div>
                    <h2 className='text-[20px] font-bold capitalize text-[#0f4d45]'>{item.name}</h2>
                    <p className='mt-[8px] text-[16px] text-[#4f8f67]'>{item.category} <span className='px-[10px] text-[#b8c0ba]'>/</span> {item.subCategory}</p>
                    <p className='mt-[8px] text-[17px] font-bold text-[#2f6f4e]'>₹ {item.price}</p>
                  </div>
                  <div className='flex items-center gap-[18px] md:justify-end'>
                    <button className='inline-flex h-[48px] items-center gap-[10px] rounded-lg border-[1px] border-[#2f6f4e] bg-[#fffaf0] px-[20px] font-bold text-[#2f6f4e]' onClick={() => openEdit(item)}>Edit <FiEdit2 /></button>
                    <button className='flex h-[48px] w-[48px] items-center justify-center rounded-lg border-[1px] border-[#f0bbb2] bg-[#fffaf0] text-[24px] text-[#d36b5f]' onClick={() => removeList(item._id)} aria-label='Remove product'><FiX /></button>
                  </div>
                </article>
              ))
            ) : (
              <div className='rounded-2xl border-[1px] border-[#d8ded8] bg-[#fffaf0e8] p-[30px] text-center text-lg text-[#59645d]'>No matching products available.</div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default Lists
