import { root } from '@eliyya/type-routes'
import { redirect } from 'next/navigation'
export default async function AdminDocentesDeletePage() {
    redirect(root.admin.docentes())
}
