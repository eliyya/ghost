import { AvailableDaysBitfield } from './BitField';

import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
    return new PrismaClient().$extends({
        name: 'serilized_days_lab',
        result: {
            labs: {
                availableDaysBitfield: {
                    needs: {
                        available_days: true,
                    },
                    compute(data) {
                        return new AvailableDaysBitfield(BigInt('0b0' + data.available_days));
                    },
                }
            }
        }
    })
}

declare const globalThis: {
    prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()
if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
export { prisma }