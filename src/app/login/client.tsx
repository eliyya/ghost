'use client'

import { login } from '@/actions/login'
import { Input } from '@/components/Input'

export function LoginForm() {
    return (
        <form
            action={async formData => {
                const r = await login({
                    username: formData.get('username') as string,
                    password: formData.get('password') as string,
                })
                if (r?.error) {
                    alert(r.error)
                }
            }}
            className="w-72 p-4 border border-black rounded-lg flex flex-col"
            method="post"
        >
            <Input type="text" name="username" placeholder="usuario" />
            <Input type="password" name="password" placeholder="Contraseña" />
            <Input
                className="bg-black text-white p-2 rounded-md cursor-pointer hover:bg-gray-900"
                type="submit"
                value="Ingresar"
            />
        </form>
    )
}
