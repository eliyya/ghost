'use client'
import { InputHTMLAttributes, useState } from 'react'

export interface EditableInputProps
    extends InputHTMLAttributes<HTMLInputElement> {
    error?: string
    prefix?: string
}
export function RetornableInput(props: EditableInputProps) {
    const defaultValue = props.defaultValue ?? ''
    const bg = props.className?.match(/(bg-[^\ ])/g)?.[0] ?? 'bg-white'
    const [value, setValue] = useState<typeof props.defaultValue>(defaultValue)
    const [isChanged, setIsChanged] = useState<boolean>(false)

    return (
        <div
            className={`my-2 flex flex-col z-10 ${bg} ${props.disabled ? 'border-opacity-50' : ''}
                ${props.className ?? ''}
                ${props.type === 'hidden' ? 'hidden' : ''}
            `}
        >
            <div className="flex">
                <input
                    onSubmit={e => {}}
                    value={value}
                    onChange={e => {
                        setValue(e.target.value)
                        if (e.target.value !== defaultValue) setIsChanged(true)
                    }}
                    className={`p-2 w-full bg-transparent border border-black rounded-md peer z-10 rounded-tr-none rounded-br-none
                        focus:outline-none
                        ${isChanged ? 'border-green-600' : ''}
                        ${props.disabled ? 'text-gray-700' : ''}
                        ${props.error ? 'border-red-600' : ''}
                        ${props.prefix ? 'pl-6' : ''}
                    `}
                    {...props}
                    placeholder=" "
                />
                <button
                    type="button"
                    onClick={e => {
                        setValue(defaultValue)
                        setIsChanged(false)
                    }}
                    className={`p-2 aspect-square w-9 border border-black border-l-0 rounded-md rounded-tl-none rounded-bl-none transition-all
                        hover:bg-gray-200
                        ${isChanged ? 'border-green-600' : ''}
                    `}
                >
                    <svg viewBox="0 0 48 48">
                        <path d="M10,22v2c0,7.72,6.28,14,14,14s14-6.28,14-14s-6.28-14-14-14h-6.662l3.474-4.298l-3.11-2.515L10.577,12l7.125,8.813 l3.11-2.515L17.338,14H24c5.514,0,10,4.486,10,10s-4.486,10-10,10s-10-4.486-10-10v-2H10z" />
                    </svg>
                </button>
            </div>
            <label
                className={`
                absolute transition-all ${bg} leading-3  ${props.disabled ? 'text-gray-700' : ''}
                p-0 ml-1 -translate-y-2 z-10 text-sm rounded-sm
                peer-placeholder-shown:translate-y-0 peer-placeholder-shown:p-2 peer-placeholder-shown:z-0 peer-placeholder-shown:ml-0 peer-placeholder-shown:text-base peer-placeholder-shown:rounded-md
                ${props.error ? 'text-red-600' : ''}
            `}
            >
                {props.placeholder ?? props.name}
            </label>
            <span
                className={`absolute py-2 pl-2 text-gray-700
                    peer-placeholder-shown:hidden
                `}
            >
                {props.prefix}
            </span>
            <small
                className={`relative transition-all text-left ease-in-out px-2 text-red-600 text-[0.6rem]
                    ${props.error ? '' : 'hidden'}
                `}
            >
                {props.error ?? 'error'}
            </small>
        </div>
    )
}
