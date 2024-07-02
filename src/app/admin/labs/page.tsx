import { prisma } from '@/db'
import { LabCard } from './LabCard'
import Link from 'next/link'
import { Nav } from '@/components/Nav'
import { VerifyAdmin } from '@/lib/auth'

export default async function AdminLabsPage() {
    await VerifyAdmin()
    const labs = await prisma.labs.findMany({})

    return (
        <>
            <Nav isAdmin labs={[{ id: "", name: "Panel de Administracion", active: true }]} />
            <main className='flex-1 flex justify-center align-middle items-center py-4' >
                <div className="min-w-96 max-w-5xl border border-solid border-[#ddd] rounded-xl overflow-hidden shadow-lg">
                    <header className="flex border border-solid border-[#ddd]">
                        <Link href="/admin/labs" className="flex-1 p-4 text-center font-bold transition-colors ease-linear bg-black text-white">Laboratorios</Link>
                        <Link href="/admin/docentes" className="flex-1 p-4 text-center font-bold transition-colors ease-linear bg-white text-black" >Docentes</Link>
                    </header>
                    <div className="p-5">
                        {labs.map(lab => (
                            <LabCard
                                // docentes={doc.map(d => d.name)}
                                name={lab.name}
                                open_date={lab.open_date}
                                close_date={lab.close_date}
                                key={lab.id} />
                        ))}
                        <div className="flex justify-center p-1">
                            <Link href="/admin/labs/new">
                                ➕
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}