import Image from "next/image"

export interface TeacherCardProps {
    id: string
    name: string
}
export function TeacherCard(props: TeacherCardProps) {
    return (
        <div className="bg-white shadow-md mb-5 p-5 rounded-lg hover:-translate-y-1 hover:shadow-lg transition-all" key={props.id}>
        <div className="flex justify-between items-center mb-2">
            <h2>{props.name}</h2>
            <div className='flex gap-4'>
                <Image src="/edit.png" alt="Picture of the author" width={20} height={20} />
                <span className="remove-icon">❌</span>
            </div>
        </div>
    </div>
    )
}