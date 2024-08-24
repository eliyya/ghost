'use client'

import { Input, SubmitPrimaryInput } from '@/components/Input'
import { parseName } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export interface NewAdminFormSubmitFunction {
    (props: { name: string; username: string; password: string }): Promise<{
        status: 'error' | 'succes'
        message: string
    }>
}
export interface NewAdminFormProps {
    submit: NewAdminFormSubmitFunction
}
export function NewAdminForm(props: NewAdminFormProps) {
    const [name, setName] = useState<string>('')
    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [password2, setPassword2] = useState<string>('')
    const [passwordError, setPasswordError] = useState<string>('')
    const [password2Error, setPassword2Error] = useState<string>('')
    const router = useRouter()

    const submit = async () => {
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
            name: name,
            username: username,
            password: password,
        })
        router.push('/admin/docentes')
    }

    return (
        <form
            className="w-72 p-4 border border-black rounded-lg flex flex-col"
            action={submit}
        >
            <Input
                type="text"
                placeholder="Nombre del Administrador"
                name="name"
                value={name}
                onChange={e => setName(parseName(e.target.value))}
            />
            <Input
                type="text"
                name="username"
                placeholder="Usuario Clave"
                prefix="@"
                value={username}
                onChange={e =>
                    setUsername(
                        e.target.value.toLowerCase().replace(/[@ \!\\\/]/g, ''),
                    )
                }
            />
            <Input
                type="password"
                placeholder="Constraseña"
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
