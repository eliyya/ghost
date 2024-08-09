import { Prisma } from "@prisma/client";
import Link from "next/link";

export type daysOfWeek = 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';
export type Schedule = Record<
    daysOfWeek,
    Record<
        string,
        Prisma.proceduresGetPayload<{
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
        }> | null>
>
interface ProcedureGridProps {
    schedule: Schedule;
    startHour: number;
    hours: number;
    firstDay: Date;
    days: daysOfWeek[];
    labId: string;
}
export function ProcedureGrid({ schedule, startHour, hours, firstDay, days, labId }: ProcedureGridProps) {
    return (
        <div
            className='col-start-2 grid-flow-col col-span-5 grid grid-cols-5'
            style={{
                gridRow: `span ${hours} / span ${hours}`,
                gridTemplateRows: `repeat(${hours}, minmax(0, 1fr))`,
            }}
        >
            {
                Object.entries(schedule).map(([dayname, day], indexDay) =>
                    days.includes(dayname as daysOfWeek) && (
                        <>
                            {Object.values(day).map((_, i) => {
                                const act = day[startHour + i]
                                if (act) return (
                                    <div
                                        key={i}
                                        className='p-2 row-span-3 border border-black text-center'
                                        style={{
                                            gridRow: `span ${act.end_date.getHours() - act.start_date.getHours()} / span ${act.end_date.getHours() - act.start_date.getHours()}`,
                                        }}
                                    >
                                        {act.practice_name}
                                    </div>
                                )
                                else return (
                                    <Link
                                        key={i}
                                        className='p-2 border border-black text-center'
                                        href={`/labs/${labId}/new?date=${new Date(
                                            firstDay.getFullYear(),
                                            firstDay.getMonth(),
                                            firstDay.getDate() + indexDay,
                                            startHour + i
                                        ).getTime()}`}
                                    >
                                        libre
                                    </Link>
                                )
                            })}
                        </>
                    )
                )
            }
        </div>
    )
}