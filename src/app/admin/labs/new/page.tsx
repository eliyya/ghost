import { Form } from './Form'
import { Nav } from '@/components/Nav'

export default async function UserPage() {
    return (
        <>
            <Nav
                isAdmin
                labs={[{ id: '', name: 'Registro de labs', active: true }]}
            />
            <main className="flex flex-1 justify-center items-center">
                <Form />
            </main>
        </>
    )
}
