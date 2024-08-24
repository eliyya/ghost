import { MiddlewareConfig, NextRequest, NextResponse } from 'next/server'
import { COOKIE, JWT_SECRET } from './lib/constants'
import { jwtVerify } from 'jose'

function redirect(request: NextRequest, url: string) {
    return injectPathname(
        request,
        NextResponse.redirect(new URL(url, location.origin)),
    )
}

function injectPathname(request: NextRequest, response: NextResponse) {
    response.headers.set('pathname', request.nextUrl.pathname)
    return response
}

export async function middleware(request: NextRequest) {
    const authorization = request.cookies.get(COOKIE.SESSION)?.value
    const next = () => injectPathname(request, NextResponse.next())
    if (request.nextUrl.pathname.startsWith('/admin')) {
        if (request.nextUrl.pathname === '/admin/new') {
            const count: { count: number } = await fetch(
                new URL('/api/labs/count', request.nextUrl),
            ).then(res => res.json())
            if (count.count !== 0) {
                const response = NextResponse.redirect(
                    new URL('/login', request.nextUrl),
                )
                response.headers.set('pathname', request.nextUrl.pathname)
                return response
            } else return next()
        }
        if (!authorization) {
            const response = NextResponse.redirect(
                new URL('/login', request.nextUrl),
            )
            response.headers.set('pathname', request.nextUrl.pathname)
            return response
        }
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
            }>(authorization, JWT_SECRET)
            user = payload.payload
        } catch (error) {
            if (
                error instanceof Error &&
                (error.message.includes('JWS Protected Header is invalid') ||
                    error.message.includes('signature verification failed') ||
                    error.message.includes('timestamp check failed'))
            ) {
                const response = redirect(request, '/login')
                response.cookies.delete(COOKIE.SESSION)
                return response
            } else throw error
        }
        if (!user.admin) {
            const response = redirect(request, '/')
            return response
        } else return next()
    }

    // if (authorization) {
    //     const u = await getPosibleUser(authorization)
    //     console.log(u)
    // }
    // pass pathname as header
    return next()
}

export const config: MiddlewareConfig = {
    matcher: ['/user/:path*', '/admin/:path*', '/login/:path*', '/labs/:path*'],
}
