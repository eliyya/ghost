import { NextRequest, NextResponse } from "next/server";
import def from '@/images/default_tool.png';
import { readFile } from "fs/promises";

export async function GET(req: NextRequest, props: { params: { id: string } }) {
    const image = await readFile('./storage/tools/' + props.params.id).catch(() => readFile('./src/images/default_tool.png'))
    const response = new NextResponse(image)
    response.headers.set('Content-Type', 'image/png')
    return response;
}