'use server'

import { prisma } from '@/lib/db'
import { cookies } from 'next/headers'
import { COOKIES } from '@/lib/constants'
import { redirect } from 'next/navigation'
import { root } from '@eliyya/type-routes'
import { getPosibleUser } from '@/lib/auth'

export async function userSubmit(formData: FormData) {
    const user = await getPosibleUser()! // Obtener el usuario

    const oldName = formData.get('name') as string
    const newName = formData.get('n-name') as string
    const oldUsername = formData.get('username') as string
    const newUsername = formData.get('n-username') as string

    if (oldName === newName && oldUsername === newUsername) return

    if (oldName !== newName) {
        await prisma.user.update({
            where: {
                id: user?.id,
            },
            data: {
                name: newName,
            },
        })
    }

    await prisma.user.update({
        where: {
            id: user?.id,
        },
        data: {
            name: newName,
            username: newUsername,
        },
    })
}

export async function logoutUser() {
    cookies().delete(COOKIES.SESSION)
    redirect(root())
}
