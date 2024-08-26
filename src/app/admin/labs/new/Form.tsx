'use client'

import { registerLaboratory } from '@/actions/labs'
import { Input, SubmitPrimaryInput } from '@/components/Input'
import { useState } from 'react'

export function Form() {
    const [name, setName] = useState<string>('')
    const [open_date, setOpenDate] = useState<string>('07:00')
    const [close_date, setCloseDate] = useState<string>('19:00')
    const [errorName, setErrorName] = useState<string>('')

    return (
        <form
            className="w-72 p-4 border border-black rounded-lg flex flex-col"
            action={async () => {
                const [open_hour, open_minutes] = open_date.split(':')
                const openHour =
                    Number(open_hour) * 360 + Number(open_minutes) * 60
                const [close_hour, close_minutes] = close_date.split(':')
                const closeHour =
                    Number(close_hour) * 360 + Number(close_minutes) * 60
                const response = await registerLaboratory({
                    closeHour,
                    name,
                    openHour,
                })
                if (response.status === 'error') alert(response.message)
                else window.location.href = '/admin'
            }}
        >
            <Input
                type="text"
                placeholder="Nombre del laboratorio"
                name="name"
                value={name}
                onChange={e => {
                    setName(e.target.value)
                    setErrorName('')
                }}
                error={errorName}
                required
            />
            <Input
                type="time"
                placeholder="Hora de apertura"
                name="open_date"
                value={open_date}
                onChange={e => setOpenDate(e.target.value)}
                // TODO: validate that open_date is before close_date and in horary range of the lab
                step={3600000}
                required
            />
            <Input
                type="time"
                placeholder="Hora de cierre"
                step={3600000}
                name="close_date"
                value={close_date}
                // TODO: validate that close_date is after open_date and in horary range of the lab
                onChange={e => setCloseDate(e.target.value)}
                required
            />
            <SubmitPrimaryInput value="Registrar" />
        </form>
    )
}
