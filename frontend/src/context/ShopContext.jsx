import React, { createContext, useContext, useEffect, useState } from 'react'
import { authDataContext } from './AuthContext'
import axios from 'axios'
import { userDataContext } from './UserContext'
import { toast } from 'react-toastify'
import { noSizeKey } from '../constants/categories'

 export const shopDataContext = createContext()
function ShopContext({children}) {

    let [products,setProducts] = useState([])
    let [search,setSearch] = useState('')
    let {userData} = useContext(userDataContext)
    let [showSearch,setShowSearch] = useState(false)
    let {serverUrl} = useContext(authDataContext)
    let [cartItem, setCartItem] = useState({});
      let [loading,setLoading] = useState(false)
    let currency = '₹';
    let delivery_fee = 40;

    const getProducts = async () => {
        try {
            let result = await axios.get(serverUrl + "/api/product/list")
            setProducts(result.data.sort((a,b) => (b.date || 0) - (a.date || 0)))
        } catch (error) {
            console.log(error)
        }
        
    }


    const addtoCart = async (itemId , size) => {
      const product = products.find(item => item._id === itemId)
      const hasSizeOptions = Array.isArray(product?.sizes) && product.sizes.length > 0
      const selectedSize = hasSizeOptions ? size : noSizeKey

       if (hasSizeOptions && !size) {
      toast.error("Select Product Option");
      return;
    }

    let cartData = structuredClone(cartItem); // Clone the product

    if (cartData[itemId]) {
      if (cartData[itemId][selectedSize]) {
        cartData[itemId][selectedSize] += 1;
      } else {
        cartData[itemId][selectedSize] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][selectedSize] = 1;
    }
  
    setCartItem(cartData);
  

    if (userData) {
      setLoading(true)
      try {
      let result = await axios.post(serverUrl + "/api/cart/add" , {itemId,size:selectedSize} , {withCredentials: true})
      console.log(result.data)
      toast.success("Product Added")
      setLoading(false)


       
      }
      catch (error) {
        console.log(error)
        setLoading(false)
        toast.error("Add Cart Error")
       
      }
     
    } else {
      toast.success("Product Added")
    }
    }


    const getVariantPrice = (product, size) => {
      if (!product) return 0
      const variantPrice = product.variantPrices?.[size]
      return Number(variantPrice) > 0 ? Number(variantPrice) : Number(product.price || 0)
    }

    const getUserCart = async () => {
      try {
        const result = await axios.post(serverUrl + '/api/cart/get',{},{ withCredentials: true })
        setCartItem(result.data)
      } catch (error) {
        console.log(error)
      }
    }

    const syncCartAfterLogin = async () => {
      try {
        const result = await axios.post(serverUrl + '/api/cart/get',{},{ withCredentials: true })
        const serverCart = result.data || {}
        const mergedCart = structuredClone(serverCart)

        for (const itemId in cartItem) {
          if (!mergedCart[itemId]) {
            mergedCart[itemId] = {}
          }

          for (const size in cartItem[itemId]) {
            mergedCart[itemId][size] = (mergedCart[itemId][size] || 0) + cartItem[itemId][size]
          }
        }

        setCartItem(mergedCart)

        for (const itemId in mergedCart) {
          for (const size in mergedCart[itemId]) {
            await axios.post(serverUrl + "/api/cart/update", { itemId, size, quantity: mergedCart[itemId][size] }, { withCredentials: true })
          }
        }
      } catch (error) {
        console.log(error)
      }
    }
    const updateQuantity = async (itemId , size , quantity) => {
      let cartData = structuredClone(cartItem);
    cartData[itemId][size] = quantity
    setCartItem(cartData)

    if (userData) {
      try {
        await axios.post(serverUrl + "/api/cart/update", { itemId, size, quantity }, { withCredentials: true })
      } catch (error) {
        console.log(error)
        
      }
    }
      
    }
     const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItem) {
      for (const item in cartItem[items]) {
        try {
          if (cartItem[items][item] > 0) {
            totalCount += cartItem[items][item]
          }
        } catch (error) {

        }
      }
    }
    return totalCount
  }

  const getCartAmount = () => {
  let totalAmount = 0;
    for (const items in cartItem) {
      let itemInfo = products.find((product) => product._id === items);
      for (const item in cartItem[items]) {
        try {
          if (cartItem[items][item] > 0) {
            totalAmount += getVariantPrice(itemInfo, item) * cartItem[items][item];
          }
        } catch (error) {

        }
      }
    }
    return totalAmount
    
  }

    useEffect(()=>{
     getProducts()
    },[])

    useEffect(() => {
    if (userData) {
      if (getCartCount() > 0) {
        syncCartAfterLogin()
      } else {
        getUserCart()
      }
    }
  },[userData])






    let value = {
      products, currency , delivery_fee,getProducts,search,setSearch,showSearch,setShowSearch,cartItem, addtoCart, getCartCount, setCartItem ,updateQuantity,getCartAmount,getVariantPrice,loading
    }
  return (
    <div>
    <shopDataContext.Provider value={value}>
      {children}
      </shopDataContext.Provider>
    </div>
  )
}

export default ShopContext
