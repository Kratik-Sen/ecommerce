import React, { useContext, useEffect, useMemo, useState } from 'react'
import { FiChevronDown, FiGrid, FiSliders, FiUser } from "react-icons/fi"
import { LuShirt } from "react-icons/lu"
import { GiRunningShoe, GiTrousers } from "react-icons/gi"
import { MdOutlineFaceRetouchingNatural, MdOutlineLiving } from "react-icons/md"
import { shopDataContext } from '../context/ShopContext'
import Card from '../component/Card'
import { defaultCategories } from '../constants/categories'

function Collections() {
  const { products, search, showSearch } = useContext(shopDataContext)
  const [showFilter, setShowFilter] = useState(false)
  const [filterProduct, setFilterProduct] = useState([])
  const [category, setCategory] = useState([])
  const [sortType, setSortType] = useState("featured")
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")

  const categoryOptions = useMemo(() => {
    return [...new Set([...defaultCategories, ...products.map(item => item.category).filter(Boolean)])]
  }, [products])

  const quickFilters = ["All Collections", "Men's Clothing", "Women's Clothing", "T-Shirts", "Shirts", "Pants", "Kids' Clothing"]

  const categoryIcon = (item) => {
    const value = item.toLowerCase()
    if (value.includes("men") || value.includes("women") || value.includes("kids")) return FiUser
    if (value.includes("shirt") || value.includes("fashion") || value.includes("clothing")) return LuShirt
    if (value.includes("pant")) return GiTrousers
    if (value.includes("footwear")) return GiRunningShoe
    if (value.includes("beauty")) return MdOutlineFaceRetouchingNatural
    if (value.includes("home") || value.includes("furniture")) return MdOutlineLiving
    return FiGrid
  }

  const toggleCategory = (value) => {
    if (value === "All Collections") {
      setCategory([])
      return
    }
    setCategory(prev => prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value])
  }

  const applyFilter = () => {
    let productCopy = products.slice()

    if (showSearch && search) {
      productCopy = productCopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
    }

    if (category.length > 0) {
      productCopy = productCopy.filter(item => category.includes(item.category))
    }

    if (minPrice) {
      productCopy = productCopy.filter(item => Number(item.price) >= Number(minPrice))
    }

    if (maxPrice) {
      productCopy = productCopy.filter(item => Number(item.price) <= Number(maxPrice))
    }

    switch (sortType) {
      case "low-high":
        productCopy.sort((a, b) => a.price - b.price)
        break
      case "high-low":
        productCopy.sort((a, b) => b.price - a.price)
        break
      default:
        break
    }

    setFilterProduct(productCopy)
  }

  useEffect(() => {
    applyFilter()
  }, [products, category, search, showSearch, sortType, minPrice, maxPrice])

  return (
    <main className='min-h-screen w-full overflow-x-hidden bg-[linear-gradient(135deg,#f8f4e8_0%,#eef3ea_52%,#e1e7df_100%)] pt-[78px] text-[#1f2a24] sm:pt-[90px] md:pt-[104px]'>
      <div className='pointer-events-none fixed inset-0 opacity-40 [background-image:radial-gradient(#95d5b2_1px,transparent_1px)] [background-size:34px_34px]'></div>
      <div className='relative z-[1] mx-auto grid w-full max-w-[1500px] grid-cols-1 gap-[18px] px-[12px] pb-[110px] sm:px-[18px] lg:grid-cols-[290px_minmax(0,1fr)] lg:gap-[20px] lg:px-[34px]'>
        <aside className='min-w-0 overflow-hidden rounded-xl border-[1px] border-[#e0d9c9] bg-[#fffaf0cc] p-[14px] shadow-lg shadow-[#8f968f22] backdrop-blur sm:rounded-2xl sm:p-[20px] lg:sticky lg:top-[116px] lg:max-h-[calc(100vh-132px)] lg:overflow-y-auto'>
          <button type='button' className='flex w-full items-center justify-between text-[20px] font-bold text-[#2f6f4e] lg:pointer-events-none' onClick={() => setShowFilter(prev => !prev)}>
            FILTERS <FiSliders />
          </button>

          <div className={`${showFilter ? "block" : "hidden"} mt-[22px] lg:block`}>
            <div className='border-t-[1px] border-[#d8ded8] pt-[22px]'>
              <h3 className='mb-[12px] text-[16px] font-bold text-[#2f6f4e]'>CATEGORIES</h3>
              <div className='space-y-[8px]'>
                {categoryOptions.slice(0, 12).map(item => {
                  const Icon = categoryIcon(item)
                  const active = category.includes(item)
                  return (
                    <button key={item} type='button' className={`flex w-full items-center gap-[12px] rounded-xl px-[12px] py-[9px] text-left text-[14px] transition ${active ? "bg-[#d8ded8] text-[#2f6f4e]" : "hover:bg-[#eef3ea]"}`} onClick={() => toggleCategory(item)}>
                      <Icon className='text-[18px] text-[#4f8f67]' /> {item}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className='mt-[24px] border-t-[1px] border-[#d8ded8] pt-[22px]'>
              <h3 className='mb-[12px] text-[16px] font-bold text-[#2f6f4e]'>PRICE RANGE</h3>
              <div className='grid grid-cols-2 gap-[12px]'>
                <input className='h-[44px] min-w-0 rounded-lg border-[1px] border-[#d8ded8] bg-[#fffaf0] px-[12px] text-[14px] outline-none focus:border-[#74c69d]' placeholder='₹ 0' type='number' min='0' value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
                <input className='h-[44px] min-w-0 rounded-lg border-[1px] border-[#d8ded8] bg-[#fffaf0] px-[12px] text-[14px] outline-none focus:border-[#74c69d]' placeholder='₹ 5000+' type='number' min='0' value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
              </div>
            </div>

            <div className='mt-[24px] border-t-[1px] border-[#d8ded8] pt-[22px]'>
              <h3 className='mb-[12px] text-[16px] font-bold text-[#2f6f4e]'>SORT BY</h3>
              <div className='relative'>
                <select className='h-[44px] w-full appearance-none rounded-lg border-[1px] border-[#d8ded8] bg-[#fffaf0] px-[12px] text-[14px] outline-none focus:border-[#74c69d]' value={sortType} onChange={(e) => setSortType(e.target.value)}>
                  <option value="featured">Featured</option>
                  <option value="low-high">Low to High</option>
                  <option value="high-low">High to Low</option>
                </select>
                <FiChevronDown className='pointer-events-none absolute right-[12px] top-[14px] text-[#59645d]' />
              </div>
            </div>
          </div>
        </aside>

        <section>
          <div className='mb-[24px] flex flex-col gap-[20px] lg:flex-row lg:items-end lg:justify-between'>
            <div>
              <h1 className='text-[38px] leading-tight text-[#2f6f4e] sm:text-[46px] md:text-[54px]'>All Collections</h1>
              <p className='mt-[8px] max-w-[720px] text-[15px] leading-relaxed text-[#59645d] md:text-[16px]'>Discover our wide range of premium fashion and lifestyle products.</p>
            </div>
           
          </div>

          <div className='mb-[26px] flex max-w-full gap-[12px] overflow-x-auto pb-[6px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
            {quickFilters.map(item => {
              const value = item === "All Collections" ? item : item
              const active = item === "All Collections" ? category.length === 0 : category.includes(value)
              return (
                <button key={item} type='button' className={`shrink-0 rounded-xl border-[1px] px-[22px] py-[11px] text-[14px] font-semibold transition ${active ? "border-[#74c69d] bg-[#74c69d] text-[#fffaf0]" : "border-[#d8ded8] bg-[#fffaf0] text-[#2f6f4e] hover:border-[#74c69d]"}`} onClick={() => toggleCategory(value)}>
                  {item.replace("'s Clothing", "")}
                </button>
              )
            })}
          </div>

          <div className='grid justify-items-center gap-[20px] sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'>
            {filterProduct.map(item => (
              <Card key={item._id} id={item._id} name={item.name} price={item.price} image={item.image1} images={[item.image1, item.image2, item.image3, item.image4]} />
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}

export default Collections
