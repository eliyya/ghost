import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'

export default async function AdminPage() {
    const labs = await prisma.laboratory.findMany({})
    if (labs.length > 1) return redirect('/admin/labs')
    return redirect('/admin/docentes')
}
