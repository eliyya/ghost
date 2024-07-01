import Link from 'next/link'
import { prisma } from '@/db'
import { cookies } from 'next/headers'
import { COOKIE, JWT_SECRET } from '@/constants'
import { redirect } from 'next/navigation'
import { jwtVerify } from 'jose'
import { Nav } from '@/components/Nav'
import { TeacherCard } from './TeacherCard'
import { ButtonLink } from '@/components/Buttons'

export default async function AdminDocentesPage() {
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

    const doc = await prisma.users.findMany({})
    return (
        <>
            <Nav isAdmin labs={[{ id: "", name: "Admin", active: true }]} />
            <main className='flex-1 flex justify-center align-middle items-center' >
                <div className="min-w-96 max-w-5xl border border-solid border-[#ddd] rounded-xl overflow-hidden shadow-lg">
                    <header className="flex bg-black border border-solid border-[#ddd]">
                        <Link href="/admin/labs" className="flex-1 p-4 text-center font-bold transition-colors ease-linear bg-white text-black">Laboratorios</Link>
                        <Link href="/admin/docentes" className="flex-1 p-4 text-center font-bold transition-colors ease-linear text-white" >Docentes</Link>
                    </header>
                    <div className="p-5">
                        {doc.map(d => <TeacherCard name={d.name} id={d.id} key={d.id} />)}
                        <div className="flex justify-center p-1 flex-col">
                            <ButtonLink href="/admin/docentes/new">
                                ➕
                            </ButtonLink>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}