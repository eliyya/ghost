import { ButtonSecondaryLink } from "@/components/Buttons";
import { SubmitPrimaryInput } from "@/components/Input";
import { Nav } from "@/components/Nav";
import { prisma } from "@/db";
import { verifyAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";

interface NewToolsPageProps {
    params: {
        lab_id: string,
        tool_id: string
    }
  }
export default async function ToolExistPage(prop: NewToolsPageProps) {
    await verifyAdmin()
    const { lab_id, tool_id } = prop.params
    const tool = await prisma.tools.findFirst({
        where: {
            id: tool_id
        }
    })
    if (!tool) redirect(`/admin/labs/${lab_id}/tools`)
    return (
        <>
            <Nav isAdmin labs={[{ id: "", name: "Panel de Administracion", active: true }]} />
            <main className='flex-1 flex justify-center align-middle items-center py-4' >
                <form
                    action={async e => {
                        'use server'
                        await prisma.tools.update({
                            where: {
                                id: tool_id
                            },
                            data: {
                                stock: {
                                    increment: 1
                                }
                            }
                        })
                        redirect(`/admin/labs/${lab_id}/tools`)
                    }}
                    className="w-72 p-4 border border-black rounded-lg flex flex-col justify-center items-center gap-2 align-middle text-center"
                >
                    <p>El material &quot;{tool.name}&quot; ya existe</p>
                    <span className="mb-2">Desea agregar otro al stock?</span>
                    <div className="flex gap-2 w-full *:flex-1" >
                        <ButtonSecondaryLink href="/admin/docentes">Cancelar</ButtonSecondaryLink>
                        <SubmitPrimaryInput value="Agregar" />
                    </div>
                </form>
            </main>
        </>
    )
}