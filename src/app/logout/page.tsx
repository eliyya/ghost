import { COOKIE, JWT_SECRET } from "@/lib/constants";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function UserPage() {
    cookies().delete(COOKIE.SESSION);
    redirect("/login");
}
