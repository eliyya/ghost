import { COOKIES } from '@/lib/constants'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Input, SubmitPrimaryInput } from '@/components/Input'
import { Nav } from '@/components/Nav'
import { prisma } from '@/lib/db'
import { root } from '@eliyya/type-routes'
import { getPosibleUser } from '@/lib/auth'

export default async function UserPage() {
    let user = (await getPosibleUser())! // check in middleware

    const userSubmit = async (formData: FormData) => {
        'use server'

        const oldName = formData.get('name') as string
        const newName = formData.get('n-name') as string
        const oldUsername = formData.get('username') as string
        const newUsername = formData.get('n-username') as string

        if (oldName === newName && oldUsername === newUsername) return

        if (oldName !== newName) {
            await prisma.user.update({
                where: {
                    id: user.id,
                },
                data: {
                    name: newName,
                },
            })
        }

        prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                name: newName,
                username: newUsername,
            },
        })
    }

    return (
        <div className="h-screen w-screen flex flex-col">
            <Nav labs={[{ id: '', name: 'Usuario', active: true }]} />
            <main className="flex justify-center items-center flex-col gap-5 flex-1">
                <form
                    action={userSubmit}
                    className="w-72 p-4 border border-black rounded-lg flex flex-col"
                >
                    {/* Nombre */}
                    <Input
                        type="text"
                        name="n-name"
                        placeholder="Nombre del Docente"
                        defaultValue={user.name}
                        disabled
                    />
                    <Input type="hidden" name="name" value={user.name} />
                    {/* Usuario */}
                    <Input
                        type="text"
                        placeholder="Usuario Clave"
                        name="n-username"
                        defaultValue={user.username}
                        disabled
                    />
                    <Input
                        type="hidden"
                        name="username"
                        value={user.username}
                    />
                    {/* <Input type='password' placeholder="nueva constraseña" />
          <Input type='password' placeholder="confirmar contraseña" /> */}
                    <SubmitPrimaryInput value="Actualizar" disabled />
                </form>
                <form
                    action={async () => {
                        'use server'
                        cookies().delete(COOKIES.SESSION)
                        redirect(root())
                    }}
                    method="get"
                    className="w-72 p-4 border border-black rounded-lg flex flex-col"
                >
                    <SubmitPrimaryInput value="Cerrar Sesion" />
                </form>
            </main>
        </div>
    )
}
