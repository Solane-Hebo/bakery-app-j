import { jwtVerify, SignJWT } from 'jose'
import { cookies } from "next/headers";
import { connectDB } from './db';
import User from '@/models/User';


const secret = process.env.JWT_SECRET
if (!secret) {
  throw new Error('JWT_SECRET is not defined in environment variables')
}

const key = new TextEncoder().encode(secret)

export const AUTH_COOKIE_NAME = 'auth_token'

export async function signToken(payload:{ sub: string; email: string; name?: string}) {
 return new SignJWT(payload)
  .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
  .setIssuedAt()
  .setExpirationTime('24h')
  .sign(key)
}

export async function verifyToken(token: string) {
  const { payload } = await jwtVerify(token, key);
  return payload;
}

export function authCookieOptions() {
    return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
    }
}

export async function getAuthUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) return null;

  try {
    const payload = await verifyToken(token);
    await connectDB();
    const user = await User.findById(payload.sub).select("passwordChangedAt");

    if (!user) return null;

    if (
      user.passwordChangedAt &&
      payload.iat &&
      payload.iat * 1000 < user.passwordChangedAt.getTime()
    ) {
      return null;
    }

    return {
      sub: payload.sub as string,
      email: payload.email as string,
      name: payload.name as string | undefined,
    };
  } catch {
    return null;
  }
}

