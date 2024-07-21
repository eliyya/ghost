import { snowflake } from "@/lib/constants";
import { prisma } from "@/db";
import { Form, FormSubmitFunction } from "./Form";
import { Nav } from "@/components/Nav";
import { verifyAdmin } from "@/lib/auth";

interface NewToolsPageProps {
  params: {
      lab_id: string
  }
}
export default async function NewToolsPage(prop: NewToolsPageProps) {
  await verifyAdmin()  
  const { lab_id } = prop.params

  const add: FormSubmitFunction = async (props) => {
    "use server";
    // check if tool exists
    const tool = await prisma.tools.findFirst({
      where: {
        name: props.name
      }
    })
    if (tool) return { status: "error", message: "Tool exist", data: tool.id }
    await prisma.tools.create({
      data: {
        name: props.name,
        lab_id,
        stock: props.stock,
        id: snowflake.generate().toString(),
      }
    })
    return { status: "succes", message: "Tool created" }
  }
  return (
    <>
      <Nav isAdmin labs={[{ id: "", name: "Registro de Material", active: true }]} />
      <main className="flex flex-1 justify-center items-center ">
        <Form lab_id={lab_id} action={add} />
      </main>
    </>
  );
}
