import { snowflake } from "@/lib/constants";
import { prisma } from "@/db";
import { Nav } from "@/components/Nav";
import { verifyAdmin } from "@/lib/auth";
import { writeFile } from "fs/promises";
import { Input, SubmitPrimaryInput } from "@/components/Input";
import { redirect } from "next/navigation";
import { mkdir } from 'node:fs/promises'
import { createCanvas, loadImage } from "canvas";
import { RetornableInput } from "@/components/EditableInput";

interface NewToolsPageProps {
  params: {
    lab_id: string
    tool_id: string
  }
}
export default async function NewToolsPage(prop: NewToolsPageProps) {
  await verifyAdmin()
  const { lab_id, tool_id } = prop.params
  const tool = await prisma.tools.findFirst({
    where: {
      id: tool_id
    }
  })
  if (!tool) return redirect(`/admin/labs/${lab_id}/tools`)

  return (
    <>
      <Nav isAdmin labs={[{ id: "", name: "Registro de Material", active: true }]} />
      <main className="flex flex-1 justify-center items-center">
        {/* <Form lab_id={lab_id} action={add} /> */}
        <form
          className="w-72 p-4 border border-black rounded-lg flex flex-col"
          action={async e => {
            "use server";
            // check if tool exist
            const name = e.get('name') as string
            const tool = await prisma.tools.findFirst({
              where: {
                name
              }
            })
            if (tool) return redirect(`/admin/labs/${lab_id}/tools/${tool.id}/more`)
            // if (['image/avif'].includes(image.type)) return redirect(`/admin/labs/${lab_id}/tools/${newTool.id}/more`)
            // save tool
            const newTool = await prisma.tools.create({
              data: {
                name,
                lab_id,
                stock: parseInt(e.get('stock') as string),
                id: snowflake.generate().toString(),
              },
            })

            if (e.get('image')) {
              const image = await injectBuffer(e.get('image') as File)
              await mkdir('./storage/tools', { recursive: true })
              const canvas = createCanvas(1024, 1024)
              const ctx = canvas.getContext('2d')
              const img = await loadImage(image.buffer)
              const size = Math.min(img.width, img.height)
              ctx.drawImage(img, (img.width - size) / 2, (img.height - size) / 2, size, size, 0, 0, 1024, 1024)
              await writeFile(`./storage/tools/${newTool.id}.png`, canvas.toBuffer())
            }
            return redirect(`/admin/labs`)
          }}
        >
          <RetornableInput
            type='text'
            placeholder='Nombre del Material'
            name="name"
            defaultValue={tool.name}
            required
          />
          <RetornableInput
            type="number"
            min={1}
            name="stock"
            defaultValue={tool.stock}
            placeholder="Cantidad"
          />
          <Input
            type="file"
            name="image"
            accept="image/png, image/jpeg, image/webp"
            required
          />
          <SubmitPrimaryInput value="Registrar"></SubmitPrimaryInput>
        </form>
      </main>
    </>
  );
}

async function injectBuffer(file: File): Promise<File & { buffer: Buffer }> {
  // @ts-ignore
  file.buffer = Buffer.from(await file.arrayBuffer())
  // @ts-ignore
  return file
}