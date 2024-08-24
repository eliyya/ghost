import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { root } from '@eliyya/type-routes'

export default async function Home() {
    const [lab] = await prisma.laboratory.findMany({
        take: 1,
        select: { name: true },
    })
    if (lab) return redirect(root.labs.$name(lab.name))
    return redirect(root.labs())
}
