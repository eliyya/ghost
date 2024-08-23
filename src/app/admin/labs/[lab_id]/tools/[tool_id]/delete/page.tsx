import { prisma } from "@/lib/db";
import { verifyAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ButtonSecondaryLink } from "@/components/Buttons"
import { SubmitPrimaryInput } from "@/components/Input"
import { Nav } from "@/components/Nav";
import Image from "next/image";
import { rm } from 'node:fs/promises'

export interface DeleteLabsPageProps {
    params: {
        tool_id: string
        lab_id: string
    }
}
export default async function Deletelabs(props: DeleteLabsPageProps) {
    await verifyAdmin()
    const { tool_id, lab_id } = props.params
    const id = props.params.tool_id
    const tool = await prisma.tool.findFirst({ where: { id } })
    if (!tool) redirect('/admin/labs')


    const deleteTool = async () => {
        'use server'
        await prisma.tool.delete({
            where: {
                id
            }
        })
        try {
            await rm(`./storage/tools/${tool_id}.png`)
        } catch (error) {}
        redirect(`/admin/labs/${lab_id}/tools`)
    }
    return (
        <>
            <Nav isAdmin labs={[{ id: "", name: "Panel de Administracion", active: true }]} />
            <main className='flex-1 flex justify-center align-middle items-center py-4' >
                <form 
                    action={deleteTool} 
                    className="p-4 border border-black rounded-lg flex flex-col justify-center items-center gap-2 align-middle text-center"
                >
                    <p>Estas seguro de que deseas eliminar {tool.name}</p>
                    <Image src={`/images/tools/${tool_id}.png`} alt={tool.name} width={256} height={256} />
                    <div className="flex gap-2 w-full *:flex-1" >
                        <ButtonSecondaryLink href={`/admin/labs/${lab_id}/tools`}>Cancelar</ButtonSecondaryLink>
                        <SubmitPrimaryInput value="Eliminar" />
                    </div>
                </form>
            </main>
        </>
    )
}
