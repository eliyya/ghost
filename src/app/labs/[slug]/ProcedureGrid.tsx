import { AvailableDaysBitfield } from "@/lib/BitField";
import { Prisma } from "@prisma/client";
import Link from "next/link";
import { ProcedureDetailsButton } from "./ProcedureDetailsButton";

export type daysOfWeek = keyof AvailableDaysBitfield['Flags'];
export type Schedule = Record<
    daysOfWeek,
    Record<
        string,
        Prisma.ProcedureGetPayload<{
            include: {
                UsedTool: {
                    select: {
                        quantity: true;
                        tool: true;
                    }
                }
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
                                    <ProcedureDetailsButton
                                        key={act.id}
                                        procedure={act}
                                    />
                                )
                                else return (
                                    <Link
                                        key={indexDay+'-'+i}
                                        className='px-2 py-1 border border-black text-center'
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