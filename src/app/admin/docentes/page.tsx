import Link from 'next/link'
import '../labs/estilos.css'
import Image from 'next/image'
import { LabCard } from '../labs/LabCard'
import { prisma } from '@/db'

export default async function AdminDocentesPage() {

    const labs = await prisma.labs.findMany({})
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
                    <div className="card">
                        <div className="card-header">
                            <h2>juan</h2>
                            <p>Horario: 8am-8pm</p>
                        </div>
                    </div>
                    <div className="card">
                        <div className="card-header">
                            <h2>juarlos</h2>
                            <div className='flex gap-4'>
                                <Image src="/edit.png" alt="Picture of the author" width={20} height={20} />
                                <span className="remove-icon">❌</span>
                            </div>
                        </div>
                    </div>
                    <div className="add-professor">
                        <span className="add-icon"><Link href={"/admin/docentes/new"}>➕</Link></span>
                    </div>
                </div>
            </div>
        </>
    )
}