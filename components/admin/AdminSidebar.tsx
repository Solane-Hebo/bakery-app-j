"use client";

import { useEffect, useState } from "react";
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

type UserRole = "admin" | "staff" | "viewer";

export default function AdminSidebar({
  open,
  onClose,
}: AdminSidebarProps) {
  const [role, setRole] = useState<UserRole | null>(null);

  // Get logged-in user's role
  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/profile/me", {
          cache: "no-store",
        });

        if (!res.ok) {
          setRole(null);
          return;
        }

        const data = await res.json();

        setRole(data.role);
      } catch {
        setRole(null);
      }
    }

    loadUser();
  }, []);

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
        />
      )}

      <aside
        className={`
          fixed left-0 top-0 z-50
          flex min-h-screen w-64 flex-col
          bg-[#553030] p-6 text-white shadow-lg
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:static md:translate-x-0
        `}
      >
        {/* Close button mobile */}
        <button
          onClick={onClose}
          className="mb-4 self-end opacity-80 hover:opacity-100 md:hidden"
          aria-label="Close menu"
        >
          <X size={22} />
        </button>

        {/* Logo */}
        <div className="mb-6 flex flex-col items-center gap-3">
          <img
            className="h-24"
            src="/bakery logo.png"
            alt="Bakery logo"
          />
        </div>

        <hr className="mb-10 border-white/40" />

        {/* Navigation */}
        <nav className="flex flex-1 flex-col space-y-4">

          {/* ====================== */}
          {/* ADMIN ONLY */}
          {/* ====================== */}

          {role === "admin" && (
            <SidebarLink
              href="/admin"
              icon={<Home size={18} />}
              label="Dashboard"
              onClick={onClose}
            />
          )}

          {/* ====================== */}
          {/* ADMIN + STAFF */}
          {/* ====================== */}

          {(role === "admin" || role === "staff") && (
            <SidebarLink
              href="/admin/products"
              icon={<ShoppingBag size={18} />}
              label="Products"
              onClick={onClose}
            />
          )}

          {(role === "admin" || role === "staff") && (
            <SidebarLink
              href="/admin/sales"
              icon={<ShoppingCart size={18} />}
              label="Sales"
              onClick={onClose}
            />
          )}

          {/* ====================== */}
          {/* ADMIN ONLY */}
          {/* ====================== */}

          {role === "admin" && (
            <>
              <SidebarLink
                href="/admin/materials"
                icon={<Wheat size={18} />}
                label="Raw Materials"
                onClick={onClose}
              />

              <SidebarLink
                href="/admin/recipes"
                icon={<NotebookPen size={18} />}
                label="Recipes"
                onClick={onClose}
              />

              <SidebarLink
                href="/admin/history"
                icon={<Factory size={18} />}
                label="History"
                onClick={onClose}
              />

              <SidebarLink
                href="/admin/staff"
                icon={<UserRound size={18} />}
                label="Staff"
                onClick={onClose}
              />

              <SidebarLink
                href="/admin/settings"
                icon={<Settings size={18} />}
                label="Settings"
                onClick={onClose}
              />
            </>
          )}
        </nav>

        {/* Logout */}
        <button
          onClick={async () => {
            await fetch("/api/auth/logout", {
              method: "POST",
            });

            window.location.href = "/login";
          }}
          className="mt-10 flex items-center justify-center gap-2 text-sm opacity-80 transition hover:opacity-100 hover:underline"
        >
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
  onClick,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 rounded-xl px-4 py-2 text-[#F5E1D8] transition-transform hover:scale-105 hover:bg-white/15"
    >
      {icon}
      {label}
    </Link>
  );
}