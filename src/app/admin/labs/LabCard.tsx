
export interface LabCardProps {
    name: string;
    open_date: Date;
    close_date: Date;
    // docentes: string[];
}
export function LabCard(props: LabCardProps) {
    return (
        <div className="card">
            <div className="card-header gap-10">
                <h2>{props.name}</h2>
                <p>Horario: {props.open_date.getUTCHours()}-{props.close_date.getUTCHours()}</p>
            </div>
            {/* <div className="professors">
                {props.docentes.map(docente => (
                    <div className="professor" key={docente}>
                        <span className="professor-name text-slate-800">{docente}</span>
                        <span className="remove-icon">❌</span>
                    </div>
                ))}
                <div className="add-professor">
                    <span className="add-icon">➕</span>
                </div>
            </div> */}
        </div>
    )
}