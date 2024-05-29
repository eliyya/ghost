import { Nav } from '@/components/Nav'
import './estilo.css'
import { cookies } from 'next/headers'
import { COOKIE, JWT_SECRET } from '@/constants'
import { jwtVerify } from 'jose'
import { prisma } from '@/db'

export interface LabsSlugProps {
    params: {
        slug: string
    }
}
export default async function LabsSlug(props: LabsSlugProps) {
    const cookie = cookies().get(COOKIE.SESSION)?.value
    let user: {
        id: string,
        name: string,
        username: string,
        admin: boolean,
    } | null = null
    try {
        const payload = await jwtVerify<{
            id: string,
            name: string,
            username: string,
            admin: boolean,
            exp: number
        }>(cookie??'', JWT_SECRET)
        user = payload.payload
    } catch {
    }
    const labs = await prisma.labs.findMany({})
    
    return (
        <div className='h-screen w-screen overflow-hidden'>
            <Nav labs={labs.map(l => ({...l,active:l.id===props.params.slug}))} isAdmin={!!user?.admin}/>
            <main className="container">
                <table className="schedule">
                    <tbody>
                        <tr>
                            <th>Horas</th>
                            <th>Lunes</th>
                            <th>Martes</th>
                            <th>Miércoles</th>
                            <th>Jueves</th>
                            <th>Viernes</th>
                        </tr>
                        <tr>
                            <td>8:00</td>
                            <td>Practica</td>
                            <td>Practica</td>
                            <td>Practica</td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>9:00</td>
                            <td>Practica</td>
                            <td></td>
                            <td></td>
                            <td>Practica</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>10:00</td>
                            <td></td>
                            <td></td>
                            <td>Practica</td>
                            <td>Practica</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>11:00</td>
                            <td></td>
                            <td>Practica</td>
                            <td></td>
                            <td>Practica</td>
                            <td>Practica</td>
                        </tr>
                        <tr>
                            <td>12:00</td>
                            <td></td>
                            <td>Practica</td>
                            <td></td>
                            <td></td>
                            <td>Practica</td>
                        </tr>
                        <tr>
                            <td>13:00</td>
                            <td>Practica</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>Practica</td>
                        </tr>
                        <tr>
                            <td>14:00</td>
                            <td>Practica</td>
                            <td>Practica</td>
                            <td></td>
                            <td></td>
                            <td>Practica</td>
                        </tr>
                    </tbody>
                </table>
            </main>  
        </div>
    )
}