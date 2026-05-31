import React from 'react'
import Logo from "../assets/logo.png"
import { useNavigate } from 'react-router-dom'
import google from '../assets/google.png'
import { IoEyeOutline } from "react-icons/io5";
import { IoEye } from "react-icons/io5";
import { useState } from 'react';
import { useContext } from 'react';
import { authDataContext } from '../context/AuthContext';
import axios from 'axios';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../../utils/Firebase';
import { userDataContext } from '../context/UserContext';
import Loading from '../component/Loading';

function Login() {
    let [show,setShow] = useState(false)
        let [email,setEmail] = useState("")
        let [password,setPassword] = useState("")
        let {serverUrl} = useContext(authDataContext)
        let {getCurrentUser} = useContext(userDataContext)
        let [loading,setLoading] = useState(false)

    let navigate = useNavigate()

    const handleLogin = async (e) => {
        setLoading(true)
        e.preventDefault()
        try {
            let result = await axios.post(serverUrl + '/api/auth/login',{
                email,password
            },{withCredentials:true})
            console.log(result.data)
            setLoading(false)
            getCurrentUser()
            navigate("/")
            toast.success("User Login Successful")
            
        } catch (error) {
            console.log(error)
            toast.error("User Login Failed")
        }
    }
     const googlelogin = async () => {
            try {
                const response = await signInWithPopup(auth , provider)
                let user = response.user
                let name = user.displayName;
                let email = user.email
    
                const result = await axios.post(serverUrl + "/api/auth/googlelogin" ,{name , email} , {withCredentials:true})
                getCurrentUser()
            navigate("/")
    
            } catch (error) {
                console.log(error)
            }
            
        }
  return (
    <div className='w-[100vw] h-[100vh] bg-[linear-gradient(135deg,#f8f4e8_0%,#e9efe4_52%,#c7d1c8_100%)] text-[#1f2a24] flex flex-col items-center justify-start'>
    <div className='w-[100%] h-[80px] flex items-center justify-start px-[30px] gap-[10px] cursor-pointer' onClick={()=>navigate("/")}>
    <img className='w-[40px]' src={Logo} alt="" />
    <h1 className='text-[22px] font-sans '>OneCart</h1>
    </div>

    <div className='w-[100%] h-[100px] flex items-center justify-center flex-col gap-[10px]'>
        <span className='text-[20px] font-semibold'>Login Page</span>
        <span className='text-[16px]'>Welcome to OneCart, Place your order</span>
       

    </div>
    <div className='max-w-[600px] w-[90%] h-[500px] bg-[#fffaf0cc] border-[1px] border-[#b8c0ba] backdrop:blur-2xl rounded-lg shadow-lg flex items-center justify-center '>
        <form action="" onSubmit={handleLogin} className='w-[90%] h-[90%] flex flex-col items-center justify-start gap-[20px]'>
            <div className='w-[90%] h-[50px] bg-[#c9d0ca] rounded-lg flex items-center justify-center gap-[10px] py-[20px] cursor-pointer' onClick={googlelogin}>
                <img src={google} alt="" className='w-[20px]'/> Login account with Google
            </div>
            <div className='w-[100%] h-[20px] flex items-center justify-center gap-[10px]'>
             <div className='w-[40%] h-[1px] bg-[#b8c0ba]'></div> OR <div className='w-[40%] h-[1px] bg-[#b8c0ba]'></div>
            </div>
            <div className='w-[90%] h-[400px] flex flex-col items-center justify-center gap-[15px]  relative'>
              
                 <input type="text" className='w-[100%] h-[50px] border-[2px] border-[#b8c0ba] backdrop:blur-sm rounded-lg shadow-lg bg-transparent placeholder-[#6d766f] px-[20px] font-semibold' placeholder='Email' required  onChange={(e)=>setEmail(e.target.value)} value={email}/>
                  <input type={show?"text":"password"} className='w-[100%] h-[50px] border-[2px] border-[#b8c0ba] backdrop:blur-sm rounded-lg shadow-lg bg-transparent placeholder-[#6d766f] px-[20px] font-semibold' placeholder='Password' required onChange={(e)=>setPassword(e.target.value)} value={password}/>
                  {!show && <IoEyeOutline className='w-[20px] h-[20px] cursor-pointer absolute right-[5%] bottom-[57%]' onClick={()=>setShow(prev => !prev)}/>}
                  {show && <IoEye className='w-[20px] h-[20px] cursor-pointer absolute right-[5%] bottom-[57%]' onClick={()=>setShow(prev => !prev)}/>}
                  <button className='w-[100%] h-[50px] bg-[#b7e4c7] rounded-lg flex items-center justify-center mt-[20px] text-[17px] font-semibold'>{loading? <Loading/> : "Login"}</button>
                  <p className='flex  gap-[10px]'>You haven't any account? <span className='text-[#4f8f67] text-[17px] font-semibold cursor-pointer' onClick={()=>navigate("/signup")}>Create New Account</span></p>
            </div>
        </form>
    </div>
    </div>
  )
}

export default Login
