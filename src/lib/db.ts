import { AvailableDaysBitfield } from './BitField'

import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
    return new PrismaClient().$extends({
        name: 'serilized_days_lab',
        result: {
            laboratory: {
                available_days_array: {
                    needs: {
                        available_days: true,
                    },
                    // @ts-ignore
                    compute(data) {
                        return new AvailableDaysBitfield(
                            data.available_days,
                        ).toArray() as (keyof AvailableDaysBitfield['Flags'])[]
                    },
                },
            },
        },
    })
}

declare const globalThis: {
    prismaGlobal: ReturnType<typeof prismaClientSingleton>
} & typeof global

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()
if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
export { prisma }
