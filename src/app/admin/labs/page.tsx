import { cookies } from 'next/headers'
import './estilos.css'
import { COOKIE, JWT_SECRET } from '@/constants'
import { redirect } from 'next/navigation'
import { jwtVerify } from 'jose'
import { prisma } from '@/db'
import { LabCard } from './LabCard'
import Link from 'next/link'

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
    console.log(labs);

    return (
        <>
            {/* <Head>
                <title>Laboratorios y Docentes</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Head> */}
            <div className="container">
                <div className="header">
                    <div className={"tab active"}>
                        <Link href={"/admin/labs"} >Laboratorios</Link>
                    </div>
                    <div className={`tab`}>
                        <Link href={"/admin/docentes"} >Docentes</Link>
                    </div>
                </div>
                <div className="content">
                    {labs.map(lab => (
                    <LabCard
                        name={lab.name}
                        open_date={lab.open_date}
                        close_date={lab.close_date}
                        key={lab.id} />
                    ))}
                </div>
            </div>
        </>
    )
}