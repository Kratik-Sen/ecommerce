import React, { useContext, useEffect, useState } from 'react'
import Nav from '../component/Nav'
import Sidebar from '../component/Sidebar'
import { authDataContext } from '../context/AuthContext'
import axios from 'axios'
import { toast } from 'react-toastify'

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
    <div className='w-[100vw] min-h-[100vh] bg-[linear-gradient(135deg,#f8f4e8_0%,#e9efe4_52%,#c7d1c8_100%)] text-[#1f2a24]'>
      <Nav />
      <div className='w-[100%] h-[100%] flex items-center justify-start'>
        <Sidebar />

        <div className='w-[82%] h-[100%] lg:ml-[320px] md:ml-[230px] mt-[70px] flex flex-col gap-[30px] overflow-x-hidden py-[50px] ml-[100px]'>
          <div className='w-[400px] h-[50px] text-[28px] md:text-[40px] mb-[20px] text-[#1f2a24]'>All Listed Products</div>

          <input type="text" className='w-[90%] md:w-[520px] h-[45px] bg-[#fffaf0] border-[1px] border-[#b8c0ba] rounded-xl px-[18px] text-[16px] placeholder:text-[#6d766f]' placeholder='Search products, categories, sub-categories' value={search} onChange={(e) => setSearch(e.target.value)} />

          {editingProduct && (
            <form onSubmit={updateProduct} className='w-[90%] bg-[#fffaf0cc] border-[1px] border-[#b8c0ba] rounded-xl p-[20px] flex flex-col gap-[12px]'>
              <div className='text-[24px] text-[#1f2a24]'>Update Product</div>
              <input name='name' value={editData.name} onChange={updateEditData} className='w-[100%] h-[42px] rounded-lg bg-[#c9d0ca] px-[14px]' placeholder='Product name' required />
              <textarea name='description' value={editData.description} onChange={updateEditData} className='w-[100%] h-[95px] rounded-lg bg-[#c9d0ca] px-[14px] py-[10px]' placeholder='Product description' required />
              <div className='w-[100%] flex flex-wrap gap-[12px]'>
                <input name='price' type='number' value={editData.price} onChange={updateEditData} className='w-[180px] h-[42px] rounded-lg bg-[#c9d0ca] px-[14px]' placeholder='Price' required />
                <input name='category' value={editData.category} onChange={updateEditData} className='w-[220px] h-[42px] rounded-lg bg-[#c9d0ca] px-[14px]' placeholder='Category' required />
                <input name='subCategory' value={editData.subCategory} onChange={updateEditData} className='w-[220px] h-[42px] rounded-lg bg-[#c9d0ca] px-[14px]' placeholder='Sub-category' required />
              </div>
              <label className='flex items-center gap-[10px] text-[16px]'>
                <input type='checkbox' name='bestseller' checked={editData.bestseller} onChange={updateEditData} className='w-[20px] h-[20px]' />
                Bestseller
              </label>
              <div className='flex gap-[12px]'>
                <button type='submit' className='px-[20px] py-[10px] bg-[#b7e4c7] rounded-lg border-[1px] border-[#74c69d]'>Save</button>
                <button type='button' className='px-[20px] py-[10px] bg-[#d8ded8] rounded-lg border-[1px] border-[#b8c0ba]' onClick={() => setEditingProduct(null)}>Cancel</button>
              </div>
            </form>
          )}

          {filteredList?.length > 0 ? (
            filteredList.map((item) => (
              <div className='w-[90%] md:h-[120px] h-[110px] bg-[#c9d0ca] rounded-xl flex items-center justify-start gap-[5px] md:gap-[30px] p-[10px] md:px-[30px]' key={item._id}>
                <img src={item.image1} className='w-[30%] md:w-[120px] h-[90%] rounded-lg' alt="" />
                <div className='w-[90%] h-[80%] flex flex-col items-start justify-center gap-[2px]'>
                  <div className='w-[100%] md:text-[20px] text-[15px] text-[#2f6f4e]'>{item.name}</div>
                  <div className='md:text-[17px] text-[15px] text-[#4f8f67]'>{item.category} / {item.subCategory}</div>
                  <div className='md:text-[17px] text-[15px] text-[#4f8f67]'>₹{item.price}</div>
                </div>
                <div className='w-[18%] h-[100%] bg-transparent flex items-center justify-center gap-[8px]'>
                  <button className='px-[12px] py-[8px] rounded-md bg-[#fffaf0] border-[1px] border-[#b8c0ba] cursor-pointer' onClick={() => openEdit(item)}>Edit</button>
                  <span className='w-[35px] h-[30%] flex items-center justify-center rounded-md md:hover:bg-[#e3b9b4] md:hover:text-[#1f2a24] cursor-pointer' onClick={() => removeList(item._id)}>X</span>
                </div>
              </div>
            ))
          ) : (
            <div className='text-[#1f2a24] text-lg'>No matching products available.</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Lists
