import Link from 'next/link'
import { prisma } from '@/db'
import { Nav } from '@/components/Nav'
import { TeacherCard } from './TeacherCard'
import { ButtonPrimaryLink } from '@/components/Buttons'
import { VerifyAdmin } from '@/lib/auth'

export default async function AdminDocentesPage() {
    const admin = await VerifyAdmin()

    const teachers = await prisma.users.findMany({
        where: {
            NOT: {
                id: admin.id
            }
        }
    })
    return (
        <>
            <Nav isAdmin labs={[{ id: "", name: "Panel de Administracion", active: true }]} />
            <main className='flex-1 flex justify-center align-middle items-center py-4' >
                <div className="min-w-96 max-w-5xl border border-solid border-[#ddd] rounded-xl overflow-hidden shadow-lg">
                    <header className="flex bg-black border border-solid border-[#ddd]">
                        <Link href="/admin/labs" className="flex-1 p-4 text-center font-bold transition-colors ease-linear bg-white text-black">Laboratorios</Link>
                        <Link href="/admin/docentes" className="flex-1 p-4 text-center font-bold transition-colors ease-linear text-white" >Docentes</Link>
                    </header>
                    <div className="p-5">
                        {
                            teachers.length 
                            ? teachers.map(d => <TeacherCard name={d.name} username={d.username} id={d.id} key={d.id} />)
                            : <p className="text-center mb-4">No hay docentes registrados</p>
                        }
                        <div className="flex justify-center p-1 flex-col">
                            <ButtonPrimaryLink href="/admin/docentes/new">
                                ➕
                            </ButtonPrimaryLink>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}