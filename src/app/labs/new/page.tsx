import { Input } from "@/components/Input";

export default async function LabsNewPage() {
    return (
        <form action=""  className="w-72 p-4 border border-black rounded-lg flex flex-col" >
            <Input
            type="text"
            name="asignatura"
            placeholder="Asignatura"
            />
            <Input
            type="text"
            name="nombre de la asigantuara"
            placeholder="Nombre de la asignatura"
            />
            <Input
            type="text"
            name="practica"
            placeholder="Practica"
            />
            <Input
            type="date"
            name="fecha"
            placeholder="Fecha"
            />
            <Input
            type="time"
            name="Entrada"
            placeholder="Entrada"
            />
            <Input
            type="time"
            name="Salida"
            placeholder="Salida"
            />

        </form>
    )
}
