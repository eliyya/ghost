'use client'

import { Input, SubmitPrimaryInput } from '@/components/Input'
import { useRouter } from 'next/navigation'
export interface FormSubmitFunction {
    (
        props: FormData,
    ): Promise<{ status: 'error' | 'succes'; message: string; data?: any }>
    // (props: {
    //     name: string;
    //     stock?: number;
    //     image?: File
    // }): Promise<{ status: 'error' | 'succes', message: string, data?: any }>;
}
export interface FormProps {
    action: FormSubmitFunction
    lab_id: string
}
export function Form(props: FormProps) {
    const router = useRouter()
    const { lab_id } = props
    return (
        <form
            className="w-72 p-4 border border-black rounded-lg flex flex-col"
            action={async e => {
                const response = await props.action(e)
                if (response.status == 'error') {
                    return router.push(
                        `/admin/labs/${lab_id}/tools/${response.data}/more`,
                    )
                }
                router.push(`/admin/labs/${lab_id}/tools`)
            }}
        >
            <Input type="text" placeholder="Nombre del Material" name="name" />
            <Input
                type="number"
                min={1}
                name="stock"
                defaultValue={1}
                placeholder="Cantidad"
            />
            <Input type="file" name="image" />
            <SubmitPrimaryInput value="Registrar"></SubmitPrimaryInput>
        </form>
    )
}
