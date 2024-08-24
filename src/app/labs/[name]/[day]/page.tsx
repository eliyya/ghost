import { redirect } from 'next/navigation'
export interface LabsNameProps {
    params: {
        name: string
        day: string
    }
}

export default async function LabsNamePage(props: LabsNameProps) {
    redirect(
        `/labs/${props.params.name}/${parseInt(
            props.params.day,
        )}/${new Date().getMonth()}/${new Date().getFullYear()}`,
    )
}
