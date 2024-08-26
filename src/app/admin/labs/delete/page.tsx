import { verifyAdmin } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default function page() {
    verifyAdmin()
    redirect('/admin/labs')
}
