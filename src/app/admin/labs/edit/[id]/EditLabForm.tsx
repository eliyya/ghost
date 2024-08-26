'use client'
import { ButtonSecondaryLink } from '@/components/Buttons'
import { RetornableInput } from '@/components/EditableInput'
import { SubmitPrimaryInput } from '@/components/Input'
import { useState } from 'react'

export interface EditLabAction {
    (props: {
        name: string
        open_date: Date
        close_date: Date
    }): Promise<{ status: 'error' | 'succes'; message: string }>
}
export interface EditLabFormProps {
    lab: {
        name: string
        open_date: Date
        close_date: Date
    }
    action: EditLabAction
}
export function EditLabForm(props: EditLabFormProps) {
    const [usernameError, setUsernameError] = useState('')
    const dateToTime = (date: Date) =>
        `${date.getUTCHours().toString().padStart(2, '0')}:${date.getUTCMinutes().toString().padStart(2, '0')}`

    return (
        <form
            action={async e => {
                const name = e.get('name') as string
                const open_date = new Date(
                    '2024-01-01T' + e.get('open_date') + ':00.000Z',
                )
                const close_date = new Date(
                    '2024-01-01T' + e.get('close_date') + ':00.000Z',
                )

                const response = await props.action({
                    name,
                    open_date,
                    close_date,
                })

                if (response.status === 'error') {
                    if (response.message === 'Usuario ya existe')
                        return setUsernameError('Ese usuario ya existe')
                    return alert(response.message)
                }
                window.location.replace('/admin/docentes')
            }}
            className="w-72 p-4 border border-black rounded-lg flex flex-col justify-center items-center gap-1 align-middle text-center *:w-full"
        >
            <RetornableInput
                type="text"
                name="name"
                defaultValue={props.lab.name}
                placeholder="Nombre del Laboratorio"
            />
            <RetornableInput
                type="time"
                name="username"
                error={usernameError}
                defaultValue={dateToTime(props.lab.open_date)}
                placeholder="Hora de Aperetura"
            />
            <RetornableInput
                type="time"
                name="username"
                error={usernameError}
                defaultValue={dateToTime(props.lab.close_date)}
                min={dateToTime(props.lab.open_date)}
                placeholder="Hora de Cierre"
            />
            <div className="flex gap-2 w-full *:flex-1">
                <ButtonSecondaryLink href="/admin/docentes">
                    Cancelar
                </ButtonSecondaryLink>
                <SubmitPrimaryInput value="Editar" />
            </div>
        </form>
    )
}
