'use client'

import { Input, SubmitPrimaryInput } from "@/components/Input"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export interface FormSubmitFunction {
    (props: {
        name: string;
        stock?: number;
    }): Promise<{ status: 'error' | 'succes', message: string, data?: any }>;
}
export interface FormProps {
    action: FormSubmitFunction
    lab_id: string
}
export function Form(props: FormProps) {
    const router = useRouter()
    return (
        <form
            className="w-72 p-4 border border-black rounded-lg flex flex-col"
            action={async e => {
                const response = await props.action({
                    name: e.get('name') as string,
                    stock: parseInt(e.get('stock') as string)
                })
                if (response.status == 'error') {
                    return router.push(`/admin/labs/${props.lab_id}/tools/${response.data}/more`)
                }
                router.push('/admin/labs')
            }}
        >
            <Input
                type='text'
                placeholder='Nombre del Material'
                name="name"
            />
            <Input
                type="number"
                min={1}
                name="stock"
                placeholder="Cantidad"
            />
            <SubmitPrimaryInput value="Registrar"></SubmitPrimaryInput>
        </form>
    )
}