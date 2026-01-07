'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

const navLinks = [
    {href: '/', label: 'Menu'},
    {href: '/contact', label: 'Contact'},
    {href: '/about', label: 'About us'}
]

export function Navbar() {
    const pathname = usePathname()
    const [open, setOpen] = useState(false)

    useEffect(() => {
     setOpen(false)
    },[pathname])

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#978282] backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6 ">
        
        <Link href="/" className="flex items-center gap-2" >
         <span className="text-lg font-semibold tracking-wide text-white">Bakery</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map((l) => (
                <Link
                 key={l.href}
                 href={l.href}
                 className={`text-sm font-medium text-white/80 hover:text-white ${
                    pathname === l.href ? 'text-white' : ''
                 }`}
                 >
                    {l.label}
                </Link>
            ))}

            <Link
             href="/pages/loginPage"
             className={`rounded-md px-3 py-2 text-sm font-semibold text-white hover:bg-white/10 ${
             pathname === '/pages/loginPage' ? 'bg-white/10' : ''
            } `}
            >
                Login
            </Link>
        </nav>

        {/* Mobile menu button */}
        <button
         type="button"
         className="inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-white/10 md:hidden"
         aria-label="open menu"
         aria-expanded={open}
         onClick={() => setOpen((v) => !v)}
        >
            <span className="text-xl">{open ? '✕' : '☰'}</span>
        </button>
      </div>
        {/* Mobile menu */}
        {open && (
            <div className="border-t border-white/10 bg-[#978282] md:hidden">
                <div className="mx-auto max-w-6xl px-4 py-3">
                    <div className="flex flex-col gap-2">
                        {navLinks.map((l) => (
                            <Link
                             key={l.href}
                             href={l.href}
                            className={`rounded-md px-3 py-2 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white ${
                             pathname === l.href ? 'bg-white/10' : ''
                            }`}
                            >
                                {l.label}
                            </Link>
                        ))}
                        <Link 
                         href="/pages/loginPage"
                         className={`rounded-md px-3 py-2 text-sm font-semibold text-white hover:bg-white/10 ${
                         pathname === '/pages/loginPage' ? 'bg-white/10' : ''
                         } `}
                        >
                            Login
                        </Link>
                    </div>
                </div>
            </div>
        )}

    </header>
  )
}
