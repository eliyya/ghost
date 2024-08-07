import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { NewAdminForm, NewAdminFormSubmitFunction } from "./NewAdminForm";
import { snowflake } from "@/lib/constants";
import { hash } from "bcrypt";

export default async function NewAdminPage() {
    const users = await prisma.users.findMany();
    if (users.length) redirect("/admin")
    
        const add: NewAdminFormSubmitFunction = async (props) => {
            "use server";
            await prisma.users.create({
              data: {
                name: props.name,
                username: props.username,
                password: await hash(props.password, 10),
                id: snowflake.generate().toString(),
                admin: true
              }
            })
            return { status: "succes", message: "Usuario creado" }
          }
    
    return (
        <>
            <h1 className="text-3xl text-center py-8">Crea una cuenta de administrador</h1>
            <main className="flex flex-col flex-1 justify-center items-center">
                <NewAdminForm submit={add} />
            </main>
        </>
    )
}