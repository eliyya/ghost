import { COOKIE, JWT_SECRET } from "@/lib/constants";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function UserPage() {
    const cookie = cookies().delete(COOKIE.SESSION);
    redirect("/login");
    return (
        <>
            <main className="h-screen w-screen flex justify-center items-center ">
                Cerrando Sesion
            </main>
        </>
    );
}
