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
import Ai from './component/Ai'
import RateProduct from './pages/RateProduct'

function App() {
let {userData} = useContext(userDataContext)
let location = useLocation()
  return (
   <>
    <ToastContainer/>
    {userData && <Nav/>}

   <Routes>
  <Route path='/login' 
        element={userData ? (<Navigate to={location.state?.from || "/"}/> ) 
        : (<Login/>)
          }/>

        <Route path='/signup' 
        element={userData ? (<Navigate to={location.state?.from || "/"}/> ) 
        : (<Registration/>)}/>

        <Route path='/' 
        element={userData ? <Home/> : <Navigate to="/login" state={{from: location.pathname}} /> }/>
      
        <Route path='/about' 
        element={userData ? <About/> : <Navigate to="/login" state={{from: location.pathname}} /> }/>

        <Route path='/collection' 
        element={userData ? <Collections/> : <Navigate to="/login" state={{from: location.pathname}} /> }/>
          <Route path='/product' 
        element={userData ? <Product/> : <Navigate to="/login" state={{from: location.pathname}} /> }/>

        <Route path='/contact' 
        element={userData ? <Contact/> : <Navigate to="/login" state={{from: location.pathname}} /> }/>

 <Route path='/productdetail/:productId' 
        element={userData ? <ProductDetail/> : <Navigate to="/login" state={{from: location.pathname}} /> }/>

           <Route path='/cart' 
        element={userData ? <Cart/> : <Navigate to="/login" state={{from: location.pathname}} /> }/>

 <Route path='/placeorder' 
        element={userData ? <PlaceOrder/> : <Navigate to="/login" state={{from: location.pathname}} /> }/>


<Route path='/order' 
        element={userData ? <Order/> : <Navigate to="/login" state={{from: location.pathname}} /> }/>

<Route path='/rate/:productId' 
        element={userData ? <RateProduct/> : <Navigate to="/login" state={{from: location.pathname}} /> }/>

        <Route path='*' element={<NotFound/>}/>

   </Routes>
    {userData && <Ai />}
   </>
  )
}

export default App
