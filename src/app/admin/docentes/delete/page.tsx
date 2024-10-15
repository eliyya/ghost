import { verifyAdmin } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { root } from '@eliyya/type-routes'
export default async function AdminDocentesDeletePage() {
    await verifyAdmin()
    redirect(root.admin.docentes())
}
