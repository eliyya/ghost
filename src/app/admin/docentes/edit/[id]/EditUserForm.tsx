'use client'
import { ButtonSecondaryLink } from "@/components/Buttons";
import { RetornableInput } from "@/components/EditableInput";
import { Input, SubmitPrimaryInput } from "@/components/Input";
import { useState } from "react";

export interface EditUserAction {
    (props: {
        name: string;
        username: string;
        password?: string;
    }): Promise<{ status: 'error' | 'succes', message: string }>;
}
export interface EditUserFormProps {
    user: {
        name: string
        username: string
    }
    editUser: EditUserAction
}
export function EditUserForm(props: EditUserFormProps) {
    const [passwordError, setPasswordError] = useState<string>("")
    const [password2Error, setPassword2Error] = useState<string>("")
    const [usernameError, setUsernameError] = useState<string>("")
    return (
        <form
            onSubmit={async e => {
                e.preventDefault()

                const formData = new FormData(e.currentTarget)
                const name = formData.get('name') as string
                const username = formData.get('username') as string
                const password = formData.get('password') as string | undefined
                const password2 = formData.get('password2') as string
                
                if (password) {
                    if (!password.match(/[A-Z]/g)) return setPasswordError("La contrasenia debe tener al menos una mayuscula")
                    if (!password.match(/[a-z]/g)) return setPasswordError("La contrasenia debe tener al menos una minuscula")
                    if (!password.match(/[0-9]/g)) return setPasswordError("La contrasenia debe tener al menos un numero")
                    if (!password.match(/[!?_\-+=*&%$#]/g)) return setPasswordError('La contrasenia debe tener al menos un caracter especial')
                    if (password.length < 8) return setPasswordError("La contrasenia debe tener al menos 8 caracteres")
                    if (password.match(/[^A-Za-z0-9!?_\-+=*&%$#]/g)) return setPasswordError("La contrasenia solo puede tener los siguientes caracteres especiales: !?_-=+*&%$#")
    
                    if (password !== password2) return setPassword2Error("Las contrasenias no coinciden")
                }

                const response = await props.editUser({ name, username, password })
                console.log(response);
                
                if (response.status === 'error') {
                    if (response.message === 'Usuario ya existe') return setUsernameError('Ese usuario ya existe')
                    return alert(response.message)
                }
                window.location.replace("/admin/docentes")
            }}
            className="w-72 p-4 border border-black rounded-lg flex flex-col justify-center items-center gap-1 align-middle text-center"
        >
            <RetornableInput
                type="text"
                name="name"
                defaultValue={props.user.name}
                placeholder="Nombre"
            />
            <RetornableInput
                type="text"
                name="username"
                error={usernameError}
                defaultValue={props.user.username}
                placeholder="Usuario Clave"
            />
            <Input
                type="password"
                name="password"
                placeholder="Nueva Contraseña"
                error={passwordError}
            />
            <Input
                type="password"
                name="password2"
                placeholder="Confirmar Contraseña"
                error={password2Error}
            />
            <div className="flex gap-2 w-full *:flex-1" >
                <ButtonSecondaryLink href="/admin/docentes">
                    Cancelar
                </ButtonSecondaryLink>
                <SubmitPrimaryInput value="Editar" />
            </div>
        </form>
    )
}