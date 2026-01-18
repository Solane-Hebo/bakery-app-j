"use client";

import Link from "next/link";
import {
   Home,
   Wheat,
   NotebookPen,
   Factory,
   ShoppingCart,
   Settings,
   UserRound,
   LogOut,
   ShoppingBag,
   X,
} from "lucide-react";

interface AdminSidebarProps {
    open: boolean;
    onClose: () => void;
  }

export default function AdminSidebar({ open, onClose}: AdminSidebarProps) {
  return (
    <>
    {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}
    <aside 
        className={`
          fixed md:static top-0 left-0 z-50
          w-64 min-h-screen p-6 flex flex-col
          bg-[#553030] text-white shadow-lg
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
         <button
          onClick={onClose}
          className="md:hidden self-end mb-4 opacity-80 hover:opacity-100"
        >
          <X size={22} />
        </button>
    
      <div className="flex flex-col items-center gap-3 mb-6">
        <img className="h-24" src="/bakery logo.png" alt="Bakery logo" />
      </div>

      <hr className="border-white/40 mb-10" />

      <nav className="flex-1 flex flex-col space-y-4">
        <SidebarLink href="/admin" icon={<Home size={18} />} label="Dashboard" />

        <SidebarLink
            href="/admin/products"
            icon={<ShoppingBag size={18} />}
            label="Products"
        />

        <SidebarLink
            href="/admin/materials"
            icon={<Wheat size={18} />}
            label="Raw Materials"
        />

        <SidebarLink
            href="/admin/recipes"
            icon={<NotebookPen size={18} />}
            label="Recipes"
        />

        <SidebarLink
            href="/admin/sales"
            icon={<ShoppingCart size={18} />}
            label="Sales"
        />

       <SidebarLink
            href="/admin/production-history"
            icon={<Factory size={18} />}
            label="History"
        />

       <SidebarLink
            href="/admin/manage-staff"
            icon={<UserRound size={18} />}
            label="Manage staff"
        />
  
        <SidebarLink
            href="/admin/settings"
            icon={<Settings size={18} />}
            label="Settings"
        />
        </nav>

    
      <button className="flex items-center justify-center gap-2 text-sm opacity-80 hover:opacity-100 hover:underline transition   mt-10 ">
        <LogOut size={18} />
        Log out
      </button>
    </aside>
  </>
  );
}

function SidebarLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex text-[#F5E1D8] items-center gap-3 px-4 py-2 rounded-xl hover:bg-white/15 hover:scale-105 transition-transform">
      {icon}
      {label}
    </Link>
  );
}
