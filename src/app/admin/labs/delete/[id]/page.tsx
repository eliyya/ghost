import { prisma } from "@/db";
import { verifyAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server"
import { ButtonSecondaryLink } from "@/components/Buttons"
import { SubmitPrimaryInput } from "@/components/Input"

export interface DeleteLabsPageProps {
    params: {
        id: string
    }
}
export default async function Deletelabs(props: DeleteLabsPageProps) {
    await verifyAdmin()

    const id = props.params.id
    const lab = await prisma.labs.findFirst({
        where: {
            id
        }
    })
    if (!lab) redirect('/admin/labs')


    const deleteLab = async () => {
        'use server'
        const DeleteLab = await prisma.labs.delete({
            where: {
                id
            }
        })
        redirect('/admin/labs')
    }
    return (
        <form action={deleteLab} >
            <p>Estas seguro de que deseas eliminar el lab:</p>
            <span className="mb-2">&quot;{lab.name}&quot;</span>
            <div className="flex gap-2 w-full *:flex-1" >
                <ButtonSecondaryLink href="/admin/labs">Cancelar</ButtonSecondaryLink>
                <SubmitPrimaryInput value="Eliminar" onClick={deleteLab} />
            </div>
        </form>

    )
}
