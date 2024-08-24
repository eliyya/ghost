import { daysOfWeek, ProcedureGrid, Schedule } from './ProcedureGrid'
import { getPosibleUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Prisma } from '@prisma/client'
import { Nav } from '@/components/Nav'
import { prisma } from '@/lib/db'
import { ButtonPrimaryLink, ButtonSecondaryLink } from '@/components/Buttons'

type LabWitSchedulesWithSubmiter = Prisma.LaboratoryGetPayload<{
    include: {
        procedures: {
            include: {
                UsedTool: {
                    select: {
                        quantity: true
                        tool: true
                    }
                }
                submiter: {
                    select: {
                        name: true
                        id: true
                        username: true
                        admin: true
                    }
                }
            }
        }
    }
}>
export interface LabsNameProps {
    params: {
        name: string
    }
    searchParams: {
        date?: string
    }
}

export default async function LabsNamePage(props: LabsNameProps) {
    const user = await getPosibleUser()
    const requestedDate = validateDateRangeAdmin(
        parseStartDay(props.searchParams.date),
        user?.admin,
    )
    if (props.searchParams.date !== requestedDate.toLocaleDateString('es'))
        redirect(
            `/labs/${props.params.name}?date=${requestedDate.toLocaleDateString(
                'es',
            )}`,
        )

    const { firstDay, lastDay } = getLimitsDatesOfWeek(requestedDate)
    const lab = await getLaboratoryInfo({
        firstDay,
        lastDay,
        name: props.params.name,
    })
    if (!lab) redirect('/labs')

    const hours = lab.close_date.getHours() - lab.open_date.getHours()
    const startHour = lab.open_date.getUTCHours()
    const daysToRender = lab.available_days_array
    const schedule = getSchedule(lab)

    // in formar yyyy/mm/dd
    const weekAgo = new Date(requestedDate.getTime() - 7 * 24 * 60 * 60 * 1000)
    const validateWeekAgo = validateDateRangeAdmin(weekAgo, user?.admin)
    const weekAhead = new Date(
        requestedDate.getTime() + 7 * 24 * 60 * 60 * 1000,
    )
    const validateWeekAhead = validateDateRangeAdmin(weekAhead, user?.admin)

    return (
        <>
            <Nav
                labs={(await prisma.laboratory.findMany({})).map(l => ({
                    ...l,
                    active: l.id === lab.id,
                }))}
                redirect="/labs/{lab_id}/new"
                isAdmin={user?.admin}
            />
            <main className="flex-1 flex justify-center items-center">
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between">
                        <ButtonSecondaryLink
                            disabled={
                                weekAgo.getTime() !== validateWeekAgo.getTime()
                            }
                            href={`/labs/${
                                lab.id
                            }?date=${weekAgo.toLocaleDateString('es')}`}
                        >
                            Semana Anterior
                        </ButtonSecondaryLink>
                        <ButtonPrimaryLink
                            href={`/labs/${
                                lab.id
                            }?date=${new Date().toLocaleDateString('es')}`}
                        >
                            Hoy
                        </ButtonPrimaryLink>
                        <ButtonSecondaryLink
                            disabled={
                                weekAhead.getTime() !==
                                validateWeekAhead.getTime()
                            }
                            href={`/labs/${
                                lab.id
                            }?date=${weekAhead.toLocaleDateString('es')}`}
                        >
                            Semana Siguente
                        </ButtonSecondaryLink>
                    </div>
                    <div
                        className="grid grid-cols-6"
                        style={{
                            gridTemplateRows: `repeat(${
                                hours - 1
                            }, minmax(0, 1fr))`,
                        }}
                    >
                        <div className="border border-black text-center px-2 py-1 capitalize">
                            {requestedDate.toLocaleDateString('es-MX', {
                                month: 'long',
                            })}
                        </div>
                        {Object.keys(schedule)
                            .map((d, i) => ({ name: d, i }))
                            .filter(d =>
                                daysToRender.includes(d.name as daysOfWeek),
                            )
                            .map(day => (
                                <div
                                    className="px-2 py-1 border border-black text-center"
                                    key={day.name}
                                >
                                    {day.name} /{' '}
                                    {new Date(
                                        new Date(firstDay).setDate(
                                            firstDay.getDate() + day.i,
                                        ),
                                    ).getDate()}
                                </div>
                            ))}
                        <div className="px-2 py-1 border border-black text-center">{`${startHour}:00`}</div>
                        <ProcedureGrid
                            labId={lab.id}
                            hours={hours}
                            schedule={schedule}
                            startHour={startHour}
                            firstDay={firstDay}
                            days={daysToRender}
                        />
                        {Array.from({ length: hours - 1 }).map((_, index) => (
                            <div
                                className="px-2 py-1 border border-black text-center"
                                key={index}
                            >
                                {`${startHour + index + 1}:00`}
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </>
    )
}

function getSchedule(lab: LabWitSchedulesWithSubmiter): Schedule {
    const startHour = lab.open_date.getUTCHours()
    const endHour = lab.close_date.getUTCHours()

    const schedule: Schedule = {
        Sunday: {
            ...lab.procedures
                .filter(p => p.start_date.getDay() === 0)
                .reduce((acc, p) => {
                    const hour = p.start_date.getUTCHours()
                    if (!acc[hour]) acc[hour] = p
                    return acc
                }, {} as Record<string, (typeof lab.procedures)[0]>),
        },
        Monday: {
            ...lab.procedures
                .filter(p => p.start_date.getDay() === 1)
                .reduce((acc, p) => {
                    const hour = p.start_date.getUTCHours()
                    if (!acc[hour]) acc[hour] = p
                    return acc
                }, {} as Record<string, (typeof lab.procedures)[0]>),
        },
        Tuesday: {
            ...lab.procedures
                .filter(p => p.start_date.getDay() === 2)
                .reduce((acc, p) => {
                    const hour = p.start_date.getUTCHours()
                    if (!acc[hour]) acc[hour] = p
                    return acc
                }, {} as Record<string, (typeof lab.procedures)[0]>),
        },
        Wednesday: {
            ...lab.procedures
                .filter(p => p.start_date.getDay() === 3)
                .reduce((acc, p) => {
                    const hour = p.start_date.getUTCHours()
                    if (!acc[hour]) acc[hour] = p
                    return acc
                }, {} as Record<string, (typeof lab.procedures)[0]>),
        },
        Thursday: {
            ...lab.procedures
                .filter(p => p.start_date.getDay() === 4)
                .reduce((acc, p) => {
                    const hour = p.start_date.getUTCHours()
                    if (!acc[hour]) acc[hour] = p
                    return acc
                }, {} as Record<string, (typeof lab.procedures)[0]>),
        },
        Friday: {
            ...lab.procedures
                .filter(p => p.start_date.getDay() === 5)
                .reduce((acc, p) => {
                    const hour = p.start_date.getUTCHours()
                    if (!acc[hour]) acc[hour] = p
                    return acc
                }, {} as Record<string, (typeof lab.procedures)[0]>),
        },
        Saturday: {
            ...lab.procedures
                .filter(p => p.start_date.getDay() === 6)
                .reduce((acc, p) => {
                    const hour = p.start_date.getUTCHours()
                    if (!acc[hour]) acc[hour] = p
                    return acc
                }, {} as Record<string, (typeof lab.procedures)[0]>),
        },
    }

    for (const day in schedule) {
        let currentHour = startHour

        while (currentHour < endHour) {
            // @ts-ignore
            if (!schedule[day][currentHour]) {
                // @ts-ignore
                schedule[day][currentHour] = null // Si no hay nada en la hora, rellena con un objeto vacío
                currentHour++
            } else {
                // @ts-ignore
                const startDate = new Date(
                    // @ts-ignore
                    schedule[day][currentHour].start_date,
                )
                // @ts-ignore
                const endDate = new Date(schedule[day][currentHour].end_date)
                // @ts-ignore
                const duration = (endDate - startDate) / (1000 * 60 * 60) // Duración en horas
                currentHour += duration // Salta las horas ocupadas por la sesión
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
    // check if the string is in the format dd/mm/yyyy
    if (!/^\d{1,2}\/\d{1,2}\/\d{1,4}$/.test(toParse)) return new Date()
    // parse the string to a Date object
    const [day, month, year] = toParse.split('/').map(Number)
    return new Date(year, month - 1, day)
}

/**
 * validates if a date is in the permitted range for a user
 * if is admin the range is all the days
 * if is not admin the range is 1 week from now to the future and 1 week to the past
 * @returns the date if is in the range or the nearest date in the range
 */
function validateDateRangeAdmin(date: Date, isAdmin = false): Date {
    if (isAdmin) return date
    const actualDate = new Date()
    // check if the date is in the past
    if (date.getTime() <= actualDate.getTime()) {
        const sunday = new Date(
            actualDate.getFullYear(), // year
            actualDate.getMonth(), // month
            actualDate.getDate() - actualDate.getDay() - 7, // day
        )
        if (sunday.getTime() >= date.getTime()) return sunday
        return date
    }
    const saturday = new Date(
        actualDate.getFullYear(), // year
        actualDate.getMonth(), // month
        actualDate.getDate() + (6 - actualDate.getDay()) + 7, // day
    )
    if (saturday.getTime() <= date.getTime()) return saturday
    return date
}

/**
 * Returns the first and last day of the week of a given date
 */
function getLimitsDatesOfWeek(date: Date): { firstDay: Date; lastDay: Date } {
    const firstDay = new Date(
        date.getFullYear(), // year
        date.getMonth(), // month
        date.getDate() - date.getDay(), // day
    )
    const lastDay = new Date(
        date.getFullYear(), // year
        date.getMonth(), // month
        date.getDate() + (6 - date.getDay()), // day
        23, // hour
        59, // minutes
        59, // seconds
        999, // milliseconds
    )
    return { firstDay, lastDay }
}

/**
 * Returns the laboratory info with the procedures of the week
 */
async function getLaboratoryInfo(query: {
    firstDay: Date
    lastDay: Date
    name: string
}) {
    const { firstDay, lastDay, name } = query
    const formatedName = name.trim().replace(/-+/g, ' ').toLowerCase()
    const labs = await prisma.laboratory.findMany({
        select: {
            name: true,
            id: true,
        },
    })
    const lab = labs.find(
        l => l.name.trim().replace(/-+/g, ' ').toLowerCase() === formatedName,
    )
    if (!lab) return null
    return await prisma.laboratory.findFirst({
        where: {
            id: lab.id,
        },
        include: {
            procedures: {
                where: {
                    start_date: {
                        gte: firstDay,
                        lte: lastDay,
                    },
                },
                include: {
                    UsedTool: {
                        select: {
                            quantity: true,
                            tool: true,
                        },
                    },
                    submiter: {
                        select: {
                            name: true,
                            id: true,
                            username: true,
                            admin: true,
                        },
                    },
                },
            },
        },
    })
}
