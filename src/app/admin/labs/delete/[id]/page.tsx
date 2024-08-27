import { prisma } from '@/lib/db'
import { verifyAdmin } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { ButtonSecondaryLink } from '@/components/Buttons'
import { SubmitPrimaryInput } from '@/components/Input'
import { Nav } from '@/components/Nav'
import { root } from '@eliyya/type-routes'
export interface DeleteLabsPageProps {
    params: {
        id: string
    }
}
export default async function Deletelabs(props: DeleteLabsPageProps) {
    await verifyAdmin()

    const id = props.params.id
    const lab = await prisma.laboratory.findFirst({ where: { id } })
    if (!lab) redirect(root.admin.labs())

    const deleteLab = async () => {
        'use server'
        await prisma.laboratory.delete({
            where: {
                id,
            },
        })
        redirect(root.admin.labs())
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
                    action={deleteLab}
                    className="w-72 p-4 border border-black rounded-lg flex flex-col justify-center items-center gap-2 align-middle text-center"
                >
                    <p>Estas seguro de que deseas eliminar el laboratorio:</p>
                    <span className="mb-2">&quot;{lab.name}&quot;</span>
                    <div className="flex gap-2 w-full *:flex-1">
                        <ButtonSecondaryLink href="/admin/labs">
                            Cancelar
                        </ButtonSecondaryLink>
                        <SubmitPrimaryInput
                            value="Eliminar"
                            onClick={deleteLab}
                        />
                    </div>
                </form>
            </main>
        </>
    )
}
