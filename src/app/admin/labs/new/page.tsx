import { prisma } from "@/lib/db";
import { Form, FormSubmitFunction } from "./Form";
import { Nav } from "@/components/Nav";
import { snowflake } from "@/lib/constants";
import { redirect } from "next/navigation";
import { verifyAdmin } from "@/lib/auth";

export default async function UserPage() {
    await verifyAdmin();

    const add: FormSubmitFunction = async (props) => {
        "use server";
        try {
            const lab = await prisma.laboratory.findUnique({
                where: {
                    name: props.name
                },
            });
            if (lab) return { status: 'error', message: 'Lab ya existe' };

            await prisma.laboratory.create({
                data: {
                    id: snowflake.generate().toString(),
                    name: props.name,
                    open_date: new Date('2024-01-01T'+props.open_date+':00.000Z'),
                    close_date: new Date('2024-01-01T'+props.close_date+':00.000Z'),
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











// import { prisma } from "@/lib/db";
// import { Form, FormSubmitFunction } from "./Form";
// import { Nav } from "@/components/Nav";
// import { snowflake } from "@/lib/constants";
// import { redirect } from "next/navigation";
// import { verifyAdmin } from "@/lib/auth";

// export default async function UserPage() {
//     await verifyAdmin()
//     const add: FormSubmitFunction = async (props) => {
//         "use server";
//         try {
//             const lab = await prisma.labs.findUnique({
//                 where: {
//                     name: props.name
//                 },
//             });
//             if (lab) return { status: 'error', message: 'Lab ya existe' };

//             await prisma.labs.create({
//                 data: {
//                     id: snowflake.generate().toString(),
//                     name: props.name,
//                     open_date: new Date(props.abre),
//                     close_date: new Date(props.ciera),
//                 },
//             });
//             return { status: 'success', message: 'Lab creado con éxito' };
//         } catch (error) {
//             console.error(error);
//             return { status: 'error', message: 'Hubo un error al crear el lab' };
//         }
//     };

//     return (
//         <>
//             <Nav isAdmin labs={[{ id: "", name: "Registro de labs", active: true }]} />
//             <main className="flex flex-1 justify-center items-center">
//                 <Form submit={add} />
//             </main>
//         </>
//     );
// }
