import Image from "next/image";
import Link from "next/link";
import { NavOptions } from "./NavOptions";
import { prisma } from "@/db";

export interface NavProps {
    isAdmin?: boolean;
    labs: {name:string,id:string,active?:boolean}[]
}
export async function Nav(props: NavProps) {
    const labs = await prisma.labs.findMany({})
    
    return (
        <nav className="flex justify-between items-center align-middle w-full px-2 py-5 bg-[#333]">
            <div className="flex gap-4 flex-1 items-center">
                <Link href={"/"}>
                    <Image src={"/logo.jpg"} alt={"IISE-Logo"} height={10} width={50} />
                </Link>
                <Link href={"/"} className="text-white">Home</Link>
                {props.isAdmin && <Link
                    className="text-white"
                    href={labs.length > 1 ? '/admin/labs' : '/admin/docentes'}>
                    Admin
                </Link>}
            </div>
            {props.labs.length === 1 && <div className="text-white">{props.labs[0].name}</div>}
            {props.labs.length > 1 && <NavOptions labs={props.labs} />}
            <Link className="flex flex-1 justify-end justify-items-center text" href={"/user"}>👤</Link>
        </nav>)
}