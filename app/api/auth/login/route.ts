import { connectDB } from "@/lib/db"
import { NextResponse } from "next/server"
import bcrypt from 'bcryptjs'
import { z }from "zod"
import { AUTH_COOKIE_NAME, authCookieOptions, signToken } from "@/lib/auth"
import { loginSchema } from "@/lib/validators/login"
import User from "@/app/models/User"

export const runtime = 'nodejs'

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const parsed = loginSchema.safeParse(body)

        if (!parsed.success) {
            return NextResponse.json(
                { 
                    status: 'error', 
                    message: 'Invalid input', 
                    issues: z.treeifyError(parsed.error)
                },
                { status: 400},
            )
        }

        const { email, password } = parsed.data
        await connectDB()

        const user = await User.findOne({ email})
        if(!user) return NextResponse.json({ 
            status: 'error', 
            message: 'Invalid email or password'}, {
                status: 401
            })

            const ok = await bcrypt.compare(password, user.password)
            if(!ok) return NextResponse.json({
                status: 'error',
                message: 'Invalid email or password'
            }, { status: 401}
        )

        const token = await signToken({ sub: user._id.toString(), email: user.email, name: user.name })

        const res = NextResponse.json({ status: 'ok', message: 'Logged in'}, { status: 200})
        res.cookies.set(AUTH_COOKIE_NAME, token, authCookieOptions())
        return res
     }  catch (error) {
        return NextResponse.json(
        {
            status: 'error', 
            message: 'Login failed', 
            error: String(error)},
        { status: 500},
    )
    }
    }
