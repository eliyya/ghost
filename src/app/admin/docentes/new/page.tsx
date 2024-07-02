import { snowflake } from "@/lib/constants";
import { prisma } from "@/db";
import { hash } from "bcrypt";
import { Form, FormSubmitFunction } from "./Form";
import { Nav } from "@/components/Nav";

export default async function UserPage() {
  const add: FormSubmitFunction = async (props) => {
    "use server";
    // check if user exists
    const user = await prisma.users.findFirst({
      where: {
        username: props.username
      }
    })
    if (user) return { status: "error", message: "Usuario ya existe" }
    await prisma.users.create({
      data: {
        name: props.name,
        username: props.username,
        password: await hash(props.password, 10),
        id: snowflake.generate().toString(),
      }
    })
    return { status: "succes", message: "Usuario creado" }
  }
  return (
    <>
      <Nav isAdmin labs={[{ id: "", name: "Registro de Docentes", active: true }]} />
      <main className="flex flex-1 justify-center items-center ">
        <Form submit={add} />
      </main>
    </>
  );
}
