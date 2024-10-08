import { redirect } from 'next/navigation'
export interface LabsNameProps {
    params: {
        name: string
    }
}

export default async function LabsNamePage(props: LabsNameProps) {
    redirect(
        `/labs/${props.params.name}/${new Date().toLocaleDateString('es')}`,
    )
}
