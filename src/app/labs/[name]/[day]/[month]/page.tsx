import { redirect } from 'next/navigation'
export interface LabsNameProps {
    params: {
        name: string
        day: string
        month: string
    }
}

export default async function LabsNamePage(props: LabsNameProps) {
    redirect(
        `/labs/${props.params.name}/${parseInt(props.params.day)}/${parseInt(
            props.params.month,
        )}/${new Date().getFullYear()}`,
    )
}
