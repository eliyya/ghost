import Image from 'next/image'
import Link from 'next/link'
import { NavOptions } from './NavOptions'
import { prisma } from '@/lib/db'

export interface NavProps {
    isAdmin?: boolean
    labs: { name: string; id: string; active?: boolean }[]
    /**
     * Redirect to the selected lab
     * use {lab_id} to replace the id of the selected lab
     */
    redirect?: string
}
// TODO: make independent
// TODO: make vertical
export async function Nav(props: NavProps) {
    const labs = await prisma.laboratory.findMany({})

    return (
        <nav className="flex justify-between items-center align-middle w-full px-2 py-5 bg-[#333]">
            <div className="flex gap-4 flex-1 items-center">
                <Link href={'/'}>
                    <Image
                        src={'/logo.jpg'}
                        alt={'IISE-Logo'}
                        height={10}
                        width={50}
                    />
                </Link>
                <Link href={'/'} className="text-white">
                    Home
                </Link>
                {props.isAdmin && (
                    <Link
                        className="text-white"
                        href={
                            labs.length > 1 ? '/admin/labs' : '/admin/docentes'
                        }
                    >
                        Admin
                    </Link>
                )}
            </div>
            {props.labs.length === 1 && (
                <div className="text-white">{props.labs[0].name}</div>
            )}
            {props.labs.length > 1 && (
                <NavOptions redirect={props.redirect} labs={props.labs} />
            )}
            <div className="flex flex-1 justify-end justify-items-center text">
                <Link className="bg-white rounded-sm p-1" href={'/user'}>
                    <svg viewBox="0 0 60.671 60.671" className="w-8">
                        <ellipse
                            cx="30.336"
                            cy="12.097"
                            rx="11.997"
                            ry="12.097"
                        />
                        <path d="M35.64,30.079H25.031c-7.021,0-12.714,5.739-12.714,12.821v17.771h36.037V42.9,C48.354,35.818,42.661,30.079,35.64,30.079z" />
                    </svg>
                </Link>
            </div>
        </nav>
    )
}
