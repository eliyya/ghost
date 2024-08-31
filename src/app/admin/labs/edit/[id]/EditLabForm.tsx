'use client'
import { ButtonSecondaryLink } from '@/components/Buttons'
import { RetornableInput } from '@/components/EditableInput'
import { SubmitPrimaryInput } from '@/components/Input'
import { minutesToHHMM } from '@/lib/utils'
import { Prisma } from '@prisma/client'
import { useState } from 'react'

export interface EditLabAction {
    (props: {
        name: string
        openHour: number
        closeHour: number
    }): Promise<{ status: 'error' | 'succes'; message: string }>
}
export interface EditLabFormProps {
    lab: Prisma.LaboratoryGetPayload<{
        select: {
            name: true
            open_hour_in_minutes: true
            close_hour_in_minutes: true
        }
    }>
    action: EditLabAction
}
export function EditLabForm(props: EditLabFormProps) {
    const [usernameError, setUsernameError] = useState('')

    return (
        <form
            action={async e => {
                const name = e.get('name') as string
                const [open_hour, open_minutes] = (
                    e.get('open_hour') as string
                ).split(':')
                const openHour =
                    Number(open_hour) * 360 + Number(open_minutes) * 60
                const [close_hour, close_minutes] = (
                    e.get('close_hour') as string
                ).split(':')
                const closeHour =
                    Number(close_hour) * 360 + Number(close_minutes) * 60

                const response = await props.action({
                    name,
                    openHour,
                    closeHour,
                })

                if (response.status === 'error') {
                    // TODO: validate all errors
                    if (response.message === 'Usuario ya existe')
                        return setUsernameError('Ese usuario ya existe')
                    return alert(response.message)
                }
                window.location.replace('/admin/docentes') // TODO: replace with redirect
            }}
            className="w-72 p-4 border border-black rounded-lg flex flex-col justify-center items-center gap-1 align-middle text-center *:w-full"
        >
            <RetornableInput
                type="text"
                name="name"
                defaultValue={props.lab.name}
                placeholder="Nombre del Laboratorio"
                required
            />
            <RetornableInput
                type="time"
                name="open_hour"
                error={usernameError}
                defaultValue={minutesToHHMM(props.lab.open_hour_in_minutes)}
                // TODO: validate that open_date is before close_date and in horary range of the lab
                placeholder="Hora de Aperetura"
                required
            />
            <RetornableInput
                type="time"
                name="close_hour"
                error={usernameError}
                defaultValue={minutesToHHMM(props.lab.close_hour_in_minutes)}
                // TODO: validate that close_date is after open_date and in horary range of the lab
                min={minutesToHHMM(props.lab.open_hour_in_minutes)}
                placeholder="Hora de Cierre"
                required
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
