'use client';

import { Input, SubmitPrimaryInput } from "@/components/Input";
import { useState } from "react";

export type FormSubmitFunction = (props: {
    name: string;
    open_date: string;
    close_date: string;
}) => Promise<{ status: 'error' | 'success', message: string }>;

export function Form({ submit }: { submit: FormSubmitFunction }) {
    const [formData, setFormData] = useState({
        name: "",
        open_date: "",
        close_date: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const response = await submit(formData);
        if (response.status === 'error') {
            alert(response.message);
        } else {
            alert(response.message);
            window.location.href = "/admin/labs";
        }
    };

    return (
        <form
            className="w-72 p-4 border border-black rounded-lg flex flex-col"
            onSubmit={handleSubmit}
        >
            <Input
                type='text'
                placeholder='Nombre del laboratorio'
                name="name"
                value={formData.name}
                onChange={handleChange}
            />
            <Input
                type="date"
                placeholder="Fecha de apertura"
                name="open_date"
                value={formData.open_date}
                onChange={handleChange}
            />
            <Input
                type="date"
                placeholder="Fecha de cierre"
                name="close_date"
                value={formData.close_date}
                onChange={handleChange}
            />
            <SubmitPrimaryInput value="Registrar" />
        </form>
    );
}
