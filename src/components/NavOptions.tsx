export interface NavOptionsProps {
    labs: { name: string, id: string, active?: boolean }[]
}
export function NavOptions(props: NavOptionsProps) {
    const actual = props.labs.find(l => l.active)?.name

    return (
        <select className="laboratorios" onChange={e => window.location.href = `/labs/${e.target.value}`}>
            <option disabled selected>{actual}</option>
            {props.labs.filter(l => !l.active).map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
        </select>
    )
}