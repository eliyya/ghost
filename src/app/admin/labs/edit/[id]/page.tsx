import { Nav } from "@/components/Nav";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { EditLabAction, EditLabForm } from "./EditLabForm";


interface AdminDocentesEditPageProps {
    params: {
        id: string
    }
}
export default async function AdminDocentesEditPage(props: AdminDocentesEditPageProps) {
    const id = props.params.id
    const lab = await prisma.labs.findFirst({ where: { id } })
    if (!lab) redirect('/admin/labs')

    const editUser: EditLabAction = async data => {
        'use server'
        // check if user exists
        const user = await prisma.labs.findFirst({
            where: {
                name: data.name
            }
        })
        if (user && user.id !== id) return { status: 'error', message: 'Laboratorio ya existe' }
        await prisma.labs.update({
            where: { id },
            data: {
                name: data.name,
                open_date: data.open_date,
                close_date: data.close_date                
            }
        })   
        
        return { status: 'succes', message: 'Usuario Editado con exito' }
    } 
    return (
        <>
            <Nav isAdmin labs={[{ id: "", name: `Editar Laboratorio "${lab.name}"`, active: true }]} />
            <main className='flex-1 flex justify-center align-middle items-center py-4' >
            <EditLabForm lab={lab} action={editUser} />
            </main>
        </>
    )
}