"use client";

import Newsletter from "./Newsletter";
import Link from "next/link";
import { Youtube, Instagram, Facebook} from "lucide-react";
import { FaTiktok } from "react-icons/fa";
import { SiTelegram } from "react-icons/si";


export default function Footer() {
  return (
    <footer className=" bg-[#978282] text-white  border-transparent w-full">
     
      <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8 text-sm  text-white">
       <div className="flex flex-col items-center md:items-start text-center md:text-start">
          <img src="/bakery logo.png" alt="Bakerylogo" className="h-35 mb-1 block  rounded-2xl" />
          <h3 className="font-semibold text-lg mt-0 mb-1 mx-4">Contact us</h3>
          <p className="mx-4">Email: jebelsani@gmail.com</p>
          <p className="mx-4">Tele: 0952446464</p>
        </div>

        <div className="text-center space-y-4 md:mt-8">
          <h3 className="font-semibold text-3xl text-center font-dancing mb-2">Address</h3>
          <p>Shashamane, Al-Iman Masgid</p>
          <p>Telefon: 0952446464</p>
          

        </div>

        <div>
          <h3 className="font-semibold text-3xl text-center font-dancing mb-2">Follow us</h3>
            <div className="flex gap-2 justify-center text-white ">
              <a href="https://t.me/bilbarakabekary" target="_blank" rel="noopener noreferrer" aria-label="Telegram">
                 <SiTelegram className="w-10 h-10 hover:text-blue-500 transition border border-transparent bg-[#553030] p-2 rounded-full" />
                </a>
                <a href="https://facebook.com" aria-label="Facebook">
                    <Facebook className="w-10 h-10 hover:text-blue-600 transition border p-2 rounded-full bg-[#553030] border-transparent " />
                </a>
                <a href="https://instagram.com" aria-label="Instagram ">
                 <Instagram className="w-10 h-10 hover:text-pink-500 transition border p-2 bg-[#553030] rounded-full border-transparent" />
                </a>
                
                <a href="https://tiktok.com" aria-label="TikTok">
                  <FaTiktok className="w-10 h-10 hover:text-black-500 transition border border-transparent bg-[#553030] p-2 rounded-full" />
                </a>
            </div>
            <div className="text-center mt-4">

              <Newsletter />
 
            </div>
        </div>
      </div>
     
      <div className="text-center text-sm text-gray-500 bg-[#F9F9F9] py-4  bg- border-transparent">
        © 2026 Bakery J. All rights reserved.
      </div>
    </footer>
  );
}


