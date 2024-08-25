import { Nav } from '@/components/Nav'
import { getVerifiedUser } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import { NewProcedureForm } from './NewProcedureForm'

interface LabsNewPageProps {
    params: {
        name: string
    }
    searchParams: {
        date?: string
    }
}
export default async function LabsNewPage(props: LabsNewPageProps) {
    const labs = await prisma.laboratory.findMany({})
    const formatedName = props.params.name
        .trim()
        .replace(/-+/g, ' ')
        .toLowerCase()
    const id = labs.find(
        l => l.name.trim().replace(/-+/g, ' ').toLowerCase() === formatedName,
    )?.id
    if (!id) redirect('/labs')
    const lab = (await prisma.laboratory.findFirst({
        where: {
            id,
        },
        include: {
            tools: true,
        },
    }))!
    const user = await getVerifiedUser()
    const today = new Date()
    const searchDate = new Date(parseInt(props.searchParams.date!) || today)
    const minimumDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        lab.open_date.getHours(),
    )

    return (
        <>
            <Nav
                labs={labs.map(l => ({
                    ...l,
                    active:
                        l.name.trim().replace(/-+/g, ' ').toLowerCase() ===
                        formatedName,
                }))}
                isAdmin={user.admin}
            />
            <main className="flex flex-col flex-1 justify-center items-center">
                <NewProcedureForm
                    user_id={user.id}
                    date={searchDate}
                    open_date={lab.open_date}
                    close_date={lab.close_date}
                    tools={lab.tools}
                    lab_id={lab.id}
                />
            </main>
        </>
    )
}
