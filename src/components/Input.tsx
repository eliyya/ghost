import { ChangeEventHandler, InputHTMLAttributes } from "react";

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
      {props.error && (
        <small className="px-2 text-red-600" >
          {props.error}
        </small>
      )}
    </div>
  );
}

export function SubmitPrimaryInput(props: InputProps) {
  return (
    <input
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
  return (
    <input
      type="submit"
      value="Submit"
      {...props}
      className={`p-2 rounded-md cursor-pointer transition-all border-black border
        hover:bg-gray-900 hover:text-white 
        ${/*props.disabled ? 'bg-gray-900 text-gray-400' : 'bg-black text-white'*/''}
        ${props.className}`}
    />
  );
}