import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";

export async function GET(req: NextRequest, props: { params: { id: string } }) {
    const image = await readFile(join(process.env.GHOST_APP_DATA!, 'storage', 'tools', props.params.id))
        .catch(() => readFile('./src/images/default_tool.png'))
    const response = new NextResponse(image)
    response.headers.set('Content-Type', 'image/png')
    return response;
}