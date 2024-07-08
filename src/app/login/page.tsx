import Image from "next/image";
import { LoginForm } from "./client";
import { prisma } from "@/db";
import { SignJWT } from "jose";
import { COOKIE, JWT_SECRET } from "@/lib/constants";
import { compare } from 'bcrypt'
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Nav } from "@/components/Nav";

export interface SubmitProps {
    username: string;
    password: string;
};
export default async function login() {
    const users = await prisma.users.findMany();
    if (users.length === 0) redirect("/admin/new")
    const submit = async ({ username, password }: SubmitProps) => {
        "use server";
        const user = await prisma.users.findUnique({
            where: { username },
        });
        console.log(user);
        if (!user) {
            return {
                error: "invalid credentials",
                status: "failed",
            };
        }
        if (!(await compare(password, user.password))) {
            return {
                error: "invalid credentials",
                status: "failed",
            };
        }
        const expires = new Date();
        expires.setDate(expires.getDate() + 1);
        cookies().set({
            expires,
            name: COOKIE.SESSION,
            value: await new SignJWT({
                id: user.id,
                name: user.name,
                username: user.username,
                admin: user.admin,
                exp: expires.getTime(),
            })
                .setProtectedHeader({ alg: "HS256" })
                .setIssuedAt()
                .setExpirationTime("1d")
                .sign(JWT_SECRET),
        });
        redirect("/labs");
    };

    return (
        <main className="h-screen w-screen flex flex-col">
            <Nav labs={[{id:"", name:"Login", active:true}]} />
            <div className="flex justify-center items-center flex-1">
            <LoginForm submit={submit} />
            <div className="absolute">
                <Image src="/img/unnamed.jpg" alt="" width={100} height={100} />
            </div>
        </div>
        </main>
    );
}
