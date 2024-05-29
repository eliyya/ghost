import { Input, SubmitInput } from "@/components/Input";

export interface UserFormProps {
    name: string;
    username: string;
}
export function UserForm(props: UserFormProps) {

    return (
        <form
          className="w-72 p-4 border border-black rounded-lg flex flex-col"
        >
            <Input type='text' name="n-name" placeholder='Nombre del Docente' value={props.name}></Input>
            <Input type='hidden' name="name" value={props.name}></Input>
            <Input type="text" placeholder="usuario clave" name="n-username" value={props.username}></Input>
            <Input type="hidden" name="n-username" value={props.username}></Input>
            <Input type='password' placeholder="nueva constraseña"></Input>
            <Input type='password' placeholder="confirmar contraseña"></Input>
            <SubmitInput value="Registrar"></SubmitInput>
        </form>
    )
}