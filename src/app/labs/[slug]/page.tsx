import { Nav } from '@/components/Nav'
import './estilo.css'
import { cookies } from 'next/headers'
import { COOKIE, JWT_SECRET } from '@/constants'
import { jwtVerify } from 'jose'

export default async function LabsTemporal() {
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
    console.log(user);
    
    return (
        <>
            <Nav isAdmin={!!user?.admin}/>

            <div className="container">
                <table className="schedule">
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
                </table>
            </div>
        </>
    )
}