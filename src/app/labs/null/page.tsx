import { Nav } from "@/components/Nav"
import { COOKIE, JWT_SECRET } from "@/constants"
import { jwtVerify } from "jose"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default async function NullPage() {
    const cookie = cookies().get(COOKIE.SESSION)?.value
    if (!cookie) redirect('/login')
    let user: {
        id: string,
        name: string,
        username: string,
        admin: boolean,
    }
    try {
        const payload = await jwtVerify<{
            id: string,
            name: string,
            username: string,
            admin: boolean,
            exp: number
        }>(cookie, JWT_SECRET)
        user = payload.payload
    } catch (error) {
        throw error
    }
    if (!user.admin) redirect('/labs')
        console.log(user);
    return (
        <div className="w-screen h-screen ">
            <Nav isAdmin={user.admin}/>
            <main className="w-full flex  justify-center item-center">
            <h1>Oh no</h1>
            <p>Parece que no existen laboratorios registrados en el sistema</p>
            <p>
                Porfavor pidele a un administrador que registre uno antes de volver aqui
            </p>
            </main>
        </div>
    );
}
