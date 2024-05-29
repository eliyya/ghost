import Image from "next/image";
import Link from "next/link";
import { NavOptions } from "./NavOptions";

export interface NavProps {
    isAdmin?: boolean;
    labs: {name:string,id:string,active?:boolean}[]
}
export function Nav(props: NavProps) {
    
    return (
        <div className="flex justify-between items-center align-middle w-screen px-2 py-5 bg-[#333]">
            <div className="flex gap-4 items-center">
                <Link href={"/"}>
                    <Image src={"/logo.jpg"} alt={"IISE-Logo"} height={10} width={50} />
                </Link>
                <Link href={"/"} className="text-white">Home</Link>
                {props.isAdmin && <Link
                    className="text-white"
                    href="/admin/labs">
                    Admin
                </Link>}
            </div>
            {props.labs.length === 1 && <div className="text-white">{props.labs[0].name}</div>}
            {props.labs.length > 1 && <NavOptions labs={props.labs} />}
            <Link className="flex justify-center justify-items-center text" href={"/user"}>👤</Link>
        </div>)
}