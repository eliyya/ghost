import { prisma } from "@/db";
import { Form, FormSubmitFunction } from "./Form";
import { Nav } from "@/components/Nav";
import { snowflake } from "@/lib/constants";
import { redirect } from "next/navigation";
import { verifyAdmin } from "@/lib/auth";

export default async function UserPage() {
    await verifyAdmin()
    const add: FormSubmitFunction = async (props) => {
        "use server";
        try {
            const lab = await prisma.labs.findUnique({
                where: {
                    name: props.nameAsignatura,
                },
            });
            if (lab) return { status: 'error', message: 'Lab ya existe' };

            await prisma.labs.create({
                data: {
                    id: snowflake.generate().toString(),
                    name: props.nameAsignatura,
                    open_date: new Date(props.fechaInicio),
                    close_date: new Date(),
                },
            });
            return { status: 'success', message: 'Lab creado con éxito' };
        } catch (error) {
            console.error(error);
            return { status: 'error', message: 'Hubo un error al crear el lab' };
        }
    };

    return (
        <>
            <Nav isAdmin labs={[{ id: "", name: "Registro de labs", active: true }]} />
            <main className="flex flex-1 justify-center items-center">
                <Form submit={add} />
            </main>
        </>
    );
}
