import { Input, SubmitPrimaryInput } from "@/components/Input";
import { Nav } from "@/components/Nav";
import { getVerifiedUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

interface LabsNewPageProps {
    params: {
        slug: string;
    }
    searchParams: {
        date?: string;
    }
}
export default async function LabsNewPage(props: LabsNewPageProps) {
    const labs = await prisma.labs.findMany({});
    // @ts-ignore
    console.log(labs[0]);
    
    const lab = await prisma.labs.findFirst({ where: { id: props.params.slug } });
    if (!lab) redirect('/labs');
    const user = await getVerifiedUser();
    const today = new Date();
    const searchDate = new Date(parseInt(props.searchParams.date!) || today)
    let hour = searchDate.getHours();
    if (hour < lab.open_date.getHours()) hour = lab.open_date.getHours();
    if (hour > lab.close_date.getHours()) hour = lab.close_date.getHours()-1;
    const startDate = new Date(searchDate.getFullYear(), searchDate.getMonth(), searchDate.getDate(), hour);
    const minimumDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), lab.open_date.getHours());
    return (
        <>
            <Nav labs={labs.map(l => ({ ...l, active: l.id === props.params.slug }))} isAdmin={user.admin} />
            <main className="flex flex-col flex-1 justify-center items-center">
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
                        defaultValue={`${startDate.getFullYear()}-${startDate.getMonth().toString().padStart(2,'0')}-${startDate.getDate().toString().padStart(2,'0')}T${startDate.getHours().toString().padStart(2,'0')}:00`}
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
            </main>
        </>

    )
}
