import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME, verifyToken } from "@/lib/auth";

export async function requireAuth() {
  const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
  if (!token) {
    return { ok: false as const, status: 401 as const, message: "Unauthorized" };
  }

  try {
    const payload = await verifyToken(token);
    return { ok: true as const, payload };
  } catch {
    return { ok: false as const, status: 401 as const, message: "Invalid token" };
  }
}
