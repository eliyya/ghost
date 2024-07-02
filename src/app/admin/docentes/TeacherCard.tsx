import Image from "next/image"
import Link from "next/link"

export interface TeacherCardProps {
    id: string
    name: string
    username: string
}
export function TeacherCard(props: TeacherCardProps) {
    return (
        <div className="bg-white shadow-md mb-5 p-5 rounded-lg hover:-translate-y-0.5 hover:shadow-lg transition-all" key={props.id}>
        <div className="flex justify-between items-center align-middle mb-2">
            <div className="flex gap-2 items-center">
                <h2 className="text-lg">
                    {props.name}
                </h2>
                <span className="text-xs" >
                    @{props.username}
                </span>
            </div>
            <div className='flex gap-4'>
                <Image src="/edit.png" alt="Picture of the author" width={20} height={20} />
                <Link href={'/admin/docentes/delete/'+props.id} >❌</Link>
            </div>
        </div>
    </div>
    )
}