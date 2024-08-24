import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'

export default async function LabsPage() {
    const labs = await prisma.laboratory.findMany({
        select: { name: true },
    })
    if (!labs.length) redirect('/labs/null')
    if (labs.length === 1)
        redirect(`/labs/${labs[0].name.replace(/\s/g, '-').toLowerCase()}`)

    return <div>Si puedes imaginarlo puedes programarlo</div>
}
