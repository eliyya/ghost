import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";

export default async function Home() {
  const labs = await prisma.labs.findMany({})
  redirect('/labs/' + ( labs[0]?.id??'null' ))

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      esta pagina no debe existir
    </main>
  );
}
