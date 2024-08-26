import { snowflake } from '@/lib/constants'
import { prisma } from '@/lib/db'
import { Nav } from '@/components/Nav'
import { verifyAdmin } from '@/lib/auth'
import { writeFile } from 'fs/promises'
import { Input, SubmitPrimaryInput } from '@/components/Input'
import { redirect } from 'next/navigation'
import { mkdir } from 'node:fs/promises'
import { createCanvas, loadImage } from 'canvas'
import { RetornableInput } from '@/components/EditableInput'
import { ButtonSecondaryLink } from '@/components/Buttons'

interface NewToolsPageProps {
    params: {
        lab_id: string
        tool_id: string
    }
}
export default async function NewToolsPage(prop: NewToolsPageProps) {
    await verifyAdmin()
    const { lab_id, tool_id } = prop.params
    const tool = await prisma.tool.findFirst({
        where: {
            id: tool_id,
        },
    })
    if (!tool) return redirect(`/admin/labs/${lab_id}/tools`)

    return (
        <>
            <Nav
                isAdmin
                labs={[{ id: '', name: 'Registro de Material', active: true }]}
            />
            <main className="flex flex-1 justify-center items-center">
                {/* <Form lab_id={lab_id} action={add} /> */}
                <form
                    className="w-72 p-4 border border-black rounded-lg flex flex-col"
                    action={async e => {
                        'use server'
                        // check if tool exist
                        const name = e.get('name') as string
                        const tool = await prisma.tool.findFirst({
                            where: {
                                name,
                                AND: {
                                    NOT: {
                                        id: tool_id,
                                    },
                                },
                            },
                        })
                        if (tool)
                            return redirect(
                                `/admin/labs/${lab_id}/tools/${tool.id}/more`,
                            )

                        const newTool = await prisma.tool.update({
                            where: {
                                id: tool_id,
                            },
                            data: {
                                name,
                                stock: parseInt(e.get('stock') as string),
                            },
                        })

                        if (e.get('image') && (e.get('image') as File).size) {
                            const image = await injectBuffer(
                                e.get('image') as File,
                            )
                            await mkdir('./storage/tools', { recursive: true })
                            const canvas = createCanvas(1024, 1024)
                            const ctx = canvas.getContext('2d')
                            const img = await loadImage(image.buffer)
                            const size = Math.min(img.width, img.height)
                            ctx.drawImage(
                                img,
                                (img.width - size) / 2,
                                (img.height - size) / 2,
                                size,
                                size,
                                0,
                                0,
                                1024,
                                1024,
                            )
                            await writeFile(
                                `./storage/tools/${newTool.id}.png`,
                                canvas.toBuffer(),
                            )
                        }
                        return redirect(`/admin/labs/${lab_id}/tools`)
                    }}
                >
                    <RetornableInput
                        type="text"
                        placeholder="Nombre del Material"
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
                    <RetornableInput
                        type="file"
                        name="image"
                        accept="image/png, image/jpeg, image/webp"
                        defaultValue={undefined}
                    />
                    <div className="flex gap-2 flex-row *:flex-1 mt-2">
                        <ButtonSecondaryLink
                            href={`/admin/labs/${lab_id}/tools`}
                        >
                            Cancelar
                        </ButtonSecondaryLink>
                        <SubmitPrimaryInput value="Registrar"></SubmitPrimaryInput>
                    </div>
                </form>
            </main>
        </>
    )
}

async function injectBuffer(file: File): Promise<File & { buffer: Buffer }> {
    // @ts-ignore
    file.buffer = Buffer.from(await file.arrayBuffer())
    // @ts-ignore
    return file
}
