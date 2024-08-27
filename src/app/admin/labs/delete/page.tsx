import { verifyAdmin } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { root } from '@eliyya/type-routes'

export default function page() {
    verifyAdmin()
    redirect(root.admin.labs())
}
