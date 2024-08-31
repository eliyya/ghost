'use server'

import { snowflake } from '@/lib/constants'
import { prisma } from '@/lib/db'
// TODO: pasar todo a actions separadas
export async function registerProcedure(data: {
    lab_id: string
    submiter_id: string
    subject: string
    /**
     * Number of students
     */
    students: number
    practice_name: string
    start_date: Date
    /**
     * In minutes
     */
    duration: number
    used_tools: {
        tool_id: string
        quantity: number
    }[]
}) {
    try {
        await prisma.procedure.create({
            data: {
                id: snowflake.generate().toString(),
                practice_name: data.practice_name,
                lab_id: data.lab_id,
                start_date: data.start_date,
                duration_in_minutes: data.duration,
                students: data.students,
                subject: data.subject,
                submiter_id: data.submiter_id,
                UsedTool:
                    data.used_tools.length ?
                        {
                            createMany: {
                                data: data.used_tools,
                            },
                        }
                    :   undefined,
            },
        })
        return {
            status: 'succes',
            message: 'Procedimiento creado',
        }
    } catch (error) {
        return {
            status: 'error',
            message: 'Error interno',
        }
    }
}

export async function registerLaboratory(props: {
    name: string
    openHour: number
    closeHour: number
}) {
    try {
        const lab = await prisma.laboratory.findUnique({
            where: {
                name: props.name,
            },
        })
        if (lab) return { status: 'error', message: 'Lab ya existe' }

        await prisma.laboratory.create({
            data: {
                id: snowflake.generate().toString(),
                name: props.name,
                open_hour_in_minutes: props.openHour,
                close_hour_in_minutes: props.closeHour,
            },
        })
        return { status: 'success', message: 'Lab creado con éxito' }
    } catch (error) {
        console.error(error)
        return { status: 'error', message: 'Hubo un error al crear el lab' }
    }
}
