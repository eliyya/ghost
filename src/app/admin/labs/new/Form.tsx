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
    const [errorName, setErrorName] = useState<string>('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!formData.name || !formData.open_date || !formData.close_date) return alert("Porfavor llena todos los campos");
        if (formData.open_date >= formData.close_date) return alert("La hora de cierre debe ser mayor a la de apertura");
        const response = await submit(formData);
        if (response.status === 'error') {
            if (response.message.includes("Lab ya existe")) setErrorName("Lab ya existe");
            alert(response.message);
        } else window.location.href = "/admin/labs";
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
                onChange={e => {
                    handleChange(e);
                    setErrorName('');
                }}
                required
                error={errorName}
            />
            <Input
                type="time"
                placeholder="Hora de apertura"
                name="open_date"
                value={formData.open_date}
                onChange={handleChange}
                required
            />
            <Input
                type="time"
                placeholder="Hora de cierre"
                name="close_date"
                value={formData.close_date}
                onChange={handleChange}
                min={formData.open_date||"00:00"}
                required
            />
            <SubmitPrimaryInput value="Registrar" />
        </form>
    );
}
