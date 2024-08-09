import { Nav } from "@/components/Nav";
import { getVerifiedUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { NewProcedureAction, NewProcedureForm } from "./NewProcedureForm";
import { snowflake } from "@/lib/constants";

interface LabsNewPageProps {
    params: {
        slug: string;
    }
    searchParams: {
        date?: string;
    }
}
export default async function LabsNewPage(props: LabsNewPageProps) {
    const labs = await prisma.laboratory.findMany({});
    const lab = await prisma.laboratory.findFirst({ where: { id: props.params.slug } });
    if (!lab) redirect('/labs');
    const user = await getVerifiedUser();
    const today = new Date();
    const searchDate = new Date(parseInt(props.searchParams.date!) || today)
    const minimumDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), lab.open_date.getHours());
    
    const createProcedure: NewProcedureAction = async (data) => {
        'use server'
        const response = await prisma.procedure.create({
            data: {
                ...data,
                id: snowflake.generate().toString(),
            }
        });
        return {
            status: 'succes',
            message: 'Procedimiento creado'
        }
    } 
    
    return (
        <>
            <Nav labs={labs.map(l => ({ ...l, active: l.id === props.params.slug }))} isAdmin={user.admin} />
            <main className="flex flex-col flex-1 justify-center items-center">
                <NewProcedureForm action={createProcedure} user_id={user.id} date={searchDate} lab={lab} />
            </main>
        </>

    )
}
