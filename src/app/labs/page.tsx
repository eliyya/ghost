import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { Nav } from '@/components/Nav'
import { getPosibleUser } from '@/lib/auth'
import { ButtonPrimaryLink } from '@/components/Buttons'

export default async function LabsPage() {
    const labs = await prisma.laboratory.findMany({
        select: { name: true },
    })
    if (labs.length === 1)
        redirect(
            `/labs/${labs[0].name
                .replace(/\s/g, '-')
                .toLowerCase()}/${new Date().toLocaleDateString('es')}`,
        )
    const user = await getPosibleUser()

    return (
        <>
            <Nav
                isAdmin={user?.admin}
                labs={[{ id: '', name: 'Laboratorios', active: true }]}
            />
            <main className="flex gap-1 flex-1 flex-col align-middle text-center justify-center item-center">
                <h1 className="text-3xl">Oh no...</h1>
                <p className="text-xl">
                    Parece que no existen laboratorios registrados en el sistema
                </p>
                {user?.admin ?
                    <>
                        <p>
                            Para hacer uso de este sistema debe haber al menos 1
                            laboratorio registrado
                        </p>
                        <div className="flex justify-center m-3">
                            <ButtonPrimaryLink href="/admin/labs/new">
                                Registrar Laboratorio
                            </ButtonPrimaryLink>
                        </div>
                    </>
                :   <p>
                        Porfavor pidele a un administrador que registre uno
                        antes de volver aqui
                    </p>
                }
            </main>
        </>
    )
}
