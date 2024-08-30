import Image from 'next/image'
import { LoginForm } from './client'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import { Nav } from '@/components/Nav'

export default async function login() {
    const users = await prisma.user.findMany()
    if (users.length === 0) redirect('/admin/new')

    return (
        <main className="h-screen w-screen flex flex-col">
            <Nav labs={[{ id: '', name: 'Login', active: true }]} />
            <div className="flex justify-center items-center flex-1">
                <LoginForm />
                <div className="absolute">
                    <Image
                        src="/img/unnamed.jpg"
                        alt=""
                        width={100}
                        height={100}
                    />
                </div>
            </div>
        </main>
    )
}
