import React from 'react'
import contact from "../assets/contact.jpg"
import { FiArrowRight, FiBriefcase, FiHelpCircle, FiMail, FiMessageCircle, FiPhone } from "react-icons/fi"
import { BiStoreAlt } from "react-icons/bi"

function Contact() {
  const contactItems = [
    { title: "Our Store", text1: "12345, Random Station", text2: "Random City, State, India", icon: BiStoreAlt },
    { title: "Call Us", text1: "+91 98765 43210", text2: "Mon - Sat, 9:00 AM - 6:00 PM", icon: FiPhone },
    { title: "Email Us", text1: "support@hdtraders.com", text2: "We reply within 24 hours", icon: FiMail },
    { title: "Careers at HD Traders", text1: "Learn more about our teams and job openings", text2: "View Open Positions", icon: FiBriefcase }
  ]
  const supportItems = [
    { title: "Live Chat", text: "Chat with our support team for quick assistance.", action: "Start Chat", icon: FiMessageCircle },
    { title: "Help Center", text: "Find answers to common questions and get the help you need.", action: "Visit Help Center", icon: FiHelpCircle },
    { title: "Send us a Message", text: "Fill out the form and we will get back to you.", action: "Send Message", icon: FiMail }
  ]

  return (
    <main className='min-h-screen overflow-hidden bg-[linear-gradient(135deg,#f8f4e8_0%,#eef3ea_52%,#e1e7df_100%)] px-[18px] pb-[110px] pt-[112px] text-[#1f2a24] md:px-[34px]'>
      <div className='pointer-events-none fixed inset-0 opacity-35 [background-image:radial-gradient(#95d5b2_1px,transparent_1px)] [background-size:34px_34px]'></div>
      <section className='relative z-[1] mx-auto grid max-w-[1240px] gap-[44px] lg:grid-cols-[1.05fr_1fr] lg:items-center'>
        <div className='relative overflow-hidden rounded-2xl shadow-2xl shadow-[#8f968f44]'>
          <img src={contact} alt="Contact HD Traders" className='h-[360px] w-full object-cover md:h-[520px]' />
          <div className='absolute bottom-[28px] left-[28px] flex max-w-[330px] items-center gap-[16px] rounded-xl bg-[#4f8f67e8] p-[18px] text-[#fffaf0] shadow-xl shadow-[#1f2a2444]'>
            <span className='flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-full border-[2px] border-[#fffaf0] text-[30px]'><FiHeadsetFallback /></span>
            <div>
              <h3 className='font-bold'>We're Here to Help!</h3>
              <p className='mt-[6px] text-[13px] leading-relaxed text-[#fffaf0df]'>Our team will get back to you as soon as possible.</p>
            </div>
          </div>
        </div>

        <div>
          <p className='text-[13px] font-bold uppercase tracking-[4px] text-[#2f6f4e]'>Get In Touch</p>
          <h1 className='mt-[22px] text-[56px] leading-none md:text-[76px]'>Contact <span className='text-[#2f6f4e]'>Us</span></h1>
          <p className='mt-[18px] max-w-[520px] text-[17px] leading-relaxed text-[#59645d]'>We'd love to hear from you. Reach out to us for any queries, support, or business inquiries.</p>

          <div className='mt-[28px] space-y-[2px]'>
            {contactItems.map(({ title, text1, text2, icon: Icon }, index) => (
              <div key={title} className={`flex gap-[18px] py-[18px] ${index > 0 ? "border-t-[1px] border-[#d8ded8]" : ""}`}>
                <span className='flex h-[62px] w-[62px] shrink-0 items-center justify-center rounded-xl bg-[#e1f0e6] text-[30px] text-[#2f6f4e]'><Icon /></span>
                <div>
                  <h3 className='text-[17px] font-bold text-[#2f6f4e]'>{title}</h3>
                  <p className='mt-[5px] text-[14px] text-[#59645d]'>{text1}</p>
                  <p className={`mt-[4px] text-[14px] ${index === 3 ? "font-bold text-[#2f6f4e]" : "text-[#59645d]"}`}>{text2} {index === 3 && <FiArrowRight className='ml-[6px] inline' />}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className='relative z-[1] mx-auto mt-[44px] grid max-w-[1120px] gap-[22px] rounded-2xl border-[1px] border-[#e0d9c9] bg-[#fffaf0e8] p-[24px] shadow-xl shadow-[#8f968f22] md:grid-cols-3 md:p-[28px]'>
        {supportItems.map(({ title, text, action, icon: Icon }, index) => (
          <div key={title} className={`flex gap-[18px] ${index > 0 ? "md:border-l-[1px] md:border-[#d8ded8] md:pl-[26px]" : ""}`}>
            <span className='flex h-[62px] w-[62px] shrink-0 items-center justify-center rounded-full bg-[#e1f0e6] text-[30px] text-[#2f6f4e]'><Icon /></span>
            <div>
              <h3 className='font-bold text-[#2f6f4e]'>{title}</h3>
              <p className='mt-[7px] text-[14px] leading-relaxed text-[#59645d]'>{text}</p>
              <button type='button' className='mt-[10px] inline-flex items-center gap-[8px] text-[14px] font-bold text-[#2f6f4e]'>{action} <FiArrowRight /></button>
            </div>
          </div>
        ))}
      </section>
    </main>
  )
}

function FiHeadsetFallback() {
  return <FiPhone />
}

export default Contact
