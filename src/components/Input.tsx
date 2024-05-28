import { DetailedHTMLProps, InputHTMLAttributes } from "react";

export interface InputProps
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {}
export function Input(props: InputProps) {
  return (
    <input
      className={`mb-2 p-2 border border-black rounded-md ${props.className}`}
      {...props}
    />
  );
}

export function SubmitInput(props: InputProps) {
  return (
    <input
      type="submit"
      className={`bg-black text-white p-2 rounded-md cursor-pointer hover:bg-gray-900 ${props.className}`}
      value="Submit"
      {...props}
    />
  );
}
