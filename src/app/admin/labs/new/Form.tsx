'use client';

import { Input, SubmitPrimaryInput } from "@/components/Input";
import React, { useState } from "react";

export type FormSubmitFunction = (props: {
    name: string;
    nameAsignatura: string;
    placticaAsignatura: string;
    fechaInicio: string;
    horaInicio: string;
    horaSalida: string;
}) => Promise<{ status: 'error' | 'success', message: string }>;

export function Form({ submit }: { submit: FormSubmitFunction }) {
    const [formData, setFormData] = useState({
        name: "",
        nameAsignatura: "",
        placticaAsignatura: "",
        fechaInicio: "",
        horaInicio: "",
        horaSalida: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data = {
            name: formData.name,
            nameAsignatura: formData.nameAsignatura,
            placticaAsignatura: formData.placticaAsignatura,
            fechaInicio: formData.fechaInicio,
            horaInicio: formData.horaInicio,
            horaSalida: formData.horaSalida,
        };
        
        if (Object.values(data).some(field => field === "")) {
            alert("Todos los campos son requeridos");
            return;
        }
        
        const response = await submit(data);
        if (response.status === 'success') {
            alert("Registro exitoso");
        } else {
            alert(`Error: ${response.message}`);
        }
    };

    return (
        <form
            className="w-72 p-4 border border-black rounded-lg flex flex-col"
            onSubmit={handleSubmit}
        >
            <Input
                type='text'
                placeholder='asignatura'
                name="name"
                value={formData.name}
                onChange={handleChange}
            />
            <Input
                type="text"
                placeholder="nombre de la asignatura"
                name="nameAsignatura"
                value={formData.nameAsignatura}
                onChange={handleChange}
            />
            <Input
                type="text"
                placeholder="practica de la asignatura"
                name="placticaAsignatura"
                value={formData.placticaAsignatura}
                onChange={handleChange}
            />
            <Input
                type="month"
                placeholder="fecha de inicio"
                name="fechaInicio"
                value={formData.fechaInicio}
                onChange={handleChange}
            />
            <Input
                type="time"
                placeholder="hora de entrada"
                name="horaInicio"
                value={formData.horaInicio}
                onChange={handleChange}
            />
            <Input
                type="time"
                placeholder="hora de salida"
                name="horaSalida"
                value={formData.horaSalida}
                onChange={handleChange}
            />
            <SubmitPrimaryInput value="Registrar" />
        </form>
    );
}
