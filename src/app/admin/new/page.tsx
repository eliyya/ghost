import { NewAdminForm } from './NewAdminForm'

export default async function NewAdminPage() {
    return (
        <>
            <h1 className="text-3xl text-center py-8">
                Crea una cuenta de administrador
            </h1>
            <p className="text-xl text-center py-8">
                Para continuar con la configuracion de esta aplicacion se
                necesita crear una cuenta administrador
            </p>
            <main className="flex flex-col flex-1 justify-center items-center">
                <NewAdminForm />
            </main>
        </>
    )
}
