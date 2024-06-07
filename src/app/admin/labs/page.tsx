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
    console.log(labs);

    return (
        <>
            {/* <Head>
                <title>Laboratorios y Docentes</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Head> */}
            <Nav isAdmin labs={[{ id: "", name: "Admin", active: true }]} />
            <main className='flex-1 flex justify-center align-middle items-center' >
                <div className="w-11/12 max-w-5xl border border-solid border-[#ddd] rounded-xl overflow-hidden shadow-lg">
                    <div className="flex bg-[#e74c3c] border border-solid border-[#ddd]">
                        <Link href="/admin/labs" className="flex-1 p-4 text-center font-bold transition-colors ease-linear text-white">Laboratorios</Link>
                        <Link href="/admin/docentes" className="flex-1 p-4 text-center font-bold transition-colors ease-linear bg-white text-[#e74c3c]" >Docentes</Link>
                    </div>
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
                            <span
                                className="cursor-pointer color-[#e74c3c] transition-colors ease-linear hover:text-[#c0392b]">
                                <Link
                                 href="/admin/labs/new">➕</Link>
                            </span>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}