import { NextRequest, NextResponse } from "next/server"

export async function middleware(request: NextRequest) {
    // pass pathname as header
    const response = NextResponse.next()
    response.headers.set('pathname', request.nextUrl.pathname)
    return response
}

export const config = {
    matcher: '/((?!_next/.*|favicon.ico).*)',
}