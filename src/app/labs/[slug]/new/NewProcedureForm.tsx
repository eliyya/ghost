'use client'
import { DropdownInputMultipleSelect, Input, SubmitPrimaryInput } from "@/components/Input";
import { Laboratory, Prisma, Procedure, Tool, User } from "@prisma/client";
import { useRouter } from "next/navigation";

export interface NewProcedureAction {
    (props: Omit<Prisma.ProcedureGetPayload<{include:{tools:{select:{id: true}}}}>, 'id' | 'created_at'>): Promise<{ status: 'error' | 'succes', message: string }>;
}
interface NewProcedureFormProps {
    date: Date;
    open_date: Date;
    close_date: Date;
    action: NewProcedureAction
    user_id: User['id']
    tools?: Tool[]
    lab_id: Laboratory['id']
}

export function NewProcedureForm(props: NewProcedureFormProps) {
    const router = useRouter();
    let hour = props.date.getHours();
    if (hour < props.open_date.getHours()) hour = props.open_date.getHours();
    if (hour > props.close_date.getHours()) hour = props.close_date.getHours() - 1;

    const startDate = new Date(props.date.getFullYear(), props.date.getMonth(), props.date.getDate(), hour);

    return (
        <form action={async e => {            
            const response = props.action({
                subject: e.get('subject') as string,
                practice_name: e.get('practice_name') as string,
                start_date: new Date(e.get('date') as string),
                end_date: new Date(
                    new Date(e.get('date') as string).getTime() 
                    + (Number(e.get('out') as string) * 1000 * 60 * 60)
                ),
                lab_id: props.lab_id,
                submiter_id: props.user_id,
                students: Number(e.get('students') as string),
                tools: e.getAll('tools').filter(Boolean).map(t => ({ id: (t as string).split('|')[0] }))
            })
            router.push('/labs');   
            
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
                defaultValue={`${startDate.getFullYear()}-${(startDate.getMonth()+1).toString().padStart(2, '0')}-${startDate.getDate().toString().padStart(2, '0')}T${startDate.getHours().toString().padStart(2, '0')}:00`}
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
            {props.tools?.length && (
                <DropdownInputMultipleSelect 
                    name="tools"
                    placeholder="Herramientas"
                    options={props.tools.map(t => ({ label: t.name, options: Array.from({ length: t.stock }, (_, i) => ({ value: `${t.id}|${i+1}`, label: `${t.name} x${i+1}` })) }))}
                />  
            )}
            <SubmitPrimaryInput className="mt-2" value="Reservar" />
        </form>
    )
}