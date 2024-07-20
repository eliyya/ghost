
import Link from 'next/link'
import { prisma } from '@/db'
import { Nav } from '@/components/Nav'
import { TeacherCard } from './TeacherCard'
import { ButtonPrimaryLink } from '@/components/Buttons'
import { verifyAdmin } from '@/lib/auth'

export default async function AdminDocentesPage() {
    const admin = await verifyAdmin()

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
                        <Link 
                            href="/admin/labs" 
                            className="flex-1 p-4 text-center font-bold transition-colors ease-linear bg-white text-black"
                        >
                            Laboratorios
                        </Link>
                        <Link 
                            href="/admin/docentes" 
                            className="flex-1 p-4 text-center font-bold transition-colors ease-linear text-white" 
                        >
                            Docentes
                        </Link>
                    </header>
                    <div className="p-5 flex flex-col gap-2">
                        {
                            teachers.length 
                            ? teachers.map(d => (
                                <TeacherCard 
                                    name={d.name} 
                                    username={d.username} 
                                    id={d.id} 
                                    key={d.id} 
                                />
                            ))
                            : <p className="text-center mb-4">No hay docentes registrados</p>
                        }
                        <ButtonPrimaryLink href="/admin/docentes/new">
                            {
                                teachers.length 
                                ?   <svg fill="#ffffff" viewBox="0 0 27.963 27.963" className='h-5' >
                                        <path d="M13.98,0C6.259,0,0,6.26,0,13.982s6.259,13.981,13.98,13.981c7.725,0,13.983-6.26,13.983-13.981,C27.963,6.26,21.705,0,13.98,0z M21.102,16.059h-4.939v5.042h-4.299v-5.042H6.862V11.76h5.001v-4.9h4.299v4.9h4.939v4.299H21.102z"/>
                                    </svg>
                                :   'Registrar Docente'
                            }
                        </ButtonPrimaryLink>
                    </div>
                </div>
            </main>
        </>
    )
}