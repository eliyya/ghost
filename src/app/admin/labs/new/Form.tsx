'use client';

import { Input, SubmitPrimaryInput } from "@/components/Input";
import  { useState } from "react";


export function Form() {
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

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data = {
            name: formData.name,
            nameAsignatura: formData.nameAsignatura,
            placticaAsignatura: formData.placticaAsignatura,
            fechaInicio: formData.fechaInicio,
            horaInicio: formData.horaInicio,
            horaSalida: formData.horaSalida,
        };
        if (data.name === "" || data.nameAsignatura === "" || data.placticaAsignatura === "" || data.fechaInicio === "" || data.horaInicio === "" || data.horaSalida === "") {
            alert("Todos los campos son requeridos");
        } else {
            console.log(data);
        }
    };
    console.log(submit);
    return (
        <form
            className="w-72 p-4 border border-black rounded-lg flex flex-col"
            onSubmit={submit}
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
