'use client'

import { useState } from 'react'
import {
    DropdownInputMultipleSelect,
    Input,
    SubmitPrimaryInput,
} from '@/components/Input'
import { Laboratory, Prisma, Tool, User } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { registerProcedure } from '@/actions/labs'
import { formatDateToInputFormat } from '@/lib/utils'

interface NewProcedureFormProps {
    date: number
    user_id: User['id']
    lab: Prisma.LaboratoryGetPayload<{
        select: {
            id: true
            tools: true
            open_hour: true
            close_hour: true
        }
    }>
}

export function NewProcedureForm(props: NewProcedureFormProps) {
    const sugestedDate = new Date(props.date)
    const toolsOptions = (props.lab.tools || []).map(t => ({
        label: t.name,
        options: Array.from({ length: t.stock }, (_, i) => ({
            value: `${t.id}|${i + 1}`,
            label: `${t.name} x${i + 1}`,
        })),
    }))
    const router = useRouter()
    const [subject, setSubject] = useState('')
    const [practice_name, setPracticeName] = useState('')
    const [students, setStudents] = useState(1)
    const [date, setDate] = useState(formatDateToInputFormat(sugestedDate))
    const [hours, setHours] = useState(1)
    const [selectedTools, setSelectedTools] = useState<string[]>([])

    return (
        <form
            action={async () => {
                const response = await registerProcedure({
                    subject: subject,
                    practice_name: practice_name,
                    start_date: new Date(date),
                    duration: hours * 60,
                    lab_id: props.lab.id,
                    submiter_id: props.user_id,
                    students: students,
                    used_tools: selectedTools.map(tool => ({
                        tool_id: tool.split('|')[0],
                        quantity: Number(tool.split('|')[1]),
                    })),
                })

                if (response.status === 'succes') {
                    router.push('/labs')
                } else {
                    alert('Error al enviar el formulario')
                }
            }}
            className="w-72 p-4 border border-black rounded-lg flex flex-col"
        >
            <Input
                type="text"
                name="subject"
                placeholder="Asignatura"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                required
            />
            <Input
                type="text"
                name="practice_name"
                placeholder="Practica"
                value={practice_name}
                onChange={e => setPracticeName(e.target.value)}
                required
            />
            <Input
                type="datetime-local"
                name="date"
                placeholder="Fecha"
                value={date}
                onChange={e => setDate(e.target.value)}
                onBlur={e => {
                    const d = new Date(e.target.value)
                    d.setMinutes(0)
                    d.setSeconds(0)
                    d.setMilliseconds(0)
                    setDate(formatDateToInputFormat(d))
                }}
                required
                step={3600_000}
            />
            <Input
                type="number"
                name="hours"
                placeholder="Horas de practica"
                value={hours}
                onChange={e => setHours(Number(e.target.value))}
                min={1}
                required
                step={1}
            />
            <Input
                type="number"
                name="students"
                placeholder="Cantidad de Alumnos"
                value={students}
                onChange={e => setStudents(Number(e.target.value))}
                min={1}
                required
                step={1}
            />
            {toolsOptions.length > 0 && (
                <DropdownInputMultipleSelect
                    options={toolsOptions}
                    onChange={e => setSelectedTools(e)}
                />
            )}
            <SubmitPrimaryInput className="mt-2" value="Reservar" />
        </form>
    )
}
