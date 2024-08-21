
'use client';

import { ChangeEventHandler, useState } from "react";
import { DropdownInputMultipleSelect, Input, SubmitPrimaryInput } from "@/components/Input";
import { Laboratory, Prisma, Procedure, Tool, User } from "@prisma/client";
import { useRouter } from "next/navigation";

export interface NewProcedureAction {
    (props: Omit<Prisma.ProcedureGetPayload<{
        include: {
            UsedTool: {
                select: {
                    quantity: true;
                    tool_id: true;
                }
            }
        }
    }>, 'id' | 'created_at'>): Promise<{ status: 'error' | 'succes', message: string }>;
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
    const tools = props.tools ? props.tools.map(t => ({ label: t.name, options: Array.from({ length: t.stock }, (_, i) => ({ value: `${t.id}|${i + 1}`, label: `${t.name} x${i + 1}` })) })) : []
    const router = useRouter();
    const [formData, setFormData] = useState<{
        subject: string
        practice_name: string
        date: string
        out: number
        students: number
        tools: typeof tools
    }>({
        subject: "",
        practice_name: "",
        date: "",
        out: 1,
        students: 1,
        tools: []
    });
    const [selectedTool, setSelectedTool] = useState("");

    let hour = props.date.getHours();
    if (hour < props.open_date.getHours()) hour = props.open_date.getHours();
    if (hour > props.close_date.getHours()) hour = props.close_date.getHours() - 1;

    const startDate = new Date(props.date.getFullYear(), props.date.getMonth(), props.date.getDate(), hour);

    const handleInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleAddTool = () => {
        if (selectedTool && !formData.tools.includes(selectedTool)) {
            setFormData({
                ...formData,
                tools: [...formData.tools, selectedTool] // Añade la herramienta seleccionada a la lista
            });
            setSelectedTool(""); // Resetea el valor seleccionado
        }
    };

    const handleRemoveTool = (tool) => {
        setFormData({
            ...formData,
            tools: formData.tools.filter(t => t !== tool) // Remueve la lista
        });
    };


    return (
        <form action={async (e) => {
            const response = await props.action({
                subject: formData.subject,
                practice_name: formData.practice_name,
                start_date: new Date(formData.date),
                end_date: new Date(new Date(formData.date).getTime() + (formData.out * 1000 * 60 * 60)),
                lab_id: props.lab_id,
                submiter_id: props.user_id,
                students: formData.students,
                UsedTool: formData.tools.map(tool => ({
                    tool_id: tool.split('|')[0],
                    quantity: Number(tool.split('|')[1])
                }))
            });
    
            if (response.status === 'success') {
                router.push('/labs');
            } else {
                alert('Error al enviar el formulario');
            }
        }} className="w-72 p-4 border border-black rounded-lg flex flex-col">
            <Input
                type="text"
                name="subject"
                placeholder="Asignatura"
                value={formData.subject}
                onChange={handleInputChange}
                required
            />
            <Input
                type="text"
                name="practice_name"
                placeholder="Practica"
                value={formData.practice_name}
                onChange={handleInputChange}
                required
            />
            <Input
                type="datetime-local"
                name="date"
                placeholder="Fecha"
                value={formData.date}
                onChange={handleInputChange}
                required
                step={3600000}
                defaultValue={`${startDate.getFullYear()}-${(startDate.getMonth() + 1).toString().padStart(2, '0')}-${startDate.getDate().toString().padStart(2, '0')}T${startDate.getHours().toString().padStart(2, '0')}:00`}
            />
            <Input
                type="number"
                name="out"
                placeholder="Horas de practica"
                value={formData.out}
                onChange={handleInputChange}
                min={1}
                required
                step={1}
            />
            <Input
                type="number"
                name="students"
                placeholder="Cantidad de Alumnos"
                value={formData.students}
                onChange={handleInputChange}
                min={1}
                required
                step={1}
            />

            {/* Selección de herramientas muchos detalles planificando estilos*/}
            {props.tools?.length && (
                <div className="flex flex-col gap-2">
                    <div className="flex  items-center gap-2">
                        <select className="min-w-40" value={selectedTool} onChange={(e) => setSelectedTool(e.target.value)}>
                            <option value="" disabled>Selecciona una herramienta</option>
                            {props.tools.map(tool => (
                                <option key={tool.id} value={`${tool.id}|1`}>
                                    {tool.name}
                                </option>
                            ))}
                        </select>
                        <button type="button" onClick={handleAddTool} className="px-2 py-1 bg-blue-500 text-white rounded">Añadir</button>
                    </div>

                    {/* Lista de herramientas seleccionadas ay detalles soluciones en proceso */}
                    {formData.tools.length > 0 && (
                        <div className="mt-4">
                            <h4 className="font-semibold mb-2">Herramientas seleccionadas:</h4>
                            <ul>
                                {formData.tools.map((tool, index) => (
                                    <li key={index} className="flex justify-between items-center mb-1">
                                        {props.tools.find(t => t.id === tool.split('|')[0])?.name} x {tool.split('|')[1]}
                                        <button type="button" onClick={() => handleRemoveTool(tool)} className="ml-4 text-red-500">Eliminar</button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}

            <SubmitPrimaryInput className="mt-2" value="Reservar" />
        </form>
    )
}



// 'use client';
// import { DropdownInputMultipleSelect, Input, SubmitPrimaryInput } from "@/components/Input";
// import { Laboratory, Prisma, Procedure, Tool, User } from "@prisma/client";
// import { useRouter } from "next/navigation";

// export interface NewProcedureAction {
//     (props: Omit<Prisma.ProcedureGetPayload<{
//         include: {
//             UsedTool: {
//                 select: {
//                     quantity: true;
//                     tool_id: true;
//                 }
//             }
//         }
//     }>, 'id' | 'created_at'>): Promise<{ status: 'error' | 'succes', message: string }>;
// }
// interface NewProcedureFormProps {
//     date: Date;
//     open_date: Date;
//     close_date: Date;
//     action: NewProcedureAction
//     user_id: User['id']
//     tools?: Tool[]
//     lab_id: Laboratory['id']
// }

// export function NewProcedureForm(props: NewProcedureFormProps) {
//     const router = useRouter();
//     let hour = props.date.getHours();
//     if (hour < props.open_date.getHours()) hour = props.open_date.getHours();
//     if (hour > props.close_date.getHours()) hour = props.close_date.getHours() - 1;

//     const startDate = new Date(props.date.getFullYear(), props.date.getMonth(), props.date.getDate(), hour);

//     return (
//         <form action={async e => {
//             const response = props.action({
//                 subject: e.get('subject') as string,
//                 practice_name: e.get('practice_name') as string,
//                 start_date: new Date(e.get('date') as string),
//                 end_date: new Date(
//                     new Date(e.get('date') as string).getTime()
//                     + (Number(e.get('out') as string) * 1000 * 60 * 60)
//                 ),
//                 lab_id: props.lab_id,
//                 submiter_id: props.user_id,
//                 students: Number(e.get('students') as string),
//                 UsedTool: e.getAll('tools').filter(Boolean).map(t => ({
//                     tool_id: (t as string).split('|')[0],
//                     quantity: Number((t as string).split('|')[1])
//                 }))
//             })
//             router.push('/labs');

//         }} className="w-72 p-4 border border-black rounded-lg flex flex-col" >
//             <Input
//                 type="text"
//                 name="subject"
//                 placeholder="Asignatura"
//                 required
//             />
//             <Input
//                 type="text"
//                 name="practice_name"
//                 placeholder="Practica"
//                 required

//             />
//             <Input
//                 type="datetime-local"
//                 name="date"
//                 placeholder="Fecha"
//                 required
//                 step={3600000}
//                 defaultValue={`${startDate.getFullYear()}-${(startDate.getMonth() + 1).toString().padStart(2, '0')}-${startDate.getDate().toString().padStart(2, '0')}T${startDate.getHours().toString().padStart(2, '0')}:00`}
//             />
//             <Input
//                 type="number"
//                 name="out"
//                 placeholder="Horas de practica"
//                 defaultValue={1}
//                 min={1}
//                 required
//                 step={1}
//             />
//             <Input
//                 type="number"
//                 name="students"
//                 placeholder="Cantidad de Alumnos"
//                 defaultValue={1}
//                 min={1}
//                 required
//                 step={1}
//             />
//             {props.tools?.length && (
//                 <DropdownInputMultipleSelect
//                     name="tools"
//                     placeholder="Herramientas"
//                     options={props.tools.map(t => ({ label: t.name, options: Array.from({ length: t.stock }, (_, i) => ({ value: `${t.id}|${i + 1}`, label: `${t.name} x${i + 1}` })) }))}
//                 />
//             )}


//             <SubmitPrimaryInput className="mt-2" value="Reservar" />
//         </form>
//     )
// }
