import { cookies } from 'next/headers'
import { COOKIE, JWT_SECRET } from '@/constants'
import { redirect } from 'next/navigation'
import { jwtVerify } from 'jose'
import { prisma } from '@/db'
import { LabCard } from './LabCard'
import Link from 'next/link'
import { Nav } from '@/components/Nav'

export default async function AdminLabsPage() {
    const cookie = cookies().get(COOKIE.SESSION)?.value
    if (!cookie) redirect('/login')
    let user: {
        id: string,
        name: string,
        username: string,
        admin: boolean,
    }
    try {
        const payload = await jwtVerify<{
            id: string,
            name: string,
            username: string,
            admin: boolean,
            exp: number
        }>(cookie, JWT_SECRET)
        user = payload.payload
    } catch (error) {
        if (error instanceof Error && (
            error.message.includes('JWS Protected Header is invalid') ||
            error.message.includes('signature verification failed') ||
            error.message.includes('timestamp check failed')
        )) redirect('/labs')
        else throw error
    }
    if (!user.admin) redirect('/labs')
    const labs = await prisma.labs.findMany({})
    const doc = await prisma.users.findMany({})

    return (
        <>
            <Nav isAdmin labs={[{ id: "", name: "Admin", active: true }]} />
            <main className='flex-1 flex justify-center align-middle items-center' >
                <div className="min-w-96 max-w-5xl border border-solid border-[#ddd] rounded-xl overflow-hidden shadow-lg">
                    <header className="flex border border-solid border-[#ddd]">
                        <Link href="/admin/labs" className="flex-1 p-4 text-center font-bold transition-colors ease-linear bg-black text-white">Laboratorios</Link>
                        <Link href="/admin/docentes" className="flex-1 p-4 text-center font-bold transition-colors ease-linear bg-white text-black" >Docentes</Link>
                    </header>
                    <div className="p-5">
                        {labs.map(lab => (
                            <LabCard
                                docentes={doc.map(d => d.name)}
                                name={lab.name}
                                open_date={lab.open_date}
                                close_date={lab.close_date}
                                key={lab.id} />
                        ))}
                        <div className="flex justify-center p-1">
                                <Link
                                 href="/admin/labs/new">➕</Link>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}