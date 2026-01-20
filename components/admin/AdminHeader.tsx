"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Search, User, ChevronDown, Menu } from "lucide-react";

interface AdminHeaderProps {
  username: string;
  avatarUrl?: string;
  onMenuClick: () => void;
}

export default function AdminHeader({
  username,
  avatarUrl,
  onMenuClick,
}: AdminHeaderProps) {
  const pathname = usePathname();
  const [pageTitle, setPageTitle] = useState("Admin");

  const routeTitles: Record<string, string> = {
    "/admin": "Dashboard",
    "/admin/products": "Products",
    "/admin/materials": "Raw Materials",
    "/admin/recipes": "Recipes",
    "/admin/production": "Production",
    "/admin/sales": "Sales",
    "/admin/users": "Staff",
    "/admin/settings": "Settings",
  };

  useEffect(() => {
    setPageTitle(routeTitles[pathname] || "Admin");
  }, [pathname]);

  return (
    <header className="flex items-center justify-between bg-white px-4 sm:px-6 py-4 text-[#553030] shadow-sm border-b">
      {/* Left */}
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-md hover:bg-gray-100"
        >
          <Menu size={22} />
        </button>

        <div>
          <h1 className="text-2xl font-bold">{pageTitle}</h1> 
          <p className="text-sm opacity-80">Welcome, {username}</p>
         
        </div>
      </div>

      {/* Search (hidden on small screens) */}
      <div className="hidden md:flex items-center bg-white rounded-md px-3 py-1 text-gray-600 w-80 border border-[#553030]">
        <Search size={18} className="mr-2" />
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent outline-none w-full text-sm"
        />
      </div>

      {/* User button */}
      <button className="flex items-center gap-2 bg-[#553030] text-white px-3 py-2 rounded-md hover:bg-[#553030]/80">
        <div className="w-9 h-9 rounded-full bg-white text-[#553030] flex items-center justify-center">
          {avatarUrl ? (
            <img src={avatarUrl} alt="avatar" className="rounded-full" />
          ) : (
            <User size={18} />
          )}
        </div>
        <span className="hidden sm:block font-medium">{username}</span>
        <ChevronDown size={16} />
      </button>
    </header>
  );
}
