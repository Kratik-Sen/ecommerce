import React, { useContext, useEffect, useRef, useState } from 'react'
import ai from "../assets/ai.png"
import { shopDataContext } from '../context/ShopContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import open from "../assets/open.mp3"
function Ai() {
  let {showSearch , setShowSearch} = useContext(shopDataContext)
  let navigate = useNavigate()
  let [activeAi,setActiveAi] = useState(false)
  let [showAi,setShowAi] = useState(false)
  const openingSound = useRef(null)

  useEffect(() => {
    openingSound.current = new Audio(open)
    const timer = setTimeout(() => setShowAi(true), 2000)
    return () => clearTimeout(timer)
  }, [])

 function speak(message){
let utterence=new SpeechSynthesisUtterance(message)
window.speechSynthesis.speak(utterence)
  }

  const startAi = () => {
    const speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!speechRecognition) {
      toast.error("Voice assistant is not supported in this browser")
      return
    }

    const recognition = new speechRecognition()
    recognition.onresult = (e)=>{
    const transcript = e.results[0][0].transcript.trim();
 if(transcript.toLowerCase().includes("search") && transcript.toLowerCase().includes("open") && !showSearch){
      speak("opening search")
      setShowSearch(true) 
      navigate("/collection")
    }
    else if(transcript.toLowerCase().includes("search") && transcript.toLowerCase().includes("close") && showSearch){
      speak("closing search")
      setShowSearch(false) 
      
    }
     else if(transcript.toLowerCase().includes("collection") || transcript.toLowerCase().includes("collections") || transcript.toLowerCase().includes("product") || transcript.toLowerCase().includes("products")){
      speak("opening collection page")
      navigate("/collection")
    }
    else if(transcript.toLowerCase().includes("about") || transcript.toLowerCase().includes("aboutpage") ){
      speak("opening about page")
      navigate("/about")
      setShowSearch(false) 
    }
     else if(transcript.toLowerCase().includes("home") || transcript.toLowerCase().includes("homepage") ){
      speak("opening home page")
      navigate("/")
      setShowSearch(false) 
    }
     else if(transcript.toLowerCase().includes("cart")  || transcript.toLowerCase().includes("kaat")  || transcript.toLowerCase().includes("caat")){
      speak("opening your cart")
      navigate("/cart")
      setShowSearch(false) 
    }
    else if(transcript.toLowerCase().includes("contact")){
      speak("opening contact page")
      navigate("/contact")
      setShowSearch(false) 
    }
   
     else if(transcript.toLowerCase().includes("order") || transcript.toLowerCase().includes("myorders") || transcript.toLowerCase().includes("orders") || transcript.toLowerCase().includes("my order")){
      speak("opening your orders page")
      navigate("/order")
      setShowSearch(false) 
    }
    else{
      toast.error("Try Again")
    }

  }
    recognition.onend=()=>{
     setActiveAi(false)
    }
    recognition.start()
    openingSound.current?.play()
    setActiveAi(true)
  }

  if (!showAi) {
    return null
  }

  return (
    <div className='fixed lg:bottom-[18px] md:bottom-[34px] bottom-[96px] left-[12px] md:left-[2%] flex items-end gap-[6px] z-20 animate-[fadeIn_.25s_ease-out]' onClick={startAi}>
      <img src={ai} alt="" className={`w-[64px] md:w-[74px] cursor-pointer ${activeAi ? 'translate-x-[8%] translate-y-[-8%] scale-110 ' : 'translate-x-[0] translate-y-[0] scale-100'} transition-transform` } style={{
        filter: ` ${activeAi?"drop-shadow(0px 0px 30px #95d5b2)":"drop-shadow(0px 0px 20px #8f968f)"}`
      }}/>
      <div className='max-w-[150px] md:max-w-[170px] bg-[#fffaf0f2] border-[1px] border-[#b8c0ba] rounded-lg px-[9px] py-[6px] text-[10px] md:text-[11px] leading-tight text-[#1f2a24] shadow-md shadow-[#8f968f] mb-[10px]'>
        Click me and say "open collection page"
      </div>
    </div>
  )
}

export default Ai
