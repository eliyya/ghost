'use client'

import { Input, SubmitPrimaryInput } from '@/components/Input'
import { FormEvent, useState } from 'react'

export interface FormSubmitFunction {
    (props: {
        name: string
        username: string
        password: string
    }): Promise<{ status: 'error' | 'succes'; message: string }>
}
export interface FormProps {
    submit: FormSubmitFunction
}
export function Form(props: FormProps) {
    const [usernameError, setUsernameError] = useState<string>('')
    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [password2, setPassword2] = useState<string>('')
    const [passwordError, setPasswordError] = useState<string>('')
    const [password2Error, setPassword2Error] = useState<string>('')

    const submit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const target = event.target as typeof event.target & {
            name: { value: string }
        }
        if (!password.match(/[A-Z]/g))
            return setPasswordError(
                'La contrasenia debe tener al menos una mayuscula',
            )
        if (!password.match(/[a-z]/g))
            return setPasswordError(
                'La contrasenia debe tener al menos una minuscula',
            )
        if (!password.match(/[0-9]/g))
            return setPasswordError(
                'La contrasenia debe tener al menos un numero',
            )
        if (!password.match(/[!?_\-+=*&%$#]/g))
            return setPasswordError(
                'La contrasenia debe tener al menos un caracter especial',
            )
        if (password.length < 8)
            return setPasswordError(
                'La contrasenia debe tener al menos 8 caracteres',
            )
        if (password.match(/[^A-Za-z0-9!?_\-+=*&%$#]/g))
            return setPasswordError(
                'La contrasenia solo puede tener los siguientes caracteres especiales: !?_-=+*&%$#',
            )
        // check password
        if (password != password2)
            return setPassword2Error('Las contrasenias no coinciden')
        // check username
        const response = await props.submit({
            name: target.name.value,
            username: username,
            password: password,
        })
        if (response.status == 'error')
            return setUsernameError(response.message)
        window.location.replace('/admin/docentes')
    }

    return (
        <form
            className="w-72 p-4 border border-black rounded-lg flex flex-col"
            onSubmit={submit}
        >
            <Input type="text" placeholder="Nombre del Docente" name="name" />
            <Input
                type="text"
                name="username"
                placeholder="Usuario clave"
                prefix="@"
                error={usernameError}
                value={username}
                onChange={e => {
                    setUsername(e.target.value.toLowerCase())
                    setUsernameError('')
                }}
            />
            <Input
                type="password"
                placeholder="constraseña"
                name="password"
                value={password}
                error={passwordError}
                onChange={e => {
                    setPassword(e.target.value)
                    setPasswordError('')
                }}
            />
            <Input
                type="password"
                placeholder="Confirmar Contraseña"
                name="password2"
                value={password2}
                error={password2Error}
                onChange={e => {
                    setPassword2(e.target.value)
                    setPassword2Error('')
                }}
            />
            <SubmitPrimaryInput value="Registrar"></SubmitPrimaryInput>
        </form>
    )
}
