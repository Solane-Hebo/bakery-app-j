"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Search, ChevronDown, Menu } from "lucide-react";

interface AdminHeaderProps {
  onMenuClick: () => void;
}

export default function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const pathname = usePathname();
  const [pageTitle, setPageTitle] = useState("Admin");
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; avatar?: string } | null>(null);

  useEffect(() => {

    fetch("/api/profile/me")
      .then(res => res.json())
      .then(setUser)
      .catch(() => setUser(null));
  }, []);

  useEffect(() => {
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
    setPageTitle(routeTitles[pathname] || "Admin");
  }, [pathname]);

  return (
    <header className="flex items-center justify-between bg-white px-4 sm:px-6 py-4 text-[#553030] shadow-sm border-b">
  
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="md:hidden p-2 rounded-md hover:bg-gray-100">
          <Menu size={22} />
        </button>
        <div>
          <h1 className="text-2xl font-bold">{pageTitle}</h1>
          <p className="text-sm opacity-80">Welcome, {user?.name || "Admin"}</p>
        </div>
      </div>

      {/* User button */}
      <div className="relative">
        <button
          onClick={() => setOpen(o => !o)}
          className="flex items-center gap-2 bg-[#553030] text-white px-3 py-2 rounded-md hover:bg-[#553030]/80"
        >
          <div className="w-9 h-9 rounded-full bg-white text-[#553030] flex items-center justify-center">
            <img
              src={user?.avatar || "/avatar-placeholder.png"}
              alt="avatar"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <span className="hidden sm:block font-medium">{user?.name || "Admin"}</span>
          <ChevronDown size={16} />
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-44 bg-white border rounded-md shadow-lg text-sm z-50">
            <a href="/admin/settings/profile" className="block px-4 py-2 hover:bg-gray-100">Profile</a>
            <div className="border-t my-1" />
            <button
              className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
              onClick={async () => {
                await fetch("/api/auth/logout", { method: "POST" });
                window.location.href = "/login"; // redirect to login
              }}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
