import Link from 'next/link'
import '../labs/estilos.css'
import Image from 'next/image'
import { prisma } from '@/db'
import { cookies } from 'next/headers'
import { COOKIE, JWT_SECRET } from '@/constants'
import { redirect } from 'next/navigation'
import { jwtVerify } from 'jose'

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
            {/* <Head>
                <title>Laboratorios y Docentes</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Head> */}
            <div className="container">
                <div className="header">
                    <div className={"tab"}>
                        <Link href={"/admin/labs"} >Laboratorios</Link>
                    </div>
                    <div className={`tab active`}>
                        <Link href={"/admin/docentes"} >Docentes</Link>
                    </div>
                </div>
                <div className="content">
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
                    <div className="add-professor">
                        <span className="add-icon"><Link href={"/admin/docentes/new"}>➕</Link></span>
                    </div>
                </div>
            </div>
        </>
    )
}