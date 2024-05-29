'use client'

import { Input, SubmitInput } from "@/components/Input"

export interface FormProps {
    submit(props: {
        name: string;
        username: string;
        password: string;
    }): Promise<void>
}
export function Form(props: FormProps) {
    const submit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const target = event.target as typeof event.target & {
            name: { value: string },
            username: { value: string },
            password: { value: string },
        }
        await props.submit({
            name: target.name.value,
            username: target.username.value,
            password: target.password.value,
        })
        window.location.reload()
    }
    return (
        <form
          className="w-72 p-4 border border-black rounded-lg flex flex-col"
          onSubmit={submit}
        >
            <Input type='text' placeholder='Nombre del Docente'></Input>
            <Input type="text" placeholder="usuario clave"></Input>
            <Input type='password' placeholder="constraseña"></Input>
            <Input type='password' placeholder="confirmar contraseña"></Input>
            <SubmitInput value="Registrar"></SubmitInput>
        </form>
    )
}