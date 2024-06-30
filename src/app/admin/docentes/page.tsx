import Link from 'next/link'
import '../labs/estilos.css'
import Image from 'next/image'
import { prisma } from '@/db'
import { cookies } from 'next/headers'
import { COOKIE, JWT_SECRET } from '@/constants'
import { redirect } from 'next/navigation'
import { jwtVerify } from 'jose'
import { Nav } from '@/components/Nav'

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

    const labs = await prisma.labs.findMany({})
    const doc = await prisma.users.findMany({})
    return (
        <>
            {/* <Head>
                <title>Laboratorios y Docentes</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Head> */}
            <Nav isAdmin labs={[{ id: "", name: "Admin", active: true }]} />
            <main className='flex-1 flex justify-center align-middle items-center' >
                <div className="min-w-96 max-w-5xl border border-solid border-[#ddd] rounded-xl overflow-hidden shadow-lg">
                    <header className="flex bg-black border border-solid border-[#ddd]">
                        <Link href="/admin/labs" className="flex-1 p-4 text-center font-bold transition-colors ease-linear bg-white text-black">Laboratorios</Link>
                        <Link href="/admin/docentes" className="flex-1 p-4 text-center font-bold transition-colors ease-linear text-white" >Docentes</Link>
                    </header>
                    <div className="p-5">
                        {doc.map(d => (
                            <div className="card" key={d.id}>
                                <div className="card-header">
                                    <h2>{d.name}</h2>
                                    <div className='flex gap-4'>
                                        <Image src="/edit.png" alt="Picture of the author" width={20} height={20} />
                                        <span className="remove-icon">❌</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div className="flex justify-center p-1">
                            <span
                                className="cursor-pointer color-[#e74c3c] transition-colors ease-linear hover:text-[#c0392b]">
                                <Link
                                    href="/admin/docentes/new">➕</Link>
                            </span>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}