import { redirect } from "next/navigation";
import { prisma } from "@/db";

export default async function Home() {
  try {
    const labs = await prisma.labs.findMany();

    if (labs.length === 0) {
      return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
          No hay laboratorios disponibles.
        </main>
      );
    }
    redirect('/labs/' + labs[0].id);
  } catch (error) {
    console.error("Error fetching labs:", error);

    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        Error al cargar los laboratorios.
      </main>
    );
  }
}









// import { redirect } from "next/navigation";
// import { prisma } from "@/db";

// export default async function Home() {
//   const labs = await prisma.labs.findMany({})
//   redirect('/labs/' + ( labs[0]?.id??'null' ))

//   return (
//     <main className="flex min-h-screen flex-col items-center justify-between p-24">
//       esta pagina no debe existir
//     </main>
//   );
// }
