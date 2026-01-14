import { jwtVerify, SignJWT } from 'jose'
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

