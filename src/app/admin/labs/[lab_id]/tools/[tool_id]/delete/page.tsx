import { prisma } from "@/db";
import { verifyAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server"
import { ButtonSecondaryLink } from "@/components/Buttons"
import { SubmitPrimaryInput } from "@/components/Input"
import { Nav } from "@/components/Nav";

export interface DeleteLabsPageProps {
    params: {
        tool_id: string
    }
}
export default async function Deletelabs(props: DeleteLabsPageProps) {
    await verifyAdmin()

    const id = props.params.tool_id
    const tool = await prisma.tools.findFirst({ where: { id } })
    if (!tool) redirect('/admin/labs')


    const deleteTool = async () => {
        'use server'
        await prisma.tools.delete({
            where: {
                id
            }
        })
        redirect('/admin/labs')
    }
    return (
        <>
            <Nav isAdmin labs={[{ id: "", name: "Panel de Administracion", active: true }]} />
            <main className='flex-1 flex justify-center align-middle items-center py-4' >
                <form 
                    action={deleteTool} 
                    className="w-72 p-4 border border-black rounded-lg flex flex-col justify-center items-center gap-2 align-middle text-center"
                >
                    <p>Estas seguro de que deseas eliminar {tool.name}:</p>
                    <div className="flex gap-2 w-full *:flex-1" >
                        <ButtonSecondaryLink href="/admin/labs">Cancelar</ButtonSecondaryLink>
                        <SubmitPrimaryInput value="Eliminar" onClick={deleteTool} />
                    </div>
                </form>
            </main>
        </>
    )
}
