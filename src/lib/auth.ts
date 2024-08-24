import { COOKIES, JWT_SECRET } from '@/lib/constants'
import { jwtVerify, SignJWT } from 'jose'
import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'

export async function verifyAdmin() {
    const cookie = cookies().get(COOKIES.SESSION)?.value
    const alcualURL = headers().get('pathname') ?? '/admin'

    if (!cookie) redirect('/login?redirect=' + alcualURL)
    let user: {
        id: string
        name: string
        username: string
        admin: boolean
    }
    try {
        const payload = await jwtVerify<{
            id: string
            name: string
            username: string
            admin: boolean
            exp: number
        }>(cookie, JWT_SECRET)
        user = payload.payload
    } catch (error) {
        if (
            error instanceof Error &&
            (error.message.includes('JWS Protected Header is invalid') ||
                error.message.includes('signature verification failed') ||
                error.message.includes('timestamp check failed'))
        ) {
            cookies().delete(COOKIES.SESSION)
            redirect('/labs')
        } else throw error
    }
    if (!user.admin) return redirect('/labs')
    return user
}

export async function getVerifiedUser() {
    const cookie = cookies().get(COOKIES.SESSION)?.value
    const alcualURL = headers().get('pathname') ?? '/'

    if (!cookie) redirect('/login?redirect=' + alcualURL)
    let user: {
        id: string
        name: string
        username: string
        admin: boolean
    }
    try {
        const payload = await jwtVerify<{
            id: string
            name: string
            username: string
            admin: boolean
            exp: number
        }>(cookie, JWT_SECRET)
        const hoursleft =
            (payload.payload.exp - Math.floor(Date.now() / 1000)) / 3600
        if (hoursleft < 3) {
            const r = await refreshToken(cookie)
            if (r) {
                cookies().set({
                    expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
                    name: COOKIES.SESSION,
                    value: r.token,
                })
                return payload.payload
            }
        }
        return payload.payload
    } catch (error) {
        if (
            error instanceof Error &&
            (error.message.includes('JWS Protected Header is invalid') ||
                error.message.includes('signature verification failed') ||
                error.message.includes('timestamp check failed'))
        ) {
            cookies().delete(COOKIES.SESSION)
        }
        redirect('/login?redirect=' + alcualURL)
    }
}

export async function getPosibleUser(cookie?: string) {
    cookie ??= cookies().get(COOKIES.SESSION)?.value

    if (!cookie) return null
    let user: {
        id: string
        name: string
        username: string
        admin: boolean
    }
    try {
        const payload = await jwtVerify<{
            id: string
            name: string
            username: string
            admin: boolean
            exp: number
        }>(cookie, JWT_SECRET)
        const hoursleft =
            (payload.payload.exp - Math.floor(Date.now() / 1000)) / 3600
        if (hoursleft < 3) {
            const r = await refreshToken(cookie)
            if (r) {
                cookies().set({
                    expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
                    name: COOKIES.SESSION,
                    value: r.token,
                })
                return payload.payload
            }
        }
        return payload.payload
    } catch (error) {
        if (
            error instanceof Error &&
            (error.message.includes('JWS Protected Header is invalid') ||
                error.message.includes('signature verification failed') ||
                error.message.includes('timestamp check failed'))
        ) {
            cookies().delete(COOKIES.SESSION)
        }
        return null
    }
}

async function refreshToken(cookie: string) {
    if (!cookie) return null
    let user:
        | {
              id: string
              name: string
              username: string
              admin: boolean
          }
        | undefined
    let token = ''
    try {
        const payload = await jwtVerify<{
            id: string
            name: string
            username: string
            admin: boolean
            exp: number
        }>(cookie, JWT_SECRET)
        let user = payload.payload
        const expires = new Date()
        expires.setDate(expires.getDate() + 1)
        token = await new SignJWT({
            id: user.id,
            name: user.name,
            username: user.username,
            admin: user.admin,
            exp: expires.getTime(),
        })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('1d')
            .sign(JWT_SECRET)

        user = payload.payload
    } catch (error) {
        return null
    }
    if (!user) return null
    return {
        user,
        token,
    }
}
