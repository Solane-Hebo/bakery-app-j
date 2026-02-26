import { requireAuth } from "@/lib/requireAuth"

export async function requireRole(roles: Array<"admin" | "staff" | "viewer">) {
  const auth = await requireAuth()
  if (!auth.ok) return auth

  const role = auth.payload.role as string | undefined
  if (!role || !roles.includes(role as any)) {
    return { ok: false as const, status: 403 as const, message: "Forbidden" }
  }

  return auth
}
