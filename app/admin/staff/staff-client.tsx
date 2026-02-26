"use client"

import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createStaffSchema } from "@/lib/validators/staff";
import { Plus, RefreshCw, Shield, User, Users, X } from "lucide-react";

type StaffUser = {
  _id: string
  name: string
  email: string
  role: "admin" | "staff" | "viewer"
  isActive: boolean
  createdAt?: string
}

type CreateValues = z.input<typeof createStaffSchema>

export function StaffClient() {
  const [items, setItems] = useState<StaffUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [createOpen, setCreateOpen] = useState(false)
  const [resetOpen, setResetOpen] = useState<StaffUser | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/staff", { cache: "no-store" })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || "Failed to load staff")
      setItems(data.staff ?? [])
    } catch (e: any) {
      setError(e?.message || "Failed to load staff")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

 async function updateUser(id: string, patch: Partial<StaffUser>) {
  setBusyId(id)
  try {
    // Only send allowed fields
    const body: { role?: StaffUser["role"]; isActive?: boolean } = {}

    if (patch.role !== undefined) body.role = patch.role
    if (patch.isActive !== undefined) body.isActive = Boolean(patch.isActive)

    const res = await fetch(`/api/staff/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    const data = await res.json()

    if (!res.ok) throw new Error(data?.message || "Update failed")
    await load()
  } catch (e: any) {
    alert(e?.message || "Update failed")
  } finally {
    setBusyId(null)
  }
}

  const total = items.length
  const activeCount = useMemo(() => items.filter((u) => u.isActive).length, [items])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-[#0F172A]">Staff</h1>
          <p className="mt-1 text-sm text-gray-600">
            Create accounts, change roles, and enable/disable access
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <button
            onClick={load}
            className="inline-flex items-center justify-center gap-2 rounded-xl border bg-white px-4 py-2.5 text-sm font-semibold text-[#553030] hover:bg-gray-50"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>

          <button
            onClick={() => setCreateOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#553030] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            New staff member
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard
          title="Total users"
          value={`${total}`}
          accent="blue"
          icon={<Users className="h-5 w-5" />}
        />
        <StatCard
          title="Active users"
          value={`${activeCount}`}
          accent="green"
          icon={<User className="h-5 w-5" />}
        />
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-white shadow-sm">
        <div className="border-b px-5 py-4">
          <h2 className="text-lg font-bold text-[#0F172A]">Users</h2>
        </div>

        {loading ? (
          <div className="p-6 text-sm text-gray-600">Loading…</div>
        ) : error ? (
          <div className="p-6 text-sm text-red-700">{error}</div>
        ) : items.length === 0 ? (
          <div className="p-6 text-sm text-gray-600">No users yet.</div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-gray-600">
                <tr>
                  <th className="px-5 py-3 font-semibold">Name</th>
                  <th className="px-5 py-3 font-semibold">Email</th>
                  <th className="px-5 py-3 font-semibold">Role</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {items.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50">
                    <td className="px-5 py-4 font-semibold text-[#0F172A]">{u.name}</td>
                    <td className="px-5 py-4 text-gray-700">{u.email}</td>

                    <td className="px-5 py-4">
                      {/* ✅ CHANGE: force select text color */}
                      <select
                        className="rounded-xl border bg-white px-3 py-2 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#553030]/20 disabled:opacity-60"
                        value={u.role}
                        disabled={busyId === u._id}
                        onChange={(e) =>
                          updateUser(u._id, { role: e.target.value as StaffUser["role"] })
                        }
                      >
                        <option value="admin">admin</option>
                        <option value="staff">staff</option>
                        <option value="viewer">viewer</option>
                      </select>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={[
                          "inline-flex rounded-full px-3 py-1 text-xs font-semibold",
                          u.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700",
                        ].join(" ")}
                      >
                        {u.isActive ? "Active" : "Disabled"}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <div className="inline-flex gap-2">
                        <button
                          onClick={() => updateUser(u._id, { isActive: !u.isActive })}
                          disabled={busyId === u._id}
                          className="rounded-xl border px-3 py-2 text-xs font-semibold text-[#553030] hover:bg-gray-50 disabled:opacity-60"
                        >
                          {u.isActive ? "Disable" : "Enable"}
                        </button>

                        <button
                          onClick={() => setResetOpen(u)}
                          className="rounded-xl border px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-50"
                        >
                          Reset password
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {createOpen && (
        <CreateStaffModal
          onClose={() => setCreateOpen(false)}
          onSaved={async () => {
            setCreateOpen(false)
            await load()
          }}
        />
      )}

      {resetOpen && (
        <ResetPasswordModal
          user={resetOpen}
          onClose={() => setResetOpen(null)}
          onSaved={() => setResetOpen(null)}
        />
      )}
    </div>
  )
}

function StatCard({
  title,
  value,
  accent,
  icon,
}: {
  title: string;
  value: string;
  accent: "orange" | "green" | "blue" | "red";
  icon: React.ReactNode;
}) {
  const accentMap: Record<string, string> = {
    orange: "border-l-[#553030]",
    green: "border-l-green-600",
    blue: "border-l-blue-600",
    red: "border-l-red-600",
  }

  return (
    <div className={`rounded-2xl bg-white shadow-sm border-l-4 ${accentMap[accent]} p-5`}>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm text-gray-600">{title}</div>
          <div className="mt-2 text-xl font-extrabold text-[#0F172A]">{value}</div>
        </div>
        <div className="text-[#0F172A]">{icon}</div>
      </div>
    </div>
  )
}

function CreateStaffModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [serverError, setServerError] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateValues>({
    resolver: zodResolver(createStaffSchema),
    defaultValues: { name: "", email: "", password: "", role: "staff" },
  })

  async function onSubmit(values: CreateValues) {
    setServerError("");

    const res = await fetch("/api/staff", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    })

    const data = await res.json()
    if (!res.ok) {
      const msg =
        data?.message ||
        (data?.issues ? "Please fix the highlighted fields." : "Create failed")
      setServerError(msg)
      return
    }

    reset()
    onSaved()
  }

  return (
    <Modal
      title="New staff member"
      subtitle="Create a new account (temporary password)"
      onClose={onClose}
    >
      {serverError ? (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {serverError}
        </div>
      ) : null}

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
        <div>
          <label className="text-sm font-semibold text-[#553030]">Name</label>
          <input
            className="mt-1 w-full rounded-xl border px-3 py-2 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#553030]/20"
            {...register("name")}
          />
          {errors.name && <p className="mt-1 text-xs text-red-700">{errors.name.message}</p>}
        </div>

        <div>
          <label className="text-sm font-semibold text-[#553030]">Email</label>
          <input
            className="mt-1 w-full rounded-xl border px-3 py-2 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#553030]/20"
            {...register("email")}
          />
          {errors.email && <p className="mt-1 text-xs text-red-700">{errors.email.message}</p>}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-semibold text-[#553030]">Temporary password</label>
            <input
              type="password"
              className="mt-1 w-full rounded-xl border px-3 py-2 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#553030]/20"
              {...register("password")}
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-700">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-semibold text-[#553030]">Role</label>
            {/* ✅ CHANGE: force select text color */}
            <select
              className="mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#553030]/20"
              {...register("role")}
            >
              <option value="admin">admin</option>
              <option value="staff">staff</option>
              <option value="viewer">viewer</option>
            </select>
          </div>
        </div>

        <button
          disabled={isSubmitting}
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#553030] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
        >
          <Shield className="h-4 w-4" />
          {isSubmitting ? "Creating..." : "Create account"}
        </button>
      </form>
    </Modal>
  );
}

function ResetPasswordModal({
  user,
  onClose,
  onSaved,
}: {
  user: StaffUser
  onClose: () => void
  onSaved: () => void
}) {
  const [serverError, setServerError] = useState<string>("")

  const schema = z.object({
    newPassword: z.string().min(8, "Minimum 8 characters").max(100),
  })
  type Values = z.infer<typeof schema>

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { newPassword: "" },
  })

  async function onSubmit(values: Values) {
    setServerError("")

    const res = await fetch(`/api/staff/${user._id}/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    })

    const data = await res.json()
    if (!res.ok) {
      setServerError(data?.message || "Reset failed")
      return
    }

    reset()
    onSaved()
  }

  return (
    <Modal title="Reset password" subtitle={user.email} onClose={onClose}>
      {serverError ? (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {serverError}
        </div>
      ) : null}

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
        <div>
          <label className="text-sm font-semibold text-[#553030]">New password</label>
          <input
            type="password"
            className="mt-1 w-full rounded-xl border px-3 py-2 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#553030]/20"
            {...register("newPassword")}
          />
          {errors.newPassword && (
            <p className="mt-1 text-xs text-red-700">{errors.newPassword.message}</p>
          )}
        </div>

        <button
          disabled={isSubmitting}
          type="submit"
          className="rounded-xl bg-[#553030] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
        >
          {isSubmitting ? "Saving..." : "Save new password"}
        </button>
      </form>
    </Modal>
  );
}

function Modal({
  title,
  subtitle,
  onClose,
  children,
}: {
  title: string
  subtitle?: string
  onClose: () => void
  children: React.ReactNode
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-lg">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-extrabold text-[#0F172A]">{title}</h3>
            {subtitle ? <p className="mt-1 text-sm text-gray-600">{subtitle}</p> : null}
          </div>

          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 rounded-xl border bg-white px-3 py-2 text-sm font-semibold text-[#553030] hover:bg-gray-50"
          >
            <X className="h-4 w-4" />
            Close
          </button>
        </div>

        <div className="mt-5">{children}</div>
      </div>
    </div>
  )
}
