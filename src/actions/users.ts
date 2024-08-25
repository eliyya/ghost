'use server'

import { snowflake } from '@/lib/constants'
import { prisma } from '@/lib/db'
import { parseName } from '@/lib/utils'
import { Prisma } from '@prisma/client'
import { hash } from 'bcrypt'

export enum ErrorMessages {
    TakenUsername = 'Username already in use',
    InvalidName = 'Invalid Name',
    InvalidPassword = 'Invalid Password',
    Internal = 'Internal Server Error',
}

export enum SuccessMessages {
    UserCreated = 'User Created',
}

export async function registerUser(props: {
    name: string
    username: string
    password: string
    admin: boolean
}): Promise<{
    status: 'error' | 'succes'
    message: ErrorMessages | SuccessMessages
    data: null | Prisma.UserGetPayload<{
        select: {
            id: true
            name: true
            username: true
            admin: true
        }
    }>
}> {
    const parsedName = parseName(props.name)
    if (!parsedName)
        return {
            status: 'error',
            message: ErrorMessages.InvalidName,
            data: null,
        }

    if (
        !/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!?_\-+=*&%$#])[A-Za-z\d!?_\-+=*&%$#]{8,}$/.test(
            props.password,
        )
    ) {
        return {
            status: 'error',
            message: ErrorMessages.InvalidPassword,
            data: null,
        }
    }

    try {
        const admin = await prisma.user.create({
            data: {
                name: props.name,
                username: props.username,
                password: await hash(props.password, 10),
                id: snowflake.generate().toString(),
                admin: true,
            },
            select: {
                id: true,
                name: true,
                username: true,
                admin: true,
            },
        })
        return {
            status: 'succes',
            message: SuccessMessages.UserCreated,
            data: admin,
        }
    } catch (error) {
        if ((error as any).message.includes('Unique constraint failed')) {
            return {
                status: 'error',
                message: ErrorMessages.TakenUsername,
                data: null,
            }
        }
        return { status: 'error', message: ErrorMessages.Internal, data: null }
    }
}
