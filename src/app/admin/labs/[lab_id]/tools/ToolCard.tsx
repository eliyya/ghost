import Image from "next/image";
import { Tool } from "@prisma/client";
import def from '@/images/default_tool.png';
import { ButtonPrimaryLink, ButtonSecondaryLink } from "@/components/Buttons";

export async function ToolCard(props: {tool: Tool}) {
    const image = await import(`./../../../../../../storage/tools/${props.tool.id}.png`)
        .then(d => d.default)
        .catch(() => def);
    
    return (
        <div className="rounded-sm shadow-md min-w-32 flex flex-col overflow-hidden hover:-translate-y-0.5 hover:shadow-lg transition-all">
            <Image src={image} alt={props.tool.name} width={256} height={256} />
            <div className="p-2 max-w-32 flex-1">
                <p>{props.tool.name} x{props.tool.stock}</p>
            </div>
            <div className="p-2 flex gap-2 *:flex-1">
                <ButtonPrimaryLink href={`/admin/labs/${props.tool.lab_id}/tools/${props.tool.id}/edit`}>
                    <svg className="w-5" fill="white" viewBox="0 0 24 24">
                        <path d="M 18 2 L 15.585938 4.4140625 L 19.585938 8.4140625 L 22 6 L 18 2 z M 14.076172 5.9238281 L 3 17 L 3 21 L 7 21 L 18.076172 9.9238281 L 14.076172 5.9238281 z" />
                    </svg>
                </ButtonPrimaryLink>
                <ButtonSecondaryLink  href={`/admin/labs/${props.tool.lab_id}/tools/${props.tool.id}/delete`}>
                    <svg  className="w-5" viewBox="0 0 26 26">
                        <path d="M 21.734375 19.640625 L 19.636719 21.734375 C 19.253906 22.121094 18.628906 22.121094 18.242188 21.734375 L 13 16.496094 L 7.761719 21.734375 C 7.375 22.121094 6.746094 22.121094 6.363281 21.734375 L 4.265625 19.640625 C 3.878906 19.253906 3.878906 18.628906 4.265625 18.242188 L 9.503906 13 L 4.265625 7.761719 C 3.882813 7.371094 3.882813 6.742188 4.265625 6.363281 L 6.363281 4.265625 C 6.746094 3.878906 7.375 3.878906 7.761719 4.265625 L 13 9.507813 L 18.242188 4.265625 C 18.628906 3.878906 19.257813 3.878906 19.636719 4.265625 L 21.734375 6.359375 C 22.121094 6.746094 22.121094 7.375 21.738281 7.761719 L 16.496094 13 L 21.734375 18.242188 C 22.121094 18.628906 22.121094 19.253906 21.734375 19.640625 Z" />
                    </svg>
                </ButtonSecondaryLink>
            </div>
        </div>
    )
}