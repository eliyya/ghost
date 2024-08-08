import { Prisma } from "@prisma/client";

export type daysOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday';
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
}
export function ProcedureGrid({ schedule, startHour, hours }: ProcedureGridProps) {
    return (
        <div
            className='bg-red-100 col-start-2 grid-flow-col col-span-5 grid grid-cols-5'
            style={{
                gridRow: `span ${hours} / span ${hours}`,
                gridTemplateRows: `repeat(${hours}, minmax(0, 1fr))`,
            }}
        >
            {Object.values(schedule).map(day => (
                <>
                    {Object.values(day).map((_, index) => {
                        const act = day[startHour + index]
                        if (act) {
                            const hours = act.end_date.getHours() - act.start_date.getHours();
                            return (
                                <div
                                    key={index}
                                    className='p-2 row-span-3 border border-black text-center'
                                    style={{
                                        gridRow: `span ${hours} / span ${hours}`,
                                    }}
                                >
                                    {act.practice_name}
                                </div>
                            )
                        }
                        else return <button className='p-2 border border-black text-center' key={index}> libre </button>
                    })}
                </>
            ))}
        </div>
    )
}