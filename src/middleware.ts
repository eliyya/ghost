import { MiddlewareConfig, NextRequest, NextResponse } from 'next/server'
import { COOKIES, HEADERS, JWT_SECRET } from './lib/constants'
import { jwtVerify } from 'jose'
import { root } from '@eliyya/type-routes'

function redirect(request: NextRequest, url: string) {
    return injectPathname(
        request,
        NextResponse.redirect(new URL(url, request.nextUrl)),
    )
}

function injectPathname(request: NextRequest, response: NextResponse) {
    response.headers.set(HEADERS.PATHNAME, request.nextUrl.pathname)
    return response
}

export async function middleware(request: NextRequest) {
    const next = () => injectPathname(request, NextResponse.next())
    if (request.nextUrl.pathname.startsWith(root.admin()))
        return await haandlerAdminRoute(request)
    if (request.nextUrl.pathname.startsWith(root.user()))
        return await handlerUserRoute(request)
    return next()
}

export const config: MiddlewareConfig = {
    matcher: ['/user/:path*', '/admin/:path*', '/login/:path*', '/labs/:path*'],
}

async function haandlerAdminRoute(request: NextRequest) {
    const next = () => injectPathname(request, NextResponse.next())
    if (request.nextUrl.pathname === root.admin.new()) {
        const count: { count: number } = await fetch(
            new URL(root.api.labs.count(), request.nextUrl),
        ).then(res => res.json())
        if (count.count !== 0) {
            const response = NextResponse.redirect(
                new URL(root.login(), request.nextUrl),
            )
            response.headers.set(HEADERS.PATHNAME, request.nextUrl.pathname)
            return response
        } else return next()
    }
    const req = await fetch(new URL(root.api.user(), request.nextUrl))
    if (req.status !== 200) {
        const response = redirect(request, root.login())
        response.cookies.delete(COOKIES.SESSION)
        return response
    }
    const user = await req.json()
    if (user.admin) return next()
    const response = redirect(request, root.login())
    response.cookies.delete(COOKIES.SESSION)
    return response
}

async function handlerUserRoute(request: NextRequest) {
    const authorization = request.cookies.get(COOKIES.SESSION)?.value
    const next = () => injectPathname(request, NextResponse.next())
    if (!authorization) {
        const response = redirect(request, root.login())
        return response
    }
    return await jwtVerify(authorization, JWT_SECRET)
        .then(() => next())
        .catch(error => {
            if (
                !(
                    error instanceof Error &&
                    (error.message.includes(
                        'JWS Protected Header is invalid',
                    ) ||
                        error.message.includes(
                            'signature verification failed',
                        ) ||
                        error.message.includes('timestamp check failed'))
                )
            )
                console.log(error)
            const response = redirect(request, root.login())
            response.cookies.delete(COOKIES.SESSION)
            return response
        })
}
