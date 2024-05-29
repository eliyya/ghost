import Image from "next/image";
import Link from "next/link";

export interface NavProps {
    isAdmin?: boolean;
}
export function Nav(props: NavProps) {
    console.log(props);
    
    return (
        <div className="flex justify-between items-center align-middle w-screen px-2 py-5 bg-[#333]">
            <div className="flex gap-4 items-center">
                <div>
                    <Image src={"/logo.jpg"} alt={"IISE-Logo"} height={10} width={50} />
                </div>
                {props.isAdmin && <Link
                    className="text-white"
                    rel="stylesheet"
                    href="/admin/labs">
                    admin
                </Link>}
            </div>
            <select className="laboratorios">
                <option disabled selected>roles</option>
                <option id="boton-industrial">laboratorio insdustrial</option>
                <option>laboratorio sistemas</option>
            </select>
            <Link className="flex justify-center justify-items-center text" href={"/user"}>👤</Link>
        </div>)
}