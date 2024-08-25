import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
    const count = await prisma.user.count()
    return new NextResponse(JSON.stringify({ count }), {
        headers: {
            'content-type': 'application/json',
        },
    })
}
