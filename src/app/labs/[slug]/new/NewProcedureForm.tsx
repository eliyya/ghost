'use client'
import { DropdownInputMultipleSelect, Input, SubmitPrimaryInput } from "@/components/Input";
import { Laboratory, Procedure, User } from "@prisma/client";

export interface NewProcedureAction {
    (props: Omit<Procedure, 'id' | 'created_at'>): Promise<{ status: 'error' | 'succes', message: string }>;
}
interface NewProcedureFormProps {
    date: Date;
    lab: Laboratory
    action: NewProcedureAction
    user_id: User['id']
}

export function NewProcedureForm(props: NewProcedureFormProps) {

    let hour = props.date.getHours();
    if (hour < props.lab.open_date.getHours()) hour = props.lab.open_date.getHours();
    if (hour > props.lab.close_date.getHours()) hour = props.lab.close_date.getHours() - 1;

    const startDate = new Date(props.date.getFullYear(), props.date.getMonth(), props.date.getDate(), hour);

    return (
        <form action={async e => {
            console.log(e.get('a'));
            
            // const response = props.action({
            //     subject: e.get('subject') as string,
            //     practice_name: e.get('practice_name') as string,
            //     start_date: new Date(e.get('date') as string),
            //     end_date: new Date(new Date(e.get('date') as string).getDate() + Number(e.get('out') as string) * 3600_000),
            //     lab_id: props.lab.id,
            //     submiter_id: props.user_id,
            //     students: Number(e.get('students') as string),
            // })
        }} className="w-72 p-4 border border-black rounded-lg flex flex-col" >
            <Input
                type="text"
                name="subject"
                placeholder="Asignatura"
                required
            />
            <Input
                type="text"
                name="practice_name"
                placeholder="Practica"
                required

            />
            <Input
                type="datetime-local"
                name="date"
                placeholder="Fecha"
                required
                step={3600000}
                defaultValue={`${startDate.getFullYear()}-${startDate.getMonth().toString().padStart(2, '0')}-${startDate.getDate().toString().padStart(2, '0')}T${startDate.getHours().toString().padStart(2, '0')}:00`}
            />
            <Input
                type="number"
                name="out"
                placeholder="Horas de practica"
                defaultValue={1}
                min={1}
                required
                step={1}
            />
            <Input
                type="number"
                name="students"
                placeholder="Cantidad de Alumnos"
                defaultValue={1}
                min={1}
                required
                step={1}
            />
            <DropdownInputMultipleSelect />
            <SubmitPrimaryInput value="Reservar" />
        </form>
    )
}