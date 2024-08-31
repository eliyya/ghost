'use client'

import { useEffect, useState } from 'react'
import {
    DropdownInputMultipleSelect,
    Input,
    SubmitPrimaryInput,
} from '@/components/Input'
import { Prisma, Procedure, User } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { registerProcedure } from '@/actions/labs'
import { DateToInputFormat } from '@/lib/utils'
import { AvailableDaysBitfield } from '@/lib/BitField'
import { getProcedures } from '@/actions/procedures'

interface NewProcedureFormProps {
    date: number
    user_id: User['id']
    lab: Prisma.LaboratoryGetPayload<{
        select: {
            id: true
            tools: true
            open_hour_in_minutes: true
            close_hour_in_minutes: true
            available_days: true
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
    const [date, setDate] = useState(DateToInputFormat(sugestedDate))
    const [dateError, setDateError] = useState('')
    const [hours, setHours] = useState(1)
    const [selectedTools, setSelectedTools] = useState<string[]>([])
    const [maxHours, setMaxHours] = useState(24)
    const [errorHours, setErrorHours] = useState('')
    const [proceduresCache, setProceduresCache] = useState<
        Record<string, Procedure[]>
    >({})
    const minumumDate = new Date()
    minumumDate.setHours(
        Math.floor(props.lab.open_hour_in_minutes / 60),
        props.lab.open_hour_in_minutes % 60,
    )
    useEffect(() => {
        const d = new Date(date)
        d.setMinutes(0)
        d.setSeconds(0)
        d.setMilliseconds(0)
        const maxHours =
            Math.floor(props.lab.close_hour_in_minutes / 60) - d.getHours()
        setMaxHours(maxHours)
        if (hours > maxHours)
            setErrorHours(
                `La duración excede el horario de ${Math.floor(props.lab.open_hour_in_minutes / 60)} a ${Math.floor(props.lab.close_hour_in_minutes / 60)}`,
            )
    }, [date, props.lab, hours])

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
                    console.error(response)
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
                onChange={e => {
                    setDateError('')
                    setDate(e.target.value)
                }}
                error={dateError}
                onBlur={async e => {
                    const d = new Date(e.target.value)
                    d.setMinutes(0)
                    d.setSeconds(0)
                    d.setMilliseconds(0)
                    if (d < minumumDate)
                        setDateError(
                            `No se puede reservar un dia anterior a hoy`,
                        )
                    // validate day of week in range of lab open days
                    if (
                        adjustDateToActiveDay(d, props.lab.available_days) !== d
                    )
                        setDateError(
                            'El laboratorio no está disponible en este día',
                        )
                    // validate hour in range of lab open hours
                    if (
                        d.getHours() <
                        Math.floor(props.lab.open_hour_in_minutes / 60)
                    )
                        setDateError(
                            `El laboratorio abre a las ${Math.floor(props.lab.open_hour_in_minutes / 60)}`,
                        )

                    if (
                        d.getHours() >
                        Math.floor(props.lab.close_hour_in_minutes / 60) - 1
                    )
                        setDateError(
                            `El laboratorio cierra a las ${Math.floor(props.lab.close_hour_in_minutes / 60)}`,
                        )
                    // validar que el horario no se cruce con otro procedimiento
                    let procedures = proceduresCache[d.toLocaleDateString()]
                    if (!procedures) {
                        procedures = await getProcedures(props.lab.id, {
                            start: d.toString(),
                            end: d.toString(),
                        })
                        // cachear los procedimientos de un laboratorio en un día
                        setProceduresCache({
                            ...proceduresCache,
                            [d.toLocaleDateString()]: procedures,
                        })
                    }
                    const start = d.getHours() * 60 + d.getMinutes()
                    const end = start + hours * 60
                    console.log({ procedures }) // TODO: Don't works

                    const isOverlapping = procedures.some(p => {
                        const pStart =
                            p.start_date.getHours() * 60 +
                            p.start_date.getMinutes()
                        const pEnd = pStart + p.duration_in_minutes
                        console.log({ start, end, pStart, pEnd })

                        return (
                            (start >= pStart && start < pEnd) ||
                            (end > pStart && end <= pEnd)
                        )
                    })
                    if (isOverlapping) {
                        setDateError(
                            'El horario se cruza con otro procedimiento',
                        )
                    }
                    setDate(DateToInputFormat(d))
                }}
                step={3600}
                required
            />
            <Input
                type="number"
                name="hours"
                placeholder="Horas de practica"
                value={hours}
                onChange={e => {
                    setHours(Number(e.target.value))
                    setErrorHours('')
                }}
                min={1}
                max={maxHours}
                error={errorHours}
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
        // TODO: Mostrar procedimientos del dia en el que se está creando el procedimiento
    )
}

function adjustDateToActiveDay(date: Date, activeDays: number): Date {
    const dayOfWeek = date.getDay() // Obtiene el día de la semana (0=domingo, 1=lunes, ..., 6=sábado)

    const avivableBit = new AvailableDaysBitfield(activeDays)
    // Verifica si el día de la semana actual está activo en el binario
    if (avivableBit.has(1 << dayOfWeek)) {
        return date // El día es válido, retorna la fecha original
    }

    // Si el día no está activo, busca el primer día activo
    for (let i = 0; i < 7; i++) {
        if ((activeDays & (1 << i)) !== 0) {
            // Ajusta la fecha al primer día activo encontrado
            const adjustedDate = new Date(date)
            adjustedDate.setDate(date.getDate() + ((i - dayOfWeek + 7) % 7))
            return adjustedDate
        }
    }

    // En caso de que no haya días activos, retorna la fecha original (esto no debería ocurrir)
    return date
}
