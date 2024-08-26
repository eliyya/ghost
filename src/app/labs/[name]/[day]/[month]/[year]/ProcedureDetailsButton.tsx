'use client'

import { Prisma } from '@prisma/client'
import { useRef } from 'react'

export function ProcedureDetailsButton(props: {
    procedure: Prisma.ProcedureGetPayload<{
        include: {
            UsedTool: {
                select: {
                    quantity: true
                    tool: true
                }
            }
            submiter: {
                select: {
                    name: true
                    id: true
                    username: true
                    admin: true
                }
            }
        }
    }>
}) {
    const dialogRef = useRef<HTMLDialogElement>(null)
    return (
        <>
            <button
                onClick={() => dialogRef.current?.showModal()}
                className="px-2 py-1 row-span-3 border border-black text-center"
                style={{
                    gridRow: `span ${props.procedure.end_date.getHours() - props.procedure.start_date.getHours()} / span ${props.procedure.end_date.getHours() - props.procedure.start_date.getHours()}`,
                }}
            >
                {props.procedure.practice_name}
            </button>
            <dialog
                // onClick={() => dialogRef.current?.close()}
                ref={dialogRef}
                onBlur={() => dialogRef.current?.close()}
                className="backdrop:backdrop-blur-sm"
            >
                <div
                    onClick={e => e.stopPropagation()}
                    className="border border-black py-2 grid grid-cols-2 *:px-2"
                >
                    <span className="text-right">Practica:</span>
                    <p>{props.procedure.practice_name}</p>
                    <span className="text-right bg-gray-300">Doente:</span>
                    <p className="bg-gray-300">
                        {props.procedure.submiter.name}
                    </p>
                    <span className="text-right">Materia:</span>
                    <p className="">{props.procedure.subject}</p>
                    <span className="text-right bg-gray-300">Fecha:</span>
                    <p className="bg-gray-300">
                        {props.procedure.start_date.toLocaleDateString('es', {
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                    </p>
                    <span className="text-right">Duración:</span>
                    <p>
                        {props.procedure.end_date.getHours() -
                            props.procedure.start_date.getHours()}{' '}
                        horas
                    </p>
                    {props.procedure.UsedTool.length ?
                        <div className="col-span-2">
                            {props.procedure.UsedTool.map(t => (
                                <article key={t.tool.id}>
                                    <p className="">
                                        {t.tool.name} x{t.quantity}
                                    </p>
                                </article>
                            ))}
                        </div>
                    :   null}
                </div>
            </dialog>
        </>
    )
}
