import { snowflake } from "@/constants";
import { prisma } from "@/db";
import { hash } from "bcrypt";
import { Form } from "./Form";

export default async function UserPage() {
  const add = async (props: {
    name: string;
    username: string;
    password: string;
  }) => {
    "use server";
    await prisma.users.create({
      data: {
        name: props.name,
        username: props.username,
        password: await hash(props.password, 10),
        id: snowflake.generate().toString(),
      }
    })
  }
  return (
    <main className="h-screen w-screen flex justify-center items-center ">
      <Form submit={add} />
    </main>
  );
}
