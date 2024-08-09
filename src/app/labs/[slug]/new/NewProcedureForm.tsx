import { Input, SubmitPrimaryInput } from "@/components/Input";
import { Laboratory } from "@prisma/client";

interface NewProcedureFormProps {
    date: Date;
    lab: Laboratory
}

export function NewProcedureForm(props: NewProcedureFormProps) {

    let hour = props.date.getHours();
    if (hour < props.lab.open_date.getHours()) hour = props.lab.open_date.getHours();
    if (hour > props.lab.close_date.getHours()) hour = props.lab.close_date.getHours() - 1;

    const startDate = new Date(props.date.getFullYear(), props.date.getMonth(), props.date.getDate(), hour);

    return (
        <form action="" className="w-72 p-4 border border-black rounded-lg flex flex-col" >
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
            <SubmitPrimaryInput value="Reservar" />
        </form>
    )
}