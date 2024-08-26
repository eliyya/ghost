'use client'
import { InputHTMLAttributes, useEffect, useState } from 'react'
import { useFormStatus } from 'react-dom'
// import Select from 'react-select'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    error?: string
    prefix?: string
}

export function Input(props: InputProps) {
    const id = props.id || `input-${Math.random().toString(36).substring(2)}` // Generar un id si no existe
    const bg = props.className?.match(/(bg-[^ ])/g)?.[0] ?? 'bg-white'

    return (
        <div
            className={`my-2 flex flex-col z-10 ${bg} ${
                props.disabled ? 'border-opacity-50' : ''
            } ${props.className ?? ''}`}
        >
            <input
                id={id}
                className={`p-2 w-full bg-transparent border border-black rounded-md peer z-10 
          ${props.disabled ? 'text-gray-700' : ''}
          ${props.error ? 'border-red-600' : ''}
          ${props.prefix ? 'pl-6' : ''}`}
                {...props}
                placeholder=" "
                aria-invalid={!!props.error}
                aria-describedby={props.error ? `${id}-error` : undefined}
            />
            <label
                htmlFor={id}
                className={`absolute transition-all ${bg} leading-3 
          ${
              props.disabled ? 'text-gray-700' : ''
          } p-0 ml-1 -translate-y-2 z-10 text-sm rounded-sm
          peer-placeholder-shown:translate-y-0 peer-placeholder-shown:p-2 peer-placeholder-shown:z-0
          peer-placeholder-shown:ml-0 peer-placeholder-shown:text-base peer-placeholder-shown:rounded-md
          ${props.error ? 'text-red-600' : ''}`}
            >
                {props.placeholder ?? props.name}
            </label>
            {props.prefix && (
                <span className="absolute py-2 pl-2 text-gray-700 peer-placeholder-shown:hidden">
                    {props.prefix}
                </span>
            )}
            {props.error && (
                <small
                    id={`${id}-error`}
                    className="relative transition-all ease-in-out px-2 text-red-600 text-[0.6rem]"
                >
                    {props.error}
                </small>
            )}
        </div>
    )
}

export function SubmitPrimaryInput(props: InputProps) {
    const { pending } = useFormStatus()
    return (
        <input
            disabled={pending}
            type="submit"
            value="Submit"
            {...props}
            className={`p-2 rounded-md cursor-pointer hover:bg-gray-900 transition-all
        ${props.disabled ? 'bg-gray-900 text-gray-400' : 'bg-black text-white'}
        ${props.className}`}
        />
    )
}

export function SubmitSecondaryInput(props: InputProps) {
    const { pending } = useFormStatus()
    return (
        <input
            disabled={pending}
            type="submit"
            value="Submit"
            {...props}
            className={`p-2 rounded-md cursor-pointer transition-all border-black border
        hover:bg-gray-900 hover:text-white 
        ${props.className}`}
        />
    )
}

// @ts-ignore
interface DropdownInputMultipleSelectProps
    extends InputHTMLAttributes<HTMLInputElement> {
    options: { label: string; options: { value: string; label: string }[] }[]
    onChange?: (selectedOptions: string[]) => void
}
export function DropdownInputMultipleSelect(
    props: DropdownInputMultipleSelectProps,
) {
    const [selectedOption, setSelectedOption] = useState('')
    const [selectedOptions, setSelectedOptions] = useState<string[]>([])

    useEffect(() => {
        props.onChange?.(selectedOptions)
    }, [selectedOptions, props])

    return (
        <div className="flex flex-col gap-2">
            <div className="flex  items-center gap-2">
                <select
                    className="min-w-40"
                    value={selectedOption}
                    onChange={e => setSelectedOption(e.target.value)}
                >
                    <option value="" disabled>
                        Selecciona una herramienta
                    </option>
                    {props.options
                        .flatMap(tool => tool.options)
                        .filter(
                            t =>
                                !selectedOptions
                                    .map(t => t.split('|')[0])
                                    .includes(t.value.split('|')[0]),
                        )
                        .map(tool => (
                            <option key={tool.value} value={tool.value}>
                                {tool.label}
                            </option>
                        ))}
                </select>
                <button
                    type="button"
                    onClick={() => {
                        if (
                            selectedOption &&
                            !selectedOptions.includes(selectedOption)
                        ) {
                            setSelectedOptions([
                                ...selectedOptions,
                                selectedOption,
                            ])
                            setSelectedOption('') // Resetea el valor seleccionado
                        }
                    }}
                    className="px-2 py-1 bg-blue-500 text-white rounded"
                >
                    Añadir
                </button>
            </div>

            {/* Lista de herramientas seleccionadas ay detalles soluciones en proceso */}
            {selectedOptions.length > 0 && (
                <div className="mt-4">
                    <h4 className="font-semibold mb-2">
                        Herramientas seleccionadas:
                    </h4>
                    <ul>
                        {selectedOptions.map((tool, index) => (
                            <li
                                key={index}
                                className="flex justify-between items-center mb-1"
                            >
                                {
                                    props.options
                                        .flatMap(tool => tool.options)
                                        .find(t => t.value === tool)?.label
                                }
                                <button
                                    type="button"
                                    onClick={() =>
                                        setSelectedOptions(
                                            selectedOptions.filter(
                                                t => t !== tool,
                                            ),
                                        )
                                    }
                                    className="ml-4 text-red-500"
                                >
                                    Eliminar
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}
