import './estilos.css'

export default async function AdminLabsPage() {
    return (
        <>
            {/* <Head>
                <title>Laboratorios y Docentes</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Head> */}
            <div className="container">
                <div className="header">
                    <div className={"tab active"}>
                        <p>
                            Laboratorios
                        </p>
                    </div>
                    <div className={`tab`}>
                        <p>
                            Docentes
                        </p>
                    </div>
                </div>
                <div className="content">
                    <div className="card">
                        <div className="card-header">
                            <h2>Laboratorio 1</h2>
                            <p>Horario: 8am-8pm</p>
                        </div>
                        <div className="professors">
                            <div className="professor">
                                <span className="professor-name text-slate-800">Jorge Gilberto Guerrero Ruiz</span>
                                <span className="remove-icon">❌</span>
                            </div>
                            <div className="professor">
                                <span className="professor-name text-slate-800">Gerardo Juarez Roman</span>
                                <span className="remove-icon">❌</span>
                            </div>
                            <div className="add-professor">
                                <span className="add-icon">➕</span>
                            </div>
                        </div>
                    </div>
                    <div className="card">
                        <div className="card-header">
                            <h2>Laboratorio 2</h2>
                            <p>Horario: 8am-8pm</p>
                        </div>
                    </div>
                    <div className="card">
                        <div className="card-header">
                            <h2>Laboratorio 3</h2>
                            <p>Horario: 8am-8pm</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}