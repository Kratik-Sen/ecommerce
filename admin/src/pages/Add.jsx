import React, { useContext, useEffect } from 'react'
import Nav from '../component/Nav'
import Sidebar from '../component/Sidebar'
import upload from '../assets/upload image.jpg'
import { useState } from 'react'
import { authDataContext } from '../context/AuthContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import Loading from '../component/Loading'
import { defaultCategories, defaultSubCategories, isClothingCategory } from '../constants/categories'

const getSavedOptions = (key, defaults) => {
  try {
    const savedOptions = JSON.parse(localStorage.getItem(key)) || []
    return [...new Set([...defaults, ...savedOptions])]
  } catch {
    return defaults
  }
}

function Add() {
  let [image1,setImage1] = useState(false)
  let [image2,setImage2] = useState(false)
  let [image3,setImage3] = useState(false)
  let [image4,setImage4] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [categoryOptions, setCategoryOptions] = useState(() => getSavedOptions("adminCategories", defaultCategories))
  const [subCategoryOptions, setSubCategoryOptions] = useState(() => getSavedOptions("adminSubCategories", defaultSubCategories))
  const [category, setCategory] = useState(defaultCategories[0])
  const [price, setPrice] = useState("")
  const [subCategory, setSubCategory] = useState(defaultSubCategories[0])
  const [customCategory, setCustomCategory] = useState("")
  const [customSubCategory, setCustomSubCategory] = useState("")
  const [bestseller, setBestSeller] = useState(false)
  const [sizes,setSizes] = useState([])
  const [loading,setLoading] = useState(false)
  let {serverUrl} = useContext(authDataContext)
  const hasSizeOptions = isClothingCategory(category) || isClothingCategory(subCategory)

  useEffect(() => {
    localStorage.setItem("adminCategories", JSON.stringify(categoryOptions.filter(item => !defaultCategories.includes(item))))
  }, [categoryOptions])

  useEffect(() => {
    localStorage.setItem("adminSubCategories", JSON.stringify(subCategoryOptions.filter(item => !defaultSubCategories.includes(item))))
  }, [subCategoryOptions])

  useEffect(() => {
    if (!hasSizeOptions) {
      setSizes([])
    }
  }, [hasSizeOptions])

  const addCustomOption = (value, options, setOptions, setSelected, resetInput, label) => {
    const trimmedValue = value.trim()
    if (!trimmedValue) {
      toast.error(`Enter ${label}`)
      return
    }

    if (options.some(item => item.toLowerCase() === trimmedValue.toLowerCase())) {
      toast.error(`${label} already exists`)
      return
    }

    setOptions(prev => [...prev, trimmedValue])
    setSelected(trimmedValue)
    resetInput("")
    toast.success(`${label} added`)
  }

  const handleAddProduct = async (e) => {
    setLoading(true)
    e.preventDefault()
    try {
      if (!name.trim() || !description.trim() || !category.trim() || !subCategory.trim()) {
        toast.error("Fill all product details")
        setLoading(false)
        return
      }

      if (!Number(price) || Number(price) <= 0) {
        toast.error("Enter a valid product price")
        setLoading(false)
        return
      }

      if (!image1 || !image2 || !image3 || !image4) {
        toast.error("Upload all product images")
        setLoading(false)
        return
      }

      if (hasSizeOptions && sizes.length === 0) {
        toast.error("Select at least one size for clothing products")
        setLoading(false)
        return
      }

      let formData = new FormData()
      formData.append("name",name.trim())
      formData.append("description",description.trim())
      formData.append("price",price)
      formData.append("category",category)
      formData.append("subCategory",subCategory)
      formData.append("bestseller",bestseller)
      formData.append("sizes",JSON.stringify(hasSizeOptions ? sizes : []))
      formData.append("image1",image1)
      formData.append("image2",image2)
      formData.append("image3",image3)
      formData.append("image4",image4)

      let result = await axios.post(serverUrl + "/api/product/addproduct" , formData, {withCredentials:true} )

      console.log(result.data)
      toast.success("ADD Product Successfully")
      setLoading(false)

      if(result.data){
          setName("")
      setDescription("")
      setImage1(false)
      setImage2(false)
      setImage3(false)
      setImage4(false)
      setPrice("")
      setBestSeller(false)
      setCategory(defaultCategories[0])
      setSubCategory(defaultSubCategories[0])
      }

      
    } catch (error) {
       console.log(error)
       setLoading(false)
       toast.error("Add Product Failed")
    }

    
  }
  return (
    <div className='w-[100vw] min-h-[100vh] bg-[linear-gradient(135deg,#f8f4e8_0%,#e9efe4_52%,#c7d1c8_100%)] text-[#1f2a24] overflow-x-hidden relative'>
    <Nav/>
    <Sidebar/>


    <div className='w-[82%] h-[100%] flex items-center justify-start overflow-x-hidden absolute  right-0 bottom-[5%] '>

      <form action="" onSubmit={handleAddProduct} className='w-[100%] md:w-[90%] h-[100%]  mt-[70px] flex flex-col gap-[30px] py-[90px] px-[30px] md:px-[60px]'>
       <div className='w-[400px] h-[50px] text-[25px] md:text-[40px] text-[#1f2a24]'>Add Product Page</div>

       <div className='w-[80%] h-[130px] flex items-start justify-center flex-col mt-[20px]  gap-[10px] '>
        <p className='text-[20px] md:text-[25px]  font-semibold'>
          Upload Images
        </p>
        <div className='w-[100%] h-[100%] flex items-center justify-start '>
          <label htmlFor="image1" className=' w-[65px] h-[65px] md:w-[100px] md:h-[100px] cursor-pointer hover:border-[#74c69d]'>
            <img src={!image1 ? upload : URL.createObjectURL(image1)} alt="" className='w-[80%] h-[80%] rounded-lg shadow-2xl hover:border-[#95d5b2] border-[2px]' />
            <input type="file" id='image1' hidden onChange={(e)=>setImage1(e.target.files[0])} required />

          </label>
          <label htmlFor="image2" className=' w-[65px] h-[65px] md:w-[100px] md:h-[100px] cursor-pointer hover:border-[#74c69d]'>
            <img src={!image2 ? upload : URL.createObjectURL(image2)} alt="" className='w-[80%] h-[80%] rounded-lg shadow-2xl hover:border-[#95d5b2] border-[2px]' />
            <input type="file" id='image2' hidden onChange={(e)=>setImage2(e.target.files[0])} required />

          </label>
          <label htmlFor="image3" className=' w-[65px] h-[65px] md:w-[100px] md:h-[100px] cursor-pointer hover:border-[#74c69d]'>
            <img src={!image3 ? upload : URL.createObjectURL(image3)} alt="" className='w-[80%] h-[80%] rounded-lg shadow-2xl hover:border-[#95d5b2] border-[2px]' />
            <input type="file" id='image3' hidden onChange={(e)=>setImage3(e.target.files[0])} required />

          </label>
          <label htmlFor="image4" className=' w-[65px] h-[65px] md:w-[100px] md:h-[100px] cursor-pointer hover:border-[#74c69d]'>
            <img src={!image4 ? upload : URL.createObjectURL(image4)} alt="" className='w-[80%] h-[80%] rounded-lg shadow-2xl hover:border-[#95d5b2] border-[2px]' />
            <input type="file" id='image4' hidden onChange={(e)=>setImage4(e.target.files[0])} required/>

          </label>
         
        </div>

       </div>

       <div className='w-[80%] h-[100px] flex items-start justify-center flex-col  gap-[10px]'>
        <p className='text-[20px] md:text-[25px]  font-semibold'>
          Product Name
        </p>
        <input type="text" placeholder='Type here'
        className='w-[600px] max-w-[98%] h-[40px] rounded-lg hover:border-[#74c69d] border-[2px] cursor-pointer bg-[#c9d0ca] px-[20px] text-[18px] placeholder:text-[#6d766f]' onChange={(e)=>setName(e.target.value)} value={name} required/>
       </div>

        <div className='w-[80%] flex items-start justify-center flex-col  gap-[10px]'>
        <p className='text-[20px] md:text-[25px]  font-semibold'>
          Product Description
        </p>
        <textarea type="text" placeholder='Type here'
        className='w-[600px] max-w-[98%] h-[100px] rounded-lg hover:border-[#74c69d] border-[2px] cursor-pointer bg-[#c9d0ca] px-[20px] py-[10px] text-[18px] placeholder:text-[#6d766f]' onChange={(e)=>setDescription(e.target.value)} value={description} required />
       </div>

       <div className='w-[80%]  flex items-center  gap-[10px] flex-wrap '>
        <div className='md:w-[30%] w-[100%] flex items-start sm:justify-center flex-col  gap-[10px]'>
          <p className='text-[20px] md:text-[25px]  font-semibold w-[100%]'>Product Category</p>
          <select name="" id="" value={category} className='bg-[#c9d0ca] w-[90%] px-[10px] py-[7px] rounded-lg hover:border-[#74c69d] border-[2px] ' onChange={(e)=>setCategory(e.target.value)}>
            {categoryOptions.map(item => (
              <option value={item} key={item}>{item}</option>
            ))}
          </select>
          <div className='w-[90%] flex gap-[8px]'>
            <input type="text" placeholder='Custom category' className='bg-[#c9d0ca] w-[100%] px-[10px] py-[7px] rounded-lg hover:border-[#74c69d] border-[2px]' value={customCategory} onChange={(e)=>setCustomCategory(e.target.value)} />
            <button type='button' className='px-[14px] py-[7px] rounded-lg bg-[#b7e4c7] border-[1px] border-[#74c69d]' onClick={()=>addCustomOption(customCategory, categoryOptions, setCategoryOptions, setCategory, setCustomCategory, "category")}>Add</button>
          </div>
        </div>
        <div className='md:w-[30%] w-[100%] flex items-start sm:justify-center flex-col  gap-[10px]'>
          <p className='text-[20px] md:text-[25px]  font-semibold w-[100%]'>Sub-Category</p>
          <select name="" id="" value={subCategory} className='bg-[#c9d0ca] w-[90%] px-[10px] py-[7px] rounded-lg hover:border-[#74c69d] border-[2px] ' onChange={(e)=>setSubCategory(e.target.value)
          }>
            {subCategoryOptions.map(item => (
              <option value={item} key={item}>{item}</option>
            ))}
          </select>
          <div className='w-[90%] flex gap-[8px]'>
            <input type="text" placeholder='Custom sub-category' className='bg-[#c9d0ca] w-[100%] px-[10px] py-[7px] rounded-lg hover:border-[#74c69d] border-[2px]' value={customSubCategory} onChange={(e)=>setCustomSubCategory(e.target.value)} />
            <button type='button' className='px-[14px] py-[7px] rounded-lg bg-[#b7e4c7] border-[1px] border-[#74c69d]' onClick={()=>addCustomOption(customSubCategory, subCategoryOptions, setSubCategoryOptions, setSubCategory, setCustomSubCategory, "sub-category")}>Add</button>
          </div>
        </div>
       </div>
       <div className='w-[80%] h-[100px] flex items-start justify-center flex-col  gap-[10px]'>
        <p className='text-[20px] md:text-[25px]  font-semibold'>
          Product Price
        </p>
        <input type="number" placeholder='₹ 2000'
        className='w-[600px] max-w-[98%] h-[40px] rounded-lg hover:border-[#74c69d] border-[2px] cursor-pointer bg-[#c9d0ca] px-[20px] text-[18px] placeholder:text-[#6d766f]' onChange={(e)=>setPrice(e.target.value)} value={price} required/>
       </div>


       {hasSizeOptions && <div className='w-[80%] h-[220px] md:h-[100px] flex items-start justify-center flex-col gap-[10px] py-[10px] md:py-[0px]'>
        <p className='text-[20px] md:text-[25px]  font-semibold'>Product Size</p>

        <div className='flex items-center justify-start gap-[15px] flex-wrap'>
          <div className={`px-[20px] py-[7px] rounded-lg bg-[#c9d0ca] text-[18px] hover:border-[#74c69d] border-[2px] cursor-pointer ${sizes.includes("S") ? "bg-[#b7e4c7] text-[#1f2a24] border-[#74c69d]" : ""}`} onClick={()=>setSizes(prev => prev.includes("S") ? prev.filter(item => item !== "S") : [...prev , "S"])}>S</div>

          <div className={`px-[20px] py-[7px] rounded-lg bg-[#c9d0ca] text-[18px] hover:border-[#74c69d] border-[2px] cursor-pointer ${sizes.includes("M") ? "bg-[#b7e4c7] text-[#1f2a24] border-[#74c69d]" : ""}`} onClick={()=>setSizes(prev => prev.includes("M") ? prev.filter(item => item !== "M") : [...prev , "M"])}>M</div>

          <div className={`px-[20px] py-[7px] rounded-lg bg-[#c9d0ca] text-[18px] hover:border-[#74c69d] border-[2px] cursor-pointer ${sizes.includes("L") ? "bg-[#b7e4c7] text-[#1f2a24] border-[#74c69d]" : ""}`} onClick={()=>setSizes(prev => prev.includes("L") ? prev.filter(item => item !== "L") : [...prev , "L"])}>L</div>

          <div className={`px-[20px] py-[7px] rounded-lg bg-[#c9d0ca] text-[18px] hover:border-[#74c69d] border-[2px] cursor-pointer ${sizes.includes("XL") ? "bg-[#b7e4c7] text-[#1f2a24] border-[#74c69d]" : ""}`} onClick={()=>setSizes(prev => prev.includes("XL") ? prev.filter(item => item !== "XL") : [...prev , "XL"])}>XL</div>

          <div className={`px-[20px] py-[7px] rounded-lg bg-[#c9d0ca] text-[18px] hover:border-[#74c69d] border-[2px] cursor-pointer ${sizes.includes("XXL") ? "bg-[#b7e4c7] text-[#1f2a24] border-[#74c69d]" : ""}`} onClick={()=>setSizes(prev => prev.includes("XXL") ? prev.filter(item => item !== "XXL") : [...prev , "XXL"])}>XXL</div>
        </div>

       </div>}

       <div className='w-[80%] flex items-center justify-start gap-[10px] mt-[20px]'>
        <input type="checkbox" id='checkbox' className='w-[25px] h-[25px] cursor-pointer' onChange={()=>setBestSeller(prev => !prev)}/>
        <label htmlFor="checkbox" className='text-[18px] md:text-[22px]  font-semibold'>
          Add to BestSeller
        </label>

       </div>

       <button className='w-[140px] px-[20px] py-[20px] rounded-xl bg-[#b7e4c7] flex items-center justify-center gap-[10px] text-[#1f2a24] active:bg-[#8fbf9f] active:text-[#1f2a24] active:border-[2px] border-[#f8f4e8]'>{loading ? <Loading/> : "Add Product"}</button>




      </form>
    </div>
    </div>
  )
}

export default Add
