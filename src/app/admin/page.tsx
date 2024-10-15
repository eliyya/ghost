import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import roo from '@eliyya/type-routes'
export default async function AdminPage() {
    const labs = await prisma.laboratory.findMany({})
    if (labs.length > 1) return redirect(root.admin.labs())
    return redirect(root.admin.docentes())
}
