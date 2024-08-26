import { ButtonPrimaryLink } from '@/components/Buttons'
import { Nav } from '@/components/Nav'
import { prisma } from '@/lib/db'
import { verifyAdmin } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { ToolCard } from './ToolCard'

interface ToolsPageProps {
    params: {
        lab_id: string
    }
}
export default async function ToolsPage(prop: ToolsPageProps) {
    await verifyAdmin()
    const { lab_id } = prop.params
    const lab = await prisma.laboratory.findUnique({
        where: {
            id: lab_id,
        },
    })
    if (!lab) redirect('/admin/labs')
    const tools = await prisma.tool.findMany({
        where: {
            lab_id,
        },
    })

    return (
        <>
            <Nav
                isAdmin
                labs={[
                    {
                        id: '',
                        name: `Herramientas de "${lab.name}"`,
                        active: true,
                    },
                ]}
            />
            <main className="flex-1 flex justify-center align-middle items-center py-4">
                <div className="min-w-96 max-w-5xl border border-solid border-[#ddd] rounded-xl overflow-hidden shadow-lg">
                    <div className="p-5 flex flex-col gap-2">
                        <div className="flex gap-4">
                            {tools.length ?
                                tools.map(t => <ToolCard key={t.id} tool={t} />)
                            :   <p className="text-center w-full mb-4">
                                    No hay materiales registrados
                                </p>
                            }
                        </div>
                        <ButtonPrimaryLink
                            href={`/admin/labs/${lab_id}/tools/new`}
                        >
                            {tools.length ?
                                <svg
                                    fill="#ffffff"
                                    viewBox="0 0 27.963 27.963"
                                    className="h-5"
                                >
                                    <path d="M13.98,0C6.259,0,0,6.26,0,13.982s6.259,13.981,13.98,13.981c7.725,0,13.983-6.26,13.983-13.981,C27.963,6.26,21.705,0,13.98,0z M21.102,16.059h-4.939v5.042h-4.299v-5.042H6.862V11.76h5.001v-4.9h4.299v4.9h4.939v4.299H21.102z" />
                                </svg>
                            :   'Registrar Material'}
                        </ButtonPrimaryLink>
                    </div>
                </div>
            </main>
        </>
    )
}
