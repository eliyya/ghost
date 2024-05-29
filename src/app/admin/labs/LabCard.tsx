
export interface LabCardProps {
    name: string;
    open_date: Date;
    close_date: Date;
}
export function LabCard(props: LabCardProps) {
    return (
        <div className="card">
            <div className="card-header">
                <h2>{props.name}</h2>
                <p>Horario: {props.open_date.getUTCHours()}-{props.close_date.getUTCHours()}</p>
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
    )
}