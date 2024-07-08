import { COOKIE } from "@/lib/constants"
import { NextRequest, NextResponse } from "next/server"

export async function middleware(request: NextRequest) {
    if (request.nextUrl.pathname === "/logout") {
        // request.cookies.delete(COOKIE.SESSION)
        const respose = NextResponse.redirect(new URL("/login", request.nextUrl.origin).toString())
        respose.cookies.delete(COOKIE.SESSION)
        return respose
    }
    return NextResponse.next()
}

export const config = {
    matcher: '/(.*)',
}