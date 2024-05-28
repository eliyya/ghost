"use client";

import { Input } from "@/components/Input";
import { FormEventHandler } from "react";

export interface LoginFormProps {
  submit: (data: {
    username: string;
    password: string;
  }) => Promise<{ error?: string }>;
}
export function LoginForm(props: LoginFormProps) {
  const submitForm: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const r = await props.submit({
      username: formData.get("username") as string,
      password: formData.get("password") as string,
    });
    if (r.error) {
      alert(r.error);
    }
  };

  return (
    <form
      onSubmit={submitForm}
      className="w-72 p-4 border border-black rounded-lg flex flex-col"
      method="post"
    >
      <Input type="text" name="username" placeholder="usuario" />
      <Input type="text" name="password" placeholder="Contraseña" />
      <Input
        className="bg-black text-white p-2 rounded-md cursor-pointer hover:bg-gray-900"
        type="submit"
        value="Ingresar"
      />
    </form>
  );
}
