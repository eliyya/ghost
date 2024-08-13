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
    const lab = await prisma.laboratory.findFirst({ 
        where: { 
            id: props.params.slug 
        },
        include: {
            tools: true
        }
    });
    if (!lab) redirect('/labs');
    const user = await getVerifiedUser();
    const today = new Date();
    const searchDate = new Date(parseInt(props.searchParams.date!) || today)
    const minimumDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), lab.open_date.getHours());
    
    const createProcedure: NewProcedureAction = async (data) => {
        'use server'
        console.log(data.tools);
        
        const response = await prisma.procedure.create({
            data: {
                end_date: data.end_date,
                lab_id: data.lab_id,
                practice_name: data.practice_name,
                start_date: data.start_date,
                students: data.students,
                subject: data.subject,
                submiter_id: data.submiter_id,
                tools: data.tools.length ? {
                    connect: [
                        ...data.tools
                    ]
                } : undefined,
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
                <NewProcedureForm 
                    action={createProcedure} 
                    user_id={user.id} 
                    date={searchDate} 
                    open_date={lab.open_date} 
                    close_date={lab.close_date} 
                    tools={lab.tools}
                    lab_id={lab.id}
                />
            </main>
        </>

    )
}
