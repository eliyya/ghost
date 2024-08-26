import { verifyAdmin } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function AdminDocentesDeletePage() {
    await verifyAdmin()
    redirect('/admin/docentes')
}
