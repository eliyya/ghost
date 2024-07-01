import Link from "next/link";
import { ReactNode } from "react";

export interface ButtonLinkProps {
    href: string,
    className?: string,
    children?: ReactNode
}
export function ButtonLink(props: ButtonLinkProps) {
    return (
        <Link
            {...props}
            className={`p-2 rounded-md cursor-pointer bg-black hover:bg-gray-900 flex align-middle justify-center ${props.className}`}>
            {props.children}
        </Link>
    );
}