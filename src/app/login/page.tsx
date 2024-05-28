import Image from "next/image";
import { LoginForm } from "./client";
import { prisma } from "@/db";
import { SignJWT } from "jose";
import { JWT_SECRET } from "@/constants";

export interface SubmitProps {
    username: string;
    password: string;
};
export default function login() {
    const submit = async ({ username, password }: SubmitProps) => {
        "use server";
        const user = await prisma.users.findUnique({
            where: { username },
        });

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
            name: "session",
            value: await new SignJWT({
                id: user.id,
                name: user.name,
                username: user.username,
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
        <div className="flex justify-center items-center h-screen">
            <LoginForm submit={submit} />
            <div className="absolute">
                <Image src="/img/unnamed.jpg" alt="" width={100} height={100} />
            </div>
        </div>
    );
}
