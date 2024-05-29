import { COOKIE } from "@/constants"
import { NextRequest, NextResponse } from "next/server"

export async function middleware(request: NextRequest) {
    if (request.nextUrl.pathname === "/logout") {
        request.cookies.delete(COOKIE.SESSION)
        return NextResponse.redirect(new URL("/login", request.nextUrl.origin).toString())
    }
    return NextResponse.next()
}

export const config = {
    matcher: '/(.*)',
}