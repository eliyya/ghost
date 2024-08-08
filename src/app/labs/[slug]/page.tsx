import { Nav } from '@/components/Nav';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import { getVerifiedUser } from '@/lib/auth';
import { daysOfWeek, ProcedureGrid, Schedule } from './ProcedureGrid';

export interface LabsSlugProps {
    params: {
        slug: string;
    }
    searchParams: {
        week?: string;
    }
}

export default async function LabsSlug(props: LabsSlugProps) {
    // console.log('week', props.searchParams.week);
    
    const lab = await prisma.labs.findFirst({ where: { id: props.params.slug } });
    if (!lab) redirect('/labs');

    const user = await getVerifiedUser();
    const labs = await prisma.labs.findMany({});
    
    const actualDate = new Date()
    // domingo    
    const firstDay = new Date(actualDate.getFullYear(), actualDate.getMonth(), actualDate.getDate() - actualDate.getDay(), lab.open_date.getHours());
    // sabado
    const lastDay = new Date(actualDate.getFullYear(), actualDate.getMonth(), actualDate.getDate() + (6 - actualDate.getDay()), lab.close_date.getHours());
    
    const procedures = await prisma.procedures.findMany({
        where: {
            lab_id: lab.id,
            start_date: {
                gte: firstDay,
                lt: lastDay
            }
        },
        include: { submiter: {
            select: {
                name: true,
                id: true,
                username: true,
                admin: true,
            }
        } }
    });    
    const hours = lab.close_date.getHours() - lab.open_date.getHours();
    const startHour = lab.open_date.getUTCHours();
    const endHour = lab.close_date.getUTCHours();
    const daysToRender: daysOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    
    const schedule: Schedule = {
        sunday: {
            ...procedures
                .filter(p => p.start_date.getDay() === 0)
                .reduce((acc, p) => {
                    const hour = p.start_date.getUTCHours();
                    if (!acc[hour]) acc[hour] = p;
                    return acc;
                }
                , {} as Record<string, typeof procedures[0]>)
        },
        monday: {
            ...procedures
                .filter(p => p.start_date.getDay() === 1)
                .reduce((acc, p) => {
                    const hour = p.start_date.getUTCHours();
                    if (!acc[hour]) acc[hour] = p;
                    return acc;
                }
                , {} as Record<string, typeof procedures[0]>)
        },
        tuesday: {
            ...procedures
                .filter(p => p.start_date.getDay() === 2)
                .reduce((acc, p) => {
                    const hour = p.start_date.getUTCHours();
                    if (!acc[hour]) acc[hour] = p;
                    return acc;
                }
                , {} as Record<string, typeof procedures[0]>)
        },
        wednesday: {
            ...procedures
                .filter(p => p.start_date.getDay() === 3)
                .reduce((acc, p) => {
                    const hour = p.start_date.getUTCHours();
                    if (!acc[hour]) acc[hour] = p;
                    return acc;
                }
                , {} as Record<string, typeof procedures[0]>)
        },
        thursday: {
            ...procedures
                .filter(p => p.start_date.getDay() === 4)
                .reduce((acc, p) => {
                    const hour = p.start_date.getUTCHours();
                    if (!acc[hour]) acc[hour] = p;
                    return acc;
                }
                , {} as Record<string, typeof procedures[0]>)
        },
        friday: {
            ...procedures
                .filter(p => p.start_date.getDay() === 5)
                .reduce((acc, p) => {
                    const hour = p.start_date.getUTCHours();
                    if (!acc[hour]) acc[hour] = p;
                    return acc;
                }
                , {} as Record<string, typeof procedures[0]>)
        },
        saturday: {
            ...procedures
                .filter(p => p.start_date.getDay() === 6)
                .reduce((acc, p) => {
                    const hour = p.start_date.getUTCHours();
                    if (!acc[hour]) acc[hour] = p;
                    return acc;
                }
                , {} as Record<string, typeof procedures[0]>)
        },
    }

    for (const day in schedule) {
        let currentHour = startHour;
    
        while (currentHour < endHour) {
            // @ts-ignore
            if (!schedule[day][currentHour]) {
              // @ts-ignore
            schedule[day][currentHour] = null; // Si no hay nada en la hora, rellena con un objeto vacío
            currentHour++;
          } else {
            // @ts-ignore
            const startDate = new Date(schedule[day][currentHour].start_date);
            // @ts-ignore
            const endDate = new Date(schedule[day][currentHour].end_date);
            // @ts-ignore
            const duration = (endDate - startDate) / (1000 * 60 * 60); // Duración en horas
            currentHour += duration; // Salta las horas ocupadas por la sesión
          }
        }
      }

    
    // console.log('schedule', schedule)

    return (
        <>
            <Nav labs={labs.map(l => ({ ...l, active: l.id === props.params.slug }))} isAdmin={user.admin} />
            <main className="flex-1 flex justify-center items-center">
                <div 
                    className='grid grid-cols-6'
                    style={{
                        gridTemplateRows: `repeat(${hours}, minmax(0, 1fr))`,
                    }} 
                >
                    <div className='border border-black'></div>
                    {Object.keys(schedule).filter(d => daysToRender.includes(d as daysOfWeek)).map(day => (
                        <div className='p-2 border border-black text-center' key={day}>{day}</div>
                    ))}
                    <div className='p-2 border border-black text-right'>{`${startHour}:00`}</div>
                    <ProcedureGrid 
                        hours={hours} 
                        schedule={schedule} 
                        startHour={startHour} 
                        firstDay={firstDay} 
                        days={daysToRender} 
                        />
                    {Array.from({ length: hours - 1 }).map((_, index) => (
                        <div className='p-2 border border-black text-right' key={index}>{`${startHour + index + 1}:00`}</div>
                    ))}
                </div>
            </main>
        </>
    );
}
