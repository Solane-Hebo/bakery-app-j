"use client"

import { useEffect, useState } from "react"
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react"
import Link from "next/link"


export default function ContactPage() {
        const [form, setForm] = useState({
          name: "",
          email: "",
          message: "",
        })
        const [loading, setLoading] = useState(false)
        const [formErrors, setFormErrors] = useState<{
            name?: string[]
            email?: string[]
            message?: string[]
          }>({})
          
          const [serverError, setServerError] = useState("")
          const [success, setSuccess] = useState("")

          useEffect(() => {
            if (success) {
              const timer = setTimeout(() => {
                setSuccess("")
              }, 3000)
          
              return () => clearTimeout(timer)
            }
          }, [success])
          

        async function handleSubmit(e: React.FormEvent) {
            e.preventDefault()
        
            setFormErrors({})
            setServerError("")
            setSuccess("")
            setLoading(true)


              try {
                const res = await fetch("/api/contact", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(form),
                })
                const data = await res.json()

                if (!res.ok) {
                    if (data.issues?.fieldErrors) {
                      setFormErrors(data.issues.fieldErrors)
                    } else {
                      setServerError(data.error || "Something went wrong")
                    }
                    return
                  }
              
                setSuccess(data.success)
                setForm({ name: "", email: "", message: "" })
              
             } catch (error) {
                setServerError("Network error. Please try again.")
              } finally {
                setLoading(false)
              }
            }
              
    return (
     <div className="bg-white">   
        <section className="mx-auto max-w-6xl px-4 py-20 bg-white">
            <div className="text-center mb-16 bg-white">

            <div className="flex items-center gap-2 justify-center center mb-10">
                    <img
                        src="/cupcake-logo.png"
                        alt="Bakery logo"
                        className="h-10 w-16 object-contain"
                    />
                    <h1 className="text-4xl font-extrabold text-[#553030] text-center">
                      Vist Us 
                    </h1>
                </div>
                <p className="mt-6 text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
                        Step into our world of handcrafted pastries and freshly baked delights.
                        We look forward to welcoming you.
                </p>
                <div className="mt-6 flex justify-center">
                   <div className="h-px w-28 bg-gradient-to-r from-transparent via-[#c6a75e] to-transparent" />
                </div>
            </div>
    
            <div className="grid gap-10 md:grid-cols-2">
             <div className="rounded-2xl bg-white shadow-lg p-8">
                <div className="grid grid-cols-2 gap-6">
    
                    <InfoBox icon={<Phone size={18} />} title="Phone" content={
                       <Link
                            href="tel:+46123456789"
                            className="hover:text-[#4a2c2a] transition underline-offset-4 hover:underline"
                            >
                            +46 123 456 789
                        </Link> } />

                    <InfoBox icon={<Mail size={18}/>} title="Email" content={
                        <Link
                            href="mailto:info@bakery.com"
                            className="hover:text-[#4a2c2a] transition underline-offset-4 hover:underline"
                            >
                            info@bakery.com
                        </Link>
                     }/>
        
                    <InfoBox icon={<MessageCircle size={18}/>}title="WhatsApp" content={
                    <Link
                        href="https://wa.me/46123456789"
                        target="_blank"
                        className="hover:text-[#4a2c2a] transition underline-offset-4 hover:underline"
                        >
                        Chat with us
                    </Link>
                }/>
                <InfoBox icon={<MapPin size={18}/>} title="Address" content="Main Street 10, Stockholm" />
    
                <div className="col-span-2">
                    <InfoBox icon={<Clock size={18}/>}
                        title="Opening Hours"
                        content={
                        <>
                        Mon – Fri: 08:00 – 18:00 <br />
                        Sat: 09:00 – 16:00 <br />
                        Sun: Closed
                        </>
                    }
                    />
                  </div>
                </div>
            </div>
       

            <div className="rounded-2xl bg-[#978282]/90 shadow-lg p-8 text-[#553030] ">
                <div className="flex items-center gap-2 mb-10">
                    <img
                        src="/cupcake-logo.png"
                        alt="Bakery logo"
                        className="h-8 w-16 object-contain"
                    />
                    <h1 className="text-2xl font-extrabold text-[#553030] text-center">
                      Get In Touch 
                    </h1>
                </div>
    
                <form onSubmit={handleSubmit} className="space-y-5">
                  {serverError && (
                        <p className="text-red-500 bg-red-200 text-center px-3 py-2 rounded-lg">
                            {serverError}
                        </p>
                        )}
                               
                    {success && (
                        <p className="text-white bg-green-600 text-center px-3 py-2 rounded-lg transition-opacity duration-300">
                            {success}
                        </p>
                    )}
                    <div >
                        <label className="block mb-1 font-medium">Name</label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={(e)=> setForm({ ...form, name: e.target.value }) }
                            className="w-full rounded-3xl border-transparent  bg-white p-3 focus:ring-2 focus:ring-[#553030] border "
                            placeholder="Your name"
                        />
                         {formErrors.name && (
                            <p className="text-red-500 text-sm mt-1">
                              {formErrors.name[0]}
                            </p>
                         )}
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">Email</label>
                        <input
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm({...form, email: e.target.value})}
                            className="w-full rounded-3xl border p-3 focus:ring-2 bg-white border-transparent focus:ring-[#553030]"
                            placeholder="Your email"
                        />
                      {formErrors.email && (
                        <p className="text-red-500 text-sm mt-1">
                         {formErrors.email[0]}
                        </p>
                      )}
                    </div>
        
                    <div>
                        <label className="block mb-1 font-medium">Message</label>
                        <textarea
                            rows={4}
                            value={form.message}
                            onChange={(e) => setForm({...form, message: e.target.value}) }
                            className="w-full rounded-3xl border p-3 focus:ring-2 focus:ring-[#553030] border-transparent bg-white"
                            placeholder="Your message"
                        />
                        {formErrors.message && (
                          <p className="text-red-500 text-sm mt-1">
                            {formErrors.message[0]}
                          </p>
                    )}
                    </div>

                       
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-3xl bg-[#553030] py-3 font-semibold text-white hover:bg-[#3e2424] transition"
                    >
                         {loading ? "Sending..." : "Send Message"}
                    </button>
    
                </form>
              </div>
            </div>
        </section>
     </div>
    )
  }
  
  function InfoBox({
    title,
    content,
    icon,
  
  }: {
    title: string
    content: React.ReactNode
    icon:  React.ReactNode
  }) {
    return (
      <div className="rounded-xl border border-transparent p-5 hover:shadow-md transition  bg-[#978282]/90 text-[#553030] text-center">
         <div  className="flex justify-center items-center mb-2">
           {icon}
         </div>
        <h3 className="font-semibold text-[#553030] mb-2">
          {title}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed">
          {content}
        </p>
      </div>
   
    )
  }

  