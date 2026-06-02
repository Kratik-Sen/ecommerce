import { useContext, useState } from 'react'
import viteLogo from '/vite.svg'
import './App.css'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Registration from './pages/Registration'
import Home from './pages/Home'
import Login from './pages/Login'
import { userDataContext } from './context/UserContext'
import { ToastContainer } from 'react-toastify'
import Collections from './pages/Collections'
import About from './pages/About'
import NotFound from './pages/NotFound'
import Contact from './pages/Contact'
import Order from './pages/Order'
import Nav from './component/Nav'
import Product from './pages/Product'
import Cart from './pages/Cart'
import PlaceOrder from './pages/PlaceOrder'
import ProductDetail from './pages/ProductDetails'
import RateProduct from './pages/RateProduct'

function App() {
let {userData} = useContext(userDataContext)
let location = useLocation()
let isAuthPage = location.pathname === "/login" || location.pathname === "/signup"
  return (
   <>
    <ToastContainer/>
    {!isAuthPage && <Nav/>}

   <Routes>
  <Route path='/login' 
        element={userData ? (<Navigate to={location.state?.from || "/"}/> ) 
        : (<Login/>)
          }/>

        <Route path='/signup' 
        element={userData ? (<Navigate to={location.state?.from || "/"}/> ) 
        : (<Registration/>)}/>

        <Route path='/' 
        element={<Home/>}/>
      
        <Route path='/about' 
        element={<About/>}/>

        <Route path='/collection' 
        element={<Collections/>}/>
          <Route path='/product' 
        element={<Product/>}/>

        <Route path='/contact' 
        element={<Contact/>}/>

 <Route path='/productdetail/:productId' 
        element={<ProductDetail/>}/>

           <Route path='/cart' 
        element={<Cart/>}/>

 <Route path='/placeorder' 
        element={userData ? <PlaceOrder/> : <Navigate to="/login" state={{from: location.pathname}} /> }/>


<Route path='/order' 
        element={userData ? <Order/> : <Navigate to="/login" state={{from: location.pathname}} /> }/>

<Route path='/rate/:productId' 
        element={userData ? <RateProduct/> : <Navigate to="/login" state={{from: location.pathname}} /> }/>

        <Route path='*' element={<NotFound/>}/>

   </Routes>
   </>
  )
}

export default App
