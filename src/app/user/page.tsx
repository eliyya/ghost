import { Input, SubmitPrimaryInput } from '@/components/Input'
import { Nav } from '@/components/Nav'
import { userSubmit, logoutUser } from '@/actions/userActions' // Importar las acciones del servidor

export default function UserForm({ user }: { user: any }) {
    return (
        <div className="h-screen w-screen flex flex-col">
            <Nav labs={[{ id: '', name: 'Usuario', active: true }]} />
            <main className="flex justify-center items-center flex-col gap-5 flex-1">
                <form
                    action={userSubmit}
                    className="w-72 p-4 border border-black rounded-lg flex flex-col"
                >
                    <Input
                        type="text"
                        name="n-name"
                        placeholder="Nombre del Docente"
                        defaultValue={user.name}
                        disabled
                    />
                    <Input type="hidden" name="name" value={user.name} />
                    <Input
                        type="text"
                        placeholder="Usuario Clave"
                        name="n-username"
                        defaultValue={user.username}
                        disabled
                    />
                    <Input
                        type="hidden"
                        name="username"
                        value={user.username}
                    />
                    <SubmitPrimaryInput value="Actualizar" disabled />
                </form>

                <form
                    action={logoutUser}
                    method="get"
                    className="w-72 p-4 border border-black rounded-lg flex flex-col"
                >
                    <SubmitPrimaryInput value="Cerrar Sesion" />
                </form>
            </main>
        </div>
    )
}
