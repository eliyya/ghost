'use server'

import { snowflake } from '@/lib/constants'
import { prisma } from '@/lib/db'
import { parseName } from '@/lib/utils'
import { Prisma } from '@prisma/client'
import { hash } from 'bcrypt'
import {
    RegisterUserErrorMessages,
    RegisterUserSuccessMessages,
} from '@/lib/constants'

export async function registerUser(props: {
    name: string
    username: string
    password: string
    admin: boolean
}): Promise<
    | {
          status: 'succes'
          message: RegisterUserSuccessMessages
          data: Prisma.UserGetPayload<{
              select: {
                  id: true
                  name: true
                  username: true
                  admin: true
              }
          }>
      }
    | {
          status: 'error'
          message: RegisterUserErrorMessages
          data: null
      }
> {
    const parsedName = parseName(props.name)
    if (!parsedName)
        return {
            status: 'error',
            message: RegisterUserErrorMessages.InvalidName,
            data: null,
        }

    if (
        !/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!?_\-+=*&%$#])[A-Za-z\d!?_\-+=*&%$#]{8,}$/.test(
            props.password,
        )
    ) {
        return {
            status: 'error',
            message: RegisterUserErrorMessages.InvalidPassword,
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
            message: RegisterUserSuccessMessages.UserCreated,
            data: admin,
        }
    } catch (error) {
        if ((error as any).message.includes('Unique constraint failed')) {
            return {
                status: 'error',
                message: RegisterUserErrorMessages.TakenUsername,
                data: null,
            }
        }
        return {
            status: 'error',
            message: RegisterUserErrorMessages.Internal,
            data: null,
        }
    }
}
