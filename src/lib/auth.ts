import { COOKIE, JWT_SECRET } from "@/lib/constants"
import { jwtVerify } from "jose"
import { cookies, headers } from "next/headers"
import { redirect } from "next/navigation"

export async function verifyAdmin() {
    const cookie = cookies().get(COOKIE.SESSION)?.value
    const alcualURL = headers().get('pathname') ?? '/admin'
    
    if (!cookie) redirect('/login?redirect=' + alcualURL)
    let user: {
        id: string,
        name: string,
        username: string,
        admin: boolean,
    }
    try {
        const payload = await jwtVerify<{
            id: string,
            name: string,
            username: string,
            admin: boolean,
            exp: number
        }>(cookie, JWT_SECRET)
        user = payload.payload
    } catch (error) {
        if (error instanceof Error && (
            error.message.includes('JWS Protected Header is invalid') ||
            error.message.includes('signature verification failed') ||
            error.message.includes('timestamp check failed')
        )) {
            cookies().delete(COOKIE.SESSION)
            redirect('/labs')
        }
        else throw error
    }
    if (!user.admin) return redirect('/labs')
    return user
}