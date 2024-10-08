import { ButtonSecondaryLink } from '@/components/Buttons'
import { SubmitPrimaryInput } from '@/components/Input'
import { Nav } from '@/components/Nav'
import { prisma } from '@/lib/db'
import { verifyAdmin } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { root } from '@eliyya/type-routes'
interface DeleteTeacherPageProps {
    params: {
        id: string
    }
}

export default async function DeleteTeacherPage(props: DeleteTeacherPageProps) {
    const admin = await verifyAdmin()
    const id = props.params.id
    if (admin.id === id) redirect(root.admin.docentes())
    const user = await prisma.user.findFirst({
        where: {
            id,
        },
    })
    if (!user) redirect(root.admin.docentes())

    const deleteUser = async () => {
        'use server'
        await prisma.user.delete({
            where: {
                id,
            },
        })
        redirect(root.admin.docentes())
    }

    return (
        <>
            <Nav
                isAdmin
                labs={[
                    { id: '', name: 'Panel de Administracion', active: true },
                ]}
            />
            <main className="flex-1 flex justify-center align-middle items-center py-4">
                <form
                    action={deleteUser}
                    className="w-72 p-4 border border-black rounded-lg flex flex-col justify-center items-center gap-2 align-middle text-center"
                >
                    <p>Estas seguro de que deseas eliminar al usuario:</p>
                    <span className="mb-2">
                        &quot;{user.name}&quot; (@{user.username})
                    </span>
                    <div className="flex gap-2 w-full *:flex-1">
                        <ButtonSecondaryLink href="/admin/docentes">
                            Cancelar
                        </ButtonSecondaryLink>
                        <SubmitPrimaryInput value="Eliminar" />
                    </div>
                </form>
            </main>
        </>
    )
}
