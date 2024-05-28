'use client'
import { useLabsAccordeon } from '@/globals';

export interface LabsCard { }
export function LabCard(props: LabsCard) {
    const {active, setActive} = useLabsAccordeon();
    return (
        <div className="card">
            <div className="card-header">
                <h2>Laboratorio 1</h2>
                <p>Horario: 8am-8pm</p>
            </div>
            <div className="professors">
                <div className="professor">
                    <span className="professor-name text-slate-800">
                        Jorge Gilberto Guerrero Ruiz
                    </span>
                    <span className="remove-icon">❌</span>
                </div>
                <div className="professor">
                    <span className="professor-name text-slate-800">
                        Gerardo Juarez Roman
                    </span>
                    <span className="remove-icon">❌</span>
                </div>
                <div className="add-professor">
                    <span className="add-icon">➕</span>
                </div>
            </div>
        </div>
    );
}
