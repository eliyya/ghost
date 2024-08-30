export function parseName(name: string, trim = true) {
    const n = trim ? name.trim() : name
    return n.replace(/ +/g, ' ').toLowerCase()
}

export function secondsToHHMM(seconds: number) {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)

    const formattedHours = String(hours).padStart(2, '0')
    const formattedMinutes = String(minutes).padStart(2, '0')

    return `${formattedHours}:${formattedMinutes}`
}

export function hhmmToSeconds(time: string): number {
    const [hours, minutes] = time.split(':').map(Number)

    const totalSeconds = hours * 3600 + minutes * 60

    return totalSeconds
}

export function wrapper<T>(fn: () => T): [unknown, undefined] | [undefined, T] {
    try {
        return [, fn()]
    } catch (error) {
        return [error, undefined]
    }
}

export function formatDateToInputFormat(date: Date): string {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')

    return `${year}-${month}-${day}T${hours}:${minutes}`
}
