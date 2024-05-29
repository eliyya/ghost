import { COOKIE, JWT_SECRET } from "@/constants";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { UserForm } from "./UserForm";
import { SubmitInput } from "@/components/Input";
import { Nav } from "@/components/Nav";

export default async function UserPage() {
  const cookie = cookies().get(COOKIE.SESSION)?.value;
  console.log(cookie);
  if (!cookie) redirect("/login");
  let user: {
    id: string;
    name: string;
    username: string;
    admin: boolean;
  } | null = null;
  try {
    const payload = await jwtVerify<{
      id: string;
      name: string;
      username: string;
      admin: boolean;
      exp: number;
    }>(cookie ?? "", JWT_SECRET);
    user = payload.payload;
  } catch {
    redirect("/login");
  }
  return (
    <div className="h-screen w-screen flex flex-col">
      <Nav labs={[{id:"", name:"Usuario", active:true}]} />
      <main className="flex justify-center items-center flex-col gap-5 flex-1">
        <UserForm name={user.name} username={user.username} />
        <form
          action="/logout"
          method="get"
          className="w-72 p-4 border border-black rounded-lg flex flex-col"
        >
            <SubmitInput value="Cerrar Sesion"/>
        </form>
      </main>
    </div>
  );
}
