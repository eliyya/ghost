'use client'

import { registerLaboratory } from '@/actions/labs'
import { Input, SubmitPrimaryInput } from '@/components/Input'
import { hhmmToMinutes } from '@/lib/utils'
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
                const openHour = hhmmToMinutes(open_date)
                const closeHour = hhmmToMinutes(close_date)
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
