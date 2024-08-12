import { daysOfWeek, ProcedureGrid, Schedule } from './ProcedureGrid';
import { getPosibleUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Prisma } from '@prisma/client';
import { Nav } from '@/components/Nav';
import { prisma } from '@/lib/db';

type LabWitSchedulesWithSubmiter = Prisma.LaboratoryGetPayload<{
    include: {
        procedures: {
            include: {
                submiter: {
                    select: {
                        name: true,
                        id: true,
                        username: true,
                        admin: true,
                    }
                }
            }
        }
    }
}>
export interface LabsSlugProps {
    params: {
        slug: string;
    }
    searchParams: {
        date?: string;
    }
}

export default async function LabsSlug(props: LabsSlugProps) {  
    const user = await getPosibleUser();
    const requestedDate = validateDateRangeAdmin(parseStartDay(props.searchParams.date), user?.admin);
    const { firstDay, lastDay } = getLimitsDatesOfWeek(requestedDate);
    const lab = await getLaboratoryInfo({ firstDay, lastDay, id: props.params.slug });
    if (!lab) redirect('/labs');
       
    const hours = lab.close_date.getHours() - lab.open_date.getHours();
    const startHour = lab.open_date.getUTCHours();
    const daysToRender = lab.available_days_array;
    const schedule = getSchedule(lab)

    return (
        <>
            <Nav 
                labs={(await prisma.laboratory.findMany({})).map(l => ({ ...l, active: l.id === props.params.slug }))} 
                redirect='/labs/{lab_id}/new' 
                isAdmin={user?.admin} 
            />
            <main className="flex-1 flex justify-center items-center">
                <div 
                    className='grid grid-cols-6'
                    style={{
                        gridTemplateRows: `repeat(${hours}, minmax(0, 1fr))`,
                    }} 
                >
                    <div className='border border-black'></div>
                    {Object.keys(schedule).filter(d => daysToRender.includes(d as daysOfWeek)).map(day => (
                        <div className='px-2 py-1 border border-black text-center' key={day}>{day}</div>
                    ))}
                    <div className='px-2 py-1 border border-black text-right'>{`${startHour}:00`}</div>
                    <ProcedureGrid 
                        labId={lab.id}
                        hours={hours} 
                        schedule={schedule} 
                        startHour={startHour} 
                        firstDay={firstDay} 
                        days={daysToRender} 
                        />
                    {Array.from({ length: hours - 1 }).map((_, index) => (
                        <div className='px-2 py-1 border border-black text-right' key={index}>
                            {`${startHour + index + 1}:00`}
                        </div>
                    ))}
                </div>
            </main>
        </>
    );
}

function getSchedule(lab: LabWitSchedulesWithSubmiter): Schedule {
    const startHour = lab.open_date.getUTCHours();
    const endHour = lab.close_date.getUTCHours();
    
    const schedule: Schedule = {
        Sunday: {
            ...lab.procedures
                .filter(p => p.start_date.getDay() === 0)
                .reduce((acc, p) => {
                    const hour = p.start_date.getUTCHours();
                    if (!acc[hour]) acc[hour] = p;
                    return acc;
                }
                , {} as Record<string, typeof lab.procedures[0]>)
        },
        Monday: {
            ...lab.procedures
                .filter(p => p.start_date.getDay() === 1)
                .reduce((acc, p) => {
                    const hour = p.start_date.getUTCHours();
                    if (!acc[hour]) acc[hour] = p;
                    return acc;
                }
                , {} as Record<string, typeof lab.procedures[0]>)
        },
        Tuesday: {
            ...lab.procedures
                .filter(p => p.start_date.getDay() === 2)
                .reduce((acc, p) => {
                    const hour = p.start_date.getUTCHours();
                    if (!acc[hour]) acc[hour] = p;
                    return acc;
                }
                , {} as Record<string, typeof lab.procedures[0]>)
        },
        Wednesday: {
            ...lab.procedures
                .filter(p => p.start_date.getDay() === 3)
                .reduce((acc, p) => {
                    const hour = p.start_date.getUTCHours();
                    if (!acc[hour]) acc[hour] = p;
                    return acc;
                }
                , {} as Record<string, typeof lab.procedures[0]>)
        },
        Thursday: {
            ...lab.procedures
                .filter(p => p.start_date.getDay() === 4)
                .reduce((acc, p) => {
                    const hour = p.start_date.getUTCHours();
                    if (!acc[hour]) acc[hour] = p;
                    return acc;
                }
                , {} as Record<string, typeof lab.procedures[0]>)
        },
        Friday: {
            ...lab.procedures
                .filter(p => p.start_date.getDay() === 5)
                .reduce((acc, p) => {
                    const hour = p.start_date.getUTCHours();
                    if (!acc[hour]) acc[hour] = p;
                    return acc;
                }
                , {} as Record<string, typeof lab.procedures[0]>)
        },
        Saturday: {
            ...lab.procedures
                .filter(p => p.start_date.getDay() === 6)
                .reduce((acc, p) => {
                    const hour = p.start_date.getUTCHours();
                    if (!acc[hour]) acc[hour] = p;
                    return acc;
                }
                , {} as Record<string, typeof lab.procedures[0]>)
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

    return schedule
}

/**
 * Converts a string date format yyyy/mm/dd to a Date object
 * If the string is not in the correct format returns actual date
 */
function parseStartDay(toParse: string = ''): Date {
    // check if the string is in the format yyyy/mm/dd
    const regex = /^\d{4}\/\d{2}\/\d{2}$/;
    if (!regex.test(toParse)) return new Date();
    // parse the string to a Date object
    const [year, month, day] = toParse.split('/').map(Number);
    return new Date(year, month - 1, day);
}

/**
 * validates if a date is in the permitted range for a user
 * if is admin the range is all the days
 * if is not admin the range is 1 week from now to the future and 1 week to the past 
 * @returns the date if is in the range or the nearest date in the range
 */
function validateDateRangeAdmin(date: Date, isAdmin = false): Date {
    if (isAdmin) return date;
    const actualDate = new Date();
    // check if the date is in the past
    if (date.getTime() <= actualDate.getTime()) {
        const sunday = new Date(
            date.getFullYear(), // year
            date.getMonth(), // month
            date.getDate() - date.getDay() // day
        )
        if (sunday.getTime() >= date.getTime()) return sunday
        return date
    }
    const saturday = new Date(
        actualDate.getFullYear(), // year
        actualDate.getMonth(), // month
        actualDate.getDate() + (6 - actualDate.getDay()) // day
    )
    if (saturday.getTime() <= date.getTime()) return saturday
    return date
}

/**
 * Returns the first and last day of the week of a given date
 */
function getLimitsDatesOfWeek(date: Date): { firstDay: Date, lastDay: Date } {
    const firstDay = new Date(
        date.getFullYear(), // year
        date.getMonth(), // month
        date.getDate() - date.getDay(), // day
    );
    const lastDay = new Date(
        date.getFullYear(), // year
        date.getMonth(), // month
        date.getDate() + (6 - date.getDay()), // day
        23, // hour
        59, // minutes
        59, // seconds
        999 // milliseconds
    );
    return { firstDay, lastDay }
}

function getLaboratoryInfo(query: { firstDay: Date, lastDay: Date, id: string }) {
    const { firstDay, lastDay, id } = query;
    return prisma.laboratory.findFirst({ 
        where: { 
            id 
        }, 
        include: {
            procedures: {
                where: {
                    start_date: {
                        gte: firstDay,
                        lte: lastDay
                    }
                }, 
                include: {
                    submiter: {
                        select: {
                            name: true,
                            id: true,
                            username: true,
                            admin: true,
                        }
                    }
                }
            }
        } 
    })
}