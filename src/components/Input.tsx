'use client'
import { InputHTMLAttributes, useState } from "react";
import { useFormStatus } from "react-dom";
import Select from "react-select";

export interface InputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  error?: string
  prefix?: string
}
export function Input(props: InputProps) {
  const bg = props.className?.match(/(bg-[^\ ])/g)?.[0] ?? 'bg-white'
  return (
    <div
      className={`my-2 flex flex-col z-10 ${bg} ${props.disabled ? 'border-opacity-50' : ''}
      ${props.className ?? ''}
      ${props.type === 'hidden' ? 'hidden' : ''}`} >
      <input
        className={`p-2 w-full bg-transparent border border-black rounded-md peer z-10 
          ${props.disabled ? 'text-gray-700' : ''}
          ${props.error ? 'border-red-600' : ''}
          ${props.prefix ? 'pl-6' : ''}`}
        {...props}
        placeholder=" "
      />
      <label className={`
          absolute transition-all ${bg} leading-3  ${props.disabled ? 'text-gray-700' : ''}
          p-0 ml-1 -translate-y-2 z-10 text-sm rounded-sm
          peer-placeholder-shown:translate-y-0 peer-placeholder-shown:p-2 peer-placeholder-shown:z-0 peer-placeholder-shown:ml-0 peer-placeholder-shown:text-base peer-placeholder-shown:rounded-md
          ${props.error ? 'text-red-600' : ''}`} >
        {props.placeholder ?? props.name}
      </label>
      {props.prefix && (
        <span 
          className={`absolute py-2 pl-2 text-gray-700
          peer-placeholder-shown:hidden`} 
        >
          {props.prefix}
        </span>
      )}
      <small 
        className={`relative transition-all ease-in-out px-2 text-red-600 text-[0.6rem]
        ${props.error ? '' : 'hidden'}`} >
        {props.error ?? 'error'}
      </small>
    </div>
  );
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
  );
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
  );
}

interface DropdownInputMultipleSelectProps extends InputHTMLAttributes<HTMLInputElement> {
  options: { label: string, options: { value: string, label: string, isDisabled?: boolean }[] }[]
}
export function DropdownInputMultipleSelect(props: DropdownInputMultipleSelectProps) {
  const [options, setOptions] = useState(props.options)

  return (
      <Select 
        className="border-black" 
        isMulti 
        options={options} 
        closeMenuOnSelect={false}
        name={props.name} 
        onChange={e => {
            setOptions([...options.map(g => ({
              ...g, 
              options: g.options.map(o => ({
                  ...o, 
                  // @ts-ignore
                  isDisabled: e.map(o => o.value.replace(/\|\d*/g,'')).some(eo => eo === o.value.replace(/\|\d*/g,''))
                })) 
            }))])
        }}
        placeholder={props.placeholder ?? props.name}
        styles={{
          control: (styles) => ({
            ...styles,
            borderColor: 'black',
            borderRadius: '0.375rem',
          }),
          groupHeading: (styles, {data}) => {
            return ({
              ...styles,
              padding: '0.25rem',
              alignItems: 'center',
              display: 'flex',
              '::before': {
                content: '""',
                display: 'block',
                height: '25px',
                width: '25px',
                marginRight: '0.5rem',
                // @ts-ignore
                backgroundImage: `url(/images/tools/${data.options[0].value.replace(/\|\d*/g,'')}.png)`,
                backgroundSize: 'contain',
              }
            })
          },
        }}
      />
  );
}