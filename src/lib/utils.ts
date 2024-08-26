export function parseName(name: string, trim = true) {
    const n = trim ? name.trim() : name
    return n.replace(/ +/g, ' ').toLowerCase()
}

export const hourToTime = (date: number) => {
    const hours = Math.floor(date / 3600)
    const minutes = Math.floor((date % 3600) / 60)
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
}
