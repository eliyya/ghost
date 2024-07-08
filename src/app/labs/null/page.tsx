import { Nav } from "@/components/Nav"
import { COOKIE, JWT_SECRET } from "@/lib/constants"
import { jwtVerify } from "jose"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { ButtonPrimaryLink } from '@/components/Buttons'

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
    
    return (
        <>
            <Nav isAdmin={user.admin} labs={[{id:'',name:'Laboratorios',active:true}]}/>
            <main className="flex gap-1 flex-1 flex-col align-middle text-center justify-center item-center">
                <h1 className="text-3xl" >Oh no...</h1>
                <p className="text-xl" >Parece que no existen laboratorios registrados en el sistema</p>
                {
                    user.admin 
                    ? <>
                        <p>Para hacer uso de este sistema debe haber al menos 1 laboratorio registrado</p>
                        <div className="flex justify-center m-3" >
                            <ButtonPrimaryLink href="/admin/labs/new" >Registrar Laboratorio</ButtonPrimaryLink>
                        </div>
                    </>
                    : <p>Porfavor pidele a un administrador que registre uno antes de volver aqui</p>
                }
            </main>
        </>
    );
}
//41403970903609344