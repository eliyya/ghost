import { Input, SubmitInput } from "@/components/Input";

export default async function UserPage() {
  return (
    <>
      <main className="h-screen w-screen flex justify-center items-center ">
        <form
          className="w-72 p-4 border border-black rounded-lg flex flex-col"
          method="post"
        >
        <Input type='text' placeholder='Nombre del Docente'></Input>
        <Input type="text" placeholder="usuario clave"></Input>
        <Input type='password' placeholder="constraseña"></Input>
        <Input type='password' placeholder="confirmar contraseña"></Input>
        <SubmitInput value="Registrar"></SubmitInput>
        </form>
      </main>
    </>
  );
}
