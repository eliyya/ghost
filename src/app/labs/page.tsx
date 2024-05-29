import { redirect } from "next/navigation";
import { prisma } from "@/db";

export default async function LabsPage() {
    const labs = await prisma.labs.findMany({});
    console.log(labs);
    if (!labs.length) redirect("/labs/null");
    if (labs.length === 1) redirect(`/labs/${labs[0].id}`);

    return (
        <div>
            si puedes inguinarlo puedes programarlo
        </div>
    );
}
