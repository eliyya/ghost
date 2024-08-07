import { Nav } from '@/components/Nav';
import './estilo.css';
import { cookies } from 'next/headers';
import { COOKIE, JWT_SECRET } from '@/lib/constants';
import { jwtVerify } from 'jose';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';

export interface LabsSlugProps {
    params: {
        slug: string;
    };
}

export default async function LabsSlug(props: LabsSlugProps) {
    const lab = await prisma.labs.findFirst({ where: { id: props.params.slug } });
    if (!lab) redirect('/labs');
    const cookie = cookies().get(COOKIE.SESSION)?.value;
    let user: {
        id: string,
        name: string,
        username: string,
        admin: boolean,
    } | null = null;
    try {
        const payload = await jwtVerify < {
            id: string,
            name: string,
            username: string,
            admin: boolean,
            exp: number
        } > (cookie ?? '', JWT_SECRET);
        user = payload.payload;
    } catch {
    }
    const labs = await prisma.labs.findMany({});
    const procedures = await prisma.procedures.findMany({
        where: { lab_id: lab.id },
        include: { submiter: true }
    });

    const schedule = {
        '8:00': { Lunes: null, Martes: null, Miércoles: null, Jueves: null, Viernes: null },
        '9:00': { Lunes: null, Martes: null, Miércoles: null, Jueves: null, Viernes: null },
        '10:00': { Lunes: null, Martes: null, Miércoles: null, Jueves: null, Viernes: null },
        '11:00': { Lunes: null, Martes: null, Miércoles: null, Jueves: null, Viernes: null },
        '12:00': { Lunes: null, Martes: null, Miércoles: null, Jueves: null, Viernes: null },
        '13:00': { Lunes: null, Martes: null, Miércoles: null, Jueves: null, Viernes: null },
        '14:00': { Lunes: null, Martes: null, Miércoles: null, Jueves: null, Viernes: null },
    };

    procedures.forEach(procedure => {
        const startHour = procedure.start_date.getHours();
        const endHour = procedure.end_date.getHours();
        const day = procedure.start_date.toLocaleDateString('es-ES', { weekday: 'long' });
        const practice = `${procedure.practice_name} - ${procedure.submiter.name}`;

        for (let hour = startHour; hour < endHour; hour++) {
            const time = `${hour}:00`;
            if (schedule[time] && schedule[time][day]) {
                schedule[time][day] = practice;
            }
        }
    });

    return (
        <div className='h-screen w-screen overflow-hidden'>
            <Nav labs={labs.map(l => ({ ...l, active: l.id === props.params.slug }))} isAdmin={!!user?.admin} />
            <main className="container">
                <table className="schedule">
                    <thead>
                        <tr>
                            <th>Horas</th>
                            <th>Lunes</th>
                            <th>Martes</th>
                            <th>Miércoles</th>
                            <th>Jueves</th>
                            <th>Viernes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(schedule).map(([time, days]) => (
                            <tr key={time}>
                                <td>{time}</td>
                                <td>{days.Lunes}</td>
                                <td>{days.Martes}</td>
                                <td>{days.Miércoles}</td>
                                <td>{days.Jueves}</td>
                                <td>{days.Viernes}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>
        </div>
    );
}
