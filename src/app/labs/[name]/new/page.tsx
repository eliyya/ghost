import { Nav } from '@/components/Nav'
import { getVerifiedUser } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import { NewProcedureForm } from './NewProcedureForm'
import { wrapper } from '@/lib/utils'

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
        select: {
            close_hour_in_minutes: true,
            open_hour_in_minutes: true,
            tools: true,
            id: true,
            available_days: true,
        },
    }))!
    const user = await getVerifiedUser()
    let [, searchDate] =
        wrapper(() => new Date(parseInt(props.searchParams.date!))) ||
        new Date()
    searchDate ??= new Date()
    searchDate.setMilliseconds(0)
    searchDate.setSeconds(0)
    searchDate.setMinutes(0)
    if (searchDate.getHours() < Math.floor(lab.open_hour_in_minutes / 60)) {
        searchDate.setHours(Math.floor(lab.open_hour_in_minutes / 60))
    }
    if (searchDate.getHours() > Math.floor(lab.close_hour_in_minutes / 60)) {
        searchDate.setHours(Math.floor(lab.close_hour_in_minutes / 60))
    }

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
                    date={searchDate.getTime()}
                    lab={lab}
                />
            </main>
        </>
    )
}
