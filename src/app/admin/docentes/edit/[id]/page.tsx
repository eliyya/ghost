import { Nav } from "@/components/Nav";
import { prisma } from "@/lib/db";
import { verifyAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import { EditUserForm, EditUserAction } from "./EditUserForm";
import { hash } from "bcrypt";


interface AdminDocentesEditPageProps {
    params: {
        id: string
    }
}
export default async function AdminDocentesEditPage(props: AdminDocentesEditPageProps) {
    const admin = await verifyAdmin()
    const id = props.params.id
    if (admin.id === id) redirect('/admin/docentes')
    const user = await prisma.users.findFirst({ where: { id } })
    if (!user) redirect('/admin/docentes')

    const editUser: EditUserAction = async data => {
        'use server'
        // check if user exists
        const user = await prisma.users.findFirst({
            where: {
                username: data.username
            }
        })
        if (user && user.id !== id) return { status: 'error', message: 'Usuario ya existe' }
        await prisma.users.update({
            where: { id },
            data: {
                name: data.name,
                username: data.username,
                password: data.password ? await hash(data.password, 10) : undefined
            }
        })   
        
        return { status: 'succes', message: 'Usuario Editado con exito' }
    } 
    return (
        <>
            <Nav isAdmin labs={[{ id: "", name: `Editar Docente ${user.username}`, active: true }]} />
            <main className='flex-1 flex justify-center align-middle items-center py-4' >
            <EditUserForm user={user} editUser={editUser} />
            </main>
        </>
    )
}