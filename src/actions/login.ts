'use server'

import { COOKIES, JWT_SECRET } from '@/lib/constants'
import { prisma } from '@/lib/db'
import { compare } from 'bcrypt'
import { SignJWT } from 'jose'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function login({
    username,
    password,
}: {
    username: string
    password: string
}) {
    const user = await prisma.user.findUnique({
        where: { username },
    })
    if (!user) {
        return {
            error: 'invalid credentials',
            status: 'failed',
        }
    }
    if (!(await compare(password, user.password))) {
        return {
            error: 'invalid credentials',
            status: 'failed',
        }
    }
    const expires = new Date()
    expires.setDate(expires.getDate() + 1)
    cookies().set({
        expires,
        name: COOKIES.SESSION,
        path: '/',
        value: await new SignJWT({
            id: user.id,
            name: user.name,
            username: user.username,
            admin: user.admin,
            exp: expires.getTime(),
        })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('1d')
            .sign(JWT_SECRET),
    })
    redirect('/labs')
}
