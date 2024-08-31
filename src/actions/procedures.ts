'use server'

import { prisma } from '@/lib/db'

/**
 * Get all procedures between two dates (inclusive)
 * @param labId Laboratory ID
 * @param between Start and end date
 * @returns Procedures
 */
export async function getProcedures(
    /**
     * Laboratory ID
     */
    labId: string,
    /**
     * Start and end date
     */
    between: {
        /**
         * Start date Date.toSting()
         */
        start: string
        /**
         * End date Date.toSting()
         */
        end: string
    },
) {
    return await prisma.procedure.findMany({
        where: {
            lab_id: labId,
            start_date: {
                gte: new Date(between.start),
                lt: new Date(between.end),
            },
        },
    })
}
