import { COOKIE, JWT_SECRET } from '@/lib/constants'
import { prisma } from '@/lib/db'
import { jwtVerify } from 'jose'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    const authorization = request.cookies.get(COOKIE.SESSION)?.value
    if (!authorization)
        return new NextResponse(
            JSON.stringify({ status: 401, message: 'Unauthorized' }),
            {
                status: 401,
                statusText: 'Unauthorized',
            },
        )
    const { payload, error } = await getPayload(authorization)
    if (error)
        return new NextResponse(
            JSON.stringify({ status: 401, message: error }),
            {
                status: 401,
                statusText: 'Unauthorized',
            },
        )
    const user = await prisma.user.findUnique({
        where: {
            id: payload!.id,
        },
        select: {
            admin: true,
            id: true,
            name: true,
            username: true,
        },
    })
    if (!user)
        return new NextResponse(
            JSON.stringify({ status: 401, message: 'Unauthorized' }),
            {
                status: 401,
                statusText: 'Unauthorized',
            },
        )
    return new NextResponse(JSON.stringify(user), {
        status: 200,
        statusText: 'OK',
    })
}

async function getPayload(authorization: string) {
    try {
        const p = await jwtVerify<{ id: string }>(authorization, JWT_SECRET)
        if (!p.payload.exp || p.payload.exp < Date.now() / 1000)
            return {
                payload: null,
                error: 'Token expired',
            }
        return {
            payload: p.payload,
            error: null,
        }
    } catch (error) {
        return {
            payload: null,
            error: `${error}`,
        }
    }
}
