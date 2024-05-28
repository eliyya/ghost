import type { NextRequest } from 'next/server'
import { prisma } from '@/db'

export async function middleware(request: NextRequest) {
    console.log(request.nextUrl.pathname);
    
    if (request.nextUrl.pathname === '/labs') {
        const labs = await prisma.labs.findMany({})
        if (!labs.length) return Response.redirect(new URL('/labs/null', request.nextUrl))
        return Response.redirect(new URL('/labs/'+labs[0].id, request.nextUrl))
    }
}

export const config = {
    matcher: '/(labs.*)',
}