import Image from 'next/image'
import './estilo.css'
import Link from 'next/link'

export default async function LabsTemporal() {
    return (
        <>
            <div className="header">
                <Image src={'next.svg'} alt="IISE-Logo" width={100} height={100} />
                <select className="laboratorios">
                    <option disabled selected>roles</option>
                    <option id="boton-industrial">laboratorio insdustrial</option>
                    <option> laboratorio sistemas</option>
                </select>
                <Link className="user-icon" href={'/user'} >👤</Link>
            </div>

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