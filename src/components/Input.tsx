import { InputHTMLAttributes } from "react";

export interface InputProps
  extends InputHTMLAttributes<HTMLInputElement> { }
export function Input(props: InputProps) {
  const bg = props.className?.match(/(bg-[^\ ])/g)?.[0]??'bg-white'  
  return (
    <div
      className={`my-3 border border-black rounded-md overflow-hidden flex bg-transparent z-10 ${bg} ${props.disabled ? 'border-opacity-50' : ''}
      ${props.className??''}
      ${props.type === 'hidden' ? 'hidden' : ''}`} >
      <input
        className={`p-2 w-full bg-transparent rounded-md peer z-10  ${props.disabled ? 'text-gray-700' : ''}`}
        {...props}
        placeholder=" "
      />
      <label className={`
          absolute transition-all ${bg} leading-3  ${props.disabled ? 'text-gray-700' : ''}
          p-0 ml-1 -translate-y-2 z-10 text-sm rounded-sm
          peer-placeholder-shown:translate-y-0 peer-placeholder-shown:p-2 peer-placeholder-shown:z-0 peer-placeholder-shown:ml-0 peer-placeholder-shown:text-base peer-placeholder-shown:rounded-md`} >
        {props.placeholder ?? props.name}
      </label>
    </div>
  );
}

export function SubmitInput(props: InputProps) {
  return (
    <input
      type="submit"
      value="Submit"
      {...props}
      className={`p-2 rounded-md cursor-pointer hover:bg-gray-900 
        ${props.disabled ? 'bg-gray-900 text-gray-400' : 'bg-black text-white'}
        ${props.className}`}
    />
  );
}
